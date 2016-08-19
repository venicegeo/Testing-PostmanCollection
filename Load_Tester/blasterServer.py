
# Copyright 2016, RadiantBlue Technologies, Inc.

# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at

#   http://www.apache.org/licenses/LICENSE-2.0

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


from http.server import BaseHTTPRequestHandler, HTTPServer
from siteBlasting import *
import json
import multiprocessing
import queue
import collections

# Class factory to add Queue
def createHandlerWithQueue(configQueue, configLockout, suiteLockout, sharedDict):

	class S(BaseHTTPRequestHandler):
		# getSwitch and postSwitch are defined after the methods are defined.

		def do_GET(self):
			action = self.getSwitch.get(self.path)
			if action:
				action(self)
			else:
				rsp = resp()
				rsp.appendCode(404)
				self.sendJSONResponse(rsp)

		def do_POST(self):
			rsp = resp()
			action = self.postSwitch.get(self.path)
			if action:
				action(self)
			else:
				rsp = resp()
				rsp.appendCode(404)
				self.sendJSONResponse(rsp)

		def hello(self):
			self.wfile.write('Hello, are you ready to load test?'.encode('utf8'))
			self.send_response(200)

		# Return a list of pending load tests.
		def getConfigs(self):
			rsp = resp()
			rsp['pending'] = []
			try:
				with NoBlock(configLockout) as locked:
					if locked:
						rsp['pending'] = cloneQueue(configQueue)
			except Exception as e:
				rsp.appendCode(500, 'Encountered an error cloning queue into a list.', e)
			else:
				try:
					rsp['current'] = sharedDict.get('current')
				except Exception as e:
					rsp.appendCode(500, 'Encountered an error getting the current config in process.', e)
				else:
					rsp.appendCode(200)
			self.sendJSONResponse(rsp)

		# Add a load test config to the queue.
		def postConfigs(self):
			rsp = resp()
			config = self.getJSON(rsp)
			if config:
				try:
					configQueue.put(config)
				except Exception as e:
					rsp.appendCode(500, 'Encountered an error adding the configuration to the queue.', e)
				else:
					rsp['message'] = 'Added configuration to load testing queue.'
					rsp.appendCode(200)
			self.sendJSONResponse(rsp)

		# Add a suite of load test config to the queue.
		def postSuite(self):
			rsp = resp()
			config = self.getJSON(rsp)
			if config:
				with suiteLockout:
					# Make sure that multiple suite requests overlap.  The purpose of a suite is that the provided tests are run in order.
					for (i, config) in enumerate(configs):
						try:
							config['step'] = i
							config['total_steps'] = len(configs)
						except Exception as e:
							rsp.appendCode(500, 'Encountered an error adding suite info to config object.', e)
							break
						try:
							configQueue.put(config)
						except Exception as e:
							rsp.appendCode(500, 'Encountered an error adding config (# %s) to the queue.' % (i + 1,), e)
							break
					else:
						rsp['message'] = 'Added suite to load testing queue.'
						rsp.appendCode(200)
			self.sendJSONResponse(rsp)

		# Add a config to the list of requests to run in Parallel
		def postParallel(self):
			rsp = resp()
			config = self.getJSON(rsp)
			if config:
				try:
					self.parallelConfigs += [config]
				except Exception as e:
					rsp.appendCode(500, 'Encountered an error adding config to parallel list.', e)
				else:
					rsp['message'] = 'Added suite to load testing queue.'
					rsp.appendCode(200)
			self.sendJSONResponse(rsp)

		# Return the list of requests to be run in parallel.
		def getParallel(self):
			rsp = resp()
			try:
				rsp['parallel'] = self.parallelConfigs
			except Exception as e:
				rsp.appendCode(500, 'Encountered an error cloning queue into a list.', e)
			else:
				rsp.appendCode(200)
			self.sendJSONResponse(rsp)

		parallelConfigs = []

		getSwitch = {
			'/': hello,
			'/configs': getConfigs,
			'/parallel': getParallel
		}
		postSwitch = {
			'/configs': postConfigs,
			'/suite': postSuite,
			'/parallel': postParallel
		}

		# Returns the JSON from the request, and alters the response as necessary
		def getJSON(self, rsp):
			try:
				length = int(self.headers['content-length'])
				rdata = self.rfile.read(length).decode('utf-8')
				data = json.loads(rdata)
				return data
			except json.decoder.JSONDecodeError as e:
				rsp.appendCode(400, 'Unable to resolve request body as a JSON object.', e)
				return False
			except Exception as e:
				rsp.appendCode(500, 'Encountered an error reading JSON.', e)
				return False
				

		# Calls the methods needed to send a json response.  expects 'code' to be in rsp.
		def sendJSONResponse(self, rsp):
			self.send_response(rsp['code'])
			self.send_header('Content-type', 'application/json')
			self.end_headers()
			self.wfile.write(json.dumps(rsp).encode('utf8'))

	return S

# Subclassing dict to add standard formatting to error messages.
# Using OrderedDict for more readable response.
class resp(collections.OrderedDict):

	# Create a new error field, or append to the old one.
	def appendMessage(self, error):
		if self.get('error') == None:
			self['error'] = error
		else:
			self['error'] += '\r\n' + error

	# Add error information.  If there was already an error, append the code and
	# message to the previous error's message.
	def appendCode(self, code, errMsg = None, e = None):
		if self.get('code') == None:
			self['code'] = code
			self.appendMessage(errMsg)
			self['details'] = repr(e)
		else:
			self.appendMessage('Could not add code, %s: %s (%s)' % (code, errMsg, e))

# Take the configuration dict to start the load test.  Blocks until complete.
# See siteBlasting.py for how the load tester works.
def runLoadTest(config):
	(activeQueue, resultQueue) = createSharedQueues()
	c = startController(activeQueue, resultQueue, config)
	c.join()

# Start the server and the load test runner.
def run(server_class = HTTPServer, port = 80):
	# Create shared variables.
	configQueue = multiprocessing.Queue()
	configLockout = multiprocessing.RLock()
	suiteLockout = multiprocessing.RLock()
	sharedDict = multiprocessing.Manager().dict()
	# Start the load test runner.
	pRunner = multiprocessing.Process(
		target = runner,
		args = (configQueue, configLockout, sharedDict)
	)
	pRunner.start()
	# Start the server.
	server_address = ('', port)
	httpd = server_class(server_address, createHandlerWithQueue(configQueue, configLockout, suiteLockout, sharedDict))
	print('Starting httpd...')
	httpd.serve_forever()

# calls "runLoadTest" with the next configuration in the queue.  Blocks when it waits for a released lock
# (the queue is being copied) or if there are no configs in the queue.
def runner(configQueue, configLockout, sharedDict):
	while True:
		with configLockout:
			sharedDict['current'] = config = configQueue.get()
		if config.get('end'): break
		runLoadTest(config)
		sharedDict['current'] = None

# Puts all items from a queue into a list.  The queue is emptied/refilled during this process.
# It is reccomended to wrap this function in a lock.
def cloneQueue(configQueue):
	qList = []
	while True:
		try:
			qList += [configQueue.get(block = False)]
		except queue.Empty:
			break
	for item in qList:
		configQueue.put(item)
	return qList

# Class wrapping a lock to allow use in a with statement.
class NoBlock():
	def __init__(self, lock):
		self.lock = lock

	def __enter__(self):
		self.isLocked = self.lock.acquire(block = False)
		return self.isLocked

	def __exit__(self, exception_type, exception_value, traceback):
		if self.isLocked:
			self.lock.release()

if __name__ == "__main__":
	from sys import argv
	

	if len(argv) == 2:
		run(port=int(argv[1]))
	else:
		run()