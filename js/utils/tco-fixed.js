/**
 * TCO Analyzer Fix
 * Simple fix for common issues
 */
(function() {
  console.log('TCO Fix loaded');
  
  // Fix logo once page is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Fix logo
    const logoImg = document.querySelector('.logo img');
    if (logoImg) {
      const svgLogo = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="50" viewBox="0 0 200 50"><style>.logo-text{fill:#05547C;font-family:Arial,sans-serif;font-weight:bold}.accent{fill:#65BD44}</style><rect x="5" y="10" width="30" height="30" rx="5" fill="#05547C"/><circle cx="20" cy="25" r="8" fill="#65BD44"/><text x="45" y="32" class="logo-text" font-size="20">Portnox</text><path class="accent" d="M45 35 h75" stroke="#65BD44" stroke-width="2"/></svg>';
      const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(svgLogo);
      
      logoImg.onerror = function() {
        this.src = svgDataUrl;
      };
      
      if (!logoImg.complete || logoImg.naturalHeight === 0) {
        logoImg.src = svgDataUrl;
      }
    }
    
    // Fix chart rendering
    if (typeof Chart !== 'undefined') {
      Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
      Chart.defaults.color = '#505050';
      Chart.defaults.responsive = true;
    }
    
    // Fix PDF generation
    if (typeof window.PdfGenerator !== 'undefined' && typeof window.PdfGenerator.generatePdf === 'function') {
      const originalGeneratePdf = window.PdfGenerator.generatePdf;
      
      window.PdfGenerator.generatePdf = function(reportType) {
        try {
          return originalGeneratePdf(reportType);
        } catch (error) {
          alert('PDF generation encountered an error. Please try again later.');
          return false;
        }
      };
    }
    
    console.log('TCO Fixes applied');
  });
})();
