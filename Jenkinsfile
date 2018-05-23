pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'npm install'
      }
    }
    stage('Audit') {
      steps {
        sh 'npm audit'
      }
    }
  }
}