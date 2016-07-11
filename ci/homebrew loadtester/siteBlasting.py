import multiprocessing
import time
import requests
import sys
import csv

# Function to pass to new process.  Records elapsed time to the processes Array.  If a bad
# status is returned, it is recorded in the status variable to be processed by the logger.
def sendGetRequest(url, startQueue, resultQueue):
	startQueue.put(1)
	try:
		r = requests.get(url)
	except Exception as e:
		startQueue.get()
		finishTime = time.time()
		active = startQueue.qsize()
		resultQueue.put((finishTime, 0, str(e), 0, active))
	else:
		startQueue.get()
		finishTime = time.time()
		active = startQueue.qsize()
		resultQueue.put((finishTime, r.status_code, r.reason, r.elapsed.total_seconds(), active)) # (time when complete, status code, reason for failure, request time, queue size)

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


# Returns a list of processes that call sendGetRequest().
def createProcesses(url, num, startQueue, resultQueue):
	return [
		multiprocessing.Process(
			target = sendGetRequest,
			args = (url, startQueue, resultQueue)
		) for i in range(0,num)
	]

# Start all processes in the supplied list.
def startProcesses(processes):
	for p in processes:
		p.start()
	print('All started!')

# Starts the logging process.
def startLogging(num, startQueue, resultQueue):
	pLogger = multiprocessing.Process(
		target = logger,
		args = (num, startQueue, resultQueue)
	)
	pLogger.start()
	return pLogger

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