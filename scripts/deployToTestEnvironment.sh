#!/bin/bash
ssh -i /Users/Kevin/Projects/OrdersTaker.pem ubuntu@orderstaker.kevin-project.com sudo pm2 stop TestApp
scp -i /Users/Kevin/Projects/ordersTaker.pem /Users/Kevin/Projects/OrdersTaker_Backend/package.json ubuntu@orderstaker.kevin-project.com:TestNodeFiles/
scp -i /Users/Kevin/Projects/OrdersTaker.pem /Users/Kevin/Projects/OrdersTaker_Backend/.env ubuntu@orderstaker.kevin-project.com:TestNodeFiles/
scp -i /Users/Kevin/Projects/OrdersTaker.pem -r /Users/Kevin/Projects/OrdersTaker_Backend/src ubuntu@orderstaker.kevin-project.com:TestNodeFiles/
# ssh -i c:/projects/orderstaker.pem ubuntu@orderstaker.kevin-project.com 'bash -c "cd TestNodeFiles && npm i && sudo mv src/App.js src/TestApp.js && sudo pm2 start src/TestApp.js"'
