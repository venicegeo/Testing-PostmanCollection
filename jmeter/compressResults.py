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


# Try to convert a (v)alue to a float.  Return 0 if unable.
def toFloat(v):
	try:
		return float(v)
	except:
		return 0

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
	col_c0 = header.index('Timestamp') # Column0 on which to compress.
	col_c1 = header.index('Elapsed Time') # Column1 on which to compress.
	success_c = header.index("success")
	cols_d = [
		header.index('elapsed'),
		header.index('bytes'),
		header.index('grpThreads'),
		header.index('allThreads'),
		header.index('Latency'),
		header.index('IdleTime')
		] # Data to average when compressing.
	for i, h in enumerate(header):
		if 'cpu' in h:
			cols_d += [i]
		elif 'mem' in h:
			cols_d += [i]

	header[success_c] = "failures"
			
	col_rc = header.index('responseCode') # To count response codes
	datas = {}
	failures = {}
	codes = {}
	tKeys = []
	cKeys = []
	total = 4200000
	print("Total Lines: %s" % total)
	nextPrint = -1
	tKey = None

	dataSums = {}
	fillerRow = [0 for c in header]
	for i, line in enumerate(srcReader):
		# Write averaged line to file if the next line is different (and there is data to average).
		try:
			thisKey = (line[col_c0], line[col_c1])
		except:
			print("Problem with this line: %s" % line)
			continue
		if thisKey not in dataSums:
			dataSums[thisKey] = {}
			failures[thisKey] = 0
		for c in cols_d:
			addToKey(dataSums[thisKey], c, toFloat(line[c]))
		addToKey(dataSums[thisKey], "count", 1)
		if line[success_c].lower() != "true":
			addToKey(failures, thisKey, 1)


print("Done reading data!")

with open(sinkpath, 'w') as sink:
	snkWriter = csv.writer(sink)
	snkWriter.writerow(header)
	for key in dataSums:
		fillerRow[col_c0] = key[0]
		fillerRow[col_c1] = key[1]
		for c in cols_d:
			fillerRow[c] = dataSums[key][c]/dataSums[key]["count"]
		fillerRow[success_c] = failures[key]
		snkWriter.writerow(fillerRow)

print("Done writing data!")