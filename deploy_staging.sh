#!/bin/bash

pm2 stop staging
pm2 delete staging
npm install 
PORT=3000 pm2 start app.js --name staging