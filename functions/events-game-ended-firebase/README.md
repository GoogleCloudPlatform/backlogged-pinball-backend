## deploying

Example deployment steps. You will likely need to change project & regions.

Set project and qutoa project

```sh
gcloud config set project backlogged-dev
gcloud auth application-default set-quota-project backlogged-dev

# then login and confirm settings
gcloud auth login
gcloud config list
```

Deploy the function

```sh
gcloud functions deploy events-game-end-firebase \
--gen2 \
--region=us-west4 \
--runtime=nodejs20 \
--source=. \
--entry-point=events-game-ended-firebase \
--trigger-event=providers/cloud.pubsub/eventTypes/topic.publish \
--trigger-resource=pinball-events 
```
