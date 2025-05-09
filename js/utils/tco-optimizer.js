/**
 * Optimized TCO Analyzer Script
 * This script replaces multiple scattered fixes with a single optimized solution
 */

(function() {
  'use strict';
  
  // Wait for document to be ready
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing TCO Analyzer optimizations...');
    
    // Fix logo issues
    fixLogo();
    
    // Fix tab navigation
    fixTabs();
    
    // Fix vendor selection
    fixVendorSelection();
    
    // Fix chart rendering
    initializeCharts();
    
    // Fix PDF generation
    fixPdfGeneration();
    
    console.log('TCO Analyzer optimizations initialized');
  });
  
  // Fix logo display issues
  function fixLogo() {
    const logoImg = document.querySelector('.logo img');
    if (logoImg) {
      // Create SVG fallback
      const svgLogo = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="50" viewBox="0 0 200 50"><style>.logo-text{fill:#05547C;font-family:Arial,sans-serif;font-weight:bold}.accent{fill:#65BD44}</style><rect x="5" y="10" width="30" height="30" rx="5" fill="#05547C"/><circle cx="20" cy="25" r="8" fill="#65BD44"/><text x="45" y="32" class="logo-text" font-size="20">Portnox</text><path class="accent" d="M45 35 h75" stroke="#65BD44" stroke-width="2"/></svg>';
      const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(svgLogo);
      
      // Set error handler to use SVG fallback
      logoImg.onerror = function() {
        console.log('Logo image failed to load, using SVG fallback');
        this.onerror = null;
        this.src = svgDataUrl;
      };
      
      // If already broken, fix it now
      if (!logoImg.complete || logoImg.naturalHeight === 0) {
        logoImg.src = svgDataUrl;
      }
    }
    console.log('Logo fix applied');
  }
  
  // Fix tab navigation
  function fixTabs() {
    const tabButtons = document.querySelectorAll('.tab-button, [role="tab"]');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Find the target tab pane
        const tabId = this.getAttribute('data-tab');
        if (!tabId) return;
        
        const targetPane = document.getElementById(tabId);
        if (!targetPane) return;
        
        // Hide all tab panes
        document.querySelectorAll('.tab-pane, [role="tabpanel"]').forEach(pane => {
          pane.classList.remove('active');
          pane.classList.remove('show');
          pane.setAttribute('aria-hidden', 'true');
        });
        
        // Deactivate all tab buttons
        tabButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        
        // Activate this tab button
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
        
        // Show the target pane
        targetPane.classList.add('active');
        targetPane.classList.add('show');
        targetPane.setAttribute('aria-hidden', 'false');
      });
    });
    
    console.log('Tab navigation fix applied');
  }
  
  // Fix vendor selection
  function fixVendorSelection() {
    const vendorCards = document.querySelectorAll('.vendor-card');
    
    vendorCards.forEach(card => {
      card.addEventListener('click', function() {
        // Deactivate all cards
        vendorCards.forEach(c => c.classList.remove('active'));
        
        // Activate this card
        this.classList.add('active');
        
        // Trigger recalculation if TcoCalculator exists
        if (typeof window.TcoCalculator !== 'undefined' && window.TcoCalculator.calculate) {
          window.TcoCalculator.calculate();
        }
      });
      
      // Make keyboard accessible
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });
    
    console.log('Vendor selection fix applied');
  }
  
  // Fix chart rendering
  function initializeCharts() {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not loaded yet, will apply chart fixes when loaded');
      
      // Wait for Chart.js to load
      window.addEventListener('load', function() {
        if (typeof Chart !== 'undefined') {
          applyChartConfiguration();
        }
      });
      
      return;
    }
    
    applyChartConfiguration();
  }
  
  function applyChartConfiguration() {
    // Set global chart defaults
    Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    Chart.defaults.color = '#505050';
    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;
    
    // Better colors for charts
    const colors = [
      '#05547C', // Primary (current vendor)
      '#65BD44', // Accent (Portnox)
      '#F7941D', // Warning
      '#1B8DC0', // Primary light
      '#8ED070', // Accent light
      '#B54369', // Danger
      '#4D9132'  // Accent dark
    ];
    
    // Apply to chart colors
    if (Chart.defaults.plugins) {
      Chart.defaults.plugins.colors = { forceOverride: true };
    }
    
    Chart.defaults.backgroundColor = colors;
    Chart.defaults.borderColor = colors;
    
    console.log('Chart configuration applied');
  }
  
  // Fix PDF generation - avoiding the infinite setTimeout loop
  function fixPdfGeneration() {
    // Track if fix has been applied
    let pdfFixApplied = false;
    let maxAttempts = 5;
    let attempts = 0;
    
    function attemptFix() {
      // Avoid infinite loop by limiting attempts
      if (pdfFixApplied || attempts >= maxAttempts) {
        return;
      }
      
      attempts++;
      
      // Check if jsPDF is loaded
      if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined') {
        if (attempts < maxAttempts) {
          console.log(`Waiting for jsPDF to load (attempt ${attempts}/${maxAttempts})...`);
          setTimeout(attemptFix, 1000);
        } else {
          console.warn('Could not apply PDF generation fix: jsPDF not loaded after multiple attempts');
        }
        return;
      }
      
      // Check if PdfGenerator exists
      if (typeof window.PdfGenerator === 'undefined' || typeof window.PdfGenerator.generatePdf === 'undefined') {
        if (attempts < maxAttempts) {
          console.log(`Waiting for PdfGenerator to load (attempt ${attempts}/${maxAttempts})...`);
          setTimeout(attemptFix, 1000);
        } else {
          console.warn('Could not apply PDF generation fix: PdfGenerator not defined after multiple attempts');
        }
        return;
      }
      
      // Fix is ready to apply
      const originalGeneratePdf = window.PdfGenerator.generatePdf;
      
      window.PdfGenerator.generatePdf = function(reportType) {
        try {
          // Call original function
          return originalGeneratePdf(reportType);
        } catch (error) {
          console.error('Error in PDF generation:', error);
          
          // Fallback implementation
          alert('PDF generation encountered an error. Creating a simplified report.');
          
          try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Add title
            doc.setFontSize(20);
            doc.setTextColor(5, 84, 124); // Primary color
            doc.text('Portnox TCO Analysis Report', 20, 20);
            
            // Add subtitle
            doc.setFontSize(14);
            doc.setTextColor(77, 145, 50); // Accent dark
            doc.text('Cost Comparison Summary', 20, 30);
            
            // Add some content
            doc.setFontSize(12);
            doc.setTextColor(32, 32, 32);
            doc.text('Generated on ' + new Date().toLocaleDateString(), 20, 40);
            
            // Save PDF
            doc.save('portnox-tco-analysis.pdf');
            
            return true;
          } catch (fallbackError) {
            console.error('Fallback PDF generation also failed:', fallbackError);
            alert('Unable to generate PDF report. Please try again later.');
            return false;
          }
        }
      };
      
      pdfFixApplied = true;
      console.log('PDF generation fix applied');
    }
    
    // Start the fix attempt
    attemptFix();
    
    // Hook into export buttons to ensure fix is applied
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    if (exportPdfBtn) {
      const originalOnClick = exportPdfBtn.onclick;
      
      exportPdfBtn.onclick = function(event) {
        // If fix not applied yet, try again
        if (!pdfFixApplied) {
          attempts = 0;  // Reset attempts counter
          attemptFix();
        }
        
        // Call original handler if it exists
        if (typeof originalOnClick === 'function') {
          return originalOnClick.call(this, event);
        }
      };
    }
  }
  
  // Handle sensitivity analysis page
  if (window.location.pathname.includes('sensitivity.html')) {
    // Fix return button
    const returnBtn = document.getElementById('return-to-calculator');
    if (returnBtn) {
      returnBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
      });
    }
    
    // Initialize sensitivity analysis
    const sensitivityBtn = document.getElementById('sensitivity-btn');
    if (sensitivityBtn) {
      sensitivityBtn.addEventListener('click', function() {
        // Show loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-overlay';
        loadingIndicator.innerHTML = `
          <div class="spinner"></div>
          <div class="loading-text">Running sensitivity analysis...</div>
        `;
        document.querySelector('.results-container').appendChild(loadingIndicator);
        
        // Simulate analysis (would be replaced with real implementation)
        setTimeout(function() {
          document.querySelector('.loading-overlay').remove();
          // Real implementation would go here
        }, 1500);
      });
    }
  }
  
  // Add CSS fixes
  function addCssFixesIfMissing() {
    // Check if consolidated CSS already included
    const consolidatedCssLink = document.querySelector('link[href="css/tco-consolidated.css"]');
    if (consolidatedCssLink) {
      return;
    }
    
    // Create and add consolidated CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/tco-consolidated.css';
    document.head.appendChild(link);
    
    console.log('CSS fixes added');
  }
  
  // Apply CSS fixes
  addCssFixesIfMissing();
})();
