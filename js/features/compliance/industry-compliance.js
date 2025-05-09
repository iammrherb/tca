/**
 * Industry & Compliance Module for NAC Architecture Designer Pro
 * Provides industry-specific analysis and compliance framework mapping
 */

class IndustryComplianceManager {
  constructor() {
    this.activeIndustry = 'general';
    this.activeCompliance = 'all';
    
    // Industry data
    this.industryData = {
      healthcare: {
        name: 'Healthcare',
        description: 'Healthcare organizations face strict regulatory requirements for protecting patient data and ensuring system availability.',
        keyRequirements: [
          'HIPAA compliance for protecting PHI',
          'Secure medical device connectivity',
          'Strong role-based access controls',
          'Audit logging and monitoring',
          'Integration with EHR systems'
        ],
        primaryFrameworks: ['HIPAA', 'HITRUST', 'NIST'],
        recommendedSolution: 'portnox',
        advantages: [
          'Built-in HIPAA compliance reporting',
          'Medical device profiling and secure onboarding',
          'Granular access control for clinical systems',
          'Detailed audit logs for compliance evidence',
          'Cloud delivery minimizes on-site infrastructure'
        ]
      },
      finance: {
        name: 'Finance',
        description: 'Financial institutions require the highest levels of security for protecting sensitive financial data and maintaining regulatory compliance.',
        keyRequirements: [
          'PCI DSS compliance for card data',
          'Strong authentication methods',
          'Continuous monitoring and threat detection',
          'Detailed audit trails for all access',
          'Seamless integration with existing security tools'
        ],
        primaryFrameworks: ['PCI DSS', 'SOX', 'GLBA', 'NIST'],
        recommendedSolution: 'portnox',
        advantages: [
          'Built-in PCI DSS compliance reporting',
          'Multi-factor authentication support',
          'Real-time network visibility and monitoring',
          'Comprehensive audit logging and reporting',
          'Agentless deployment with minimal disruption'
        ]
      },
      manufacturing: {
        name: 'Manufacturing',
        description: 'Manufacturing environments need to secure both IT and OT networks, including IoT devices, industrial control systems, and traditional endpoints.',
        keyRequirements: [
          'OT/IT network segmentation',
          'Industrial device security',
          'Minimal disruption to operations',
          'Supply chain security',
          'Scalable deployment across multiple sites'
        ],
        primaryFrameworks: ['NIST 800-82', 'IEC 62443', 'ISO 27001'],
        recommendedSolution: 'portnox',
        advantages: [
          'Specialized industrial device profiling',
          'Network segmentation capabilities',
          'Cloud-delivered for multi-site deployment',
          'Agentless approach for OT devices',
          'Minimal impact on operational continuity'
        ]
      },
      education: {
        name: 'Education',
        description: 'Educational institutions need to balance open access to information with protection of sensitive data and systems.',
        keyRequirements: [
          'BYOD support for students and faculty',
          'Protection of research and academic data',
          'Easy onboarding for diverse device types',
          'Scalable for seasonal enrollment changes',
          'Cost-effective deployment and maintenance'
        ],
        primaryFrameworks: ['FERPA', 'COPPA', 'NIST'],
        recommendedSolution: 'portnox',
        advantages: [
          'Simplified BYOD onboarding',
          'Flexible authentication methods',
          'Cloud-based delivery reduces infrastructure costs',
          'Elastic scaling for enrollment fluctuations',
          'Lower total cost of ownership'
        ]
      },
      government: {
        name: 'Government',
        description: 'Government agencies require strict security controls, compliance with regulations, and often special certifications.',
        keyRequirements: [
          'FedRAMP/FISMA compliance',
          'Advanced threat protection',
          'Comprehensive audit logging',
          'Integration with government systems',
          'Support for government authentication standards'
        ],
        primaryFrameworks: ['NIST 800-53', 'FISMA', 'FedRAMP'],
        recommendedSolution: 'portnox',
        advantages: [
          'FedRAMP-aligned cloud delivery',
          'Comprehensive NIST 800-53 controls',
          'PIV/CAC card authentication support',
          'Detailed compliance reporting',
          'Zero Trust implementation'
        ]
      },
      retail: {
        name: 'Retail',
        description: 'Retail organizations need to protect customer data while maintaining operational efficiency across distributed locations.',
        keyRequirements: [
          'PCI DSS compliance for payment systems',
          'IoT and POS device security',
          'Consistent security across many locations',
          'Protection of customer data',
          'Minimal impact on business operations'
        ],
        primaryFrameworks: ['PCI DSS', 'GDPR', 'CCPA', 'ISO 27001'],
        recommendedSolution: 'portnox',
        advantages: [
          'Built-in PCI DSS compliance reporting',
          'POS and IoT device profiling',
          'Cloud-delivery for multi-location consistency',
          'Agentless deployment with minimal disruption',
          'Cost-effective for distributed deployment'
        ]
      }
    };
    
    // Compliance framework data
    this.complianceData = {
      'hipaa': {
        name: 'HIPAA',
        fullName: 'Health Insurance Portability and Accountability Act',
        description: 'U.S. regulations for protecting sensitive patient health information.',
        key_requirements: [
          'Access Controls',
          'Audit Controls',
          'Integrity Controls',
          'Transmission Security',
          'Authentication'
        ],
        portnox_capabilities: [
          'Role-based access control',
          'Comprehensive audit logging',
          'Device health validation',
          'Encrypted communications',
          'Multi-factor authentication support'
        ],
        portnox_advantage: 'Portnox provides built-in HIPAA compliance reporting and healthcare-specific device profiles, reducing compliance overhead by up to 60%.'
      },
      'pci-dss': {
        name: 'PCI DSS',
        fullName: 'Payment Card Industry Data Security Standard',
        description: 'Security standard for organizations that handle credit cards.',
        key_requirements: [
          'Network Segmentation',
          'Access Control',
          'Regular Security Testing',
          'Maintained Security Policy',
          'Monitoring and Logging'
        ],
        portnox_capabilities: [
          'Network segmentation enforcement',
          'Least privilege access controls',
          'Continuous posture assessment',
          'Policy enforcement automation',
          'Real-time monitoring and alerting'
        ],
        portnox_advantage: 'Portnox helps meet PCI DSS requirements with 40% less effort by automating network segmentation, access controls, and providing ready-made compliance reports.'
      },
      'nist': {
        name: 'NIST 800-53',
        fullName: 'NIST Special Publication 800-53',
        description: 'Security controls for federal information systems and organizations.',
        key_requirements: [
          'Access Control',
          'Identification and Authentication',
          'System and Information Integrity',
          'Audit and Accountability',
          'System and Communications Protection'
        ],
        portnox_capabilities: [
          'Comprehensive access control framework',
          'Multi-factor authentication support',
          'Continuous posture validation',
          'Detailed audit logging',
          'Secure communications enforcement'
        ],
        portnox_advantage: 'Portnox directly addresses over 60 NIST 800-53 controls out-of-the-box, simplifying compliance for government agencies and contractors.'
      },
      'iso27001': {
        name: 'ISO 27001',
        fullName: 'ISO/IEC 27001',
        description: 'International standard for information security management.',
        key_requirements: [
          'Asset Management',
          'Access Control',
          'Operations Security',
          'Communications Security',
          'Compliance'
        ],
        portnox_capabilities: [
          'Asset discovery and inventory',
          'Granular access control policies',
          'Operational security automation',
          'Secure communications enforcement',
          'Compliance reporting and evidence'
        ],
        portnox_advantage: 'Portnox supports ISO 27001 compliance by providing automated controls and evidence for over 40% of the required security measures.'
      },
      'gdpr': {
        name: 'GDPR',
        fullName: 'General Data Protection Regulation',
        description: 'EU regulation on data protection and privacy.',
        key_requirements: [
          'Data Access Controls',
          'Data Protection by Design',
          'Breach Notification',
          'Right to Access',
          'Right to be Forgotten'
        ],
        portnox_capabilities: [
          'Granular access controls',
          'Security by design principles',
          'Real-time alerting and monitoring',
          'User activity tracking',
          'Data access policy enforcement'
        ],
        portnox_advantage: 'Portnox helps organizations address GDPR requirements through network access controls that limit data exposure and provide audit trails for compliance evidence.'
      },
      'soc2': {
        name: 'SOC 2',
        fullName: 'System and Organization Controls 2',
        description: 'Audit framework for service organizations on security, availability, and confidentiality.',
        key_requirements: [
          'Security',
          'Availability',
          'Processing Integrity',
          'Confidentiality',
          'Privacy'
        ],
        portnox_capabilities: [
          'Comprehensive security controls',
          'High availability cloud architecture',
          'Data integrity validation',
          'Confidentiality protection',
          'Privacy-enhancing features'
        ],
        portnox_advantage: 'Portnox is SOC 2 Type II certified and provides controls that help customers meet their own SOC 2 requirements, particularly for security and availability.'
      }
    };
    
    // Initialize after DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
      this.initUI();
    });
  }
  
  /**
   * Initialize the UI
   */
  initUI() {
    console.log('Initializing Industry & Compliance UI...');
    
    // Create the main container if it doesn't exist
    this.createMainContainer();
    
    // Create selectors
    this.createSelectors();
    
    // Create initial view
    this.createIndustrySection();
    this.createComplianceSection();
    
    // Initialize charts if available
    if (window.chartBuilder && typeof window.chartBuilder.initIndustryComparisonChart === 'function') {
      window.chartBuilder.initIndustryComparisonChart();
    }
    
    if (window.chartBuilder && typeof window.chartBuilder.initComplianceFrameworkChart === 'function') {
      window.chartBuilder.initComplianceFrameworkChart();
    }
    
    console.log('Industry & Compliance UI initialized');
  }
  
  /**
   * Create main container for the industry & compliance section
   */
  createMainContainer() {
    const appContainer = document.querySelector('.app-container') || document.body;
    
    let mainContainer = document.getElementById('industry-compliance-container');
    if (!mainContainer) {
      mainContainer = document.createElement('div');
      mainContainer.id = 'industry-compliance-container';
      mainContainer.className = 'industry-compliance-container';
      
      // Set container HTML with header
      mainContainer.innerHTML = `
        <div class="section-header">
          <h2 class="section-title">Industry & Compliance Analysis</h2>
          <p class="section-description">
            Explore NAC solutions tailored for your industry and compliance requirements
          </p>
        </div>
        
        <div class="ic-controls-container" id="ic-controls-container">
          <!-- Selectors will be added here -->
        </div>
        
        <div class="ic-content-container">
          <div class="ic-industry-section" id="ic-industry-section">
            <!-- Industry content will be added here -->
          </div>
          
          <div class="ic-compliance-section" id="ic-compliance-section">
            <!-- Compliance content will be added here -->
          </div>
        </div>
      `;
      
      // Insert after the calculator or at the top
      const calculator = document.querySelector('.calculator-container');
      if (calculator) {
        calculator.parentNode.insertBefore(mainContainer, calculator.nextSibling);
      } else {
        appContainer.appendChild(mainContainer);
      }
    }
    
    this.mainContainer = mainContainer;
  }
  
  /**
   * Create industry and compliance selectors
   */
  createSelectors() {
    const controlsContainer = document.getElementById('ic-controls-container');
    if (!controlsContainer) return;
    
    // Set controls HTML
    controlsContainer.innerHTML = `
      <div class="ic-selector-container">
        <label for="industry-selector">Select Industry</label>
        <select id="industry-selector" class="ic-selector">
          <option value="general">All Industries</option>
          ${Object.keys(this.industryData).map(industry => 
            `<option value="${industry}">${this.industryData[industry].name}</option>`
          ).join('')}
        </select>
      </div>
      
      <div class="ic-selector-container">
        <label for="compliance-selector">Select Compliance Framework</label>
        <select id="compliance-selector" class="ic-selector">
          <option value="all">All Frameworks</option>
          ${Object.keys(this.complianceData).map(framework => 
            `<option value="${framework}">${this.complianceData[framework].name}</option>`
          ).join('')}
        </select>
      </div>
    `;
    
    // Add event listeners
    const industrySelector = document.getElementById('industry-selector');
    if (industrySelector) {
      industrySelector.addEventListener('change', () => {
        this.activeIndustry = industrySelector.value;
        this.updateIndustrySection();
        
        // Update charts if available
        if (window.chartBuilder && typeof window.chartBuilder.initIndustryComparisonChart === 'function') {
          window.chartBuilder.initIndustryComparisonChart();
        }
      });
    }
    
    const complianceSelector = document.getElementById('compliance-selector');
    if (complianceSelector) {
      complianceSelector.addEventListener('change', () => {
        this.activeCompliance = complianceSelector.value;
        this.updateComplianceSection();
        
        // Update charts if available
        if (window.chartBuilder && typeof window.chartBuilder.initComplianceFrameworkChart === 'function') {
          window.chartBuilder.initComplianceFrameworkChart();
        }
      });
    }
  }
  
  /**
   * Create industry section
   */
  createIndustrySection() {
    const industrySection = document.getElementById('ic-industry-section');
    if (!industrySection) return;
    
    // Set initial content for general industry
    this.updateIndustrySection();
  }
  
  /**
   * Update industry section content based on selected industry
   */
  updateIndustrySection() {
    const industrySection = document.getElementById('ic-industry-section');
    if (!industrySection) return;
    
    // If general is selected, show overview of all industries
    if (this.activeIndustry === 'general') {
      industrySection.innerHTML = `
        <div class="ic-section-header">
          <h3>Industry Specific Analysis</h3>
          <p>Different industries have unique security and compliance requirements for NAC solutions</p>
        </div>
        
        <div class="ic-industry-grid">
          ${Object.keys(this.industryData).map(industry => {
            const data = this.industryData[industry];
            return `
              <div class="ic-industry-card" data-industry="${industry}">
                <div class="ic-industry-card-header">
                  <h4>${data.name}</h4>
                  <div class="ic-industry-icon ic-${industry}-icon">
                    <i class="ri-building-4-line"></i>
                  </div>
                </div>
                <p class="ic-industry-card-desc">${data.description}</p>
                <button class="ic-btn ic-btn-sm ic-btn-outline ic-view-details-btn" data-industry="${industry}">
                  View Details
                </button>
              </div>
            `;
          }).join('')}
        </div>
        
        <div class="ic-chart-container">
          <h3>Industry Suitability Scores</h3>
          <div class="ic-chart-wrapper">
            <canvas id="industry-comparison-chart"></canvas>
          </div>
        </div>
      `;
      
      // Add event listeners to industry cards
      document.querySelectorAll('.ic-view-details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const industry = btn.getAttribute('data-industry');
          
          // Update selector and trigger change
          const selector = document.getElementById('industry-selector');
          if (selector) {
            selector.value = industry;
            
            // Trigger change event
            const event = new Event('change');
            selector.dispatchEvent(event);
          }
        });
      });
    } 
    // Show specific industry details
    else if (this.industryData[this.activeIndustry]) {
      const industry = this.industryData[this.activeIndustry];
      
      industrySection.innerHTML = `
        <div class="ic-section-header">
          <h3>${industry.name} Industry Analysis</h3>
          <p>${industry.description}</p>
        </div>
        
        <div class="ic-industry-details">
          <div class="ic-requirements-section">
            <h4>Key Requirements</h4>
            <ul class="ic-requirements-list">
              ${industry.keyRequirements.map(req => 
                `<li class="ic-requirement-item"><i class="ri-checkbox-circle-line"></i> ${req}</li>`
              ).join('')}
            </ul>
            
            <h4>Primary Compliance Frameworks</h4>
            <div class="ic-frameworks-badges">
              ${industry.primaryFrameworks.map(framework => 
                `<span class="ic-framework-badge">${framework}</span>`
              ).join('')}
            </div>
          </div>
          
          <div class="ic-advantages-section">
            <h4>Portnox Cloud Advantages for ${industry.name}</h4>
            <div class="ic-advantages-card">
              <ul class="ic-advantages-list">
                ${industry.advantages.map(adv => 
                  `<li class="ic-advantage-item">${adv}</li>`
                ).join('')}
              </ul>
            </div>
          </div>
        </div>
        
        <div class="ic-chart-container">
          <h3>Vendor Comparison for ${industry.name}</h3>
          <div class="ic-chart-wrapper">
            <canvas id="industry-comparison-chart"></canvas>
          </div>
        </div>
      `;
    }
  }
  
  /**
   * Create compliance section
   */
  createComplianceSection() {
    const complianceSection = document.getElementById('ic-compliance-section');
    if (!complianceSection) return;
    
    // Set initial content for all compliance frameworks
    this.updateComplianceSection();
  }
  
  /**
   * Update compliance section content based on selected framework
   */
  updateComplianceSection() {
    const complianceSection = document.getElementById('ic-compliance-section');
    if (!complianceSection) return;
    
    // If all is selected, show overview of all frameworks
    if (this.activeCompliance === 'all') {
      complianceSection.innerHTML = `
        <div class="ic-section-header">
          <h3>Compliance Framework Coverage</h3>
          <p>Evaluate how different NAC solutions address various compliance frameworks</p>
        </div>
        
        <div class="ic-compliance-grid">
          ${Object.keys(this.complianceData).map(framework => {
            const data = this.complianceData[framework];
            return `
              <div class="ic-compliance-card" data-framework="${framework}">
                <div class="ic-compliance-card-header">
                  <h4>${data.name}</h4>
                  <div class="ic-compliance-badge">${data.fullName}</div>
                </div>
                <p class="ic-compliance-card-desc">${data.description}</p>
                <button class="ic-btn ic-btn-sm ic-btn-outline ic-view-framework-btn" data-framework="${framework}">
                  View Details
                </button>
              </div>
            `;
          }).join('')}
        </div>
        
        <div class="ic-chart-container">
          <h3>Compliance Framework Coverage Comparison</h3>
          <div class="ic-chart-wrapper">
            <canvas id="compliance-framework-chart"></canvas>
          </div>
        </div>
      `;
      
      // Add event listeners to framework cards
      document.querySelectorAll('.ic-view-framework-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const framework = btn.getAttribute('data-framework');
          
          // Update selector and trigger change
          const selector = document.getElementById('compliance-selector');
          if (selector) {
            selector.value = framework;
            
            // Trigger change event
            const event = new Event('change');
            selector.dispatchEvent(event);
          }
        });
      });
    } 
    // Show specific compliance framework details
    else if (this.complianceData[this.activeCompliance]) {
      const framework = this.complianceData[this.activeCompliance];
      
      complianceSection.innerHTML = `
        <div class="ic-section-header">
          <h3>${framework.name} Compliance Analysis</h3>
          <p>${framework.fullName} - ${framework.description}</p>
        </div>
        
        <div class="ic-compliance-details">
          <div class="ic-compliance-comparison">
            <div class="ic-compliance-column">
              <h4>Key Requirements</h4>
              <ul class="ic-requirements-list">
                ${framework.key_requirements.map(req => 
                  `<li class="ic-requirement-item"><i class="ri-file-list-2-line"></i> ${req}</li>`
                ).join('')}
              </ul>
            </div>
            
            <div class="ic-compliance-column">
              <h4>Portnox Capabilities</h4>
              <ul class="ic-capabilities-list">
                ${framework.portnox_capabilities.map(cap => 
                  `<li class="ic-capability-item"><i class="ri-check-double-line"></i> ${cap}</li>`
                ).join('')}
              </ul>
            </div>
          </div>
          
          <div class="ic-portnox-advantage-card">
            <h4>Portnox Advantage</h4>
            <p>${framework.portnox_advantage}</p>
          </div>
        </div>
        
        <div class="ic-chart-container">
          <h3>${framework.name} Coverage by Vendor</h3>
          <div class="ic-chart-wrapper">
            <canvas id="compliance-framework-chart"></canvas>
          </div>
        </div>
      `;
    }
  }
}

// Initialize and make it available globally
window.industryComplianceManager = new IndustryComplianceManager();

console.log('Industry & Compliance Manager initialized and available as window.industryComplianceManager');
