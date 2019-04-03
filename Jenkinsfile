pipeline {

    agent any

    environment {
        PASS = credentials('andrei_dockerhub_pw')
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
