#!/bin/bash -ex

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

cmd="newman -xe $envfile -c"

for f in $(ls -1 $base/postman/*postman_collection); do
  $cmd $f
  #send mail if return value of last command is not 0
	if [ "$?" -ne "0" ];then
		mail -s "$SUBJ" $RCVR < /dev/null  
	fi
done
   #awm	


