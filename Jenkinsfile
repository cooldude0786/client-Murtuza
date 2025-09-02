pipeline {
    agent any

    environment {
        // The absolute path to your project on the Jenkins server
        PROJECT_DIR = 'D:\\project\\ClinetMurtuzaBhai'
        // The ID of the credentials you created in Jenkins
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

        stage('Stage and Commit Build Artifacts') {
            steps {
                dir(env.PROJECT_DIR) {
                    echo "Staging and committing newly created 'public' folder..."
                    bat 'git add backend/public'
                    bat 'git commit -m "feat: Add latest production build"'
                }
            }
        }

        stage('Push to Remote') {
            steps {
                dir(env.PROJECT_DIR) {
                    withCredentials([usernamePassword(credentialsId: env.GITHUB_CREDENTIALS_ID, usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                        echo "Pushing changes to remote repository..."
                        // NOTE: Replace 'your-username/your-repo.git' with your actual repository details
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
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}