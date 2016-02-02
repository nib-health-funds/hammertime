#!/usr/bin/env bash
set -e

bundle install
bundle update sceptre
bundle exec rake deploy
