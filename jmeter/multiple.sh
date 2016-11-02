filename=$1
count=$2

for ((i=1;i<=$2;i++)); do
	./apache-jmeter-3.0/bin/jmeter -n -t ./test_files/$filename;
done