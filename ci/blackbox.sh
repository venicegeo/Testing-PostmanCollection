#!/bin/bash -ex
echo start

#awm

pushd `dirname $0` > /dev/null
base=$(pwd -P)
popd > /dev/null

[ -z "$space" ] && space=int

bigLatch=0

curl -s http://whatismyip.akamai.com/

echo $PCF_SPACE

if [ "$PCF_SPACE" == "test" ]; then
	echo "test case"
	spaces="int stage"
else
	spaces=$PCF_SPACE
fi

for space in $spaces; do
	echo $space
	envfile=$base/environments/$space.postman_environment

	echo $envfile

	[ -f $envfile ] || { echo "no tests configured for this environment"; exit 0; }

    newmancmd="./node_modules/newman/bin/newman.js"
  
	$newmancmd --version
	$newmancmd -h
	which $newmancmd

	# Newman v3 required
	cmd="$newmancmd run COLLECTION_NAME --timeout-request 120000 --timeout-script 300000 -e $envfile -g $POSTMAN_FILE"

	latch=0

	set -e
	
	BODY="Failing Collections:"	

	#Run all specific environment tests.
	for f in $(ls -1 $base/postman/pz-$space/*postman_collection); do
		echo $f
		filename=$(basename $f)
		#Try the command first.  If it returns an error, latch
		fullCommand=$(echo $cmd | sed -e "s#COLLECTION_NAME#${f}#g")
		$fullCommand || { latch=1; BODY="${BODY}\n$space: ${filename%.*}"; } #append the failing collection to the pending body of errors
		# curl -H "Content-Type: application/json" -X POST -d @- "$json_results" http://dashboard.venicegeo.io/cgi-bin/piazza/$space/load.pl < results.json
		echo $latch
	done
	
	if [ "$latch" -eq "1" ]; then
		echo "Piazza failure in $space environment!"
		echo -e "${BODY}"
		bigLatch=1
	fi
done

#Return an overall error if any collections failed.
exit $bigLatch
#awm	
