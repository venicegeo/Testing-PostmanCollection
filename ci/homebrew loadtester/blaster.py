# Sample call:
# python blaster.py -url 'http://www.google.com/' -n 10
#									^				 ^
#									|				 |
#   website to which to send requests	  			 |
#							number of requests to send

from siteBlasting import *

if __name__ == '__main__':

	# Get command line vairables
	url = getTagValue('-url')				# -url 'https://pz-ingest.test.geointservices.io/data/file'
	total_num = int(getTagValue('-n'))		# -n 1000
	simul_num = int(getTagValue('-p'))		# -p 7
	filename = getTagValue('-fn')			# -fn google1000
	headers = getTagValue('-h')				# -h authHeader.json
	method = getTagValue('-m')				# -m GET
	data = getTagValue('-d')				# -d postFile.json
	sendFile = getTagValue('-sf')			# -sf somecat.tif

	# Create the shared variables to use between the logger and the blaster processes.
	(startQueue, resultQueue) = createSharedQueues()

	# pRequests = createProcesses(url, num, startQueue, resultQueue)
	# l = startLogging(num, startQueue, resultQueue)
	# startProcesses(pRequests)

	c = startController(url, total_num, simul_num, filename, startQueue, resultQueue, headers, method, data, sendFile)

	# Hold here until all processes have completed.
	c.join()