#!/bin/bash -ex
echo start
#mail settings
RCVR="jamesyarrington88@gmail.com"
SUBJ= $BUILDURL

#awm

pushd `dirname $0` > /dev/null
base=$(pwd -P)
popd > /dev/null

[ -z "$space" ] && space=int

bigLatch=0

echo $PCF_SPACE

if [ "$PCF_SPACE" == "test" ]; then
	echo "test case"
	spaces="int stage prod"
else
	spaces=$PCF_SPACE
fi

cd ci/Selenium

npm install geckodriver
ls /usr/bin
ls /usr/bin/firefox

for space in $spaces; do

	export bf_url=https://beachfront.$space.geointservices.io/
	export driver_path=node_modules/geckodriver/geckodriver
	export browser_path=/usr/bin/firefox
	mvn test

	echo $space
	envfile=$base/environments/$space.postman_environment

	echo $envfile

	[ -f $envfile ] || { echo "no tests configured for this environment"; exit 0; }

	cmd="newman -o results.json --requestTimeout 960000 -x -e $envfile -g $POSTMAN_FILE -c"

	latch=0

	set -e
	
	BODY="Failing Collections:"

	#Run all generic tests.
	for f in $(ls -1 $base/postman/bf-all/*postman_collection); do
		echo $f
		filename=$(basename $f)
		#Try the command first.  If it returns an error, latch & e-mail.
		$cmd $f || [[ "$PCF_SPACE" == "stage" ]] || { latch=1; BODY="${BODY}\n${filename%.*}"; } #append the failing collection to the pending body of the e-mail.
		curl -H "Content-Type: application/json" -X POST -d @- http://dashboard.venicegeo.io/cgi-bin/beachfront/$space/load.pl < results.json
		echo $latch
	done

	#Run all specific environment tests.
	for f in $(ls -1 $base/postman/bf-$space/*postman_collection); do
		echo $f
		filename=$(basename $f)
		#Try the command first.  If it returns an error, latch & e-mail.
		$cmd $f || [[ "$PCF_SPACE" == "stage" ]] || { latch=1; BODY="${BODY}\n${filename%.*}"; } #append the failing collection to the pending body of the e-mail.
		curl -H "Content-Type: application/json" -X POST -d @- http://dashboard.venicegeo.io/cgi-bin/beachfront/$space/load.pl < results.json
		echo $latch
	done
	
	SUBJ="Beachfront failure in $space environment!"

	if [ "$latch" -eq "1" ]; then
		echo -e "${BODY}" | mail -s "$SUBJ" $RCVR
		echo "mail sent!"
		bigLatch=1
	fi
done


#Return an overall error if any collections failed.
exit $bigLatch
#awm