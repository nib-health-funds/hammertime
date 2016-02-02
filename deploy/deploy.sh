#!/usr/bin/env bash
set -e

bundle install
bundle update sceptre
rake deploy
