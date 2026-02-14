pipeline {
    agent any

    tools {
        nodejs 'node18'
    }

    environment {
        // Git credentials stored in Jenkins
        GIT_CREDENTIALS = "f67a3a6b-1584-4061-ab57-80c7eac0fc6d"
        // Kubernetes namespace
        KUBE_NAMESPACE = "deployments"
        // Docker image name
        DOCKER_IMAGE = "react-app"
    }

    stages {

        stage('Checkout Source') {
            steps {
                echo "========== CHECKOUT STAGE =========="
                sh 'pwd'
                sh 'ls -la'

                git(
				    branch: '002-JenkinsFileTesting', // Replace with your branch
                    url: 'https://github.com/TurubatlaHemanth/rbac-ui.git',
                    credentialsId: env.GIT_CREDENTIALS
                )

                echo "Checkout completed"
                sh 'ls -la'
            }
        }

        stage('Install & Build App') {
            steps {
                echo "========== BUILD NODE APP =========="
                sh 'node -v'
                sh 'npm -v'

                sh 'npm install'
                sh 'npm run build'

                echo "Node build completed"
                sh 'ls -la'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "========== DOCKER BUILD =========="
                sh 'docker version'
                sh 'docker info || true'

                sh """
                    docker build -t ${DOCKER_IMAGE}:${BUILD_ID} .
                """

                echo "Docker image built successfully"
                sh "docker images | grep ${DOCKER_IMAGE}"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo "========== KUBERNETES DEPLOY =========="
                sh 'kubectl version --client'
                sh "kubectl get ns || true"

                echo "Updating deployment.yaml image..."
                sh """
                    sed -i 's|image: .*|image: ${DOCKER_IMAGE}:${BUILD_ID}|g' k8s/deployment.yaml
                """

                echo "Updated deployment.yaml:"
                sh "cat k8s/deployment.yaml"

                echo "Applying Kubernetes manifests..."
                sh "kubectl apply -f k8s/deployment.yaml -n ${KUBE_NAMESPACE}"
                sh "kubectl apply -f k8s/service.yaml -n ${KUBE_NAMESPACE}"

                echo "Checking pod status..."
                sh "kubectl get pods -n ${KUBE_NAMESPACE}"
            }
        }
    }

    post {
        success {
            echo "✅ Application built and deployed successfully!"
        }
        failure {
            echo "❌ Build or deploy failed."
            echo "========== DEBUG INFO =========="
            sh 'docker images || true'
            sh "kubectl get pods -n ${KUBE_NAMESPACE} || true"
        }
    }
}
