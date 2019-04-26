pipeline {

    agent any

    environment {
        DOCKER_PASS = credentials('andrei_dockerhub_pw')

        JWT_SECRET = credentials('scrumbs_jwt_secret')
        ADMIN_SECRET = credentials('scrumbs_admin_secret')
        ADMIN_EMAIL_ADDRESS = credentials('scrumbs_admin_email')
        SUPPORT_EMAIL_ADDRESS = credentials('scrumbs_support_email')
        SUPPORT_EMAIL_PW = credentials('scrumbs_support_pw')
        MAILCHIMP_KEY = credentials('mailchimp_key')

		CONSUMER_KEY = credentials('scrumbs_git_twitter_consumer_key')
		CONSUMER_SECRET = credentials('scrumbs_git_twitter_consumer_secret')
		ACCESS_TOKEN = credentials('scrumbs_git_twitter_access_token')
		ACCESS_SECRET = credentials('scrumbs_git_twitter_access_secret')

        TRELLO_API_KEY = credentials('trello_api_key')
        TRELLO_SECRET = credentials('trello_secret')
        TRELLO_TOKEN = credentials('trello_token')
        TRELLO_BUGS_LIST_ID = credentials('trello_bugs_list_id')
        TRELLO_FEATURES_LIST_ID = credentials('trello_features_list_id')

		HOST_NAME = 'scrumbs'
		HOST_ADDRESS = '165.227.168.111'
    }

    stages {

		stage('Install Dependencies') {
            steps {
                sh 'cd ./scrumbs-client && npm install'
                sh 'cd ./scrumbs-app && npm install'
                sh 'cd ./scrumbs-website && npm install'
            }

        }

		stage('Build Project') {
            steps {
                sh 'cd ./scrumbs-client && npm run build'
                sh 'cd ./scrumbs-app && npm run build'
                sh 'cd ./scrumbs-website && npm run buildall'
            }

        }

        stage('Configure Environment Variables') {
            steps {
                sh 'sed -i -e \'s/\\r\$//\' jenkins/configure/configure.sh'
                sh 'chmod +x jenkins/configure/configure.sh'
                sh './jenkins/configure/configure.sh $JWT_SECRET $ADMIN_SECRET $ADMIN_EMAIL_ADDRESS $SUPPORT_EMAIL_ADDRESS $SUPPORT_EMAIL_PW \"$MAILCHIMP_KEY\" $TRELLO_API_KEY $TRELLO_SECRET $TRELLO_TOKEN $TRELLO_BUGS_LIST_ID $TRELLO_FEATURES_LIST_ID'
            }

        }

        stage('Build Docker Images') {
            steps {
                sh 'sed -i -e \'s/\\r\$//\' jenkins/build/build.sh'
                sh 'chmod +x jenkins/build/build.sh'
                sh './jenkins/build/build.sh'
            }

        }

        stage('Push Docker Images') {
            steps {
                sh 'sed -i -e \'s/\\r\$//\' jenkins/push/push.sh'
                sh 'chmod +x jenkins/push/push.sh'
                sh './jenkins/push/push.sh $DOCKER_PASS'
            }
        }

        stage('SHH Auth') {
			steps {
                script {
                    method_remote_deploy()
                }
            }
        }

        stage('Tweet Update') {
            steps {
                sh 'sed -i -e \'s/\\r\$//\' jenkins/tweet/tweet.sh'
                sh 'chmod +x jenkins/tweet/tweet.sh'
                sh './jenkins/tweet/tweet.sh $CONSUMER_KEY $CONSUMER_SECRET $ACCESS_TOKEN $ACCESS_SECRET'
            }
        }
    }
}


def method_remote_deploy() {
	withCredentials([
		sshUserPrivateKey(credentialsId: '6a21dfc5-0b96-4139-b7a6-0d6111966291', usernameVariable: 'USER', keyFileVariable: 'KEYFILE')
	]) {
	
		def remote = [:]
		remote.user = "${USER}"
		remote.host = "${HOST_ADDRESS}"
		remote.name = "${HOST_NAME}"
		remote.allowAnyHosts = true
		remote.identityFile = "${KEYFILE}"
		
		
		stage('Deploy to cluster') {
            sshCommand remote: remote, command: "echo \"${DOCKER_PASS}\" | docker login -u gasparandr --password-stdin"
		    sshPut remote: remote, from: 'docker-cloud.yml', into: '.'
		    sshScript remote: remote, script: "jenkins/deploy/deploy.sh"
		}
	}
}
