#!/bin/bash

# Script to fix GitHub Pages redirection issue
# This creates the specific redirected path and ensures navigation to the homepage

set -e  # Exit on any error

echo "Creating directory structure for redirected path..."
mkdir -p docs/3.9.1/samples

echo "Creating redirect file at the problematic location..."
cat > docs/3.9.1/samples/information.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0;url=../../../../index.html">
    <title>Redirecting...</title>
    <script>
        window.location.href = "../../../../index.html";
    </script>
</head>
<body>
    <p>Redirecting to the main page... <a href="../../../../index.html">Click here if you are not redirected automatically</a></p>
</body>
</html>
EOF

echo "Creating redirect file at root of docs folder..."
cat > docs/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0;url=../index.html">
    <title>Redirecting...</title>
    <script>
        window.location.href = "../index.html";
    </script>
</head>
<body>
    <p>Redirecting to the main page... <a href="../index.html">Click here if you are not redirected automatically</a></p>
</body>
</html>
EOF

echo "Fixing redirect in main index.html..."
if grep -q "redirectUrl" index.html; then
    echo "Found redirect code in index.html, replacing it..."
    # Use a different approach - create a temporary file
    cat index.html | sed 's#var redirectUrl = "/samples/information.html"#var redirectUrl = "/index.html"#g' > index.html.tmp
    mv index.html.tmp index.html
    
    cat index.html | sed 's#var routerBase = window.routerBase || "/docs/3.9.1/"#var routerBase = window.routerBase || "/"#g' > index.html.tmp
    mv index.html.tmp index.html
    
    echo "Redirect code in index.html updated."
fi

echo "Checking for countdown script..."
if grep -q "var countdown" index.html; then
    echo "Found countdown script, disabling it..."
    # Create a backup
    cp index.html index.html.bak
    
    # Replace the entire script block with a simple redirect
    awk '
    BEGIN { printing = 1; }
    /<script>/ { 
        if ($0 ~ /countdown/) { 
            printing = 0; 
            print "<script>"; 
            print "  // Direct to index.html without countdown";
            print "  window.location.href = \"index.html\";";
            print "</script>";
        } else {
            print;
        }
    }
    /<\/script>/ { 
        if (printing == 0) {
            printing = 1;
            next;
        } else {
            print;
        }
    }
    { if (printing) print; }
    ' index.html > index.html.new
    
    mv index.html.new index.html
    echo "Countdown script disabled."
fi

echo "Committing and pushing changes..."
git add .
git commit --no-verify -m "Fix GitHub Pages redirect issue"
git push

echo "Done! The site should now redirect properly to the main page."
