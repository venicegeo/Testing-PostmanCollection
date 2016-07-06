#!/bin/bash -ex
echo start
#mail settings
RCVR="abcmauck@gmail.com"
SUBJ= $BUILDURL

#awm

pushd `dirname $0` > /dev/null
base=$(pwd -P)
popd > /dev/null

[ -z "$space" ] && space=int

echo $space
envfile=$base/environments/$space.postman_environment

echo $envfile

[ -f $envfile ] || { echo "no tests configured for this environment"; exit 0; }

cmd="newman -x -e $envfile -c"

latch=0

set -e

for f in $(ls -1 $base/postman/*postman_collection); do
	echo $f
	#Try the command first.  If it returns an error, latch & e-mail.
	$cmd $f || latch=1
	echo $latch
done

echo "OUT OF LOOP"
echo "$latch"

if [$latch -eq 1]; then
	mail -s "$SUBJ" $RCVR < /dev/null
	echo "mail sent!"
fi

#Return an overall error if any collections failed.
exit $latch
   #awm	
