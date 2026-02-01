pipeline {
    agent any

    tools {
        nodejs 'node18'
    }
    environment {
        // Set the credentials ID you added in Jenkins for Git
        GIT_CREDENTIALS = "f67a3a6b-1584-4061-ab57-80c7eac0fc6d"

        // Optional: Set Kubernetes namespace (default if blank)
        KUBE_NAMESPACE = "deployments"
    }

    stages {

     stage('Install & Build App') {
            steps {                
				sh 'node -v'
                sh 'npm -v'
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t react-app:${BUILD_ID} .'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh """
                        sed -i 's|image: .*|image: react-app:${BUILD_ID}|g' k8s/deployment.yaml
                    """
					
                    sh "kubectl apply -f k8s/deployment.yaml -n ${KUBE_NAMESPACE}"
                    sh "kubectl apply -f k8s/service.yaml -n ${KUBE_NAMESPACE}"
                }
            }
        }
    }

    post {
        success {
            echo "Application built and deployed to Kubernetes successfully!"
        }
        failure {
            echo "Build or deploy failed. See logs above."
        }
    }
}
