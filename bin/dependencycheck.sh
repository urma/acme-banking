#!/bin/bash

# Check whether we are inside the Jeniks environment or not
[ -z "${WORKSPACE}" ] && echo 'WORKSPACE is not defined.' && exit

# HACK: File permission issues between Docker volume and host
# filesystem
export REPORT_VOLUME="${WORKSPACE}/reports/owasp-dependency-check"
mkdir -p "${REPORT_VOLUME}"
chmod -R 777 "${REPORT_VOLUME}"

# Run OWASP Dependency Check Dockerfile
docker pull owasp/dependency-check
docker run \
  --rm \
  --volume ${WORKSPACE}:/src \
  --volume dependencydb:/usr/share/dependency-check/data \
  --volume ${REPORT_VOLUME}:/report \
  owasp/dependency-check \
  --scan /src/package.json \
  --format "ALL" \
  --project "acme-banking" \
  -o /report