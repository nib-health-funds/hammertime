#!/bin/bash

set -eo pipefail
echo "--- Installing dependencies"
npm install --quiet --progress=false
apt-get update -qq
apt-get install -yqq jq awscli

echo "--- Running tests"
npm test

echo "--- Deploying to Kaos"
CREDENTIALS=$(aws sts assume-role --role-arn "arn:aws:iam::384553929753:role/deployer-artifacts-DeployerRole-1X76QQA70P2X2" --role-session-name="HammertimeDeploy")
export AWS_ACCESS_KEY_ID=$(echo $CREDENTIALS | jq -r ".Credentials.AccessKeyId")
export AWS_SECRET_ACCESS_KEY=$(echo $CREDENTIALS | jq -r ".Credentials.SecretAccessKey")
export AWS_SESSION_TOKEN=$(echo $CREDENTIALS | jq -r ".Credentials.SessionToken")
npm run deploy
