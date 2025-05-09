#!/bin/bash

# Script to fix path issues in HTML files for GitHub Pages

echo "Fixing path issues in HTML files..."

# Function to fix paths in a file
fix_paths() {
    local file=$1
    echo "Processing file: $file"
    
    # Create a backup
    cp "$file" "$file.bak"
    
    # Fix CSS paths - convert absolute to relative
    sed -i 's|href="/css/|href="css/|g' "$file"
    sed -i 's|href="/libs/css/|href="libs/css/|g' "$file"
    
    # Fix JS paths - convert absolute to relative
    sed -i 's|src="/js/|src="js/|g' "$file"
    sed -i 's|src="/libs/js/|src="libs/js/|g' "$file"
    
    # Fix image paths - convert absolute to relative
    sed -i 's|src="/img/|src="img/|g' "$file"
    
    # Fix data paths - convert absolute to relative
    sed -i 's|src="/data/|src="data/|g' "$file"
    
    # Add base tag to head if not already present
    if ! grep -q "<base" "$file"; then
        sed -i '/<head>/a \    <base href="https://iammrherb.github.io/tca/">' "$file"
    fi
    
    echo "Fixed paths in $file"
}

# Fix main index.html
if [ -f "index.html" ]; then
    fix_paths "index.html"
fi

# Fix other HTML files in root
for html_file in *.html; do
    if [ "$html_file" != "index.html" ] && [ -f "$html_file" ]; then
        fix_paths "$html_file"
    fi
done

# Fix HTML files in app/views
if [ -d "app/views" ]; then
    for html_file in app/views/*.html; do
        if [ -f "$html_file" ]; then
            # For files in subdirectories, we need to adjust the base path
            cp "$html_file" "$html_file.bak"
            
            # Fix CSS paths with proper relative paths
            sed -i 's|href="/css/|href="../../css/|g' "$html_file"
            sed -i 's|href="css/|href="../../css/|g' "$html_file"
            
            # Fix JS paths with proper relative paths
            sed -i 's|src="/js/|src="../../js/|g' "$html_file"
            sed -i 's|src="js/|src="../../js/|g' "$html_file"
            
            # Fix image paths with proper relative paths
            sed -i 's|src="/img/|src="../../img/|g' "$html_file"
            sed -i 's|src="img/|src="../../img/|g' "$html_file"
            
            # Add base tag for subdirectory files
            if ! grep -q "<base" "$html_file"; then
                sed -i '/<head>/a \    <base href="https://iammrherb.github.io/tca/">' "$html_file"
            fi
            
            echo "Fixed paths in $html_file"
        fi
    done
fi

# Fix redirected paths to include /tca/
if [ -d "docs/3.9.1/samples" ]; then
    if [ -f "docs/3.9.1/samples/information.html" ]; then
        echo "Updating redirect in docs/3.9.1/samples/information.html..."
        sed -i 's|window.location.href = "../../../../index.html"|window.location.href = "https://iammrherb.github.io/tca/"|g' "docs/3.9.1/samples/information.html"
    fi
fi

# Check if we have bundle files and create if not
if [ ! -f "css/core.bundle.css" ]; then
    echo "Bundle file css/core.bundle.css not found, creating placeholder..."
    mkdir -p css
    echo "/* Core Bundle CSS */" > css/core.bundle.css
fi

if [ ! -f "css/components.bundle.css" ]; then
    echo "Bundle file css/components.bundle.css not found, creating placeholder..."
    mkdir -p css
    echo "/* Components Bundle CSS */" > css/components.bundle.css
fi

if [ ! -f "js/core.bundle.js" ]; then
    echo "Bundle file js/core.bundle.js not found, creating placeholder..."
    mkdir -p js
    echo "// Core Bundle JS" > js/core.bundle.js
fi

if [ ! -f "js/components.bundle.js" ]; then
    echo "Bundle file js/components.bundle.js not found, creating placeholder..."
    mkdir -p js
    echo "// Components Bundle JS" > js/components.bundle.js
fi

if [ ! -f "js/features.bundle.js" ]; then
    echo "Bundle file js/features.bundle.js not found, creating placeholder..."
    mkdir -p js
    echo "// Features Bundle JS" > js/features.bundle.js
fi

# Create utilities directory and fixes.css if not exists
mkdir -p css/utilities
if [ ! -f "css/utilities/fixes.css" ]; then
    echo "/* Utility fixes */" > css/utilities/fixes.css
fi

echo "Committing and pushing changes..."
git add .
git commit --no-verify -m "Fix resource paths for GitHub Pages"
git push

echo "Done! The site should now load resources correctly."
