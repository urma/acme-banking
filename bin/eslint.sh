#!/bin/bash

# ESLint scanning

# Check whether we are inside the Jeniks environment or not
[ -z ${WORKSPACE} ] && echo 'WORKSPACE is not defined. Please provide a WORKSPACE:'
read -r WORKSPACE

[ -z ${BUILD_TAG} ] && echo 'BUILD_TAG is not defined. Please provide a BUILD_TAG:'
read -r BUILD_TAG

mkdir -p "${WORKSPACE}/reports/eslint"
eslint --format html --output-file "${WORKSPACE}/reports/eslint/${BUILD_TAG}.html" .
