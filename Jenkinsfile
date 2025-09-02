pipeline {
    agent any

    environment {
        PROJECT_DIR = 'D:/project/ClinetMurtuzaBhai'
    }

    stages {
        stage('Check and Commit Changes') {
            steps {
                dir("${env.PROJECT_DIR}") {
                    script {
                        def gitStatus = sh(script: 'git status --porcelain', returnStdout: true).trim()
                        if (gitStatus) {
                            echo "Found uncommitted changes. Staging and committing..."
                            sh 'git add .'
                            sh 'git commit -m "Done by Jenkins"'
                        } else {
                            echo "Working directory is clean. No commit needed."
                        }
                    }
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir("${env.PROJECT_DIR}/frontend") {
                    sh 'npm install'
                }
            }
        }

        stage('Run Frontend Tests') {
            steps {
                dir("${env.PROJECT_DIR}/frontend") {
                    sh 'npm test'
                }
            }
        }

        stage('Build React App') {
            steps {
                dir("${env.PROJECT_DIR}/frontend") {
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy to Backend') {
            steps {
                dir("${env.PROJECT_DIR}") {
                    sh 'rm -rf backend/public'
                    sh 'cp -r frontend/dist/. backend/public/'
                    echo 'Deployment complete.'
                }
            }
        }

        stage('Stage New Build Artifacts') {
            steps {
                dir("${env.PROJECT_DIR}") {
                    echo "Staging newly created 'public' folder..."
                    sh 'git add backend/public'
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
    }
}
