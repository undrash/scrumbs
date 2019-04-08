#!/bin/bash


echo "***** Validating arguments *****"

if [ $# -eq 6 ]
    then
        echo "Number of arguments is valid."
    else
            echo "Invalid number of arguments provided!"
	    echo "Expected: 6 (JWT_SECRET, ADMIN_SECRET, ADMIN_EMAIL_ADDRESS, SUPPORT_EMAIL_ADDRESS, SUPPORT_EMAIL_PW, MAILCHIMP_KEY)"
            echo "Provided: $#"
            exit 1
fi


JWT_SECRET=$1
ADMIN_SECRET=$2
ADMIN_EMAIL_ADDRESS=$3
SUPPORT_EMAIL_ADDRESS=$4
SUPPORT_EMAIL_PW=$5
MAILCHIMP_KEY=$6


echo "*****************************************"
echo "** Injecting environment configuration **"
echo "*****************************************"


sed -i "s,<JWT_SECRET>,${JWT_SECRET},g" docker-cloud.yml
sed -i "s,<ADMIN_SECRET>,${ADMIN_SECRET},g" docker-cloud.yml
sed -i "s,<ADMIN_EMAIL_ADDRESS>,${ADMIN_EMAIL_ADDRESS},g" docker-cloud.yml
sed -i "s,<SUPPORT_EMAIL_ADDRESS>,${SUPPORT_EMAIL_ADDRESS},g" docker-cloud.yml
sed -i "s,<SUPPORT_EMAIL_PW>,${SUPPORT_EMAIL_PW},g" docker-cloud.yml
sed -i "s,<MAILCHIMP_KEY>,${MAILCHIMP_KEY},g" docker-cloud.yml

echo "*****************************************"
echo "******* Configuration successful ********"
echo "*****************************************"

