/**
 * Combined Comparison and Industry Tab
 * Merges the Cloud vs. On-Prem and Industry Compliance views into a single enhanced tab
 */
(function() {
  console.log('Creating combined comparison and industry tab...');
  
  // Create the data repository
  window.comparisonData = {
    vendors: {
      portnox: {
        name: "Portnox Cloud",
        type: "Cloud-Native",
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
          },
          totalCost: {
            title: "Total Cost of Ownership",
            value: "Low to Medium",
            advantage: "20-30% lower TCO over 3 years compared to on-premises solutions"
          },
          security: {
            title: "Security Updates",
            value: "Continuous",
            advantage: "Always-on security with automatic updates and continuous improvement"
          },
          multisite: {
            title: "Multi-Site Deployment",
            value: "Global, Centralized",
            advantage: "Single cloud-based console manages all locations without additional hardware"
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
          },
          totalCost: {
            title: "Total Cost of Ownership",
            value: "High"
          },
          security: {
            title: "Security Updates",
            value: "Manual, Periodic"
          },
          multisite: {
            title: "Multi-Site Deployment",
            value: "Requires hardware per site"
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
          },
          totalCost: {
            title: "Total Cost of Ownership",
            value: "Medium to High"
          },
          security: {
            title: "Security Updates",
            value: "Manual, Periodic"
          },
          multisite: {
            title: "Multi-Site Deployment",
            value: "Requires hardware per site"
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
          },
          totalCost: {
            title: "Total Cost of Ownership",
            value: "High"
          },
          security: {
            title: "Security Updates",
            value: "Manual, Periodic"
          },
          multisite: {
            title: "Multi-Site Deployment",
            value: "Requires hardware per site"
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
          },
          totalCost: {
            title: "Total Cost of Ownership",
            value: "Medium"
          },
          security: {
            title: "Security Updates",
            value: "Automatic"
          },
          multisite: {
            title: "Multi-Site Deployment",
            value: "Cloud-based with connectors"
          }
        }
      }
    },
    industries: {
      healthcare: {
        name: "Healthcare",
        icon: "heartbeat",
        benchmarks: {
          tco: 3500000,
          implementationTime: 90,
          fteCost: 450000,
          cloudSavings: 35
        },
        compliance: {
          title: "Healthcare Compliance Requirements",
          description: "Healthcare organizations must comply with HIPAA, HITECH, and other regulations that mandate strong access controls, audit logging, and protection of patient health information (PHI).",
          requirements: [
            "Strong authentication mechanisms for clinical systems access",
            "Automatic logoff functionality from unattended workstations",
            "Detailed audit logging of all access to sensitive data",
            "Network segmentation between clinical and administrative systems",
            "Continuous monitoring of connected devices",
            "Automated compliance reporting capabilities"
          ]
        },
        challenges: [
          {
            challenge: "Medical Device Security",
            solution: "Specialized profiling and security policies for medical devices with minimal disruption",
            portnoxAdvantage: "Cloud-native profiling with no hardware footprint, ideal for medical environments"
          },
          {
            challenge: "Multi-facility Deployment",
            solution: "Cloud architecture enables consistent policy enforcement across all locations with centralized management",
            portnoxAdvantage: "Single cloud console manages all locations without additional hardware or complexity"
          },
          {
            challenge: "Compliance Reporting",
            solution: "Automated documentation and comprehensive audit logging simplifies compliance audits",
            portnoxAdvantage: "Built-in compliance reporting for HIPAA and HITECH with automated remediation"
          }
        ]
      },
      financial: {
        name: "Financial Services",
        icon: "university",
        benchmarks: {
          tco: 4200000,
          implementationTime: 120,
          fteCost: 570000,
          cloudSavings: 30
        },
        compliance: {
          title: "Financial Services Compliance Requirements",
          description: "Financial institutions must comply with regulations such as PCI DSS, GLBA, SOX, and others that require strict access controls, network segmentation, and extensive audit capabilities.",
          requirements: [
            "Multi-factor authentication for administrative access",
            "Network segmentation between cardholder data environments and other networks",
            "Real-time monitoring of all network access events",
            "Continuous compliance posture assessment",
            "Detailed audit trails for regulatory reporting",
            "Automated remediation of non-compliant devices"
          ]
        },
        challenges: [
          {
            challenge: "Branch Location Security",
            solution: "Cloud NAC provides consistent security across all branches without requiring hardware at each location",
            portnoxAdvantage: "Zero-hardware branch deployment saves 30%+ on multi-location implementations"
          },
          {
            challenge: "Third-Party Access",
            solution: "Granular policies for contractors, auditors, and partners with temporary access requirements",
            portnoxAdvantage: "Advanced role-based access control with time-limited credentials and automatic revocation"
          },
          {
            challenge: "Regulatory Compliance",
            solution: "Comprehensive logging and reporting capabilities provide ready documentation for auditors",
            portnoxAdvantage: "Pre-built compliance templates for PCI-DSS, GLBA, and SOX with continuous monitoring"
          }
        ]
      },
      government: {
        name: "Government",
        icon: "landmark",
        benchmarks: {
          tco: 4800000,
          implementationTime: 150,
          fteCost: 620000,
          cloudSavings: 32
        },
        compliance: {
          title: "Government Compliance Requirements",
          description: "Government agencies must adhere to regulations such as FISMA, NIST 800-53, FedRAMP, and others that mandate strong security controls, continuous monitoring, and risk management.",
          requirements: [
            "Multi-factor authentication implementation",
            "Continuous monitoring of network access",
            "Device compliance verification",
            "Network segmentation by security classification",
            "Detailed audit logging and reporting",
            "Automated remediation of security issues"
          ]
        },
        challenges: [
          {
            challenge: "Legacy System Integration",
            solution: "Specialized support for older systems that must remain in service due to mission requirements",
            portnoxAdvantage: "Agentless approach supports legacy systems without requiring endpoint software"
          },
          {
            challenge: "Compliance Documentation",
            solution: "Comprehensive reporting capabilities to demonstrate compliance with federal security requirements",
            portnoxAdvantage: "Built-in FISMA and NIST compliance reporting with continuous monitoring"
          },
          {
            challenge: "Cross-Agency Access",
            solution: "Secure authentication mechanisms for personnel who require access across different agencies or departments",
            portnoxAdvantage: "Centralized cloud-based authentication with federated identity support"
          }
        ]
      },
      education: {
        name: "Education",
        icon: "graduation-cap",
        benchmarks: {
          tco: 2500000,
          implementationTime: 75,
          fteCost: 320000,
          cloudSavings: 40
        },
        compliance: {
          title: "Education Compliance Requirements",
          description: "Educational institutions must comply with regulations like FERPA, COPPA, and in some cases HIPAA for student health services, requiring strong access controls while supporting a diverse user population.",
          requirements: [
            "Secure access to student information systems",
            "Age-appropriate access controls for K-12 environments",
            "Network segmentation between administrative, academic, and residential networks",
            "Support for BYOD and personal devices",
            "Guest access for visitors and events",
            "Protection of research data and intellectual property"
          ]
        },
        challenges: [
          {
            challenge: "High Device Turnover",
            solution: "Simplified onboarding and offboarding process for student devices at the beginning and end of academic terms",
            portnoxAdvantage: "Self-service device registration and automatic policy application reduces IT burden"
          },
          {
            challenge: "Diverse Device Types",
            solution: "Comprehensive device profiling handles various operating systems and device types common in educational environments",
            portnoxAdvantage: "Universal device support with automatic OS detection and appropriate policy application"
          },
          {
            challenge: "Budget Constraints",
            solution: "Cloud-based subscription model reduces capital expenditure and ongoing administrative costs",
            portnoxAdvantage: "40% lower TCO than on-premises alternatives with subscription pricing model"
          }
        ]
      },
      manufacturing: {
        name: "Manufacturing",
        icon: "industry",
        benchmarks: {
          tco: 3100000,
          implementationTime: 95,
          fteCost: 380000,
          cloudSavings: 38
        },
        compliance: {
          title: "Manufacturing Compliance Requirements",
          description: "Manufacturing environments need to secure both IT and OT (Operational Technology) networks, often requiring compliance with industry standards such as NIST CSF, IEC 62443, and similar standards.",
          requirements: [
            "Segmentation between IT and OT networks",
            "Protection of industrial control systems",
            "Support for specialized industrial devices",
            "Continuous monitoring of connected equipment",
            "Integration with industrial protocols",
            "Minimal disruption to production processes"
          ]
        },
        challenges: [
          {
            challenge: "OT/IT Convergence",
            solution: "Specialized policies for operational technology devices while maintaining security boundaries",
            portnoxAdvantage: "Dedicated OT device profiling with separate security policies for industrial systems"
          },
          {
            challenge: "Legacy Industrial Equipment",
            solution: "Support for older industrial protocols and devices that cannot be easily upgraded",
            portnoxAdvantage: "Protocol-agnostic identification and profiling of legacy industrial devices"
          },
          {
            challenge: "Production Network Availability",
            solution: "High availability design ensures authentication systems do not impact production uptime",
            portnoxAdvantage: "Cloud architecture with 99.99% uptime SLA and local authentication caching"
          }
        ]
      }
    }
  };
  
  // Create the combined tab
  function createCombinedTab() {
    // Find the tab container
    const tabsContainer = document.querySelector('.tabs');
    if (!tabsContainer) {
      console.warn('Tabs container not found');
      return;
    }
    
    // Create or update the tab button
    let combinedTab = document.querySelector('[data-tab="comparison-tab"]');
    if (!combinedTab) {
      combinedTab = document.createElement('button');
      combinedTab.className = 'tab-button';
      combinedTab.setAttribute('role', 'tab');
      combinedTab.setAttribute('aria-selected', 'false');
      combinedTab.setAttribute('data-tab', 'comparison-tab');
      combinedTab.setAttribute('tabindex', '-1');
      
      // Insert after summary tab
      const summaryTab = document.querySelector('[data-tab="summary-tab"]');
      if (summaryTab && summaryTab.nextSibling) {
        tabsContainer.insertBefore(combinedTab, summaryTab.nextSibling);
      } else {
        tabsContainer.appendChild(combinedTab);
      }
    }
    
    // Update tab label
    combinedTab.innerHTML = '<i class="fas fa-exchange-alt"></i> Cloud vs. On-Prem';
    
    // Remove any existing industry tab
    const industryTab = document.querySelector('[data-tab="industry-tab"]');
    if (industryTab) {
      industryTab.remove();
    }
    
    // Create tab content container
    let tabContent = document.getElementById('comparison-tab');
    if (!tabContent) {
      const tabContentContainer = document.querySelector('.tab-content');
      if (!tabContentContainer) {
        console.warn('Tab content container not found');
        return;
      }
      
      tabContent = document.createElement('div');
      tabContent.id = 'comparison-tab';
      tabContent.className = 'tab-pane';
      tabContent.setAttribute('role', 'tabpanel');
      tabContent.setAttribute('aria-hidden', 'true');
      
      tabContentContainer.appendChild(tabContent);
    }
    
    // Add initial content with both comparison and industry tabs
    tabContent.innerHTML = `
      <div class="vendor-comparison-section">
        <div class="vendor-comparison-header">
          <h3>Cloud vs. On-Premises NAC Comparison</h3>
          <p>Compare the key differences between cloud-native and on-premises NAC solutions across critical dimensions.</p>
        </div>
        
        <div class="comparison-summary">
          <h4>Why Cloud NAC Solutions Deliver Higher Value</h4>
          <p>Cloud-based NAC solutions like Portnox Cloud provide significant advantages over traditional on-premises alternatives, including 20-30% lower TCO, 80% faster implementation, and 60% less administrative overhead. With zero hardware requirements, automatic updates, and unlimited scalability, cloud NAC solutions represent the future of network access control.</p>
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
        
        <div class="vendor-cards">
          <div class="vendor-card portnox-card">
            <h4>Portnox Cloud</h4>
            <div class="vendor-type">Cloud-Native NAC</div>
            <p>Zero-trust, cloud-native NAC platform unifying authentication, risk mitigation, and remediation with no hardware requirements.</p>
          </div>
          
          <div class="vendor-card other-vendor-card">
            <h4 id="other-vendor-name">Cisco ISE</h4>
            <div class="vendor-type" id="other-vendor-type">On-Premises NAC</div>
            <p id="other-vendor-description">Comprehensive network access control platform with strong integration for Cisco environments, requiring on-premises hardware.</p>
          </div>
        </div>
        
        <div class="comparison-table-container">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>On-Premises NAC</th>
                <th>Portnox Cloud</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Hardware Requirements</td>
                <td>Dedicated appliances</td>
                <td class="cloud-advantage">No hardware required</td>
              </tr>
              <tr>
                <td>Implementation Time</td>
                <td>Weeks to months</td>
                <td class="cloud-advantage">Hours to days</td>
              </tr>
              <tr>
                <td>Administrative Overhead</td>
                <td>1.5-2 FTE</td>
                <td class="cloud-advantage">0.5 FTE</td>
              </tr>
              <tr>
                <td>Updates & Maintenance</td>
                <td>Manual, scheduled</td>
                <td class="cloud-advantage">Automatic, continuous</td>
              </tr>
              <tr>
                <td>Multi-Site Deployment</td>
                <td>Hardware per location</td>
                <td class="cloud-advantage">Single cloud instance</td>
              </tr>
              <tr>
                <td>Scalability</td>
                <td>Hardware-dependent</td>
                <td class="cloud-advantage">Unlimited</td>
              </tr>
              <tr>
                <td>Total Cost of Ownership</td>
                <td>High</td>
                <td class="cloud-advantage">20-30% lower TCO</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h4>Detailed Feature Comparison</h4>
        <div id="feature-comparison-container" class="feature-comparison-grid">
          <!-- Feature cards will be added here -->
        </div>
      </div>
      
      <div class="industry-section">
        <h3>Industry-Specific Insights & Compliance</h3>
        <p>Select your industry to view detailed analysis, compliance requirements, and how Portnox Cloud addresses your unique challenges.</p>
        
        <div class="industry-selector-container">
          <label for="industry-tab-selector"><b>Select Industry:</b></label>
          <select id="industry-tab-selector" class="form-select" style="margin-left: 15px; max-width: 300px;">
            <option value="none">Choose an industry to view analysis...</option>
            <option value="healthcare">Healthcare</option>
            <option value="financial">Financial Services</option>
            <option value="government">Government</option>
            <option value="education">Education</option>
            <option value="manufacturing">Manufacturing</option>
          </select>
        </div>
        
        <div id="industry-content">
          <div class="no-industry-selected">
            <p>Please select an industry from the dropdown above to view detailed industry-specific analysis, compliance requirements, and benchmarks.</p>
          </div>
        </div>
      </div>
    `;
    
    // Setup tab click event
    combinedTab.addEventListener('click', function() {
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
      tabContent.classList.add('active');
      tabContent.setAttribute('aria-hidden', 'false');
      
      // Update the feature comparison
      updateVendorComparison('cisco');
    });
    
    // Setup vendor selector
    setTimeout(() => {
      const vendorSelector = document.getElementById('comparison-vendor-selector');
      if (vendorSelector) {
        vendorSelector.addEventListener('change', function() {
          updateVendorComparison(this.value);
        });
      }
      
      // Setup industry selector
      const industrySelector = document.getElementById('industry-tab-selector');
      if (industrySelector) {
        industrySelector.addEventListener('change', function() {
          updateIndustryContent(this.value);
        });
        
        // Sync with main industry selector if exists
        const mainIndustrySelector = document.getElementById('industry-selector');
        if (mainIndustrySelector) {
          // When main selector changes, update the tab selector
          mainIndustrySelector.addEventListener('change', function() {
            industrySelector.value = this.value;
            updateIndustryContent(this.value);
          });
          
          // When tab selector changes, update the main selector
          industrySelector.addEventListener('change', function() {
            mainIndustrySelector.value = this.value;
            // Trigger change event on main selector to apply templates
            const event = new Event('change');
            mainIndustrySelector.dispatchEvent(event);
          });
        }
      }
    }, 500);
  }
  
  // Update vendor comparison
  function updateVendorComparison(vendorId) {
    if (!window.comparisonData) return;
    
    const container = document.getElementById('feature-comparison-container');
    const vendorNameEl = document.getElementById('other-vendor-name');
    const vendorTypeEl = document.getElementById('other-vendor-type');
    const vendorDescEl = document.getElementById('other-vendor-description');
    
    if (!container || !vendorNameEl) return;
    
    const portnox = window.comparisonData.vendors.portnox;
    const otherVendor = window.comparisonData.vendors[vendorId] || window.comparisonData.vendors.cisco;
    
    // Update vendor card
    vendorNameEl.textContent = otherVendor.name;
    vendorTypeEl.textContent = otherVendor.type + ' NAC';
    vendorDescEl.textContent = otherVendor.description;
    
    // Clear comparison grid
    container.innerHTML = '';
    
    // Create feature cards
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
  
  // Update industry content
  function updateIndustryContent(industryId) {
    if (!window.comparisonData) return;
    
    const container = document.getElementById('industry-content');
    if (!container) return;
    
    if (industryId === 'none' || !window.comparisonData.industries[industryId]) {
      container.innerHTML = `
        <div class="no-industry-selected">
          <p>Please select an industry from the dropdown above to view detailed industry-specific analysis, compliance requirements, and benchmarks.</p>
        </div>
      `;
      return;
    }
    
    const industry = window.comparisonData.industries[industryId];
    
    // Create industry content
    container.innerHTML = `
      <div class="industry-header">
        <h3><i class="fas fa-${industry.icon}"></i> ${industry.name} Industry Analysis</h3>
      </div>
      
      <div class="industry-dashboard">
        <div class="industry-metric">
          <div class="industry-metric-label">Average TCO (Industry)</div>
          <div class="industry-metric-value">$${industry.benchmarks.tco.toLocaleString()}</div>
          <div class="industry-metric-description">Typical 3-year TCO for on-premises NAC</div>
        </div>
        
        <div class="industry-metric">
          <div class="industry-metric-label">Implementation Time</div>
          <div class="industry-metric-value">${industry.benchmarks.implementationTime} days</div>
          <div class="industry-metric-description">Average implementation time</div>
        </div>
        
        <div class="industry-metric">
          <div class="industry-metric-label">Annual Personnel Cost</div>
          <div class="industry-metric-value">$${industry.benchmarks.fteCost.toLocaleString()}</div>
          <div class="industry-metric-description">Typical annual IT staff cost</div>
        </div>
        
        <div class="industry-metric">
          <div class="industry-metric-label">Cloud NAC Savings</div>
          <div class="industry-metric-value">${industry.benchmarks.cloudSavings}%</div>
          <div class="industry-metric-description">Average TCO reduction</div>
        </div>
      </div>
      
      <h3>Compliance Requirements</h3>
      <div class="compliance-cards">
        <div class="compliance-card">
          <h4><i class="fas fa-shield-alt"></i> ${industry.compliance.title}</h4>
          <p>${industry.compliance.description}</p>
          
          <h5>Key Requirements</h5>
          <ul class="key-requirements">
            ${industry.compliance.requirements.map(req => `<li>${req}</li>`).join('')}
          </ul>
        </div>
      </div>
      
      <h3>${industry.name} Industry Challenges & Portnox Solutions</h3>
      <div class="challenge-grid">
        ${industry.challenges.map(challenge => `
          <div class="challenge-card">
            <div class="challenge-header">
              <i class="fas fa-exclamation-triangle"></i>
              ${challenge.challenge}
            </div>
            <div class="challenge-solution">
              <strong>Portnox Solution:</strong> ${challenge.solution}
            </div>
            <div class="vendor-advantage">
              <div class="vendor-advantage-title">
                <i class="fas fa-check-circle"></i> Portnox Advantage
              </div>
              <div class="vendor-advantage-description">${challenge.portnoxAdvantage}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  // Hide all sidebar industry content
  function hideSidebarIndustryContent() {
    const elements = [
      '.sidebar-industry-preview',
      '.industry-templates-card',
      '.compliance-info-container'
    ];
    
    elements.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.display = 'none';
      });
    });
  }
  
  // Initialize
  function init() {
    console.log('Initializing combined tab...');
    
    createCombinedTab();
    hideSidebarIndustryContent();
    
    console.log('Combined tab initialized successfully');
  }
  
  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
