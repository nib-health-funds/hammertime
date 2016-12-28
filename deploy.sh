#!/bin/bash

set -eo pipefail
echo "installing deps..."
npm install -q
echo "running tests..."
npm test
echo "deploying to kaos..."
npm deploy
