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

from siteBlasting import *
import json

if __name__ == '__main__':

	# Get command line vairables
	configFile = getTagValue('-cfg')
	if configFile:
		with open(configFile) as data_file:    
			config = json.load(data_file)
		url = config.get('url')
		total_num = config.get('total_num')
		simul_num = config.get('simul_num')
		save_filename = config.get('save_filename')
		headers = config.get('headers')
		method = config.get('method')
		payload = config.get('payload')
		dataType = config.get('dataType')
		sendFile = config.get('sendFile')
	else:
		url = getTagValue('-url')				# -url 'https://pz-ingest.test.geointservices.io/payload/file'
		total_num = int(getTagValue('-n'))		# -n 1000
		simul_num = int(getTagValue('-p'))		# -p 7
		save_filename = getTagValue('-fn')			# -fn google1000
		headers = getTagValue('-h')				# -h authHeader.json
		method = getTagValue('-m')				# -m GET
		payload = getTagValue('-d')				# -d postFile.json
		sendFile = getTagValue('-sf')			# -sf somecat.tif

	# Create the shared variables to use between the logger and the blaster processes.
	(startQueue, resultQueue) = createSharedQueues()

	# pRequests = createProcesses(url, num, startQueue, resultQueue)
	# l = startLogging(num, startQueue, resultQueue)
	# startProcesses(pRequests)

	c = startController(url, method, total_num, simul_num, startQueue, resultQueue, save_filename, headers = headers, payload = payload, dataType = dataType, sendFile = sendFile)

	# Hold here until all processes have completed.
	c.join()