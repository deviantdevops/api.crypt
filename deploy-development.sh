#!/bin/bash

#npm run build
docker build -f app.dockerfile -t deviant.code:5000/api/crypt:1.1.0 .
docker push deviant.code:5000/api/crypt:1.1.0

