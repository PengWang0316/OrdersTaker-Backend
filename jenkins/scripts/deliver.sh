echo 'Stopping the pm2 Node instance'
ssh -o StrictHostKeyChecking=no ubuntu@orderstaker.kevin-project.com sudo pm2 stop App
echo 'Copying the package.json file to the remote server'
scp -r -o StrictHostKeyChecking=no /var/jenkins_home/workspace/OrdersTakerBackEnd/package.json ubuntu@orderstaker.kevin-project.com:NodeFiles/
echo 'Copying all source code to the remote server'
scp -r -o StrictHostKeyChecking=no /var/jenkins_home/workspace/OrdersTakerBackEnd/src ubuntu@orderstaker.kevin-project.com:NodeFiles/
echo 'Changing the working directory, run npm i and starting a pm2 Node instance'
ssh -o StrictHostKeyChecking=no ubuntu@orderstaker.kevin-project.com \'bash -c \"cd NodeFiles && npm i && sudo pm2 start src/App.js\"\'