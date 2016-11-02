import sys
import os
import csv
import statistics

folder = sys.argv[1]
target = sys.argv[2]
newName = sys.argv[3]

sourcepath = os.path.join(folder, target)
sinkpath = os.path.join(folder, newName)
print('Reading from: %s' % sourcepath)
print('Writing to: %s' % sinkpath)

snkFile = open(sinkpath, 'w')
snkWriter = csv.writer(snkFile)

with open(sourcepath) as source:
	srcReader = csv.reader(source)
	# Get header and find needed columns.
	header = next(srcReader)
	print(header)
	col_t = header.index('Elapsed Time') # Column on which to compress.
	col_d = header.index('elapsed') # Data to average when compressing.

	snkWriter.writerow(header)

	lastLine = header
	dataList = []
	for line in srcReader:
		# Write averaged line to file if the next line is different (and there is data to average).
		if line[col_t] != lastLine[col_t] and dataList:
			lastLine[col_d] = statistics.mean(dataList)
			snkWriter.writerow(lastLine)
			dataList = []
		dataList += [float(line[col_d])]
		lastLine = line

snkFile.close()