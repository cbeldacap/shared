pipeline {
  agent any
  stages {
    stage('checkout') {
      steps {
        git(url: 'https://github.com/cbeldacap/shared', branch: 'master', credentialsId: 'cbeldacap')
      }
    }
    stage('print message') {
      steps {
        echo 'hello from Openshift!'
      }
    }
  }
}