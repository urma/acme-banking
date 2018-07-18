#!/bin/bash

# Check whether we are inside the Jeniks environment or not
[ -z "${WORKSPACE}" ] && echo 'WORKSPACE is not defined.' && exit

[ -z "${BUILD_TAG}" ] && echo 'BUILD_TAG is not defined.' && exit

mkdir -p "${WORKSPACE}/reports/zap"

# Deploy Docker stack & ZAP scanning
# Ignore failure to generating reports
set +e
DB_PASSWORD=${BUILD_TAG} docker stack deploy ${BUILD_TAG} --compose-file "${WORKSPACE}/docker-compose-jenkins.yml"
docker run -v ${WORKSPACE}/reports/zap:/zap/wrk:rw owasp/zap2docker-stable:latest zap-full-scan.py -t http://172.17.0.1:3000/ -x ${BUILD_TAG}.xml -r ${BUILD_TAG}.html
set -e

