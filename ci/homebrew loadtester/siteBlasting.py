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
def sendRequest(url, startQueue, resultQueue, headers, method, dataJson, files = None):
	if files:
		files = {'file': (files, open(files, 'rb'))}
	try:
		r = requests.request(method, url, headers = headers, files = files, data = dataJson)
	except Exception as e:
		startQueue.get()
		finishTime = time.time()
		active = startQueue.qsize()
		resultQueue.put((finishTime, 0, str(e), 0, active))
	else:
		startQueue.get()
		finishTime = time.time()
		active = startQueue.qsize()
		resultQueue.put((finishTime, r.status_code, r.reason + r.text, r.elapsed.total_seconds(), active)) # (time when complete, status code, reason for failure, request time, queue size)

# Logs imformation about running processes.  Handles request errors as they happen.
def logger(num, startQueue, resultQueue):
	startTime = time.time()
	results = []
	complete = 0
	next_percentage = 0
	while complete < num:
		results += [resultQueue.get()]
		complete += 1
		percentage = 100*complete/num
		if percentage >= next_percentage:
			print('%3.0f%%' % percentage)
			next_percentage += 5
	print('Blasting Complete!')
	newResults = [('Time Completed', 'Status Code', 'Status Message', 'Response Time', 'Active Requests')]
	for result in results:
		newResults += [(result[0] - startTime, result[1], result[2], result[3], result[4])]
	with open('test.csv', 'w') as test_file:
		file_writer = csv.writer(test_file, lineterminator = '\n')
		for line in newResults:
			file_writer.writerow(line)
	print('Log Written!')

# Logs information about the running processes.  Will add processes if not enough are running.
def controller(url, method, total_num, simul_num, startQueue, resultQueue, save_filename, kwargs):
	headerJson = {}
	dataJson = {}
	headers = kwargs.get('headers')
	if headers:
		with open(headers) as data_file:    
			headerJson = json.load(data_file)
	data = kwargs.get('data')
	if data:
		with open(data) as data_file:
			if kwargs.get('dataType') == 'string':
				data = data_file.read()
			else:
				data = json.load(data_file)
	startTime = time.time()
	results = []
	complete = 0
	next_percentage = 0
	processes = createProcesses(url, simul_num, startQueue, resultQueue, headerJson, method, data, files = kwargs.get('sendFile'))
	startProcesses(processes)
	while complete < total_num:
		active = startQueue.qsize()
		started = len(processes)
		if (active < simul_num) & (started < total_num):
			newToAdd = min(simul_num - active, total_num - started)
			processes += createProcesses(url, newToAdd, startQueue, resultQueue, headerJson, method, data, files = kwargs.get('sendFile'))
			startProcesses(processes[started:])
		results += [resultQueue.get()]
		complete += 1
		percentage = 100*complete/total_num
		if percentage >= next_percentage:
			print('%3.0f%%' % percentage)
			next_percentage += 5
	newResults = [('Time Completed', 'Status Code', 'Status Message', 'Response Time', 'Active Requests')]
	for result in results:
		newResults += [(result[0] - startTime, result[1], result[2], result[3], result[4])]
	with open(save_filename, 'w') as test_file:
		file_writer = csv.writer(test_file, lineterminator = '\n')
		for line in newResults:
			file_writer.writerow(line)
	print('Log Written!')

# Returns a list of processes that call sendGetRequest().
def createProcesses(url, num, startQueue, resultQueue, headers, method, dataJson, files):
	for i in range(num):
		startQueue.put(1)
	return [
		multiprocessing.Process(
			target = sendRequest,
			args = (url, startQueue, resultQueue, headers, method, dataJson, files)
		) for i in range(0,num)
	]

# Start all processes in the supplied list.
def startProcesses(processes):
	cpus = list(range(psutil.cpu_count()))
	for p in processes:
		p.start()
		psutil.Process(p.pid).cpu_affinity(cpus[1:])

# Starts the logging process.
def startLogging(num, startQueue, resultQueue):
	pLogger = multiprocessing.Process(
		target = logger,
		args = (num, startQueue, resultQueue)
	)
	pLogger.start()
	psutil.Process(pLogger.pid).cpu_affinity([0])
	return pLogger


# Starts the loggin and controller process.
def startController(url, method, total_num, simul_num, startQueue, resultQueue, save_filename, **kwargs):
	pController = multiprocessing.Process(
		target = controller,
		args = (url, method, total_num, simul_num, startQueue, resultQueue, save_filename, kwargs)
	)
	pController.start()
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