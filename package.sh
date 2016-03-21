#!/bin/bash -xe

rm -f *.zip
zip -r start-hammertime-1.${BUILDKITE_BUILD_NUMBER}.zip start-hammertime.js node_modules
zip -r stop-hammertime-1.${BUILDKITE_BUILD_NUMBER}.zip stop-hammertime.js node_modules
