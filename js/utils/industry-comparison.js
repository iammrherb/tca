/**
 * Enhanced Industry Comparison
 * Creates detailed industry comparison view with compliance requirements
 */
(function() {
  console.log('Installing Enhanced Industry Comparison...');
  
  // Industry data with compliance requirements and benchmarks
  window.industryDetails = {
    healthcare: {
      name: "Healthcare",
      icon: "heartbeat",
      description: "Healthcare organizations need specialized NAC solutions to handle medical devices, maintain HIPAA compliance, and protect patient data.",
      compliance: {
        title: "Healthcare Compliance Requirements",
        description: "Healthcare organizations need to comply with HIPAA, HITECH, and other regulations that mandate strong access controls, audit logging, and protection of patient health information (PHI).",
        requirements: [
          "Strong authentication mechanisms for clinical systems access",
          "Automatic logoff functionality from unattended workstations",
          "Detailed audit logging of all access to sensitive data",
          "Network segmentation between clinical and administrative systems",
          "Continuous monitoring of connected devices",
          "Automated compliance reporting capabilities"
        ],
        regulations: [
          {
            name: "HIPAA",
            description: "Health Insurance Portability and Accountability Act",
            relevance: "NAC solutions facilitate compliance with HIPAA Security Rule by enforcing access controls and maintaining access logs."
          },
          {
            name: "HITECH",
            description: "Health Information Technology for Economic and Clinical Health Act",
            relevance: "Strengthens HIPAA enforcement and emphasizes data security, including network access controls."
          }
        ]
      },
      benchmarks: {
        averageTCO: 3500000,
        implementationTime: 90,
        fteCost: 450000,
        cloudSavings: 35
      },
      challenges: [
        {
          challenge: "Medical Device Security",
          solution: "Cloud NAC provides specialized profiling and security policies for medical devices with minimal disruption."
        },
        {
          challenge: "Multi-facility Deployment",
          solution: "Cloud architecture enables consistent policy enforcement across all locations with centralized management."
        },
        {
          challenge: "Regulatory Compliance",
          solution: "Automated documentation and comprehensive audit logging simplifies compliance reporting."
        }
      ]
    },
    financial: {
      name: "Financial Services",
      icon: "university",
      description: "Financial institutions must meet stringent regulatory requirements while securing complex infrastructure and protecting sensitive financial data.",
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
        ],
        regulations: [
          {
            name: "PCI DSS",
            description: "Payment Card Industry Data Security Standard",
            relevance: "NAC helps meet requirements for access control, network segmentation, and continuous monitoring."
          },
          {
            name: "GLBA",
            description: "Gramm-Leach-Bliley Act",
            relevance: "Safeguards Rule requires access controls that NAC helps implement and enforce."
          }
        ]
      },
      benchmarks: {
        averageTCO: 4200000,
        implementationTime: 120,
        fteCost: 570000,
        cloudSavings: 28
      },
      challenges: [
        {
          challenge: "Branch Location Security",
          solution: "Cloud NAC provides consistent security across all branches without requiring hardware at each location."
        },
        {
          challenge: "Third-Party Access",
          solution: "Granular policies for contractors, auditors, and partners with temporary access requirements."
        },
        {
          challenge: "Regulatory Compliance",
          solution: "Comprehensive logging and reporting capabilities provide ready documentation for auditors."
        }
      ]
    },
    government: {
      name: "Government",
      icon: "landmark",
      description: "Government agencies require NAC solutions that meet strict security standards, handle legacy systems, and provide comprehensive compliance reporting.",
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
        ],
        regulations: [
          {
            name: "FISMA",
            description: "Federal Information Security Modernization Act",
            relevance: "NAC helps implement access controls required by FISMA and supports continuous monitoring requirements."
          },
          {
            name: "NIST 800-53",
            description: "Security and Privacy Controls for Federal Information Systems",
            relevance: "NAC addresses multiple control families including Access Control (AC) and System and Information Integrity (SI)."
          }
        ]
      },
      benchmarks: {
        averageTCO: 4800000,
        implementationTime: 150,
        fteCost: 620000,
        cloudSavings: 32
      },
      challenges: [
        {
          challenge: "Legacy System Integration",
          solution: "Cloud NAC provides specialized support for older systems that must remain in service due to mission requirements."
        },
        {
          challenge: "Compliance Documentation",
          solution: "Comprehensive reporting capabilities to demonstrate compliance with federal security requirements."
        },
        {
          challenge: "Cross-Agency Access",
          solution: "Secure authentication mechanisms for personnel who require access across different agencies or departments."
        }
      ]
    },
    manufacturing: {
      name: "Manufacturing",
      icon: "industry",
      description: "Manufacturing environments need to secure both IT and OT (Operational Technology) networks, requiring specialized NAC capabilities.",
      compliance: {
        title: "Manufacturing Compliance Requirements",
        description: "Manufacturing environments need to secure both IT and OT (Operational Technology) networks, often requiring compliance with industry standards such as NIST CSF, IEC 62443, and potentially regulated standards depending on the industry.",
        requirements: [
          "Segmentation between IT and OT networks",
          "Protection of industrial control systems",
          "Support for specialized industrial devices",
          "Continuous monitoring of connected equipment",
          "Integration with industrial protocols",
          "Minimal disruption to production processes"
        ],
        regulations: [
          {
            name: "IEC 62443",
            description: "Industrial Automation and Control Systems Security",
            relevance: "NAC helps implement network segmentation and access control elements of this standard."
          },
          {
            name: "NIST CSF",
            description: "Cybersecurity Framework",
            relevance: "NAC addresses elements of the Identify, Protect, and Detect functions of the framework."
          }
        ]
      },
      benchmarks: {
        averageTCO: 2800000,
        implementationTime: 95,
        fteCost: 380000,
        cloudSavings: 38
      },
      challenges: [
        {
          challenge: "OT/IT Convergence",
          solution: "Cloud NAC provides specialized policies for operational technology devices while maintaining security boundaries."
        },
        {
          challenge: "Legacy Industrial Equipment",
          solution: "Support for older industrial protocols and devices that cannot be easily upgraded."
        },
        {
          challenge: "Production Network Availability",
          solution: "High availability design ensures authentication systems do not impact production uptime."
        }
      ]
    },
    education: {
      name: "Education",
      icon: "graduation-cap",
      description: "Educational institutions face unique challenges with high device turnover, diverse user populations, and multiple network segments.",
      compliance: {
        title: "Education Compliance Requirements",
        description: "Educational institutions must comply with regulations like FERPA, COPPA, and in some cases HIPAA for student health services, requiring strong access controls while supporting a diverse and dynamic user population.",
        requirements: [
          "Secure access to student information systems",
          "Age-appropriate access controls for K-12 environments",
          "Network segmentation between administrative, academic, and residential networks",
          "Support for BYOD and personal devices",
          "Guest access for visitors and events",
          "Protection of research data and intellectual property"
        ],
        regulations: [
          {
            name: "FERPA",
            description: "Family Educational Rights and Privacy Act",
            relevance: "NAC helps restrict access to systems containing student records."
          },
          {
            name: "COPPA",
            description: "Children's Online Privacy Protection Act",
            relevance: "For K-12, NAC helps implement appropriate access controls for minors."
          }
        ]
      },
      benchmarks: {
        averageTCO: 2500000,
        implementationTime: 75,
        fteCost: 320000,
        cloudSavings: 42
      },
      challenges: [
        {
          challenge: "High Device Turnover",
          solution: "Cloud NAC simplifies onboarding and offboarding process for student devices at the beginning and end of academic terms."
        },
        {
          challenge: "Diverse Device Types",
          solution: "Comprehensive device profiling handles various operating systems and device types common in educational environments."
        },
        {
          challenge: "Budget Constraints",
          solution: "Cloud-based subscription model reduces capital expenditure and ongoing administrative costs."
        }
      ]
    }
  };
  
  // Function to create industry tab
  function createIndustryComplianceTab() {
    // Find tab container
    const tabsContainer = document.querySelector('.tabs');
    if (!tabsContainer) {
      console.warn('Tabs container not found');
      return;
    }
    
    // Create or update industry tab button
    let industryTab = document.querySelector('[data-tab="industry-tab"]');
    
    if (!industryTab) {
      // Create new tab button
      industryTab = document.createElement('button');
      industryTab.className = 'tab-button';
      industryTab.setAttribute('role', 'tab');
      industryTab.setAttribute('aria-selected', 'false');
      industryTab.setAttribute('data-tab', 'industry-tab');
      industryTab.setAttribute('tabindex', '-1');
      
      // Insert after implementation tab or append to end
      const implementationTab = document.querySelector('[data-tab="implementation-tab"]');
      if (implementationTab && implementationTab.nextSibling) {
        tabsContainer.insertBefore(industryTab, implementationTab.nextSibling);
      } else {
        tabsContainer.appendChild(industryTab);
      }
    }
    
    // Update tab label
    industryTab.innerHTML = '<i class="fas fa-building"></i> Industry & Compliance';
    
    // Create tab content container
    let tabContent = document.getElementById('industry-tab');
    if (!tabContent) {
      const tabContentContainer = document.querySelector('.tab-content');
      if (!tabContentContainer) {
        console.warn('Tab content container not found');
        return;
      }
      
      tabContent = document.createElement('div');
      tabContent.id = 'industry-tab';
      tabContent.className = 'tab-pane';
      tabContent.setAttribute('role', 'tabpanel');
      tabContent.setAttribute('aria-hidden', 'true');
      
      // Add initial content
      tabContent.innerHTML = `
        <div class="industry-selector-container">
          <label for="industry-tab-selector"><b>Select Industry:</b></label>
          <select id="industry-tab-selector" class="form-select" style="margin-left: 15px; max-width: 300px;">
            <option value="none">Choose an industry to view analysis...</option>
          </select>
        </div>
        
        <div id="industry-content">
          <div class="no-industry-selected">
            <p>Please select an industry from the dropdown above to view detailed industry-specific analysis, compliance requirements, and benchmarks.</p>
          </div>
        </div>
      `;
      
      tabContentContainer.appendChild(tabContent);
    }
    
    // Setup tab click event
    industryTab.addEventListener('click', function() {
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
    });
    
    // Initialize industry selector
    setTimeout(initIndustrySelector, 500);
  }
  
  // Initialize industry selector
  function initIndustrySelector() {
    // Get selectors
    const mainSelector = document.getElementById('industry-selector');
    const tabSelector = document.getElementById('industry-tab-selector');
    
    if (!tabSelector) {
      console.warn('Industry tab selector not found');
      return;
    }
    
    // Hide sidebar industry preview if it exists
    const sidebarPreview = document.querySelector('.sidebar-industry-preview');
    if (sidebarPreview) {
      sidebarPreview.style.display = 'none';
    }
    
    // Populate tab selector with options
    if (tabSelector.options.length <= 1) {  // Only has placeholder
      // Add industry options
      Object.keys(window.industryDetails).forEach(id => {
        const industry = window.industryDetails[id];
        const option = document.createElement('option');
        option.value = id;
        option.textContent = industry.name;
        tabSelector.appendChild(option);
      });
    }
    
    // Sync between selectors
    if (mainSelector) {
      mainSelector.addEventListener('change', function() {
        tabSelector.value = this.value;
        updateIndustryContent(this.value);
      });
    }
    
    tabSelector.addEventListener('change', function() {
      if (mainSelector) {
        mainSelector.value = this.value;
        // Trigger change event on main selector
        const event = new Event('change');
        mainSelector.dispatchEvent(event);
      } else {
        // If main selector doesn't exist, update content directly
        updateIndustryContent(this.value);
      }
    });
  }
  
  // Update industry content
  function updateIndustryContent(industryId) {
    const container = document.getElementById('industry-content');
    if (!container) return;
    
    if (industryId === 'none' || !window.industryDetails[industryId]) {
      container.innerHTML = `
        <div class="no-industry-selected">
          <p>Please select an industry from the dropdown above to view detailed industry-specific analysis, compliance requirements, and benchmarks.</p>
        </div>
      `;
      return;
    }
    
    const industry = window.industryDetails[industryId];
    
    // Create detailed industry content
    container.innerHTML = `
      <div class="industry-header">
        <h2 class="industry-title"><i class="fas fa-${industry.icon} industry-icon"></i> ${industry.name} Industry Analysis</h2>
      </div>
      
      <p class="industry-description">
        ${industry.description}
      </p>
      
      <div class="industry-dashboard">
        <div class="industry-metric">
          <div class="industry-metric-label">Average TCO (Industry)</div>
          <div class="industry-metric-value">$${(industry.benchmarks.averageTCO || 0).toLocaleString()}</div>
          <div class="industry-metric-description">Typical 3-year TCO for on-premises NAC</div>
        </div>
        
        <div class="industry-metric">
          <div class="industry-metric-label">Implementation Time</div>
          <div class="industry-metric-value">${industry.benchmarks.implementationTime || 0} days</div>
          <div class="industry-metric-description">Average implementation time</div>
        </div>
        
        <div class="industry-metric">
          <div class="industry-metric-label">Annual Personnel Cost</div>
          <div class="industry-metric-value">$${(industry.benchmarks.fteCost || 0).toLocaleString()}</div>
          <div class="industry-metric-description">Typical annual IT staff cost</div>
        </div>
        
        <div class="industry-metric">
          <div class="industry-metric-label">Cloud NAC Savings</div>
          <div class="industry-metric-value">${industry.benchmarks.cloudSavings || 35}%</div>
          <div class="industry-metric-description">Average TCO reduction</div>
        </div>
      </div>
      
      <h3>Compliance Requirements</h3>
      <div class="compliance-cards">
        <div class="compliance-card">
          <h4><i class="fas fa-shield-alt"></i> Regulatory Overview</h4>
          <p>${industry.compliance.description}</p>
          
          <h5>Key Requirements</h5>
          <ul class="key-requirements">
            ${(industry.compliance.requirements || []).map(req => `<li>${req}</li>`).join('')}
          </ul>
        </div>
        
        <div class="compliance-card">
          <h4><i class="fas fa-clipboard-check"></i> Key Regulations</h4>
          <ul class="regulation-list">
            ${(industry.compliance.regulations || []).map(reg => `
              <li class="regulation-item">
                <strong>${reg.name}</strong>
                ${reg.description}
                <span class="regulation-relevance">Relevance: ${reg.relevance}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
      
      <div class="industry-challenges">
        <h3>Industry-Specific Challenges & Solutions</h3>
        <div class="challenge-grid">
          ${(industry.challenges || []).map(challenge => `
            <div class="challenge-card">
              <div class="challenge-header">
                <i class="fas fa-exclamation-triangle"></i>
                ${challenge.challenge}
              </div>
              <div class="challenge-solution">
                <strong>Portnox Solution:</strong> ${challenge.solution}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  // Add styles
  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Industry tab styling */
      .industry-selector-container {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
      }
      
      .industry-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      
      .industry-title {
        font-size: 24px;
        color: #1B67B2;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .industry-icon {
        color: #2BD25B;
      }
      
      .industry-description {
        font-size: 1rem;
        color: #505050;
        margin-bottom: 20px;
        line-height: 1.5;
      }
      
      .industry-dashboard {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }
      
      .industry-metric {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        transition: all 0.2s ease;
      }
      
      .industry-metric:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      }
      
      .industry-metric-value {
        font-size: 24px;
        font-weight: bold;
        color: #1B67B2;
        margin: 10px 0;
      }
      
      .industry-metric-label {
        font-size: 14px;
        color: #505050;
        font-weight: 600;
      }
      
      .industry-metric-description {
        font-size: 12px;
        color: #707070;
      }
      
      .compliance-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }
      
      .compliance-card {
        background: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        border-top: 4px solid #1B67B2;
        transition: all 0.2s ease;
      }
      
      .compliance-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.15);
      }
      
      .compliance-card h4 {
        margin-top: 0;
        color: #1B67B2;
        font-size: 16px;
        display: flex;
        align-items: center;
      }
      
      .compliance-card h4 i {
        margin-right: 8px;
      }
      
      .compliance-card h5 {
        color: #505050;
        margin: 15px 0 10px 0;
        font-size: 14px;
      }
      
      .compliance-card p {
        color: #505050;
        font-size: 14px;
        line-height: 1.5;
      }
      
      .key-requirements {
        padding-left: 20px;
        margin: 0;
      }
      
      .key-requirements li {
        margin-bottom: 5px;
        color: #505050;
        font-size: 14px;
      }
      
      .regulation-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      
      .regulation-item {
        padding: 10px;
        background: #f8f9fa;
        margin-bottom: 8px;
        border-radius: 4px;
        font-size: 13px;
      }
      
      .regulation-item strong {
        display: block;
        margin-bottom: 3px;
        color: #1B67B2;
      }
      
      .regulation-relevance {
        color: #2BD25B;
        font-style: italic;
        font-size: 12px;
        display: block;
        margin-top: 5px;
      }
      
      .challenge-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 15px;
        margin-top: 20px;
      }
      
      .challenge-card {
        background: white;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        display: flex;
        flex-direction: column;
        transition: all 0.2s ease;
      }
      
      .challenge-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      }
      
      .challenge-header {
        color: #1B67B2;
        font-weight: 600;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
      }
      
      .challenge-header i {
        margin-right: 8px;
        color: #1B67B2;
      }
      
      .challenge-solution {
        font-size: 14px;
        color: #505050;
        border-left: 3px solid #2BD25B;
        padding-left: 15px;
        margin-top: 10px;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // Initialize
  function init() {
    addStyles();
    createIndustryComplianceTab();
  }
  
  // Add initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  console.log('Enhanced Industry Comparison installed');
})();
