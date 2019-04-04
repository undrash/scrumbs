#!/bin/bash


echo "***** Validating arguments *****"

if [ $# -eq 5 ]
    then
        echo "Number of arguments is valid."
    else
            echo "Invalid number of arguments provided!"
	    echo "Expected: 4 (JWT_SECRET, ADMIN_SECRET, ADMIN_EMAIL_ADDRESS, SUPPORT_EMAIL_ADDRESS, SUPPORT_EMAIL_PW)"
            echo "Provided: $#"
            exit 1
fi


JWT_SECRET=$1
ADMIN_SECRET=$2
ADMIN_EMAIL_ADDRESS=$3
SUPPORT_EMAIL_ADDRESS=$4
SUPPORT_EMAIL_PW=$5


echo "*****************************************"
echo "** Injecting environment configuration **"
echo "*****************************************"


sed -i "s,<JWT_SECRET>,${JWT_SECRET},g" docker-cloud.yml
sed -i "s,<ADMIN_SECRET>,${ADMIN_SECRET},g" docker-cloud.yml
sed -i "s,<ADMIN_EMAIL_ADDRESS>,${ADMIN_EMAIL_ADDRESS},g" docker-cloud.yml
sed -i "s,<SUPPORT_EMAIL_ADDRESS>,${SUPPORT_EMAIL_ADDRESS},g" docker-cloud.yml
sed -i "s,<SUPPORT_EMAIL_PW>,${SUPPORT_EMAIL_PW},g" docker-cloud.yml


echo "*****************************************"
echo "******* Configuration successful ********"
echo "*****************************************"

