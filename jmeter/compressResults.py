import sys
import os
import csv
import statistics

def addToKey(d, k, v):
	added = not k in d
	if not k in d:
		d[k] = v
	else:
		d[k] += v
	return added

folder = sys.argv[1]
target = sys.argv[2]
newName = sys.argv[3]

sourcepath = os.path.join(folder, target)
sinkpath = os.path.join(folder, newName)
print('Reading from: %s' % sourcepath)
print('Writing to: %s' % sinkpath)

with open(sourcepath) as source:
	srcReader = csv.reader(source)
	# Get header and find needed columns.
	header = next(srcReader)
	print(header)
	col_c0 = header.index('Timestamp') # Column0 on which to compress.
	col_c1 = header.index('Elapsed Time') # Column1 on which to compress.
	col_d = header.index('elapsed') # Data to average when compressing.
	col_rc = header.index('responseCode') # To count response codes
	times = {}
	codes = {}
	tKeys = []
	cKeys = []
	for line in srcReader:
		# Write averaged line to file if the next line is different (and there is data to average).
		tKey = (line[col_c0], line[col_c1])
		time = float(line[col_d])
		cKey = (line[col_c0], line[col_rc])
		if addToKey(times, tKey, [time]):
			tKeys += [tKey]
		if addToKey(codes, cKey, 1):
			cKeys += [cKey]


fillerRow = ['-' for c in header]

with open(sinkpath, 'w') as sink:
	snkWriter = csv.writer(sink)
	snkWriter.writerow(['Timestamp', 'Code', 'Count'])
	for key in cKeys:
		snkWriter.writerow([key[0], key[1], codes[key]])

	snkWriter.writerow(header)
	for key in tKeys:
		fillerRow[col_c0] = key[0]
		fillerRow[col_c1] = key[1]
		fillerRow[col_d] = statistics.mean(times[key])
		snkWriter.writerow(fillerRow)