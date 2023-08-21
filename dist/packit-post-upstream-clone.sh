#!/bin/bash

set -x
set -o pipefail

# Intended to be run as packit's post-upstream-clone action in order to
# create tarballs of dependencies and their licenses.
# If running manually, only the lines up through the invocation of
# nodejs-packaging-bundler are necessary to generate sources, after
# which a normal rpm build will work.
JOWL_VERSION="$(echo "console.log(require('./package.json').version);" | node)"
npm pack
nodejs-packaging-bundler jowl "$JOWL_VERSION" "jowl-${JOWL_VERSION}.tgz"

# nodejs-packaging-bundler puts its output in SOURCES, but packit expects them
# in the same directory as the specfile.
SOURCES="$(rpm -E '%{_sourcedir}')"

# Copy node modules and bundled licenses back into the specfile's directory
# but exclude the project archive that nodejs-packaging-bundler-jowl has
# also copied to SOURCES so that it doesn't overwrite the one packit has
# generated.
mv "${SOURCES}/jowl-${JOWL_VERSION}-bundled-licenses.txt" dist/
mv "${SOURCES}/jowl-${JOWL_VERSION}-nm-dev.tgz" dist/
mv "${SOURCES}/jowl-${JOWL_VERSION}-nm-prod.tgz" dist/

echo "post-upstream-clone done"
