#! /bin/bash

IMAGE=us-central1-docker.pkg.dev/backlogged-demo-1/cloud-run-source-deploy/pinball
docker build -t $IMAGE .
docker push $IMAGE
gcloud run deploy --image $IMAGE pinball
