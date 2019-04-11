#!/bin/sh


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
HASHTAGS="#scrumbs #scrum #development #agile #management #tools #typescript"
TWEET="Dev Update $MESSAGE | Website: scrumbs.app  $HASHTAGS"

# truncate tweets that are longer than 140 characters
if [ ${#TWEET} -gt 140 ]
    then
        tweet_trunc=$(echo $TWEET | cut -c1-137)
        TWEET=${tweet_trunc}...
fi


url="https://api.twitter.com/1.1/statuses/update.json"

http_post -h Authorization "$(oauth_sign \
$CONSUMER_KEY $CONSUMER_SECRET \
$ACCESS_TOKEN $ACCESS_SECRET \
POST "$url" status="$TWEET")" \
     "$url" status="$TWEET"

