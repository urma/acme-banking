pipeline {
  agent any
  environment {
    /* Tag image using Docker registry and build tag */
    IMAGE_NAME="${DOCKER_REGISTRY}/psc/acme-banking:${BUILD_TAG}"
    IMAGE_ALIAS="${DOCKER_REGISTRY}/psc/acme-banking:latest"
  }
  stages {
    stage('Build'){
      steps{
        sh 'npm install'
      }
    }
    /* ESlint is installed as a dependency, and thus must happen after build */
    stage('ESLint'){
      steps{
        sh 'npx eslint ${WORKSPACE}'
      }
    }
    stage('Software Composition Analysis'){
      steps{
        sh 'snyk test'
        sh 'npm audit'
      }
    }
    // stage('Docker Image'){
    //   steps{
    //     withCredentials([string(credentialsId: 'AQUA_TOKEN', variable: 'AQUA_TOKEN')]) {
    //       sh '/bin/sh -x ${WORKSPACE}/bin/dockerimage.sh'
    //     }
    //   }
    // }
    // stage('Docker Clean-up'){
    //   steps{
    //     sh '/bin/sh -x ${WORKSPACE}/bin/dockercleanup.sh'
    //   }
    // }
    // stage ('Docker Deploy & Zap Scan'){
    //   steps{
    //     sh '/bin/sh -x ${WORKSPACE}/bin/zapscan.sh'
    //   }
    // }
    // stage('Threadfix Result'){
    //   steps{
    //     withCredentials([string(credentialsId: 'THREADFIX_API_KEY', variable: 'THREADFIX_API_KEY')]) {
    //       sh '/bin/sh -x ${WORKSPACE}/bin/threadfix.sh'
    //     }
    //   }
    // }
  }
}
