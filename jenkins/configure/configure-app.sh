#!/bin/bash


echo "***** Validating arguments *****"

if [ $# -eq 3 ]
    then
        echo "Number of arguments is valid."
    else
            echo "Invalid number of arguments provided!"
            echo "Expected: 3"
            echo "Provided: $#"
            exit 1
fi


JWT_SECRET=$1
SUPPORT_EMAIL_ADDRESS=$2
SUPPORT_EMAIL_PW=$3


echo "***** Generating Dockerfile *****"


cp Dockerfile-template  Dockerfile


echo "*****************************************"
echo "** Injecting environment configuration **"
echo "*****************************************"


sed -i "s,<JWT_SECRET>,${JWT_SECRET},g" Dockerfile
sed -i "s,<SUPPORT_EMAIL_ADDRESS>,${SUPPORT_EMAIL_ADDRESS},g" Dockerfile
sed -i "s,<SUPPORT_EMAIL_PW>,${SUPPORT_EMAIL_PW},g" Dockerfile


echo "*****************************************"
echo "******* Configuration successful ********"
echo "*****************************************"

