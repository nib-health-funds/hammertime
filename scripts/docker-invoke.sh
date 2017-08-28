#!/bin/bash

AWS_DOCKER_ARN=${REGISTRY_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
BUILD_CONTAINER=${1:?"Specify build container"}
RUNSCRIPT=${2:?"Specify script to run"}

set -eo pipefail
echo "--- :docker: pull build container"

docker pull ${AWS_DOCKER_ARN}/${BUILD_CONTAINER}:latest

BUILD_DIR=$(pwd)

set +e
docker run \
    -e COMMIT_HASH=${BUILDKITE_COMMIT} \
    -e BUILD_NUMBER=${BUILDKITE_BUILD_NUMBER} \
    -e BRANCH=${BUILDKITE_BRANCH} \
    -e CI_BUILD=true \
    -v ${BUILD_DIR}:/work -w="/work" \
    ${AWS_DOCKER_ARN}/${BUILD_CONTAINER}:latest ${RUNSCRIPT}
