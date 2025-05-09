/**
 * Fix for the Portnox logo
 * Replaces the placeholder with the actual Portnox logo
 */
document.addEventListener('DOMContentLoaded', function() {
  // Define the Portnox logo as a base64-encoded SVG
  const portnoxLogo = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgNTAiPg0KICA8c3R5bGU+DQogICAgLmxvZ28tdGV4dHtmaWxsOiMxQjY3QjI7Zm9udC1mYW1pbHk6QXJpYWwsc2Fucy1zZXJpZjtmb250LXdlaWdodDpib2xkfS5hY2NlbnR7ZmlsbDojMkJEMjVCfQ0KICA8L3N0eWxlPg0KICA8cmVjdCB4PSI1IiB5PSIxMCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiByeD0iNSIgZmlsbD0iIzFCNjdCMiIvPg0KICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjI1IiByPSI4IiBmaWxsPSIjMkJEMjVCIi8+DQogIDx0ZXh0IHg9IjQ1IiB5PSIzMiIgY2xhc3M9ImxvZ28tdGV4dCIgZm9udC1zaXplPSIyMCI+UG9ydG5veDwvdGV4dD4NCiAgPHBhdGggY2xhc3M9ImFjY2VudCIgZD0iTTQ1IDM1IGg3NSIgc3Ryb2tlPSIjMkJEMjVCIiBzdHJva2Utd2lkdGg9IjIiLz4NCjwvc3ZnPg==';
  
  // Find all logo images
  const logoImages = document.querySelectorAll('.logo img');
  
  // Replace each logo image
  logoImages.forEach(img => {
    // Set the source directly
    img.src = portnoxLogo;
    
    // Remove the onerror handler to prevent any loops
    img.removeAttribute('onerror');
    
    // Add alt text if missing
    if (!img.hasAttribute('alt') || img.getAttribute('alt') === '') {
      img.alt = 'Portnox Logo';
    }
  });
  
  // Create a global function to apply the logo to any new logo images
  window.applyPortnoxLogo = function() {
    document.querySelectorAll('.logo img').forEach(img => {
      img.src = portnoxLogo;
      img.removeAttribute('onerror');
      
      if (!img.hasAttribute('alt') || img.getAttribute('alt') === '') {
        img.alt = 'Portnox Logo';
      }
    });
  };
  
  // Create a style element for CSS fixes
  const style = document.createElement('style');
  style.textContent = `
    .logo img {
      height: 40px;
      width: auto;
      margin-right: 10px;
    }
  `;
  document.head.appendChild(style);
  
  console.log('Portnox logo fix applied');
});
