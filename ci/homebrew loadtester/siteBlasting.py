import multiprocessing
# import multiprocessing_on_dill as multiprocessing
import time
import requests
import sys
import csv
import psutil
import json

# Function to pass to new process.  Records elapsed time to the processes Array.  If a bad
# status is returned, it is recorded in the status variable to be processed by the logger.
def sendRequest(url, activeQueue, resultQueue, headers, method, payload, file = None):
	# add {'file': ('filename', file-like object)} if a file path is given.
	if file:
		file = {'file': (files, open(files, 'rb'))}
	try:
		# Send the request and get a response.
		r = requests.request(method, url, headers = headers, files = file, data = payload)
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
def controller(url, method, total_num, simul_num, activeQueue, resultQueue, save_filename, kwargs):
	# Initialize variables.
	headerJson = {}
	dataJson = {}
	results = []
	complete = 0
	next_percentage = 0
	newResults = [('Time Completed', 'Status Code', 'Status Message', 'Response Time', 'Active Requests')]
	startTime = time.time()
	# Get variables from input arguments.
	headers = getData(kwargs.get('headers'))
	payload = getData(kwargs.get('payload'))
	file = kwargs.get('sendFile')
	# Create/start the loadtest processes.
	processes = createProcesses(url, simul_num, activeQueue, resultQueue, headers, method, payload, file)
	startProcesses(processes)
	# Continue until the target number of requests been reached.
	while complete < total_num:
		active = activeQueue.qsize()
		started = len(processes)
		if (active < simul_num) & (started < total_num):
			# If there are less active processes than the specified simul_num (and total_num has not yet been reached),
			# add/start more processes to reach either simul_num or total_num.
			newToAdd = min(simul_num - active, total_num - started)
			processes += createProcesses(url, newToAdd, activeQueue, resultQueue, headers, method, payload, file)
			startProcesses(processes[started:])
		try:
			# Wait here until a process has received a response.
			results += [resultQueue.get(timeout = 300)]
		except queue.Empty:
			# If no response received in 5 minutes, end the test.
			results += [(time.time() - startTime, 999, 'Timeout - Ending Test', 'NA', total_num - complete)]
			complete = total_num
		else:
			# Count the process.
			complete += 1
			percentage = 100*complete/total_num
		if percentage >= next_percentage:
			# Log every 1%.
			next_percentage += 1
			# Make the first column elapsed time.
			for result in results:
				newResults += [(result[0] - startTime,) + result[1:]]
			# Append results to csv.
			with open('results\\' + save_filename, 'a') as test_file:
				file_writer = csv.writer(test_file, lineterminator = '\n')
				for line in newResults:
					file_writer.writerow(line)
			print('%3.0f%% Complete ... Log Written.' % percentage)
			results = []
			newResults = []

# Returns a list of processes that call sendGetRequest().
def createProcesses(url, num, activeQueue, resultQueue, headers, method, payload, files):
	# Count the new processes.
	for i in range(num):
		activeQueue.put(1)
	# Create the new processes.
	return [
		multiprocessing.Process(
			target = sendRequest,
			args = (url, activeQueue, resultQueue, headers, method, payload, files)
		) for i in range(0,num)
	]

# Start all processes in the supplied list.
def startProcesses(processes):
	cpus = list(range(psutil.cpu_count()))
	for p in processes:
		p.start()
		# CPU 0 is reserved for the controller.
		psutil.Process(p.pid).cpu_affinity(cpus[1:])

# Starts the loggin and controller process.
def startController(url, method, total_num, simul_num, activeQueue, resultQueue, save_filename, **kwargs):
	pController = multiprocessing.Process(
		target = controller,
		args = (url, method, total_num, simul_num, activeQueue, resultQueue, save_filename, kwargs)
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