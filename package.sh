#!/bin/bash -e

zip -r start-hammertime-1.${BUILDKITE_BUILD_NUMBER} start-hammertime.js node_modules
zip -r stop-hammertime-1.${BUILDKITE_BUILD_NUMBER} stop-hammertime.js node_modules
