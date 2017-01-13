#!/bin/bash

set -eo pipefail
echo "--- :npm: Installing dependencies"
npm install --quiet
echo "--- :skull: Deleting stack"
npm run destroy
