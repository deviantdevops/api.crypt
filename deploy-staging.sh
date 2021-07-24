#!/bin/bash

#npm run build
docker build -f app.dockerfile -t registry.iron-labs.de:5000/api/crypt:3.0.1 .
docker push registry.iron-labs.de:5000/api/crypt:3.0.1

