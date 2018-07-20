#!/bin/bash

# Obtain all containers spawned from the latest version of our image
for stack in $(docker stack ls --format '{{.Name}}' | grep 'jenkins-acme-banking') ; do
  echo "Removing currently running stack: ${stack}"
  docker stack rm ${stack}
  sleep 5
done
