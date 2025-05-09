#!/bin/bash

# GitHub Pages Update Script
# This script updates the docs directory with the latest code for GitHub Pages deployment

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to log messages
log() {
    local level="$1"
    local message="$2"
    local color="$NC"
    
    case "$level" in
        "INFO")     color="$BLUE" ;;
        "SUCCESS")  color="$GREEN" ;;
        "WARNING")  color="$YELLOW" ;;
        "ERROR")    color="$RED" ;;
    esac
    
    echo -e "${color}[$level] $message${NC}"
}

# Make sure we're in the repository root
ensure_repo_root() {
    log "INFO" "Ensuring we're in the repository root..."
    
    # Check if .git directory exists
    if [ ! -d ".git" ]; then
        log "ERROR" "Not in git repository root. Please run this script from the repository root."
        exit 1
    fi
    
    log "SUCCESS" "In repository root"
}

# Pull latest changes
pull_latest() {
    log "INFO" "Pulling latest changes from the repository..."
    
    git pull
    
    log "SUCCESS" "Pulled latest changes"
}

# Create/clean docs directory
setup_docs_directory() {
    log "INFO" "Setting up docs directory..."
    
    # Create docs directory if it doesn't exist
    if [ ! -d "docs" ]; then
        mkdir -p docs
        log "INFO" "Created docs directory"
    else
        log "INFO" "Cleaning docs directory"
        # Don't delete .git files if present
        find docs -mindepth 1 -not -path "*/\.git*" -delete
    fi
    
    # Create .nojekyll in docs
    touch docs/.nojekyll
    
    log "SUCCESS" "Set up docs directory"
}

# Find and copy main HTML files
copy_html_files() {
    log "INFO" "Copying HTML files..."
    
    # Find potential locations for index.html
    index_locations=(
        "./index.html"
        "./app/views/index.html"
        "./app/index.html"
    )
    
    # Try to copy index.html from the first valid location
    index_copied=false
    for loc in "${index_locations[@]}"; do
        if [ -f "$loc" ]; then
            log "INFO" "Found index.html at $loc"
            cp "$loc" docs/index.html
            index_copied=true
            break
        fi
    done
    
    if [ "$index_copied" = false ]; then
        log "WARNING" "Couldn't find index.html. Creating a simple one..."
        # Create a simple index.html
        cat > docs/index.html << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NAC Designer</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #05547C;
        }
        .container {
            background-color: #f9f9f9;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .button {
            display: inline-block;
            background-color: #05547C;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>NAC Architecture Designer Pro</h1>
        <p>Welcome to the NAC Architecture Designer Pro application. This tool helps you calculate and compare the Total Cost of Ownership (TCO) of different Network Access Control (NAC) solutions.</p>
        
        <h2>Features</h2>
        <ul>
            <li>Vendor comparison</li>
            <li>TCO calculation</li>
            <li>Sensitivity analysis</li>
            <li>Industry compliance tools</li>
        </ul>
        
        <a href="https://github.com/iammrherb/tca" class="button">View on GitHub</a>
    </div>
</body>
</html>
EOF
    fi
    
    # Copy other HTML files
    other_html_files=(
        "executive-dashboard.html"
        "sensitivity.html"
        "industry-compliance.html"
    )
    
    for file in "${other_html_files[@]}"; do
        # Check different potential locations
        potential_locations=(
            "./$file"
            "./app/views/$file"
            "./app/$file"
        )
        
        for loc in "${potential_locations[@]}"; do
            if [ -f "$loc" ]; then
                log "INFO" "Found $file at $loc"
                cp "$loc" "docs/$file"
                break
            fi
        done
    done
    
    log "SUCCESS" "Copied HTML files"
}

# Copy CSS, JS, and image files
copy_assets() {
    log "INFO" "Copying CSS, JS, and image files..."
    
    # Copy minified/bundled CSS
    mkdir -p docs/css
    if [ -f "css/core.bundle.css" ]; then
        cp css/core.bundle.css docs/css/
        log "INFO" "Copied core.bundle.css"
    fi
    if [ -f "css/components.bundle.css" ]; then
        cp css/components.bundle.css docs/css/
        log "INFO" "Copied components.bundle.css"
    fi
    
    # Copy utilities CSS files
    mkdir -p docs/css/utilities
    if [ -d "css/utilities" ]; then
        cp css/utilities/*.css docs/css/utilities/ 2>/dev/null || log "INFO" "No utilities CSS files found"
    fi
    
    # Copy minified/bundled JS
    mkdir -p docs/js
    if [ -f "js/core.bundle.js" ]; then
        cp js/core.bundle.js docs/js/
        log "INFO" "Copied core.bundle.js"
    fi
    if [ -f "js/components.bundle.js" ]; then
        cp js/components.bundle.js docs/js/
        log "INFO" "Copied components.bundle.js"
    fi
    if [ -f "js/features.bundle.js" ]; then
        cp js/features.bundle.js docs/js/
        log "INFO" "Copied features.bundle.js"
    fi
    
    # Copy images
    if [ -d "img" ]; then
        mkdir -p docs/img
        cp -r img/* docs/img/ 2>/dev/null || log "INFO" "No image files found"
        log "INFO" "Copied image files"
    fi
    
    # Copy data files if needed
    if [ -d "data" ]; then
        mkdir -p docs/data
        cp -r data/* docs/data/ 2>/dev/null || log "INFO" "No data files found"
        log "INFO" "Copied data files"
    fi
    
    log "SUCCESS" "Copied assets"
}

# Update paths in HTML files if needed
update_paths() {
    log "INFO" "Updating paths in HTML files..."
    
    # Find all HTML files in docs
    find docs -name "*.html" | while read -r file; do
        # Update CSS paths if needed
        sed -i 's|href="../css/|href="css/|g' "$file"
        sed -i 's|href="css/|href="css/|g' "$file"
        
        # Update JS paths if needed
        sed -i 's|src="../js/|src="js/|g' "$file"
        sed -i 's|src="js/|src="js/|g' "$file"
        
        # Update image paths if needed
        sed -i 's|src="../img/|src="img/|g' "$file"
        sed -i 's|src="img/|src="img/|g' "$file"
        
        log "INFO" "Updated paths in $file"
    done
    
    log "SUCCESS" "Updated paths in HTML files"
}

# Create file listing what's included
create_manifest() {
    log "INFO" "Creating manifest file..."
    
    # Create a manifest file
    cat > docs/MANIFEST.md << EOF
# GitHub Pages Deployment Manifest

This directory contains the files deployed to GitHub Pages.

## Files Included

### HTML Files
$(find docs -name "*.html" | sort | sed 's|^docs/|* |')

### CSS Files
$(find docs -name "*.css" | sort | sed 's|^docs/|* |')

### JavaScript Files
$(find docs -name "*.js" | sort | sed 's|^docs/|* |')

### Other Files
$(find docs -type f -not -name "*.html" -not -name "*.css" -not -name "*.js" -not -name "MANIFEST.md" | sort | sed 's|^docs/|* |')

Created: $(date)
EOF
    
    log "SUCCESS" "Created manifest file"
}

# Commit and push changes
commit_and_push() {
    log "INFO" "Committing and pushing changes..."
    
    git add docs/
    git commit -m "Update GitHub Pages with latest code"
    git push
    
    log "SUCCESS" "Changes committed and pushed to GitHub"
}

# Main function
main() {
    log "INFO" "Starting GitHub Pages update..."
    
    ensure_repo_root
    pull_latest
    setup_docs_directory
    copy_html_files
    copy_assets
    update_paths
    create_manifest
    commit_and_push
    
    log "SUCCESS" "GitHub Pages update completed successfully!"
    log "INFO" "Your site should be available soon at: https://iammrherb.github.io/tca/"
    log "INFO" "Make sure GitHub Pages is configured to publish from the /docs folder in the main branch"
}

# Run main function
main
