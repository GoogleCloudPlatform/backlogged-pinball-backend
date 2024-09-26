gcloud config set project backlogged-ai
export PROJECT_ID=$(gcloud config get project)
export PROJECT_NUMBER=<PROJECT_NUMBER>
export REGION=us-west4
export ZONE=us-west4-a
export CLUSTER_NAME=gemma
export HF_TOKEN=<YOUR HUGGING FACE TOKEN> 

gcloud container clusters create ${CLUSTER_NAME} \
  --project=${PROJECT_ID} \
  --region=${REGION} \
  --workload-pool=${PROJECT_ID}.svc.id.goog \
  --release-channel=rapid   --num-nodes=1

gcloud beta container --project=${PROJECT_ID} node-pools create "gpu" \
  --cluster ${CLUSTER_NAME} \
  --zone ${ZONE} \
  --machine-type "a3-highgpu-8g" \
  --accelerator "type=nvidia-h100-80gb,count=8,gpu-driver-version=latest" \
  --spot --num-nodes "1"

gcloud beta container --project=${PROJECT_ID} node-pools create "gpu" \
  --cluster ${CLUSTER_NAME} \
  --zone ${ZONE} \
  --machine-type "e2-standard-4" \
  --num-nodes "2"


kubectl create secret generic hf-secret \
--from-literal=hf_api_token=$HF_TOKEN \
--dry-run=client -o yaml | kubectl apply -f -

kubectl create serviceaccount genkit \
    --namespace default

gcloud projects add-iam-policy-binding projects/backlogged-ai \
    --role=roles/firebase.admin \
    --member=principal://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/backlogged-ai.svc.id.goog/subject/ns/default/sa/genkit \
    --condition=None