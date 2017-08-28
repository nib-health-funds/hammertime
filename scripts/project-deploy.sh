#!/bin/bash -e

echo "--- :node: Build App"
npm i

echo "--- :serverless: Deploy App"
serverless deploy