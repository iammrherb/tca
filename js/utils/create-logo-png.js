// Node.js script to create a PNG from SVG (only used if available)
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

// Create a data URL for the logo which will be used as a fallback
const svgContent = fs.readFileSync('img/logo.svg', 'utf8');
const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;

// Write this to a JavaScript file that can be included
fs.writeFileSync('img/logo-fallback.js', `
// Fallback for logo loading
document.addEventListener('DOMContentLoaded', function() {
  const logoImg = document.querySelector('.logo img');
  if (logoImg) {
    logoImg.onerror = function() {
      this.onerror = null;
      this.src = "${dataUrl}";
    };
  }
});
`);

try {
  // Try to create a PNG if canvas is available
  const canvas = createCanvas(200, 50);
  const ctx = canvas.getContext('2d');
  
  // Draw the logo (simplified version)
  ctx.fillStyle = '#1B67B2';
  ctx.fillRect(5, 10, 30, 30);
  
  ctx.fillStyle = '#2BD25B';
  ctx.beginPath();
  ctx.arc(20, 25, 8, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#1B67B2';
  ctx.font = 'bold 20px Arial';
  ctx.fillText('Portnox', 45, 32);
  
  ctx.strokeStyle = '#2BD25B';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(45, 35);
  ctx.lineTo(120, 35);
  ctx.stroke();
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('img/logo.png', buffer);
  console.log('Created logo.png successfully');
} catch (e) {
  console.log('Could not create PNG - will use SVG fallback instead');
}
