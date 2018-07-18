#!/bin/bash

# ESLint scanning
mkdir -p "${WORKSPACE}/reports/eslint"
eslint --format html --output-file "${WORKSPACE}/reports/eslint/${BUILD_TAG}.html" .