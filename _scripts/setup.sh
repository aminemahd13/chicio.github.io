#!/usr/bin/env zsh

# Install npm global dependecies
npm install --global n@6.5.1
npm install --global gulp-cli@2.2.0
npm install --global flow-typed@3.1.0
npm install --global @lhci/cli@0.3.x

# Install gem dependecies
gem install bundler
bundle install --path vendor/bundle

# Install npm dependecies
npm install
