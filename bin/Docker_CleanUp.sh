#!/bin/bash

# Obtain all containers spawned from the latest version of our image
for label in $(docker ps --filter "ancestor=${DOCKER_IMAGE_LATEST}" --format "{{ .Labels }}") ; do
  swarm=$(echo ${label} | tr ',' "\n" | grep 'com.docker.stack.namespace' | awk -F= '{ print $2; }')
  echo "Found swarm [${swarm}]"
  docker rm ${swarm}
done
