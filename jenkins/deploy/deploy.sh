#!/bin/bash

# Deploy to Swarm

echo "***********************************************"
echo "********* Deploying on Remote Host ************"
echo "***********************************************"

docker stack deploy --compose-file docker-cloud.yml scrumbs 

