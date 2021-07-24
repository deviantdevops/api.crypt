#!/bin/bash

#npm run build
docker build -f app.dockerfile -t darkcodz.com:5000/api/crypt:3.0.0 .
docker push darkcodz.com:5000/api/crypt:3.0.0

