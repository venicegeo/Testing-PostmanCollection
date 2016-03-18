#!/bin/bash -ex

pushd `dirname $0` > /dev/null
base=$(pwd -P)
popd > /dev/null

#Run the test
newman -sc $base/system-tests/PiazzaDevelopment.json.postman_collection
newman -sc $base/system-tests/pz-register-test.json
newman -sc $base/system-tests/testServiceControllerRestServicesSeq.json.postman_collection
newman -sc $base/system-tests/UUID_Logger.json.postman_collection
