#!/bin/bash

pm2 stop prod
pm2 delete prod
npm install 
PORT=4000 pm2 start app.js --name prod