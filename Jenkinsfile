pipeline {
    agent any

tools {
    nodejs 'node22'
}

    environment {
        GIT_CREDENTIALS = "f67a3a6b-1584-4061-ab57-80c7eac0fc6d"
        KUBE_NAMESPACE = "default"
        DOCKER_IMAGE = "react-app"
		KUBECONFIG      = "/home/hturubatla/.kube/config"
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
                // FIXED: more reliable check for running host
                sh '''
                    if ! minikube status | grep -q "host: Running"; then
                        minikube start --driver=docker
                    fi
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
                // FIXED: ensure BUILD_ID exists or fallback to BUILD_NUMBER
                sh '''
                    eval $(minikube docker-env)
                    docker build -t ${DOCKER_IMAGE}:${BUILD_ID:-${BUILD_NUMBER}} .
                    docker images | grep ${DOCKER_IMAGE}
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo "========== UPDATING IMAGE IN DEPLOYMENT YAML =========="
                // FIXED: safer alternative using kubectl set image instead of sed
                sh """
                    kubectl set image deployment/rbac rbac=${DOCKER_IMAGE}:${BUILD_ID:-${BUILD_NUMBER}} -n ${KUBE_NAMESPACE} || echo "Deployment not found, applying YAML..."
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
