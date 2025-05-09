#!/bin/bash

# Build script for NAC Designer
# Regenerates bundle files that are excluded from Git

echo "Building NAC Designer bundles..."

# Directory configuration
ROOT_DIR="$(dirname "$(dirname "$(realpath "$0")")")"
CSS_DIR="$ROOT_DIR/css"
JS_DIR="$ROOT_DIR/js"
DIST_DIR="$ROOT_DIR/dist"

# Create dist directory if it doesn't exist
mkdir -p "$DIST_DIR"

# Build CSS bundles
echo "Building CSS bundles..."
cat "$CSS_DIR"/themes/*.css > "$DIST_DIR/core.bundle.css"
echo "Created core.bundle.css"

find "$CSS_DIR"/components -name "*.css" -type f -exec cat {} \; > "$DIST_DIR/components.bundle.css"
echo "Created components.bundle.css"

# Build JS bundles
echo "Building JS bundles..."
cat "$JS_DIR"/utils/*.js "$JS_DIR"/managers/*.js > "$DIST_DIR/core.bundle.js"
echo "Created core.bundle.js"

find "$JS_DIR"/features -name "*.js" -type f -exec cat {} \; > "$DIST_DIR/features.bundle.js"
echo "Created features.bundle.js"

find "$JS_DIR"/components -name "*.js" -type f -exec cat {} \; > "$DIST_DIR/components.bundle.js"
echo "Created components.bundle.js"

echo "Build complete. Bundle files are in the dist directory."
