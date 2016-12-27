#!/bin/sh

set -eo pipefail
npm install -q
npm test
npm deploy
