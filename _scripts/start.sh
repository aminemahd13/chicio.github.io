#!/usr/bin/env zsh

# Clean previous build
rm -Rf _site/

# Copy images, to eventually add new ones for new posts
npm run images

# Run pages-gem with bundler.
# Add the parameter
# --host=0.0.0.0
# to be able to connect to the jekyll local instance from other device on the
# same network (e.g. your smartphone) 
# See https://stackoverflow.com/questions/16608466/connect-to-a-locally-built-jekyll-server-using-mobile-devices-in-the-lan
bundle exec jekyll serve --incremental --host=localhost --watch
