#!/bin/bash

set -x
set -o pipefail

# Intended to be run as packit's fix-spec-file action

# Directory where nodejs-packaging-bundler puts its output
SOURCES="$(rpm -E '%{_sourcedir}')"

nodejs-packaging-bundler jowl "$PACKIT_PROJECT_VERSION" "$PACKIT_PROJECT_ARCHIVE"

# nodejs-packaging-bundler puts its output in SOURCES, but packit expects them
# in the same directory as the specfile.
# Copy node modules and bundled licenses back into the specfile's directory
# but exclude the project archive that nodejs-packaging-bundler-jowl has
# also copied to SOURCES so that it doesn't overwrite the one packit has
# generated.
mv "${SOURCES}/jowl-${PACKIT_PROJECT_VERSION}-bundled-licenses.txt" dist/
mv "${SOURCES}/jowl-${PACKIT_PROJECT_VERSION}-nm-dev.tgz" dist/
mv "${SOURCES}/jowl-${PACKIT_PROJECT_VERSION}-nm-prod.tgz" dist/

# Packit normally rewrites specfiles on its own to make sure Source0 is
# pointing to the project archive, and normally overriding fix-spec-file
# means we would need to rewrite it oursevles. However, since the project
# archive name matches the filename in the URL, and since we haven't used
# packit to mangle the URL, we can leave Source0 as-is.

sed -i dist/jowl.spec -re "s/Release:(\s*)\S+/Release:\1${PACKIT_RPMSPEC_RELEASE}%{?dist}/"

echo "fix-spec-file done"
