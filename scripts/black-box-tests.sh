#!/bin/bash -ex

pushd `dirname $0` > /dev/null
base=$(pwd -P)
popd > /dev/null

# Gather some data about the repo
source $base/vars.sh

#Run the test
<<<<<<< HEAD
newman -sc $base/tests/PiazzaDevelopment.json.postman_collection
newman -sc $base/tests/pz-register-test.json
newman -sc $base/tests/testServiceControllerRestServicesSeq.json.postman_collection
newman -sc $base/tests/UUID_Logger.json.postman_collection
=======
newman -sc $base/system-tests/PiazzaDevelopment.json.postman_collection
newman -sc $base/system-tests/pz-register-test.json
newman -sc $base/system-tests/testServiceControllerRestServicesSeq.json.postman_collection
newman -sc $base/system-tests/UUID_Logger.json.postman_collection
>>>>>>> df1e73f47a1bf9ae82fd698895d1ba65ae661b68
