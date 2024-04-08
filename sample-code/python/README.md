# README for Python Pinball Sample Code
This sample Python app is intended to react to Pub/Sub messages coming from a pinball machine (and potentially send some back!)

Feel free to make changes and deploy it to the sample project that is already receiving Pub/Sub events

A codelab to guide you is available at https://storage.googleapis.com/pinball-codelab/index.html

## Deployment instructions
From this directory, run the following command:
```
gcloud run deploy pinball --platform managed --region us-central1 --source=.
```