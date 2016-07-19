from http.server import BaseHTTPRequestHandler, HTTPServer
from siteBlasting import *
import json
import multiprocessing

# Class factory to add Queue
def createHandlerWithQueue(configQueue):

	class S(BaseHTTPRequestHandler):

		def __init__(self, *args, **kwargs):
			super(S, self).__init__(*args, **kwargs)

		def _set_headers(self):
			self.send_response(200)
			self.send_header('Content-type', 'text/html')
			self.end_headers()

		def do_GET(self):
			self._set_headers()
			self.wfile.write("<html><body><h1>hi!</h1></body></html>")

		def do_HEAD(self):
			self._set_headers()
		
		def do_POST(self):
			rsp = resp()
			try:
				config = self.getJSON()
			except json.decoder.JSONDecodeError as e:
				rsp.appendCode(400, 'Unable to resolve request body as a JSON object.', e)
			except Exception as e:
				rsp.appendCode(500, 'Encountered an error reading JSON.', e)
			else:
				try:
					configQueue.put(config)
				except Exception as e:
					rsp.appendCode(500, 'Encountered an error adding the configuration to the queue.', e)
				else:
					rsp.appendCode(200)
					rsp['message'] = 'Added configuration to load testing queue.'
			print(rsp['code'])
			self.send_response(rsp['code'])
			self.send_header('Content-type', 'application/json')
			self.end_headers()
			self.wfile.write(json.dumps(rsp).encode('utf8'))

		# Returns the JSON from the request.
		def getJSON(self):
			length = int(self.headers['content-length'])
			rdata = self.rfile.read(length).decode('utf-8')
			data = json.loads(rdata)
			return data

	return S

class resp(dict):

	def appendMessage(self, error):
		if self.get('error') == None:
			self['error'] = error
		else:
			self['error'] += '\r\n' + error

	def appendCode(self, code, errMsg = None, e = None):
		if self.get('code') == None:
			self['code'] = code
			self.appendMessage(errMsg)
			self['details'] = repr(e)
		else:
			self.appendMessage('Could not add code, %s: %s (%s)' % (code, errMsg, e))





def runLoadTest(config):
	url = config.get('url')
	total_num = config.get('total_num')
	simul_num = config.get('simul_num')
	save_filename = config.get('save_filename')
	headers = config.get('headers')
	method = config.get('method')
	payload = config.get('payload')
	dataType = config.get('dataType')
	sendFile = config.get('sendFile')

	(startQueue, resultQueue) = createSharedQueues()
	c = startController(url, method, total_num, simul_num, startQueue, resultQueue, save_filename, headers = headers, payload = payload, dataType = dataType, sendFile = sendFile)
	c.join()
	
def run(server_class = HTTPServer, port = 80):
	server_address = ('', port)
	configQueue = multiprocessing.Queue()
	pBlaster = multiprocessing.Process(
		target = blaster,
		args = (configQueue,)
	)
	pBlaster.start()
	httpd = server_class(server_address, createHandlerWithQueue(configQueue))
	print('Starting httpd...')
	httpd.serve_forever()

def blaster(configQueue):
	while True:
		config = configQueue.get()
		if config.get('end'): break
		runLoadTest(config)

if __name__ == "__main__":
	from sys import argv
	

	if len(argv) == 2:
		run(port=int(argv[1]))
	else:
		run()