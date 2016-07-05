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

cmd="newman -s -e $envfile -c"

latch=0

for f in $(ls -1 $base/postman/*postman_collection); do
echo $f	
  bash -c "$cmd $f"
  resp="$?"
  echo $resp
  #send mail if return value of last command is not 0
	if [ $resp -ne "0" ];then
		latch=1
		echo "$latch"
	# 	mail -s "$SUBJ" $RCVR < /dev/null  
	fi
done

echo "OUT OF LOOP"
echo "$latch"

exit $latch
   #awm	
