#!/bin/bash

start_server(){
        cd /app/server
        npm install
        npm run dev
}

start_client(){
        cd /app/web
        npm install
        npm run start
}

echo "Starting..."
start_server &
start_client &

wait  # Keeps the script running and waits for background processes to complete