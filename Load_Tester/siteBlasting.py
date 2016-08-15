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

import multiprocessing
import time
import requests
import sys
import csv
import psutil
import json
import queue

# Function to pass to new process.  Records elapsed time to the processes Array.  If a bad
# status is returned, it is recorded in the status variable to be processed by the logger.
def sendRequest(activeQueue, resultQueue, config):
	# add {'file': ('filename', file-like object)} if a file path is given.
	file = config.get('file')
	if file:
		fileTuple = {'file': (config.get('file'), open(file, 'rb'))}
	else:
		fileTuple = None
	method = config.get('method')
	url = config.get('url')
	headers = config.get('headers')
	payload = config.get('payload')
	try:
		# Send the request and get a response.
		r = requests.request(method, url, headers = headers, files = fileTuple, data = payload)
	except Exception as e:
		# Log any exceptions, as you would normal results.
		status_code = 0
		status_text = str(e)
		response_time = 0
	else:
		status_code = r.status_code
		status_text = r.reason + r.text[:250]
		response_time = r.elapsed.total_seconds()
	finally:
		# Remove an item from the activeQueue:
		# This tells the controller that another process should be started.
		activeQueue.get()
		finishTime = time.time()
		active = activeQueue.qsize()
		resultQueue.put((finishTime, status_code, status_text, response_time, active))

# Logs information about the running processes.  Will add processes if not enough are running.
def controller(activeQueue, resultQueue, config):
	# Create first row of output csv, if "step" is "None" (a single test) or 0 (first test of a suite).
	if config.get('step'):
		newResults = []
	else:
		newResults = [('Time Completed', 'Step', 'Total Steps', 'Status Code', 'Status Message', 'Response Time', 'Active Requests')]
	if config.get('total_steps'):
		steps = (config['step'] + 1, config['total_steps'])
	else:
		steps = (1, 1)
	# Initialize variables.
	headerJson = {}
	dataJson = {}

	results = []
	complete = 0
	next_percentage = 0
	startTime = time.time()
	# Get variables from "config".
	simul_num = config.get('simul_num')
	total_num = config.get('total_num')
	save_filename = config.get('save_filename')
	payload = config.get('payload')
	headers = config.get('headers')
	# Alter "config" to pass to non-controller processes.
	config['payload'] = getData(payload)
	config['headers'] = getData(headers)
	config['num'] = simul_num
	# Create/start the loadtest processes.
	processes = createProcesses(activeQueue, resultQueue, config)
	startProcesses(processes)
	# Continue until the target number of requests been reached.
	while complete < total_num:
		active = activeQueue.qsize()
		started = len(processes)
		if (active < simul_num) & (started < total_num):
			# If there are less active processes than the specified simul_num (and total_num has not yet been reached),
			# add/start more processes to reach either simul_num or total_num.
			config['num'] = min(simul_num - active, total_num - started)
			processes += createProcesses(activeQueue, resultQueue, config)
			startProcesses(processes[started:])
		try:
			# Wait here until a process has received a response.
			results += [resultQueue.get(timeout = 300)]
		except queue.Empty:
			# If no response received in 5 minutes, end the test.
			break
		else:
			# Count the process.
			complete += 1
			percentage = 100*complete/total_num
		if percentage >= next_percentage:
			# Log every 1%.
			next_percentage += 1
			# Make the first column elapsed time.
			for result in results:
				newResults += [(result[0] - startTime,) + steps + result[1:]]
			# Append results to csv.
			with open('results\\' + save_filename, 'a') as test_file:
				file_writer = csv.writer(test_file, lineterminator = '\n')
				for line in newResults:
					file_writer.writerow(line)
			print('%3.0f%% Complete ... Log Written.' % percentage)
			results = []
			newResults = []

# Returns a list of processes that call sendGetRequest().
def createProcesses(activeQueue, resultQueue, config):
	num = config.get('num')
	# Count the new processes.
	for i in range(num):
		activeQueue.put(1)
	# Create the new processes.
	return [
		multiprocessing.Process(
			target = sendRequest,
			args = (activeQueue, resultQueue, config)
		) for i in range(0, num)
	]

# Start all processes in the supplied list.
def startProcesses(processes):
	cpus = list(range(psutil.cpu_count()))
	for p in processes:
		p.start()
		# CPU 0 is reserved for the controller.
		psutil.Process(p.pid).cpu_affinity(cpus[1:])

# Starts the loggin and controller process.
def startController(activeQueue, resultQueue, config):
	pController = multiprocessing.Process(
		target = controller,
		args = (activeQueue, resultQueue, config)
	)
	pController.start()
	# CPU 0 is reserved for the controller.
	psutil.Process(pController.pid).cpu_affinity([0])
	return pController

# Return a queue object to share information between the blasters and the logger.
def createSharedQueues():
	return (multiprocessing.Queue(), multiprocessing.Queue())

# Return the command line argument after the specified tag.
def getTagValue(tag):
	for (i, ele) in enumerate(sys.argv):
		if tag == ele:
			val = sys.argv[i + 1]
			if val[0] == val[-1] == "'":
				val = val[1:-1]
			return val
	else: return ''

# Return data based on data type.  Expects {'dataType': '?', 'data': '?'} format.
def getData(inputData):
	if inputData == None:
		return None
	dataType = inputData['dataType']
	if dataType in {'string', 'json', 'number'}:
		return inputData['data']
	elif dataType == 'stringified json':
		return json.dumps(inputData['data'])
	elif dataType == 'data-wrapped json':
		dataWrapped = {}
		dataWrapped['data'] = json.dumps(inputData['data'])
		return dataWrapped
	elif dataType == 'json file':
		with open(inputData['data']) as data_file:    
			return json.load(data_file)
	elif dataType == 'file':
		with open(inputData['data']) as data_file:    
			return data_file.read()
	else:
		raise TypeError('Type %s is not an option.' % dataType)