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
                sh './jenkins/configure/configure.sh $JWT_SECRET $ADMIN_SECRET $ADMIN_EMAIL_ADDRESS $SUPPORT_EMAIL_ADDRESS $SUPPORT_EMAIL_PW $MAILCHIMP_KEY'
            }

        }

        stage('Build Docker Images') {
            steps {
                sh './jenkins/build/build.sh'
            }

        }

        stage('Push Docker Images') {
            steps {
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
