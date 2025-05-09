/**
 * Enhanced Vendor Comparison
 * Creates detailed vendor comparison between cloud and on-premises NAC solutions
 */
(function() {
  console.log('Installing Enhanced Vendor Comparison...');
  
  // Vendor comparison data
  window.vendorDetails = {
    portnox: {
      name: "Portnox Cloud",
      type: "Cloud-Native",
      logo: "https://events.vmblog.com/images/Mega%20Series/logo-portnox.png",
      description: "Zero-trust, cloud-native NAC platform unifying authentication, risk mitigation, and remediation.",
      features: {
        deployment: {
          title: "Deployment",
          value: "Cloud-Native, No Hardware",
          advantage: "Deploy in hours instead of weeks - zero on-premises hardware required"
        },
        deviceVisibility: {
          title: "Device Visibility",
          value: "Comprehensive, Real-time",
          advantage: "Complete device visibility with cloud-based continuous monitoring"
        },
        authentication: {
          title: "Authentication",
          value: "Multiple Methods, Cloud RADIUS",
          advantage: "Simplified management with cloud RADIUS and multiple authentication options"
        },
        updates: {
          title: "Updates & Maintenance",
          value: "Automatic",
          advantage: "Zero maintenance with automatic updates managed by Portnox"
        },
        integration: {
          title: "Cloud Integration",
          value: "Native",
          advantage: "Seamless integration with cloud identity providers and SaaS applications"
        },
        scalability: {
          title: "Scalability",
          value: "Unlimited",
          advantage: "Effortlessly scale from 100 to 100,000+ devices without infrastructure changes"
        },
        implementation: {
          title: "Implementation Time",
          value: "Hours to Days",
          advantage: "Deploy in hours with minimal IT resources required"
        },
        personnel: {
          title: "IT Personnel",
          value: "0.5 FTE",
          advantage: "Significantly reduced personnel requirements compared to on-premises solutions"
        }
      }
    },
    cisco: {
      name: "Cisco ISE",
      type: "On-Premises",
      description: "Comprehensive network access control platform with strong integration for Cisco environments.",
      features: {
        deployment: {
          title: "Deployment",
          value: "On-premises hardware appliances"
        },
        deviceVisibility: {
          title: "Device Visibility",
          value: "Comprehensive"
        },
        authentication: {
          title: "Authentication",
          value: "Multiple Methods"
        },
        updates: {
          title: "Updates & Maintenance",
          value: "Manual"
        },
        integration: {
          title: "Cloud Integration",
          value: "Limited"
        },
        scalability: {
          title: "Scalability",
          value: "Hardware-dependent"
        },
        implementation: {
          title: "Implementation Time",
          value: "Weeks to Months"
        },
        personnel: {
          title: "IT Personnel",
          value: "1.5-2 FTE"
        }
      }
    },
    aruba: {
      name: "Aruba ClearPass",
      type: "On-Premises",
      description: "Access control solution with strong multi-vendor support and detailed policy controls.",
      features: {
        deployment: {
          title: "Deployment",
          value: "On-premises appliances, Virtual machines"
        },
        deviceVisibility: {
          title: "Device Visibility",
          value: "Very Good"
        },
        authentication: {
          title: "Authentication",
          value: "Multiple Methods, Built-in CA"
        },
        updates: {
          title: "Updates & Maintenance",
          value: "Manual"
        },
        integration: {
          title: "Cloud Integration",
          value: "Moderate"
        },
        scalability: {
          title: "Scalability",
          value: "Hardware-dependent"
        },
        implementation: {
          title: "Implementation Time",
          value: "Weeks to Months"
        },
        personnel: {
          title: "IT Personnel",
          value: "1-1.5 FTE"
        }
      }
    },
    forescout: {
      name: "Forescout",
      type: "On-Premises",
      description: "Agentless visibility and control platform with strong OT security capabilities.",
      features: {
        deployment: {
          title: "Deployment",
          value: "On-premises appliances"
        },
        deviceVisibility: {
          title: "Device Visibility",
          value: "Excellent, Agentless"
        },
        authentication: {
          title: "Authentication",
          value: "Multiple Methods"
        },
        updates: {
          title: "Updates & Maintenance",
          value: "Manual"
        },
        integration: {
          title: "Cloud Integration",
          value: "Limited"
        },
        scalability: {
          title: "Scalability",
          value: "Hardware-dependent"
        },
        implementation: {
          title: "Implementation Time",
          value: "Weeks to Months"
        },
        personnel: {
          title: "IT Personnel",
          value: "1.2-1.8 FTE"
        }
      }
    },
    securew2: {
      name: "SecureW2",
      type: "Cloud",
      description: "Cloud solution focused on certificate-based authentication and passwordless access.",
      features: {
        deployment: {
          title: "Deployment",
          value: "Cloud with connectors"
        },
        deviceVisibility: {
          title: "Device Visibility",
          value: "Good"
        },
        authentication: {
          title: "Authentication",
          value: "Certificate-based"
        },
        updates: {
          title: "Updates & Maintenance",
          value: "Automatic"
        },
        integration: {
          title: "Cloud Integration",
          value: "Very Good"
        },
        scalability: {
          title: "Scalability",
          value: "Good"
        },
        implementation: {
          title: "Implementation Time",
          value: "Days to Weeks"
        },
        personnel: {
          title: "IT Personnel",
          value: "0.7-1 FTE"
        }
      }
    }
  };
  
  // Create comparison tab
  function createComparisonTab() {
    // Find a good position for the tab
    const summaryTab = document.querySelector('[data-tab="summary-tab"]');
    const comparisonTab = document.querySelector('[data-tab="comparison-tab"]');
    
    // If tab already exists, don't recreate
    if (comparisonTab) {
      return;
    }
    
    if (summaryTab) {
      // Create tab button
      const newTab = document.createElement('button');
      newTab.className = 'tab-button';
      newTab.setAttribute('role', 'tab');
      newTab.setAttribute('aria-selected', 'false');
      newTab.setAttribute('data-tab', 'comparison-tab');
      newTab.setAttribute('tabindex', '-1');
      newTab.innerHTML = '<i class="fas fa-exchange-alt"></i> Cloud vs. On-Prem';
      
      // Insert after summary tab
      summaryTab.parentNode.insertBefore(newTab, summaryTab.nextSibling);
      
      // Create content for comparison tab
      const tabContentContainer = document.querySelector('.tab-content');
      if (tabContentContainer) {
        const comparisonContent = document.createElement('div');
        comparisonContent.id = 'comparison-tab';
        comparisonContent.className = 'tab-pane';
        comparisonContent.setAttribute('role', 'tabpanel');
        comparisonContent.setAttribute('aria-hidden', 'true');
        
        // Initial content
        comparisonContent.innerHTML = `
          <div class="comparison-header">
            <h3>Cloud vs. On-Premises NAC Comparison</h3>
            <p>Compare the key differences between cloud-native and on-premises NAC solutions across critical dimensions.</p>
          </div>
          
          <div class="vendor-selector-container">
            <label for="comparison-vendor-selector"><b>Compare Portnox Cloud with:</b></label>
            <select id="comparison-vendor-selector" class="form-select" style="margin-left: 15px; max-width: 300px;">
              <option value="cisco">Cisco ISE</option>
              <option value="aruba">Aruba ClearPass</option>
              <option value="forescout">Forescout</option>
              <option value="securew2">SecureW2</option>
            </select>
          </div>
          
          <div class="comparison-content">
            <div class="vendor-overview">
              <div class="vendor-cards">
                <div class="vendor-card portnox-card">
                  <h4>Portnox Cloud</h4>
                  <div class="vendor-type">Cloud-Native NAC</div>
                  <p>Zero-trust, cloud-native NAC platform unifying authentication, risk mitigation, and remediation.</p>
                </div>
                
                <div class="vendor-card other-vendor-card">
                  <h4 id="other-vendor-name">Cisco ISE</h4>
                  <div class="vendor-type" id="other-vendor-type">On-Premises NAC</div>
                  <p id="other-vendor-description">Comprehensive network access control platform with strong integration for Cisco environments.</p>
                </div>
              </div>
            </div>
            
            <h4>Feature Comparison</h4>
            <div id="feature-comparison-container" class="feature-comparison-grid">
              <!-- Feature comparison cards will be added here -->
            </div>
            
            <div class="cloud-advantages">
              <h4>Cloud NAC Advantages</h4>
              <div class="advantages-grid">
                <div class="advantage-card">
                  <div class="advantage-icon">
                    <i class="fas fa-money-bill-wave"></i>
                  </div>
                  <div class="advantage-content">
                    <h5>Lower Total Cost of Ownership</h5>
                    <p>Cloud NAC solutions typically deliver 20-30% lower TCO over a 3-year period with no hardware costs and reduced administrative overhead.</p>
                  </div>
                </div>
                
                <div class="advantage-card">
                  <div class="advantage-icon">
                    <i class="fas fa-rocket"></i>
                  </div>
                  <div class="advantage-content">
                    <h5>Rapid Implementation</h5>
                    <p>Deploy in hours instead of months, with significantly reduced project complexity and resource requirements.</p>
                  </div>
                </div>
                
                <div class="advantage-card">
                  <div class="advantage-icon">
                    <i class="fas fa-sync"></i>
                  </div>
                  <div class="advantage-content">
                    <h5>Automatic Updates</h5>
                    <p>Always running the latest version with security patches, bug fixes, and new features delivered automatically.</p>
                  </div>
                </div>
                
                <div class="advantage-card">
                  <div class="advantage-icon">
                    <i class="fas fa-expand-arrows-alt"></i>
                  </div>
                  <div class="advantage-content">
                    <h5>Unlimited Scalability</h5>
                    <p>Effortlessly scale from hundreds to hundreds of thousands of devices without infrastructure changes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        
        tabContentContainer.appendChild(comparisonContent);
        
        // Setup tab click event
        newTab.addEventListener('click', function() {
          // Deactivate all tabs
          document.querySelectorAll('.tab-button').forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
            tab.setAttribute('tabindex', '-1');
          });
          
          // Deactivate all tab panes
          document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
            pane.setAttribute('aria-hidden', 'true');
          });
          
          // Activate this tab
          this.classList.add('active');
          this.setAttribute('aria-selected', 'true');
          this.setAttribute('tabindex', '0');
          
          // Show tab content
          comparisonContent.classList.add('active');
          comparisonContent.setAttribute('aria-hidden', 'false');
          
          // Update feature comparison
          updateFeatureComparison('cisco');
        });
        
        // Setup vendor selector with a slight delay to ensure DOM is ready
        setTimeout(() => {
          const vendorSelector = document.getElementById('comparison-vendor-selector');
          if (vendorSelector) {
            vendorSelector.addEventListener('change', function() {
              updateFeatureComparison(this.value);
            });
          }
        }, 500);
      }
    }
  }
  
  // Update feature comparison based on selected vendor
  function updateFeatureComparison(vendorId) {
    const container = document.getElementById('feature-comparison-container');
    
    // Also update vendor card
    const vendorNameEl = document.getElementById('other-vendor-name');
    const vendorTypeEl = document.getElementById('other-vendor-type');
    const vendorDescEl = document.getElementById('other-vendor-description');
    
    if (!container || !vendorNameEl || !vendorDetails) return;
    
    const portnox = vendorDetails.portnox;
    const otherVendor = vendorDetails[vendorId] || vendorDetails.cisco;
    
    // Update vendor card
    vendorNameEl.textContent = otherVendor.name;
    vendorTypeEl.textContent = otherVendor.type + ' NAC';
    vendorDescEl.textContent = otherVendor.description;
    
    // Clear container
    container.innerHTML = '';
    
    // Add feature comparison cards
    Object.keys(portnox.features).forEach(key => {
      const portnoxFeature = portnox.features[key];
      const otherVendorFeature = otherVendor.features[key] || { title: portnoxFeature.title, value: 'Limited' };
      
      const card = document.createElement('div');
      card.className = 'feature-card';
      
      card.innerHTML = `
        <div class="feature-title">${portnoxFeature.title}</div>
        <div class="feature-comparison">
          <div><strong>${portnox.name}:</strong> ${portnoxFeature.value}</div>
          <div><strong>${otherVendor.name}:</strong> ${otherVendorFeature.value}</div>
        </div>
        ${portnoxFeature.advantage ? `
        <div class="vendor-advantage">
          <div class="vendor-advantage-title">
            <i class="fas fa-check-circle"></i> Portnox Advantage
          </div>
          <div class="vendor-advantage-description">${portnoxFeature.advantage}</div>
        </div>
        ` : ''}
      `;
      
      container.appendChild(card);
    });
  }
  
  // Add CSS
  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Comparison tab styling */
      .comparison-header {
        margin-bottom: 20px;
      }
      
      .comparison-header h3 {
        margin-bottom: 10px;
        color: #1B67B2;
      }
      
      .comparison-header p {
        color: #505050;
        font-size: 1rem;
        line-height: 1.5;
      }
      
      .vendor-selector-container {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
      }
      
      .vendor-overview {
        margin-bottom: 30px;
      }
      
      .vendor-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }
      
      .vendor-card {
        background: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        transition: all 0.2s ease;
      }
      
      .vendor-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      
      .portnox-card {
        border-left: 4px solid #2BD25B;
      }
      
      .other-vendor-card {
        border-left: 4px solid #1B67B2;
      }
      
      .vendor-card h4 {
        margin-top: 0;
        margin-bottom: 5px;
        color: #1B67B2;
      }
      
      .vendor-type {
        font-size: 14px;
        color: #707070;
        margin-bottom: 10px;
        font-style: italic;
      }
      
      .vendor-card p {
        color: #505050;
        font-size: 14px;
        line-height: 1.5;
        margin-bottom: 0;
      }
      
      .feature-comparison-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin: 20px 0 30px 0;
      }
      
      .feature-card {
        background: white;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        border-left: 3px solid #2BD25B;
        transition: all 0.2s ease;
      }
      
      .feature-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      
      .feature-title {
        font-weight: 600;
        color: #1B67B2;
        margin-bottom: 8px;
        font-size: 1.05rem;
      }
      
      .feature-comparison {
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin-bottom: 10px;
      }
      
      .vendor-advantage {
        background-color: rgba(43, 210, 91, 0.1);
        border-radius: 4px;
        padding: 8px 12px;
        margin-top: 10px;
      }
      
      .vendor-advantage-title {
        font-weight: 600;
        color: #2BD25B;
        margin-bottom: 5px;
        display: flex;
        align-items: center;
        gap: 5px;
      }
      
      .vendor-advantage-description {
        font-size: 0.9rem;
        color: #505050;
        line-height: 1.4;
      }
      
      .cloud-advantages h4 {
        margin-bottom: 20px;
        color: #1B67B2;
      }
      
      .advantages-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
      }
      
      .advantage-card {
        display: flex;
        gap: 15px;
        background: white;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        transition: all 0.2s ease;
      }
      
      .advantage-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      
      .advantage-icon {
        font-size: 1.5rem;
        color: #2BD25B;
        min-width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .advantage-content h5 {
        margin-top: 0;
        margin-bottom: 8px;
        color: #1B67B2;
        font-size: 1rem;
      }
      
      .advantage-content p {
        color: #505050;
        font-size: 14px;
        line-height: 1.5;
        margin-bottom: 0;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // Initialize
  function init() {
    addStyles();
    createComparisonTab();
  }
  
  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  console.log('Enhanced Vendor Comparison installed');
})();
