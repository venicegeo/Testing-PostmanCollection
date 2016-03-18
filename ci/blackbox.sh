#!/bin/bash -ex

pushd `dirname $0` > /dev/null
base=$(pwd -P)
popd > /dev/null

#Run the test
for f in $base/system-tests/*.postman_collection; do
  newman -sc $f
done
