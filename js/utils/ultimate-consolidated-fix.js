/**
 * Ultimate Consolidated Fix Script
 * Comprehensive solution that fixes all identified issues and implements requested changes
 */
(function() {
  console.log('Applying Ultimate Consolidated Fix...');
  
  // ==== Tab Management Fixes ====
  
  // Remove Sales Tools tab
  function removeSalesToolsTab() {
    console.log('Removing Sales Tools tab...');
    
    // Remove tab button if exists
    const salesTab = document.querySelector('[data-tab="seller-tab"]');
    if (salesTab) {
      salesTab.remove();
      console.log('Sales Tools tab button removed');
    }
    
    // Remove tab content if exists
    const salesContent = document.getElementById('seller-tab');
    if (salesContent) {
      salesContent.remove();
      console.log('Sales Tools tab content removed');
    }
  }
  
  // Rename Cloud vs On-Prem tab
  function renameComparisonTab() {
    console.log('Renaming comparison tab...');
    
    // Find the comparison tab button
    const comparisonTab = document.querySelector('[data-tab="comparison-tab"]');
    if (comparisonTab) {
      comparisonTab.innerHTML = '<i class="fas fa-exchange-alt"></i> Portnox Cloud vs. On-Premises';
      console.log('Comparison tab renamed');
    }
    
    // Update other references if needed
    const comparisonTitles = document.querySelectorAll('h3, h2, h4');
    comparisonTitles.forEach(title => {
      if (title.textContent.includes('Cloud vs. On-Premises')) {
        title.textContent = title.textContent.replace('Cloud vs. On-Premises', 'Portnox Cloud vs. On-Premises');
      }
    });
  }
  
  // ==== Sidebar Cleanup ====
  
  // Remove Industry requirements from sidebar
  function removeIndustryFromSidebar() {
    console.log('Removing Industry requirements from sidebar...');
    
    // Hide industry templates card
    const industryCard = document.querySelector('.industry-templates-card');
    if (industryCard) {
      industryCard.style.display = 'none';
      console.log('Industry templates card hidden');
    }
    
    // Hide compliance info container
    const complianceContainer = document.getElementById('compliance-info-container');
    if (complianceContainer) {
      complianceContainer.style.display = 'none';
      console.log('Compliance info container hidden');
    }
    
    // Hide industry benchmarks container
    const benchmarksContainer = document.getElementById('industry-benchmarks-container');
    if (benchmarksContainer) {
      benchmarksContainer.style.display = 'none';
      console.log('Industry benchmarks container hidden');
    }
  }
  
  // ==== Comparison Section Enhancement ====
  
  // Reformat Cloud vs On-Prem comparison in executive summary
  function reformatComparisonSection() {
    console.log('Reformatting comparison section...');
    
    // Find the comparison section in the executive summary
    const comparisonSection = document.getElementById('vendor-comparison');
    if (!comparisonSection) {
      // Try to find the section by other means
      const summaryTab = document.getElementById('summary-tab');
      if (summaryTab) {
        const sections = summaryTab.querySelectorAll('.tab-section');
        for (let section of sections) {
          if (section.querySelector('h2')?.textContent.includes('Comparison')) {
            console.log('Found comparison section by title');
            reformatSectionContent(section);
            return;
          }
        }
        
        // If not found, try to find the comparison grid
        const comparisonGrid = summaryTab.querySelector('.comparison-grid');
        if (comparisonGrid) {
          console.log('Found comparison grid');
          const parentSection = comparisonGrid.closest('.tab-section');
          if (parentSection) {
            reformatSectionContent(parentSection);
            return;
          }
        }
      }
      return;
    }
    
    reformatSectionContent(comparisonSection);
  }
  
  function reformatSectionContent(section) {
    // Create enhanced comparison content
    const enhancedContent = `
      <div class="section-header">
        <h2 class="section-title">Portnox Cloud vs. On-Premises Comparison</h2>
      </div>
      
      <p class="section-description">
        Compare the key differences between Portnox Cloud and traditional on-premises NAC solutions across critical dimensions.
      </p>
      
      <div class="comparison-cards">
        <div class="comparison-card portnox-card">
          <div class="card-header">
            <h3>Portnox Cloud</h3>
            <span class="card-tag">Cloud-Native NAC</span>
          </div>
          <div class="card-body">
            <p>Zero-trust, cloud-native NAC platform unifying authentication, risk mitigation, and remediation with no hardware requirements.</p>
            
            <h4>Key Advantages</h4>
            <ul class="advantage-list">
              <li><i class="fas fa-check-circle"></i> No hardware requirements, no capital expenditure</li>
              <li><i class="fas fa-check-circle"></i> Deployment in hours instead of weeks or months</li>
              <li><i class="fas fa-check-circle"></i> Automatic updates and continuous improvement</li>
              <li><i class="fas fa-check-circle"></i> 60% less IT administrative overhead</li>
              <li><i class="fas fa-check-circle"></i> Unlimited scalability without infrastructure changes</li>
            </ul>
          </div>
        </div>
        
        <div class="comparison-card onprem-card">
          <div class="card-header">
            <h3>On-Premises NAC</h3>
            <span class="card-tag">Hardware-Based</span>
          </div>
          <div class="card-body">
            <p>Traditional NAC solutions requiring dedicated hardware, complex setup, and ongoing maintenance and updates.</p>
            
            <h4>Key Challenges</h4>
            <ul class="challenge-list">
              <li><i class="fas fa-exclamation-circle"></i> Significant hardware investment required</li>
              <li><i class="fas fa-exclamation-circle"></i> Implementation takes weeks to months</li>
              <li><i class="fas fa-exclamation-circle"></i> Manual updates and maintenance windows</li>
              <li><i class="fas fa-exclamation-circle"></i> Requires 1.5-2 FTE for administration</li>
              <li><i class="fas fa-exclamation-circle"></i> Scaling requires additional hardware</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="comparison-table-container">
        <h3>Feature Comparison</h3>
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>On-Premises NAC</th>
              <th>Portnox Cloud</th>
              <th>Advantage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Hardware Requirements</strong></td>
              <td>Dedicated appliances at each location</td>
              <td>No hardware requirements</td>
              <td class="portnox-advantage">Portnox</td>
            </tr>
            <tr>
              <td><strong>Implementation Time</strong></td>
              <td>Weeks to months</td>
              <td>Hours to days</td>
              <td class="portnox-advantage">Portnox</td>
            </tr>
            <tr>
              <td><strong>IT Staff Requirements</strong></td>
              <td>1.5-2 FTE</td>
              <td>0.5 FTE</td>
              <td class="portnox-advantage">Portnox</td>
            </tr>
            <tr>
              <td><strong>Updates & Maintenance</strong></td>
              <td>Manual, scheduled windows</td>
              <td>Automatic, continuous</td>
              <td class="portnox-advantage">Portnox</td>
            </tr>
            <tr>
              <td><strong>Multi-site Deployment</strong></td>
              <td>Hardware at each location</td>
              <td>Single cloud instance for all sites</td>
              <td class="portnox-advantage">Portnox</td>
            </tr>
            <tr>
              <td><strong>Scalability</strong></td>
              <td>Hardware-dependent</td>
              <td>Unlimited</td>
              <td class="portnox-advantage">Portnox</td>
            </tr>
            <tr>
              <td><strong>Total Cost of Ownership</strong></td>
              <td>High (hardware, maintenance, personnel)</td>
              <td>20-30% lower TCO over 3 years</td>
              <td class="portnox-advantage">Portnox</td>
            </tr>
            <tr>
              <td><strong>Initial Investment</strong></td>
              <td>High (hardware, software, implementation)</td>
              <td>Low (subscription model)</td>
              <td class="portnox-advantage">Portnox</td>
            </tr>
            <tr>
              <td><strong>Cloud Integration</strong></td>
              <td>Limited or complex</td>
              <td>Native, seamless</td>
              <td class="portnox-advantage">Portnox</td>
            </tr>
            <tr>
              <td><strong>Zero-Trust Support</strong></td>
              <td>Varies by vendor</td>
              <td>Built-in, comprehensive</td>
              <td class="portnox-advantage">Portnox</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
    
    // Apply the new content
    section.innerHTML = enhancedContent;
    console.log('Comparison section reformatted');
    
    // Also update the comparison in the comparison tab
    const comparisonTabContent = document.getElementById('comparison-tab');
    if (comparisonTabContent) {
      const title = comparisonTabContent.querySelector('h3');
      if (title) {
        title.textContent = 'Portnox Cloud vs. On-Premises Comparison';
      }
    }
  }
  
  // ==== Chart Fixes ====
  
  // Fix chart issues
  function fixChartIssues() {
    console.log('Fixing chart issues...');
    
    // Create missing canvas elements
    const missingCharts = ['cost-factors-chart', 'cost-analysis-chart', 'resource-utilization-chart'];
    
    missingCharts.forEach(chartId => {
      if (!document.getElementById(chartId)) {
        console.log(`Creating missing chart canvas: ${chartId}`);
        
        // Find an appropriate container
        let container;
        if (chartId === 'cost-factors-chart') {
          container = document.querySelector('.results-grid');
        } else if (chartId === 'cost-analysis-chart' || chartId === 'resource-utilization-chart') {
          container = document.querySelectorAll('.results-grid')[1];
        }
        
        if (container) {
          const cardDiv = document.createElement('div');
          cardDiv.className = 'result-card';
          
          const title = document.createElement('h3');
          title.textContent = chartId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace('Chart', '');
          
          const chartContainer = document.createElement('div');
          chartContainer.className = 'chart-container';
          
          const canvas = document.createElement('canvas');
          canvas.id = chartId;
          
          chartContainer.appendChild(canvas);
          cardDiv.appendChild(title);
          cardDiv.appendChild(chartContainer);
          container.appendChild(cardDiv);
        }
      }
    });
    
    // Fix implementation-comparison-chart
    const implChartCanvas = document.getElementById('implementation-comparison-chart');
    if (implChartCanvas) {
      // Remove it from the DOM temporarily
      const parent = implChartCanvas.parentNode;
      const newCanvas = document.createElement('canvas');
      newCanvas.id = 'implementation-comparison-chart';
      
      if (parent) {
        parent.removeChild(implChartCanvas);
        parent.appendChild(newCanvas);
        console.log('implementation-comparison-chart recreated');
      }
    }
  }
  
  // ==== Error Fixes ====
  
  // Fix ComplianceInsights class issues
  function fixComplianceIssues() {
    console.log('Fixing compliance insights issues...');
    
    // Remove any existing instances
    window.complianceInsights = null;
    
    // Create a new, simplified version that does nothing
    window.ComplianceInsights = class {
      constructor() {
        console.log('Simplified ComplianceInsights initialized');
      }
      
      updateComplianceInsights() {
        // do nothing
      }
      
      clearComplianceInsights() {
        // do nothing
      }
      
      refreshComplianceInsights() {
        // do nothing
      }
    };
    
    // Create an empty instance
    window.complianceInsights = new window.ComplianceInsights();
  }
  
  // Fix PDF generator errors
  function fixPDFGenerator() {
    console.log('Fixing PDF generator issues...');
    
    // Add safety check for PDF generation
    if (window.PDFReportGenerator && window.PDFReportGenerator.prototype.generateCompleteReport) {
      const originalGenerateReport = window.PDFReportGenerator.prototype.generateCompleteReport;
      
      window.PDFReportGenerator.prototype.generateCompleteReport = function(data) {
        console.log('Running enhanced PDF report generation...');
        
        // Make sure data is valid
        if (!data) data = {};
        
        // Ensure orgSize is defined
        if (!data.orgSize) {
          data.orgSize = 'medium';
        }
        
        // Apply to the PDF generator instance
        this.orgSize = data.orgSize || 'medium';
        
        try {
          return originalGenerateReport.call(this, data);
        } catch (error) {
          console.error('Error generating PDF report:', error);
          
          // Create a simple fallback report
          if (window.jspdf && window.jspdf.jsPDF) {
            const doc = new window.jspdf.jsPDF();
            doc.text('TCO Analysis Report', 105, 20, { align: 'center' });
            doc.text('Error generating detailed report. Please try again.', 105, 40, { align: 'center' });
            return doc;
          }
          
          return null;
        }
      };
    }
  }
  
  // ==== Chart.js Fixes ====
  
  // Fix Chart.js issues
  function fixChartJS() {
    console.log('Applying Chart.js fixes...');
    
    // Wait for Chart to be loaded
    if (!window.Chart) {
      console.warn('Chart.js not loaded yet, will retry');
      setTimeout(fixChartJS, 500);
      return;
    }
    
    // Initialize chart instances store if not exists
    window._chartInstances = window._chartInstances || {};
    
    // Save the original Chart constructor
    const OriginalChart = window.Chart;
    
    // Create a safer Chart constructor wrapper
    function SafeChart(ctx, config) {
      // Make sure we have a valid context
      if (!ctx || !ctx.canvas) {
        console.warn('Invalid chart context');
        return null;
      }
      
      // Get canvas ID
      const canvasId = ctx.canvas.id;
      
      // Destroy existing chart if it exists
      if (canvasId && window._chartInstances[canvasId]) {
        try {
          if (typeof window._chartInstances[canvasId].destroy === 'function') {
            window._chartInstances[canvasId].destroy();
          }
          delete window._chartInstances[canvasId];
          console.log(`Destroyed existing chart: ${canvasId}`);
        } catch (error) {
          console.error(`Error destroying existing chart: ${canvasId}`, error);
        }
      }
      
      try {
        // Create chart with error handling
        const chart = new OriginalChart(ctx, config);
        
        // Store for later reference
        if (canvasId) {
          window._chartInstances[canvasId] = chart;
        }
        
        return chart;
      } catch (error) {
        console.error(`Error creating chart for ${canvasId}:`, error);
        
        // Try to clear canvas and retry
        try {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          const chart = new OriginalChart(ctx, config);
          
          if (canvasId) {
            window._chartInstances[canvasId] = chart;
          }
          
          return chart;
        } catch (retryError) {
          console.error(`Failed to create chart after retry for ${canvasId}:`, retryError);
          return null;
        }
      }
    }
    
    // Copy prototype and static properties
    SafeChart.prototype = OriginalChart.prototype;
    Object.keys(OriginalChart).forEach(key => {
      SafeChart[key] = OriginalChart[key];
    });
    
    // Replace the Chart constructor
    window.Chart = SafeChart;
    
    console.log('Chart.js patched successfully');
  }
  
  // ==== Initialization ====
  
  // Function to run all fixes
  function runAllFixes() {
    try {
      // Remove Sales Tools tab
      removeSalesToolsTab();
      
      // Rename comparison tab
      renameComparisonTab();
      
      // Remove industry from sidebar
      removeIndustryFromSidebar();
      
      // Reformat comparison section
      reformatComparisonSection();
      
      // Fix chart issues
      fixChartIssues();
      
      // Fix compliance issues
      fixComplianceIssues();
      
      // Fix PDF generator
      fixPDFGenerator();
      
      // Fix Chart.js
      fixChartJS();
      
      console.log('All fixes applied successfully');
      
      // Fix logos one more time
      fixLogos();
      
      // Recalculate after fixes
      setTimeout(triggerRecalculation, 1000);
    } catch (error) {
      console.error('Error applying fixes:', error);
    }
  }
  
  // Fix logos
  function fixLogos() {
    console.log('Fixing logos...');
    
    const logoUrl = 'https://events.vmblog.com/images/Mega%20Series/logo-portnox.png';
    
    document.querySelectorAll('.logo img, img[src*="portnox"]').forEach(img => {
      img.src = logoUrl;
      img.alt = 'Portnox Logo';
    });
  }
  
  // Trigger recalculation
  function triggerRecalculation() {
    console.log('Triggering recalculation...');
    
    if (window.calculator && typeof window.calculator.calculate === 'function') {
      try {
        window.calculator.calculate();
        console.log('Recalculation successful');
      } catch (error) {
        console.error('Error during recalculation:', error);
      }
    }
  }
  
  // Run all fixes with a slight delay to ensure DOM is ready
  setTimeout(runAllFixes, 500);
  
  // Set up a periodic logo fix (sometimes they get reset)
  setInterval(fixLogos, 5000);
  
  console.log('Ultimate Consolidated Fix setup complete');
})();
