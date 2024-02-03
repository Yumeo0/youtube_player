##!/bin/bash

start_server(){
        cd server
        yarn
        yarn dev
}

start_client(){
        cd web
        yarn
        yarn start
}

git pull

start_server & start_client &