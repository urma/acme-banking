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
            sh '/bin/sh -x ${WORKSPACE}/bin/npm.sh'
        }
    }
    stage('ESLint'){
        steps{
            sh '/bin/sh -x ${WORKSPACE}/bin/eslint.sh'
        }
    }
    stage('Docker Image'){
        steps{
            sh '/bin/sh -x ${WORKSPACE}/bin/dockerimage.sh'
        }
    }
    stage('Docker Clean-up'){
        steps{
            sh '/bin/sh -x ${WORKSPACE}/bin/dockercleanup.sh'
        }
    }
    stage ('Docker Deploy & Zap Scan'){
        steps{
            sh '/bin/sh -x ${WORKSPACE}/bin/zapscan.sh'
        }
    }
  }
}
