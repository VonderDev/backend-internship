#!/bin/bash

pm2 stop dev  
pm2 delete dev    
npm install 
PORT=5000 pm2 start app.js --name dev