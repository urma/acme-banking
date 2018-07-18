#!/bin/bash

# Check whether we are inside the Jeniks environment or not
[ -z ${WORKSPACE} ] && echo 'WORKSPACE is not defined. Please provide a WORKSPACE:'
read -r WORKSPACE

[ -z ${IMAGE_NAME} ] && echo 'IMAGE_NAME is not defined. Please provide an IMAGE_NAME:'
read -r IMAGE_NAME

[ -z ${IMAGE_ALIAS} ] && echo 'IMAGE_ALIAS is not defined. Please provide an IMAGE_ALIAS:'
read -r IMAGE_ALIAS

# Creating docker image
docker build --no-cache -t "${IMAGE_NAME}" "${WORKSPACE}"
docker tag "${IMAGE_NAME}" "${IMAGE_ALIAS}"
            
docker push "${IMAGE_NAME}"
docker push "${IMAGE_ALIAS}"

docker rmi "${IMAGE_NAME}"
docker rmi "${IMAGE_ALIAS}"
