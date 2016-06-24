import multiprocessing
import time
import requests
import sys
import ctypes
import psutil

# Function to pass to new process.  Records elapsed time to the processes Array.  If a bad
# status is returned, it is recorded in the status variable to be processed by the logger.
def sendGetRequest(url, pArray, pIndex, pStatus, pLock):
	r = requests.get(url)
	if r.status_code == 200:
		pArray[pIndex] = r.elapsed.total_seconds()
	else:
		pArray[pIndex] = -1
		pLock.acquire() # Released in logger()
		pStatus['fail'] = '%d --> %d: %s' % (pIndex, r.status_code, r.reason)

# Logs imformation about running processes.  Handles request errors as they happen.
def logger(period, pArray, pStatus, pLock):
	global statusLock
	startTime = time.time()
	unfinished = 1
	failed = 0
	failed_printed = 0
	while unfinished + failed - failed_printed > 0:
		if pStatus['fail'] != False:
			# Replace with logging function.
			print(pStatus['fail'])
			failed_printed += 1
			pStatus['fail'] = False
			pLock.release()
		else:
			unfinished = aCount(pArray,0)
			failed = aCount(pArray, -1)
			finished = len(pArray) - unfinished - failed
			elapsed = time.time() - startTime
			# Replace with logging function
			print('%0.3f s: %d ToDo, %d Done, %d Fail' % (elapsed, unfinished, finished, failed))
		time.sleep(period)
	print(['%0.1f' % p for p in pArray])

# Returns a list of processes that call sendGetRequest().
def createProcesses(url, num, pArray, pStatus, pLock):
	return [
		multiprocessing.Process(
			target = sendGetRequest,
			args = (url, pArray, i, pStatus, pLock)
		) for i in range(0,num)
	]

# Start all processes in the supplied list.
def startProcesses(processes):
	for p in processes:
		cpus = list(range(psutil.cpu_count()))
		p.start()
		psutil.Process(p.pid).cpu_affinity(cpus[1:]) # Don't run blasters on the logger's core.
	print('All started!')

# Starts the logging process.
def startLogging(period, pArray, pStatus, pLock):
	pLogger = multiprocessing.Process(
		target = logger,
		args = (period, pArray, pStatus, pLock)
	)
	pLogger.start()
	psutil.Process(pLogger.pid).cpu_affinity([0]) # Run logger only on first core
	return pLogger

# returns (pArray, pStatus, pLock) to be shared between processes.
def createSharedVars(num):
	pArray = multiprocessing.Array('d', num)
	m = multiprocessing.Manager()
	pStatus = m.dict()
	pLock = m.Lock()
	pStatus['fail'] = False
	return (pArray, pStatus, pLock)

# Return the command line argument after the specified tag.
def getTagValue(tag):
	for (i, ele) in enumerate(sys.argv):
		if tag == ele:
			val = sys.argv[i + 1]
			if val[0] == val[-1] == "'":
				val = val[1:-1]
			return val
	else: return ''

# Hacked counter for array.
def aCount(array, val):
	count = 0
	for ele in array:
		if ele == val:
			count += 1
	return count