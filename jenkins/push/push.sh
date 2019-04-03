#!/bin/bash

echo "***********************************************"
echo "*********** Pushing Docker Images *************"
echo "***********************************************"

echo "*************** Logging In ********************"

docker login -u gasparandr -p $PASS

echo "************* Tagging Images ******************"

docker tag scrumbs-app:latest gasparandr/scrumbs-app:latest
docker tag scrumbs-proxy:latest gasparandr/scrumbs-proxy:latest
docker tag scrumbs-website:latest gasparandr/scrumbs-website:latest

echo "************* Pushing Images ******************"

docker push gasparandr/scrumbs-app:latest
docker push gasparandr/scrumbs-proxy:latest
docker push gasparandr/scrumbs-website:latest

