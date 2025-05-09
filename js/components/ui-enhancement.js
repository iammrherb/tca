/**
 * UI Enhancement Script
 * Consolidates tabs and enhances the comparison view
 */
(function() {
  console.log('Applying UI Enhancements...');
  
  // Hide sidebar industry content
  function hideSidebarContent() {
    const elementsToHide = [
      '.sidebar-industry-preview',
      '.industry-templates-card',
      '.compliance-info-container'
    ];
    
    elementsToHide.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.display = 'none';
      });
    });
  }
  
  // Enhance the vendor comparison tab
  function enhanceVendorComparison() {
    // Create data for detailed vendor comparison
    const vendorData = {
      portnox: {
        name: "Portnox Cloud",
        type: "Cloud-Native",
        description: "Zero-trust, cloud-native NAC platform unifying authentication, risk mitigation, and remediation with no hardware requirements.",
        advantages: [
          "Cloud-Native Architecture: No hardware, deploy in hours",
          "Automatic Updates: Zero maintenance with continuous improvements",
          "Unlimited Scalability: Effortlessly scales to 100,000+ devices",
          "Lower TCO: 20-30% lower 3-year TCO vs on-premises solutions",
          "Global Access: Single cloud console manages all locations",
          "Minimal IT Resources: 60% less administrative overhead"
        ]
      },
      onprem: {
        name: "On-Premises NAC",
        type: "Hardware-Based",
        description: "Traditional NAC solutions requiring dedicated hardware, complex setup, and ongoing maintenance and updates.",
        disadvantages: [
          "Hardware Requirements: Appliances at every location",
          "Complex Implementation: Weeks to months deployment time",
          "Maintenance Burden: Manual updates and maintenance",
          "Limited Scalability: Hardware dependencies limit growth",
          "Higher TCO: Significant hardware and maintenance costs",
          "IT Resource Intensive: 1.5-2 FTE for administration"
        ]
      }
    };
    
    // Find or create comparison tab
    let comparisonTab = document.getElementById('comparison-tab');
    
    if (!comparisonTab) {
      // Find the tab container
      const tabContentContainer = document.querySelector('.tab-content');
      if (!tabContentContainer) return;
      
      // Create tab content
      comparisonTab = document.createElement('div');
      comparisonTab.id = 'comparison-tab';
      comparisonTab.className = 'tab-pane';
      
      tabContentContainer.appendChild(comparisonTab);
      
      // Create the tab button if it doesn't exist
      const tabsContainer = document.querySelector('.tabs');
      if (tabsContainer) {
        const comparisonButton = document.createElement('button');
        comparisonButton.className = 'tab-button';
        comparisonButton.setAttribute('data-tab', 'comparison-tab');
        comparisonButton.innerHTML = '<i class="fas fa-exchange-alt"></i> Cloud vs. On-Prem';
        
        // Insert after summary tab
        const summaryTab = document.querySelector('[data-tab="summary-tab"]');
        if (summaryTab && summaryTab.nextSibling) {
          tabsContainer.insertBefore(comparisonButton, summaryTab.nextSibling);
        } else {
          tabsContainer.appendChild(comparisonButton);
        }
        
        // Add click handler
        comparisonButton.addEventListener('click', function() {
          // Deactivate all tabs
          document.querySelectorAll('.tab-button').forEach(tab => {
            tab.classList.remove('active');
          });
          
          // Deactivate all tab panes
          document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
          });
          
          // Activate this tab
          this.classList.add('active');
          comparisonTab.classList.add('active');
        });
      }
    }
    
    // Create enhanced comparison content
    comparisonTab.innerHTML = `
      <h3>Cloud vs. On-Premises NAC Comparison</h3>
      <p>Compare the key differences between cloud-native and on-premises NAC solutions across critical dimensions.</p>
      
      <div class="comparison-summary" style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <h4>Executive Summary: Why Portnox Cloud?</h4>
        <p>
          Portnox Cloud delivers a modern, zero-trust NAC solution with significant advantages over traditional on-premises alternatives:
          20-30% lower TCO, 80% faster implementation, and 60% reduced administrative overhead. With no hardware requirements
          and automatic updates, it represents the future of network access control.
        </p>
      </div>
      
      <div class="vendor-cards" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 20px;">
        <div class="vendor-card" style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); border-left: 4px solid #2BD25B;">
          <h4>${vendorData.portnox.name}</h4>
          <div style="font-size: 14px; color: #707070; margin-bottom: 10px; font-style: italic;">${vendorData.portnox.type}</div>
          <p>${vendorData.portnox.description}</p>
          <h5 style="color: #2BD25B; margin-top: 15px;">Key Advantages</h5>
          <ul style="padding-left: 20px; margin-top: 10px;">
            ${vendorData.portnox.advantages.map(adv => `<li>${adv}</li>`).join('')}
          </ul>
        </div>
        
        <div class="vendor-card" style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); border-left: 4px solid #1B67B2;">
          <h4>${vendorData.onprem.name}</h4>
          <div style="font-size: 14px; color: #707070; margin-bottom: 10px; font-style: italic;">${vendorData.onprem.type}</div>
          <p>${vendorData.onprem.description}</p>
          <h5 style="color: #1B67B2; margin-top: 15px;">Key Challenges</h5>
          <ul style="padding-left: 20px; margin-top: 10px;">
            ${vendorData.onprem.disadvantages.map(disadv => `<li>${disadv}</li>`).join('')}
          </ul>
        </div>
      </div>
      
      <h4>Detailed Comparison</h4>
      <div style="overflow-x: auto; margin-bottom: 20px;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="padding: 10px; text-align: left; background-color: #f8f9fa; border-bottom: 2px solid #ddd;">Feature</th>
              <th style="padding: 10px; text-align: left; background-color: #f8f9fa; border-bottom: 2px solid #ddd;">On-Premises NAC</th>
              <th style="padding: 10px; text-align: left; background-color: #f8f9fa; border-bottom: 2px solid #ddd;">Portnox Cloud</th>
              <th style="padding: 10px; text-align: left; background-color: #f8f9fa; border-bottom: 2px solid #ddd;">Advantage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Hardware Requirements</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Dedicated appliances at each location</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">No hardware requirements</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #2BD25B;">Portnox</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Implementation Time</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Weeks to months</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Hours to days</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #2BD25B;">Portnox</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>IT Staff Requirements</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">1.5-2 FTE</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">0.5 FTE</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #2BD25B;">Portnox</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Updates &amp; Maintenance</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Manual, scheduled windows</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Automatic, continuous</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #2BD25B;">Portnox</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Multi-site Deployment</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Hardware at each location</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Single cloud instance for all sites</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #2BD25B;">Portnox</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Scalability</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Hardware-dependent</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Unlimited</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #2BD25B;">Portnox</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Total Cost of Ownership</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">High (hardware, maintenance, personnel)</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">20-30% lower TCO over 3 years</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #2BD25B;">Portnox</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Initial Investment</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">High (hardware, software, implementation)</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Low (subscription model)</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #2BD25B;">Portnox</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Cloud Integration</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Limited or complex</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Native, seamless</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #2BD25B;">Portnox</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Zero-Trust Support</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Varies by vendor</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">Built-in, comprehensive</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #2BD25B;">Portnox</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <h4>Industry-Specific Insights</h4>
      <div class="industry-section" style="margin-top: 20px;">
        <select id="industry-insights-selector" class="form-select" style="max-width: 300px; margin-bottom: 20px;">
          <option value="none">Select industry for specific insights...</option>
          <option value="healthcare">Healthcare</option>
          <option value="financial">Financial Services</option>
          <option value="education">Education</option>
          <option value="government">Government</option>
          <option value="manufacturing">Manufacturing</option>
        </select>
        
        <div id="industry-insights-content">
          <p>Select an industry above to view specific compliance requirements and Portnox advantages for your sector.</p>
        </div>
      </div>
      
      <div class="chart-sections" style="margin-top: 30px;">
        <h4>Cost Analysis Charts</h4>
        <div style="display: grid; grid-template-columns: 1fr; gap: 20px; margin-top: 15px;">
          <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.07);">
            <h5>Cost Factors Impact Analysis</h5>
            <div class="chart-container">
              <canvas id="cost-factors-chart"></canvas>
            </div>
          </div>
          
          <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.07);">
            <h5>ROI Timeline</h5>
            <div class="chart-container">
              <canvas id="roi-timeline-chart"></canvas>
            </div>
          </div>
          
          <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.07);">
            <h5>Cost Analysis Over Time</h5>
            <div class="chart-container">
              <canvas id="cost-analysis-chart"></canvas>
            </div>
          </div>
          
          <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.07);">
            <h5>IT Resource Utilization</h5>
            <div class="chart-container">
              <canvas id="resource-utilization-chart"></canvas>
            </div>
          </div>
          
          <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.07);">
            <h5>Implementation Complexity</h5>
            <div class="chart-container">
              <canvas id="implementation-complexity-chart"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Setup industry selector
    const industrySelector = document.getElementById('industry-insights-selector');
    if (industrySelector) {
      industrySelector.addEventListener('change', function() {
        const industryId = this.value;
        const contentDiv = document.getElementById('industry-insights-content');
        
        if (industryId === 'none' || !contentDiv) {
          return;
        }
        
        // Industry data
        const industryData = {
          healthcare: {
            name: "Healthcare",
            compliance: "Healthcare organizations must comply with HIPAA, HITECH, and other regulations that mandate strong access controls, audit logging, and protection of patient health information (PHI).",
            portnoxAdvantage: "Portnox Cloud provides specialized medical device profiling and security policies with minimal disruption, plus built-in compliance reporting for HIPAA and HITECH with automated remediation.",
            savingsPercent: 35
          },
          financial: {
            name: "Financial Services",
            compliance: "Financial institutions must comply with regulations such as PCI DSS, GLBA, SOX, and others that require strict access controls, network segmentation, and extensive audit capabilities.",
            portnoxAdvantage: "Portnox Cloud delivers 30% savings on multi-location implementations with zero hardware requirements, plus advanced role-based access control with automatic revocation and pre-built compliance templates.",
            savingsPercent: 30
          },
          education: {
            name: "Education",
            compliance: "Educational institutions must comply with regulations like FERPA, COPPA, and in some cases HIPAA for student health services, requiring strong access controls while supporting diverse user populations.",
            portnoxAdvantage: "Portnox Cloud delivers 40% lower TCO than on-premises alternatives with subscription pricing model, plus self-service device registration to reduce IT burden during peak enrollment periods.",
            savingsPercent: 40
          },
          government: {
            name: "Government",
            compliance: "Government agencies must adhere to regulations such as FISMA, NIST 800-53, FedRAMP, and others that mandate strong security controls, continuous monitoring, and risk management.",
            portnoxAdvantage: "Portnox Cloud provides built-in FISMA and NIST compliance reporting with continuous monitoring, plus centralized cloud-based authentication with federated identity support for cross-agency access.",
            savingsPercent: 32
          },
          manufacturing: {
            name: "Manufacturing",
            compliance: "Manufacturing environments need to secure both IT and OT (Operational Technology) networks, often requiring compliance with industry standards such as NIST CSF, IEC 62443, and similar standards.",
            portnoxAdvantage: "Portnox Cloud offers dedicated OT device profiling with separate security policies for industrial systems, plus protocol-agnostic identification of legacy industrial devices with 99.99% uptime SLA.",
            savingsPercent: 38
          }
        };
        
        const industry = industryData[industryId];
        
        contentDiv.innerHTML = `
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
            <h5 style="color: #1B67B2; margin-top: 0;">${industry.name} Industry</h5>
            <p><strong>Compliance Requirements:</strong> ${industry.compliance}</p>
            <p><strong>Portnox Advantage:</strong> ${industry.portnoxAdvantage}</p>
            <p><strong>Average TCO Savings:</strong> ${industry.savingsPercent}% lower than on-premises alternatives</p>
          </div>
        `;
      });
    }
  }
  
  // Merge industry and compliance tabs
  function mergeIndustryComplianceTabs() {
    // Remove industry tab if it exists
    const industryTab = document.querySelector('[data-tab="industry-tab"]');
    if (industryTab) {
      industryTab.remove();
    }
    
    const industryPane = document.getElementById('industry-tab');
    if (industryPane) {
      industryPane.remove();
    }
  }
  
  // Fix cost configuration
  function enhanceCostConfiguration() {
    // Find the advanced options panel
    const advancedPanel = document.getElementById('advanced-options-panel');
    if (!advancedPanel) return;
    
    // Check if cost config section exists
    let costConfig = document.getElementById('cost-config-section');
    if (!costConfig) {
      // Create cost config section
      costConfig = document.createElement('div');
      costConfig.id = 'cost-config-section';
      costConfig.className = 'advanced-settings-section';
      
      // Add enhanced cost configuration
      costConfig.innerHTML = `
        <h5 style="color: #1B67B2; margin-bottom: 10px;">Enhanced Cost Configuration</h5>
        <p style="font-size: 14px; color: #505050; margin-bottom: 15px;">
          Configure detailed cost parameters to customize the TCO analysis with dollar values specific to your organization.
          All changes will automatically update the charts and calculations.
        </p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
          <div>
            <label for="cost-hardware" style="display: block; font-weight: 500; margin-bottom: 5px;">Hardware Costs ($)</label>
            <input type="number" id="cost-hardware" min="0" step="1000" value="10000" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <p style="font-size: 12px; color: #707070; margin-top: 5px;">Base hardware cost for on-premises deployment</p>
          </div>
          
          <div>
            <label for="cost-licensing" style="display: block; font-weight: 500; margin-bottom: 5px;">Licensing Costs ($)</label>
            <input type="number" id="cost-licensing" min="0" step="1000" value="25000" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <p style="font-size: 12px; color: #707070; margin-top: 5px;">Annual licensing fees per vendor</p>
          </div>
          
          <div>
            <label for="cost-maintenance" style="display: block; font-weight: 500; margin-bottom: 5px;">Maintenance Costs ($)</label>
            <input type="number" id="cost-maintenance" min="0" step="1000" value="15000" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <p style="font-size: 12px; color: #707070; margin-top: 5px;">Annual maintenance and support costs</p>
          </div>
          
          <div>
            <label for="cost-implementation" style="display: block; font-weight: 500; margin-bottom: 5px;">Implementation ($)</label>
            <input type="number" id="cost-implementation" min="0" step="5000" value="30000" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <p style="font-size: 12px; color: #707070; margin-top: 5px;">Implementation and professional services costs</p>
          </div>
          
          <div>
            <label for="cost-personnel" style="display: block; font-weight: 500; margin-bottom: 5px;">Personnel Costs ($)</label>
            <input type="number" id="cost-personnel" min="0" step="10000" value="100000" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <p style="font-size: 12px; color: #707070; margin-top: 5px;">Annual cost per full-time equivalent (FTE)</p>
          </div>
          
          <div>
            <label for="cost-downtime" style="display: block; font-weight: 500; margin-bottom: 5px;">Downtime Cost ($/hour)</label>
            <input type="number" id="cost-downtime" min="0" step="1000" value="5000" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <p style="font-size: 12px; color: #707070; margin-top: 5px;">Cost per hour of system downtime</p>
          </div>
        </div>
        
        <h5 style="color: #1B67B2; margin-top: 20px; margin-bottom: 10px;">Vendor-Specific Settings</h5>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; margin-top: 10px;">
          <div>
            <label style="display: block; font-weight: 500; margin-bottom: 5px;">
              Portnox Discount (%)
              <span style="background: #2BD25B; color: white; border-radius: 4px; padding: 2px 6px; font-size: 11px; font-weight: 600; margin-left: 5px;">Recommended</span>
            </label>
            <input type="range" id="portnox-discount" min="0" max="40" step="5" value="25" style="width: 100%;">
            <div style="display: flex; justify-content: space-between; font-size: 12px; color: #707070;">
              <span>0%</span>
              <span id="portnox-discount-display">25%</span>
              <span>40%</span>
            </div>
          </div>
          
          <div>
            <label for="competitor-discount" style="display: block; font-weight: 500; margin-bottom: 5px;">Competitor Discount (%)</label>
            <input type="range" id="competitor-discount" min="0" max="25" step="5" value="0" style="width: 100%;">
            <div style="display: flex; justify-content: space-between; font-size: 12px; color: #707070;">
              <span>0%</span>
              <span id="competitor-discount-display">0%</span>
              <span>25%</span>
            </div>
          </div>
        </div>
        
        <button id="apply-cost-settings" style="background: #1B67B2; color: white; border: none; border-radius: 4px; padding: 8px 15px; margin-top: 15px; cursor: pointer;">
          Apply Settings & Recalculate
        </button>
      `;
      
      // Add to advanced panel
      advancedPanel.appendChild(costConfig);
      
      // Set up event listeners for range inputs
      const portnoxDiscount = document.getElementById('portnox-discount');
      const portnoxDiscountDisplay = document.getElementById('portnox-discount-display');
      
      if (portnoxDiscount && portnoxDiscountDisplay) {
        portnoxDiscount.addEventListener('input', function() {
          portnoxDiscountDisplay.textContent = this.value + '%';
        });
      }
      
      const competitorDiscount = document.getElementById('competitor-discount');
      const competitorDiscountDisplay = document.getElementById('competitor-discount-display');
      
      if (competitorDiscount && competitorDiscountDisplay) {
        competitorDiscount.addEventListener('input', function() {
          competitorDiscountDisplay.textContent = this.value + '%';
        });
      }
      
      // Set up apply button
      const applyButton = document.getElementById('apply-cost-settings');
      if (applyButton) {
        applyButton.addEventListener('click', function() {
          triggerCalculation();
        });
      }
    }
  }
  
  // Trigger calculation update
  function triggerCalculation() {
    if (window.calculator && typeof window.calculator.calculate === 'function') {
      console.log('Triggering calculation update...');
      window.calculator.calculate();
      
      // Reinitialize charts after calculation
      setTimeout(function() {
        if (window.ChartEnhancer) {
          window.ChartEnhancer.initMissingCharts();
        }
      }, 500);
    }
  }
  
  // Fix logo
  function fixLogo() {
    const logoUrl = 'https://events.vmblog.com/images/Mega%20Series/logo-portnox.png';
    
    document.querySelectorAll('.logo img, img[src*="portnox"], .vendor-card[data-vendor="portnox"] img').forEach(img => {
      img.src = logoUrl;
      img.alt = 'Portnox Logo';
    });
  }
  
  // Fix PDF Generator errors
  function fixPDFGenerator() {
    // Fix PDF generator error for orgSize
    if (window.PDFReportGenerator && window.PDFReportGenerator.prototype.generateCompleteReport) {
      const originalGenerateCompleteReport = window.PDFReportGenerator.prototype.generateCompleteReport;
      
      window.PDFReportGenerator.prototype.generateCompleteReport = function(data) {
        console.log('Running enhanced PDF report generation...');
        
        // Make sure orgSize is defined
        if (!data.orgSize) {
          data.orgSize = 'medium';
        }
        
        // Also make sure it's applied to the PDF generator itself
        this.orgSize = data.orgSize || 'medium';
        
        // Call original method with fixed data
        return originalGenerateCompleteReport.call(this, data);
      };
      
      console.log('PDF Generator fixed');
    }
  }
  
  // Initialize all enhancements
  function init() {
    // Add css fixes for charts
    const style = document.createElement('style');
    style.textContent = `
      .chart-container {
        display: block !important;
        height: 300px !important;
        position: relative !important;
        width: 100% !important;
        margin-bottom: 20px !important;
      }
      
      canvas {
        display: block !important;
      }
      
      .logo img {
        height: 40px !important;
        width: auto !important;
        object-fit: contain !important;
      }
      
      .sidebar-industry-preview,
      .industry-templates-card,
      .compliance-info-container {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    
    // Apply all enhancements
    hideSidebarContent();
    enhanceVendorComparison();
    mergeIndustryComplianceTabs();
    enhanceCostConfiguration();
    fixLogo();
    fixPDFGenerator();
    
    // Set interval to ensure fixes remain applied
    setInterval(hideSidebarContent, 2000);
    setInterval(fixLogo, 2000);
    
    console.log('UI Enhancements applied successfully');
  }
  
  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
