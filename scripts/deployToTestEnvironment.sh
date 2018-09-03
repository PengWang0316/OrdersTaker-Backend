#!/bin/bash
ssh -i c:/projects/orderstaker.pem ubuntu@orderstaker.kevin-project.com sudo pm2 stop TestApp
scp -i c:/projects/orderstaker.pem c:/projects/orderstaker_backend/package.json ubuntu@orderstaker.kevin-project.com:TestNodeFiles/
scp -i c:/projects/orderstaker.pem c:/projects/orderstaker_backend/.env ubuntu@orderstaker.kevin-project.com:TestNodeFiles/
scp -i c:/projects/orderstaker.pem -r c:/projects/orderstaker_backend/src ubuntu@orderstaker.kevin-project.com:TestNodeFiles/
# ssh -i c:/projects/orderstaker.pem ubuntu@orderstaker.kevin-project.com 'bash -c "cd TestNodeFiles && npm i && sudo mv src/App.js src/TestApp.js && sudo pm2 start src/TestApp.js"'
