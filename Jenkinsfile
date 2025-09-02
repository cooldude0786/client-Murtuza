pipeline {
    agent any

    stages {
        stage('Execute Build in Project Directory') {
            steps {
                // Change directory to your project's location
                dir('D:/project/ClinetMurtuzaBhai') {
                    
                    stage('Check and Commit Changes') {
                        steps {
                            // This script block allows for conditional logic
                            script {
                                // Check if there are any uncommitted changes
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

                    stage('Install Frontend Dependencies') {
                        steps {
                            dir('frontend') {
                                sh 'npm install'
                            }
                        }
                    }

                    stage('Run Frontend Tests') {
                        steps {
                            dir('frontend') {
                                sh 'npm test'
                            }
                        }
                    }

                    stage('Build React App') {
                        steps {
                            dir('frontend') {
                                sh 'npm run build'
                            }
                        }
                    }

                    stage('Deploy to Backend') {
                        steps {
                            sh 'rm -rf backend/public'
                            sh 'cp -r frontend/dist/. backend/public/'
                            echo 'Deployment complete.'
                        }
                    }

                    stage('Stage New Build Artifacts') {
                        steps {
                            echo "Staging newly created 'public' folder..."
                            sh 'git add backend/public'
                        }
                    }
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