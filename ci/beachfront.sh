#!/bin/bash -ex
echo start
#mail settings
#RCVR="abcmauck@gmail.com,jamesyarrington88@gmail.com"
RCVR="jamesyarrington88@gmail.com"
SUBJ= $BUILDURL

#awm

pushd `dirname $0` > /dev/null
base=$(pwd -P)
popd > /dev/null

[ -z "$space" ] && space=int

bigLatch=0

echo $target_domain

spaces="${target_domain%.*.*}"
echo $spaces
if [ "$spaces" == "test" ]; then
	echo "test case"
	spaces="int stage prod"
elif [ -z "$spaces" ]; then
	echo "null case"
	spaces="prod"
fi

echo "after if"
	
for space in $spaces; do
	echo $space
	envfile=$base/environments/$space.postman_environment

	echo $envfile

	[ -f $envfile ] || { echo "no tests configured for this environment"; exit 0; }

	cmd="newman -x -e $envfile -c"

	latch=0

	set -e
	
	BODY="Failing Collections:"

	for f in $(ls -1 $base/postman/bf/*postman_collection); do
		echo $f
		filename=$(basename $f)
		#Try the command first.  If it returns an error, latch & e-mail.
		$cmd $f || { latch=1; BODY="${BODY}\n${filename%.*}"; } #append the failing collection to the pending body of the e-mail.
		echo $latch
	done
	
	SUBJ="Failure in $space environment!"

	if [ "$latch" -eq "1" ]; then
		echo -e "${BODY}" | mail -s "$SUBJ" $RCVR
		echo "mail sent!"
		bigLatch=1
	fi
done

#Return an overall error if any collections failed.
exit $bigLatch
#awm	
