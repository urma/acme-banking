#!/bin/bash

# Creating docker image
docker build --no-cache -t "${IMAGE_NAME}" "${WORKSPACE}"
docker tag "${IMAGE_NAME}" "${IMAGE_ALIAS}"
            
docker push "${IMAGE_NAME}"
docker push "${IMAGE_ALIAS}"

docker rmi "${IMAGE_NAME}"
docker rmi "${IMAGE_ALIAS}"