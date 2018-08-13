#!/bin/bash

# Check whether we are inside the Jeniks environment or not
[ -z "${WORKSPACE}" ] && echo 'WORKSPACE is not defined.' && exit

[ -z "${IMAGE_NAME}" ] && echo 'IMAGE_NAME is not defined.' && exit

[ -z "${IMAGE_ALIAS}" ] && echo 'IMAGE_ALIAS is not defined.' && exit

# Creating docker image
docker build --no-cache --build-arg=token=${AQUA_TOKEN} -t "${IMAGE_NAME}" "${WORKSPACE}"
docker tag "${IMAGE_NAME}" "${IMAGE_ALIAS}"

# Get Aqua microscanner report
mkdir -p "${WORKSPACE}/reports/aqua"
docker run --rm "${IMAGE_NAME}" cat /microscanner_report.html > ${WORKSPACE}/reports/aqua/${BUILD_TAG}.html
            
docker push "${IMAGE_NAME}"
docker push "${IMAGE_ALIAS}"

docker rmi "${IMAGE_NAME}"
docker rmi "${IMAGE_ALIAS}"

# Sleep FFS
sleep 10
