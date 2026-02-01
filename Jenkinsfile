pipeline {
    agent {
        docker {
            // Node + npm for build
            image 'node:18'
            // Mount Docker socket to build Docker images
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        // Kubernetes namespace
        KUBE_NAMESPACE = "deployments"
        // Git credentials (if needed)
        GIT_CREDENTIALS = "f67a3a6b-1584-4061-ab57-80c7eac0fc6d"
    }

    stages {

        stage('Checkout Source') {
            steps {
                git(
                    branch: '002-JenkinsFileTesting',  // replace with your branch
                    url: 'https://github.com/TurubatlaHemanth/rbac-ui.git',
                    credentialsId: env.GIT_CREDENTIALS
                )
            }
        }

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
                sh "docker build -t react-app:${BUILD_ID} ."
            }
        }

        stage('Deploy to Kubernetes') {
            agent {
                docker {
                    // Kubectl container for deployment
                    image 'bitnami/kubectl:latest'
                    args '-v $HOME/.kube:/root/.kube' // mount kubeconfig
                }
            }
            steps {
                sh """
                    sed -i 's|image: .*|image: react-app:${BUILD_ID}|g' k8s/deployment.yaml
                """
                sh "kubectl apply -f k8s/deployment.yaml -n ${KUBE_NAMESPACE}"
                sh "kubectl apply -f k8s/service.yaml -n ${KUBE_NAMESPACE}"
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
