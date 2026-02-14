pipeline {
    agent any

    tools {
        nodejs 'node18'
    }

    environment {
        GIT_CREDENTIALS = "f67a3a6b-1584-4061-ab57-80c7eac0fc6d"
        KUBE_NAMESPACE = "deployments"
        DOCKER_IMAGE = "react-app"
    }

    stages {

        stage('Checkout Source') {
            steps {
                echo "========== CHECKOUT STAGE =========="
                sh 'pwd'
                sh 'ls -la'

                git(
                    branch: '002-JenkinsFileTesting',
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
            }
        }

        stage('Start Minikube') {
            steps {
                echo "========== CHECKING MINIKUBE =========="
                sh '''
                    minikube status | grep Running || minikube start --driver=docker
                '''

                echo "========== VERIFY CLUSTER =========="
                sh '''
                    kubectl config use-context minikube
                    kubectl get nodes
                '''
            }
        }

        stage('Ensure Namespace Exists') {
            steps {
                echo "========== CHECKING NAMESPACE =========="
                sh '''
                    kubectl get namespace ${KUBE_NAMESPACE} || kubectl create namespace ${KUBE_NAMESPACE}
                '''
            }
        }

        stage('Build Docker Image Inside Minikube') {
            steps {
                echo "========== BUILDING IMAGE INSIDE MINIKUBE =========="
                sh '''
                    eval $(minikube docker-env)
                    docker build -t ${DOCKER_IMAGE}:${BUILD_ID} .
                    docker images | grep ${DOCKER_IMAGE}
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo "========== UPDATING IMAGE IN DEPLOYMENT YAML =========="
                sh """
                    sed -i 's|image: .*|image: ${DOCKER_IMAGE}:${BUILD_ID}|g' k8s/deployment.yaml
                """

                echo "========== APPLYING MANIFESTS =========="
                sh """
                    kubectl apply -f k8s/deployment.yaml -n ${KUBE_NAMESPACE}
                    kubectl apply -f k8s/service.yaml -n ${KUBE_NAMESPACE}
                """

                echo "========== VERIFYING DEPLOYMENT =========="
                sh """
                    kubectl get pods -n ${KUBE_NAMESPACE}
                    kubectl get svc -n ${KUBE_NAMESPACE}
                """
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
            sh "kubectl describe pods -n ${KUBE_NAMESPACE} || true"
        }
    }
}
