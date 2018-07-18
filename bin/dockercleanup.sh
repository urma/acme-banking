#!/bin/bash

# Check whether there is any leftover docker stack from last build
if [ -n ${DOCKER_IMAGE_LATEST} ] then 
	# Obtain all containers spawned from the latest version of our image
	for label in $(docker ps --filter "ancestor=${DOCKER_IMAGE_LATEST}" --format "{{ .Labels }}") ; do
	  swarm=$(echo ${label} | tr ',' "\n" | grep 'com.docker.stack.namespace' | awk -F= '{ print $2; }')
	  echo "Found swarm [${swarm}]"
	  docker rm ${swarm}
	done
fi
