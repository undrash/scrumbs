#!/bin/bash


echo "***** Validating arguments *****"

if [ $# -eq 4 ]
    then
        echo "Number of arguments is valid."
    else
            echo "Invalid number of arguments provided!"
	    echo "Expected: 4"
	    echo "CONSUMER_KEY CONSUMER_SECRET ACCESS_TOKEN ACCESS_SECRET"
            echo "Provided: $#"
            exit 1
fi

# PATH modification needed for http_post and oauth_sign
export PATH=$PATH:/usr/local/bin

CONSUMER_KEY=$1
CONSUMER_SECRET=$2
ACCESS_TOKEN=$3
ACCESS_SECRET=$4


MESSAGE=`git log --pretty=format:%s -n1`
TRIGGER="#tweet"

echo "***** Checking for trigger in commit message *****"

if [[ $MESSAGE != *$TRIGGER* ]];
then
        echo "***** Commit message doesn't contain trigger *****"
        exit 0
else
        echo "***** Commit message contains trigger, sending tweet... *****"
fi

MESSAGE=${MESSAGE//$TRIGGER/}

HASHTAGS="#scrumbs #scrum #development #agile #management #tools #typescript"

# Truncate commit messages that are longer than 150 characters
if [ ${#MESSAGE} -gt 150 ]
    then
        messsage_trunc=$(echo $TWEET | cut -c1-147)
        MESSAGE=${message_trunc}...
fi

TWEET="Dev Update 🚀  $MESSAGE  scrumbs.app  $HASHTAGS"

url="https://api.twitter.com/1.1/statuses/update.json"

http_post -h Authorization "$(oauth_sign \
$CONSUMER_KEY $CONSUMER_SECRET \
$ACCESS_TOKEN $ACCESS_SECRET \
POST "$url" status="$TWEET")" \
     "$url" status="$TWEET"

