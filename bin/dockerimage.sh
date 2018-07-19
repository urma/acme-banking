#!/bin/bash

# Check whether we are inside the Jeniks environment or not
[ -z "${WORKSPACE}" ] && echo 'WORKSPACE is not defined.' && exit

[ -z "${IMAGE_NAME}" ] && echo 'IMAGE_NAME is not defined.' && exit

[ -z "${IMAGE_ALIAS}" ] && echo 'IMAGE_ALIAS is not defined.' && exit

# Creating docker image
docker build --no-cache -t "${IMAGE_NAME}" "${WORKSPACE}"
docker tag "${IMAGE_NAME}" "${IMAGE_ALIAS}"
            
docker push "${IMAGE_NAME}"
docker push "${IMAGE_ALIAS}"

docker rmi "${IMAGE_NAME}"
docker rmi "${IMAGE_ALIAS}"

docker service ls
docker service rm "jenkins-acme-banking-103_webapp"
# Sleep FFS
sleep 10
