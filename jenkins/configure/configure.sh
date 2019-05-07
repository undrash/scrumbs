#!/bin/bash


echo "***** Validating arguments *****"

if [ $# -eq 17 ]
    then
        echo "Number of arguments is valid."
    else
            echo "Invalid number of arguments provided!"
	    echo "Expected: 11 (JWT_SECRET, ADMIN_SECRET, ADMIN_EMAIL_ADDRESS, SUPPORT_EMAIL_ADDRESS, SUPPORT_EMAIL_PW, MAILCHIMP_KEY)"
	        echo "JWT_SECRET"
	        echo "ADMIN_SECRET"
	        echo "ADMIN_EMAIL_ADDRESS"
	        echo "SUPPORT_EMAIL_ADDRESS"
	        echo "SUPPORT_EMAIL_PW"
	        echo "MAILCHIMP_KEY"
	        echo "TRELLO_API_KEY"
	        echo "TRELLO_SECRET"
	        echo "TRELLO_TOKEN"
	        echo "TRELLO_BUGS_LIST_ID"
	        echo "TRELLO_FEATURES_LIST_ID"
	        echo "GOOGLE_SECRET"
	        echo "GOOGLE_CLIENT_ID"
	        echo "TWITTER_SECRET"
	        echo "TWITTER_KEY"
	        echo "LINKEDIN_SECRET"
	        echo "LINKEDIN_KEY"
            echo "Provided: $#"
            exit 1
fi


JWT_SECRET=$1
ADMIN_SECRET=$2
ADMIN_EMAIL_ADDRESS=$3
SUPPORT_EMAIL_ADDRESS=$4
SUPPORT_EMAIL_PW=$5
MAILCHIMP_KEY=$6
TRELLO_API_KEY=$7
TRELLO_SECRET=$8
TRELLO_TOKEN=$9
TRELLO_BUGS_LIST_ID=${10}
TRELLO_FEATURES_LIST_ID=${11}
GOOGLE_SECRET=${12}
GOOGLE_CLIENT_ID=${13}
TWITTER_SECRET=${14}
TWITTER_KEY=${15}
LINKEDIN_SECRET=${16}
LINKEDIN_KEY=${17}


echo "*****************************************"
echo "** Injecting environment configuration **"
echo "*****************************************"


sed -i "s,<JWT_SECRET>,${JWT_SECRET},g" docker-cloud.yml
sed -i "s,<ADMIN_SECRET>,${ADMIN_SECRET},g" docker-cloud.yml
sed -i "s,<ADMIN_EMAIL_ADDRESS>,${ADMIN_EMAIL_ADDRESS},g" docker-cloud.yml
sed -i "s,<SUPPORT_EMAIL_ADDRESS>,${SUPPORT_EMAIL_ADDRESS},g" docker-cloud.yml
sed -i "s,<SUPPORT_EMAIL_PW>,${SUPPORT_EMAIL_PW},g" docker-cloud.yml
sed -i "s,<MAILCHIMP_KEY>,${MAILCHIMP_KEY},g" docker-cloud.yml
sed -i "s,<TRELLO_API_KEY>,${TRELLO_API_KEY},g" docker-cloud.yml
sed -i "s,<TRELLO_SECRET>,${TRELLO_SECRET},g" docker-cloud.yml
sed -i "s,<TRELLO_TOKEN>,${TRELLO_TOKEN},g" docker-cloud.yml
sed -i "s,<TRELLO_BUGS_LIST_ID>,${TRELLO_BUGS_LIST_ID},g" docker-cloud.yml
sed -i "s,<TRELLO_FEATURES_LIST_ID>,${TRELLO_FEATURES_LIST_ID},g" docker-cloud.yml
sed -i "s,<GOOGLE_SECRET>,${GOOGLE_SECRET},g" docker-cloud.yml
sed -i "s,<GOOGLE_CLIENT_ID>,${GOOGLE_CLIENT_ID},g" docker-cloud.yml
sed -i "s,<TWITTER_SECRET>,${TWITTER_SECRET},g" docker-cloud.yml
sed -i "s,<TWITTER_KEY>,${TWITTER_KEY},g" docker-cloud.yml
sed -i "s,<LINKEDIN_SECRET>,${LINKEDIN_SECRET},g" docker-cloud.yml
sed -i "s,<LINKEDIN_KEY>,${LINKEDIN_KEY},g" docker-cloud.yml

echo "*****************************************"
echo "******* Configuration successful ********"
echo "*****************************************"

