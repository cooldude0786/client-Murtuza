pipeline {
    agent any

    environment {
        PROJECT_DIR = 'D:\\project\\ClinetMurtuzaBhai'
        GITHUB_CREDENTIALS_ID = 'github-credentials' 
    }

    stages {
        stage('Install Frontend Dependencies') {
            steps {
                dir("${env.PROJECT_DIR}\\frontend") {
                    bat 'npm install'
                }
            }
        }

        stage('Run Frontend Tests') {
            steps {
                dir("${env.PROJECT_DIR}\\frontend") {
                    bat 'npm test'
                }
            }
        }

        stage('Build React App') {
            steps {
                dir("${env.PROJECT_DIR}\\frontend") {
                    bat 'npm run build'
                }
            }
        }

        stage('Deploy to Backend') {
            steps {
                dir(env.PROJECT_DIR) {
                    echo 'Deploying build artifacts...'
                    bat 'if exist backend\\public ( rmdir /s /q backend\\public )'
                    bat 'xcopy frontend\\dist backend\\public /E /I /Y'
                    echo 'Deployment complete.'
                }
            }
        }

        stage('Commit and Push All Changes') {
            steps {
                dir(env.PROJECT_DIR) {
                    withCredentials([usernamePassword(credentialsId: env.GITHUB_CREDENTIALS_ID, usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                        echo "Configuring Git user..."
                        bat 'git config --global user.name "Jenkins Build"'
                        bat 'git config --global user.email "jenkins@localhost"'

                        echo "Staging all changes..."
                        bat 'git add -A'

                        script {
                            def changes = bat(script: 'git status --porcelain', returnStdout: true).trim()
                            if (changes) {
                                echo "Found changes, creating commit..."
                                bat 'git commit -m "feat(ci): Add latest production build"'

                              echo "Pushing changes to remote repository..."
bat 'git push https://' + env.GIT_USER + ':' + env.GIT_TOKEN + '@github.com/cooldude0786/client-Murtuza.git main'

                            } else {
                                echo "No new changes to commit."
                            }
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
