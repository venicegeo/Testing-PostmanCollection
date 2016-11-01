filename=$1

for i in {1..10}; do
	./apache-jmeter-3.0/bin/jmeter -n -t ./test_files/$filename;
done