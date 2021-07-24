#!/bin/bash

#npm run build
docker build -f app.dockerfile -t registry.screenpaper.io:5000/api/crypt:3.0.0 .
docker push registry.screenpaper.io:5000/api/crypt:3.0.0

#Git operations

CURRENTDATE=`date +"%m%I%M%b%Y"`
git add --all
git commit -m "${CURRENTDATE} Auto Backup"
git push