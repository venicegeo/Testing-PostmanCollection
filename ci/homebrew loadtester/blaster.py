# Sample call:
# python blaster.py -url 'http://www.google.com/' -n 10
#									^				 ^
#									|				 |
#   website to which to send requests	  			 |
#							number of requests to send

from siteBlasting import *

if __name__ == '__main__':

	# Get command line vairables
	url = getTagValue('-url')			# -url 'https://pzsvc-hello.test.geointservices.io/'
	num = int(getTagValue('-n'))		# -n 1000

	# Create the shared variables to use between the logger and the blaster processes.
	(startQueue, resultQueue) = createSharedQueues()

	pRequests = createProcesses(url, num, startQueue, resultQueue)
	l = startLogging(num, startQueue, resultQueue)
	startProcesses(pRequests)

	# Hold here until all processes have completed.
	l.join()