#!/bin/bash

# ESLint scanning

# Check whether we are inside the Jeniks environment or not
[ -z "${WORKSPACE}" ] && echo 'WORKSPACE is not defined.' && exit

[ -z "${BUILD_TAG}" ] && echo 'BUILD_TAG is not defined.' && exit

mkdir -p "${WORKSPACE}/reports/eslint"
eslint --format html --output-file "${WORKSPACE}/reports/eslint/${BUILD_TAG}.html" .
