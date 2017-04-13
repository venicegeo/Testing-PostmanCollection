import sys
import os
import csv
import re
import math
# From: http://stackoverflow.com/questions/6402812/how-to-convert-an-hmmss-time-string-to-seconds-in-python
# Taskinoor's answer
def get_sec(time_str):
    (h, m, s) = time_str.split(':')
    return int(h) * 3600 + int(m) * 60 + int(s)

# Create a new (k)ey/(v)alue pair in the (d)ictionary.
# If the key already exists, add the value to the current stored value.
def addToKey(d, k, v):
	added = not k in d
	if not k in d:
		d[k] = v
	else:
		d[k] += v
	return added

# Function to check if any status codes are error codes (not 200 or 201).
# Used in list-comprehension to count failing requests.
def matchErrorCode(codes):
	for code in codes:
		if not re.match('^20[01]$', code):
			return True
	return False

# Try to convert a (v)alue to a float.  Return 0 if unable.
def toFloat(v):
	try:
		return float(v)
	except:
		return 0

# Try to find the average of the elements of a (l)ist.  Return 0 if there are no elements.
def getAve(l):
	l = [f for f in l if not math.isnan(f)]
	if len(l) != 0:
		return sum(l)/len(l)
	else:
		return 0

# Get CL variables.
folder = sys.argv[1]		# Target filder
srcName = sys.argv[2]		# File within the target folder that contains the data
snkName = sys.argv[3]		# File to create within the target folder to contain the cycle data
startRequest = sys.argv[4]	# The step that starts the cycle.
							# One cycle will contain this request (like "/data/file") and all requests after it
							# (like "/job/{jobId}" and "/data/{dataId}"), up to the start of the next cycle

# Create full paths for source and sink files.
srcPath = os.path.join(folder, srcName)
snkPath = os.path.join(folder, snkName)

# Open the Source/Sink files, and create readers/writers.
with open(srcPath) as srcFile, open(snkPath, 'w') as snkFile:
	source = csv.reader(srcFile)
	sink = csv.writer(snkFile)

	# Get the column that contains the labels.
	header = next(source)
	label_c = header.index("label")
	success_c = header.index("success")
	timeStamp_c = header.index("timeStamp")
	origFilename_c = header.index("Timestamp")  # I know these are the same word.  The filename is a timestamp.
	time_c = header.index("elapsed")
	code_c = header.index("responseCode")
	thread_c = header.index("threadName")
	count_c = header.index("responseMessage") # Change this unused field to display the count of error responses.
	header[count_c] = "errorCount"
	header[success_c] = "failures"

	cols_d = [
		header.index('grpThreads'),
		header.index('allThreads')
		] # Data to average when compressing.
	for i, h in enumerate(header):
		if 'cpu' in h:
			cols_d += [i]
		elif 'mem' in h:
			cols_d += [i]


	# Write the first line of the source file into the sink file (the header).
	sink.writerow(header)

	# Initialize dictionaries.  The thread name (for multiple users) will be the key.

	codes = {}
	# Used to log all response codes within a cycle, by request name.
	# A single request name may have more than one status code,
	# i.e. when /job/{jobId} is pinged multiple times to find a job status.
	# {
	# 	"threadName": {
	# 		"requestName": ["status", "code", "list", ...]
	# 	}
	# }

	failures = {}
	# Used to count failures within a cycle, by request name.
	# {
	# 	"threadName": {
	# 		"failures": 2
	# 	}
	# }

	totalTime = {}
	# Used to total the response times of all requests within a cycle.
	# {
	# 	"threadName": 1234
	# }

	cpuUsage = {}
	# Used to average the cpu usage of all requests within a cycle.
	# {
	# 	"threadName": 0.5
	# }

	memUsage = {}
	# Used to average the memory usage of all requests within a cycle.
	# {
	# 	"threadName": 1024
	# }

	startTime = {}
	# Used to hold the start time of the first request within a cycle.
	# This is now how totalTime is calculated - subtracting startTime from endTime
	# {
	# 	"threadName": 1234
	# }

	origRow = {}
	# Hold all information from the first request of the cycle.
	# Some values, like thread count, can be assume constant for the duration of a cycle.
	# {
	# 	"threadName": ["col1", "col2", ...]
	# }

	dataSums = {}

	for i, line in enumerate(source):
		label = line[label_c]
		thr = line[thread_c] + ' ~ ' + line[origFilename_c] # Combine Thread & Results Flie name (a timestamp) to create a unique key
		if label == startRequest:
			# If the thread already has an entry in the origRow dict, then a cycle has been completed.
			if thr in origRow:

				# Create a new line for the just-completed cycle, editting fiels as appropriate.
				origRow[thr][label_c] = "cycle"
				cycleTime = get_sec(line[timeStamp_c]) - startTime[thr]
				if cycleTime < 0:
					cycleTime += 86400
				origRow[thr][time_c] = cycleTime

				# The responseCode column is becomes "req1: code1; req2: code2; ..." for each request in the cycle.
				codeList = ["%s: %s" % (k, list(set(codes[thr][k]))) for k in codes[thr]]
				origRow[thr][code_c] = "; ".join(codeList)

				# Average all appropriate columns:
				for c in cols_d:
					origRow[thr][c] = dataSums[thr][c]/dataSums[thr]["count"]

				# Count the requests that had at least one error code response.
				origRow[thr][count_c] = len( [ k for k in codes[thr] if matchErrorCode(codes[thr][k]) ] )

				origRow[thr][success_c] = failures[thr]
				sink.writerow(origRow[thr])

			# Initialize thread information for the current cycle.
			startTime[thr] = get_sec(line[timeStamp_c])
			totalTime[thr] = int(line[time_c])
			codes[thr] = {label: [line[code_c]]}
			dataSums[thr] = {}
			origRow[thr] = line
			for c in cols_d:
				dataSums[thr][c] = toFloat(line[c])
				dataSums[thr]["count"] = 1
			if line[success_c].lower() != "true":
				failures[thr] = 1
			else:
				failures[thr] = 0
		else:
			# append results
			addToKey(totalTime, thr, int(line[time_c]))
			addToKey(codes[thr], label, [line[code_c]])
			for c in cols_d:
				addToKey(dataSums[thr], c, toFloat(line[c]))
			addToKey(dataSums[thr], "count", 1)
			if line[success_c].lower() != "true":
				addToKey(failures, thr, 1)