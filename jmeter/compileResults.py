import sys
import os
import csv
import re
import datetime

def getSeconds(timestamp):
	h, m, s = re.split(':', timestamp)
	delta = datetime.timedelta(hours=int(h), minutes=int(m), seconds=int(s))
	return delta.total_seconds()

# Get CL args
# Example: python ./test_files/compileResults.py ./sequential/example compiled.csv raw.csv
folder = sys.argv[1]
target = sys.argv[2]
dataFilename = sys.argv[3]

# Create csv writer
snkFile = open(os.path.join(folder, target), 'wb')
csvWrite = csv.writer(snkFile)

# Assume that the folders within "folder" are timestamps for when the test was run.
timestamps = [f for f in os.listdir(folder) if os.path.isdir(os.path.join(folder, f))]

# Append header from the first file.
with open(os.path.join(folder, timestamps[0], dataFilename)) as firstFile:
	firstReader = csv.reader(firstFile, delimiter=';')
	header = next(firstReader)
	header += ['Timestamp', 'Elapsed Time']
	csvWrite.writerow(header)

# For each timestamp, open a csv reader for the file {folder}/{timestamp}/{dataFilename}.
for timestamp in timestamps:
	with open(os.path.join(folder, timestamp, dataFilename)) as srcFile:
		csvRead = csv.reader(srcFile, delimiter=';')
		# Move past the first (header) line.
		next(csvRead)
		# Write each line (after the first) to the writer.
		for i, line in enumerate(csvRead):
			if i == 0:
				startTime = getSeconds(line[0])
			elapsed = getSeconds(line[0]) - startTime
			if elapsed < 0:
				elapsed += 86400
			line += [timestamp, elapsed]
			csvWrite.writerow(line)

# Close the compiled file when done.
snkFile.close()