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

for space in $spaces; do
	echo $space
	envfile=$base/environments/$space.postman_environment

	echo $envfile

	[ -f $envfile ] || { echo "no tests configured for this environment"; exit 0; }

	cmd="newman --requestTimeout 120000 -x -e $envfile -c"

	latch=0

	set -e
	
	BODY="Failing Collections:"

	#Run all generic tests.
	for f in $(ls -1 $base/postman/pz-all/*postman_collection); do
		echo $f
		filename=$(basename $f)
		#Try the command first.  If it returns an error, latch & e-mail.
		$cmd $f || { latch=1; BODY="${BODY}\n${filename%.*}"; } #append the failing collection to the pending body of the e-mail.
		json_results=$(<results.json)
		curl -H "Content-Type: application/json" -X POST -d "$json_results" http://dashboard.venicegeo.io/cgi-bin/load.pl
		echo $latch
	done

	#Run all specific environment tests.
	for f in $(ls -1 $base/postman/pz-$space/*postman_collection); do
		echo $f
		filename=$(basename $f)
		#Try the command first.  If it returns an error, latch & e-mail.
		$cmd $f || { latch=1; BODY="${BODY}\n$space: ${filename%.*}"; } #append the failing collection to the pending body of the e-mail.
		json_results=$(<results.json)
		curl -H "Content-Type: application/json" -X POST -d "$json_results" http://dashboard.venicegeo.io/cgi-bin/load.pl
		echo $latch
	done
	
	SUBJ="Piazza failure in $space environment!"

	if [ "$latch" -eq "1" ]; then
		echo -e "${BODY}" | mail -s "$SUBJ" $RCVR
		echo "mail sent!"
		bigLatch=1
	fi
done

#Return an overall error if any collections failed.
exit $bigLatch
#awm	
