pipeline {

    agent any

    environment {
        DOCKER_PASS = credentials('andrei_dockerhub_pw')
        JWT_SECRET = credentials('scrumbs_jwt_secret')
        SUPPORT_EMAIL_ADDRESS = credentials('scrumbs_support_email')
        SUPPORT_EMAIL_PW = credentials('scrumbs_support_pw')
        ADMIN_SECRET = credentials('scrumbs_admin_secret')
        ADMIN_EMAIL_ADDRESS = credentials('scrumbs_admin_email')
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
                sh 'cd ./scrumbs-website && npm run build'
            }

        }

        stage('Configure Environment Variables') {
            steps {
                sh 'cd ./scrumbs-app && ../jenkins/configure/configure-app.sh $JWT_SECRET $SUPPORT_EMAIL_ADDRESS $SUPPORT_EMAIL_PW'
                sh 'cd ./scrumbs-website && ../jenkins/configure/configure-app.sh $ADMIN_SECRET $ADMIN_EMAIL_ADDRESS $SUPPORT_EMAIL_ADDRESS $SUPPORT_EMAIL_PW'
            }

        }

        stage('Build Docker Images') {
            steps {
                sh './jenkins/build/build.sh'
            }

        }

        stage('Push Docker Images') {
            steps {
                sh './jenkins/push/push.sh'
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
		sshUserPrivateKey(credentialsId: 'scrumbs_andrei', usernameVariable: 'USER', keyFileVariable: 'KEYFILE')
	]) {
	
		def remote = [:]
		remote.user = "${USER}"
		remote.host = "${HOST_ADDRESS}"
		remote.name = "${HOST_NAME}"
		remote.allowAnyHosts = true
		remote.identityFile = "${KEYFILE}"
		
		
		stage('Deploy to cluster') {
            sshCommand remote: remote, command: "echo \"${PASS}\" | docker login -u gasparandr --password-stdin"
		    sshPut remote: remote, from: 'docker-cloud.yml', into: '.'
		    sshScript remote: remote, script: "jenkins/deploy/deploy.sh"
		}
	}
}
