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

        stage('Commit and Push Build Artifacts') {
            steps {
                // ---vvv- THIS IS THE FIX -vvv---
                // Add the dir() step to run Git commands in the correct directory
                dir(env.PROJECT_DIR) {
                    withCredentials([usernamePassword(credentialsId: env.GITHUB_CREDENTIALS_ID, usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                        echo "Configuring Git user..."
                        bat 'git config --global user.name "Jenkins Build"'
                        bat 'git config --global user.email "jenkins@localhost"'
                        
                        echo "Committing and pushing the new 'public' folder..."
                        bat 'git add backend/public'
                        bat 'git diff-index --quiet HEAD || git commit -m "feat(ci): Add latest production build"'
                        // NOTE: Remember to replace 'your-username/your-repo.git'
                        bat "git push https://${env.GIT_USER}:${env.GIT_TOKEN}@github.com/your-username/your-repo.git main"
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