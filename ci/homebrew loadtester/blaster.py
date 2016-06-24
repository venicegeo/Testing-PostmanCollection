# Sample call:
# python blaster.py -url 'https://pzsvc-hello.test.geointservices.io/' -p 0.01 -n 50

from siteBlasting import *

if __name__ == '__main__':

	url = getTagValue('-url')			# -url 'http://www.google.com'
	period = float(getTagValue('-p'))	# -p 0.01
	num = int(getTagValue('-n'))		# -n 1000

	(pArray, pStatus, pLock) = createSharedVars(num)
	pRequests = createProcesses(url, num, pArray, pStatus, pLock)
	l = startLogging(period, pArray, pStatus, pLock)
	startProcesses(pRequests)
	l.join()