#!/bin/bash

# Build the Docker images

echo "***********************************************"
echo "********** Building Docker Images *************"
echo "***********************************************"

cd jenkins/build/ && docker-compose -f docker-compose-build.yml build --no-cache

