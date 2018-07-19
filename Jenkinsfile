pipeline {
  agent any
  environment {
    /* Tag image using Docker registry and build tag */
    IMAGE_NAME="${DOCKER_REGISTRY}/psc/acme-banking:${BUILD_TAG}"
    IMAGE_ALIAS="${DOCKER_REGISTRY}/psc/acme-banking:latest"
  }
  stages {
    stage('ESLint'){
        steps{
            sh '${WORKSPACE}/bin/eslint.sh'
        }
    }
    stage('Build'){
        steps{
            sh '${WORKSPACE}/bin/npm.sh'
        }
    }
    stage('Docker Image'){
        steps{
            sh '${WORKSPACE}/bin/dockerimage.sh'
        }
    }
    stage('Docker Clean-up'){
        steps{
            sh '${WORKSPACE}/bin/dockercleanup.sh'
        }
    }
    stage ('Docker Deploy & Zap Scan'){
        steps{
            sh '${WORKSPACE}/bin/zapscan.sh'
        }
    }
  }
}
