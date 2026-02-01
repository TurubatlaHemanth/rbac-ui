pipeline {
    agent any

    tools {
        // NodeJS tool installed via NodeJS Plugin
        nodejs 'node18'  // Make sure this matches the name in Jenkins Global Tool Config
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
                git(
                    branch: '002-JenkinsFileTesting', // Replace with your branch
                    url: 'https://github.com/TurubatlaHemanth/rbac-ui.git',
                    credentialsId: env.GIT_CREDENTIALS
                )
            }
        }

        stage('Install & Build App') {
            steps {
                echo "Building NodeJS application..."
                sh 'node -v'
                sh 'npm -v'
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh """
                    docker build -t ${DOCKER_IMAGE}:${BUILD_ID} .
                    docker images | grep ${DOCKER_IMAGE}
                """
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo "Deploying to Kubernetes namespace ${KUBE_NAMESPACE}..."
                // Update deployment.yaml image
                sh """
                    sed -i 's|image: .*|image: ${DOCKER_IMAGE}:${BUILD_ID}|g' k8s/deployment.yaml
                """

                // Apply manifests
                sh "kubectl apply -f k8s/deployment.yaml -n ${KUBE_NAMESPACE}"
                sh "kubectl apply -f k8s/service.yaml -n ${KUBE_NAMESPACE}"
            }
        }
    }

    post {
        success {
            echo "✅ Application built and deployed to Kubernetes successfully!"
        }
        failure {
            echo "❌ Build or deploy failed. Check the logs above."
        }
    }
}
