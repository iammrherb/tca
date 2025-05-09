const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const csso = require('csso');

// Directories to process
const jsDir = './js';
const cssDir = './css';
const distDir = './dist';

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
  fs.mkdirSync(path.join(distDir, 'js'), { recursive: true });
  fs.mkdirSync(path.join(distDir, 'css'), { recursive: true });
}

// Minify JS files
async function minifyJS(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  try {
    const result = await minify(content, {
      compress: {
        drop_console: true
      },
      mangle: true
    });
    
    const relativePath = path.relative(jsDir, filePath);
    const outputPath = path.join(distDir, 'js', relativePath);
    
    // Create directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, result.code);
    console.log(`Minified JS: ${filePath} -> ${outputPath}`);
  } catch (error) {
    console.error(`Error minifying ${filePath}:`, error);
  }
}

// Minify CSS files
function minifyCSS(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  try {
    const result = csso.minify(content);
    
    const relativePath = path.relative(cssDir, filePath);
    const outputPath = path.join(distDir, 'css', relativePath);
    
    // Create directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, result.css);
    console.log(`Minified CSS: ${filePath} -> ${outputPath}`);
  } catch (error) {
    console.error(`Error minifying ${filePath}:`, error);
  }
}

// Process all JS files
function processJSFiles(directory) {
  const files = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(directory, file.name);
    
    if (file.isDirectory()) {
      processJSFiles(filePath);
    } else if (file.isFile() && path.extname(file.name) === '.js') {
      minifyJS(filePath);
    }
  }
}

// Process all CSS files
function processCSSFiles(directory) {
  const files = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(directory, file.name);
    
    if (file.isDirectory()) {
      processCSSFiles(filePath);
    } else if (file.isFile() && path.extname(file.name) === '.css') {
      minifyCSS(filePath);
    }
  }
}

// Process HTML files and update them to use minified resources
function processHTMLFiles() {
  const htmlFiles = ['index.html', 'calculator.html', 'sensitivity.html'];
  
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Replace JS paths
    let newContent = content.replace(/src="js\/(.*?)\.js"/g, 'src="dist/js/$1.js"');
    
    // Replace CSS paths
    newContent = newContent.replace(/href="css\/(.*?)\.css"/g, 'href="dist/css/$1.css"');
    
    // Write optimized HTML
    const outputPath = path.join(distDir, file);
    fs.writeFileSync(outputPath, newContent);
    console.log(`Processed HTML: ${file} -> ${outputPath}`);
  });
}

// Main process
async function main() {
  console.log('Starting build process...');
  
  // Process JS and CSS files
  processJSFiles(jsDir);
  processCSSFiles(cssDir);
  
  // Process HTML files
  processHTMLFiles();
  
  // Copy other necessary files (e.g., images)
  console.log('Copying other assets...');
  
  // Create img directory in dist if it doesn't exist
  if (!fs.existsSync(path.join(distDir, 'img'))) {
    fs.mkdirSync(path.join(distDir, 'img'), { recursive: true });
  }
  
  // Copy image files
  const imgDir = './img';
  if (fs.existsSync(imgDir)) {
    const imgFiles = fs.readdirSync(imgDir);
    
    imgFiles.forEach(file => {
      const sourcePath = path.join(imgDir, file);
      const outputPath = path.join(distDir, 'img', file);
      
      if (fs.statSync(sourcePath).isFile()) {
        fs.copyFileSync(sourcePath, outputPath);
        console.log(`Copied: ${sourcePath} -> ${outputPath}`);
      }
    });
  }
  
  console.log('Build completed successfully!');
}

// Run the build process
main().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});
