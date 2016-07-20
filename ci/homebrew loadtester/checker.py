import csv
import os
import collections
import statistics

# Returns a (talliedResults, totalTime) tuple for the results file.
def tallyResults(resultsFilename):
	print('working on %s...' % resultsFilename)
	talliedResults = collections.defaultdict(list)
	times = []
	with open(resultsFilename) as results:
		reader = csv.reader(results, lineterminator = '\n')
		totalTime = 0
		for i, line in enumerate(reader):
			if line[1].isdigit():
				code = line[1]
				talliedResults[code] += [float(line[3])]
				totalTime = line[0]
	return (talliedResults, totalTime)

# Returns a dictionary of results.
def collectResults(folder):
	collectedResults = {}
	for filename in os.listdir(folder):
		if '.csv' in filename:
			collectedResults[filename] = tallyResults(folder + '//' + filename)
	return collectedResults

# Returns a list of all status codes found in collectedResults.
def getStatusCodes(collectedResults):
	statusCodes = ['200', '0'] # start list with 200 & 0.
	for _, results in collectedResults.items():
		for code in results[0]:
			if code not in statusCodes:
				statusCodes += [code]
	return statusCodes

# Writes a csv file from the given results.
def writeResults(collectedResults, filename):
	statusCodes = getStatusCodes(collectedResults)
	with open(filename, 'w') as outFile:
		writer = csv.writer(outFile, lineterminator = '\n')
		writer.writerow(['Test Name','Total Time'] + statusCodes)
		for test, result in collectedResults.items():
			# ['Test Name', 'Total Time', '# times Status 200 received', '# times Status 0 received', etc...]
			newline = [test, result[1]] + [len(result[0].get(code, '')) for code in statusCodes]
			writer.writerow(newline)

# Writes a csv file with more detailed statistics.
def writeStats(collectedResults, filename):
	with open(filename, 'w') as outFile:
		writer = csv.writer(outFile, lineterminator = '\n')
		writer.writerow(['Test Name', 'Status Code', 'Count', 'Median Time (s)', 'Average Time (s)', 'Standard Deviation (s)'])
		for test, result in collectedResults.items():
			for code, times in result[0].items():
				count = len(times)
				if count > 1:
					stDev = statistics.stdev(times)
				else:
					stDev = 'NA'
				newline = [test, code, count, statistics.median(times), statistics.mean(times), stDev]
				writer.writerow(newline)


collectedResults = collectResults('results')
writeResults(collectedResults,'compiled.csv')
writeStats(collectedResults,'stats.csv')