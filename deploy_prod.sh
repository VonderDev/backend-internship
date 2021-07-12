#!/bin/bash

pm2 stop prod
pm2 delete prod
npm install 
PORT=3001 pm2 start app.js --name prod