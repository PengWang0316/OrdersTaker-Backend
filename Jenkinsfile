pipeline {
    agent {
        docker {
            image 'node:8.11.4-alpine' 
            args '-p 3000:3000' 
        }
    }
    stages {
        stage('Build') { 
            steps {
                sh 'apt-get update'
                sh 'apt-get install python'
                sh 'npm install' 
            }
        }
    }
}