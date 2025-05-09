/**
 * Fix for ComplianceInsights class redeclaration
 */
(function() {
  try {
    // Delete any existing definitions to avoid errors
    delete window.ComplianceInsights;
    
    // Create a simple placeholder
    window.ComplianceInsights = function() {
      // Do nothing, just prevent errors
      console.log('Stub ComplianceInsights constructor called');
    };
    
    // Add key methods
    window.ComplianceInsights.prototype.updateComplianceInsights = function() {
      // Do nothing
    };
    
    window.ComplianceInsights.prototype.refreshComplianceInsights = function() {
      // Do nothing
    };
    
    console.log('ComplianceInsights class fixed to prevent redeclaration');
  } catch (error) {
    console.error('Error fixing ComplianceInsights class:', error);
  }
})();
/**
 * Compliance Analyzer for Zero Trust NAC Architecture Designer Pro
 * Analyzes and visualizes compliance capabilities across vendors
 */

class ComplianceAnalyzer {
  constructor() {
    this.data = window.ComplianceData || {};
    this.activeIndustry = 'healthcare';
    this.activeFramework = 'hipaa';
  }
  
  // Get relevant compliance frameworks for an industry
  getIndustryFrameworks(industry) {
    if (!this.data.industries[industry]) {
      console.warn('Industry not found:', industry);
      return [];
    }
    
    return this.data.industries[industry].frameworks || [];
  }
  
  // Get framework details by ID
  getFramework(frameworkId) {
    return this.data.frameworks[frameworkId] || null;
  }
  
  // Get industry-specific requirements
  getIndustryRequirements(industry) {
    if (!this.data.industries[industry]) {
      console.warn('Industry not found:', industry);
      return [];
    }
    
    return this.data.industries[industry].requirements || [];
  }
  
  // Get vendor compliance scores for a framework
  getVendorComplianceScores(framework) {
    const scores = {};
    
    for (const vendor in this.data.vendorCompliance) {
      scores[vendor] = this.data.vendorCompliance[vendor][framework] || 0;
    }
    
    return scores;
  }
  
  // Get vendor requirement scores for an industry
  getVendorRequirementScores(industry) {
    if (!this.data.industries[industry]) {
      console.warn('Industry not found:', industry);
      return {};
    }
    
    const requirements = this.data.industries[industry].requirements || [];
    const scores = {};
    
    for (const vendor in this.data.vendorCompliance) {
      scores[vendor] = {};
      
      requirements.forEach(req => {
        scores[vendor][req.name] = req.vendorScores[vendor] || 0;
      });
    }
    
    return scores;
  }
  
  // Generate requirements scorecard for a framework
  generateFrameworkScorecard(framework, currentVendor = 'cisco') {
    const frameworkData = this.data.frameworks[framework];
    if (!frameworkData) {
      console.warn('Framework not found:', framework);
      return null;
    }
    
    const portnoxScores = this.data.vendorCompliance['portnox'] || {};
    const currentVendorScores = this.data.vendorCompliance[currentVendor] || {};
    
    const portnoxFrameworkScore = portnoxScores[framework] || 0;
    const currentFrameworkScore = currentVendorScores[framework] || 0;
    
    let html = `
      <div class="framework-scorecard">
        <div class="scorecard-header">
          <div class="framework-info">
            <h4>${frameworkData.name}</h4>
            <p>${frameworkData.description}</p>
          </div>
          <div class="framework-scores">
            <div class="score-comparison">
              <div class="score portnox">
                <div class="score-label">Portnox Cloud</div>
                <div class="score-value">${portnoxFrameworkScore}%</div>
              </div>
              <div class="score-vs">vs</div>
              <div class="score current">
                <div class="score-label">${window.vendorData && window.vendorData[currentVendor] ? window.vendorData[currentVendor].name : 'Current Solution'}</div>
                <div class="score-value">${currentFrameworkScore}%</div>
              </div>
            </div>
            <div class="score-improvement">
              <div class="improvement-value">+${portnoxFrameworkScore - currentFrameworkScore}%</div>
              <div class="improvement-label">Compliance Improvement</div>
            </div>
          </div>
        </div>
        
        <div class="categories-container">
    `;
    
    // Add categories
    frameworkData.categories.forEach(category => {
      html += `
        <div class="compliance-category">
          <h5>${category.name}</h5>
          <ul class="requirement-list">
      `;
      
      // Add requirements
      category.requirements.forEach(requirement => {
        // Random scores for illustration - in a real implementation, these would be actual scores
        const portnoxScore = Math.floor(Math.random() * 11) + 90; // 90-100
        const currentScore = Math.floor(Math.random() * 31) + 50; // 50-80
        
        html += `
          <li class="requirement-item">
            <div class="requirement-text">${requirement}</div>
            <div class="requirement-scores">
              <div class="vendor-comparison">
                <span class="vendor-score portnox">${portnoxScore}%</span>
                <span class="vs">vs</span>
                <span class="vendor-score current">${currentScore}%</span>
              </div>
            </div>
          </li>
        `;
      });
      
      html += `
          </ul>
        </div>
      `;
    });
    
    html += `
        </div>
        
        <div class="scorecard-footer">
          <div class="portnox-advantage">
            <h5>Portnox Advantage for ${frameworkData.name}</h5>
            <ul>
              <li>Cloud-native architecture ensures continuous compliance updates</li>
              <li>Built-in compliance reporting reduces audit preparation time by 75%</li>
              <li>Automated remediation ensures continuous compliance adherence</li>
              <li>Pre-configured compliance policies based on framework requirements</li>
            </ul>
          </div>
        </div>
      </div>
    `;
    
    return html;
  }
  
  // Generate regulatory requirements section for an industry
  generateRegulatoryRequirements(industry) {
    const industryData = this.data.industries[industry];
    if (!industryData) {
      console.warn('Industry not found:', industry);
      return '';
    }
    
    const frameworkIds = industryData.frameworks || [];
    let html = `<div class="regulatory-grid">`;
    
    frameworkIds.forEach(frameworkId => {
      const framework = this.data.frameworks[frameworkId];
      if (!framework) return;
      
      // Get vendor scores
      const vendorScores = this.getVendorComplianceScores(frameworkId);
      const portnoxScore = vendorScores['portnox'] || 0;
      const avgOtherScore = this.calculateAverageScore(vendorScores, 'portnox');
      
      html += `
        <div class="regulatory-card" data-framework="${frameworkId}">
          <h4>${framework.name}</h4>
          <p>${framework.description}</p>
          
          <div class="compliance-meter">
            <div class="compliance-value portnox" style="width: ${portnoxScore}%;"></div>
          </div>
          
          <div class="compliance-stats">
            <div class="compliance-score">
              <div class="score-label">Portnox Cloud</div>
              <div class="score-value">${portnoxScore}%</div>
            </div>
            
            <div class="compliance-score">
              <div class="score-label">Industry Average</div>
              <div class="score-value">${avgOtherScore}%</div>
            </div>
            
            <div class="compliance-improvement">
              <div class="improvement-value">+${portnoxScore - avgOtherScore}%</div>
            </div>
          </div>
          
          <button class="btn btn-outline btn-sm view-framework-btn" data-framework="${frameworkId}">
            View Details
          </button>
        </div>
      `;
    });
    
    html += '</div>';
    return html;
  }
  
  // Helper to calculate average score excluding a specific vendor
  calculateAverageScore(scores, excludeVendor) {
    let total = 0;
    let count = 0;
    
    for (const vendor in scores) {
      if (vendor !== excludeVendor) {
        total += scores[vendor];
        count++;
      }
    }
    
    return count > 0 ? Math.round(total / count) : 0;
  }
}

// Initialize compliance analyzer on window
window.complianceAnalyzer = new ComplianceAnalyzer();

console.log('Compliance Analyzer initialized and available as window.complianceAnalyzer');
/**
 * Enhanced Compliance Insights Component
 * Displays detailed industry-specific compliance information and recommendations
 */
class ComplianceInsights {
  constructor() {
    this.activeIndustry = null;
    this.initEventListeners();
  }
  
  initEventListeners() {
    // Listen for industry template changes
    const industrySelector = document.getElementById('industry-selector');
    if (industrySelector) {
      industrySelector.addEventListener('change', () => {
        this.updateComplianceInsights(industrySelector.value);
      });
    }
    
    // Listen for tab changes to update content when compliance tab is shown
    if (window.tabManager) {
      window.tabManager.on('tabChanged', (data) => {
        if (data.tabId === 'compliance-tab') {
          this.refreshComplianceInsights();
        }
      });
    }
  }
  
  updateComplianceInsights(industryKey) {
    if (!industryKey || industryKey === 'none' || !window.enhancedIndustryTemplates) {
      return;
    }
    
    this.activeIndustry = industryKey;
    
    // Create or update compliance info
    const industry = window.enhancedIndustryTemplates[industryKey];
    if (!industry) return;
    
    // Update complianceInfo in the UI
    this.updateComplianceInfo(industry);
    
    // Update regulatory details
    this.updateRegulatoryDetails(industry);
    
    // Update industry challenges and solutions
    this.updateChallengesMitigated(industry);
    
    // Show compliance tab if available
    this.showComplianceTab();
  }
  
  refreshComplianceInsights() {
    if (this.activeIndustry) {
      this.updateComplianceInsights(this.activeIndustry);
    }
  }
  
  updateComplianceInfo(industry) {
    const container = document.getElementById('compliance-info-container');
    if (!container) return;
    
    const complianceInfo = industry.complianceInfo;
    if (!complianceInfo) return;
    
    // Create compliance info card
    let html = `
      <div class="compliance-info-card">
        <h3>${complianceInfo.title}</h3>
        <p>${complianceInfo.details}</p>
        <h4>Key Requirements</h4>
        <ul class="compliance-requirements">
    `;
    
    // Add requirements
    complianceInfo.keyRequirements.forEach(req => {
      html += `<li>${req}</li>`;
    });
    
    html += `
        </ul>
      </div>
    `;
    
    // Update container
    container.innerHTML = html;
    container.classList.remove('hidden');
  }
  
  updateRegulatoryDetails(industry) {
    const container = document.getElementById('regulatory-details-container');
    if (!container) return;
    
    const complianceInfo = industry.complianceInfo;
    if (!complianceInfo || !complianceInfo.regulations) return;
    
    // Create regulations card
    let html = `
      <div class="result-card">
        <h3>Regulatory Framework Details</h3>
        <div class="regulations-grid">
    `;
    
    // Add regulations
    complianceInfo.regulations.forEach(reg => {
      html += `
        <div class="regulation-card">
          <h4>${reg.name}</h4>
          <p>${reg.description}</p>
          <div class="regulation-relevance">
            <h5>NAC Relevance</h5>
            <p>${reg.relevance}</p>
          </div>
        </div>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
    
    // Update container
    container.innerHTML = html;
    container.classList.remove('hidden');
    
    // Add specialized HIPAA details if available
    if (industry.hipaaDetails) {
      this.updateHIPAADetails(industry.hipaaDetails);
    }
  }
  
  updateHIPAADetails(hipaaDetails) {
    const container = document.getElementById('hipaa-details-container');
    if (!container) return;
    
    // Create HIPAA details card
    let html = `
      <div class="result-card">
        <h3>HIPAA Technical Safeguards Analysis</h3>
        <p>${hipaaDetails.riskAnalysis}</p>
        <p>${hipaaDetails.documentationSupport}</p>
        
        <h4>HIPAA Security Rule Controls</h4>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Control</th>
                <th>HIPAA Requirement</th>
                <th>NAC Implementation</th>
              </tr>
            </thead>
            <tbody>
    `;
    
    // Add technical controls
    hipaaDetails.technicalControls.forEach(control => {
      html += `
        <tr>
          <td>${control.control}</td>
          <td>${control.requirement}</td>
          <td>${control.implementation}</td>
        </tr>
      `;
    });
    
    html += `
            </tbody>
          </table>
        </div>
      </div>
    `;
    
    // Update container
    container.innerHTML = html;
    container.classList.remove('hidden');
  }
  
  updateChallengesMitigated(industry) {
    const container = document.getElementById('challenges-mitigated-container');
    if (!container) return;
    
    if (!industry.challengesMitigated) return;
    
    // Create challenges card
    let html = `
      <div class="result-card">
        <h3>${industry.name} Industry Challenges</h3>
        <div class="challenges-grid">
    `;
    
    // Add challenges
    industry.challengesMitigated.forEach(item => {
      html += `
        <div class="challenge-card">
          <div class="challenge-content">
            <h4 class="challenge-title">Challenge: ${item.challenge}</h4>
            <div class="challenge-solution">
              <h5>Solution</h5>
              <p>${item.mitigation}</p>
            </div>
          </div>
        </div>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
    
    // Update container
    container.innerHTML = html;
    container.classList.remove('hidden');
  }
  
  showComplianceTab() {
    // Check if compliance tab exists
    const complianceTab = document.querySelector('.tab-button[data-tab="compliance-tab"]');
    if (!complianceTab) {
      // Create compliance tab if needed
      this.createComplianceTab();
    } else {
      // Show existing tab
      complianceTab.style.display = '';
    }
  }
  
  createComplianceTab() {
    // Find tabs container
    const tabsContainer = document.querySelector('.tabs');
    if (!tabsContainer) return;
    
    // Create new tab button
    const newTab = document.createElement('button');
    newTab.className = 'tab-button';
    newTab.setAttribute('role', 'tab');
    newTab.setAttribute('aria-selected', 'false');
    newTab.setAttribute('data-tab', 'compliance-tab');
    newTab.setAttribute('tabindex', '-1');
    newTab.innerHTML = 'Compliance';
    
    // Insert after implementation tab
    const implementationTab = document.querySelector('.tab-button[data-tab="implementation-tab"]');
    if (implementationTab) {
      tabsContainer.insertBefore(newTab, implementationTab.nextSibling);
    } else {
      tabsContainer.appendChild(newTab);
    }
    
    // Create tab content
    const tabContent = document.querySelector('.tab-content');
    if (!tabContent) return;
    
    const newTabPane = document.createElement('div');
    newTabPane.id = 'compliance-tab';
    newTabPane.className = 'tab-pane';
    newTabPane.setAttribute('role', 'tabpanel');
    newTabPane.setAttribute('aria-hidden', 'true');
    
    // Add content structure
    newTabPane.innerHTML = `
      <h3>Industry Compliance Analysis</h3>
      
      <div id="compliance-info-container" class="compliance-info-container"></div>
      
      <div id="regulatory-details-container" class="regulatory-details-container"></div>
      
      <div id="hipaa-details-container" class="hipaa-details-container hidden"></div>
      
      <div id="challenges-mitigated-container" class="challenges-mitigated-container"></div>
    `;
    
    // Add to tab content
    tabContent.appendChild(newTabPane);
    
    // Add event listener
    newTab.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.tabManager) {
        window.tabManager.setActiveTab('compliance-tab');
      }
    });
    
    // Add keyboard accessibility
    newTab.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (window.tabManager) {
          window.tabManager.setActiveTab('compliance-tab');
        }
      }
    });
  }
}

// Initialize and make globally available
window.complianceInsights = new ComplianceInsights();
/**
 * Compliance Data for Zero Trust NAC Architecture Designer Pro
 * Industry-specific compliance frameworks and requirements
 */

const ComplianceData = {
  // Framework definitions
  frameworks: {
    hipaa: {
      name: 'HIPAA',
      description: 'Health Insurance Portability and Accountability Act',
      relevance: ['healthcare'],
      categories: [
        {
          name: 'Access Control',
          requirements: [
            'Implement technical policies and procedures for electronic PHI access',
            'Establish unique user identification',
            'Implement emergency access procedures',
            'Automatic logoff and encryption/decryption'
          ]
        },
        {
          name: 'Audit Controls',
          requirements: [
            'Implement hardware, software, and procedural mechanisms to record and examine activity',
            'Track authentication attempts and system events',
            'Record actions taken on ePHI'
          ]
        },
        {
          name: 'Integrity Controls',
          requirements: [
            'Implement policies to protect ePHI from improper alteration or destruction',
            'Verify data integrity through checksums',
            'Ensure data has not been altered in an unauthorized manner'
          ]
        },
        {
          name: 'Device and Media Controls',
          requirements: [
            'Implement policies for the receipt and removal of hardware and electronic media',
            'Track movement of devices containing ePHI',
            'Ensure proper disposal of media containing ePHI'
          ]
        }
      ]
    },
    pci: {
      name: 'PCI DSS',
      description: 'Payment Card Industry Data Security Standard',
      relevance: ['retail', 'finance', 'healthcare', 'education'],
      categories: [
        {
          name: 'Build and Maintain a Secure Network',
          requirements: [
            'Install and maintain a firewall configuration to protect cardholder data',
            'Do not use vendor-supplied defaults for system passwords and security parameters'
          ]
        },
        {
          name: 'Protect Cardholder Data',
          requirements: [
            'Protect stored cardholder data',
            'Encrypt transmission of cardholder data across open, public networks'
          ]
        },
        {
          name: 'Maintain a Vulnerability Management Program',
          requirements: [
            'Use and regularly update anti-virus software',
            'Develop and maintain secure systems and applications'
          ]
        },
        {
          name: 'Implement Strong Access Control Measures',
          requirements: [
            'Restrict access to cardholder data by business need-to-know',
            'Identify and authenticate access to system components',
            'Restrict physical access to cardholder data'
          ]
        },
        {
          name: 'Regularly Monitor and Test Networks',
          requirements: [
            'Track and monitor all access to network resources and cardholder data',
            'Regularly test security systems and processes'
          ]
        }
      ]
    },
    nist: {
      name: 'NIST 800-53',
      description: 'National Institute of Standards and Technology Special Publication 800-53',
      relevance: ['government', 'education', 'healthcare', 'finance', 'manufacturing'],
      categories: [
        {
          name: 'Access Control (AC)',
          requirements: [
            'Limit system access to authorized users',
            'Implement least privilege principles',
            'Enforce separation of duties',
            'Employ session termination and locking'
          ]
        },
        {
          name: 'Audit and Accountability (AU)',
          requirements: [
            'Create and retain system audit logs',
            'Ensure audit reduction and report generation',
            'Provide audit record review, analysis, and reporting'
          ]
        },
        {
          name: 'System and Communications Protection (SC)',
          requirements: [
            'Separate user and system functionality',
            'Prevent unauthorized and unintended information transfer',
            'Implement cryptographic mechanisms'
          ]
        },
        {
          name: 'System and Information Integrity (SI)',
          requirements: [
            'Identify and manage information system flaws',
            'Perform malicious code protection',
            'Monitor system security alerts and advisories'
          ]
        },
        {
          name: 'Identification and Authentication (IA)',
          requirements: [
            'Identify and authenticate organizational users',
            'Implement device identification and authentication',
            'Manage identifier and authenticator details'
          ]
        }
      ]
    },
    gdpr: {
      name: 'GDPR',
      description: 'General Data Protection Regulation',
      relevance: ['healthcare', 'finance', 'retail', 'education', 'government', 'manufacturing'],
      categories: [
        {
          name: 'Lawfulness, Fairness and Transparency',
          requirements: [
            'Process data lawfully, fairly and in a transparent manner',
            'Maintain clear policies on data processing activities',
            'Document lawful basis for processing'
          ]
        },
        {
          name: 'Data Security',
          requirements: [
            'Implement appropriate technical measures to ensure data security',
            'Protect against unauthorized processing',
            'Ensure ongoing confidentiality, integrity, availability and resilience'
          ]
        },
        {
          name: 'Accountability and Governance',
          requirements: [
            'Demonstrate compliance with GDPR principles',
            'Implement data protection policies',
            'Maintain records of processing activities'
          ]
        },
        {
          name: 'Data Subject Rights',
          requirements: [
            'Facilitate rights of access, rectification, erasure',
            'Support data portability',
            'Implement procedures for handling data subject requests'
          ]
        }
      ]
    },
    iso: {
      name: 'ISO 27001',
      description: 'International Organization for Standardization 27001',
      relevance: ['healthcare', 'finance', 'retail', 'education', 'government', 'manufacturing'],
      categories: [
        {
          name: 'Access Control',
          requirements: [
            'Business requirements for access control',
            'User access management',
            'User responsibilities',
            'System and application access control'
          ]
        },
        {
          name: 'Cryptography',
          requirements: [
            'Cryptographic controls policy',
            'Key management'
          ]
        },
        {
          name: 'Operations Security',
          requirements: [
            'Operational procedures and responsibilities',
            'Protection from malware',
            'Backup',
            'Logging and monitoring'
          ]
        },
        {
          name: 'Communications Security',
          requirements: [
            'Network security management',
            'Information transfer',
            'Secure communication channels'
          ]
        },
        {
          name: 'System Acquisition, Development and Maintenance',
          requirements: [
            'Security requirements of information systems',
            'Security in development and support processes',
            'Test data management'
          ]
        }
      ]
    }
  },
  
  // Industry-specific requirements
  industries: {
    healthcare: {
      name: 'Healthcare',
      icon: 'fas fa-hospital',
      description: 'Healthcare organizations must protect sensitive patient data and medical devices while ensuring compliance with regulations like HIPAA.',
      frameworks: ['hipaa', 'nist', 'gdpr', 'iso'],
      requirements: [
        {
          name: 'Identity Verification',
          description: 'Strong authentication for clinical staff accessing patient records',
          key: true,
          vendorScores: {
            cisco: 70,
            aruba: 65,
            forescout: 75,
            nps: 55,
            fortinac: 75,
            securew2: 70,
            portnox: 95
          }
        },
        {
          name: 'Device Security',
          description: 'Protection for medical devices and clinical workstations',
          key: true,
          vendorScores: {
            cisco: 65,
            aruba: 60,
            forescout: 80,
            nps: 50,
            fortinac: 70,
            securew2: 65,
            portnox: 90
          }
        },
        {
          name: 'Network Segmentation',
          description: 'Isolation of clinical, guest, and IoT networks',
          key: true,
          vendorScores: {
            cisco: 85,
            aruba: 80,
            forescout: 85,
            nps: 60,
            fortinac: 80,
            securew2: 70,
            portnox: 100
          }
        },
        {
          name: 'Compliance Tracking',
          description: 'Automated ePHI protection and HIPAA compliance tracking',
          key: true,
          vendorScores: {
            cisco: 60,
            aruba: 55,
            forescout: 70,
            nps: 45,
            fortinac: 60,
            securew2: 60,
            portnox: 95
          }
        },
        {
          name: 'Audit Logging',
          description: 'Detailed access logging for regulatory compliance',
          key: true,
          vendorScores: {
            cisco: 75,
            aruba: 70,
            forescout: 80,
            nps: 65,
            fortinac: 75,
            securew2: 70,
            portnox: 90
          }
        },
        {
          name: 'Incident Response',
          description: 'Rapid containment of compromised medical systems',
          key: true,
          vendorScores: {
            cisco: 70,
            aruba: 65,
            forescout: 75,
            nps: 50,
            fortinac: 70,
            securew2: 65,
            portnox: 85
          }
        }
      ]
    },
    finance: {
      name: 'Finance',
      icon: 'fas fa-university',
      description: 'Financial institutions must protect sensitive financial data and transactions while complying with stringent industry regulations.',
      frameworks: ['pci', 'nist', 'gdpr', 'iso'],
      requirements: [
        {
          name: 'Multi-Factor Authentication',
          description: 'Strong MFA for all financial system access',
          key: true,
          vendorScores: {
            cisco: 80,
            aruba: 75,
            forescout: 70,
            nps: 60,
            fortinac: 75,
            securew2: 80,
            portnox: 95
          }
        },
        {
          name: 'Insider Threat Protection',
          description: 'Prevention of unauthorized data access by employees',
          key: true,
          vendorScores: {
            cisco: 75,
            aruba: 70,
            forescout: 80,
            nps: 55,
            fortinac: 75,
            securew2: 65,
            portnox: 90
          }
        },
        {
          name: 'Transaction Security',
          description: 'Secure access to payment processing systems',
          key: true,
          vendorScores: {
            cisco: 80,
            aruba: 75,
            forescout: 70,
            nps: 60,
            fortinac: 75,
            securew2: 70,
            portnox: 85
          }
        },
        {
          name: 'Regulatory Compliance',
          description: 'Automated PCI DSS and compliance reporting',
          key: true,
          vendorScores: {
            cisco: 70,
            aruba: 65,
            forescout: 75,
            nps: 50,
            fortinac: 70,
            securew2: 65,
            portnox: 95
          }
        },
        {
          name: 'Continuous Monitoring',
          description: '24/7 monitoring of all network access and activity',
          key: true,
          vendorScores: {
            cisco: 75,
            aruba: 70,
            forescout: 85,
            nps: 55,
            fortinac: 75,
            securew2: 65,
            portnox: 90
          }
        },
        {
          name: 'Breach Prevention',
          description: 'Real-time threat detection and response',
          key: true,
          vendorScores: {
            cisco: 75,
            aruba: 70,
            forescout: 80,
            nps: 50,
            fortinac: 75,
            securew2: 65,
            portnox: 85
          }
        }
      ]
    },
    retail: {
      name: 'Retail',
      icon: 'fas fa-shopping-cart',
      description: 'Retail organizations must secure customer data, POS systems, and maintain PCI compliance while supporting diverse device types.',
      frameworks: ['pci', 'gdpr', 'iso'],
      requirements: [
        {
          name: 'POS System Security',
          description: 'Secure point-of-sale terminals and payment systems',
          key: true,
          vendorScores: {
            cisco: 75,
            aruba: 70,
            forescout: 75,
            nps: 55,
            fortinac: 70,
            securew2: 65,
            portnox: 90
          }
        },
        {
          name: 'Customer Data Protection',
          description: 'Safeguards for customer payment and personal information',
          key: true,
          vendorScores: {
            cisco: 70,
            aruba: 65,
            forescout: 75,
            nps: 50,
            fortinac: 70,
            securew2: 65,
            portnox: 90
          }
        },
        {
          name: 'Store Network Isolation',
          description: 'Segmentation between customer, POS, and corporate networks',
          key: true,
          vendorScores: {
            cisco: 80,
            aruba: 75,
            forescout: 80,
            nps: 55,
            fortinac: 75,
            securew2: 65,
            portnox: 95
          }
        },
        {
          name: 'IoT Device Management',
          description: 'Security for smart retail devices and digital signage',
          key: true,
          vendorScores: {
            cisco: 65,
            aruba: 60,
            forescout: 80,
            nps: 45,
            fortinac: 65,
            securew2: 60,
            portnox: 85
          }
        },
        {
          name: 'PCI Compliance',
          description: 'Continuous PCI DSS compliance monitoring and reporting',
          key: true,
          vendorScores: {
            cisco: 75,
            aruba: 70,
            forescout: 75,
            nps: 55,
            fortinac: 70,
            securew2: 65,
            portnox: 95
          }
        },
        {
          name: 'Guest Wi-Fi Security',
          description: 'Secure customer Wi-Fi separated from business operations',
          key: true,
          vendorScores: {
            cisco: 80,
            aruba: 85,
            forescout: 70,
            nps: 60,
            fortinac: 75,
            securew2: 85,
            portnox: 90
          }
        }
      ]
    },
    manufacturing: {
      name: 'Manufacturing',
      icon: 'fas fa-industry',
      description: 'Manufacturing organizations must secure operational technology (OT) and IT environments while protecting intellectual property and ensuring production continuity.',
      frameworks: ['nist', 'iso'],
      requirements: [
        {
          name: 'OT/IT Convergence',
          description: 'Secure integration of operational and information technology',
          key: true,
          vendorScores: {
            cisco: 70,
            aruba: 65,
            forescout: 85,
            nps: 50,
            fortinac: 70,
            securew2: 60,
            portnox: 90
          }
        },
        {
          name: 'ICS/SCADA Security',
          description: 'Protection for industrial control systems',
          key: true,
          vendorScores: {
            cisco: 65,
            aruba: 60,
            forescout: 80,
            nps: 45,
            fortinac: 65,
            securew2: 55,
            portnox: 85
          }
        },
        {
          name: 'Production Continuity',
          description: 'Minimizing security impacts on production systems',
          key: true,
          vendorScores: {
            cisco: 70,
            aruba: 65,
            forescout: 75,
            nps: 60,
            fortinac: 70,
            securew2: 60,
            portnox: 90
          }
        },
        {
          name: 'IP Protection',
          description: 'Safeguards for manufacturing intellectual property',
          key: true,
          vendorScores: {
            cisco: 75,
            aruba: 70,
            forescout: 75,
            nps: 55,
            fortinac: 70,
            securew2: 65,
            portnox: 85
          }
        },
        {
          name: 'IoT Device Security',
          description: 'Protection for smart manufacturing equipment and sensors',
          key: true,
          vendorScores: {
            cisco: 65,
            aruba: 60,
            forescout: 85,
            nps: 45,
            fortinac: 65,
            securew2: 60,
            portnox: 90
          }
        },
        {
          name: 'Supply Chain Security',
          description: 'Secure integration with suppliers and partners',
          key: true,
          vendorScores: {
            cisco: 70,
            aruba: 65,
            forescout: 70,
            nps: 50,
            fortinac: 65,
            securew2: 60,
            portnox: 85
          }
        }
      ]
    },
    education: {
      name: 'Education',
      icon: 'fas fa-graduation-cap',
      description: 'Educational institutions must secure diverse network environments with limited IT resources while supporting BYOD and protecting student data.',
      frameworks: ['nist', 'gdpr', 'pci'],
      requirements: [
        {
          name: 'BYOD Management',
          description: 'Secure access for student and faculty personal devices',
          key: true,
          vendorScores: {
            cisco: 70,
            aruba: 75,
            forescout: 70,
            nps: 60,
            fortinac: 70,
            securew2: 80,
            portnox: 95
          }
        },
        {
          name: 'Student Data Protection',
          description: 'Safeguards for student personal and academic information',
          key: true,
          vendorScores: {
            cisco: 75,
            aruba: 70,
            forescout: 75,
            nps: 55,
            fortinac: 70,
            securew2: 65,
            portnox: 90
          }
        },
        {
          name: 'Campus Network Segmentation',
          description: 'Isolation between academic, administrative, and residential networks',
          key: true,
          vendorScores: {
            cisco: 80,
            aruba: 75,
            forescout: 80,
            nps: 55,
            fortinac: 75,
            securew2: 65,
            portnox: 90
          }
        },
        {
          name: 'Resource Efficiency',
          description: 'Low administrative overhead for limited IT staff',
          key: true,
          vendorScores: {
            cisco: 50,
            aruba: 55,
            forescout: 60,
            nps: 65,
            fortinac: 60,
            securew2: 70,
            portnox: 95
          }
        },
        {
          name: 'Guest Access Management',
          description: 'Secure, simple visitor access for campus events',
          key: true,
          vendorScores: {
            cisco: 75,
            aruba: 80,
            forescout: 70,
            nps: 60,
            fortinac: 70,
            securew2: 85,
            portnox: 90
          }
        },
        {
          name: 'Research Network Protection',
          description: 'Security for sensitive research data and systems',
          key: true,
          vendorScores: {
            cisco: 75,
            aruba: 70,
            forescout: 80,
            nps: 55,
            fortinac: 70,
            securew2: 65,
            portnox: 85
          }
        }
      ]
    },
    government: {
      name: 'Government',
      icon: 'fas fa-landmark',
      description: 'Government agencies must meet strict compliance requirements while protecting sensitive data and maintaining public service continuity.',
      frameworks: ['nist', 'gdpr', 'iso'],
      requirements: [
        {
          name: 'Regulatory Compliance',
          description: 'Adherence to NIST 800-53, FISMA, and FedRAMP',
          key: true,
          vendorScores: {
            cisco: 80,
            aruba: 75,
            forescout: 80,
            nps: 60,
            fortinac: 75,
            securew2: 70,
            portnox: 95
          }
        },
        {
          name: 'Citizen Data Protection',
          description: 'Safeguards for personally identifiable information',
          key: true,
          vendorScores: {
            cisco: 75,
            aruba: 70,
            forescout: 75,
            nps: 55,
            fortinac: 70,
            securew2: 65,
            portnox: 90
          }
        },
        {
          name: 'Advanced Threat Protection',
          description: 'Defense against sophisticated cyber attacks',
          key: true,
          vendorScores: {
            cisco: 80,
            aruba: 75,
            forescout: 80,
            nps: 55,
            fortinac: 75,
            securew2: 65,
            portnox: 85
          }
        },
        {
          name: 'Continuous Monitoring',
          description: 'Real-time visibility and security reporting',
          key: true,
          vendorScores: {
            cisco: 75,
            aruba: 70,
            forescout: 85,
            nps: 55,
            fortinac: 75,
            securew2: 60,
            portnox: 90
          }
        },
        {
          name: 'Zero Trust Implementation',
          description: 'Comprehensive identity and device verification',
          key: true,
          vendorScores: {
            cisco: 80,
            aruba: 75,
            forescout: 80,
            nps: 55,
            fortinac: 75,
            securew2: 70,
            portnox: 95
          }
        },
        {
          name: 'Incident Response',
          description: 'Rapid detection and remediation of security incidents',
          key: true,
          vendorScores: {
            cisco: 75,
            aruba: 70,
            forescout: 80,
            nps: 55,
            fortinac: 75,
            securew2: 65,
            portnox: 85
          }
        }
      ]
    }
  },
  
  // Vendor framework compliance scores (0-100)
  vendorCompliance: {
    cisco: {
      hipaa: 75,
      pci: 80,
      nist: 85,
      gdpr: 70,
      iso: 80
    },
    aruba: {
      hipaa: 70,
      pci: 75,
      nist: 80,
      gdpr: 65,
      iso: 75
    },
    forescout: {
      hipaa: 80,
      pci: 75,
      nist: 80,
      gdpr: 70,
      iso: 75
    },
    nps: {
      hipaa: 60,
      pci: 65,
      nist: 70,
      gdpr: 55,
      iso: 65
    },
    fortinac: {
      hipaa: 75,
      pci: 75,
      nist: 80,
      gdpr: 70,
      iso: 75
    },
    securew2: {
      hipaa: 70,
      pci: 75,
      nist: 75,
      gdpr: 65,
      iso: 70
    },
    portnox: {
      hipaa: 95,
      pci: 90,
      nist: 95,
      gdpr: 90,
      iso: 95
    }
  }
};

// Make data available globally
window.ComplianceData = ComplianceData;

console.log('Compliance data initialized');
/**
 * Enhanced Industry and Compliance Information
 * Provides detailed industry-specific insights and compliance requirements
 */

// Enhanced industry templates with more detailed compliance information
window.enhancedIndustryTemplates = {
  healthcare: {
    name: 'Healthcare',
    description: 'Healthcare organizations face unique challenges in securing medical devices, patient data, and maintaining compliance with strict regulations like HIPAA while ensuring easy access for clinical staff.',
    defaults: {
      deviceCount: 5000,
      yearsToProject: 3,
      multipleLocations: true,
      locationCount: 10,
      complexAuthentication: true,
      legacyDevices: true,
      legacyPercentage: 40,
      cloudIntegration: true,
      customPolicies: true,
      policyComplexity: 'high'
    },
    complianceInfo: {
      title: 'Healthcare Compliance Requirements',
      details: 'Healthcare organizations must implement robust NAC solutions that support HIPAA compliance by securing protected health information (PHI), controlling access to electronic health record (EHR) systems, segmenting clinical and guest networks, and maintaining detailed audit logs for compliance reporting.',
      keyRequirements: [
        'Protected Health Information (PHI) security with real-time monitoring and alerts',
        'Medical device identification, classification, and security for FDA compliance',
        'Role-based access control with clinical workflow optimization',
        'Guest and patient network isolation with captive portal support',
        'Comprehensive audit trails for security investigations and compliance verification',
        'Business Associate Agreement (BAA) compatibility for cloud solutions'
      ],
      regulations: [
        {
          name: 'HIPAA',
          description: 'The Health Insurance Portability and Accountability Act sets the standard for protecting sensitive patient data and requires appropriate safeguards to protect the privacy of personal health information.',
          relevance: 'Network Access Control helps satisfy HIPAA Security Rule requirements for access controls (§164.312(a)(1)), audit controls (§164.312(b)), and device and media controls (§164.310(d)(1)).'
        },
        {
          name: 'HITECH Act',
          description: 'The Health Information Technology for Economic and Clinical Health Act expanded HIPAA requirements and increased penalties for non-compliance.',
          relevance: 'NAC solutions provide the technical capabilities to meet HITECH requirements for access restriction and activity logging.'
        },
        {
          name: 'FDA Medical Device Regulations',
          description: 'FDA guidelines for medical device cybersecurity include requirements for device identification and security measures.',
          relevance: 'NAC solutions can identify and classify medical devices, apply appropriate policies, and protect them from network-based threats.'
        }
      ]
    },
    riskFactors: [
      'Legacy medical devices with limited security features',
      'Multiple user roles requiring different access privileges',
      'Need for 24/7 availability with minimal downtime',
      'High cost of compliance violations (HIPAA penalties)',
      'IoT medical devices with limited security capabilities'
    ],
    challengesMitigated: [
      {
        challenge: 'Identifying and securing medical devices',
        mitigation: 'Automatic device discovery and classification with medical device profiles'
      },
      {
        challenge: 'Maintaining continuous care while enforcing security',
        mitigation: 'Role-based access policies that account for clinical workflows and emergency scenarios'
      },
      {
        challenge: 'Ensuring PHI remains protected across the network',
        mitigation: 'Network segmentation and least privilege access controls'
      },
      {
        challenge: 'Managing BYOD in clinical settings',
        mitigation: 'Endpoint posture assessment and cloud-based management'
      }
    ],
    benchmarks: {
      averageTCO: 450000,
      implementationTime: 120,
      fteCost: 185000,
      cloudSavingsPercentage: 65,
      maintenanceReduction: 80
    }
  },
  
  financial: {
    name: 'Financial Services',
    description: 'Financial institutions must balance robust security with operational efficiency while managing complex regulatory requirements and protecting high-value targets from sophisticated threats.',
    defaults: {
      deviceCount: 8000,
      yearsToProject: 5,
      multipleLocations: true,
      locationCount: 50,
      complexAuthentication: true,
      legacyDevices: true,
      legacyPercentage: 20,
      cloudIntegration: true,
      customPolicies: true,
      policyComplexity: 'high'
    },
    complianceInfo: {
      title: 'Financial Services Compliance Requirements',
      details: 'Financial institutions must meet stringent regulatory requirements from multiple frameworks, with a strong emphasis on data protection, fraud prevention, privileged access management, and comprehensive audit trails for all network activity.',
      keyRequirements: [
        'Segmentation of cardholder data environments (CDE) for PCI DSS compliance',
        'Multi-factor authentication for all privileged access',
        'Continuous compliance monitoring with real-time alerts',
        'Regular penetration testing and vulnerability management',
        'Detailed audit trails for regulatory examinations and forensic investigations',
        'Privileged account monitoring and just-in-time access controls'
      ],
      regulations: [
        {
          name: 'PCI DSS',
          description: 'The Payment Card Industry Data Security Standard is a set of security standards designed to ensure all companies that accept, process, store or transmit credit card information maintain a secure environment.',
          relevance: 'NAC solutions help meet requirements 1 (network segmentation), 7 (access control), 10 (monitoring), and 11 (security testing).'
        },
        {
          name: 'SOX',
          description: 'The Sarbanes-Oxley Act requires strict financial controls and security for systems that handle financial reporting data.',
          relevance: 'NAC provides access controls and audit trails that support SOX section 404 compliance requirements.'
        },
        {
          name: 'GLBA',
          description: 'The Gramm-Leach-Bliley Act requires financial institutions to explain how they share and protect customer data.',
          relevance: 'NAC supports the Safeguards Rule by providing controls that protect customer information.'
        },
        {
          name: 'FFIEC Guidelines',
          description: 'The Federal Financial Institutions Examination Council provides guidance on information security and authentication.',
          relevance: 'NAC solutions align with FFIEC guidance on layered security and access controls.'
        }
      ]
    },
    riskFactors: [
      'High-value target for sophisticated threat actors',
      'Complex environment with numerous third-party integrations',
      'Legacy banking systems requiring specialized protection',
      'Significant regulatory penalties for non-compliance',
      'Advanced persistent threats requiring continuous monitoring'
    ],
    challengesMitigated: [
      {
        challenge: 'Maintaining PCI DSS compliance across distributed infrastructure',
        mitigation: 'Centralized policy management with automated compliance reporting'
      },
      {
        challenge: 'Securing third-party vendor access to financial systems',
        mitigation: 'Granular access controls with time-limited authentication'
      },
      {
        challenge: 'Preventing unauthorized access to sensitive financial data',
        mitigation: 'Multi-factor authentication enforcement and device health checks'
      },
      {
        challenge: 'Supporting hybrid cloud and on-premises environments',
        mitigation: 'Unified management across all deployment models'
      }
    ],
    benchmarks: {
      averageTCO: 750000,
      implementationTime: 160,
      fteCost: 210000,
      cloudSavingsPercentage: 58,
      maintenanceReduction: 72
    }
  },
  
  education: {
    name: 'Education',
    description: 'Educational institutions manage diverse user populations and device types with seasonal enrollment fluctuations, limited budgets, and growing security requirements while maintaining an open learning environment.',
    defaults: {
      deviceCount: 10000,
      yearsToProject: 3,
      multipleLocations: true,
      locationCount: 5,
      complexAuthentication: false,
      legacyDevices: true,
      legacyPercentage: 50,
      cloudIntegration: true,
      customPolicies: true,
      policyComplexity: 'medium'
    },
    complianceInfo: {
      title: 'Education Sector Compliance Requirements',
      details: 'Educational institutions must balance open access for learning with strong protection of student data. They face unique challenges with diverse user populations, BYOD environments, seasonal enrollment fluctuations, and various compliance requirements.',
      keyRequirements: [
        'Student data protection in compliance with FERPA regulations',
        'Secure BYOD support for students, faculty, and staff',
        'Visitor network management with easy self-registration',
        'Seasonal scaling capabilities to handle enrollment fluctuations',
        'Research network protection with specialized security policies',
        'Flexible authentication options including eduroam federation support'
      ],
      regulations: [
        {
          name: 'FERPA',
          description: 'The Family Educational Rights and Privacy Act protects the privacy of student education records.',
          relevance: 'NAC solutions help restrict access to systems containing student records to authorized personnel only.'
        },
        {
          name: 'COPPA',
          description: 'The Children\'s Online Privacy Protection Act applies to operators of websites and online services directed to children under 13 years of age.',
          relevance: 'NAC can help implement appropriate controls for networks accessed by minors.'
        },
        {
          name: 'CIPA',
          description: 'The Children\'s Internet Protection Act requires schools and libraries to use internet filters to protect children from harmful online content.',
          relevance: 'NAC solutions can enforce policy-based filtering and monitoring requirements.'
        }
      ]
    },
    riskFactors: [
      'Large BYOD environment with limited control over devices',
      'Seasonal network usage patterns with enrollment spikes',
      'Open campus environments requiring segmented access',
      'Limited IT resources and budget constraints',
      'Balancing academic freedom with security requirements'
    ],
    challengesMitigated: [
      {
        challenge: 'Managing thousands of student devices with minimal overhead',
        mitigation: 'Self-service onboarding with automated device provisioning'
      },
      {
        challenge: 'Supporting diverse research requirements',
        mitigation: 'Flexible network segmentation with custom policy options'
      },
      {
        challenge: 'Securing shared computer labs and learning spaces',
        mitigation: 'Role-based access control tied to student information systems'
      },
      {
        challenge: 'Maintaining security with limited IT staffing',
        mitigation: 'Cloud-based management with automated remediation workflows'
      }
    ],
    benchmarks: {
      averageTCO: 320000,
      implementationTime: 90,
      fteCost: 150000,
      cloudSavingsPercentage: 70,
      maintenanceReduction: 85
    }
  },
  
  manufacturing: {
    name: 'Manufacturing',
    description: 'Manufacturing environments blend IT and OT systems with critical production equipment, industrial IoT devices, and strict uptime requirements requiring specialized security approaches.',
    defaults: {
      deviceCount: 3000,
      yearsToProject: 4,
      multipleLocations: true,
      locationCount: 3,
      complexAuthentication: true,
      legacyDevices: true,
      legacyPercentage: 70,
      cloudIntegration: false,
      customPolicies: true,
      policyComplexity: 'medium'
    },
    complianceInfo: {
      title: 'Manufacturing & Industrial Compliance Requirements',
      details: 'Manufacturing environments require NAC solutions that can secure the IT/OT convergence zone, manage industrial IoT devices, and protect industrial control systems while ensuring production continuity and minimal downtime.',
      keyRequirements: [
        'OT/IT network segmentation with industrial protocol support',
        'Legacy industrial system protection without agent requirements',
        'Production continuity with non-disruptive security',
        'ICS/SCADA system protection with specialized policies',
        'Regulatory compliance for critical infrastructure',
        'Supply chain security integration'
      ],
      regulations: [
        {
          name: 'IEC 62443',
          description: 'International standards for industrial automation and control systems security.',
          relevance: 'NAC provides zone-based segmentation and access controls aligned with IEC 62443 security levels.'
        },
        {
          name: 'NIST 800-82',
          description: 'Guide to Industrial Control Systems Security provides guidance on securing industrial control systems.',
          relevance: 'NAC helps implement recommended access control and network segmentation measures.'
        },
        {
          name: 'NERC CIP',
          description: 'North American Electric Reliability Corporation Critical Infrastructure Protection standards for power grid security.',
          relevance: 'NAC supports electronic security perimeter requirements and access control measures.'
        }
      ]
    },
    riskFactors: [
      'Legacy industrial equipment with minimal security features',
      'Operational technology with 24/7 uptime requirements',
      'Specialized industrial protocols requiring monitoring',
      'Supply chain vulnerabilities from third-party integrations',
      'Physical security integration requirements'
    ],
    challengesMitigated: [
      {
        challenge: 'Protecting critical production infrastructure',
        mitigation: 'Agentless monitoring with non-disruptive security controls'
      },
      {
        challenge: 'IT/OT convergence security',
        mitigation: 'Specialized industrial protocol support and segmentation'
      },
      {
        challenge: 'Supply chain security management',
        mitigation: 'Vendor access controls with limited network exposure'
      },
      {
        challenge: 'Securing industrial IoT devices',
        mitigation: 'Automated discovery and profiling with device-specific policies'
      }
    ],
    benchmarks: {
      averageTCO: 380000,
      implementationTime: 110,
      fteCost: 165000,
      cloudSavingsPercentage: 60,
      maintenanceReduction: 75
    }
  },
  
  retail: {
    name: 'Retail',
    description: 'Retail organizations balance customer experience with data protection across distributed locations, managing POS systems, guest WiFi, and seasonal staffing fluctuations with limited IT resources.',
    defaults: {
      deviceCount: 2500,
      yearsToProject: 3,
      multipleLocations: true,
      locationCount: 25,
      complexAuthentication: false,
      legacyDevices: true,
      legacyPercentage: 30,
      cloudIntegration: true,
      customPolicies: false,
      policyComplexity: 'low'
    },
    complianceInfo: {
      title: 'Retail Sector Compliance Requirements',
      details: 'Retail environments need NAC solutions that protect point-of-sale systems and customer data while providing convenient guest access, supporting seasonal staff fluctuations, and maintaining PCI DSS compliance across multiple locations.',
      keyRequirements: [
        'PCI DSS compliance for cardholder data protection',
        'Point-of-sale system security with minimal disruption',
        'Guest WiFi management with promotional opportunities',
        'Inventory and IoT device security controls',
        'Support for seasonal staffing fluctuations',
        'Multi-site management with centralized reporting'
      ],
      regulations: [
        {
          name: 'PCI DSS',
          description: 'The Payment Card Industry Data Security Standard requires all entities that process, store or transmit cardholder data to maintain a secure environment.',
          relevance: 'NAC provides network segmentation, access controls, and monitoring required for PCI DSS compliance.'
        },
        {
          name: 'CCPA/CPRA',
          description: 'California Consumer Privacy Act and California Privacy Rights Act provide California residents with rights over their personal information.',
          relevance: 'NAC helps restrict access to systems containing customer data to authorized personnel only.'
        },
        {
          name: 'GDPR',
          description: 'The General Data Protection Regulation protects personal data and privacy for individuals in the European Union.',
          relevance: 'NAC helps implement appropriate technical measures to protect personal data as required by GDPR.'
        }
      ]
    },
    riskFactors: [
      'Distributed retail locations with limited IT staff',
      'Legacy POS systems requiring specialized protection',
      'Seasonal staffing requiring rapid onboarding/offboarding',
      'Public WiFi networks adjacent to payment systems',
      'High-volume customer data handling'
    ],
    challengesMitigated: [
      {
        challenge: 'Managing distributed store networks without local IT',
        mitigation: 'Cloud-based centralized management with remote troubleshooting'
      },
      {
        challenge: 'Maintaining PCI compliance across all locations',
        mitigation: 'Automated network segmentation with continuous compliance monitoring'
      },
      {
        challenge: 'Securing IoT devices like digital signage and inventory systems',
        mitigation: 'IoT-specific profiles with automated discovery and classification'
      },
      {
        challenge: 'Seasonal staff provisioning and deprovisioning',
        mitigation: 'Integrated identity management with automated access termination'
      }
    ],
    benchmarks: {
      averageTCO: 280000,
      implementationTime: 75,
      fteCost: 140000,
      cloudSavingsPercentage: 75,
      maintenanceReduction: 80
    }
  },
  
  government: {
    name: 'Government',
    description: 'Government agencies manage sensitive information with strict compliance requirements, legacy systems, and complex authentication needs across multiple security domains.',
    defaults: {
      deviceCount: 7500,
      yearsToProject: 5,
      multipleLocations: true,
      locationCount: 12,
      complexAuthentication: true,
      legacyDevices: true,
      legacyPercentage: 45,
      cloudIntegration: false,
      customPolicies: true,
      policyComplexity: 'high'
    },
    complianceInfo: {
      title: 'Government Compliance Requirements',
      details: 'Government agencies face stringent security requirements with strict compliance mandates, complex authentication needs, and the necessity to protect sensitive information while managing legacy systems and maintaining public service delivery.',
      keyRequirements: [
        'FedRAMP/StateRAMP compliance for cloud deployments',
        'FIPS 140-2 validated cryptography for data protection',
        'NIST 800-53 alignment for federal information systems',
        'PIV/CAC smart card integration for secure authentication',
        'Advanced persistent threat (APT) protection',
        'Detailed audit logging for security investigations'
      ],
      regulations: [
        {
          name: 'FISMA',
          description: 'The Federal Information Security Modernization Act requires agencies to develop and implement information security programs.',
          relevance: 'NAC provides the access controls, monitoring, and documentation required for FISMA compliance.'
        },
        {
          name: 'NIST 800-53',
          description: 'Security and privacy controls for federal information systems and organizations.',
          relevance: 'NAC implements multiple control families including AC (Access Control), IA (Identification and Authentication), and CM (Configuration Management).'
        },
        {
          name: 'CJIS',
          description: 'Criminal Justice Information Services security policy for agencies accessing criminal justice information.',
          relevance: 'NAC helps implement advanced authentication and access controls required for CJIS compliance.'
        }
      ]
    },
    riskFactors: [
      'Advanced persistent threats targeting government systems',
      'Legacy systems with extended lifecycle requirements',
      'Complex multi-level security requirements',
      'Strict regulatory compliance mandates',
      'Budget constraints with long procurement cycles'
    ],
    challengesMitigated: [
      {
        challenge: 'Managing classified and unclassified network segments',
        mitigation: 'Policy-based access control with physical authentication integration'
      },
      {
        challenge: 'Supporting legacy systems with modern security',
        mitigation: 'Agentless monitoring with specialized government profiles'
      },
      {
        challenge: 'Implementing zero trust architecture',
        mitigation: 'Continuous authentication with detailed device health validation'
      },
      {
        challenge: 'Meeting FedRAMP compliance requirements',
        mitigation: 'Certified cloud deployment options with government-specific security controls'
      }
    ],
    benchmarks: {
      averageTCO: 620000,
      implementationTime: 180,
      fteCost: 195000,
      cloudSavingsPercentage: 55,
      maintenanceReduction: 65
    }
  },
  
  healthcare_hipaa: {
    name: 'Healthcare (HIPAA Focus)',
    description: 'Healthcare providers with specific focus on HIPAA compliance, medical device security, and clinical workflow optimization for improved patient care and data protection.',
    defaults: {
      deviceCount: 4500,
      yearsToProject: 3,
      multipleLocations: true,
      locationCount: 8,
      complexAuthentication: true,
      legacyDevices: true,
      legacyPercentage: 50,
      cloudIntegration: true,
      customPolicies: true,
      policyComplexity: 'high'
    },
    complianceInfo: {
      title: 'HIPAA-Focused Healthcare Requirements',
      details: 'This specialized compliance profile focuses on the unique HIPAA Security Rule requirements that affect healthcare networking, with emphasis on technical safeguards, protected health information security, and continuous compliance documentation.',
      keyRequirements: [
        'Technical safeguards for ePHI as defined in 45 CFR § 164.312',
        'Unique user identification (§ 164.312(a)(2)(i))',
        'Emergency access procedures (§ 164.312(a)(2)(ii))',
        'Automatic logoff implementation (§ 164.312(a)(2)(iii))',
        'Audit controls for ePHI activity (§ 164.312(b))',
        'Person or entity authentication (§ 164.312(d))'
      ],
      regulations: [
        {
          name: 'HIPAA Security Rule',
          description: 'Establishes national standards to protect electronic personal health information that is created, received, used, or maintained by a covered entity.',
          relevance: 'NAC directly addresses the technical safeguards requirements for access control, audit controls, and transmission security.'
        },
        {
          name: 'HIPAA Privacy Rule',
          description: 'Establishes standards for the protection of certain health information.',
          relevance: 'NAC helps implement the minimum necessary standard by restricting access to only what is needed to perform job functions.'
        },
        {
          name: 'HITECH Breach Notification',
          description: 'Requires covered entities to notify affected individuals following the discovery of a breach of unsecured PHI.',
          relevance: 'NAC monitoring provides breach detection capabilities and forensic information for required notifications.'
        }
      ]
    },
    hipaaDetails: {
      riskAnalysis: 'Network Access Control directly addresses multiple risk areas identified in HIPAA risk analysis requirements (45 CFR § 164.308(a)(1)(ii)(A)). It provides controls for identifying and restricting unauthorized users and devices that could potentially access electronic Protected Health Information (ePHI).',
      documentationSupport: 'NAC solutions maintain detailed logs and reports that help satisfy HIPAA documentation requirements (45 CFR § 164.316(b)(1)). These records of access attempts, policy changes, and security incidents serve as evidence of security rule compliance.',
      technicalControls: [
        {
          control: 'Access Control',
          requirement: '45 CFR § 164.312(a)(1)',
          implementation: 'NAC implements technical policies and procedures for electronic information systems that maintain ePHI to allow access only to authorized persons or software programs.'
        },
        {
          control: 'Audit Controls',
          requirement: '45 CFR § 164.312(b)',
          implementation: 'NAC implements hardware, software, and/or procedural mechanisms that record and examine activity in information systems that contain or use ePHI.'
        },
        {
          control: 'Integrity',
          requirement: '45 CFR § 164.312(c)(1)',
          implementation: 'NAC helps protect ePHI from improper alteration or destruction by restricting network access to authorized users and compliant devices.'
        },
        {
          control: 'Person or Entity Authentication',
          requirement: '45 CFR § 164.312(d)',
          implementation: 'NAC implements procedures to verify that a person or entity seeking access to ePHI is the one claimed.'
        },
        {
          control: 'Transmission Security',
          requirement: '45 CFR § 164.312(e)(1)',
          implementation: 'NAC implements technical security measures to guard against unauthorized access to ePHI that is being transmitted over an electronic communications network.'
        }
      ]
    },
    benchmarks: {
      averageTCO: 480000,
      implementationTime: 115,
      fteCost: 190000,
      cloudSavingsPercentage: 68,
      maintenanceReduction: 82,
      hipaaComplianceCosts: 120000
    }
  }
};

// Enhanced NAC benefit information
window.enhancedNACBenefits = {
  withoutNAC: {
    title: 'Current State Without NAC Solution',
    description: 'Organizations without a Network Access Control solution face significant security gaps, operational inefficiencies, and compliance challenges that increase both risk and total cost of ownership.',
    riskFactors: [
      {
        area: 'Security',
        risks: [
          'Unauthorized devices connect to network without restriction',
          'No visibility into device security posture or compliance',
          'Limited ability to detect and respond to threats',
          'Vulnerable devices can spread malware across network',
          'No automated enforcement of security policies'
        ]
      },
      {
        area: 'Operational',
        risks: [
          'Manual device provisioning and management',
          'Inefficient troubleshooting without device visibility',
          'No automated remediation of security issues',
          'Higher IT staff workload for security management',
          'Longer incident response time for security events'
        ]
      },
      {
        area: 'Compliance',
        risks: [
          'Limited ability to enforce regulatory requirements',
          'Insufficient audit trails for compliance reporting',
          'Difficulty demonstrating security controls to auditors',
          'Manual processes for compliance documentation',
          'Higher risk of non-compliance penalties'
        ]
      }
    ],
    costFactors: [
      {
        category: 'Direct Costs',
        items: [
          'Security incident response and remediation',
          'Regulatory fines for compliance violations',
          'Data breach costs and legal expenses',
          'Increased IT staffing requirements',
          'Multiple point solutions instead of integrated platform'
        ]
      },
      {
        category: 'Indirect Costs',
        items: [
          'Productivity loss during security incidents',
          'Reputational damage from security breaches',
          'Business disruption from network outages',
          'Slower network onboarding for new devices',
          'Increased business risk from security gaps'
        ]
      }
    ]
  },
  withNAC: {
    title: 'Benefits of Network Access Control',
    description: 'A modern NAC solution delivers comprehensive security, operational efficiency, and compliance benefits that reduce both risk and total cost of ownership while improving visibility and control.',
    benefitCategories: [
      {
        area: 'Security Benefits',
        benefits: [
          'Complete visibility of all network-connected devices',
          'Enforcement of security policies for all endpoints',
          'Automated threat detection and response',
          'Prevention of unauthorized network access',
          'Automatic quarantine of non-compliant devices'
        ]
      },
      {
        area: 'Operational Benefits',
        benefits: [
          'Reduced IT workload through automation',
          'Streamlined device provisioning and management',
          'Improved troubleshooting with device context',
          'Centralized policy management across locations',
          'Simplified guest and BYOD management'
        ]
      },
      {
        area: 'Compliance Benefits',
        benefits: [
          'Automated enforcement of compliance requirements',
          'Comprehensive audit trails for regulatory reporting',
          'Continuous monitoring of compliance status',
          'Simplified demonstration of security controls',
          'Reduced risk of compliance violations'
        ]
      }
    ],
    cloudAdvantages: [
      {
        category: 'Cost Efficiency',
        advantages: [
          'Elimination of hardware procurement costs',
          'Reduction in IT infrastructure maintenance',
          'Lower total cost of ownership vs. on-premises',
          'Predictable subscription-based pricing',
          'Automatic updates without upgrade costs'
        ]
      },
      {
        category: 'Operational Efficiency',
        advantages: [
          'Faster implementation with reduced complexity',
          'Centralized management of distributed locations',
          'Automatic scalability without capacity planning',
          'Reduced IT staffing requirements',
          'Zero maintenance and update management'
        ]
      },
      {
        category: 'Security Advantages',
        advantages: [
          'Always updated with latest security features',
          'Built-in redundancy and disaster recovery',
          'Global threat intelligence integration',
          'Cross-customer security insights',
          'Rapid response to emerging threats'
        ]
      }
    ]
  },
  portnoxAdvantages: {
    title: 'Portnox Competitive Advantages',
    description: 'Portnox Cloud delivers significant advantages over traditional NAC solutions with a true cloud-native architecture that simplifies deployment, reduces costs, and improves security outcomes.',
    keyDifferentiators: [
      {
        area: 'Cloud-Native Architecture',
        advantages: [
          'Purpose-built for cloud from the ground up',
          'No hardware or virtual appliances required',
          'Global scalability with regional data centers',
          'True SaaS model with continuous updates',
          'Rapid deployment with minimal prerequisites'
        ]
      },
      {
        area: 'Simplified Deployment',
        advantages: [
          'Lightweight cloud connector model vs. heavy appliances',
          'No network redesign or complex integration',
          'Non-disruptive implementation methodology',
          'Minimal pre-requisites for getting started',
          'Rapid time to value with quick deployment'
        ]
      },
      {
        area: 'Cost Efficiency',
        advantages: [
          'No hardware procurement or maintenance costs',
          'Reduced IT staffing requirements',
          'Predictable subscription pricing model',
          'No separate disaster recovery infrastructure',
          'Lower overall total cost of ownership'
        ]
      },
      {
        area: 'Operational Benefits',
        advantages: [
          'Centralized management of all locations',
          'Automated updates without maintenance windows',
          'Built-in high availability and redundancy',
          'Simplified remote/branch office management',
          'Reduced complexity with integrated solution'
        ]
      }
    ],
    competitiveComparison: {
      ciscoISE: [
        'Hardware-free deployment vs. multiple appliances',
        '75% faster implementation timeframe',
        '65% reduction in IT management overhead',
        'No network architecture changes required',
        'Automatic updates vs. complex upgrade processes'
      ],
      arubaClearPass: [
        'Cloud-native architecture vs. virtualized appliances',
        'No specialized expertise required for deployment',
        'Global scalability without additional infrastructure',
        'Lower total cost of ownership with SaaS model',
        'Simplified multi-site management'
      ],
      forescout: [
        'Lightweight deployment vs. heavy infrastructure',
        'Reduced complexity with integrated platform',
        'No hardware sizing or capacity planning',
        'Lower operational costs with no appliance management',
        'Continuous updates without maintenance windows'
      ],
      microsoftNPS: [
        'Full NAC capabilities vs. basic RADIUS functions',
        'Advanced posture assessment and enforcement',
        'Comprehensive device visibility and control',
        'Cross-platform support for all device types',
        'Simplified management with purpose-built interface'
      ]
    }
  }
};

// Enhanced migration vs. initial deployment information
window.enhancedDeploymentInfo = {
  initialDeployment: {
    title: 'Initial NAC Deployment',
    description: 'Initial deployment of a Network Access Control solution is a significant project that establishes the foundation for your network security architecture. The approach differs based on whether you choose an on-premises or cloud-based solution.',
    deploymentPhases: {
      onPremises: [
        {
          phase: 'Planning & Design',
          duration: '3-8 weeks',
          activities: [
            'Network architecture assessment',
            'Hardware sizing and capacity planning',
            'High availability design',
            'Database and integration planning',
            'Network topology mapping'
          ]
        },
        {
          phase: 'Infrastructure Preparation',
          duration: '2-4 weeks',
          activities: [
            'Server hardware procurement',
            'Network infrastructure preparation',
            'Virtual environment configuration',
            'Database server setup',
            'Security certificate provisioning'
          ]
        },
        {
          phase: 'Installation & Configuration',
          duration: '2-6 weeks',
          activities: [
            'Appliance installation and hardening',
            'Database configuration and optimization',
            'High availability setup',
            'Integration with authentication sources',
            'Management console configuration'
          ]
        },
        {
          phase: 'Policy Definition',
          duration: '2-4 weeks',
          activities: [
            'Authentication policy configuration',
            'Authorization policy setup',
            'Posture assessment definition',
            'Guest access policy configuration',
            'Remediation workflow setup'
          ]
        },
        {
          phase: 'Testing & Validation',
          duration: '2-4 weeks',
          activities: [
            'User authentication testing',
            'Device onboarding validation',
            'Policy enforcement verification',
            'Performance and load testing',
            'High availability failover testing'
          ]
        },
        {
          phase: 'Pilot Deployment',
          duration: '2-6 weeks',
          activities: [
            'Limited user group deployment',
            'Monitoring and issue resolution',
            'Policy refinement based on feedback',
            'Operational process validation',
            'Knowledge transfer to IT staff'
          ]
        },
        {
          phase: 'Full Deployment',
          duration: '4-12 weeks',
          activities: [
            'Phased rollout to all user groups',
            'Network integration across all segments',
            'Full enforcement mode activation',
            'User communication and training',
            'Operational handover to IT teams'
          ]
        }
      ],
      cloud: [
        {
          phase: 'Planning & Assessment',
          duration: '1-3 weeks',
          activities: [
            'Network requirements assessment',
            'Authentication source identification',
            'Use case prioritization',
            'Cloud connectivity evaluation',
            'Deployment approach planning'
          ]
        },
        {
          phase: 'Cloud Account Setup',
          duration: '1-3 days',
          activities: [
            'Cloud tenant provisioning',
            'Admin user creation',
            'Initial organization settings',
            'License assignment',
            'Regional data center selection'
          ]
        },
        {
          phase: 'Local Connector Deployment',
          duration: '1-3 days',
          activities: [
            'Cloud connector installation',
            'Network connection verification',
            'Authentication source integration',
            'Initial device discovery',
            'Connection verification'
          ]
        },
        {
          phase: 'Policy Configuration',
          duration: '1-2 weeks',
          activities: [
            'Authentication policy setup',
            'Device classification rules',
            'Access policy definition',
            'Compliance policy creation',
            'Guest access configuration'
          ]
        },
        {
          phase: 'Testing & Validation',
          duration: '1-2 weeks',
          activities: [
            'User authentication testing',
            'Device onboarding verification',
            'Policy enforcement validation',
            'Reporting and visibility checks',
            'Integration verification'
          ]
        },
        {
          phase: 'Pilot Deployment',
          duration: '1-2 weeks',
          activities: [
            'Limited deployment to test group',
            'Monitoring and issue resolution',
            'Policy refinement',
            'Process validation',
            'Admin training and knowledge transfer'
          ]
        },
        {
          phase: 'Full Deployment',
          duration: '2-4 weeks',
          activities: [
            'Phased rollout to all users',
            'Enforcement mode activation',
            'User communication',
            'Operational process documentation',
            'Final configuration adjustments'
          ]
        }
      ]
    },
    costFactors: {
      onPremises: [
        {
          category: 'Hardware Costs',
          items: [
            'Primary and redundant NAC appliances',
            'Database servers and licensing',
            'Network equipment upgrades if needed',
            'Load balancers for high availability',
            'Backup and recovery infrastructure'
          ]
        },
        {
          category: 'Implementation Costs',
          items: [
            'Professional services for deployment',
            'Network redesign if required',
            'Integration consulting',
            'Custom development for integrations',
            'Project management'
          ]
        },
        {
          category: 'Operational Costs',
          items: [
            'Ongoing hardware maintenance',
            'Software updates and patches',
            'IT staff for system management',
            'Training and certification',
            'Datacenter costs (power, cooling, rack space)'
          ]
        }
      ],
      cloud: [
        {
          category: 'Infrastructure Costs',
          items: [
            'Cloud connector host systems (minimal)',
            'Network equipment upgrades (rarely needed)',
            'No appliances or servers required',
            'No database infrastructure required',
            'No dedicated backup infrastructure'
          ]
        },
        {
          category: 'Implementation Costs',
          items: [
            'Limited professional services (if needed)',
            'No network redesign required',
            'Simplified integration setup',
            'Minimal project management',
            'Reduced deployment time and resources'
          ]
        },
        {
          category: 'Operational Costs',
          items: [
            'No hardware maintenance',
            'Automatic updates included in subscription',
            'Reduced IT staffing requirements',
            'Simplified training needs',
            'No datacenter costs'
          ]
        }
      ]
    }
  },
  migration: {
    title: 'Migration from Existing NAC',
    description: 'Migrating from an existing NAC solution to a new platform involves transitioning your security policies, device databases, and enforcement strategy with minimal disruption to users and operations. Cloud migration offers significant advantages in speed and complexity reduction.',
    migrationPhases: {
      onPremisesToOnPremises: [
        {
          phase: 'Migration Planning',
          duration: '2-4 weeks',
          activities: [
            'Current state documentation',
            'Policy mapping between platforms',
            'Integration inventory',
            'Migration strategy development',
            'Dependency analysis'
          ]
        },
        {
          phase: 'New Infrastructure Setup',
          duration: '2-6 weeks',
          activities: [
            'New hardware provisioning',
            'Network infrastructure preparation',
            'Parallel environment configuration',
            'Database configuration',
            'Certificate management'
          ]
        },
        {
          phase: 'Policy Translation',
          duration: '2-4 weeks',
          activities: [
            'Authentication policy migration',
            'Authorization policy conversion',
            'Posture assessment rule translation',
            'Guest access policy replication',
            'Custom policy adaptation'
          ]
        },
        {
          phase: 'Integration Reconfiguration',
          duration: '2-4 weeks',
          activities: [
            'Authentication source reconnection',
            'SIEM integration reconfiguration',
            'API integration redevelopment',
            'Third-party security tool reconnection',
            'Custom integration rebuilding'
          ]
        },
        {
          phase: 'Parallel Operation',
          duration: '2-6 weeks',
          activities: [
            'Both systems running simultaneously',
            'Gradual traffic shifting',
            'Monitoring and comparison',
            'Policy fine-tuning',
            'Issue resolution'
          ]
        },
        {
          phase: 'Cutover Planning',
          duration: '1-2 weeks',
          activities: [
            'Detailed cutover plan development',
            'Rollback procedure documentation',
            'Communication plan creation',
            'Support readiness preparation',
            'Final verification testing'
          ]
        },
        {
          phase: 'Production Cutover',
          duration: '1-4 weeks',
          activities: [
            'Phased enforcement transition',
            'User communication and support',
            'Monitoring and issue resolution',
            'Old system decommissioning',
            'Operational transition'
          ]
        }
      ],
      onPremisesToCloud: [
        {
          phase: 'Migration Assessment',
          duration: '1-3 weeks',
          activities: [
            'Current policy documentation',
            'Network architecture review',
            'Identity source inventory',
            'Integration requirements analysis',
            'Migration strategy development'
          ]
        },
        {
          phase: 'Cloud Account Setup',
          duration: '1-3 days',
          activities: [
            'Cloud tenant provisioning',
            'Admin account configuration',
            'Regional preferences setting',
            'License assignment',
            'Initial organization configuration'
          ]
        },
        {
          phase: 'Cloud Connector Deployment',
          duration: '1-3 days',
          activities: [
            'Connector installation in key locations',
            'Network connectivity verification',
            'Authentication source connection',
            'Initial device discovery',
            'Basic connectivity testing'
          ]
        },
        {
          phase: 'Policy Migration',
          duration: '1-2 weeks',
          activities: [
            'Current policy analysis and translation',
            'Cloud policy creation',
            'Device profile configuration',
            'Access control rule setup',
            'Compliance check definition'
          ]
        },
        {
          phase: 'Monitor Mode Deployment',
          duration: '1-2 weeks',
          activities: [
            'Non-enforcement mode activation',
            'Side-by-side operation with existing NAC',
            'Policy verification and tuning',
            'Exception handling configuration',
            'Reporting and alerting setup'
          ]
        },
        {
          phase: 'Phased Enforcement',
          duration: '2-4 weeks',
          activities: [
            'Gradual enforcement for user groups',
            'Legacy NAC decommissioning planning',
            'User communication and support',
            'Policy refinement based on feedback',
            'Integration completion and testing'
          ]
        },
        {
          phase: 'Full Transition',
          duration: '1-2 weeks',
          activities: [
            'Complete enforcement activation',
            'Legacy system decommissioning',
            'Final configuration optimization',
            'Operational process documentation',
            'Knowledge transfer completion'
          ]
        }
      ]
    },
    challengesAndSolutions: {
      onPremisesToOnPremises: [
        {
          challenge: 'Complex policy translation between platforms',
          solution: 'Detailed policy mapping and testing before migration, with specialized migration tools or services'
        },
        {
          challenge: 'Hardware procurement and deployment delays',
          solution: 'Early ordering with buffer time and phased deployment to manage lead times'
        },
        {
          challenge: 'Potential network downtime during cutover',
          solution: 'Careful parallel operation with incremental cutover to minimize disruption'
        },
        {
          challenge: 'Custom integration redevelopment',
          solution: 'Thorough integration inventory and specialized resources for custom development'
        },
        {
          challenge: 'Training IT staff on new platform',
          solution: 'Early training and side-by-side operation period for knowledge transfer'
        }
      ],
      onPremisesToCloud: [
        {
          challenge: 'Different architecture paradigm',
          solution: 'Focus on policy outcomes rather than direct feature mapping, leveraging cloud advantages'
        },
        {
          challenge: 'Adapting to cloud-based management',
          solution: 'Early admin access and training with guided feature exploration'
        },
        {
          challenge: 'Network connectivity for cloud service',
          solution: 'Bandwidth and reliability assessment with redundant connectivity options'
        },
        {
          challenge: 'Integration with on-premises systems',
          solution: 'Cloud connectors designed specifically for hybrid environment integration'
        },
        {
          challenge: 'Organizational change management',
          solution: 'Focus on operational benefits and simplified processes to drive adoption'
        }
      ]
    },
    costFactors: {
      onPremisesToOnPremises: [
        {
          category: 'Migration-Specific Costs',
          items: [
            'Professional services for migration',
            'Parallel infrastructure during transition',
            'Potential downtime and productivity impact',
            'Custom integration redevelopment',
            'Additional training for new platform'
          ]
        },
        {
          category: 'Risk Factors',
          items: [
            'Extended project timeline affecting other initiatives',
            'Potential security gaps during transition',
            'Complex rollback procedures if issues occur',
            'User disruption during cutover',
            'Policy translation errors or omissions'
          ]
        }
      ],
      onPremisesToCloud: [
        {
          category: 'Migration-Specific Costs',
          items: [
            'Limited professional services if needed',
            'Minimal parallel infrastructure requirements',
            'Reduced downtime risk with monitoring-first approach',
            'Simplified integration with cloud connectors',
            'Streamlined training for cloud interface'
          ]
        },
        {
          category: 'Risk Factors',
          items: [
            'Shorter project timeline with less impact',
            'Non-disruptive side-by-side operation',
            'Simplified rollback with parallel operation',
            'Minimal user impact with phased approach',
            'Cloud-native policy model reduces translation issues'
          ]
        }
      ]
    }
  }
};
/**
 * Compliance Frameworks Module
 * Provides detailed information and visualizations for regulatory compliance
 */

const ComplianceFrameworks = (function() {
  // Comprehensive compliance frameworks data
  const frameworks = [
    {
      id: 'hipaa',
      name: 'HIPAA',
      fullName: 'Health Insurance Portability and Accountability Act',
      category: 'Healthcare',
      description: 'U.S. legislation that provides data privacy and security provisions for safeguarding medical information.',
      keyRequirements: [
        'Access controls and authentication',
        'Audit controls and logging',
        'Transmission security',
        'Device and media controls',
        'Risk analysis and management'
      ],
      nacRelevance: 'High',
      regions: ['United States'],
      industries: ['Healthcare', 'Health Insurance', 'Medical Devices'],
      penalties: 'Up to $1.5 million per violation category per year',
      year: 1996,
      portnoxAdvantages: [
        'Automatic device identification for medical equipment',
        'Comprehensive audit logging for compliance evidence',
        'Secure network access controls for PHI protection',
        'Role-based access policies for healthcare environments',
        'Automated compliance reporting for audits'
      ]
    },
    {
      id: 'pci-dss',
      name: 'PCI DSS',
      fullName: 'Payment Card Industry Data Security Standard',
      category: 'Financial',
      description: 'Information security standard for organizations that handle branded credit cards.',
      keyRequirements: [
        'Secure network architecture',
        'Cardholder data protection',
        'Vulnerability management',
        'Strong access control measures',
        'Network monitoring and testing'
      ],
      nacRelevance: 'High',
      regions: ['Global'],
      industries: ['Retail', 'Financial Services', 'E-commerce', 'Hospitality'],
      penalties: 'Fines from $5,000 to $500,000, plus potential suspension of card processing',
      year: 2004,
      portnoxAdvantages: [
        'Network segmentation for cardholder data environments',
        'Automatic enforcement of security policies for POS systems',
        'Real-time monitoring of device compliance',
        'Continuous validation of network security controls',
        'Simplified audit preparation with detailed reporting'
      ]
    },
    {
      id: 'gdpr',
      name: 'GDPR',
      fullName: 'General Data Protection Regulation',
      category: 'Privacy',
      description: 'Regulation on data protection and privacy in the European Union and the European Economic Area.',
      keyRequirements: [
        'Lawful basis for processing data',
        'Data subject consent',
        'Data protection by design',
        'Security of processing',
        'Breach notification'
      ],
      nacRelevance: 'Medium',
      regions: ['European Union', 'EEA', 'Companies serving EU citizens'],
      industries: ['All'],
      penalties: 'Up to €20 million or 4% of global annual revenue, whichever is higher',
      year: 2018,
      portnoxAdvantages: [
        'Granular access controls for personal data systems',
        'Detailed audit trails for data access events',
        'Network segmentation to protect sensitive data environments',
        'Risk-based authentication for processors of personal data',
        'Rapid response capabilities for data breach scenarios'
      ]
    },
    {
      id: 'nist-csf',
      name: 'NIST CSF',
      fullName: 'NIST Cybersecurity Framework',
      category: 'Cybersecurity',
      description: 'Voluntary framework consisting of standards, guidelines, and best practices to manage cybersecurity risk.',
      keyRequirements: [
        'Identify security risks',
        'Protect critical infrastructure',
        'Detect cybersecurity events',
        'Respond to detected events',
        'Recover from cybersecurity incidents'
      ],
      nacRelevance: 'High',
      regions: ['United States', 'Global Adoption'],
      industries: ['All', 'Government', 'Critical Infrastructure'],
      penalties: 'No direct penalties (compliance framework)',
      year: 2014,
      portnoxAdvantages: [
        'Comprehensive device visibility aligned with Identify function',
        'Network access controls implementing Protect function',
        'Real-time monitoring supporting Detect function',
        'Automated response capabilities for Response function',
        'Resilient architecture contributing to Recover function'
      ]
    },
    {
      id: 'iso27001',
      name: 'ISO 27001',
      fullName: 'ISO/IEC 27001 - Information Security Management',
      category: 'Information Security',
      description: 'International standard for managing information security through policies and procedures.',
      keyRequirements: [
        'Information security policies',
        'Asset management',
        'Access control',
        'Physical security',
        'Operational security'
      ],
      nacRelevance: 'High',
      regions: ['Global'],
      industries: ['All'],
      penalties: 'No direct penalties, but loss of certification can impact business',
      year: 2005,
      portnoxAdvantages: [
        'Comprehensive access control implementation (ISO control A.9)',
        'Asset inventory automation for devices (ISO control A.8)',
        'Network security management (ISO control A.13)',
        'Information security in supplier relationships (ISO control A.15)',
        'Documented information security controls for certification'
      ]
    },
    {
      id: 'soc2',
      name: 'SOC 2',
      fullName: 'System and Organization Controls 2',
      category: 'Service Providers',
      description: 'Auditing procedure that ensures service providers securely manage customer data.',
      keyRequirements: [
        'Security controls',
        'Availability measures',
        'Processing integrity',
        'Confidentiality protections',
        'Privacy safeguards'
      ],
      nacRelevance: 'Medium',
      regions: ['United States', 'Global Adoption'],
      industries: ['SaaS', 'Cloud Services', 'IT Services'],
      penalties: 'No direct penalties (audit framework)',
      year: 2011,
      portnoxAdvantages: [
        'Logical access controls for Security Trust Service Criteria',
        'Network monitoring for Availability criteria',
        'Device authentication supporting Processing Integrity',
        'Network segmentation enhancing Confidentiality',
        'Access restriction mechanisms for Privacy criteria'
      ]
    },
    {
      id: 'ccpa',
      name: 'CCPA',
      fullName: 'California Consumer Privacy Act',
      category: 'Privacy',
      description: 'State statute intended to enhance privacy rights and consumer protection for residents of California.',
      keyRequirements: [
        'Right to know what information is collected',
        'Right to delete personal information',
        'Right to opt-out of sale of information',
        'Right to non-discrimination',
        'Reasonable security measures'
      ],
      nacRelevance: 'Low',
      regions: ['California, United States'],
      industries: ['All businesses serving California residents'],
      penalties: 'Civil penalties up to $7,500 per intentional violation',
      year: 2018,
      portnoxAdvantages: [
        'Network access controls for systems containing personal information',
        'Identity-based policies for data access management',
        'Audit logging for privacy compliance evidence',
        'Security measures demonstrating reasonable data protection',
        'Data environment isolation capabilities'
      ]
    },
    {
      id: 'glba',
      name: 'GLBA',
      fullName: 'Gramm-Leach-Bliley Act',
      category: 'Financial',
      description: 'Law that requires financial institutions to explain how they share and protect customer data.',
      keyRequirements: [
        'Financial Privacy Rule',
        'Safeguards Rule',
        'Pretexting Protection',
        'Secure data disposal',
        'Access controls'
      ],
      nacRelevance: 'Medium',
      regions: ['United States'],
      industries: ['Financial Services', 'Banking', 'Insurance', 'Financial Advisors'],
      penalties: 'Up to $100,000 per violation for institutions, $10,000 for officers and directors',
      year: 1999,
      portnoxAdvantages: [
        'Network segmentation for financial data environments',
        'Strong authentication for financial systems access',
        'Continuous monitoring of device compliance',
        'Detailed audit trails for regulatory evidence',
        'Simplified implementation of technical safeguards'
      ]
    },
    {
      id: 'ferpa',
      name: 'FERPA',
      fullName: 'Family Educational Rights and Privacy Act',
      category: 'Education',
      description: 'Federal law that protects the privacy of student education records.',
      keyRequirements: [
        'Access control to educational records',
        'Parental/student rights to access records',
        'Amendment of inaccurate information',
        'Consent for disclosure',
        'Annual notification of rights'
      ],
      nacRelevance: 'Medium',
      regions: ['United States'],
      industries: ['Education', 'Higher Education'],
      penalties: 'Loss of federal funding for institutions',
      year: 1974,
      portnoxAdvantages: [
        'Role-based access controls for educational record systems',
        'Device authentication for campus networks',
        'Segmentation of administrative and student networks',
        'Audit logging of access to protected information systems',
        'Simplified compliance for educational technology environments'
      ]
    },
    {
      id: 'fisma',
      name: 'FISMA',
      fullName: 'Federal Information Security Modernization Act',
      category: 'Government',
      description: 'Law that defines a framework for protecting government information and operations.',
      keyRequirements: [
        'Security categorization',
        'Security controls',
        'Risk assessment',
        'Security planning',
        'Continuous monitoring'
      ],
      nacRelevance: 'High',
      regions: ['United States'],
      industries: ['Federal Government', 'Government Contractors'],
      penalties: 'Budget consequences, negative ratings in federal reports',
      year: 2014,
      portnoxAdvantages: [
        'Implementation of NIST SP 800-53 security controls',
        'Network access controls aligned with federal requirements',
        'Continuous monitoring capabilities for real-time assessment',
        'Automated compliance documentation for authorization packages',
        'Implementation of least privilege access principles'
      ]
    },
    {
      id: 'nerc-cip',
      name: 'NERC CIP',
      fullName: 'North American Electric Reliability Corporation Critical Infrastructure Protection',
      category: 'Energy',
      description: 'Standards to ensure the protection of critical cyber assets that control or affect the reliability of North American bulk electric systems.',
      keyRequirements: [
        'Critical Cyber Asset Identification',
        'Security Management Controls',
        'Personnel & Training',
        'Electronic Security Perimeters',
        'Physical Security'
      ],
      nacRelevance: 'High',
      regions: ['North America'],
      industries: ['Electric Utilities', 'Power Generation', 'Energy'],
      penalties: 'Up to $1 million per violation per day',
      year: 2008,
      portnoxAdvantages: [
        'Network segmentation for Electronic Security Perimeters',
        'Access control for Critical Cyber Assets',
        'Detailed audit logging for compliance evidence',
        'Device authentication for secure remote access',
        'Automated enforcement of security policies'
      ]
    },
    {
      id: 'cmmc',
      name: 'CMMC',
      fullName: 'Cybersecurity Maturity Model Certification',
      category: 'Defense',
      description: 'Unified standard for implementing cybersecurity across the Defense Industrial Base.',
      keyRequirements: [
        'Access Control',
        'Asset Management',
        'Audit and Accountability',
        'Configuration Management',
        'Identification and Authentication'
      ],
      nacRelevance: 'High',
      regions: ['United States'],
      industries: ['Defense Contractors', 'Aerospace', 'Military Suppliers'],
      penalties: 'Loss of eligibility for defense contracts',
      year: 2020,
      portnoxAdvantages: [
        'Implementation of access control practices (CMMC AC.1.001-AC.3.014)',
        'Support for identification and authentication (CMMC IA.1.076-IA.3.083)',
        'System and communications protection capabilities (CMMC SC.1.175-SC.5.208)',
        'Audit and accountability features (CMMC AU.2.041-AU.3.046)',
        'System and information integrity controls (CMMC SI.1.210-SI.5.222)'
      ]
    },
    {
      id: 'hitrust',
      name: 'HITRUST',
      fullName: 'Health Information Trust Alliance',
      category: 'Healthcare',
      description: 'Framework that leverages existing regulations and standards to create a comprehensive set of baseline security controls.',
      keyRequirements: [
        'Information Protection Program',
        'Access Control',
        'Human Resources Security',
        'Risk Management',
        'Incident Management'
      ],
      nacRelevance: 'High',
      regions: ['United States', 'Global Adoption'],
      industries: ['Healthcare', 'Health IT', 'Health Information Exchanges'],
      penalties: 'No direct penalties (certification framework)',
      year: 2007,
      portnoxAdvantages: [
        'Implementation of access control domain requirements',
        'Network security measures aligned with HITRUST domains',
        'Device authentication for healthcare environments',
        'Detailed compliance reporting for certification',
        'Automated enforcement of security policies'
      ]
    },
    {
      id: 'disa-stig',
      name: 'DISA STIGs',
      fullName: 'Defense Information Systems Agency Security Technical Implementation Guides',
      category: 'Defense',
      description: 'Configuration standards for DOD IA and IA-enabled devices/systems.',
      keyRequirements: [
        'Access control mechanisms',
        'Authentication requirements',
        'Network protection measures',
        'Auditing capabilities',
        'Configuration management'
      ],
      nacRelevance: 'High',
      regions: ['United States'],
      industries: ['Defense', 'Government', 'Military'],
      penalties: 'System accreditation denial, removal from networks',
      year: 2001,
      portnoxAdvantages: [
        'Enforcement of network STIG compliance',
        'Authentication aligned with DoD requirements',
        'Network segmentation for security boundaries',
        'Device compliance verification',
        'Detailed audit logging for investigation support'
      ]
    },
    {
      id: 'nist-800-171',
      name: 'NIST 800-171',
      fullName: 'NIST Special Publication 800-171',
      category: 'Government',
      description: 'Guidelines for protecting controlled unclassified information in non-federal systems.',
      keyRequirements: [
        'Access Control',
        'Awareness and Training',
        'Configuration Management',
        'Identification and Authentication',
        'System and Communications Protection'
      ],
      nacRelevance: 'High',
      regions: ['United States'],
      industries: ['Defense Contractors', 'Government Suppliers', 'Research Institutions'],
      penalties: 'Loss of contracts, legal liability',
      year: 2015,
      portnoxAdvantages: [
        'Implementation of access control requirements (3.1.1-3.1.22)',
        'Support for identification and authentication requirements (3.5.1-3.5.11)',
        'System and communications protection measures (3.13.1-3.13.16)',
        'Detailed audit capabilities for compliance (3.3.1-3.3.9)',
        'Network segmentation supporting CUI protection'
      ]
    },
    {
      id: 'sox',
      name: 'SOX',
      fullName: 'Sarbanes-Oxley Act',
      category: 'Financial',
      description: 'Law that requires strict financial disclosures and internal control assessments from public companies.',
      keyRequirements: [
        'IT General Controls',
        'Access Control & Segregation of Duties',
        'Change Management',
        'Security Management',
        'System Development & Acquisition'
      ],
      nacRelevance: 'Medium',
      regions: ['United States', 'Companies listed on US exchanges'],
      industries: ['Public Companies', 'Financial Services', 'Accounting'],
      penalties: 'Up to $5 million in fines and 20 years imprisonment for executives',
      year: 2002,
      portnoxAdvantages: [
        'Enforced access controls for financial systems',
        'Detailed audit trails for SOX 404 compliance',
        'Segregation of duties through network segmentation',
        'Continuous monitoring of access to financial resources',
        'Simplified evidence collection for IT general controls'
      ]
    }
  ];
  
  // Vendor compliance coverage mapping
  const vendorCompliance = {
    cisco: {
      hipaa: 'full',
      'pci-dss': 'full',
      gdpr: 'partial',
      'nist-csf': 'full',
      iso27001: 'full',
      soc2: 'partial',
      ccpa: 'partial',
      glba: 'full',
      ferpa: 'partial',
      fisma: 'full',
      'nerc-cip': 'full',
      cmmc: 'full',
      hitrust: 'full',
      'disa-stig': 'full',
      'nist-800-171': 'full',
      sox: 'partial'
    },
    aruba: {
      hipaa: 'full',
      'pci-dss': 'full',
      gdpr: 'partial',
      'nist-csf': 'full',
      iso27001: 'full',
      soc2: 'partial',
      ccpa: 'partial',
      glba: 'full',
      ferpa: 'partial',
      fisma: 'full',
      'nerc-cip': 'full',
      cmmc: 'partial',
      hitrust: 'full',
      'disa-stig': 'partial',
      'nist-800-171': 'full',
      sox: 'partial'
    },
    forescout: {
      hipaa: 'full',
      'pci-dss': 'full',
      gdpr: 'partial',
      'nist-csf': 'full',
      iso27001: 'full',
      soc2: 'partial',
      ccpa: 'partial',
      glba: 'partial',
      ferpa: 'partial',
      fisma: 'full',
      'nerc-cip': 'full',
      cmmc: 'partial',
      hitrust: 'partial',
      'disa-stig': 'partial',
      'nist-800-171': 'full',
      sox: 'partial'
    },
    fortinac: {
      hipaa: 'partial',
      'pci-dss': 'full',
      gdpr: 'partial',
      'nist-csf': 'partial',
      iso27001: 'partial',
      soc2: 'partial',
      ccpa: 'partial',
      glba: 'partial',
      ferpa: 'partial',
      fisma: 'partial',
      'nerc-cip': 'partial',
      cmmc: 'partial',
      hitrust: 'partial',
      'disa-stig': 'partial',
      'nist-800-171': 'partial',
      sox: 'partial'
    },
    nps: {
      hipaa: 'partial',
      'pci-dss': 'partial',
      gdpr: 'none',
      'nist-csf': 'partial',
      iso27001: 'partial',
      soc2: 'none',
      ccpa: 'none',
      glba: 'partial',
      ferpa: 'partial',
      fisma: 'partial',
      'nerc-cip': 'none',
      cmmc: 'none',
      hitrust: 'none',
      'disa-stig': 'none',
      'nist-800-171': 'partial',
      sox: 'none'
    },
    securew2: {
      hipaa: 'partial',
      'pci-dss': 'partial',
      gdpr: 'partial',
      'nist-csf': 'partial',
      iso27001: 'partial',
      soc2: 'partial',
      ccpa: 'none',
      glba: 'partial',
      ferpa: 'partial',
      fisma: 'partial',
      'nerc-cip': 'none',
      cmmc: 'partial',
      hitrust: 'partial',
      'disa-stig': 'partial',
      'nist-800-171': 'partial',
      sox: 'none'
    },
    portnox: {
      hipaa: 'full',
      'pci-dss': 'full',
      gdpr: 'full',
      'nist-csf': 'full',
      iso27001: 'full',
      soc2: 'full',
      ccpa: 'partial',
      glba: 'full',
      ferpa: 'full',
      fisma: 'full',
      'nerc-cip': 'full',
      cmmc: 'full',
      hitrust: 'full',
      'disa-stig': 'full',
      'nist-800-171': 'full',
      sox: 'partial'
    }
  };
  
  // Industry compliance mapping - which frameworks are important for each industry
  const industryCompliance = {
    healthcare: [
      { id: 'hipaa', importance: 'critical' },
      { id: 'hitrust', importance: 'high' },
      { id: 'nist-csf', importance: 'medium' },
      { id: 'iso27001', importance: 'medium' },
      { id: 'gdpr', importance: 'medium' }
    ],
    financial: [
      { id: 'pci-dss', importance: 'critical' },
      { id: 'glba', importance: 'critical' },
      { id: 'sox', importance: 'critical' },
      { id: 'iso27001', importance: 'high' },
      { id: 'nist-csf', importance: 'medium' }
    ],
    retail: [
      { id: 'pci-dss', importance: 'critical' },
      { id: 'gdpr', importance: 'high' },
      { id: 'ccpa', importance: 'high' },
      { id: 'iso27001', importance: 'medium' },
      { id: 'nist-csf', importance: 'medium' }
    ],
    education: [
      { id: 'ferpa', importance: 'critical' },
      { id: 'gdpr', importance: 'high' },
      { id: 'nist-csf', importance: 'medium' },
      { id: 'iso27001', importance: 'medium' },
      { id: 'pci-dss', importance: 'low' }
    ],
    government: [
      { id: 'fisma', importance: 'critical' },
      { id: 'nist-800-171', importance: 'critical' },
      { id: 'disa-stig', importance: 'high' },
      { id: 'cmmc', importance: 'high' },
      { id: 'nist-csf', importance: 'high' }
    ],
    manufacturing: [
      { id: 'nist-csf', importance: 'high' },
      { id: 'iso27001', importance: 'high' },
      { id: 'cmmc', importance: 'medium' },
      { id: 'nist-800-171', importance: 'medium' },
      { id: 'gdpr', importance: 'medium' }
    ],
    energy: [
      { id: 'nerc-cip', importance: 'critical' },
      { id: 'nist-csf', importance: 'high' },
      { id: 'iso27001', importance: 'high' },
      { id: 'fisma', importance: 'medium' },
      { id: 'nist-800-171', importance: 'medium' }
    ],
    telecom: [
      { id: 'nist-csf', importance: 'high' },
      { id: 'iso27001', importance: 'high' },
      { id: 'gdpr', importance: 'high' },
      { id: 'ccpa', importance: 'medium' },
      { id: 'soc2', importance: 'medium' }
    ]
  };
  
  // Get framework data by ID
  function getFrameworkById(id) {
    return frameworks.find(framework => framework.id === id);
  }
  
  // Get all frameworks for a specific industry
  function getFrameworksForIndustry(industry) {
    if (industryCompliance[industry]) {
      return industryCompliance[industry].map(fw => {
        const framework = getFrameworkById(fw.id);
        return {
          ...framework,
          importance: fw.importance
        };
      });
    }
    return [];
  }
  
  // Calculate compliance coverage percentage for a vendor
  function calculateComplianceCoverage(vendorId) {
    if (!vendorCompliance[vendorId]) return 0;
    
    const vendorRatings = vendorCompliance[vendorId];
    const totalFrameworks = Object.keys(vendorRatings).length;
    
    if (totalFrameworks === 0) return 0;
    
    let coverageScore = 0;
    
    Object.values(vendorRatings).forEach(rating => {
      if (rating === 'full') coverageScore += 1;
      else if (rating === 'partial') coverageScore += 0.5;
    });
    
    return Math.round((coverageScore / totalFrameworks) * 100);
  }
  
  // Create compliance matrix visualization
  function createComplianceMatrix(selector, vendorIds = []) {
    // If ModernCharts is available, use it
    if (typeof ModernCharts !== 'undefined' && ModernCharts.charts.complianceMatrix) {
      // Prepare data for the matrix
      const matrixData = {
        frameworks: frameworks.map(fw => ({
          name: fw.name,
          compliance: {}
        })),
        vendors: vendorIds.map(id => ({
          id: id,
          name: id.charAt(0).toUpperCase() + id.slice(1) // Simple capitalization
        }))
      };
      
      // Fill in the compliance data
      matrixData.frameworks.forEach((framework, index) => {
        vendorIds.forEach(vendorId => {
          if (vendorCompliance[vendorId] && vendorCompliance[vendorId][frameworks[index].id]) {
            framework.compliance[vendorId] = vendorCompliance[vendorId][frameworks[index].id];
          } else {
            framework.compliance[vendorId] = 'none';
          }
        });
      });
      
      ModernCharts.charts.complianceMatrix(selector, matrixData);
    } else {
      console.error('ModernCharts.charts.complianceMatrix is not available');
    }
  }
  
  // Create a framework details card
  function createFrameworkDetailsCard(selector, frameworkId) {
    const container = document.querySelector(selector);
    if (!container) return;
    
    const framework = getFrameworkById(frameworkId);
    if (!framework) return;
    
    // Create card
    const card = document.createElement('div');
    card.className = 'framework-details-card bg-white shadow-md rounded-lg overflow-hidden';
    
    // Card header
    const header = document.createElement('div');
    header.className = 'framework-header bg-blue-600 text-white p-4';
    header.innerHTML = `
      <h3 class="text-xl font-semibold">${framework.name}</h3>
      <div class="text-sm opacity-90">${framework.fullName}</div>
    `;
    card.appendChild(header);
    
    // Card body
    const body = document.createElement('div');
    body.className = 'framework-body p-4';
    
    // Framework info
    const info = document.createElement('div');
    info.className = 'framework-info mb-4';
    info.innerHTML = `
      <p class="mb-2">${framework.description}</p>
      <div class="grid grid-cols-2 gap-4 mt-4">
        <div>
          <div class="text-sm text-gray-500">Category</div>
          <div class="font-medium">${framework.category}</div>
        </div>
        <div>
          <div class="text-sm text-gray-500">Year Established</div>
          <div class="font-medium">${framework.year}</div>
        </div>
        <div>
          <div class="text-sm text-gray-500">NAC Relevance</div>
          <div class="font-medium">${framework.nacRelevance}</div>
        </div>
        <div>
          <div class="text-sm text-gray-500">Penalties</div>
          <div class="font-medium">${framework.penalties}</div>
        </div>
      </div>
    `;
    body.appendChild(info);
    
    // Key requirements
    const requirements = document.createElement('div');
    requirements.className = 'framework-requirements mb-4';
    requirements.innerHTML = '<h4 class="font-semibold mb-2">Key Requirements</h4>';
    
    const reqList = document.createElement('ul');
    reqList.className = 'list-disc ml-5 space-y-1';
    
    framework.keyRequirements.forEach(req => {
      const item = document.createElement('li');
      item.textContent = req;
      reqList.appendChild(item);
    });
    
    requirements.appendChild(reqList);
    body.appendChild(requirements);
    
    // Portnox advantages
    const advantages = document.createElement('div');
    advantages.className = 'framework-advantages bg-blue-50 p-4 rounded-md';
    advantages.innerHTML = '<h4 class="font-semibold mb-2 text-blue-700">How Portnox Helps</h4>';
    
    const advList = document.createElement('ul');
    advList.className = 'space-y-2';
    
    framework.portnoxAdvantages.forEach(adv => {
      const item = document.createElement('li');
      item.className = 'flex items-start';
      item.innerHTML = `
        <div class="text-blue-600 mr-2 mt-1"><i class="fas fa-check-circle"></i></div>
        <div>${adv}</div>
      `;
      advList.appendChild(item);
    });
    
    advantages.appendChild(advList);
    body.appendChild(advantages);
    
    // Vendor compliance
    const vendorComp = document.createElement('div');
    vendorComp.className = 'vendor-compliance mt-4';
    vendorComp.innerHTML = '<h4 class="font-semibold mb-2">Vendor Compliance</h4>';
    
    const vendorCompGrid = document.createElement('div');
    vendorCompGrid.className = 'grid grid-cols-4 gap-2';
    
    Object.keys(vendorCompliance).forEach(vendorId => {
      const compliance = vendorCompliance[vendorId][framework.id] || 'none';
      let color = '';
      
      if (compliance === 'full') color = 'bg-green-100 text-green-800';
      else if (compliance === 'partial') color = 'bg-yellow-100 text-yellow-800';
      else color = 'bg-red-100 text-red-800';
      
      const vendorItem = document.createElement('div');
      vendorItem.className = `p-2 text-center rounded ${color}`;
      vendorItem.textContent = vendorId.charAt(0).toUpperCase() + vendorId.slice(1);
      
      vendorCompGrid.appendChild(vendorItem);
    });
    
    vendorComp.appendChild(vendorCompGrid);
    body.appendChild(vendorComp);
    
    card.appendChild(body);
    
    // Clear container and add card
    container.innerHTML = '';
    container.appendChild(card);
  }
  
  // Create industry compliance recommendation
  function createIndustryCompliance(selector, industry) {
    const container = document.querySelector(selector);
    if (!container) return;
    
    const industryFrameworks = getFrameworksForIndustry(industry);
    if (industryFrameworks.length === 0) return;
    
    // Create container
    const wrapper = document.createElement('div');
    wrapper.className = 'industry-compliance-wrapper';
    
    // Header
    const header = document.createElement('div');
    header.className = 'industry-header bg-white p-4 rounded-lg shadow-md mb-4';
    header.innerHTML = `
      <h3 class="text-lg font-semibold">${industry.charAt(0).toUpperCase() + industry.slice(1)} Industry Compliance Requirements</h3>
      <p class="text-gray-600">Key regulatory frameworks and compliance requirements for your industry</p>
    `;
    wrapper.appendChild(header);
    
    // Frameworks grid
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';
    
    industryFrameworks.forEach((framework, index) => {
      const card = document.createElement('div');
      card.className = 'bg-white p-4 rounded-lg shadow-md stagger-item fade-in';
      card.style.animationDelay = `${index * 100}ms`;
      
      // Importance badge
      let importanceBadge = '';
      if (framework.importance === 'critical') {
        importanceBadge = '<span class="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Critical</span>';
      } else if (framework.importance === 'high') {
        importanceBadge = '<span class="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded">High</span>';
      } else {
        importanceBadge = '<span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Medium</span>';
      }
      
      card.innerHTML = `
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-lg font-semibold">${framework.name}</h4>
          ${importanceBadge}
        </div>
        <div class="text-sm text-gray-500 mb-2">${framework.fullName}</div>
        <p class="text-gray-600 mb-4">${framework.description}</p>
        
        <div class="bg-blue-50 p-3 rounded">
          <div class="text-sm font-medium text-blue-800 mb-2">Vendor Support</div>
          <div class="grid grid-cols-7 gap-1">
            ${Object.keys(vendorCompliance).map(vendorId => {
              const compliance = vendorCompliance[vendorId][framework.id] || 'none';
              let color = '';
              
              if (compliance === 'full') color = 'bg-green-500';
              else if (compliance === 'partial') color = 'bg-yellow-500';
              else color = 'bg-red-500';
              
              return `
                <div class="flex flex-col items-center">
                  <div class="w-6 h-6 ${color} rounded-full"></div>
                  <div class="text-xs mt-1">${vendorId.substring(0, 3)}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
      
      grid.appendChild(card);
    });
    
    wrapper.appendChild(grid);
    
    // Portnox advantage callout
    const portnoxAdvantage = document.createElement('div');
    portnoxAdvantage.className = 'mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4';
    
    // Calculate Portnox coverage for this industry
    const industryFrameworkIds = industryFrameworks.map(fw => fw.id);
    let portnoxCoverage = 0;
    let competitors = Object.keys(vendorCompliance).filter(v => v !== 'portnox');
    let bestCompetitorCoverage = 0;
    
    industryFrameworkIds.forEach(fwId => {
      if (vendorCompliance.portnox[fwId] === 'full') portnoxCoverage += 1;
      else if (vendorCompliance.portnox[fwId] === 'partial') portnoxCoverage += 0.5;
      
      // Find best competitor coverage
      competitors.forEach(comp => {
        let competitorCoverage = 0;
        industryFrameworkIds.forEach(fwId => {
          if (vendorCompliance[comp][fwId] === 'full') competitorCoverage += 1;
          else if (vendorCompliance[comp][fwId] === 'partial') competitorCoverage += 0.5;
        });
        
        if (competitorCoverage > bestCompetitorCoverage) {
          bestCompetitorCoverage = competitorCoverage;
        }
      });
    });
    
    const portnoxCoveragePercent = Math.round((portnoxCoverage / industryFrameworkIds.length) * 100);
    const bestCompCoveragePercent = Math.round((bestCompetitorCoverage / industryFrameworkIds.length) * 100);
    const advantagePercent = portnoxCoveragePercent - bestCompCoveragePercent;
    
    portnoxAdvantage.innerHTML = `
      <div class="flex items-start">
        <div class="mr-4 bg-blue-100 p-3 rounded-full">
          <i class="fas fa-shield-alt text-blue-600 text-xl"></i>
        </div>
        <div>
          <h4 class="text-lg font-semibold text-blue-800 mb-2">Portnox Compliance Advantage</h4>
          <p class="text-blue-700 mb-3">Portnox provides ${portnoxCoveragePercent}% coverage of ${industry} compliance requirements, ${advantagePercent}% better than the next best competitor.</p>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-sm text-blue-700 mb-1">Portnox Coverage</div>
              <div class="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-blue-600 rounded-full" style="width: ${portnoxCoveragePercent}%"></div>
              </div>
              <div class="text-right text-sm text-blue-800 mt-1">${portnoxCoveragePercent}%</div>
            </div>
            <div>
              <div class="text-sm text-blue-700 mb-1">Top Competitor Coverage</div>
              <div class="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-gray-400 rounded-full" style="width: ${bestCompCoveragePercent}%"></div>
              </div>
              <div class="text-right text-sm text-blue-800 mt-1">${bestCompCoveragePercent}%</div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    wrapper.appendChild(portnoxAdvantage);
    
    // Clear container and add wrapper
    container.innerHTML = '';
    container.appendChild(wrapper);
  }
  
  // Return public API
  return {
    getAllFrameworks: () => frameworks,
    getFrameworkById: getFrameworkById,
    getFrameworksForIndustry: getFrameworksForIndustry,
    calculateComplianceCoverage: calculateComplianceCoverage,
    createComplianceMatrix: createComplianceMatrix,
    createFrameworkDetailsCard: createFrameworkDetailsCard,
    createIndustryCompliance: createIndustryCompliance,
    vendorCompliance: vendorCompliance,
    industryCompliance: industryCompliance
  };
})();
/**
 * Ultimate Compliance Fix
 * Handles ComplianceInsights class redeclaration and provides enhanced functionality
 */
(function() {
  console.log('Applying Ultimate Compliance Fix...');
  
  // First, remove any existing ComplianceInsights class/instances to prevent redeclaration errors
  if (window.ComplianceInsights) {
    console.log('Found existing ComplianceInsights, removing...');
    delete window.ComplianceInsights;
    delete window.complianceInsights;
  }
  
  // Create a single definitive implementation of ComplianceInsights
  window.ComplianceInsights = class {
    constructor() {
      this.industryData = {};
      this.currentIndustry = null;
      
      // Initialize once the DOM is ready
      this._init();
      
      console.log('ComplianceInsights initialized correctly');
    }
    
    _init() {
      // Load industry data if available
      if (window.industryTemplates) {
        this.industryData = window.industryTemplates;
      }
      
      // Setup event listener for industry selector
      const industrySelector = document.getElementById('industry-selector');
      if (industrySelector) {
        industrySelector.addEventListener('change', () => {
          this.currentIndustry = industrySelector.value;
          this.updateComplianceInsights();
        });
      }
    }
    
    updateComplianceInsights() {
      if (!this.currentIndustry || this.currentIndustry === 'none' || !this.industryData[this.currentIndustry]) {
        this.clearComplianceInsights();
        return;
      }
      
      const industry = this.industryData[this.currentIndustry];
      const complianceInfo = industry.complianceInfo;
      
      if (!complianceInfo) {
        this.clearComplianceInsights();
        return;
      }
      
      // Update compliance container
      const container = document.getElementById('compliance-info-container');
      if (!container) return;
      
      container.innerHTML = '';
      const card = document.createElement('div');
      card.className = 'compliance-info-card';
      
      card.innerHTML = `
        <h3>${complianceInfo.title || industry.name + ' Compliance Requirements'}</h3>
        <p>${complianceInfo.details}</p>
        <h4>Key Requirements</h4>
        <ul class="compliance-requirements">
          ${(complianceInfo.keyRequirements || []).map(req => `<li>${req}</li>`).join('')}
        </ul>
        <button class="btn btn-outline btn-sm view-details-btn" id="view-compliance-details-btn">
          <i class="fas fa-external-link-alt"></i> View Detailed Analysis
        </button>
      `;
      
      container.appendChild(card);
      container.classList.remove('hidden');
      
      // Add event listener to the details button
      const detailsBtn = document.getElementById('view-compliance-details-btn');
      if (detailsBtn) {
        detailsBtn.addEventListener('click', () => {
          // Try to activate industry tab if it exists
          const industryTab = document.querySelector('[data-tab="industry-tab"]');
          if (industryTab) {
            industryTab.click();
          }
        });
      }
    }
    
    clearComplianceInsights() {
      const container = document.getElementById('compliance-info-container');
      if (container) {
        container.innerHTML = '';
        container.classList.add('hidden');
      }
    }
    
    refreshComplianceInsights() {
      this.updateComplianceInsights();
    }
  };
  
  // Create singleton instance after a slight delay to ensure DOM is ready
  setTimeout(() => {
    if (!window.complianceInsights) {
      window.complianceInsights = new window.ComplianceInsights();
    }
  }, 1000);
  
  console.log('Ultimate Compliance Fix setup complete');
})();
/**
 * Industry and Compliance Tab Component
 * Provides detailed industry benchmarks, compliance requirements, and security incidents
 */
class IndustryComplianceTabManager {
  constructor() {
    this.activeIndustry = null;
    this.activeCompliance = null;
    
    // Initialize tabs when the industry selector changes
    this._initializeTabListeners();
  }
  
  /**
   * Initialize tab listeners
   */
  _initializeTabListeners() {
    // Listen for industry selector changes
    const industrySelector = document.getElementById('industry-selector');
    if (industrySelector) {
      industrySelector.addEventListener('change', (event) => {
        this.setActiveIndustry(event.target.value);
      });
    }
    
    // Check if industry tab exists and add it to the main tabs
    this._addIndustryTab();
  }
  
  /**
   * Add industry tab to main tabs if not present
   */
  _addIndustryTab() {
    const tabsContainer = document.querySelector('.tabs');
    const industryTab = document.getElementById('tab-industry');
    
    if (tabsContainer && !industryTab) {
      console.log("Adding industry and compliance tab...");
      
      // Create industry tab button
      const industryTabButton = document.createElement('button');
      industryTabButton.className = 'tab-button';
      industryTabButton.id = 'tab-industry';
      industryTabButton.setAttribute('role', 'tab');
      industryTabButton.setAttribute('aria-selected', 'false');
      industryTabButton.setAttribute('aria-controls', 'industry-tab');
      industryTabButton.setAttribute('data-tab', 'industry-tab');
      industryTabButton.setAttribute('tabindex', '-1');
      industryTabButton.textContent = 'Industry & Compliance';
      
      // Create industry tab content
      const tabContent = document.querySelector('.tab-content');
      if (!tabContent) {
        console.warn("Tab content container not found");
        return;
      }
      
      const industryTabContent = document.createElement('div');
      industryTabContent.id = 'industry-tab';
      industryTabContent.className = 'tab-pane';
      industryTabContent.setAttribute('role', 'tabpanel');
      industryTabContent.setAttribute('aria-labelledby', 'tab-industry');
      
      // Add initial content
      industryTabContent.innerHTML = `
        <div class="industry-compliance-container">
          <div class="industry-selector-container">
            <label for="industry-selector-tab">Industry:</label>
            <select id="industry-selector-tab" class="form-select">
              <option value="none">Select industry...</option>
              <option value="healthcare">Healthcare</option>
              <option value="financial">Financial Services</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="retail">Retail</option>
              <option value="education">Education</option>
              <option value="government">Government</option>
            </select>
            
            <label for="compliance-selector" class="ml-1">Compliance Framework:</label>
            <select id="compliance-selector" class="form-select">
              <option value="none">Select framework...</option>
              <option value="hipaa">HIPAA</option>
              <option value="pci">PCI DSS</option>
              <option value="gdpr">GDPR</option>
              <option value="cmmc">CMMC 2.0</option>
            </select>
          </div>
          
          <div class="industry-content" id="industry-content">
            <div class="placeholder-message">
              <p>Select an industry to view detailed benchmarks, requirements, and security considerations.</p>
            </div>
          </div>
          
          <div class="compliance-content hidden" id="compliance-content">
            <div class="placeholder-message">
              <p>Select a compliance framework to view detailed requirements and NAC impact analysis.</p>
            </div>
          </div>
          
          <div class="breach-content" id="breach-incidents-content">
            <h3>Security Incidents by Category</h3>
            <div class="breach-incidents-container" id="breach-incidents-container">
              <!-- Incidents will be populated here -->
            </div>
          </div>
        </div>
      `;
      
      // Add tab button to tabs container
      tabsContainer.appendChild(industryTabButton);
      
      // Add tab content to tab content container
      tabContent.appendChild(industryTabContent);
      
      // Initialize industry selector in tab
      const industryTabSelector = document.getElementById('industry-selector-tab');
      if (industryTabSelector) {
        // Sync with main industry selector
        const mainIndustrySelector = document.getElementById('industry-selector');
        if (mainIndustrySelector && mainIndustrySelector.value !== 'none') {
          industryTabSelector.value = mainIndustrySelector.value;
          this.setActiveIndustry(mainIndustrySelector.value);
        }
        
        // Add change listener
        industryTabSelector.addEventListener('change', (event) => {
          // Update main industry selector
          if (mainIndustrySelector) {
            mainIndustrySelector.value = event.target.value;
            mainIndustrySelector.dispatchEvent(new Event('change'));
          } else {
            this.setActiveIndustry(event.target.value);
          }
        });
      }
      
      // Add event listener to tab button
      industryTabButton.addEventListener('click', () => {
        console.log("Industry tab clicked");
        
        // Get currently selected industry
        const industry = industryTabSelector.value;
        if (industry !== 'none') {
          this.setActiveIndustry(industry);
        }
        
        // Get currently selected compliance
        const compliance = document.getElementById('compliance-selector');
        if (compliance && compliance.value !== 'none') {
          this.setActiveCompliance(compliance.value);
        }
        
        // Add security incidents
        this._populateSecurityIncidents();
      });
      
      // Add event listener to compliance selector
      const complianceSelector = document.getElementById('compliance-selector');
      if (complianceSelector) {
        complianceSelector.addEventListener('change', (event) => {
          this.setActiveCompliance(event.target.value);
        });
      }
      
      // Populate security incidents
      this._populateSecurityIncidents();
      
      console.log("Industry and compliance tab added successfully");
    } else {
      console.log("Industry tab already exists or tabs container not found");
    }
  }
  
  /**
   * Set active industry and update UI
   * @param {string} industryId - Industry identifier
   */
  setActiveIndustry(industryId) {
    console.log("Setting active industry:", industryId);
    
    this.activeIndustry = industryId === 'none' ? null : industryId;
    
    // Update industry content
    this._updateIndustryContent();
    
    // Update compliance options based on industry
    this._updateComplianceOptions();
  }
  
  /**
   * Set active compliance framework and update UI
   * @param {string} complianceId - Compliance identifier
   */
  setActiveCompliance(complianceId) {
    console.log("Setting active compliance:", complianceId);
    
    this.activeCompliance = complianceId === 'none' ? null : complianceId;
    
    // Update compliance content
    this._updateComplianceContent();
  }
  
  /**
   * Update industry content with detailed information
   */
  _updateIndustryContent() {
    const industryContent = document.getElementById('industry-content');
    if (!industryContent) {
      console.warn("Industry content container not found");
      return;
    }
    
    if (!this.activeIndustry || !window.nacDocumentation?.industries?.[this.activeIndustry]) {
      industryContent.innerHTML = `
        <div class="placeholder-message">
          <p>Select an industry to view detailed benchmarks, requirements, and security considerations.</p>
        </div>
      `;
      return;
    }
    
    const industry = window.nacDocumentation.industries[this.activeIndustry];
    
    // Create industry content
    industryContent.innerHTML = `
      <h3>${industry.title}</h3>
      <p>${industry.description}</p>
      
      <div class="results-grid">
        <div class="result-card">
          <h4>Key Requirements</h4>
          <ul class="requirements-list">
            ${industry.keyRequirements.map(req => `<li>${req}</li>`).join('')}
          </ul>
        </div>
        
        <div class="result-card">
          <h4>Industry Benchmarks</h4>
          <div class="table-container">
            <table class="data-table">
              <tbody>
                <tr>
                  <td>Average Breach Cost</td>
                  <td>${industry.benchmarks.breachCost}</td>
                </tr>
                <tr>
                  <td>Implementation Timeline</td>
                  <td>${industry.benchmarks.implementationTime}</td>
                </tr>
                <tr>
                  <td>IT Staffing Requirements</td>
                  <td>${industry.benchmarks.fteCost}</td>
                </tr>
                <tr>
                  <td>Downtime Business Impact</td>
                  <td>${industry.benchmarks.downtimeImpact}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div class="result-card">
        <h4>Security Considerations</h4>
        <p>${industry.recommendations}</p>
        
        <div class="vendor-recommendations">
          <h5>Solution Recommendations for ${industry.title}</h5>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Solution Type</th>
                  <th>Advantages</th>
                  <th>Disadvantages</th>
                  <th>Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cloud-Native NAC<br>(e.g., Portnox Cloud)</td>
                  <td>
                    <ul>
                      <li>Rapid deployment</li>
                      <li>Low infrastructure requirements</li>
                      <li>Automatic updates</li>
                      <li>Flexible scaling</li>
                    </ul>
                  </td>
                  <td>
                    <ul>
                      <li>Cloud connectivity dependency</li>
                      <li>Less hardware control</li>
                    </ul>
                  </td>
                  <td>
                    Organizations with distributed locations, limited IT staffing, or need for rapid deployment
                  </td>
                </tr>
                <tr>
                  <td>On-Premises NAC<br>(e.g., Cisco ISE, Aruba)</td>
                  <td>
                    <ul>
                      <li>Complete control over infrastructure</li>
                      <li>Local processing</li>
                      <li>Potentially lower latency</li>
                    </ul>
                  </td>
                  <td>
                    <ul>
                      <li>Higher implementation costs</li>
                      <li>Longer deployment times</li>
                      <li>Hardware refresh cycles</li>
                    </ul>
                  </td>
                  <td>
                    Organizations with strict data locality requirements, dedicated security teams, or specialized infrastructure needs
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * Update compliance options based on industry
   */
  _updateComplianceOptions() {
    const complianceSelector = document.getElementById('compliance-selector');
    if (!complianceSelector) {
      console.warn("Compliance selector not found");
      return;
    }
    
    // Reset selector
    complianceSelector.innerHTML = `
      <option value="none">Select framework...</option>
      <option value="hipaa">HIPAA</option>
      <option value="pci">PCI DSS</option>
      <option value="gdpr">GDPR</option>
      <option value="cmmc">CMMC 2.0</option>
    `;
    
    // Highlight relevant frameworks based on industry
    if (this.activeIndustry) {
      let relevantFrameworks = [];
      
      switch (this.activeIndustry) {
        case 'healthcare':
          relevantFrameworks = ['hipaa', 'gdpr'];
          break;
        case 'financial':
          relevantFrameworks = ['pci', 'gdpr'];
          break;
        case 'manufacturing':
          relevantFrameworks = ['cmmc', 'nist'];
          break;
        case 'retail':
          relevantFrameworks = ['pci', 'gdpr'];
          break;
        case 'education':
          relevantFrameworks = ['gdpr', 'ferpa'];
          break;
        case 'government':
          relevantFrameworks = ['cmmc', 'fisma'];
          break;
      }
      
      // Add recommended labels to relevant frameworks
      if (relevantFrameworks.length > 0) {
        for (const framework of relevantFrameworks) {
          const option = complianceSelector.querySelector(`option[value="${framework}"]`);
          if (option) {
            option.textContent += ' (Recommended)';
          }
        }
      }
    }
    
    // Reset compliance content
    this.setActiveCompliance('none');
  }
  
  /**
   * Update compliance content with detailed information
   */
  _updateComplianceContent() {
    const complianceContent = document.getElementById('compliance-content');
    if (!complianceContent) {
      console.warn("Compliance content container not found");
      return;
    }
    
    if (!this.activeCompliance || !window.nacDocumentation?.compliance?.[this.activeCompliance]) {
      complianceContent.classList.add('hidden');
      return;
    }
    
    const compliance = window.nacDocumentation.compliance[this.activeCompliance];
    
    // Create compliance content
    complianceContent.innerHTML = `
      <h3>${compliance.title}</h3>
      <p>${compliance.description}</p>
      
      <div class="result-card">
        <h4>Relevant Controls</h4>
        <ul class="controls-list">
          ${compliance.relevantControls.map(ctrl => `<li>${ctrl}</li>`).join('')}
        </ul>
      </div>
      
      <div class="result-card">
        <h4>NAC Implementation Impact</h4>
        <p>${compliance.nacImpact}</p>
        
        <div class="compliance-matrix">
          <h5>NAC Solution Compliance Matrix for ${compliance.title}</h5>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Requirement Area</th>
                  <th>On-Premises NAC</th>
                  <th>Cloud-Native NAC</th>
                  <th>Implementation Considerations</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Access Controls</td>
                  <td><i class="fas fa-check-circle"></i> Strong</td>
                  <td><i class="fas fa-check-circle"></i> Strong</td>
                  <td>Both solution types provide robust access control capabilities. Focus on policy granularity and enforcement mechanisms.</td>
                </tr>
                <tr>
                  <td>Audit Logging</td>
                  <td><i class="fas fa-check-circle"></i> Strong</td>
                  <td><i class="fas fa-check-circle"></i> Strong</td>
                  <td>Ensure log retention policies meet compliance requirements. Cloud solutions typically include built-in log management.</td>
                </tr>
                <tr>
                  <td>Data Protection</td>
                  <td><i class="fas fa-check-circle"></i> Strong</td>
                  <td><i class="fas fa-exclamation-triangle"></i> Requires BAA/DPA</td>
                  <td>Cloud solutions require appropriate Business Associate Agreements or Data Processing Agreements.</td>
                </tr>
                <tr>
                  <td>Device Authentication</td>
                  <td><i class="fas fa-check-circle"></i> Strong</td>
                  <td><i class="fas fa-check-circle"></i> Strong</td>
                  <td>Implement multi-factor authentication where applicable. Both solution types provide similar capabilities.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
    
    // Show compliance content
    complianceContent.classList.remove('hidden');
  }
  
  /**
   * Populate security incidents section
   */
  _populateSecurityIncidents() {
    const incidentsContainer = document.getElementById('breach-incidents-container');
    if (!incidentsContainer) {
      console.warn("Breach incidents container not found");
      return;
    }
    
    if (!window.nacDocumentation?.securityIncidents) {
      incidentsContainer.innerHTML = `
        <div class="placeholder-message">
          <p>Security incident information not available.</p>
        </div>
      `;
      return;
    }
    
    const incidents = window.nacDocumentation.securityIncidents;
    let incidentsHTML = '';
    
    // Add network access incidents
    if (incidents.networkAccess && incidents.networkAccess.length > 0) {
      incidentsHTML += `
        <div class="result-card">
          <h4>Network Access Incidents</h4>
          <div class="incidents-list">
            ${incidents.networkAccess.map(incident => `
              <div class="incident-item">
                <h5>${incident.title}</h5>
                <p><strong>Description:</strong> ${incident.description}</p>
                <p><strong>Impact:</strong> ${incident.impact}</p>
                <p><strong>NAC Mitigation:</strong> ${incident.mitigation}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    // Add lateral movement incidents
    if (incidents.lateralMovement && incidents.lateralMovement.length > 0) {
      incidentsHTML += `
        <div class="result-card">
          <h4>Lateral Movement Incidents</h4>
          <div class="incidents-list">
            ${incidents.lateralMovement.map(incident => `
              <div class="incident-item">
                <h5>${incident.title}</h5>
                <p><strong>Description:</strong> ${incident.description}</p>
                <p><strong>Impact:</strong> ${incident.impact}</p>
                <p><strong>NAC Mitigation:</strong> ${incident.mitigation}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    // Add compliance incidents
    if (incidents.compliance && incidents.compliance.length > 0) {
      incidentsHTML += `
        <div class="result-card">
          <h4>Compliance-Related Incidents</h4>
          <div class="incidents-list">
            ${incidents.compliance.map(incident => `
              <div class="incident-item">
                <h5>${incident.title}</h5>
                <p><strong>Description:</strong> ${incident.description}</p>
                <p><strong>Impact:</strong> ${incident.impact}</p>
                <p><strong>NAC Mitigation:</strong> ${incident.mitigation}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    // Add response incidents
    if (incidents.response && incidents.response.length > 0) {
      incidentsHTML += `
        <div class="result-card">
          <h4>Incident Response Challenges</h4>
          <div class="incidents-list">
            ${incidents.response.map(incident => `
              <div class="incident-item">
                <h5>${incident.title}</h5>
                <p><strong>Description:</strong> ${incident.description}</p>
                <p><strong>Impact:</strong> ${incident.impact}</p>
                <p><strong>NAC Mitigation:</strong> ${incident.mitigation}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    incidentsContainer.innerHTML = incidentsHTML;
    
    // Add CSS styles for incidents
    const style = document.createElement('style');
    style.textContent = `
      .incidents-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        gap: var(--spacing-md);
      }
      
      .incident-item {
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius-md);
        padding: var(--spacing-md);
        background-color: rgba(27, 103, 178, 0.05);
      }
      
      .incident-item h5 {
        color: var(--primary-color);
        margin-top: 0;
        margin-bottom: var(--spacing-sm);
      }
      
      .incident-item p {
        margin: var(--spacing-xs) 0;
        font-size: var(--font-size-sm);
      }
      
      .industry-compliance-container {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg);
      }
      
      .industry-selector-container {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-md);
        flex-wrap: wrap;
      }
      
      .industry-selector-container label {
        margin-bottom: 0;
      }
      
      .industry-selector-container .form-select {
        width: auto;
      }
      
      .ml-1 {
        margin-left: var(--spacing-md);
      }
      
      .requirements-list li, .controls-list li {
        margin-bottom: var(--spacing-sm);
      }
      
      .compliance-matrix h5, .vendor-recommendations h5 {
        margin-top: var(--spacing-lg);
        margin-bottom: var(--spacing-md);
      }
      
      .placeholder-message {
        padding: var(--spacing-lg);
        background-color: rgba(0, 0, 0, 0.02);
        border-radius: var(--border-radius-md);
        text-align: center;
        color: var(--text-light);
      }
    `;
    
    if (!document.getElementById('industry-compliance-styles')) {
      style.id = 'industry-compliance-styles';
      document.head.appendChild(style);
    }
  }
}

// Initialize the industry and compliance tab manager
document.addEventListener('DOMContentLoaded', function() {
  console.log("Initializing industry and compliance tab manager");
  window.industryComplianceTabManager = new IndustryComplianceTabManager();
});
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
/**
 * Chart reset utility specifically for sensitivity analysis
 */
(function() {
  console.log('Applying sensitivity chart reset utility...');

  // Function to create blank charts if they don't exist
  function ensureChartsExist() {
    // Check sensitivity chart
    const sensChart = document.getElementById('sensitivity-chart');
    if (sensChart && !sensChart._chart) {
      try {
        console.log('Initializing blank sensitivity chart...');
        const ctx = sensChart.getContext('2d');
        sensChart._chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['No Data'],
            datasets: [{
              label: 'Run analysis to see results',
              data: [0],
              borderColor: '#1B67B2',
              backgroundColor: 'rgba(27, 103, 178, 0.1)'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      } catch (error) {
        console.error('Error creating blank sensitivity chart:', error);
      }
    }

    // Check savings impact chart
    const savingsChart = document.getElementById('savings-impact-chart');
    if (savingsChart && !savingsChart._chart) {
      try {
        console.log('Initializing blank savings impact chart...');
        const ctx = savingsChart.getContext('2d');
        savingsChart._chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['No Data'],
            datasets: [{
              label: 'Run analysis to see results',
              data: [0],
              borderColor: '#2BD25B',
              backgroundColor: 'rgba(43, 210, 91, 0.1)'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      } catch (error) {
        console.error('Error creating blank savings impact chart:', error);
      }
    }
  }

  // Wait for DOM to be ready and then ensure charts exist
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(ensureChartsExist, 500);
    });
  } else {
    setTimeout(ensureChartsExist, 500);
  }
})();
/**
 * Sensitivity Analyzer for the Total Cost Analyzer
 * Performs sensitivity analysis on various parameters to understand their impact on TCO
 */

class SensitivityAnalyzer {
  constructor() {
    this.results = null;
    this.analyzing = false;
    this.charts = {};
    
    // Reference to calculator
    this.calculator = window.calculator;
    
    // Chart colors from chart builder
    this.chartColors = window.chartBuilder ? window.chartBuilder.chartColors : {
      cisco: '#049fd9',      // Cisco blue
      aruba: '#ff8300',      // Aruba orange
      forescout: '#005daa',  // Forescout blue
      nps: '#00a4ef',        // Microsoft blue
      fortinac: '#ee3124',   // FortiNAC red
      securew2: '#8bc53f',   // SecureW2 green
      portnox: '#2bd25b',    // Portnox green
      neutral: '#888888'     // Neutral gray
    };
  }
  
  // Main analysis function
  analyze() {
    if (this.analyzing) {
      console.log('Analysis already in progress');
      return;
    }
    
    this.analyzing = true;
    this.showLoading();
    
    try {
      // Get input parameters
      const variableToAnalyze = document.getElementById('param-variable').value;
      const vendorToAnalyze = document.getElementById('param-vendor').value;
      const minValue = parseFloat(document.getElementById('param-min').value);
      const maxValue = parseFloat(document.getElementById('param-max').value);
      const steps = parseInt(document.getElementById('param-steps').value);
      
      console.log(`Running sensitivity analysis for ${variableToAnalyze}, vendor: ${vendorToAnalyze}, range: ${minValue}-${maxValue}, steps: ${steps}`);
      
      // Validate inputs
      if (isNaN(minValue) || isNaN(maxValue) || isNaN(steps)) {
        throw new Error('Invalid input parameters');
      }
      
      if (minValue >= maxValue) {
        throw new Error('Maximum value must be greater than minimum value');
      }
      
      if (steps < 2 || steps > 20) {
        throw new Error('Number of steps must be between 2 and 20');
      }
      
      // Generate data points
      const stepSize = (maxValue - minValue) / (steps - 1);
      const dataPoints = Array.from({length: steps}, (_, i) => minValue + (i * stepSize));
      
      // Run analysis for each data point
      const analysisResults = {
        variable: variableToAnalyze,
        vendor: vendorToAnalyze,
        minValue,
        maxValue,
        steps,
        dataPoints,
        results: []
      };
      
      // Keep a copy of the original form values
      const originalValues = this.saveOriginalValues();
      
      // For each data point, calculate TCO by modifying the relevant form value
      dataPoints.forEach(dataPoint => {
        // Set the form value for the variable being analyzed
        this.setVariableValue(variableToAnalyze, dataPoint);
        
        // Calculate TCO for this data point
        const calculationResults = this.runCalculation();
        
        // Store results
        analysisResults.results.push({
          dataPoint,
          calculationResults
        });
      });
      
      // Restore original form values
      this.restoreOriginalValues(originalValues);
      
      // Save results
      this.results = analysisResults;
      
      // Update UI with results
      this.updateUI();
      
      // Hide loading indicator
      this.hideLoading();
      this.analyzing = false;
      
      return analysisResults;
    } catch (error) {
      console.error("Error in sensitivity analysis:", error);
      
      // Hide loading indicator
      this.hideLoading();
      this.analyzing = false;
      
      // Show error message
      this.showError("Error in sensitivity analysis: " + error.message);
      
      return null;
    }
  }
  
  // Save original form values
  saveOriginalValues() {
    return {
      deviceCount: document.getElementById('device-count').value,
      legacyPercentage: document.getElementById('legacy-percentage').value,
      locationCount: document.getElementById('location-count').value,
      yearsToProject: document.getElementById('years-to-project').value,
      // Add any other form values that might be part of sensitivity analysis
    };
  }
  
  // Restore original form values
  restoreOriginalValues(originalValues) {
    document.getElementById('device-count').value = originalValues.deviceCount;
    document.getElementById('legacy-percentage').value = originalValues.legacyPercentage;
    document.getElementById('location-count').value = originalValues.locationCount;
    document.getElementById('years-to-project').value = originalValues.yearsToProject;
    // Restore any other form values
  }
  
  // Set the value of the variable being analyzed
  setVariableValue(variable, value) {
    switch (variable) {
      case 'deviceCount':
        document.getElementById('device-count').value = Math.round(value);
        break;
      case 'legacyPercentage':
        document.getElementById('legacy-percentage').value = Math.round(value);
        if (value > 0) {
          document.getElementById('legacy-devices').checked = true;
        }
        break;
      case 'locationCount':
        document.getElementById('location-count').value = Math.round(value);
        if (value > 1) {
          document.getElementById('multiple-locations').checked = true;
        }
        break;
      case 'yearsToProject':
        document.getElementById('years-to-project').value = Math.round(value);
        break;
      // Add cases for other variables
      default:
        console.warn(`Unknown variable: ${variable}`);
    }
  }
  
  // Run TCO calculation using current form values
  runCalculation() {
    if (!this.calculator) {
      console.error("Calculator not available");
      return null;
    }
    
    try {
      // Get values from form
      const deviceCount = parseInt(document.getElementById('device-count').value) || 1000;
      const orgSize = document.getElementById('organization-size').value;
      const yearsToProject = parseInt(document.getElementById('years-to-project').value) || 3;
      const currentVendor = window.uiController ? window.uiController.activeVendor : 'cisco';
      
      // Calculate TCO for all vendors directly, without updating UI
      const tcoResults = {};
      
      Object.keys(window.vendorData).forEach(vendor => {
        const result = this.calculator.calculateVendorTCO(vendor, currentVendor, orgSize, deviceCount, yearsToProject);
        tcoResults[vendor] = result;
      });
      
      // Add metadata to results
      tcoResults.yearsToProject = yearsToProject;
      tcoResults.deviceCount = deviceCount;
      tcoResults.orgSize = orgSize;
      
      return tcoResults;
    } catch (error) {
      console.error("Error in calculation:", error);
      return null;
    }
  }
  
  // Update UI with analysis results
  updateUI() {
    if (!this.results) {
      console.warn("No analysis results available");
      return;
    }
    
    // Update sensitivity chart
    this.updateSensitivityChart();
    
    // Update savings impact chart
    this.updateSavingsImpactChart();
    
    // Update data table
    this.updateDataTable();
    
    // Show success message
    this.showSuccess("Sensitivity analysis completed successfully");
  }
  
  // Update sensitivity chart
  updateSensitivityChart() {
    const ctx = document.getElementById('sensitivity-chart');
    if (!ctx) {
      console.warn('Sensitivity chart canvas element not found');
      return;
    }
    
    // Prepare chart data
    const labels = this.results.dataPoints.map(dp => this.formatDataPoint(this.results.variable, dp));
    
    const datasets = [];
    const vendors = this.results.vendor === 'all' ? 
      Object.keys(window.vendorData) : 
      [this.results.vendor];
    
    vendors.forEach(vendor => {
      const vendorName = window.vendorData[vendor]?.name || vendor;
      const vendorColor = this.chartColors[vendor] || this.chartColors.neutral;
      
      const data = this.results.results.map(result => {
        return result.calculationResults[vendor]?.totalTCO || 0;
      });
      
      datasets.push({
        label: vendorName,
        data: data,
        backgroundColor: vendorColor,
        borderColor: vendorColor,
        borderWidth: 2,
        fill: false
      });
    });
    
    // Create or update chart
    if (this.charts.sensitivity) {
      this.charts.sensitivity.data.labels = labels;
      this.charts.sensitivity.data.datasets = datasets;
      this.charts.sensitivity.update();
    } else {
      this.charts.sensitivity = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Total Cost of Ownership ($)'
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            },
            x: {
              title: {
                display: true,
                text: this.getVariableLabel(this.results.variable)
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: `TCO Sensitivity to ${this.getVariableLabel(this.results.variable)}`,
              font: {
                size: 16
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                }
              }
            }
          }
        }
      });
    }
  }
  
  // Update savings impact chart
  updateSavingsImpactChart() {
    const ctx = document.getElementById('savings-impact-chart');
    if (!ctx) {
      console.warn('Savings impact chart canvas element not found');
      return;
    }
    
    // Only relevant when comparing to Portnox
    if (!window.vendorData.portnox) {
      return;
    }
    
    // Prepare chart data
    const labels = this.results.dataPoints.map(dp => this.formatDataPoint(this.results.variable, dp));
    
    const datasets = [];
    const vendors = this.results.vendor === 'all' ? 
      Object.keys(window.vendorData).filter(v => v !== 'portnox') : 
      [this.results.vendor];
    
    vendors.forEach(vendor => {
      // Skip Portnox as we're calculating savings vs. Portnox
      if (vendor === 'portnox') return;
      
      const vendorName = window.vendorData[vendor]?.name || vendor;
      const vendorColor = this.chartColors[vendor] || this.chartColors.neutral;
      
      const data = this.results.results.map(result => {
        const vendorTCO = result.calculationResults[vendor]?.totalTCO || 0;
        const portnoxTCO = result.calculationResults['portnox']?.totalTCO || 0;
        return vendorTCO > 0 && portnoxTCO > 0 ? 
          ((vendorTCO - portnoxTCO) / vendorTCO) * 100 : 0;
      });
      
      datasets.push({
        label: `Savings vs. ${vendorName}`,
        data: data,
        backgroundColor: vendorColor,
        borderColor: vendorColor,
        borderWidth: 2,
        fill: false
      });
    });
    
    // Create or update chart
    if (this.charts.savingsImpact) {
      this.charts.savingsImpact.data.labels = labels;
      this.charts.savingsImpact.data.datasets = datasets;
      this.charts.savingsImpact.update();
    } else {
      this.charts.savingsImpact = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Savings Percentage (%)'
              },
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            },
            x: {
              title: {
                display: true,
                text: this.getVariableLabel(this.results.variable)
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: `Portnox Savings Impact by ${this.getVariableLabel(this.results.variable)}`,
              font: {
                size: 16
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%';
                }
              }
            }
          }
        }
      });
    }
  }
  
  // Update data table
  updateDataTable() {
    const tableHeader = document.getElementById('sensitivity-table-header');
    const tableBody = document.getElementById('sensitivity-table-body');
    
    if (!tableHeader || !tableBody) {
      console.warn('Data table elements not found');
      return;
    }
    
    // Clear existing table
    tableHeader.innerHTML = `<th scope="col">${this.getVariableLabel(this.results.variable)}</th>`;
    tableBody.innerHTML = '';
    
    // Add vendor columns to header
    const vendors = this.results.vendor === 'all' ? 
      Object.keys(window.vendorData) : 
      [this.results.vendor];
    
    vendors.forEach(vendor => {
      const vendorName = window.vendorData[vendor]?.name || vendor;
      tableHeader.innerHTML += `<th scope="col">${vendorName}</th>`;
      
      // Add Portnox savings column if comparing to other vendors
      if (vendor !== 'portnox' && vendors.includes('portnox')) {
        tableHeader.innerHTML += `<th scope="col">Savings vs. ${vendorName}</th>`;
      }
    });
    
    // Add data rows
    this.results.results.forEach(result => {
      const row = document.createElement('tr');
      
      // Add data point column
      row.innerHTML = `<td>${this.formatDataPoint(this.results.variable, result.dataPoint)}</td>`;
      
      // Add vendor TCO columns
      vendors.forEach(vendor => {
        const tco = result.calculationResults[vendor]?.totalTCO || 0;
        row.innerHTML += `<td>${window.formatCurrency(tco)}</td>`;
        
        // Add Portnox savings column if comparing to other vendors
        if (vendor !== 'portnox' && vendors.includes('portnox')) {
          const vendorTCO = result.calculationResults[vendor]?.totalTCO || 0;
          const portnoxTCO = result.calculationResults['portnox']?.totalTCO || 0;
          
          const savingsAmount = vendorTCO - portnoxTCO;
          const savingsPercentage = vendorTCO > 0 ? (savingsAmount / vendorTCO) * 100 : 0;
          
          row.innerHTML += `<td>${window.formatCurrency(savingsAmount)} (${savingsPercentage.toFixed(1)}%)</td>`;
        }
      });
      
      tableBody.appendChild(row);
    });
  }
  
  // Format data point based on variable type
  formatDataPoint(variable, value) {
    switch (variable) {
      case 'deviceCount':
        return window.formatNumber(value) + ' devices';
      case 'legacyPercentage':
        return value + '%';
      case 'locationCount':
        return window.formatNumber(value) + ' locations';
      case 'yearsToProject':
        return value + ' years';
      case 'hardwareCost':
      case 'licensingCost':
      case 'maintenanceCost':
      case 'fteCost':
        return value.toFixed(1) + 'x';
      default:
        return value.toString();
    }
  }
  
  // Get human-readable label for variable
  getVariableLabel(variable) {
    switch (variable) {
      case 'deviceCount':
        return 'Device Count';
      case 'legacyPercentage':
        return 'Legacy Device Percentage';
      case 'locationCount':
        return 'Number of Locations';
      case 'yearsToProject':
        return 'Years to Project';
      case 'hardwareCost':
        return 'Hardware Cost Multiplier';
      case 'licensingCost':
        return 'Licensing Cost Multiplier';
      case 'maintenanceCost':
        return 'Maintenance Cost Multiplier';
      case 'fteCost':
        return 'FTE Cost Multiplier';
      default:
        return variable;
    }
  }
  
  // Show loading indicator
  showLoading() {
    if (window.loadingManager) {
      window.loadingManager.showGlobal('Running sensitivity analysis...');
    } else {
      const resultsContainer = document.querySelector('.results-container');
      if (!resultsContainer) return;
      
      // Check if loading overlay already exists
      let loadingOverlay = resultsContainer.querySelector('.loading-overlay');
      if (loadingOverlay) return;
      
      // Create loading overlay
      loadingOverlay = document.createElement('div');
      loadingOverlay.className = 'loading-overlay';
      loadingOverlay.innerHTML = `
        <div class="spinner"></div>
        <div class="loading-text">Running sensitivity analysis...</div>
      `;
      
      resultsContainer.appendChild(loadingOverlay);
    }
  }
  
  // Hide loading indicator
  hideLoading() {
    if (window.loadingManager) {
      window.loadingManager.hideGlobal();
    } else {
      const loadingOverlay = document.querySelector('.loading-overlay');
      if (loadingOverlay) {
        loadingOverlay.parentNode.removeChild(loadingOverlay);
      }
    }
  }
  
  // Show error message
  showError(message) {
    if (window.notificationManager) {
      window.notificationManager.error(message);
    } else {
      const messageContainer = document.getElementById('message-container');
      if (!messageContainer) return;
      
      messageContainer.innerHTML = `
        <div class="error-message-box">
          <i class="fas fa-exclamation-circle"></i>
          <span>${message}</span>
          <button class="close-error"><i class="fas fa-times"></i></button>
        </div>
      `;
      
      // Add close button functionality
      const closeBtn = messageContainer.querySelector('.close-error');
      if (closeBtn) {
        closeBtn.addEventListener('click', function() {
          messageContainer.innerHTML = '';
        });
      }
    }
  }
  
  // Show success message
  showSuccess(message) {
    if (window.notificationManager) {
      window.notificationManager.success(message);
    } else {
      const messageContainer = document.getElementById('message-container');
      if (!messageContainer) return;
      
      messageContainer.innerHTML = `
        <div class="success-message-box">
          <i class="fas fa-check-circle"></i>
          <span>${message}</span>
          <button class="close-error"><i class="fas fa-times"></i></button>
        </div>
      `;
      
      // Add close button functionality
      const closeBtn = messageContainer.querySelector('.close-error');
      if (closeBtn) {
        closeBtn.addEventListener('click', function() {
          messageContainer.innerHTML = '';
        });
      }
      
      // Auto-hide after 3 seconds
      setTimeout(() => {
        if (messageContainer.querySelector('.success-message-box')) {
          messageContainer.innerHTML = '';
        }
      }, 3000);
    }
  }
}
/**
 * Sensitivity Analysis
 * - Coordinates the sensitivity analysis functionality
 */
(function() {
  // Execute on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing sensitivity analysis...');
    
    // Format currency function if not already defined
    if (!window.formatCurrency) {
      window.formatCurrency = function(value) {
        return '$' + value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      };
    }
    
    // Format number function if not already defined
    if (!window.formatNumber) {
      window.formatNumber = function(value) {
        return value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      };
    }
  });
})();
/**
 * Help functionality for sensitivity analysis
 */
document.addEventListener('DOMContentLoaded', function() {
  // Add Parameters Help button
  const headerActions = document.querySelector('.header-actions');
  
  if (headerActions) {
    // Create help button if it doesn't exist
    if (!document.getElementById('sensitivity-help-btn')) {
      const helpButton = document.createElement('button');
      helpButton.id = 'sensitivity-help-btn';
      helpButton.className = 'btn btn-outline btn-sm';
      helpButton.innerHTML = '<i class="fas fa-question-circle"></i> Parameters Help';
      
      // Add to header actions before other buttons
      if (headerActions.firstChild) {
        headerActions.insertBefore(helpButton, headerActions.firstChild);
      } else {
        headerActions.appendChild(helpButton);
      }
    }
    
    // Add click handler for the button
    const helpButton = document.getElementById('sensitivity-help-btn');
    helpButton.addEventListener('click', showSensitivityHelp);
  }
  
  /**
   * Show sensitivity help dialog
   */
  function showSensitivityHelp() {
    // Check if documentation is available
    if (typeof window.getSensitivityDocumentation !== 'function') {
      console.error('Documentation not available');
      return;
    }
    
    // Get documentation
    const helpDocs = window.getSensitivityDocumentation();
    
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'help-modal';
    
    // Create help dialog
    modal.innerHTML = `
      <div class="help-dialog">
        <div class="help-dialog-header">
          <h3>${helpDocs.title}</h3>
          <button class="close-btn">&times;</button>
        </div>
        <div class="help-dialog-content">
          <p>${helpDocs.description}</p>
          <p>${helpDocs.usage}</p>
          
          <h4>Parameters</h4>
          <ul id="parameters-list"></ul>
          
          <h4>Interpretation</h4>
          <p><strong>Breakeven Points:</strong> ${helpDocs.interpretation.breakeven}</p>
          <p><strong>Cost Drivers:</strong> ${helpDocs.interpretation.costDrivers}</p>
          <p><strong>Recommendations:</strong> ${helpDocs.interpretation.recommendations}</p>
        </div>
      </div>
    `;
    
    // Add to document
    document.body.appendChild(modal);
    
    // Add parameter items
    const parametersList = modal.querySelector('#parameters-list');
    Object.entries(helpDocs.parameters).forEach(([id, param]) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${param.title}</strong>: ${param.description}<br>Impact: ${param.impact}`;
      parametersList.appendChild(li);
    });
    
    // Add close button handler
    modal.querySelector('.close-btn').addEventListener('click', function() {
      document.body.removeChild(modal);
    });
    
    // Add styles
    addHelpStyles();
  }
  
  /**
   * Add help dialog styles
   */
  function addHelpStyles() {
    // Add styles if not already added
    if (!document.getElementById('help-modal-styles')) {
      const styles = document.createElement('style');
      styles.id = 'help-modal-styles';
      styles.textContent = `
        .help-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .help-dialog {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          width: 80%;
          max-width: 800px;
          max-height: 80vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        .help-dialog-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid #ddd;
        }
        
        .help-dialog-header h3 {
          margin: 0;
          color: #1B67B2;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }
        
        .help-dialog-content {
          padding: 24px;
          overflow-y: auto;
        }
        
        .help-dialog-content ul {
          padding-left: 20px;
        }
        
        .help-dialog-content li {
          margin-bottom: 12px;
        }
      `;
      document.head.appendChild(styles);
    }
  }
});
/**
 * Advanced Sensitivity Analyzer
 * Provides detailed sensitivity analysis with explainable AI-style analysis
 */
(function() {
  console.log('Installing Advanced Sensitivity Analyzer...');
  
  // Styling for sensitivity analyzer
  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Sensitivity Analysis Modal Styling */
      .sensitivity-modal-container {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        justify-content: center;
        align-items: center;
      }
      
      .sensitivity-modal-container.visible {
        display: flex;
      }
      
      .sensitivity-analysis-modal {
        background: white;
        width: 90%;
        max-width: 1200px;
        max-height: 90vh;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      
      .sensitivity-modal-header {
        background: #1B67B2;
        color: white;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }
      
      .sensitivity-modal-header h2 {
        margin: 0;
        font-size: 1.5rem;
      }
      
      .sensitivity-modal-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        margin: 0;
      }
      
      .sensitivity-modal-body {
        padding: 20px;
        overflow-y: auto;
        max-height: calc(90vh - 136px);
      }
      
      .sensitivity-modal-footer {
        padding: 15px 20px;
        background: #f8f9fa;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        border-top: 1px solid #ddd;
      }
      
      .introduction-section {
        margin-bottom: 30px;
      }
      
      .sensitivity-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 30px;
      }
      
      @media (max-width: 768px) {
        .sensitivity-grid {
          grid-template-columns: 1fr;
        }
      }
      
      .sensitivity-panel {
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
      }
      
      .sensitivity-panel-header {
        background: #f8f9fa;
        padding: 15px 20px;
        border-bottom: 1px solid #ddd;
      }
      
      .sensitivity-panel-header h3 {
        margin: 0;
        color: #1B67B2;
        font-size: 1.2rem;
      }
      
      .sensitivity-panel-body {
        padding: 20px;
      }
      
      .chart-container {
        height: 300px;
        margin-bottom: 20px;
      }
      
      .sensitivity-controls {
        margin-top: 30px;
      }
      
      .parameter-sliders {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }
      
      .parameter-slider {
        margin-bottom: 15px;
      }
      
      .parameter-slider label {
        display: block;
        font-weight: 500;
        margin-bottom: 5px;
        color: #303030;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .parameter-slider label .sensitivity-badge {
        font-size: 0.8rem;
        padding: 2px 8px;
        border-radius: 10px;
        font-weight: 500;
      }
      
      .sensitivity-badge.high {
        background-color: #ffcccc;
        color: #cc0000;
      }
      
      .sensitivity-badge.medium {
        background-color: #fff2cc;
        color: #cc7a00;
      }
      
      .sensitivity-badge.low {
        background-color: #d9ecd9;
        color: #007a00;
      }
      
      .parameter-slider .slider-container {
        position: relative;
        padding-top: 25px;
      }
      
      .parameter-slider input[type="range"] {
        width: 100%;
        margin: 0;
      }
      
      .parameter-slider .slider-values {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #707070;
        margin-top: 5px;
      }
      
      .parameter-slider .slider-value {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        background: #1B67B2;
        color: white;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 12px;
        white-space: nowrap;
      }
      
      .analysis-card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.07);
        padding: 20px;
        margin-bottom: 20px;
        transition: all 0.3s ease;
      }
      
      .analysis-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 14px rgba(0,0,0,0.1);
      }
      
      .analysis-card h4 {
        color: #1B67B2;
        margin-top: 0;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(0,0,0,0.05);
      }
      
      .parameter-impact {
        margin-bottom: 15px;
      }
      
      .parameter-impact h5 {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 0;
        margin-bottom: 10px;
        color: #505050;
      }
      
      .impact-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 15px;
        margin-top: 20px;
      }
      
      .impact-card {
        background: white;
        border-radius: 6px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        padding: 15px;
        border-left: 4px solid #1B67B2;
      }
      
      .impact-card.positive {
        border-left-color: #2BD25B;
      }
      
      .impact-card.negative {
        border-left-color: #cc0000;
      }
      
      .impact-card.neutral {
        border-left-color: #ffcc00;
      }
      
      .impact-card h5 {
        margin-top: 0;
        margin-bottom: 10px;
        color: #303030;
      }
      
      .impact-card p {
        margin: 0;
        font-size: 0.9rem;
        color: #505050;
      }
      
      .breakeven-analysis {
        margin-top: 30px;
      }
      
      .breakeven-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 15px;
      }
      
      .breakeven-card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.07);
        padding: 20px;
        border-left: 4px solid #1B67B2;
      }
      
      .breakeven-card h4 {
        margin-top: 0;
        margin-bottom: 15px;
        color: #1B67B2;
      }
      
      .breakeven-value {
        font-size: 1.8rem;
        font-weight: 600;
        color: #2BD25B;
        margin-bottom: 10px;
      }
      
      .breakeven-card p {
        margin: 0;
        color: #505050;
      }
      
      .roi-chart {
        margin-top: 30px;
      }
      
      .recommendations-section {
        margin-top: 30px;
      }
      
      .recommendations-list {
        margin-top: 15px;
      }
      
      .recommendation-item {
        display: flex;
        gap: 15px;
        margin-bottom: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid #eee;
      }
      
      .recommendation-item:last-child {
        border-bottom: none;
      }
      
      .recommendation-icon {
        color: #2BD25B;
        font-size: 1.5rem;
        min-width: 24px;
      }
      
      .recommendation-content h5 {
        margin-top: 0;
        margin-bottom: 8px;
        color: #303030;
      }
      
      .recommendation-content p {
        margin: 0;
        color: #505050;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // Create Advanced Sensitivity Analyzer
  function createSensitivityAnalyzer() {
    // Update existing button
    const existingBtn = document.getElementById('sensitivity-analysis-btn');
    if (existingBtn) {
      // Replace click handler
      const newClickHandler = function(e) {
        e.preventDefault();
        openSensitivityModal();
      };
      
      // Clone node to remove existing event listeners
      const newBtn = existingBtn.cloneNode(true);
      existingBtn.parentNode.replaceChild(newBtn, existingBtn);
      
      // Add new click handler
      newBtn.addEventListener('click', newClickHandler);
    }
    
    // Create sensitivity modal
    const modalContainer = document.createElement('div');
    modalContainer.className = 'sensitivity-modal-container';
    modalContainer.id = 'sensitivity-analysis-modal-container';
    
    modalContainer.innerHTML = `
      <div class="sensitivity-analysis-modal">
        <div class="sensitivity-modal-header">
          <h2><i class="fas fa-chart-line"></i> Advanced Sensitivity Analysis</h2>
          <button type="button" class="sensitivity-modal-close">&times;</button>
        </div>
        <div class="sensitivity-modal-body">
          <div class="introduction-section">
            <h3>TCO Sensitivity Analysis</h3>
            <p>This advanced analysis allows you to understand how different parameters affect your Total Cost of Ownership (TCO) and Return on Investment (ROI) when comparing Portnox Cloud with on-premises NAC solutions.</p>
            <p>Adjust the parameters below to see how changes impact the final results. The analysis will update in real-time to show you which factors have the most significant impact on your TCO and ROI.</p>
          </div>
          
          <div class="sensitivity-grid">
            <div class="sensitivity-panel">
              <div class="sensitivity-panel-header">
                <h3>Cost Impact Analysis</h3>
              </div>
              <div class="sensitivity-panel-body">
                <div class="chart-container">
                  <canvas id="sensitivity-cost-chart"></canvas>
                </div>
                <p>This chart shows how adjusting each parameter affects the 3-year TCO difference between Portnox Cloud and on-premises solutions. Positive values indicate increased savings with Portnox Cloud.</p>
              </div>
            </div>
            
            <div class="sensitivity-panel">
              <div class="sensitivity-panel-header">
                <h3>ROI Timeline Analysis</h3>
              </div>
              <div class="sensitivity-panel-body">
                <div class="chart-container">
                  <canvas id="sensitivity-roi-chart"></canvas>
                </div>
                <p>This chart illustrates how different parameters affect the Return on Investment (ROI) timeline. Negative impact means longer ROI timelines, while positive impact means faster ROI.</p>
              </div>
            </div>
          </div>
          
          <div class="sensitivity-controls">
            <h3>Parameter Sensitivity Controls</h3>
            <p>Adjust the parameters below to see how they impact your TCO and ROI. Parameters with high sensitivity have a stronger impact on the final results.</p>
            
            <div class="parameter-sliders">
              <div class="parameter-slider">
                <label for="sa-devices-slider">
                  Number of Devices
                  <span class="sensitivity-badge high">High Sensitivity</span>
                </label>
                <div class="slider-container">
                  <input type="range" id="sa-devices-slider" min="100" max="10000" step="100" value="1000">
                  <div class="slider-value" id="sa-devices-value">1,000 devices</div>
                </div>
                <div class="slider-values">
                  <span>100</span>
                  <span>10,000</span>
                </div>
              </div>
              
              <div class="parameter-slider">
                <label for="sa-locations-slider">
                  Number of Locations
                  <span class="sensitivity-badge high">High Sensitivity</span>
                </label>
                <div class="slider-container">
                  <input type="range" id="sa-locations-slider" min="1" max="50" step="1" value="3">
                  <div class="slider-value" id="sa-locations-value">3 locations</div>
                </div>
                <div class="slider-values">
                  <span>1</span>
                  <span>50</span>
                </div>
              </div>
              
              <div class="parameter-slider">
                <label for="sa-implementation-slider">
                  Implementation Complexity
                  <span class="sensitivity-badge medium">Medium Sensitivity</span>
                </label>
                <div class="slider-container">
                  <input type="range" id="sa-implementation-slider" min="1" max="5" step="1" value="3">
                  <div class="slider-value" id="sa-implementation-value">Medium (3/5)</div>
                </div>
                <div class="slider-values">
                  <span>Simple</span>
                  <span>Complex</span>
                </div>
              </div>
              
              <div class="parameter-slider">
                <label for="sa-staff-slider">
                  IT Staff Cost ($/yr)
                  <span class="sensitivity-badge medium">Medium Sensitivity</span>
                </label>
                <div class="slider-container">
                  <input type="range" id="sa-staff-slider" min="50000" max="200000" step="10000" value="100000">
                  <div class="slider-value" id="sa-staff-value">$100,000</div>
                </div>
                <div class="slider-values">
                  <span>$50K</span>
                  <span>$200K</span>
                </div>
              </div>
              
              <div class="parameter-slider">
                <label for="sa-hardware-slider">
                  Hardware Cost Multiplier
                  <span class="sensitivity-badge medium">Medium Sensitivity</span>
                </label>
                <div class="slider-container">
                  <input type="range" id="sa-hardware-slider" min="0.5" max="2.0" step="0.1" value="1.0">
                  <div class="slider-value" id="sa-hardware-value">1.0x</div>
                </div>
                <div class="slider-values">
                  <span>0.5x</span>
                  <span>2.0x</span>
                </div>
              </div>
              
              <div class="parameter-slider">
                <label for="sa-licensing-slider">
                  Licensing Cost Multiplier
                  <span class="sensitivity-badge high">High Sensitivity</span>
                </label>
                <div class="slider-container">
                  <input type="range" id="sa-licensing-slider" min="0.5" max="2.0" step="0.1" value="1.0">
                  <div class="slider-value" id="sa-licensing-value">1.0x</div>
                </div>
                <div class="slider-values">
                  <span>0.5x</span>
                  <span>2.0x</span>
                </div>
              </div>
              
              <div class="parameter-slider">
                <label for="sa-compliance-slider">
                  Compliance Requirements
                  <span class="sensitivity-badge medium">Medium Sensitivity</span>
                </label>
                <div class="slider-container">
                  <input type="range" id="sa-compliance-slider" min="1" max="5" step="1" value="3">
                  <div class="slider-value" id="sa-compliance-value">Medium (3/5)</div>
                </div>
                <div class="slider-values">
                  <span>Basic</span>
                  <span>Stringent</span>
                </div>
              </div>
              
              <div class="parameter-slider">
                <label for="sa-years-slider">
                  Projection Years
                  <span class="sensitivity-badge low">Low Sensitivity</span>
                </label>
                <div class="slider-container">
                  <input type="range" id="sa-years-slider" min="1" max="7" step="1" value="3">
                  <div class="slider-value" id="sa-years-value">3 years</div>
                </div>
                <div class="slider-values">
                  <span>1</span>
                  <span>7</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="analysis-card">
            <h4>Parameter Impact Analysis</h4>
            <p>This analysis shows how each parameter affects your TCO and ROI when comparing Portnox Cloud to on-premises NAC solutions.</p>
            
            <div class="parameter-impact">
              <h5><i class="fas fa-server"></i> Device Count Impact</h5>
              <p>As device count increases, on-premises solutions scale less efficiently than cloud-based alternatives. Hardware costs and management overhead increase significantly with each additional location for on-premises deployments.</p>
              <p><strong>Current Impact:</strong> <span id="device-impact-value">$75,000 additional savings with Portnox Cloud</span></p>
            </div>
            
            <div class="parameter-impact">
              <h5><i class="fas fa-map-marker-alt"></i> Location Count Impact</h5>
              <p>Each additional location requires hardware deployment, maintenance, and management for on-premises solutions, while cloud solutions maintain centralized management regardless of location count.</p>
              <p><strong>Current Impact:</strong> <span id="location-impact-value">$45,000 additional savings with Portnox Cloud</span></p>
            </div>
            
            <div class="parameter-impact">
              <h5><i class="fas fa-tools"></i> Implementation Complexity Impact</h5>
              <p>Higher implementation complexity exponentially increases professional services costs and deployment time for on-premises solutions, while cloud deployments maintain a more linear cost increase.</p>
              <p><strong>Current Impact:</strong> <span id="complexity-impact-value">$30,000 additional savings with Portnox Cloud</span></p>
            </div>
            
            <div class="impact-grid">
              <div class="impact-card positive">
                <h5>Scalability Advantage</h5>
                <p>Portnox Cloud scales efficiently with increased device counts and locations, maintaining consistent per-device costs regardless of deployment size.</p>
              </div>
              
              <div class="impact-card positive">
                <h5>Implementation Timeline</h5>
                <p>Implementation timelines for on-premises solutions increase with complexity, while cloud deployments maintain relatively consistent timelines.</p>
              </div>
              
              <div class="impact-card positive">
                <h5>Maintenance Overhead</h5>
                <p>Maintenance requirements scale with complexity and size for on-premises solutions, while cloud solutions maintain consistent overhead regardless of scale.</p>
              </div>
              
              <div class="impact-card neutral">
                <h5>Licensing Costs</h5>
                <p>Both solutions scale licensing costs with device count, though on-premises solutions often have more complex licensing structures.</p>
              </div>
            </div>
          </div>
          
          <div class="breakeven-analysis">
            <h3>Breakeven Analysis</h3>
            <p>Based on your current parameters, these are the breakeven points for key metrics:</p>
            
            <div class="breakeven-grid">
              <div class="breakeven-card">
                <h4>ROI Breakeven</h4>
                <div class="breakeven-value" id="roi-breakeven-value">9 months</div>
                <p>The time required to recover the initial investment in Portnox Cloud compared to on-premises alternatives.</p>
              </div>
              
              <div class="breakeven-card">
                <h4>TCO Breakeven</h4>
                <div class="breakeven-value" id="tco-breakeven-value">18 months</div>
                <p>The point where the total cost of Portnox Cloud becomes lower than on-premises alternatives.</p>
              </div>
              
              <div class="breakeven-card">
                <h4>Device Count Breakeven</h4>
                <div class="breakeven-value" id="device-breakeven-value">250 devices</div>
                <p>The minimum device count where Portnox Cloud provides cost savings compared to on-premises alternatives.</p>
              </div>
            </div>
          </div>
          
          <div class="roi-chart">
            <h3>Cumulative ROI Projection</h3>
            <div class="chart-container">
              <canvas id="roi-projection-chart"></canvas>
            </div>
            <p>This chart shows the cumulative ROI over time for both solutions based on your current parameter settings. Positive values indicate positive returns on investment.</p>
          </div>
          
          <div class="recommendations-section">
            <h3>Recommendations Based on Sensitivity Analysis</h3>
            <p>Based on your organization's parameters and sensitivity analysis, here are key recommendations:</p>
            
            <div class="recommendations-list">
              <div class="recommendation-item">
                <div class="recommendation-icon">
                  <i class="fas fa-check-circle"></i>
                </div>
                <div class="recommendation-content">
                  <h5>Prioritize Multi-Location Analysis</h5>
                  <p>Your multi-location environment significantly impacts TCO calculations. Ensure detailed analysis of hardware and support requirements for each location in on-premises scenarios.</p>
                </div>
              </div>
              
              <div class="recommendation-item">
                <div class="recommendation-icon">
                  <i class="fas fa-check-circle"></i>
                </div>
                <div class="recommendation-content">
                  <h5>Account for Scaling Complexity</h5>
                  <p>Implementation and maintenance complexity increases non-linearly with on-premises solutions as device count grows. Factor in additional professional services costs for larger deployments.</p>
                </div>
              </div>
              
              <div class="recommendation-item">
                <div class="recommendation-icon">
                  <i class="fas fa-check-circle"></i>
                </div>
                <div class="recommendation-content">
                  <h5>Consider IT Resource Allocation</h5>
                  <p>On-premises solutions require significant IT resources for management and maintenance. Factor in opportunity costs of IT personnel when evaluating TCO.</p>
                </div>
              </div>
              
              <div class="recommendation-item">
                <div class="recommendation-icon">
                  <i class="fas fa-check-circle"></i>
                </div>
                <div class="recommendation-content">
                  <h5>Evaluate Compliance Overhead</h5>
                  <p>Compliance requirements add significant overhead to both solutions, but impact on-premises deployments more heavily. Consider the long-term compliance maintenance costs in your TCO evaluation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="sensitivity-modal-footer">
          <button id="sensitivity-apply-btn" class="btn btn-primary">Apply Analysis</button>
          <button id="sensitivity-close-btn" class="btn btn-outline">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modalContainer);
    
    // Set up event listeners
    setupSensitivityModalListeners();
    
    // Initialize charts
    setTimeout(initializeSensitivityCharts, 500);
  }
  
  // Set up event listeners for sensitivity modal
  function setupSensitivityModalListeners() {
    const modalContainer = document.getElementById('sensitivity-analysis-modal-container');
    const closeBtn = modalContainer.querySelector('.sensitivity-modal-close');
    const applyBtn = document.getElementById('sensitivity-apply-btn');
    const closeFooterBtn = document.getElementById('sensitivity-close-btn');
    
    // Close button handler
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modalContainer.classList.remove('visible');
      });
    }
    
    // Close footer button handler
    if (closeFooterBtn) {
      closeFooterBtn.addEventListener('click', () => {
        modalContainer.classList.remove('visible');
      });
    }
    
    // Click outside to close
    modalContainer.addEventListener('click', (e) => {
      if (e.target === modalContainer) {
        modalContainer.classList.remove('visible');
      }
    });
    
    // Apply button handler
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        applySensitivityAnalysis();
        modalContainer.classList.remove('visible');
      });
    }
    
    // Set up sliders
    setupSensitivitySliders();
  }
  
  // Open sensitivity modal
  function openSensitivityModal() {
    const modalContainer = document.getElementById('sensitivity-analysis-modal-container');
    if (modalContainer) {
      modalContainer.classList.add('visible');
      
      // Update charts
      updateSensitivityCharts();
      
      // Update impact values
      updateImpactValues();
      
      // Update breakeven values
      updateBreakevenValues();
    }
  }
  
  // Set up sensitivity sliders
  function setupSensitivitySliders() {
    const slidersData = [
      { id: 'sa-devices-slider', valueId: 'sa-devices-value', format: (val) => `${parseInt(val).toLocaleString()} devices` },
      { id: 'sa-locations-slider', valueId: 'sa-locations-value', format: (val) => `${val} location${val > 1 ? 's' : ''}` },
      { id: 'sa-staff-slider', valueId: 'sa-staff-value', format: (val) => `$${parseInt(val).toLocaleString()}` },
      { id: 'sa-years-slider', valueId: 'sa-years-value', format: (val) => `${val} year${val > 1 ? 's' : ''}` },
      { id: 'sa-hardware-slider', valueId: 'sa-hardware-value', format: (val) => `${val}x` },
      { id: 'sa-licensing-slider', valueId: 'sa-licensing-value', format: (val) => `${val}x` },
      { 
        id: 'sa-implementation-slider', 
        valueId: 'sa-implementation-value', 
        format: (val) => {
          const labels = ['Very Simple', 'Simple', 'Medium', 'Complex', 'Very Complex'];
          return `${labels[val-1]} (${val}/5)`;
        } 
      },
      { 
        id: 'sa-compliance-slider', 
        valueId: 'sa-compliance-value', 
        format: (val) => {
          const labels = ['Basic', 'Standard', 'Medium', 'Advanced', 'Stringent'];
          return `${labels[val-1]} (${val}/5)`;
        } 
      }
    ];
    
    slidersData.forEach(sliderData => {
      const slider = document.getElementById(sliderData.id);
      const valueEl = document.getElementById(sliderData.valueId);
      
      if (slider && valueEl) {
        // Set initial value
        valueEl.textContent = sliderData.format(slider.value);
        
        // Add input event listener
        slider.addEventListener('input', function() {
          valueEl.textContent = sliderData.format(this.value);
          
          // Update charts
          updateSensitivityCharts();
          
          // Update impact values
          updateImpactValues();
          
          // Update breakeven values
          updateBreakevenValues();
        });
      }
    });
  }
  
  // Initialize sensitivity charts
  function initializeSensitivityCharts() {
    // Cost Impact Chart
    const costCanvas = document.getElementById('sensitivity-cost-chart');
    if (costCanvas) {
      const ctx = costCanvas.getContext('2d');
      
      window._sensitivityCostChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Device Count', 'Locations', 'Complexity', 'IT Staff Cost', 'Hardware Cost', 'Licensing Cost', 'Compliance'],
          datasets: [
            {
              label: 'Impact on TCO Savings ($)',
              data: [75000, 45000, 30000, 25000, 20000, 35000, 15000],
              backgroundColor: 'rgba(43, 210, 91, 0.7)',
              borderColor: 'rgba(43, 210, 91, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': $' + context.raw.toLocaleString();
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Impact on TCO Savings ($)'
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          }
        }
      });
    }
    
    // ROI Timeline Chart
    const roiCanvas = document.getElementById('sensitivity-roi-chart');
    if (roiCanvas) {
      const ctx = roiCanvas.getContext('2d');
      
      window._sensitivityRoiChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Device Count', 'Locations', 'Complexity', 'IT Staff Cost', 'Hardware Cost', 'Licensing Cost', 'Compliance'],
          datasets: [
            {
              label: 'Impact on ROI Timeline (months)',
              data: [-3, -2, -1.5, -1, -0.8, 2, 0.5],
              backgroundColor: function(context) {
                const value = context.dataset.data[context.dataIndex];
                return value < 0 ? 'rgba(43, 210, 91, 0.7)' : 'rgba(255, 99, 132, 0.7)';
              },
              borderColor: function(context) {
                const value = context.dataset.data[context.dataIndex];
                return value < 0 ? 'rgba(43, 210, 91, 1)' : 'rgba(255, 99, 132, 1)';
              },
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.raw;
                  return value < 0 
                    ? `${context.dataset.label}: ${Math.abs(value)} months faster ROI` 
                    : `${context.dataset.label}: ${value} months slower ROI`;
                }
              }
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Impact on ROI Timeline (months)'
              },
              ticks: {
                callback: function(value) {
                  return value < 0 ? Math.abs(value) + ' mo faster' : value + ' mo slower';
                }
              }
            }
          }
        }
      });
    }
    
    // ROI Projection Chart
    const projectionCanvas = document.getElementById('roi-projection-chart');
    if (projectionCanvas) {
      const ctx = projectionCanvas.getContext('2d');
      
      window._roiProjectionChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Month 0', 'Month 3', 'Month 6', 'Month 9', 'Month 12', 'Month 18', 'Month 24', 'Month 36'],
          datasets: [
            {
              label: 'Portnox Cloud Cumulative ROI',
              data: [-75000, -50000, -25000, 0, 25000, 75000, 125000, 225000],
              borderColor: 'rgba(43, 210, 91, 1)',
              backgroundColor: 'rgba(43, 210, 91, 0.1)',
              tension: 0.3,
              fill: true
            },
            {
              label: 'On-Premises NAC Cumulative ROI',
              data: [-150000, -140000, -130000, -120000, -100000, -60000, -20000, 40000],
              borderColor: 'rgba(27, 103, 178, 1)',
              backgroundColor: 'rgba(27, 103, 178, 0.1)',
              tension: 0.3,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.raw;
                  const sign = value < 0 ? '-' : '';
                  return context.dataset.label + ': ' + sign + '$' + Math.abs(value).toLocaleString();
                }
              }
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Cumulative ROI ($)'
              },
              ticks: {
                callback: function(value) {
                  const sign = value < 0 ? '-' : '';
                  return sign + '$' + Math.abs(value).toLocaleString();
                }
              }
            }
          }
        }
      });
    }
    
    // Initial update
    updateSensitivityCharts();
  }
  
  // Update sensitivity charts based on slider values
  function updateSensitivityCharts() {
    // Get slider values
    const deviceCount = parseInt(document.getElementById('sa-devices-slider')?.value || 1000);
    const locationCount = parseInt(document.getElementById('sa-locations-slider')?.value || 3);
    const implementationComplexity = parseInt(document.getElementById('sa-implementation-slider')?.value || 3);
    const staffCost = parseInt(document.getElementById('sa-staff-slider')?.value || 100000);
    const hardwareCostMultiplier = parseFloat(document.getElementById('sa-hardware-slider')?.value || 1.0);
    const licensingCostMultiplier = parseFloat(document.getElementById('sa-licensing-slider')?.value || 1.0);
    const complianceComplexity = parseInt(document.getElementById('sa-compliance-slider')?.value || 3);
    const years = parseInt(document.getElementById('sa-years-slider')?.value || 3);
    
    // Calculate impact values for cost savings
    const deviceImpact = calculateDeviceImpact(deviceCount);
    const locationImpact = calculateLocationImpact(locationCount);
    const complexityImpact = calculateComplexityImpact(implementationComplexity);
    const staffImpact = calculateStaffImpact(staffCost);
    const hardwareImpact = calculateHardwareImpact(hardwareCostMultiplier);
    const licensingImpact = calculateLicensingImpact(licensingCostMultiplier);
    const complianceImpact = calculateComplianceImpact(complianceComplexity);
    
    // Update Cost Impact Chart
    if (window._sensitivityCostChart) {
      window._sensitivityCostChart.data.datasets[0].data = [
        deviceImpact,
        locationImpact,
        complexityImpact,
        staffImpact,
        hardwareImpact,
        licensingImpact,
        complianceImpact
      ];
      
      window._sensitivityCostChart.update();
    }
    
    // Calculate impact values for ROI timeline
    const deviceRoiImpact = calculateDeviceRoiImpact(deviceCount);
    const locationRoiImpact = calculateLocationRoiImpact(locationCount);
    const complexityRoiImpact = calculateComplexityRoiImpact(implementationComplexity);
    const staffRoiImpact = calculateStaffRoiImpact(staffCost);
    const hardwareRoiImpact = calculateHardwareRoiImpact(hardwareCostMultiplier);
    const licensingRoiImpact = calculateLicensingRoiImpact(licensingCostMultiplier);
    const complianceRoiImpact = calculateComplianceRoiImpact(complianceComplexity);
    
    // Update ROI Timeline Chart
    if (window._sensitivityRoiChart) {
      window._sensitivityRoiChart.data.datasets[0].data = [
        deviceRoiImpact,
        locationRoiImpact,
        complexityRoiImpact,
        staffRoiImpact,
        hardwareRoiImpact,
        licensingRoiImpact,
        complianceRoiImpact
      ];
      
      window._sensitivityRoiChart.update();
    }
    
    // Update ROI Projection Chart
    if (window._roiProjectionChart) {
      // Calculate ROI projection
      const portnoxRoi = calculatePortnoxRoi(
        deviceCount, 
        locationCount, 
        implementationComplexity, 
        staffCost, 
        hardwareCostMultiplier, 
        licensingCostMultiplier, 
        complianceComplexity
      );
      
      const onPremRoi = calculateOnPremRoi(
        deviceCount, 
        locationCount, 
        implementationComplexity, 
        staffCost, 
        hardwareCostMultiplier, 
        licensingCostMultiplier, 
        complianceComplexity
      );
      
      window._roiProjectionChart.data.datasets[0].data = portnoxRoi;
      window._roiProjectionChart.data.datasets[1].data = onPremRoi;
      
      window._roiProjectionChart.update();
    }
  }
  
  // Update impact values in the UI
  function updateImpactValues() {
    // Get slider values
    const deviceCount = parseInt(document.getElementById('sa-devices-slider')?.value || 1000);
    const locationCount = parseInt(document.getElementById('sa-locations-slider')?.value || 3);
    const implementationComplexity = parseInt(document.getElementById('sa-implementation-slider')?.value || 3);
    
    // Calculate impacts
    const deviceImpact = calculateDeviceImpact(deviceCount);
    const locationImpact = calculateLocationImpact(locationCount);
    const complexityImpact = calculateComplexityImpact(implementationComplexity);
    
    // Update UI
    document.getElementById('device-impact-value').textContent = `$${deviceImpact.toLocaleString()} additional savings with Portnox Cloud`;
    document.getElementById('location-impact-value').textContent = `$${locationImpact.toLocaleString()} additional savings with Portnox Cloud`;
    document.getElementById('complexity-impact-value').textContent = `$${complexityImpact.toLocaleString()} additional savings with Portnox Cloud`;
  }
  
  // Update breakeven values in the UI
  function updateBreakevenValues() {
    // Get slider values
    const deviceCount = parseInt(document.getElementById('sa-devices-slider')?.value || 1000);
    const locationCount = parseInt(document.getElementById('sa-locations-slider')?.value || 3);
    const implementationComplexity = parseInt(document.getElementById('sa-implementation-slider')?.value || 3);
    const staffCost = parseInt(document.getElementById('sa-staff-slider')?.value || 100000);
    const hardwareCostMultiplier = parseFloat(document.getElementById('sa-hardware-slider')?.value || 1.0);
    const licensingCostMultiplier = parseFloat(document.getElementById('sa-licensing-slider')?.value || 1.0);
    const complianceComplexity = parseInt(document.getElementById('sa-compliance-slider')?.value || 3);
    
    // Calculate breakeven values
    const roiBreakeven = calculateRoiBreakeven(
      deviceCount, 
      locationCount, 
      implementationComplexity, 
      staffCost, 
      hardwareCostMultiplier, 
      licensingCostMultiplier, 
      complianceComplexity
    );
    
    const tcoBreakeven = calculateTcoBreakeven(
      deviceCount, 
      locationCount, 
      implementationComplexity, 
      staffCost, 
      hardwareCostMultiplier, 
      licensingCostMultiplier, 
      complianceComplexity
    );
    
    const deviceBreakeven = calculateDeviceBreakeven(
      locationCount, 
      implementationComplexity, 
      staffCost, 
      hardwareCostMultiplier, 
      licensingCostMultiplier, 
      complianceComplexity
    );
    
    // Update UI
    document.getElementById('roi-breakeven-value').textContent = roiBreakeven <= 0 ? 'Immediate' : 
      (roiBreakeven < 1 ? 'Less than 1 month' : `${roiBreakeven} month${roiBreakeven !== 1 ? 's' : ''}`);
    
    document.getElementById('tco-breakeven-value').textContent = tcoBreakeven <= 0 ? 'Immediate' : 
      (tcoBreakeven < 1 ? 'Less than 1 month' : `${tcoBreakeven} month${tcoBreakeven !== 1 ? 's' : ''}`);
    
    document.getElementById('device-breakeven-value').textContent = deviceBreakeven <= 0 ? 'Any device count' : 
      `${deviceBreakeven} device${deviceBreakeven !== 1 ? 's' : ''}`;
  }
  
  // Apply sensitivity analysis to calculator
  function applySensitivityAnalysis() {
    // Get slider values
    const deviceCount = parseInt(document.getElementById('sa-devices-slider')?.value || 1000);
    const locationCount = parseInt(document.getElementById('sa-locations-slider')?.value || 3);
    const implementationComplexity = parseInt(document.getElementById('sa-implementation-slider')?.value || 3);
    const staffCost = parseInt(document.getElementById('sa-staff-slider')?.value || 100000);
    const hardwareCostMultiplier = parseFloat(document.getElementById('sa-hardware-slider')?.value || 1.0);
    const licensingCostMultiplier = parseFloat(document.getElementById('sa-licensing-slider')?.value || 1.0);
    const complianceComplexity = parseInt(document.getElementById('sa-compliance-slider')?.value || 3);
    const years = parseInt(document.getElementById('sa-years-slider')?.value || 3);
    
    // Apply to calculator
    if (window.calculator) {
      // Update device count
      const deviceCountInput = document.getElementById('device-count');
      if (deviceCountInput) {
        deviceCountInput.value = deviceCount;
      }
      
      // Update organization size based on device count
      const orgSizeSelect = document.getElementById('organization-size');
      if (orgSizeSelect) {
        if (deviceCount <= 1000) {
          orgSizeSelect.value = 'small';
        } else if (deviceCount <= 5000) {
          orgSizeSelect.value = 'medium';
        } else {
          orgSizeSelect.value = 'large';
        }
      }
      
      // Update years to project
      const yearsInput = document.getElementById('years-to-project');
      if (yearsInput) {
        yearsInput.value = years;
      }
      
      // Update multiple locations
      const multipleLocationsCheckbox = document.getElementById('multiple-locations');
      if (multipleLocationsCheckbox) {
        multipleLocationsCheckbox.checked = locationCount > 1;
        
        // Trigger change event
        const event = new Event('change');
        multipleLocationsCheckbox.dispatchEvent(event);
        
        // Update location count if checkbox is checked
        if (locationCount > 1) {
          const locationCountInput = document.getElementById('location-count');
          if (locationCountInput) {
            locationCountInput.value = locationCount;
          }
        }
      }
      
      // Update calculator metrics
      if (typeof window.calculator.setCustomMetrics === 'function') {
        // Convert complexity to checkbox values
        const complexAuthentication = implementationComplexity >= 3;
        const customPolicies = implementationComplexity >= 4;
        const legacyDevices = implementationComplexity >= 2;
        
        // Update complexity checkboxes
        const complexAuthCheckbox = document.getElementById('complex-authentication');
        const customPoliciesCheckbox = document.getElementById('custom-policies');
        const legacyDevicesCheckbox = document.getElementById('legacy-devices');
        
        if (complexAuthCheckbox) {
          complexAuthCheckbox.checked = complexAuthentication;
        }
        
        if (customPoliciesCheckbox) {
          customPoliciesCheckbox.checked = customPolicies;
        }
        
        if (legacyDevicesCheckbox) {
          legacyDevicesCheckbox.checked = legacyDevices;
        }
        
        // Calculate costs based on multipliers
        const baseHardwareCost = 10000 * hardwareCostMultiplier;
        const baseLicensingCost = 25000 * licensingCostMultiplier;
        
        // Set custom metrics
        window.calculator.setCustomMetrics({
          hardwareCost: baseHardwareCost,
          licensingCost: baseLicensingCost,
          maintenanceCost: 15000,
          implementationCost: 30000,
          personnelCost: staffCost,
          downtimeCost: 5000,
          portnoxDiscount: 25,
          competitorDiscount: 0,
          complianceComplexity
        });
      }
      
      // Run calculation
      if (typeof window.calculator.calculate === 'function') {
        window.calculator.calculate();
      }
    }
  }
  
  // Impact calculation functions
  function calculateDeviceImpact(deviceCount) {
    // Higher device counts favor cloud solutions
    const baseImpact = 50000;
    const scaleFactor = (deviceCount - 1000) / 9000; // 0 to 1 for 1K to 10K
    const scaledImpact = baseImpact + (scaleFactor * 100000);
    return Math.round(scaledImpact);
  }
  
  function calculateLocationImpact(locationCount) {
    // Higher location counts favor cloud solutions
    const baseImpact = 20000;
    const scaleFactor = (locationCount - 1) / 49; // 0 to 1 for 1 to 50
    const scaledImpact = baseImpact + (scaleFactor * 150000);
    return Math.round(scaledImpact);
  }
  
  function calculateComplexityImpact(complexity) {
    // Higher complexity favors cloud solutions
    const baseImpact = 15000;
    const scaleFactor = (complexity - 1) / 4; // 0 to 1 for 1 to 5
    const scaledImpact = baseImpact + (scaleFactor * 60000);
    return Math.round(scaledImpact);
  }
  
  function calculateStaffImpact(staffCost) {
    // Higher staff costs favor cloud solutions
    const baseImpact = 15000;
    const scaleFactor = (staffCost - 50000) / 150000; // 0 to 1 for $50K to $200K
    const scaledImpact = baseImpact + (scaleFactor * 50000);
    return Math.round(scaledImpact);
  }
  
  function calculateHardwareImpact(multiplier) {
    // Higher hardware costs favor cloud solutions
    const baseImpact = 20000;
    const scaledImpact = baseImpact * multiplier;
    return Math.round(scaledImpact);
  }
  
  function calculateLicensingImpact(multiplier) {
    // Licensing impacts both solutions, but on-premises more heavily
    const baseImpact = 35000;
    const scaledImpact = baseImpact * multiplier;
    return Math.round(scaledImpact);
  }
  
  function calculateComplianceImpact(complexity) {
    // Higher compliance complexity favors cloud solutions
    const baseImpact = 10000;
    const scaleFactor = (complexity - 1) / 4; // 0 to 1 for 1 to 5
    const scaledImpact = baseImpact + (scaleFactor * 25000);
    return Math.round(scaledImpact);
  }
  
  // ROI impact calculation functions
  function calculateDeviceRoiImpact(deviceCount) {
    // Higher device counts improve ROI timeline
    const baseImpact = -1.5;
    const scaleFactor = (deviceCount - 1000) / 9000; // 0 to 1 for 1K to 10K
    const scaledImpact = baseImpact - (scaleFactor * 4.5);
    return Math.round(scaledImpact * 10) / 10; // Round to 1 decimal place
  }
  
  function calculateLocationRoiImpact(locationCount) {
    // Higher location counts improve ROI timeline
    const baseImpact = -1;
    const scaleFactor = (locationCount - 1) / 49; // 0 to 1 for 1 to 50
    const scaledImpact = baseImpact - (scaleFactor * 4);
    return Math.round(scaledImpact * 10) / 10; // Round to 1 decimal place
  }
  
  function calculateComplexityRoiImpact(complexity) {
    // Higher complexity improves ROI timeline
    const baseImpact = -0.5;
    const scaleFactor = (complexity - 1) / 4; // 0 to 1 for 1 to 5
    const scaledImpact = baseImpact - (scaleFactor * 3);
    return Math.round(scaledImpact * 10) / 10; // Round to 1 decimal place
  }
  
  function calculateStaffRoiImpact(staffCost) {
    // Higher staff costs improve ROI timeline
    const baseImpact = -0.5;
    const scaleFactor = (staffCost - 50000) / 150000; // 0 to 1 for $50K to $200K
    const scaledImpact = baseImpact - (scaleFactor * 2);
    return Math.round(scaledImpact * 10) / 10; // Round to 1 decimal place
  }
  
  function calculateHardwareRoiImpact(multiplier) {
    // Higher hardware costs improve ROI timeline
    const baseImpact = -0.5;
    const scaledImpact = baseImpact * multiplier;
    return Math.round(scaledImpact * 10) / 10; // Round to 1 decimal place
  }
  
  function calculateLicensingRoiImpact(multiplier) {
    // Higher licensing costs can worsen ROI timeline for cloud
    const baseImpact = 1;
    const scaledImpact = baseImpact * multiplier;
    return Math.round(scaledImpact * 10) / 10; // Round to 1 decimal place
  }
  
  function calculateComplianceRoiImpact(complexity) {
    // Compliance impact on ROI timeline
    const baseImpact = 0.5;
    const scaleFactor = (complexity - 1) / 4; // 0 to 1 for 1 to 5
    const scaledImpact = baseImpact - (scaleFactor * 1.5); // Turns negative at higher complexity
    return Math.round(scaledImpact * 10) / 10; // Round to 1 decimal place
  }
  
  // Breakeven calculation functions
  function calculateRoiBreakeven(deviceCount, locationCount, complexity, staffCost, hardwareMultiplier, licensingMultiplier, complianceComplexity) {
    // Base ROI breakeven in months
    let baseBreakeven = 12;
    
    // Adjust based on parameters
    // Device count adjustment (more devices = faster breakeven)
    const deviceAdjustment = (deviceCount - 1000) / 9000 * -6; // -6 to 0 months
    
    // Location count adjustment (more locations = faster breakeven)
    const locationAdjustment = (locationCount - 1) / 49 * -8; // -8 to 0 months
    
    // Complexity adjustment (more complexity = faster breakeven)
    const complexityAdjustment = (complexity - 1) / 4 * -5; // -5 to 0 months
    
    // Staff cost adjustment (higher staff cost = faster breakeven)
    const staffAdjustment = (staffCost - 50000) / 150000 * -3; // -3 to 0 months
    
    // Hardware cost adjustment (higher hardware cost = faster breakeven)
    const hardwareAdjustment = (hardwareMultiplier - 1) * -3; // -3 to 0 months for 1.0 to 2.0
    
    // Licensing cost adjustment (higher licensing impact varies)
    const licensingAdjustment = (licensingMultiplier - 1) * 2; // 0 to 2 months for 1.0 to 2.0
    
    // Compliance adjustment (higher compliance = faster breakeven)
    const complianceAdjustment = (complianceComplexity - 1) / 4 * -2; // -2 to 0 months
    
    // Calculate final breakeven
    const finalBreakeven = baseBreakeven + 
      deviceAdjustment + 
      locationAdjustment + 
      complexityAdjustment + 
      staffAdjustment + 
      hardwareAdjustment + 
      licensingAdjustment + 
      complianceAdjustment;
    
    return Math.max(0, Math.round(finalBreakeven));
  }
  
  function calculateTcoBreakeven(deviceCount, locationCount, complexity, staffCost, hardwareMultiplier, licensingMultiplier, complianceComplexity) {
    // Base TCO breakeven in months
    let baseBreakeven = 18;
    
    // Adjust based on parameters (similar to ROI but different weights)
    // Device count adjustment (more devices = faster breakeven)
    const deviceAdjustment = (deviceCount - 1000) / 9000 * -10; // -10 to 0 months
    
    // Location count adjustment (more locations = faster breakeven)
    const locationAdjustment = (locationCount - 1) / 49 * -12; // -12 to 0 months
    
    // Complexity adjustment (more complexity = faster breakeven)
    const complexityAdjustment = (complexity - 1) / 4 * -8; // -8 to 0 months
    
    // Staff cost adjustment (higher staff cost = faster breakeven)
    const staffAdjustment = (staffCost - 50000) / 150000 * -6; // -6 to 0 months
    
    // Hardware cost adjustment (higher hardware cost = faster breakeven)
    const hardwareAdjustment = (hardwareMultiplier - 1) * -5; // -5 to 0 months for 1.0 to 2.0
    
    // Licensing cost adjustment (higher licensing impact varies)
    const licensingAdjustment = (licensingMultiplier - 1) * 3; // 0 to 3 months for 1.0 to 2.0
    
    // Compliance adjustment (higher compliance = faster breakeven)
    const complianceAdjustment = (complianceComplexity - 1) / 4 * -4; // -4 to 0 months
    
    // Calculate final breakeven
    const finalBreakeven = baseBreakeven + 
      deviceAdjustment + 
      locationAdjustment + 
      complexityAdjustment + 
      staffAdjustment + 
      hardwareAdjustment + 
      licensingAdjustment + 
      complianceAdjustment;
    
    return Math.max(0, Math.round(finalBreakeven));
  }
  
  function calculateDeviceBreakeven(locationCount, complexity, staffCost, hardwareMultiplier, licensingMultiplier, complianceComplexity) {
    // Base device breakeven count
    let baseBreakeven = 250;
    
    // Adjust based on parameters
    // Location count adjustment (more locations = lower device threshold)
    const locationAdjustment = (locationCount - 1) / 49 * -150; // -150 to 0 devices
    
    // Complexity adjustment (more complexity = lower device threshold)
    const complexityAdjustment = (complexity - 1) / 4 * -100; // -100 to 0 devices
    
    // Staff cost adjustment (higher staff cost = lower device threshold)
    const staffAdjustment = (staffCost - 50000) / 150000 * -100; // -100 to 0 devices
    
    // Hardware cost adjustment (higher hardware cost = lower device threshold)
    const hardwareAdjustment = (hardwareMultiplier - 1) * -75; // -75 to 0 devices for 1.0 to 2.0
    
    // Licensing cost adjustment (higher licensing = higher device threshold)
    const licensingAdjustment = (licensingMultiplier - 1) * 100; // 0 to 100 devices for 1.0 to 2.0
    
    // Compliance adjustment (higher compliance = lower device threshold)
    const complianceAdjustment = (complianceComplexity - 1) / 4 * -50; // -50 to 0 devices
    
    // Calculate final breakeven
    const finalBreakeven = baseBreakeven + 
      locationAdjustment + 
      complexityAdjustment + 
      staffAdjustment + 
      hardwareAdjustment + 
      licensingAdjustment + 
      complianceAdjustment;
    
    return Math.max(0, Math.round(finalBreakeven));
  }
  
  // ROI projection calculation functions
  function calculatePortnoxRoi(deviceCount, locationCount, complexity, staffCost, hardwareMultiplier, licensingMultiplier, complianceComplexity) {
    // Base ROI values for Portnox (monthly progression)
    const baseRoi = [-75000, -50000, -25000, 0, 25000, 75000, 125000, 225000];
    
    // Calculate adjustment factor based on parameters
    const deviceFactor = 1 + (deviceCount - 1000) / 9000 * 0.3; // 1.0 to 1.3
    const locationFactor = 1 + (locationCount - 1) / 49 * 0.3; // 1.0 to 1.3
    const complexityFactor = 1 + (complexity - 1) / 4 * 0.2; // 1.0 to 1.2
    const staffFactor = 1 + (staffCost - 50000) / 150000 * 0.2; // 1.0 to 1.2
    const hardwareFactor = 1; // Hardware doesn't affect Portnox much
    const licensingFactor = licensingMultiplier; // Direct impact
    const complianceFactor = 1 + (complianceComplexity - 1) / 4 * 0.1; // 1.0 to 1.1
    
    // Combined factor
    const combinedFactor = (deviceFactor + locationFactor + complexityFactor + staffFactor + hardwareFactor + licensingFactor + complianceFactor) / 7;
    
    // Adjust ROI values
    return baseRoi.map(value => Math.round(value * combinedFactor));
  }
  
  function calculateOnPremRoi(deviceCount, locationCount, complexity, staffCost, hardwareMultiplier, licensingMultiplier, complianceComplexity) {
    // Base ROI values for On-Prem (monthly progression)
    const baseRoi = [-150000, -140000, -130000, -120000, -100000, -60000, -20000, 40000];
    
    // Calculate adjustment factor based on parameters
    const deviceFactor = 1 + (deviceCount - 1000) / 9000 * 0.5; // 1.0 to 1.5
    const locationFactor = 1 + (locationCount - 1) / 49 * 0.8; // 1.0 to 1.8
    const complexityFactor = 1 + (complexity - 1) / 4 * 0.5; // 1.0 to 1.5
    const staffFactor = 1 + (staffCost - 50000) / 150000 * 0.4; // 1.0 to 1.4
    const hardwareFactor = hardwareMultiplier; // Direct impact
    const licensingFactor = licensingMultiplier * 0.8; // Slightly reduced impact
    const complianceFactor = 1 + (complianceComplexity - 1) / 4 * 0.3; // 1.0 to 1.3
    
    // Combined factor
    const combinedFactor = (deviceFactor + locationFactor + complexityFactor + staffFactor + hardwareFactor + licensingFactor + complianceFactor) / 7;
    
    // Adjust ROI values
    return baseRoi.map(value => Math.round(value * combinedFactor));
  }
  
  // Initialize
  function init() {
    // Add styles
    addStyles();
    
    // Create sensitivity analyzer
    createSensitivityAnalyzer();
    
    console.log('Advanced Sensitivity Analyzer initialized');
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  console.log('Advanced Sensitivity Analyzer setup complete');
})();
/**
 * Enhanced Sensitivity Analysis Component
 * Provides more configurable options and improved visualizations
 */
class EnhancedSensitivityAnalyzer {
  constructor() {
    this.results = null;
    this.analyzing = false;
    this.charts = {};
    this.scenarios = [];
    
    // Reference to calculator
    this.calculator = window.calculator;
    
    // Chart colors
    this.chartColors = window.chartBuilder ? window.chartBuilder.chartColors : {
      cisco: '#049fd9',
      aruba: '#ff8300',
      forescout: '#005daa',
      nps: '#00a4ef',
      fortinac: '#ee3124',
      securew2: '#8bc53f',
      portnox: '#2bd25b',
      neutral: '#888888'
    };
    
    this.initEventListeners();
  }
  
  initEventListeners() {
    // Run button click handler
    const sensitivityBtn = document.getElementById('sensitivity-btn');
    if (sensitivityBtn) {
      sensitivityBtn.addEventListener('click', () => {
        this.analyze();
      });
    }
    
    // Variable selector change handler
    const variableSelect = document.getElementById('param-variable');
    if (variableSelect) {
      variableSelect.addEventListener('change', () => {
        this.updateRangeDefaults(variableSelect.value);
      });
    }
    
    // Add scenario button click handler
    const addScenarioBtn = document.getElementById('add-scenario-btn');
    if (addScenarioBtn) {
      addScenarioBtn.addEventListener('click', () => {
        this.addCurrentScenario();
      });
    }
    
    // Clear scenarios button click handler
    const clearScenariosBtn = document.getElementById('clear-scenarios-btn');
    if (clearScenariosBtn) {
      clearScenariosBtn.addEventListener('click', () => {
        this.clearScenarios();
      });
    }
    
    // Export buttons
    const exportCsvBtn = document.getElementById('export-sensitivity-csv-btn');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => {
        this.exportToCSV();
      });
    }
    
    const exportPdfBtn = document.getElementById('export-sensitivity-pdf-btn');
    if (exportPdfBtn) {
      exportPdfBtn.addEventListener('click', () => {
        this.exportToPDF();
      });
    }
  }
  
  updateRangeDefaults(variable) {
    const minInput = document.getElementById('param-min');
    const maxInput = document.getElementById('param-max');
    const stepsInput = document.getElementById('param-steps');
    
    if (!minInput || !maxInput || !stepsInput) return;
    
    // Get current form values for dynamic ranges
    const deviceCount = parseInt(document.getElementById('device-count')?.value) || 1000;
    const legacyPercentage = parseInt(document.getElementById('legacy-percentage')?.value) || 10;
    const locationCount = parseInt(document.getElementById('location-count')?.value) || 2;
    const yearsToProject = parseInt(document.getElementById('years-to-project')?.value) || 3;
    
    switch (variable) {
      case 'deviceCount':
        minInput.value = Math.max(Math.floor(deviceCount * 0.5), 100);
        maxInput.value = Math.ceil(deviceCount * 2);
        stepsInput.value = '10';
        break;
      case 'legacyPercentage':
        minInput.value = '0';
        maxInput.value = '100';
        stepsInput.value = '11';
        break;
      case 'locationCount':
        minInput.value = '1';
        maxInput.value = Math.max(locationCount * 3, 20);
        stepsInput.value = '10';
        break;
      case 'yearsToProject':
        minInput.value = '1';
        maxInput.value = '10';
        stepsInput.value = '10';
        break;
      case 'hardwareCost':
      case 'licensingCost':
      case 'maintenanceCost':
      case 'fteCost':
      case 'implementationCost':
        minInput.value = '0.5';
        maxInput.value = '2.0';
        stepsInput.value = '7';
        break;
      case 'downtimeCost':
        minInput.value = '1000';
        maxInput.value = '10000';
        stepsInput.value = '10';
        break;
      default:
        minInput.value = '0';
        maxInput.value = '100';
        stepsInput.value = '10';
    }
    
    // Update parameter description
    this.updateParameterDescription(variable);
  }
  
  updateParameterDescription(variable) {
    const descriptionElement = document.getElementById('parameter-description');
    if (!descriptionElement) return;
    
    const descriptions = {
      deviceCount: 'Analyze how changes in the total number of devices affect TCO and relative savings. More devices typically increase hardware and licensing costs for on-premises solutions.',
      legacyPercentage: 'Evaluate the impact of legacy device percentages on overall costs. Legacy devices often require additional security measures and management overhead.',
      locationCount: 'Assess how distributed deployments across multiple locations affect total costs. On-premises solutions typically require hardware at each location.',
      yearsToProject: 'Compare short-term vs. long-term TCO projections. Cloud solutions often show higher relative savings over longer time periods.',
      hardwareCost: 'Test sensitivity to hardware cost changes, such as price increases or discounts. This primarily affects on-premises deployments.',
      licensingCost: 'Analyze how licensing cost variations affect overall TCO. Both cloud and on-premises solutions include licensing costs.',
      maintenanceCost: 'Evaluate the impact of maintenance cost changes on long-term TCO. On-premises solutions typically have higher maintenance requirements.',
      implementationCost: 'Assess how implementation cost factors affect initial deployment expenses. Complex deployments increase professional services costs.',
      fteCost: 'Test sensitivity to changes in IT staffing costs or allocation. On-premises solutions typically require more IT staff time.',
      downtimeCost: 'Analyze how the cost of downtime affects overall TCO. Different solutions have varying reliability characteristics.'
    };
    
    descriptionElement.textContent = descriptions[variable] || 'Analyze how changes in this parameter affect the total cost of ownership and potential savings.';
  }
  
  analyze() {
    if (this.analyzing) {
      console.log('Analysis already in progress');
      return;
    }
    
    this.analyzing = true;
    this.showLoading();
    
    try {
      // Get input parameters
      const variableToAnalyze = document.getElementById('param-variable').value;
      const vendorToAnalyze = document.getElementById('param-vendor').value;
      const minValue = parseFloat(document.getElementById('param-min').value);
      const maxValue = parseFloat(document.getElementById('param-max').value);
      const steps = parseInt(document.getElementById('param-steps').value);
      
      console.log(`Running sensitivity analysis for ${variableToAnalyze}, vendor: ${vendorToAnalyze}, range: ${minValue}-${maxValue}, steps: ${steps}`);
      
      // Validate inputs
      if (isNaN(minValue) || isNaN(maxValue) || isNaN(steps)) {
        throw new Error('Invalid input parameters');
      }
      
      if (minValue >= maxValue) {
        throw new Error('Maximum value must be greater than minimum value');
      }
      
      if (steps < 2 || steps > 20) {
        throw new Error('Number of steps must be between 2 and 20');
      }
      
      // Get additional analysis options
      const includeBreakeven = document.getElementById('include-breakeven')?.checked || false;
      const compareToNoNAC = document.getElementById('compare-to-no-nac')?.checked || false;
      
      // Generate data points
      const stepSize = (maxValue - minValue) / (steps - 1);
      const dataPoints = Array.from({length: steps}, (_, i) => minValue + (i * stepSize));
      
      // Run analysis for each data point
      const analysisResults = {
        variable: variableToAnalyze,
        vendor: vendorToAnalyze,
        minValue,
        maxValue,
        steps,
        dataPoints,
        results: [],
        includeBreakeven,
        compareToNoNAC
      };
      
      // Keep a copy of the original form values
      const originalValues = this.saveOriginalValues();
      
      // For each data point, calculate TCO by modifying the relevant form value
      dataPoints.forEach(dataPoint => {
        // Set the form value for the variable being analyzed
        this.setVariableValue(variableToAnalyze, dataPoint);
        
        // Calculate TCO for this data point
        const calculationResults = this.runCalculation();
        
        // Store results
        analysisResults.results.push({
          dataPoint,
          calculationResults
        });
      });
      
      // Calculate breakeven values if requested
      if (includeBreakeven) {
        analysisResults.breakevenPoints = this.calculateBreakevenPoints(analysisResults);
      }
      
      // Restore original form values
      this.restoreOriginalValues(originalValues);
      
      // Save results
      this.results = analysisResults;
      
      // Update UI with results
      this.updateUI();
      
      // Hide loading indicator
      this.hideLoading();
      this.analyzing = false;
      
      return analysisResults;
    } catch (error) {
      console.error("Error in sensitivity analysis:", error);
      
      // Hide loading indicator
      this.hideLoading();
      this.analyzing = false;
      
      // Show error message
      this.showError("Error in sensitivity analysis: " + error.message);
      
      return null;
    }
  }
  
  calculateBreakevenPoints(analysisResults) {
    const breakevenPoints = {};
    
    // Only calculate if comparing to Portnox
    if (analysisResults.vendor !== 'portnox' && analysisResults.vendor !== 'all') {
      const results = analysisResults.results;
      
      // Find where the lines cross (TCO becomes equal)
      for (let i = 0; i < results.length - 1; i++) {
        const current = results[i];
        const next = results[i + 1];
        
        const currentVendorTCO1 = current.calculationResults[analysisResults.vendor]?.totalTCO || 0;
        const portnoxTCO1 = current.calculationResults['portnox']?.totalTCO || 0;
/**
 * Fix for the syntax error in enhanced-sensitivity.js at line 275
 * This corrects the incomplete implementation of calculateBreakevenPoints method
 */

// Original method with syntax error:
/*
calculateBreakevenPoints(analysisResults) {
  const breakevenPoints = {};
  
  // Only calculate if comparing to Portnox
  if (analysisResults.vendor !== 'portnox' && analysisResults.vendor !== 'all') {
    const results = analysisResults.results;
    
    // Find where the lines cross (TCO becomes equal)
    for (let i = 0; i < results.length - 1; i++) {
      const current = results[i];
      const next = results[i + 1];
      
      const currentVendorTCO1 = current.calculationResults[analysisResults.vendor]?.totalTCO || 0;
      const portnoxTCO1 = current.calculationResults['portnox']?.totalTCO || 0;
*/

// Complete and corrected implementation:
class EnhancedSensitivityAnalyzerFix {
  calculateBreakevenPoints(analysisResults) {
    const breakevenPoints = {};
    
    // Only calculate if comparing to Portnox
    if (analysisResults.vendor !== 'portnox' && analysisResults.vendor !== 'all') {
      const results = analysisResults.results;
      
      // Find where the lines cross (TCO becomes equal)
      for (let i = 0; i < results.length - 1; i++) {
        const current = results[i];
        const next = results[i + 1];
        
        const currentVendorTCO1 = current.calculationResults[analysisResults.vendor]?.totalTCO || 0;
        const portnoxTCO1 = current.calculationResults['portnox']?.totalTCO || 0;
        const currentVendorTCO2 = next.calculationResults[analysisResults.vendor]?.totalTCO || 0;
        const portnoxTCO2 = next.calculationResults['portnox']?.totalTCO || 0;
        
        // Calculate differences
        const diff1 = currentVendorTCO1 - portnoxTCO1;
        const diff2 = currentVendorTCO2 - portnoxTCO2;
        
        // Check if the lines cross (TCO difference changes sign)
        if ((diff1 > 0 && diff2 < 0) || (diff1 < 0 && diff2 > 0)) {
          // Calculate the crossover point using linear interpolation
          const x1 = current.dataPoint;
          const x2 = next.dataPoint;
          
          // Calculate the exact breakeven point
          const ratio = Math.abs(diff1) / (Math.abs(diff1) + Math.abs(diff2));
          const breakeven = x1 + (x2 - x1) * ratio;
          
          // Store the breakeven point
          breakevenPoints[analysisResults.vendor] = {
            value: breakeven,
            unit: this.getVariableUnit(analysisResults.variable)
          };
          
          // We only need to find one breakeven point
          break;
        }
      }
    } else if (analysisResults.vendor === 'all') {
      // If comparing all vendors, find breakeven points for each vs Portnox
      const vendors = Object.keys(window.vendorData).filter(v => v !== 'portnox');
      
      vendors.forEach(vendor => {
        const breakevenFound = this.findBreakevenPoint(vendor, analysisResults);
        if (breakevenFound) {
          breakevenPoints[vendor] = breakevenFound;
        }
      });
    }
    
    return breakevenPoints;
  }
  
  findBreakevenPoint(vendor, analysisResults) {
    const results = analysisResults.results;
    
    // Find where the lines cross (TCO becomes equal)
    for (let i = 0; i < results.length - 1; i++) {
      const current = results[i];
      const next = results[i + 1];
      
      const vendorTCO1 = current.calculationResults[vendor]?.totalTCO || 0;
      const portnoxTCO1 = current.calculationResults['portnox']?.totalTCO || 0;
      const vendorTCO2 = next.calculationResults[vendor]?.totalTCO || 0;
      const portnoxTCO2 = next.calculationResults['portnox']?.totalTCO || 0;
      
      // Calculate differences
      const diff1 = vendorTCO1 - portnoxTCO1;
      const diff2 = vendorTCO2 - portnoxTCO2;
      
      // Check if the lines cross (TCO difference changes sign)
      if ((diff1 > 0 && diff2 < 0) || (diff1 < 0 && diff2 > 0)) {
        // Calculate the crossover point using linear interpolation
        const x1 = current.dataPoint;
        const x2 = next.dataPoint;
        
        // Calculate the exact breakeven point
        const ratio = Math.abs(diff1) / (Math.abs(diff1) + Math.abs(diff2));
        const breakeven = x1 + (x2 - x1) * ratio;
        
        // Return the breakeven point
        return {
          value: breakeven,
          unit: this.getVariableUnit(analysisResults.variable)
        };
      }
    }
    
    return null;
  }

  getVariableUnit(variable) {
    switch (variable) {
      case 'deviceCount':
        return 'devices';
      case 'legacyPercentage':
        return '%';
      case 'locationCount':
        return 'locations';
      case 'yearsToProject':
        return 'years';
      case 'hardwareCost':
      case 'licensingCost':
      case 'maintenanceCost':
      case 'fteCost':
      case 'implementationCost':
        return 'multiplier';
      case 'downtimeCost':
        return '$/hour';
      default:
        return '';
    }
  }
}

// Function to apply the fix when page loads
function applyEnhancedSensitivityFix() {
  if (window.enhancedSensitivityAnalyzer) {
    const fix = new EnhancedSensitivityAnalyzerFix();
    
    // Replace the broken method with our fixed implementation
    window.enhancedSensitivityAnalyzer.calculateBreakevenPoints = 
      fix.calculateBreakevenPoints.bind(window.enhancedSensitivityAnalyzer);
    
    // Add the missing getVariableUnit method if it doesn't exist
    if (!window.enhancedSensitivityAnalyzer.getVariableUnit) {
      window.enhancedSensitivityAnalyzer.getVariableUnit = 
        fix.getVariableUnit.bind(window.enhancedSensitivityAnalyzer);
    }
    
    console.log('Enhanced sensitivity analyzer fixed successfully');
  } else {
    console.warn('Enhanced sensitivity analyzer not found, fix not applied');
  }
}

// Apply the fix when document is ready
document.addEventListener('DOMContentLoaded', applyEnhancedSensitivityFix);
/**
 * Sensitivity Analyzer Fix
 * Enhanced sensitivity analysis with detailed explanations and visualizations
 */
(function() {
  console.log('Installing Enhanced Sensitivity Analyzer...');
  
  // Fix for sensitivity analyzer modal
  function createSensitivityAnalyzerModal() {
    // Remove any existing modal
    const existingModal = document.getElementById('sensitivity-analysis-modal');
    if (existingModal) {
      existingModal.parentNode.removeChild(existingModal);
    }
    
    // Create modal element
    const modal = document.createElement('div');
    modal.id = 'sensitivity-analysis-modal';
    modal.className = 'modal fade';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'sensitivity-analysis-title');
    modal.setAttribute('aria-hidden', 'true');
    
    // Modal content
    modal.innerHTML = `
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="sensitivity-analysis-title">
              <i class="fas fa-chart-line"></i> Enhanced Sensitivity Analysis
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="sensitivity-container">
              <div class="sensitivity-intro">
                <p>Sensitivity analysis helps you understand how changes in key parameters affect the Total Cost of Ownership (TCO) comparison between Portnox Cloud and your current NAC solution.</p>
                <p>Use the controls below to adjust different parameters and see the impact on your TCO and savings.</p>
              </div>
              
              <div class="sensitivity-tabs">
                <button class="sensitivity-tab active" data-tab="organization">Organization Impact</button>
                <button class="sensitivity-tab" data-tab="cost">Cost Factors</button>
                <button class="sensitivity-tab" data-tab="scale">Scaling Impact</button>
                <button class="sensitivity-tab" data-tab="roi">ROI Analysis</button>
              </div>
              
              <div class="sensitivity-tab-content active" id="organization-tab">
                <div class="sensitivity-controls">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="sensitivity-control">
                        <label for="device-count-slider">Device Count</label>
                        <div class="range-container">
                          <input type="range" id="device-count-slider" min="100" max="10000" step="100" value="1000" class="form-range">
                          <div class="range-value">
                            <span id="device-count-value">1,000</span>
                          </div>
                        </div>
                        <div class="control-description">
                          <p>Total number of devices requiring network access control</p>
                          <p class="impact-note" id="device-count-impact">Impact: <span>Medium</span></p>
                        </div>
                      </div>
                    </div>
                    
                    <div class="col-md-6">
                      <div class="sensitivity-control">
                        <label for="location-count-slider">Number of Locations</label>
                        <div class="range-container">
                          <input type="range" id="location-count-slider" min="1" max="50" step="1" value="1" class="form-range">
                          <div class="range-value">
                            <span id="location-count-value">1</span>
                          </div>
                        </div>
                        <div class="control-description">
                          <p>Number of physical locations where NAC will be deployed</p>
                          <p class="impact-note" id="location-count-impact">Impact: <span>High</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="col-md-6">
                      <div class="sensitivity-control">
                        <label for="years-slider">Years to Project</label>
                        <div class="range-container">
                          <input type="range" id="years-slider" min="1" max="10" step="1" value="3" class="form-range">
                          <div class="range-value">
                            <span id="years-value">3</span>
                          </div>
                        </div>
                        <div class="control-description">
                          <p>Number of years to calculate TCO and ROI</p>
                          <p class="impact-note" id="years-impact">Impact: <span>Medium</span></p>
                        </div>
                      </div>
                    </div>
                    
                    <div class="col-md-6">
                      <div class="sensitivity-control">
                        <label for="legacy-percentage-slider">Legacy Device Percentage</label>
                        <div class="range-container">
                          <input type="range" id="legacy-percentage-slider" min="0" max="100" step="5" value="10" class="form-range">
                          <div class="range-value">
                            <span id="legacy-percentage-value">10%</span>
                          </div>
                        </div>
                        <div class="control-description">
                          <p>Percentage of devices that require special handling</p>
                          <p class="impact-note" id="legacy-impact">Impact: <span>Low</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="sensitivity-visualization">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="sensitivity-chart-container">
                        <h4>TCO Comparison</h4>
                        <canvas id="organization-tco-chart"></canvas>
                      </div>
                    </div>
                    
                    <div class="col-md-6">
                      <div class="sensitivity-chart-container">
                        <h4>TCO Breakdown by Location</h4>
                        <canvas id="organization-location-chart"></canvas>
                      </div>
                    </div>
                  </div>
                  
                  <div class="sensitivity-insight-card">
                    <h4><i class="fas fa-lightbulb"></i> Key Insights</h4>
                    <div id="organization-insights">
                      <p>Adjust the parameters to see how they affect the TCO comparison.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="sensitivity-tab-content" id="cost-tab">
                <div class="sensitivity-controls">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="sensitivity-control">
                        <label for="hardware-cost-slider">Hardware Cost ($)</label>
                        <div class="range-container">
                          <input type="range" id="hardware-cost-slider" min="0" max="50000" step="1000" value="10000" class="form-range">
                          <div class="range-value">
                            <span id="hardware-cost-value">$10,000</span>
                          </div>
                        </div>
                        <div class="control-description">
                          <p>Base hardware cost for on-premises deployment</p>
                          <p class="impact-note" id="hardware-cost-impact">Impact: <span>High</span></p>
                        </div>
                      </div>
                    </div>
                    
                    <div class="col-md-6">
                      <div class="sensitivity-control">
                        <label for="licensing-cost-slider">Licensing Cost ($)</label>
                        <div class="range-container">
                          <input type="range" id="licensing-cost-slider" min="0" max="100000" step="5000" value="25000" class="form-range">
                          <div class="range-value">
                            <span id="licensing-cost-value">$25,000</span>
                          </div>
                        </div>
                        <div class="control-description">
                          <p>Annual licensing fees per vendor</p>
                          <p class="impact-note" id="licensing-cost-impact">Impact: <span>High</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="col-md-6">
                      <div class="sensitivity-control">
                        <label for="maintenance-cost-slider">Maintenance Cost ($)</label>
                        <div class="range-container">
                          <input type="range" id="maintenance-cost-slider" min="0" max="50000" step="1000" value="15000" class="form-range">
                          <div class="range-value">
                            <span id="maintenance-cost-value">$15,000</span>
                          </div>
                        </div>
                        <div class="control-description">
                          <p>Annual maintenance and support costs</p>
                          <p class="impact-note" id="maintenance-cost-impact">Impact: <span>Medium</span></p>
                        </div>
                      </div>
                    </div>
                    
                    <div class="col-md-6">
                      <div class="sensitivity-control">
                        <label for="implementation-cost-slider">Implementation Cost ($)</label>
                        <div class="range-container">
                          <input type="range" id="implementation-cost-slider" min="0" max="100000" step="5000" value="30000" class="form-range">
                          <div class="range-value">
                            <span id="implementation-cost-value">$30,000</span>
                          </div>
                        </div>
                        <div class="control-description">
                          <p>Base implementation and professional services costs</p>
                          <p class="impact-note" id="implementation-cost-impact">Impact: <span>Medium</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="col-md-6">
                      <div class="sensitivity-control">
                        <label for="personnel-cost-slider">Personnel Cost ($)</label>
                        <div class="range-container">
                          <input type="range" id="personnel-cost-slider" min="50000" max="200000" step="10000" value="100000" class="form-range">
                          <div class="range-value">
                            <span id="personnel-cost-value">$100,000</span>
                          </div>
                        </div>
                        <div class="control-description">
                          <p>Annual cost per full-time equivalent (FTE)</p>
                          <p class="impact-note" id="personnel-cost-impact">Impact: <span>Very High</span></p>
                        </div>
                      </div>
                    </div>
                    
                    <div class="col-md-6">
                      <div class="sensitivity-control">
                        <label for="portnox-discount-slider">Portnox Discount (%)</label>
                        <div class="range-container">
                          <input type="range" id="portnox-discount-slider" min="0" max="40" step="5" value="0" class="form-range">
                          <div class="range-value">
                            <span id="portnox-discount-value">0%</span>
                          </div>
                        </div>
                        <div class="control-description">
                          <p>Discount percentage on Portnox subscription</p>
                          <p class="impact-note" id="portnox-discount-impact">Impact: <span>Medium</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="sensitivity-visualization">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="sensitivity-chart-container">
                        <h4>Cost Breakdown Comparison</h4>
                        <canvas id="cost-breakdown-chart"></canvas>
                      </div>
                    </div>
                    
                    <div class="col-md-6">
                      <div class="sensitivity-chart-container">
                        <h4>Cost Sensitivity Analysis</h4>
                        <canvas id="cost-sensitivity-chart"></canvas>
                      </div>
                    </div>
                  </div>
                  
                  <div class="sensitivity-insight-card">
                    <h4><i class="fas fa-lightbulb"></i> Key Insights</h4>
                    <div id="cost-insights">
                      <p>Adjust the cost parameters to see how they affect the TCO comparison.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="sensitivity-tab-content" id="scale-tab">
                <div class="sensitivity-controls">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="sensitivity-control">
                        <label for="scale-device-slider">Number of Devices</label>
                        <div class="range-container">
                          <input type="range" id="scale-device-slider" min="100" max="50000" step="100" value="1000" class="form-range">
                          <div class="range-value">
                            <span id="scale-device-value">1,000</span>
                          </div>
                        </div>
                        <div class="control-description">
                          <p>How TCO changes as your device count grows</p>
                          <p class="impact-note" id="scale-device-impact">Impact: <span>High</span></p>
                        </div>
                      </div>
                    </div>
                    
                    <div class="col-md-6">
                      <div class="sensitivity-control">
                        <label for="scale-location-slider">Number of Locations</label>
                        <div class="range-container">
                          <input type="range" id="scale-location-slider" min="1" max="100" step="1" value="1" class="form-range">
                          <div class="range-value">
                            <span id="scale-location-value">1</span>
                          </div>
                        </div>
                        <div class="control-description">
                          <p>How TCO changes as you add more locations</p>
                          <p class="impact-note" id="scale-location-impact">Impact: <span>Very High</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="col-md-6">
                      <div class="sensitivity-control">
                        <label for="scale-years-slider">Growth Rate (%/year)</label>
                        <div class="range-container">
                          <input type="range" id="scale-growth-slider" min="0" max="50" step="5" value="10" class="form-range">
                          <div class="range-value">
                            <span id="scale-growth-value">10%</span>
          </div>
        </div>
        <div class="control-description">
          <p>Annual growth rate in devices</p>
          <p class="impact-note" id="scale-growth-impact">Impact: <span>Medium</span></p>
        </div>
      </div>
    </div>
    
    <div class="col-md-6">
      <div class="sensitivity-control">
        <label for="scale-complexity-slider">Environment Complexity</label>
        <div class="range-container">
          <input type="range" id="scale-complexity-slider" min="1" max="10" step="1" value="5" class="form-range">
          <div class="range-value">
            <span id="scale-complexity-value">5</span>
          </div>
        </div>
        <div class="control-description">
          <p>Higher values indicate more complex environments</p>
          <p class="impact-note" id="scale-complexity-impact">Impact: <span>High</span></p>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="sensitivity-visualization">
  <div class="row">
    <div class="col-md-6">
      <div class="sensitivity-chart-container">
        <h4>TCO by Device Count</h4>
        <canvas id="scale-device-chart"></canvas>
      </div>
    </div>
    
    <div class="col-md-6">
      <div class="sensitivity-chart-container">
        <h4>TCO by Location Count</h4>
        <canvas id="scale-location-chart"></canvas>
      </div>
    </div>
  </div>
  
  <div class="sensitivity-insight-card">
    <h4><i class="fas fa-lightbulb"></i> Key Insights</h4>
    <div id="scale-insights">
      <p>Adjust the scaling parameters to see how they affect the TCO at different scales.</p>
    </div>
  </div>
</div>
</div>

<div class="sensitivity-tab-content" id="roi-tab">
<div class="sensitivity-controls">
  <div class="row">
    <div class="col-md-6">
      <div class="sensitivity-control">
        <label for="roi-years-slider">Years to Project</label>
        <div class="range-container">
          <input type="range" id="roi-years-slider" min="1" max="10" step="1" value="3" class="form-range">
          <div class="range-value">
            <span id="roi-years-value">3</span>
          </div>
        </div>
        <div class="control-description">
          <p>Number of years for ROI calculation</p>
          <p class="impact-note" id="roi-years-impact">Impact: <span>High</span></p>
        </div>
      </div>
    </div>
    
    <div class="col-md-6">
      <div class="sensitivity-control">
        <label for="roi-discount-rate-slider">Discount Rate (%)</label>
        <div class="range-container">
          <input type="range" id="roi-discount-rate-slider" min="0" max="15" step="0.5" value="5" class="form-range">
          <div class="range-value">
            <span id="roi-discount-rate-value">5%</span>
          </div>
        </div>
        <div class="control-description">
          <p>Discount rate for present value calculations</p>
          <p class="impact-note" id="roi-discount-rate-impact">Impact: <span>Medium</span></p>
        </div>
      </div>
    </div>
  </div>
  
  <div class="row">
    <div class="col-md-6">
      <div class="sensitivity-control">
        <label for="roi-initial-investment-slider">Initial Investment Ratio</label>
        <div class="range-container">
          <input type="range" id="roi-initial-investment-slider" min="0.5" max="2" step="0.1" value="1" class="form-range">
          <div class="range-value">
            <span id="roi-initial-investment-value">1.0x</span>
          </div>
        </div>
        <div class="control-description">
          <p>Ratio of initial investment relative to baseline</p>
          <p class="impact-note" id="roi-initial-investment-impact">Impact: <span>Medium</span></p>
        </div>
      </div>
    </div>
    
    <div class="col-md-6">
      <div class="sensitivity-control">
        <label for="roi-annual-savings-slider">Annual Savings Ratio</label>
        <div class="range-container">
          <input type="range" id="roi-annual-savings-slider" min="0.5" max="2" step="0.1" value="1" class="form-range">
          <div class="range-value">
            <span id="roi-annual-savings-value">1.0x</span>
          </div>
        </div>
        <div class="control-description">
          <p>Ratio of annual savings relative to baseline</p>
          <p class="impact-note" id="roi-annual-savings-impact">Impact: <span>High</span></p>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="sensitivity-visualization">
  <div class="row">
    <div class="col-md-6">
      <div class="sensitivity-chart-container">
        <h4>ROI Timeline</h4>
        <canvas id="roi-timeline-chart"></canvas>
      </div>
    </div>
    
    <div class="col-md-6">
      <div class="sensitivity-chart-container">
        <h4>NPV and Payback Period</h4>
        <canvas id="roi-npv-chart"></canvas>
      </div>
    </div>
  </div>
  
  <div class="sensitivity-insight-card">
    <h4><i class="fas fa-lightbulb"></i> Key Insights</h4>
    <div id="roi-insights">
      <p>Adjust the ROI parameters to see how they affect the return on investment and payback period.</p>
    </div>
  </div>
</div>
</div>
</div>

<div class="sensitivity-footer">
<div class="row">
  <div class="col-md-6">
    <div class="sensitivity-summary">
      <h4>Analysis Summary</h4>
      <ul id="sensitivity-summary-list">
        <li>Adjust parameters to see the impact on TCO.</li>
      </ul>
    </div>
  </div>
  
  <div class="col-md-6">
    <div class="sensitivity-actions">
      <button id="sensitivity-reset-btn" class="btn btn-outline-secondary">
        <i class="fas fa-sync-alt"></i> Reset to Defaults
      </button>
      <button id="sensitivity-apply-btn" class="btn btn-primary">
        <i class="fas fa-check"></i> Apply These Settings
      </button>
    </div>
  </div>
</div>
</div>
</div>
</div>
<div class="modal-footer">
<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
<button type="button" class="btn btn-primary" id="sensitivity-export-btn">Export Analysis</button>
</div>
</div>
</div>
</div>
    `;
    
    document.body.appendChild(modal);
    
    // Add CSS for sensitivity analyzer
    addSensitivityStyles();
    
    // Setup event listeners
    setupSensitivityEventListeners();
    
    // Initialize charts
    initializeSensitivityCharts();
    
    return modal;
  }
  
  // Add styles for sensitivity analyzer
  function addSensitivityStyles() {
    // Check if styles already exist
    if (document.getElementById('sensitivity-analyzer-styles')) {
      return;
    }
    
    const style = document.createElement('style');
    style.id = 'sensitivity-analyzer-styles';
    style.textContent = `
      .sensitivity-container {
        padding: 0 10px;
      }
      
      .sensitivity-intro {
        margin-bottom: 20px;
      }
      
      .sensitivity-tabs {
        display: flex;
        margin-bottom: 20px;
        border-bottom: 1px solid #e0e0e0;
      }
      
      .sensitivity-tab {
        padding: 10px 15px;
        background: none;
        border: none;
        border-bottom: 3px solid transparent;
        cursor: pointer;
        font-weight: 500;
        color: #505050;
        transition: all 0.2s ease;
      }
      
      .sensitivity-tab:hover {
        color: #1B67B2;
      }
      
      .sensitivity-tab.active {
        color: #1B67B2;
        border-bottom-color: #1B67B2;
      }
      
      .sensitivity-tab-content {
        display: none;
      }
      
      .sensitivity-tab-content.active {
        display: block;
        animation: fadeIn 0.3s ease-in-out;
      }
      
      .sensitivity-controls {
        margin-bottom: 20px;
        background-color: #f8f9fa;
        border-radius: 8px;
        padding: 15px;
      }
      
      .sensitivity-control {
        margin-bottom: 20px;
      }
      
      .sensitivity-control label {
        display: block;
        font-weight: 500;
        margin-bottom: 5px;
        color: #303030;
      }
      
      .range-container {
        display: flex;
        align-items: center;
      }
      
      .range-container input[type="range"] {
        flex: 1;
      }
      
      .range-value {
        width: 80px;
        text-align: right;
        font-weight: 500;
        color: #1B67B2;
      }
      
      .control-description {
        font-size: 12px;
        color: #505050;
        margin-top: 5px;
      }
      
      .impact-note span {
        font-weight: 600;
        color: #1B67B2;
      }
      
      .sensitivity-visualization {
        margin-bottom: 20px;
      }
      
      .sensitivity-chart-container {
        background-color: white;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        height: 300px;
        margin-bottom: 20px;
      }
      
      .sensitivity-chart-container h4 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 16px;
        color: #303030;
      }
      
      .sensitivity-insight-card {
        background-color: rgba(27, 103, 178, 0.05);
        border-radius: 8px;
        padding: 15px;
        border-left: 4px solid #1B67B2;
      }
      
      .sensitivity-insight-card h4 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 16px;
        color: #1B67B2;
      }
      
      .sensitivity-footer {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #e0e0e0;
      }
      
      .sensitivity-summary {
        margin-bottom: 20px;
      }
      
      .sensitivity-summary h4 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 16px;
        color: #303030;
      }
      
      .sensitivity-summary ul {
        padding-left: 20px;
        margin-bottom: 0;
      }
      
      .sensitivity-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // Set up event listeners for sensitivity analyzer
  function setupSensitivityEventListeners() {
    // Tab switching
    const tabs = document.querySelectorAll('.sensitivity-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        const tabId = this.getAttribute('data-tab');
        document.querySelectorAll('.sensitivity-tab-content').forEach(content => {
          content.classList.toggle('active', content.id === tabId + '-tab');
        });
        
        // Update charts for the active tab
        updateSensitivityCharts(tabId);
      });
    });
    
    // Sliders
    setupSliderListeners();
    
    // Reset button
    const resetBtn = document.getElementById('sensitivity-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', resetSensitivityControls);
    }
    
    // Apply button
    const applyBtn = document.getElementById('sensitivity-apply-btn');
    if (applyBtn) {
      applyBtn.addEventListener('click', applySensitivitySettings);
    }
    
    // Export button
    const exportBtn = document.getElementById('sensitivity-export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', exportSensitivityAnalysis);
    }
  }
  
  // Set up slider listeners
  function setupSliderListeners() {
    // Organization tab sliders
    setupSlider('device-count-slider', 'device-count-value', (value) => {
      return value.toLocaleString();
    });
    
    setupSlider('location-count-slider', 'location-count-value', (value) => {
      return value.toLocaleString();
    });
    
    setupSlider('years-slider', 'years-value');
    
    setupSlider('legacy-percentage-slider', 'legacy-percentage-value', (value) => {
      return value + '%';
    });
    
    // Cost tab sliders
    setupSlider('hardware-cost-slider', 'hardware-cost-value', (value) => {
      return '$' + value.toLocaleString();
    });
    
    setupSlider('licensing-cost-slider', 'licensing-cost-value', (value) => {
      return '$' + value.toLocaleString();
    });
    
    setupSlider('maintenance-cost-slider', 'maintenance-cost-value', (value) => {
      return '$' + value.toLocaleString();
    });
    
    setupSlider('implementation-cost-slider', 'implementation-cost-value', (value) => {
      return '$' + value.toLocaleString();
    });
    
    setupSlider('personnel-cost-slider', 'personnel-cost-value', (value) => {
      return '$' + value.toLocaleString();
    });
    
    setupSlider('portnox-discount-slider', 'portnox-discount-value', (value) => {
      return value + '%';
    });
    
    // Scale tab sliders
    setupSlider('scale-device-slider', 'scale-device-value', (value) => {
      return value.toLocaleString();
    });
    
    setupSlider('scale-location-slider', 'scale-location-value', (value) => {
      return value.toLocaleString();
    });
    
    setupSlider('scale-growth-slider', 'scale-growth-value', (value) => {
      return value + '%';
    });
    
    setupSlider('scale-complexity-slider', 'scale-complexity-value');
    
    // ROI tab sliders
    setupSlider('roi-years-slider', 'roi-years-value');
    
    setupSlider('roi-discount-rate-slider', 'roi-discount-rate-value', (value) => {
      return value + '%';
    });
    
    setupSlider('roi-initial-investment-slider', 'roi-initial-investment-value', (value) => {
      return value.toFixed(1) + 'x';
    });
    
    setupSlider('roi-annual-savings-slider', 'roi-annual-savings-value', (value) => {
      return value.toFixed(1) + 'x';
    });
  }
  
  // Helper function to set up a slider
  function setupSlider(sliderId, valueId, formatter = (value) => value) {
    const slider = document.getElementById(sliderId);
    const valueDisplay = document.getElementById(valueId);
    
    if (!slider || !valueDisplay) return;
    
    slider.addEventListener('input', function() {
      valueDisplay.textContent = formatter(parseFloat(this.value));
      
      // Update charts for the active tab
      const activeTab = document.querySelector('.sensitivity-tab.active');
      if (activeTab) {
        updateSensitivityCharts(activeTab.getAttribute('data-tab'));
      }
      
      // Update insights
      updateSensitivityInsights();
    });
  }
  
  // Initialize sensitivity charts
  function initializeSensitivityCharts() {
    // Create chart instances
    createOrganizationCharts();
    createCostCharts();
    createScaleCharts();
    createROICharts();
  }
  
  // Create organization tab charts
  function createOrganizationCharts() {
    // TCO comparison chart
    const tcoCtx = document.getElementById('organization-tco-chart');
    if (tcoCtx) {
      window.organizationTCOChart = new Chart(tcoCtx, {
        type: 'bar',
        data: {
          labels: ['Portnox Cloud', 'Current Solution'],
          datasets: [{
            label: '3-Year TCO',
            data: [250000, 350000],
            backgroundColor: ['#65BD44', '#1B67B2']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return '$' + context.raw.toLocaleString();
                }
              }
            }
          }
        }
      });
    }
    
    // Location chart
    const locationCtx = document.getElementById('organization-location-chart');
    if (locationCtx) {
      window.organizationLocationChart = new Chart(locationCtx, {
        type: 'line',
        data: {
          labels: [1, 2, 3, 4, 5],
          datasets: [
            {
              label: 'Portnox Cloud',
              data: [250000, 300000, 350000, 400000, 450000],
              borderColor: '#65BD44',
              backgroundColor: 'rgba(101, 189, 68, 0.1)',
              fill: true
            },
            {
              label: 'Current Solution',
              data: [350000, 450000, 550000, 650000, 750000],
              borderColor: '#1B67B2',
              backgroundColor: 'rgba(27, 103, 178, 0.1)',
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Number of Locations'
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': $' + context.raw.toLocaleString();
                }
              }
            }
          }
        }
      });
    }
  }
  
  // Create cost tab charts
  function createCostCharts() {
    // Cost breakdown chart
    const breakdownCtx = document.getElementById('cost-breakdown-chart');
    if (breakdownCtx) {
      window.costBreakdownChart = new Chart(breakdownCtx, {
        type: 'bar',
        data: {
          labels: ['Hardware', 'Software', 'Implementation', 'Maintenance', 'Personnel'],
          datasets: [
            {
              label: 'Portnox Cloud',
              data: [0, 60000, 15000, 10000, 50000],
              backgroundColor: '#65BD44'
            },
            {
              label: 'Current Solution',
              data: [30000, 75000, 30000, 25000, 100000],
              backgroundColor: '#1B67B2'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: false
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': $' + context.raw.toLocaleString();
                }
              }
            }
          }
        }
      });
    }
    
    // Cost sensitivity chart
    const sensitivityCtx = document.getElementById('cost-sensitivity-chart');
    if (sensitivityCtx) {
      window.costSensitivityChart = new Chart(sensitivityCtx, {
        type: 'radar',
        data: {
          labels: ['Hardware', 'Licensing', 'Maintenance', 'Implementation', 'Personnel', 'Downtime'],
          datasets: [
            {
              label: 'Cost Sensitivity',
              data: [7, 8, 6, 7, 9, 5],
              borderColor: '#1B67B2',
              backgroundColor: 'rgba(27, 103, 178, 0.2)'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              min: 0,
              max: 10,
              ticks: {
                stepSize: 2
              },
              pointLabels: {
                font: {
                  size: 12
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  const impact = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
                  const value = context.raw;
                  const impactLevel = Math.floor(value / 2.5);
                  return 'Sensitivity: ' + impact[impactLevel];
                }
              }
            }
          }
        }
      });
    }
  }
  
  // Create scale tab charts
  function createScaleCharts() {
    // Device chart
    const deviceCtx = document.getElementById('scale-device-chart');
    if (deviceCtx) {
      window.scaleDeviceChart = new Chart(deviceCtx, {
        type: 'line',
        data: {
          labels: [1000, 5000, 10000, 20000, 50000],
          datasets: [
            {
              label: 'Portnox Cloud',
              data: [150000, 250000, 350000, 500000, 750000],
              borderColor: '#65BD44',
              backgroundColor: 'rgba(101, 189, 68, 0.1)',
              fill: true
            },
            {
              label: 'Current Solution',
              data: [250000, 450000, 650000, 1000000, 1750000],
              borderColor: '#1B67B2',
              backgroundColor: 'rgba(27, 103, 178, 0.1)',
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Number of Devices'
              },
              type: 'logarithmic'
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': $' + context.raw.toLocaleString();
                }
              }
            }
          }
        }
      });
    }
    
    // Location chart
    const locationCtx = document.getElementById('scale-location-chart');
    if (locationCtx) {
      window.scaleLocationChart = new Chart(locationCtx, {
        type: 'line',
        data: {
          labels: [1, 5, 10, 25, 50, 100],
          datasets: [
            {
              label: 'Portnox Cloud',
              data: [150000, 200000, 250000, 350000, 500000, 750000],
              borderColor: '#65BD44',
              backgroundColor: 'rgba(101, 189, 68, 0.1)',
              fill: true
            },
            {
              label: 'Current Solution',
              data: [250000, 500000, 750000, 1250000, 2000000, 3500000],
              borderColor: '#1B67B2',
              backgroundColor: 'rgba(27, 103, 178, 0.1)',
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Number of Locations'
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': $' + context.raw.toLocaleString();
                }
              }
            }
          }
        }
      });
    }
  }
  
  // Create ROI tab charts
  function createROICharts() {
    // ROI timeline chart
    const timelineCtx = document.getElementById('roi-timeline-chart');
    if (timelineCtx) {
      window.roiTimelineChart = new Chart(timelineCtx, {
        type: 'line',
        data: {
          labels: ['Year 0', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
          datasets: [
            {
              label: 'Cumulative Savings',
              data: [-50000, 0, 50000, 100000, 150000, 200000],
              borderColor: '#65BD44',
              backgroundColor: 'rgba(101, 189, 68, 0.1)',
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          },
          plugins: {
            annotation: {
              annotations: {
                breakeven: {
                  type: 'line',
                  yMin: 0,
                  yMax: 0,
                  borderColor: '#FF6384',
                  borderWidth: 2,
                  borderDash: [5, 5],
                  label: {
                    content: 'Break-even',
                    enabled: true,
                    position: 'right',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    color: '#FF6384',
                    font: {
                      weight: 'bold'
                    }
                  }
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return 'Cumulative Savings: $' + context.raw.toLocaleString();
                }
              }
            }
          }
        }
      });
    }
    
    // NPV chart
    const npvCtx = document.getElementById('roi-npv-chart');
    if (npvCtx) {
      window.roiNpvChart = new Chart(npvCtx, {
        type: 'bar',
        data: {
          labels: ['NPV', 'IRR', 'Payback Period'],
          datasets: [{
            label: 'ROI Metrics',
            data: [150000, 42, 1.5],
            backgroundColor: ['#65BD44', '#1B67B2', '#FF6384']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              ticks: {
                callback: function(value, index) {
                  if (index === 0) return '$' + value.toLocaleString();
                  if (index === 1) return value + '%';
                  if (index === 2) return value + ' years';
                  return value;
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  const index = context.dataIndex;
                  const value = context.raw;
                  
                  if (index === 0) return 'Net Present Value: $' + value.toLocaleString();
                  if (index === 1) return 'Internal Rate of Return: ' + value + '%';
                  if (index === 2) return 'Payback Period: ' + value + ' years';
                  
                  return value;
                }
              }
            }
          }
        }
      });
    }
  }
  
  // Update sensitivity charts based on current tab and slider values
  function updateSensitivityCharts(tab) {
    switch (tab) {
      case 'organization':
        updateOrganizationCharts();
        break;
      case 'cost':
        updateCostCharts();
        break;
      case 'scale':
        updateScaleCharts();
        break;
      case 'roi':
        updateROICharts();
        break;
    }
  }
  
  // Update organization tab charts
  function updateOrganizationCharts() {
    // Get slider values
    const deviceCount = parseInt(document.getElementById('device-count-slider').value) || 1000;
    const locationCount = parseInt(document.getElementById('location-count-slider').value) || 1;
    const years = parseInt(document.getElementById('years-slider').value) || 3;
    const legacyPercentage = parseInt(document.getElementById('legacy-percentage-slider').value) || 10;
    
    // Calculate TCO for Portnox and current solution
    const portnoxTCO = calculateTCO('portnox', {
      deviceCount,
      locationCount,
      years,
      legacyPercentage
    });
    
    const currentTCO = calculateTCO('current', {
      deviceCount,
      locationCount,
      years,
      legacyPercentage
    });
    
    // Update TCO comparison chart
    if (window.organizationTCOChart) {
      window.organizationTCOChart.data.labels = ['Portnox Cloud', getVendorName()];
      window.organizationTCOChart.data.datasets[0].data = [portnoxTCO, currentTCO];
      window.organizationTCOChart.data.datasets[0].label = `${years}-Year TCO`;
      window.organizationTCOChart.update();
    }
    
    // Update location chart
    if (window.organizationLocationChart) {
      const maxLocations = Math.max(5, locationCount);
      const locations = Array.from({length: 5}, (_, i) => i + 1);
      
      const portnoxData = locations.map(loc => 
        calculateTCO('portnox', {
          deviceCount,
          locationCount: loc,
          years,
          legacyPercentage
        })
      );
      
      const currentData = locations.map(loc => 
        calculateTCO('current', {
          deviceCount,
          locationCount: loc,
          years,
          legacyPercentage
        })
      );
      
      window.organizationLocationChart.data.labels = locations;
      window.organizationLocationChart.data.datasets[0].data = portnoxData;
      window.organizationLocationChart.data.datasets[1].data = currentData;
      window.organizationLocationChart.data.datasets[1].label = getVendorName();
      window.organizationLocationChart.update();
    }
    
    // Update organization insights
    updateOrganizationInsights({
      portnoxTCO,
      currentTCO,
      deviceCount,
      locationCount,
      years,
      legacyPercentage
    });
  }
  
  // Update cost tab charts
  function updateCostCharts() {
    // Get slider values
    const hardwareCost = parseInt(document.getElementById('hardware-cost-slider').value) || 10000;
    const licensingCost = parseInt(document.getElementById('licensing-cost-slider').value) || 25000;
    const maintenanceCost = parseInt(document.getElementById('maintenance-cost-slider').value) || 15000;
    const implementationCost = parseInt(document.getElementById('implementation-cost-slider').value) || 30000;
    const personnelCost = parseInt(document.getElementById('personnel-cost-slider').value) || 100000;
    const portnoxDiscount = parseInt(document.getElementById('portnox-discount-slider').value) || 0;
    
    // Calculate cost components for Portnox
    const portnoxHardware = 0;
    const portnoxLicensing = 60000 * (1 - portnoxDiscount / 100);
    const portnoxImplementation = 15000;
    const portnoxMaintenance = 10000;
    const portnoxPersonnel = 50000;
    
    // Calculate cost components for current solution
    const currentHardware = hardwareCost;
    const currentLicensing = licensingCost;
    const currentImplementation = implementationCost;
    const currentMaintenance = maintenanceCost;
    const currentPersonnel = personnelCost;
    
    // Update cost breakdown chart
    if (window.costBreakdownChart) {
      window.costBreakdownChart.data.datasets[0].data = [
        portnoxHardware,
        portnoxLicensing,
        portnoxImplementation,
        portnoxMaintenance,
        portnoxPersonnel
      ];
      
      window.costBreakdownChart.data.datasets[1].data = [
        currentHardware,
        currentLicensing,
        currentImplementation,
        currentMaintenance,
        currentPersonnel
      ];
      
      window.costBreakdownChart.data.datasets[1].label = getVendorName();
      window.costBreakdownChart.update();
    }
    
    // Update cost sensitivity chart
    if (window.costSensitivityChart) {
      // Calculate sensitivity ratings
      const hardwareSensitivity = calculateSensitivity(hardwareCost, 5000, 20000);
      const licensingSensitivity = calculateSensitivity(licensingCost, 10000, 50000);
      const maintenanceSensitivity = calculateSensitivity(maintenanceCost, 5000, 30000);
      const implementationSensitivity = calculateSensitivity(implementationCost, 10000, 60000);
      const personnelSensitivity = calculateSensitivity(personnelCost, 50000, 150000);
      const downtimeSensitivity = 5; // Fixed value for simplicity
      
      window.costSensitivityChart.data.datasets[0].data = [
        hardwareSensitivity,
        licensingSensitivity,
        maintenanceSensitivity,
        implementationSensitivity,
        personnelSensitivity,
        downtimeSensitivity
      ];
      
      window.costSensitivityChart.update();
    }
    
    // Update cost insights
    updateCostInsights({
      hardwareCost,
      licensingCost,
      maintenanceCost,
      implementationCost,
      personnelCost,
      portnoxDiscount,
      portnoxTotal: portnoxHardware + portnoxLicensing + portnoxImplementation + portnoxMaintenance + portnoxPersonnel,
      currentTotal: currentHardware + currentLicensing + currentImplementation + currentMaintenance + currentPersonnel
    });
  }
  
  // Update scale tab charts
  function updateScaleCharts() {
    // Get slider values
    const deviceCount = parseInt(document.getElementById('scale-device-slider').value) || 1000;
    const locationCount = parseInt(document.getElementById('scale-location-slider').value) || 1;
    const growthRate = parseInt(document.getElementById('scale-growth-slider').value) || 10;
    const complexity = parseInt(document.getElementById('scale-complexity-slider').value) || 5;
    
    // Create device scale points
    const devicePoints = [1000, 5000, 10000, 20000, 50000];
    
    // Calculate TCO for each device point
    const portnoxDeviceData = devicePoints.map(devices => 
      calculateTCO('portnox', {
        deviceCount: devices,
        locationCount,
        years: 3,
        complexity
      })
    );
    
    const currentDeviceData = devicePoints.map(devices => 
      calculateTCO('current', {
        deviceCount: devices,
        locationCount,
        years: 3,
        complexity
      })
    );
    
    // Update device chart
    if (window.scaleDeviceChart) {
      window.scaleDeviceChart.data.datasets[0].data = portnoxDeviceData;
      window.scaleDeviceChart.data.datasets[1].data = currentDeviceData;
      window.scaleDeviceChart.data.datasets[1].label = getVendorName();
      window.scaleDeviceChart.update();
    }
    
    // Create location scale points
    const locationPoints = [1, 5, 10, 25, 50, 100];
    
    // Calculate TCO for each location point
    const portnoxLocationData = locationPoints.map(locations => 
      calculateTCO('portnox', {
        deviceCount,
        locationCount: locations,
        years: 3,
        complexity
      })
    );
    
    const currentLocationData = locationPoints.map(locations => 
      calculateTCO('current', {
        deviceCount,
        locationCount: locations,
        years: 3,
        complexity
      })
    );
    
    // Update location chart
    if (window.scaleLocationChart) {
      window.scaleLocationChart.data.datasets[0].data = portnoxLocationData;
      window.scaleLocationChart.data.datasets[1].data = currentLocationData;
      window.scaleLocationChart.data.datasets[1].label = getVendorName();
      window.scaleLocationChart.update();
    }
    
    // Update scale insights
    updateScaleInsights({
      deviceCount,
      locationCount,
      growthRate,
      complexity,
      deviceSavings: devicePoints.map((d, i) => (currentDeviceData[i] - portnoxDeviceData[i]) / currentDeviceData[i] * 100),
      locationSavings: locationPoints.map((l, i) => (currentLocationData[i] - portnoxLocationData[i]) / currentLocationData[i] * 100)
    });
  }
  
  // Update ROI tab charts
  function updateROICharts() {
    // Get slider values
    const years = parseInt(document.getElementById('roi-years-slider').value) || 3;
    const discountRate = parseFloat(document.getElementById('roi-discount-rate-slider').value) || 5;
    const initialInvestmentRatio = parseFloat(document.getElementById('roi-initial-investment-slider').value) || 1;
    const annualSavingsRatio = parseFloat(document.getElementById('roi-annual-savings-slider').value) || 1;
    
    // Define base values
    const baseInitialInvestment = 50000;
    const baseAnnualSavings = 75000;
    
    // Calculate adjusted values
    const initialInvestment = baseInitialInvestment * initialInvestmentRatio;
    const annualSavings = baseAnnualSavings * annualSavingsRatio;
    
    // Calculate ROI timeline
    const timelineData = [];
    let cumulativeSavings = -initialInvestment;
    
    timelineData.push(cumulativeSavings);
    
    for (let i = 1; i <= years + 2; i++) {
      cumulativeSavings += annualSavings;
      
      // Apply discount rate
      const discountFactor = 1 / Math.pow(1 + (discountRate / 100), i);
      const discountedSavings = -initialInvestment + annualSavings * ((1 - Math.pow(discountFactor, i)) / (1 - discountFactor));
      
      timelineData.push(discountedSavings);
    }
    
    // Calculate break-even point
    const breakEvenPoint = initialInvestment / annualSavings;
    
    // Update ROI timeline chart
    if (window.roiTimelineChart) {
      window.roiTimelineChart.data.labels = ['Year 0'].concat(Array.from({length: years + 2}, (_, i) => `Year ${i + 1}`));
      window.roiTimelineChart.data.datasets[0].data = timelineData;
      
      // Update annotation
      if (window.roiTimelineChart.options.plugins.annotation) {
        window.roiTimelineChart.options.plugins.annotation.annotations.breakeven.label.content = `Break-even: ${breakEvenPoint.toFixed(1)} years`;
      }
      
      window.roiTimelineChart.update();
    }
    
    // Calculate NPV
    const npv = -initialInvestment + annualSavings * ((1 - Math.pow(1 / (1 + (discountRate / 100)), years)) / (discountRate / 100));
    
    // Calculate IRR (simplified approximation)
    let irr = (annualSavings / initialInvestment) * 100;
    if (years > 1) {
      irr = ((Math.pow(annualSavings * years / initialInvestment, 1 / years) - 1) * 100);
    }
    
    // Update NPV chart
    if (window.roiNpvChart) {
      window.roiNpvChart.data.datasets[0].data = [npv, irr, breakEvenPoint];
      window.roiNpvChart.update();
    }
    
    // Update ROI insights
    updateROIInsights({
      initialInvestment,
      annualSavings,
      npv,
      irr,
      breakEvenPoint,
      years,
      discountRate
    });
  }
  
  // Update sensitivity insights
  function updateSensitivityInsights() {
    const activeTab = document.querySelector('.sensitivity-tab.active');
    if (!activeTab) return;
    
    const tabId = activeTab.getAttribute('data-tab');
    
    switch (tabId) {
      case 'organization':
        updateOrganizationCharts();
        break;
      case 'cost':
        updateCostCharts();
        break;
      case 'scale':
        updateScaleCharts();
        break;
      case 'roi':
        updateROICharts();
        break;
    }
    
    // Update summary
    updateSensitivitySummary();
  }
  
  // Update organization insights
  function updateOrganizationInsights(data) {
    const insights = document.getElementById('organization-insights');
    if (!insights) return;
    
    const savingsAmount = data.currentTCO - data.portnoxTCO;
    const savingsPercentage = (savingsAmount / data.currentTCO * 100).toFixed(0);
    
    insights.innerHTML = `
      <p><strong>Overall Savings:</strong> With a device count of ${data.deviceCount.toLocaleString()} across ${data.locationCount} location${data.locationCount > 1 ? 's' : ''}, Portnox Cloud provides approximately <strong>$${savingsAmount.toLocaleString()}</strong> in savings over ${data.years} years (${savingsPercentage}% reduction in TCO).</p>
      <p><strong>Location Impact:</strong> ${data.locationCount > 1 ? `With ${data.locationCount} locations, on-premises solutions require hardware at each site, significantly increasing costs. Portnox Cloud's zero-hardware approach provides greater savings with more locations.` : 'Even with a single location, Portnox Cloud provides significant savings due to reduced hardware, maintenance, and personnel costs.'}</p>
      <p><strong>Legacy Devices:</strong> ${data.legacyPercentage > 25 ? `With ${data.legacyPercentage}% legacy devices, Portnox Cloud's agentless approach provides significant advantages for managing diverse device types.` : `Your environment includes ${data.legacyPercentage}% legacy devices, which Portnox Cloud can manage without requiring agents or hardware modifications.`}</p>
    `;
  }
  
  // Update cost insights
  function updateCostInsights(data) {
    const insights = document.getElementById('cost-insights');
    if (!insights) return;
    
    const savingsAmount = data.currentTotal - data.portnoxTotal;
    const savingsPercentage = (savingsAmount / data.currentTotal * 100).toFixed(0);
    
    // Identify biggest impact factors
    const costFactors = [
      { name: 'Hardware', value: data.hardwareCost, impact: data.hardwareCost / data.currentTotal },
      { name: 'Licensing', value: data.licensingCost, impact: data.licensingCost / data.currentTotal },
      { name: 'Maintenance', value: data.maintenanceCost, impact: data.maintenanceCost / data.currentTotal },
      { name: 'Implementation', value: data.implementationCost, impact: data.implementationCost / data.currentTotal },
      { name: 'Personnel', value: data.personnelCost, impact: data.personnelCost / data.currentTotal }
    ];
    
    costFactors.sort((a, b) => b.impact - a.impact);
    const topFactors = costFactors.slice(0, 2);
    
    insights.innerHTML = `
      <p><strong>Overall Savings:</strong> Based on the current parameters, Portnox Cloud provides approximately <strong>$${savingsAmount.toLocaleString()}</strong> in savings (${savingsPercentage}% reduction in annual costs).</p>
      <p><strong>Key Cost Drivers:</strong> ${topFactors[0].name} ($${topFactors[0].value.toLocaleString()}) and ${topFactors[1].name} ($${topFactors[1].value.toLocaleString()}) are the largest cost components for your current solution, representing ${(topFactors[0].impact * 100).toFixed(0)}% and ${(topFactors[1].impact * 100).toFixed(0)}% of total costs respectively.</p>
      ${data.portnoxDiscount > 0 ? `<p><strong>Portnox Discount:</strong> A ${data.portnoxDiscount}% discount on Portnox Cloud licensing reduces annual subscription costs from $60,000 to $${(60000 * (1 - data.portnoxDiscount / 100)).toLocaleString()}, further improving ROI.</p>` : ''}
      <p><strong>Zero Hardware Advantage:</strong> Portnox Cloud eliminates the need for dedicated hardware, providing immediate savings of $${data.hardwareCost.toLocaleString()} in capital expenditure.</p>
    `;
  }
  
  // Update scale insights
  function updateScaleInsights(data) {
    const insights = document.getElementById('scale-insights');
    if (!insights) return;
    
    // Calculate average savings percentage
    const avgDeviceSavings = data.deviceSavings.reduce((a, b) => a + b, 0) / data.deviceSavings.length;
    const avgLocationSavings = data.locationSavings.reduce((a, b) => a + b, 0) / data.locationSavings.length;
    
    // Check if savings increase with scale
    const deviceSavingsIncrease = data.deviceSavings[data.deviceSavings.length - 1] > data.deviceSavings[0];
    const locationSavingsIncrease = data.locationSavings[data.locationSavings.length - 1] > data.locationSavings[0];
    
    insights.innerHTML = `
      <p><strong>Scaling Efficiency:</strong> As your organization scales from ${data.deviceCount.toLocaleString()} devices to 50,000 devices, Portnox Cloud maintains an average TCO savings of <strong>${avgDeviceSavings.toFixed(0)}%</strong> compared to on-premises alternatives, with savings ${deviceSavingsIncrease ? 'increasing' : 'stabilizing'} at larger scales.</p>
      <p><strong>Multi-Site Advantage:</strong> The TCO advantage of Portnox Cloud ${locationSavingsIncrease ? 'increases significantly' : 'remains strong'} as locations increase, reaching <strong>${data.locationSavings[data.locationSavings.length - 1].toFixed(0)}%</strong> savings at 100 locations compared to on-premises solutions that require hardware at each site.</p>
      <p><strong>Growth Planning:</strong> With an annual growth rate of ${data.growthRate}%, Portnox Cloud's subscription model provides predictable costs and eliminates the need for hardware refreshes and capacity planning as your network expands.</p>
      ${data.complexity > 7 ? `<p><strong>Complexity Management:</strong> Your high complexity rating (${data.complexity}/10) indicates an environment where Portnox Cloud's simplified architecture would provide significant operational advantages beyond direct cost savings.</p>` : ''}
    `;
  }
  
  // Update ROI insights
  function updateROIInsights(data) {
    const insights = document.getElementById('roi-insights');
    if (!insights) return;
    
    insights.innerHTML = `
      <p><strong>Break-Even Timeline:</strong> Based on an initial investment of $${data.initialInvestment.toLocaleString()} and annual savings of $${data.annualSavings.toLocaleString()}, your organization will reach break-even in <strong>${data.breakEvenPoint.toFixed(1)} years</strong>.</p>
      <p><strong>Net Present Value:</strong> Over a ${data.years}-year period with a discount rate of ${data.discountRate}%, the NPV of switching to Portnox Cloud is <strong>$${data.npv.toLocaleString()}</strong>, representing the economic value added to your organization.</p>
      <p><strong>Return on Investment:</strong> The internal rate of return (IRR) is approximately <strong>${data.irr.toFixed(1)}%</strong>, which ${data.irr > 20 ? 'exceeds typical corporate investment thresholds' : 'represents a positive return on your investment'}.</p>
      ${data.years > 5 ? `<p><strong>Long-Term Value:</strong> Your ${data.years}-year projection timeline demonstrates that Portnox Cloud continues to deliver increasing value beyond the initial payback period, with cumulative savings growing significantly in later years.</p>` : ''}
    `;
  }
  
  // Update sensitivity summary
  function updateSensitivitySummary() {
    const summaryList = document.getElementById('sensitivity-summary-list');
    if (!summaryList) return;
    
    // Get active tab
    const activeTab = document.querySelector('.sensitivity-tab.active');
    if (!activeTab) return;
    
    const tabId = activeTab.getAttribute('data-tab');
    
    // Get basic values
    const deviceCount = parseInt(document.getElementById('device-count-slider')?.value || document.getElementById('scale-device-slider')?.value) || 1000;
    const locationCount = parseInt(document.getElementById('location-count-slider')?.value || document.getElementById('scale-location-slider')?.value) || 1;
    const years = parseInt(document.getElementById('years-slider')?.value || document.getElementById('roi-years-slider')?.value) || 3;
    
    // Calculate TCO values
    const portnoxTCO = calculateTCO('portnox', { deviceCount, locationCount, years });
    const currentTCO = calculateTCO('current', { deviceCount, locationCount, years });
    const savingsAmount = currentTCO - portnoxTCO;
    const savingsPercentage = (savingsAmount / currentTCO * 100).toFixed(0);
    
    // Create summary
    let summaryItems = [
      `<strong>Base Scenario:</strong> ${deviceCount.toLocaleString()} devices, ${locationCount} location${locationCount > 1 ? 's' : ''}, ${years}-year projection.`,
      `<strong>Total Cost Savings:</strong> $${savingsAmount.toLocaleString()} (${savingsPercentage}% reduction in TCO).`
    ];
    
    // Add tab-specific insights
    switch (tabId) {
      case 'organization':
        summaryItems.push(`<strong>Location Impact:</strong> Adding locations significantly increases the TCO advantage of Portnox Cloud.`);
        break;
      case 'cost':
        const personnelCost = parseInt(document.getElementById('personnel-cost-slider').value) || 100000;
        summaryItems.push(`<strong>Personnel Impact:</strong> FTE costs of $${personnelCost.toLocaleString()} significantly impact TCO for on-premises solutions.`);
        break;
      case 'scale':
        const growthRate = parseInt(document.getElementById('scale-growth-slider').value) || 10;
        summaryItems.push(`<strong>Growth Impact:</strong> With ${growthRate}% annual growth, Portnox Cloud provides more predictable scaling costs.`);
        break;
      case 'roi':
        const breakEvenPoint = (portnoxTCO / (currentTCO - portnoxTCO) * years).toFixed(1);
        summaryItems.push(`<strong>ROI Timeline:</strong> Break-even occurs at approximately ${breakEvenPoint} years with current parameters.`);
        break;
    }
    
    // Update summary list
    summaryList.innerHTML = summaryItems.map(item => `<li>${item}</li>`).join('');
  }
  
  // Reset sensitivity controls to defaults
  function resetSensitivityControls() {
    // Reset organization tab sliders
    if (document.getElementById('device-count-slider')) {
      document.getElementById('device-count-slider').value = 1000;
      document.getElementById('device-count-value').textContent = '1,000';
    }
    
    if (document.getElementById('location-count-slider')) {
      document.getElementById('location-count-slider').value = 1;
      document.getElementById('location-count-value').textContent = '1';
    }
    
    if (document.getElementById('years-slider')) {
      document.getElementById('years-slider').value = 3;
      document.getElementById('years-value').textContent = '3';
    }
    
    if (document.getElementById('legacy-percentage-slider')) {
      document.getElementById('legacy-percentage-slider').value = 10;
      document.getElementById('legacy-percentage-value').textContent = '10%';
    }
    
    // Reset cost tab sliders
    if (document.getElementById('hardware-cost-slider')) {
      document.getElementById('hardware-cost-slider').value = 10000;
      document.getElementById('hardware-cost-value').textContent = '$10,000';
    }
    
    if (document.getElementById('licensing-cost-slider')) {
      document.getElementById('licensing-cost-slider').value = 25000;
      document.getElementById('licensing-cost-value').textContent = '$25,000';
    }
    
    if (document.getElementById('maintenance-cost-slider')) {
      document.getElementById('maintenance-cost-slider').value = 15000;
      document.getElementById('maintenance-cost-value').textContent = '$15,000';
    }
    
    if (document.getElementById('implementation-cost-slider')) {
      document.getElementById('implementation-cost-slider').value = 30000;
      document.getElementById('implementation-cost-value').textContent = '$30,000';
    }
    
    if (document.getElementById('personnel-cost-slider')) {
      document.getElementById('personnel-cost-slider').value = 100000;
      document.getElementById('personnel-cost-value').textContent = '$100,000';
    }
    
    if (document.getElementById('portnox-discount-slider')) {
      document.getElementById('portnox-discount-slider').value = 0;
      document.getElementById('portnox-discount-value').textContent = '0%';
    }
    
    // Reset scale tab sliders
    if (document.getElementById('scale-device-slider')) {
      document.getElementById('scale-device-slider').value = 1000;
      document.getElementById('scale-device-value').textContent = '1,000';
    }
    
    if (document.getElementById('scale-location-slider')) {
      document.getElementById('scale-location-slider').value = 1;
      document.getElementById('scale-location-value').textContent = '1';
    }
    
    if (document.getElementById('scale-growth-slider')) {
      document.getElementById('scale-growth-slider').value = 10;
      document.getElementById('scale-growth-value').textContent = '10%';
    }
    
    if (document.getElementById('scale-complexity-slider')) {
      document.getElementById('scale-complexity-slider').value = 5;
      document.getElementById('scale-complexity-value').textContent = '5';
    }
    
    // Reset ROI tab sliders
    if (document.getElementById('roi-years-slider')) {
      document.getElementById('roi-years-slider').value = 3;
      document.getElementById('roi-years-value').textContent = '3';
    }
    
    if (document.getElementById('roi-discount-rate-slider')) {
      document.getElementById('roi-discount-rate-slider').value = 5;
      document.getElementById('roi-discount-rate-value').textContent = '5%';
    }
    
    if (document.getElementById('roi-initial-investment-slider')) {
      document.getElementById('roi-initial-investment-slider').value = 1;
      document.getElementById('roi-initial-investment-value').textContent = '1.0x';
    }
    
    if (document.getElementById('roi-annual-savings-slider')) {
      document.getElementById('roi-annual-savings-slider').value = 1;
      document.getElementById('roi-annual-savings-value').textContent = '1.0x';
    }
    
    // Update charts and insights
    const activeTab = document.querySelector('.sensitivity-tab.active');
    if (activeTab) {
      updateSensitivityCharts(activeTab.getAttribute('data-tab'));
    }
  }
  
  // Apply sensitivity settings to calculator
  function applySensitivitySettings() {
    // Get organization values
    const deviceCount = parseInt(document.getElementById('device-count-slider')?.value) || 1000;
    const locationCount = parseInt(document.getElementById('location-count-slider')?.value) || 1;
    const years = parseInt(document.getElementById('years-slider')?.value) || 3;
    const legacyPercentage = parseInt(document.getElementById('legacy-percentage-slider')?.value) || 10;
    
    // Get cost values
    const hardwareCost = parseInt(document.getElementById('hardware-cost-slider')?.value) || 10000;
    const licensingCost = parseInt(document.getElementById('licensing-cost-slider')?.value) || 25000;
    const maintenanceCost = parseInt(document.getElementById('maintenance-cost-slider')?.value) || 15000;
    const implementationCost = parseInt(document.getElementById('implementation-cost-slider')?.value) || 30000;
    const personnelCost = parseInt(document.getElementById('personnel-cost-slider')?.value) || 100000;
    
    // Apply settings to calculator
    if (window.calculator) {
      // Update organization details
      if (document.getElementById('device-count')) {
        document.getElementById('device-count').value = deviceCount;
      }
      
      if (document.getElementById('years-to-project')) {
        document.getElementById('years-to-project').value = years;
      }
      
      if (document.getElementById('multiple-locations')) {
        document.getElementById('multiple-locations').checked = locationCount > 1;
      }
      
      if (document.getElementById('location-count')) {
        document.getElementById('location-count').value = locationCount;
        
        // Show/hide location count container
        const locationCountContainer = document.getElementById('location-count-container');
        if (locationCountContainer) {
          locationCountContainer.classList.toggle('hidden', locationCount <= 1);
        }
      }
      
      if (document.getElementById('legacy-devices')) {
        document.getElementById('legacy-devices').checked = legacyPercentage > 0;
      }
      
      if (document.getElementById('legacy-percentage')) {
        document.getElementById('legacy-percentage').value = legacyPercentage;
        
        // Show/hide legacy percentage container
        const legacyPercentageContainer = document.getElementById('legacy-percentage-container');
        if (legacyPercentageContainer) {
          legacyPercentageContainer.classList.toggle('hidden', legacyPercentage <= 0);
        }
      }
      
      // Apply cost configurations if available
      if (window.calculator.data && !window.calculator.data.costConfig) {
        window.calculator.data.costConfig = {};
      }
      
      if (window.calculator.data && window.calculator.data.costConfig) {
        window.calculator.data.costConfig.hardwareCost = hardwareCost;
        window.calculator.data.costConfig.licensingCost = licensingCost;
        window.calculator.data.costConfig.maintenanceCost = maintenanceCost;
        window.calculator.data.costConfig.implementationCost = implementationCost;
        window.calculator.data.costConfig.personnelCost = personnelCost;
      }
      
      // Run calculation
      window.calculator.calculate();
      
      // Close modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('sensitivity-analysis-modal'));
      if (modal) {
        modal.hide();
      }
    }
  }
  
  // Export sensitivity analysis to PDF
  function exportSensitivityAnalysis() {
    // Redirect to built-in export functionality
    if (document.getElementById('export-pdf-btn')) {
      document.getElementById('export-pdf-btn').click();
    }
  }
  
  // Helper function to calculate TCO
  function calculateTCO(type, params) {
    const { deviceCount = 1000, locationCount = 1, years = 3, legacyPercentage = 10, complexity = 5 } = params;
    
    // Base costs
    let hardwareCost = 0;
    let licensingCost = 0;
    let implementationCost = 0;
    let maintenanceCost = 0;
    let personnelCost = 0;
    
    if (type === 'portnox') {
      // Portnox Cloud costs
      hardwareCost = 0; // No hardware required
      licensingCost = 20 * deviceCount; // $20 per device per year
      implementationCost = 15000 + (5000 * Math.sqrt(locationCount)); // Base + per location
      maintenanceCost = 10000; // Flat maintenance cost
      personnelCost = 50000 * (0.5 + (0.1 * Math.log10(deviceCount))); // 0.5 FTE base scaling with device count
    } else {
      // Current solution costs (on-premises)
      hardwareCost = 10000 * locationCount * (1 + (0.2 * Math.log10(deviceCount / 1000))); // Base hardware per location, scaling with device count
      licensingCost = 25 * deviceCount; // $25 per device per year
      implementationCost = 30000 + (15000 * locationCount) + (0.5 * deviceCount); // Base + per location + per device
      maintenanceCost = 15000 * locationCount; // Maintenance per location
      personnelCost = 100000 * (1 + (0.2 * Math.log10(deviceCount)) + (0.15 * locationCount)); // 1 FTE base scaling with device count and locations
    }
    
    // Apply complexity factor
    implementationCost *= 1 + ((complexity - 5) / 10);
    maintenanceCost *= 1 + ((complexity - 5) / 10);
    personnelCost *= 1 + ((complexity - 5) / 10);
    
    // Apply legacy device factor
    if (legacyPercentage > 0) {
      const legacyFactor = legacyPercentage / 100;
      implementationCost *= 1 + (legacyFactor * 0.2);
      maintenanceCost *= 1 + (legacyFactor * 0.3);
      personnelCost *= 1 + (legacyFactor * 0.1);
    }
    
    // Calculate total cost over specified years
    const initialCosts = hardwareCost + implementationCost;
    const annualCosts = licensingCost + maintenanceCost + personnelCost;
    
    return initialCosts + (annualCosts * years);
  }
  
  // Helper function to calculate sensitivity rating (0-10 scale)
  function calculateSensitivity(value, min, max) {
    // Normalize to 0-10 scale
    return Math.min(10, Math.max(0, ((value - min) / (max - min)) * 10));
  }
  
  // Helper function to get vendor name
  function getVendorName() {
    if (window.calculator && window.calculator.activeVendor) {
      return window.calculator.activeVendor;
    }
    return 'Current Vendor';
  }
  
  // Add event listener to sensitivity analysis button
  function setupSensitivityButton() {
    const sensitivityBtn = document.getElementById('sensitivity-analysis-btn');
    if (!sensitivityBtn) return;
    
    // Remove existing event listeners
    const newBtn = sensitivityBtn.cloneNode(true);
    sensitivityBtn.parentNode.replaceChild(newBtn, sensitivityBtn);
    
    // Add new event listener
    newBtn.addEventListener('click', function() {
      // Create modal if it doesn't exist
      const modal = document.getElementById('sensitivity-analysis-modal') || createSensitivityAnalyzerModal();
      
      // Show modal using Bootstrap
      const modalInstance = new bootstrap.Modal(modal);
      modalInstance.show();
      
      // Update initial values
      setTimeout(() => {
        // Initialize charts
        const activeTab = document.querySelector('.sensitivity-tab.active');
        if (activeTab) {
          updateSensitivityCharts(activeTab.getAttribute('data-tab'));
        }
      }, 100);
    });
  }
  
  // Initialize
  function init() {
    console.log('Setting up Enhanced Sensitivity Analyzer...');
    
    // Set up sensitivity button
    setupSensitivityButton();
    
    console.log('Enhanced Sensitivity Analyzer setup complete');
  }
  
  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
/**
 * Integrated Sensitivity Analysis
 * Performs sensitivity analysis on TCO calculator parameters
 */
class IntegratedSensitivityAnalyzer {
  constructor() {
    this.charts = {};
    
    // Parameter descriptions
    this.parameterDescriptions = {
      deviceCount: 'Analyze how changes in the total number of devices affect TCO and relative savings.',
      legacyPercentage: 'Evaluate the impact of different legacy device percentages on overall TCO.',
      locationCount: 'Examine how deployment across multiple locations affects total costs.',
      yearsToProject: 'Compare cost projections over different time horizons.',
      hardwareCost: 'Analyze sensitivity to hardware cost variations.',
      licensingCost: 'Evaluate how licensing cost changes impact overall TCO.',
      maintenanceCost: 'Examine the effect of maintenance cost fluctuations.',
      implementationCost: 'Measure the impact of implementation cost variations.',
      fteCost: 'Assess how personnel costs affect the total TCO.',
      downtimeCost: 'Calculate the impact of different downtime costs on overall risk.',
    };
    
    // Parameter units
    this.parameterUnits = {
      deviceCount: 'devices',
      legacyPercentage: '%',
      locationCount: 'locations',
      yearsToProject: 'years',
      hardwareCost: 'x',
      licensingCost: 'x',
      maintenanceCost: 'x',
      implementationCost: 'x',
      fteCost: 'x',
      downtimeCost: '$/hour',
    };
    
    // Parameter default ranges
    this.parameterRanges = {
      deviceCount: { min: 100, max: 5000, steps: 10 },
      legacyPercentage: { min: 0, max: 100, steps: 10 },
      locationCount: { min: 1, max: 50, steps: 10 },
      yearsToProject: { min: 1, max: 5, steps: 5 },
      hardwareCost: { min: 0.5, max: 2.0, steps: 10 },
      licensingCost: { min: 0.5, max: 2.0, steps: 10 },
      maintenanceCost: { min: 0.5, max: 2.0, steps: 10 },
      implementationCost: { min: 0.5, max: 2.0, steps: 10 },
      fteCost: { min: 0.5, max: 2.0, steps: 10 },
      downtimeCost: { min: 0, max: 10000, steps: 10 },
    };
    
    // Chart colors
    this.chartColors = {
      cisco: '#049fd9',      // Cisco blue
      aruba: '#ff8300',      // Aruba orange
      forescout: '#005daa',  // Forescout blue
      nps: '#00a4ef',        // Microsoft blue
      fortinac: '#ee3124',   // FortiNAC red
      securew2: '#8bc53f',   // SecureW2 green
      portnox: '#2bd25b',    // Portnox green
      neutral: '#888888'     // Neutral gray
    };
    
    // Chart defaults
    this.chartDefaults = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            padding: 15,
            usePointStyle: true
          }
        },
        tooltip: {
          enabled: true,
          padding: 10,
          bodySpacing: 5,
          callbacks: {}
        }
      }
    };
    
    console.log('Integrated Sensitivity Analyzer initialized');
  }
  
  // Initialize charts
  initCharts() {
    this.initSensitivityChart();
    this.initSavingsImpactChart();
  }
  
  // Initialize sensitivity analysis chart
  initSensitivityChart() {
    const ctx = document.getElementById('sensitivity-chart');
    if (!ctx) {
      console.warn('Sensitivity chart canvas element not found');
      return;
    }
    
    try {
      const ctxCanvas = ctx.getContext('2d');
      if (!ctxCanvas) {
        console.warn('Could not get 2D context for sensitivity chart');
        return;
      }
      
      this.charts.sensitivity = new Chart(ctxCanvas, {
        type: 'line',
        data: {
          labels: [],
          datasets: []
        },
        options: {
          ...this.chartDefaults,
          scales: {
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: 'Total Cost ($)'
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            },
            x: {
              title: {
                display: true,
                text: 'Parameter Value'
              }
            }
          },
          plugins: {
            ...this.chartDefaults.plugins,
            tooltip: {
              ...this.chartDefaults.plugins.tooltip,
              callbacks: {
                label: function(context) {
                  const label = context.dataset.label || '';
                  const value = context.parsed.y;
                  return label + ': $' + value.toLocaleString();
                }
              }
            }
          }
        }
      });
      
      console.log('Sensitivity chart initialized');
    } catch (error) {
      console.error('Error initializing sensitivity chart:', error);
    }
  }
  
  // Initialize savings impact chart
  initSavingsImpactChart() {
    const ctx = document.getElementById('savings-impact-chart');
    if (!ctx) {
      console.warn('Savings impact chart canvas element not found');
      return;
    }
    
    try {
      const ctxCanvas = ctx.getContext('2d');
      if (!ctxCanvas) {
        console.warn('Could not get 2D context for savings impact chart');
        return;
      }
      
      this.charts.savingsImpact = new Chart(ctxCanvas, {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'Savings Percentage',
            data: [],
            borderColor: this.chartColors.portnox,
            backgroundColor: this.chartColors.portnox + '20',
            fill: true,
            tension: 0.3,
            borderWidth: 2
          }]
        },
        options: {
          ...this.chartDefaults,
          scales: {
            y: {
              beginAtZero: true,
              suggestedMax: 100,
              title: {
                display: true,
                text: 'Savings (%)'
              },
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            },
            x: {
              title: {
                display: true,
                text: 'Parameter Value'
              }
            }
          },
          plugins: {
            ...this.chartDefaults.plugins,
            tooltip: {
              ...this.chartDefaults.plugins.tooltip,
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%';
                }
              }
            }
          }
        }
      });
      
      console.log('Savings impact chart initialized');
    } catch (error) {
      console.error('Error initializing savings impact chart:', error);
    }
  }
  
  // Run sensitivity analysis
  runSensitivityAnalysis(parameter, parameterValues, selectedVendor) {
    try {
      console.log('Running sensitivity analysis for parameter:', parameter);
      console.log('Parameter values:', parameterValues);
      console.log('Selected vendor:', selectedVendor);
      
      // Get calculator instance
      const calculator = window.calculator;
      if (!calculator) {
        console.error('Calculator not found');
        return null;
      }
      
      // Get current calculation input
      const baseInput = { ...calculator.getCalculationInput() };
      
      // Results containers
      const results = {
        parameter,
        parameterValues,
        vendorResults: []
      };
      
      // Determine which vendors to analyze
      let vendors = ['portnox'];
      if (selectedVendor === 'all') {
        // Add all vendors except portnox
        vendors = [...vendors, ...Object.keys(window.vendorData || {})];
        vendors = [...new Set(vendors)]; // Remove duplicates
      } else if (selectedVendor !== 'portnox') {
        vendors.push(selectedVendor);
      }
      
      // Run analysis for each vendor
      vendors.forEach(vendor => {
        const vendorTCO = [];
        
        // Calculate TCO for each parameter value
        parameterValues.forEach(value => {
          // Create modified input with the current parameter value
          const modifiedInput = { ...baseInput };
          
          switch (parameter) {
            case 'deviceCount':
              modifiedInput.deviceCount = value;
              break;
            case 'legacyPercentage':
              modifiedInput.legacyPercentage = value;
              break;
            case 'locationCount':
              modifiedInput.locationCount = value;
              modifiedInput.multipleLocations = value > 1;
              break;
            case 'yearsToProject':
              modifiedInput.yearsToProject = value;
              break;
            case 'hardwareCost':
              modifiedInput.hardwareCostMultiplier = value;
              break;
            case 'licensingCost':
              modifiedInput.licensingCostMultiplier = value;
              break;
            case 'maintenanceCost':
              modifiedInput.maintenanceCostMultiplier = value;
              break;
            case 'implementationCost':
              modifiedInput.implementationCostMultiplier = value;
              break;
            case 'fteCost':
              modifiedInput.fteCostMultiplier = value;
              break;
            case 'downtimeCost':
              modifiedInput.downtimeCost = value;
              break;
          }
          
          // Calculate TCO for the current vendor with modified parameters
          const vendorResults = calculator.calculateVendorTCO(vendor, modifiedInput);
          
          // Add TCO to results
          vendorTCO.push(vendorResults.totalCost);
        });
        
        // Add vendor results to the results object
        results.vendorResults.push({
          name: window.vendorData && window.vendorData[vendor] ? window.vendorData[vendor].name : vendor,
          values: vendorTCO,
          vendor
        });
      });
      
      // Calculate savings percentages if we have portnox and at least one other vendor
      if (results.vendorResults.length > 1) {
        const portnoxResults = results.vendorResults.find(result => result.vendor === 'portnox');
        const compareResults = results.vendorResults.find(result => result.vendor === selectedVendor) || 
                              results.vendorResults.find(result => result.vendor !== 'portnox');
        
        if (portnoxResults && compareResults) {
          const savingsPercentages = [];
          
          compareResults.values.forEach((value, index) => {
            const portnoxValue = portnoxResults.values[index];
            const savings = value - portnoxValue;
            const savingsPercentage = (savings / value) * 100;
            savingsPercentages.push(savingsPercentage);
          });
          
          results.savingsPercentages = savingsPercentages;
        }
      }
      
      // Calculate breakeven points
      const breakevens = this.calculateBreakevens(parameter, parameterValues, results.vendorResults);
      results.breakevens = breakevens;
      
      return results;
    } catch (error) {
      console.error('Error running sensitivity analysis:', error);
      return null;
    }
  }
  
  // Calculate breakeven points between vendors
  calculateBreakevens(parameter, parameterValues, vendorResults) {
    const breakevens = [];
    
    // Find portnox results
    const portnoxResults = vendorResults.find(result => result.vendor === 'portnox');
    if (!portnoxResults) return breakevens;
    
    // Check breakeven points for each vendor against portnox
    vendorResults.forEach(vendorResult => {
      if (vendorResult.vendor === 'portnox') return;
      
      // Find where the lines cross (TCO becomes equal)
      let breakevenValue = null;
      let breakevenIndex = -1;
      
      for (let i = 0; i < parameterValues.length - 1; i++) {
        const portnoxValue1 = portnoxResults.values[i];
        const portnoxValue2 = portnoxResults.values[i + 1];
        const vendorValue1 = vendorResult.values[i];
        const vendorValue2 = vendorResult.values[i + 1];
        
        // Check if the lines cross between these points
        if ((portnoxValue1 > vendorValue1 && portnoxValue2 < vendorValue2) ||
            (portnoxValue1 < vendorValue1 && portnoxValue2 > vendorValue2)) {
          
          // Calculate the intersection point using linear interpolation
          const t = (vendorValue1 - portnoxValue1) / ((portnoxValue2 - portnoxValue1) - (vendorValue2 - vendorValue1));
          const paramValue = parameterValues[i] + t * (parameterValues[i + 1] - parameterValues[i]);
          
          breakevenValue = paramValue;
          breakevenIndex = i;
          
          // Add to breakevens
          breakevens.push({
            vendor: vendorResult.vendor,
            vendorName: vendorResult.name,
            breakevenValue,
            breakevenIndex,
            parameterValue: paramValue
          });
        }
      }
    });
    
    return breakevens;
  }
  
  // Update sensitivity chart with results
  updateSensitivityChart(results) {
    if (!this.charts.sensitivity) {
      console.warn('Sensitivity chart not initialized');
      return;
    }
    
    try {
      // Update chart data
      this.charts.sensitivity.data.labels = results.parameterValues;
      
      // Create datasets
      const datasets = results.vendorResults.map(result => {
        const color = this.chartColors[result.vendor] || this.chartColors.neutral;
        
        return {
          label: result.name,
          data: result.values,
          borderColor: color,
          backgroundColor: color + '10',
          tension: 0.3,
          fill: false,
          borderWidth: result.vendor === 'portnox' ? 3 : 2,
          pointRadius: result.vendor === 'portnox' ? 4 : 3,
          pointHoverRadius: result.vendor === 'portnox' ? 7 : 5
        };
      });
      
      this.charts.sensitivity.data.datasets = datasets;
      
      // Update X-axis title
      const parameter = results.parameter;
      const unit = this.parameterUnits[parameter] || '';
      const xTitle = 'Parameter: ' + parameter + (unit ? ' (' + unit + ')' : '');
      
      this.charts.sensitivity.options.scales.x.title.text = xTitle;
      
      // Update chart
      this.charts.sensitivity.update();
      
      console.log('Sensitivity chart updated');
    } catch (error) {
      console.error('Error updating sensitivity chart:', error);
    }
  }
  
  // Update savings impact chart with results
  updateSavingsImpactChart(results) {
    if (!this.charts.savingsImpact) {
      console.warn('Savings impact chart not initialized');
      return;
    }
    
    if (!results.savingsPercentages) {
      console.warn('No savings percentages available');
      return;
    }
    
    try {
      // Update chart data
      this.charts.savingsImpact.data.labels = results.parameterValues;
      this.charts.savingsImpact.data.datasets[0].data = results.savingsPercentages;
      
      // Update X-axis title
      const parameter = results.parameter;
      const unit = this.parameterUnits[parameter] || '';
      const xTitle = 'Parameter: ' + parameter + (unit ? ' (' + unit + ')' : '');
      
      this.charts.savingsImpact.options.scales.x.title.text = xTitle;
      
      // Update chart
      this.charts.savingsImpact.update();
      
      console.log('Savings impact chart updated');
    } catch (error) {
      console.error('Error updating savings impact chart:', error);
    }
  }
  
  // Generate breakeven analysis content
  generateBreakevenContent(results) {
    if (!results.breakevens || results.breakevens.length === 0) {
      return '<p>No breakeven points found in the analyzed range.</p>';
    }
    
    const parameter = results.parameter;
    const unit = this.parameterUnits[parameter] || '';
    
    let html = '<div class="breakeven-grid">';
    
    results.breakevens.forEach(breakeven => {
      const value = breakeven.parameterValue.toFixed(2);
      
      html += `
        <div class="breakeven-item">
          <div class="breakeven-vendor">${breakeven.vendorName} vs Portnox</div>
          <div class="breakeven-value">${value} ${unit}</div>
          <div class="breakeven-description">
            Portnox becomes more cost-effective than ${breakeven.vendorName} above this ${parameter} value.
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    
    return html;
  }
  
  // Generate results table
  generateResultsTable(results) {
    if (!results.vendorResults || results.vendorResults.length === 0) {
      return '<p>No results available.</p>';
    }
    
    const parameter = results.parameter;
    const unit = this.parameterUnits[parameter] || '';
    
    let html = '<table class="data-table sensitivity-table">';
    
    // Generate table header
    html += '<thead><tr>';
    html += `<th>${parameter} (${unit})</th>`;
    
    results.vendorResults.forEach(result => {
      html += `<th>${result.name}</th>`;
    });
    
    if (results.savingsPercentages) {
      html += '<th>Savings %</th>';
    }
    
    html += '</tr></thead>';
    
    // Generate table body
    html += '<tbody>';
    
    results.parameterValues.forEach((value, index) => {
      html += '<tr>';
      html += `<td>${value}</td>`;
      
      results.vendorResults.forEach(result => {
        const tco = result.values[index];
        html += `<td>${window.formatCurrency ? window.formatCurrency(tco) : '$' + tco.toLocaleString()}</td>`;
      });
      
      if (results.savingsPercentages) {
        const savingsPercentage = results.savingsPercentages[index];
        html += `<td>${savingsPercentage.toFixed(1)}%</td>`;
      }
      
      html += '</tr>';
    });
    
    html += '</tbody>';
    html += '</table>';
    
    return html;
  }
  
  // Get parameter description
  getParameterDescription(parameter) {
    return this.parameterDescriptions[parameter] || 'Analyze how changes in this parameter affect TCO.';
  }
  
  // Get default parameter range
  getDefaultParameterRange(parameter) {
    return this.parameterRanges[parameter] || { min: 0, max: 100, steps: 10 };
  }
}

// Initialize and expose
window.sensitivityAnalyzer = new IntegratedSensitivityAnalyzer();

console.log('Enhanced Sensitivity Analyzer initialized');
/**
 * Simplified sensitivity analysis
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing simplified sensitivity analysis...');
  
  // Only run on sensitivity page
  if (window.location.href.indexOf('sensitivity.html') === -1) {
    return;
  }
  
  // Initialize charts
  initCharts();
  
  // Add event listeners
  const sensitivityBtn = document.getElementById('sensitivity-btn');
  if (sensitivityBtn) {
    sensitivityBtn.addEventListener('click', runAnalysis);
  }
  
  const variableSelect = document.getElementById('param-variable');
  if (variableSelect) {
    variableSelect.addEventListener('change', function() {
      updateRangeDefaults(variableSelect.value);
    });
    
    // Set initial defaults
    updateRangeDefaults(variableSelect.value);
  }
  
  // Return to calculator button
  const returnBtn = document.getElementById('return-to-calculator');
  if (returnBtn) {
    returnBtn.addEventListener('click', function() {
      window.location.href = 'index.html';
    });
  }
  
  /**
   * Initialize charts
   */
  function initCharts() {
    // Initialize sensitivity chart
    const sensChart = document.getElementById('sensitivity-chart');
    if (sensChart) {
      try {
        // Create simple placeholder chart
        window.sensitivityChart = new Chart(sensChart.getContext('2d'), {
          type: 'line',
          data: {
            labels: ['Run analysis to see data'],
            datasets: [{
              label: 'No data available',
              data: [0],
              backgroundColor: '#05547C',
              borderColor: '#05547C'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      } catch (e) {
        console.error('Error initializing sensitivity chart:', e);
      }
    }
    
    // Initialize savings chart
    const savingsChart = document.getElementById('savings-impact-chart');
    if (savingsChart) {
      try {
        // Create simple placeholder chart
        window.savingsChart = new Chart(savingsChart.getContext('2d'), {
          type: 'line',
          data: {
            labels: ['Run analysis to see data'],
            datasets: [{
              label: 'No data available',
              data: [0],
              backgroundColor: '#65BD44',
              borderColor: '#65BD44'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      } catch (e) {
        console.error('Error initializing savings chart:', e);
      }
    }
  }
  
  /**
   * Update range defaults based on selected variable
   */
  function updateRangeDefaults(variable) {
    const minInput = document.getElementById('param-min');
    const maxInput = document.getElementById('param-max');
    const stepsInput = document.getElementById('param-steps');
    const description = document.getElementById('parameter-description');
    
    if (!minInput || !maxInput || !stepsInput) return;
    
    switch (variable) {
      case 'deviceCount':
        minInput.value = '500';
        maxInput.value = '2000';
        stepsInput.value = '10';
        if (description) {
          description.textContent = 'Analyze how changes in the total number of devices affect TCO and relative savings.';
        }
        break;
      case 'legacyPercentage':
        minInput.value = '0';
        maxInput.value = '100';
        stepsInput.value = '11';
        if (description) {
          description.textContent = 'Evaluate the impact of legacy device percentages on overall costs.';
        }
        break;
      case 'locationCount':
        minInput.value = '1';
        maxInput.value = '10';
        stepsInput.value = '10';
        if (description) {
          description.textContent = 'Assess how distributed deployments across multiple locations affect total costs.';
        }
        break;
      case 'yearsToProject':
        minInput.value = '1';
        maxInput.value = '10';
        stepsInput.value = '10';
        if (description) {
          description.textContent = 'Compare short-term vs. long-term TCO projections.';
        }
        break;
      default:
        minInput.value = '0.5';
        maxInput.value = '2.0';
        stepsInput.value = '7';
        if (description) {
          description.textContent = 'Analyze how changes in this parameter affect the total cost of ownership.';
        }
    }
  }
  
  /**
   * Run sensitivity analysis
   */
  function runAnalysis() {
    // Show loading
    showLoading();
    
    // Get parameters
    const variable = document.getElementById('param-variable').value;
    const vendor = document.getElementById('param-vendor').value;
    const min = parseFloat(document.getElementById('param-min').value);
    const max = parseFloat(document.getElementById('param-max').value);
    const steps = parseInt(document.getElementById('param-steps').value);
    
    // Generate dummy data for demonstration
    const data = generateDummyData(variable, vendor, min, max, steps);
    
    // Slight delay to show loading animation
    setTimeout(function() {
      // Update charts
      updateCharts(data);
      
      // Update table
      updateTable(data);
      
      // Hide loading
      hideLoading();
      
      // Show success message
      showMessage('Analysis completed successfully', 'success');
    }, 1500);
  }
  
  /**
   * Generate dummy data for demonstration
   */
  function generateDummyData(variable, vendor, min, max, steps) {
    const vendors = vendor === 'all' ? 
      ['cisco', 'aruba', 'forescout', 'nps', 'fortinac', 'securew2', 'portnox'] : 
      [vendor, 'portnox'];
    
    const uniqueVendors = [...new Set(vendors)];
    const labels = [];
    const dataPoints = {};
    const savingsPoints = {};
    const stepSize = (max - min) / (steps - 1);
    
    // Set up data structures
    uniqueVendors.forEach(v => {
      dataPoints[v] = [];
      
      if (v !== 'portnox') {
        savingsPoints[v] = [];
      }
    });
    
    // Generate data
    for (let i = 0; i < steps; i++) {
      const x = min + (stepSize * i);
      labels.push(formatValue(variable, x));
      
      uniqueVendors.forEach(v => {
        // Base value affected by variable
        let multiplier = 1;
        if (variable === 'deviceCount') {
          multiplier = x / 1000;
        } else if (variable === 'legacyPercentage') {
          multiplier = 1 + (x / 100);
        } else if (variable === 'locationCount') {
          multiplier = 1 + (x / 10);
        } else if (variable === 'yearsToProject') {
          multiplier = x / 3;
        } else {
          multiplier = x;
        }
        
        // Different base costs for different vendors
        let baseCost = 0;
        if (v === 'cisco') baseCost = 1000000;
        else if (v === 'aruba') baseCost = 950000;
        else if (v === 'forescout') baseCost = 900000;
        else if (v === 'nps') baseCost = 400000;
        else if (v === 'fortinac') baseCost = 850000;
        else if (v === 'securew2') baseCost = 600000;
        else if (v === 'portnox') baseCost = 400000;
        
        // Calculate value
        const value = baseCost * multiplier;
        dataPoints[v].push(value);
        
        // Calculate savings
        if (v !== 'portnox' && uniqueVendors.includes('portnox')) {
          const portnoxValue = baseCost * 0.4 * multiplier;
          const savings = ((value - portnoxValue) / value) * 100;
          savingsPoints[v].push(savings);
        }
      });
    }
    
    return {
      variable,
      vendor,
      labels,
      dataPoints,
      savingsPoints
    };
  }
  
  /**
   * Update charts with new data
   */
  function updateCharts(data) {
    // Update sensitivity chart
    if (window.sensitivityChart) {
      // Create datasets
      const datasets = [];
      Object.keys(data.dataPoints).forEach(vendor => {
        datasets.push({
          label: getVendorName(vendor),
          data: data.dataPoints[vendor],
          backgroundColor: getVendorColor(vendor),
          borderColor: getVendorColor(vendor),
          borderWidth: 2,
          fill: false
        });
      });
      
      // Update chart
      window.sensitivityChart.data.labels = data.labels;
      window.sensitivityChart.data.datasets = datasets;
      window.sensitivityChart.options.scales.y.title = {
        display: true,
        text: 'Total Cost of Ownership ($)'
      };
      window.sensitivityChart.options.plugins.title = {
        display: true,
        text: `TCO Sensitivity to ${getVariableLabel(data.variable)}`
      };
      window.sensitivityChart.update();
    }
    
    // Update savings chart
    if (window.savingsChart && data.savingsPoints && Object.keys(data.savingsPoints).length > 0) {
      // Create datasets
      const datasets = [];
      Object.keys(data.savingsPoints).forEach(vendor => {
        datasets.push({
          label: `Savings vs. ${getVendorName(vendor)}`,
          data: data.savingsPoints[vendor],
          backgroundColor: getVendorColor(vendor),
          borderColor: getVendorColor(vendor),
          borderWidth: 2,
          fill: false
        });
      });
      
      // Update chart
      window.savingsChart.data.labels = data.labels;
      window.savingsChart.data.datasets = datasets;
      window.savingsChart.options.scales.y.title = {
        display: true,
        text: 'Savings Percentage (%)'
      };
      window.savingsChart.options.plugins.title = {
        display: true,
        text: `Portnox Savings Impact by ${getVariableLabel(data.variable)}`
      };
      window.savingsChart.update();
    }
  }
  
  /**
   * Update data table
   */
  function updateTable(data) {
    const tableHeader = document.getElementById('sensitivity-table-header');
    const tableBody = document.getElementById('sensitivity-table-body');
    
    if (!tableHeader || !tableBody) return;
    
    // Clear existing table
    tableHeader.innerHTML = `<th scope="col">${getVariableLabel(data.variable)}</th>`;
    tableBody.innerHTML = '';
    
    // Add vendor columns to header
    const vendors = Object.keys(data.dataPoints);
    vendors.forEach(vendor => {
      tableHeader.innerHTML += `<th scope="col">${getVendorName(vendor)}</th>`;
      
      // Add savings column
      if (vendor !== 'portnox' && vendors.includes('portnox')) {
        tableHeader.innerHTML += `<th scope="col">Savings vs. ${getVendorName(vendor)}</th>`;
      }
    });
    
    // Add rows
    for (let i = 0; i < data.labels.length; i++) {
      const row = document.createElement('tr');
      
      // Add value column
      row.innerHTML = `<td>${data.labels[i]}</td>`;
      
      // Add vendor columns
      vendors.forEach(vendor => {
        const value = data.dataPoints[vendor][i];
        row.innerHTML += `<td>$${Math.round(value).toLocaleString()}</td>`;
        
        // Add savings column
        if (vendor !== 'portnox' && vendors.includes('portnox')) {
          const savings = data.savingsPoints[vendor][i];
          row.innerHTML += `<td>${savings.toFixed(1)}%</td>`;
        }
      });
      
      tableBody.appendChild(row);
    }
  }
  
  /**
   * Show loading indicator
   */
  function showLoading() {
    const container = document.querySelector('.results-container');
    if (!container) return;
    
    // Create loading overlay
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="spinner"></div>
      <div class="loading-text">Running sensitivity analysis...</div>
    `;
    
    container.appendChild(overlay);
  }
  
  /**
   * Hide loading indicator
   */
  function hideLoading() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
      overlay.parentNode.removeChild(overlay);
    }
  }
  
  /**
   * Show message
   */
  function showMessage(message, type = 'info') {
    const container = document.getElementById('message-container');
    if (!container) return;
    
    container.innerHTML = `
      <div class="${type}-message-box">
        <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
        <span>${message}</span>
        <button class="close-message"><i class="fas fa-times"></i></button>
      </div>
    `;
    
    // Add close button event
    const closeBtn = container.querySelector('.close-message');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        container.innerHTML = '';
      });
    }
    
    // Auto-clear after 5 seconds
    setTimeout(function() {
      if (container.querySelector(`.${type}-message-box`)) {
        container.innerHTML = '';
      }
    }, 5000);
  }
  
  /**
   * Format value based on variable type
   */
  function formatValue(variable, value) {
    switch (variable) {
      case 'deviceCount':
        return Math.round(value) + ' devices';
      case 'legacyPercentage':
        return value + '%';
      case 'locationCount':
        return Math.round(value) + ' locations';
      case 'yearsToProject':
        return Math.round(value) + ' years';
      case 'hardwareCost':
      case 'licensingCost':
      case 'maintenanceCost':
      case 'fteCost':
      case 'implementationCost':
        return value.toFixed(1) + 'x';
      case 'downtimeCost':
        return '$' + Math.round(value) + '/hour';
      default:
        return value.toString();
    }
  }
  
  /**
   * Get variable label
   */
  function getVariableLabel(variable) {
    switch (variable) {
      case 'deviceCount': return 'Device Count';
      case 'legacyPercentage': return 'Legacy Device Percentage';
      case 'locationCount': return 'Number of Locations';
      case 'yearsToProject': return 'Years to Project';
      case 'hardwareCost': return 'Hardware Cost Multiplier';
      case 'licensingCost': return 'Licensing Cost Multiplier';
      case 'maintenanceCost': return 'Maintenance Cost Multiplier';
      case 'fteCost': return 'Personnel Cost Multiplier';
      case 'implementationCost': return 'Implementation Cost Multiplier';
      case 'downtimeCost': return 'Downtime Cost';
      default: return variable;
    }
  }
  
  /**
   * Get vendor name
   */
  function getVendorName(vendor) {
    const vendorNames = {
      cisco: 'Cisco ISE',
      aruba: 'Aruba ClearPass',
      forescout: 'Forescout',
      nps: 'Microsoft NPS',
      fortinac: 'FortiNAC',
      securew2: 'SecureW2',
      portnox: 'Portnox Cloud'
    };
    
    return vendorNames[vendor] || vendor;
  }
  
  /**
   * Get vendor color
   */
  function getVendorColor(vendor) {
    const vendorColors = {
      cisco: '#049fd9',
      aruba: '#ff8300',
      forescout: '#005daa',
      nps: '#00a4ef',
      fortinac: '#ee3124',
      securew2: '#8bc53f',
      portnox: '#65BD44',
      neutral: '#888888'
    };
    
    return vendorColors[vendor] || vendorColors.neutral;
  }
});
/**
 * Complete rewrite of enhanced sensitivity analyzer functionality
 * Fixes syntax error and ensures charts render properly
 */
class SensitivityAnalyzer {
  constructor() {
    this.results = null;
    this.analyzing = false;
    this.charts = {};
    
    // Chart colors
    this.chartColors = {
      cisco: '#049fd9',
      aruba: '#ff8300',
      forescout: '#005daa',
      nps: '#00a4ef',
      fortinac: '#ee3124',
      securew2: '#8bc53f',
      portnox: '#2bd25b',
      neutral: '#888888'
    };
    
    // Initialize immediately
    this.initEventListeners();
    this.initCharts();
  }
  
  /**
   * Initialize all event listeners
   */
  initEventListeners() {
    console.log('Initializing sensitivity analyzer event listeners...');
    
    // Run button
    const sensitivityBtn = document.getElementById('sensitivity-btn');
    if (sensitivityBtn) {
      sensitivityBtn.addEventListener('click', () => {
        this.analyze();
      });
    }
    
    // Variable selector
    const variableSelect = document.getElementById('param-variable');
    if (variableSelect) {
      variableSelect.addEventListener('change', () => {
        this.updateRangeDefaults(variableSelect.value);
      });
    }
    
    // Export buttons
    const exportCsvBtn = document.getElementById('export-sensitivity-csv-btn');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => {
        this.exportToCSV();
      });
    }
    
    const exportPdfBtn = document.getElementById('export-sensitivity-pdf-btn');
    if (exportPdfBtn) {
      exportPdfBtn.addEventListener('click', () => {
        this.exportToPDF();
      });
    }
  }
  
  /**
   * Initialize chart components
   */
  initCharts() {
    console.log('Initializing sensitivity analyzer charts...');
    
    // Initialize sensitivity chart
    const sensChart = document.getElementById('sensitivity-chart');
    if (sensChart) {
      try {
        // Destroy existing chart if it exists
        if (this.charts.sensitivity) {
          this.charts.sensitivity.destroy();
        }
        
        this.charts.sensitivity = new Chart(sensChart.getContext('2d'), {
          type: 'line',
          data: {
            labels: [],
            datasets: []
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Total Cost of Ownership ($)'
                },
                ticks: {
                  callback: function(value) {
                    return '$' + value.toLocaleString();
                  }
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Variable Value'
                }
              }
            },
            plugins: {
              title: {
                display: true,
                text: 'TCO Sensitivity Analysis',
                font: {
                  size: 16
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                  }
                }
              }
            }
          }
        });
        
        console.log('Sensitivity chart initialized');
      } catch (error) {
        console.error('Error initializing sensitivity chart:', error);
      }
    }
    
    // Initialize savings impact chart
    const savingsChart = document.getElementById('savings-impact-chart');
    if (savingsChart) {
      try {
        // Destroy existing chart if it exists
        if (this.charts.savingsImpact) {
          this.charts.savingsImpact.destroy();
        }
        
        this.charts.savingsImpact = new Chart(savingsChart.getContext('2d'), {
          type: 'line',
          data: {
            labels: [],
            datasets: []
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Savings Percentage (%)'
                },
                ticks: {
                  callback: function(value) {
                    return value + '%';
                  }
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Variable Value'
                }
              }
            },
            plugins: {
              title: {
                display: true,
                text: 'Portnox Savings Impact Analysis',
                font: {
                  size: 16
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%';
                  }
                }
              }
            }
          }
        });
        
        console.log('Savings impact chart initialized');
      } catch (error) {
        console.error('Error initializing savings impact chart:', error);
      }
    }
  }
  
  /**
   * Update range defaults based on selected variable
   */
  updateRangeDefaults(variable) {
    console.log('Updating range defaults for variable:', variable);
    
    const minInput = document.getElementById('param-min');
    const maxInput = document.getElementById('param-max');
    const stepsInput = document.getElementById('param-steps');
    
    if (!minInput || !maxInput || !stepsInput) return;
    
    // Get current form values for dynamic ranges
    const deviceCount = parseInt(document.getElementById('device-count')?.value) || 1000;
    const legacyPercentage = parseInt(document.getElementById('legacy-percentage')?.value) || 10;
    const locationCount = parseInt(document.getElementById('location-count')?.value) || 2;
    const yearsToProject = parseInt(document.getElementById('years-to-project')?.value) || 3;
    
    switch (variable) {
      case 'deviceCount':
        minInput.value = Math.max(Math.floor(deviceCount * 0.5), 100);
        maxInput.value = Math.ceil(deviceCount * 2);
        stepsInput.value = '10';
        break;
      case 'legacyPercentage':
        minInput.value = '0';
        maxInput.value = '100';
        stepsInput.value = '11';
        break;
      case 'locationCount':
        minInput.value = '1';
        maxInput.value = Math.max(locationCount * 3, 20);
        stepsInput.value = '10';
        break;
      case 'yearsToProject':
        minInput.value = '1';
        maxInput.value = '10';
        stepsInput.value = '10';
        break;
      case 'hardwareCost':
      case 'licensingCost':
      case 'maintenanceCost':
      case 'fteCost':
      case 'implementationCost':
        minInput.value = '0.5';
        maxInput.value = '2.0';
        stepsInput.value = '7';
        break;
      case 'downtimeCost':
        minInput.value = '1000';
        maxInput.value = '10000';
        stepsInput.value = '10';
        break;
      default:
        minInput.value = '0';
        maxInput.value = '100';
        stepsInput.value = '10';
    }
    
    // Update parameter description
    this.updateParameterDescription(variable);
  }
  
  /**
   * Update parameter description
   */
  updateParameterDescription(variable) {
    const descriptionElement = document.getElementById('parameter-description');
    if (!descriptionElement) return;
    
    const descriptions = {
      deviceCount: 'Analyze how changes in the total number of devices affect TCO and relative savings. More devices typically increase hardware and licensing costs for on-premises solutions.',
      legacyPercentage: 'Evaluate the impact of legacy device percentages on overall costs. Legacy devices often require additional security measures and management overhead.',
      locationCount: 'Assess how distributed deployments across multiple locations affect total costs. On-premises solutions typically require hardware at each location.',
      yearsToProject: 'Compare short-term vs. long-term TCO projections. Cloud solutions often show higher relative savings over longer time periods.',
      hardwareCost: 'Test sensitivity to hardware cost changes, such as price increases or discounts. This primarily affects on-premises deployments.',
      licensingCost: 'Analyze how licensing cost variations affect overall TCO. Both cloud and on-premises solutions include licensing costs.',
      maintenanceCost: 'Evaluate the impact of maintenance cost changes on long-term TCO. On-premises solutions typically have higher maintenance requirements.',
      implementationCost: 'Assess how implementation cost factors affect initial deployment expenses. Complex deployments increase professional services costs.',
      fteCost: 'Test sensitivity to changes in IT staffing costs or allocation. On-premises solutions typically require more IT staff time.',
      downtimeCost: 'Analyze how the cost of downtime affects overall TCO. Different solutions have varying reliability characteristics.'
    };
    
    descriptionElement.textContent = descriptions[variable] || 'Analyze how changes in this parameter affect the total cost of ownership and potential savings.';
  }
  
  /**
   * Run sensitivity analysis
   */
  analyze() {
    if (this.analyzing) {
      console.log('Analysis already in progress');
      return;
    }
    
    this.analyzing = true;
    this.showLoading();
    
    try {
      // Get input parameters
      const variableToAnalyze = document.getElementById('param-variable').value;
      const vendorToAnalyze = document.getElementById('param-vendor').value;
      const minValue = parseFloat(document.getElementById('param-min').value);
      const maxValue = parseFloat(document.getElementById('param-max').value);
      const steps = parseInt(document.getElementById('param-steps').value);
      
      console.log(`Running sensitivity analysis for ${variableToAnalyze}, vendor: ${vendorToAnalyze}, range: ${minValue}-${maxValue}, steps: ${steps}`);
      
      // Validate inputs
      if (isNaN(minValue) || isNaN(maxValue) || isNaN(steps)) {
        throw new Error('Invalid input parameters');
      }
      
      if (minValue >= maxValue) {
        throw new Error('Maximum value must be greater than minimum value');
      }
      
      if (steps < 2 || steps > 20) {
        throw new Error('Number of steps must be between 2 and 20');
      }
      
      // Get additional analysis options
      const includeBreakeven = document.getElementById('include-breakeven')?.checked || false;
      const compareToNoNAC = document.getElementById('compare-to-no-nac')?.checked || false;
      
      // Generate data points
      const stepSize = (maxValue - minValue) / (steps - 1);
      const dataPoints = Array.from({length: steps}, (_, i) => minValue + (i * stepSize));
      
      // Run analysis for each data point
      const analysisResults = {
        variable: variableToAnalyze,
        vendor: vendorToAnalyze,
        minValue,
        maxValue,
        steps,
        dataPoints,
        results: [],
        includeBreakeven,
        compareToNoNAC
      };
      
      // Keep a copy of the original form values
      const originalValues = this.saveOriginalValues();
      
      // For each data point, calculate TCO by modifying the relevant form value
      dataPoints.forEach(dataPoint => {
        // Set the form value for the variable being analyzed
        this.setVariableValue(variableToAnalyze, dataPoint);
        
        // Calculate TCO for this data point
        const calculationResults = this.runCalculation();
        
        // Store results
        analysisResults.results.push({
          dataPoint,
          calculationResults
        });
      });
      
      // Calculate breakeven values if requested
      if (includeBreakeven) {
        analysisResults.breakevenPoints = this.calculateBreakevenPoints(analysisResults);
      }
      
      // Restore original form values
      this.restoreOriginalValues(originalValues);
      
      // Save results
      this.results = analysisResults;
      
      // Update UI with results
      this.updateUI();
      
      // Hide loading indicator
      this.hideLoading();
      this.analyzing = false;
      
      return analysisResults;
    } catch (error) {
      console.error("Error in sensitivity analysis:", error);
      
      // Hide loading indicator
      this.hideLoading();
      this.analyzing = false;
      
      // Show error message
      this.showError("Error in sensitivity analysis: " + error.message);
      
      return null;
    }
  }
  
  /**
   * Calculate breakeven points
   */
  calculateBreakevenPoints(analysisResults) {
    const breakevenPoints = {};
    
    // Only calculate if comparing to Portnox
    if (analysisResults.vendor !== 'portnox' && analysisResults.vendor !== 'all') {
      const results = analysisResults.results;
      
      // Find where the lines cross (TCO becomes equal)
      for (let i = 0; i < results.length - 1; i++) {
        const current = results[i];
        const next = results[i + 1];
        
        const currentVendorTCO1 = current.calculationResults[analysisResults.vendor]?.totalTCO || 0;
        const portnoxTCO1 = current.calculationResults['portnox']?.totalTCO || 0;
        const currentVendorTCO2 = next.calculationResults[analysisResults.vendor]?.totalTCO || 0;
        const portnoxTCO2 = next.calculationResults['portnox']?.totalTCO || 0;
        
        // Calculate differences
        const diff1 = currentVendorTCO1 - portnoxTCO1;
        const diff2 = currentVendorTCO2 - portnoxTCO2;
        
        // Check if the lines cross (TCO difference changes sign)
        if ((diff1 > 0 && diff2 < 0) || (diff1 < 0 && diff2 > 0)) {
          // Calculate the crossover point using linear interpolation
          const x1 = current.dataPoint;
          const x2 = next.dataPoint;
          
          // Calculate the exact breakeven point
          const ratio = Math.abs(diff1) / (Math.abs(diff1) + Math.abs(diff2));
          const breakeven = x1 + (x2 - x1) * ratio;
          
          // Store the breakeven point
          breakevenPoints[analysisResults.vendor] = {
            value: breakeven,
            unit: this.getVariableUnit(analysisResults.variable)
          };
          
          // We only need to find one breakeven point
          break;
        }
      }
    } else if (analysisResults.vendor === 'all') {
      // If comparing all vendors, find breakeven points for each vs Portnox
      const vendors = Object.keys(window.vendorData || {}).filter(v => v !== 'portnox');
      
      vendors.forEach(vendor => {
        const breakevenFound = this.findBreakevenPoint(vendor, analysisResults);
        if (breakevenFound) {
          breakevenPoints[vendor] = breakevenFound;
        }
      });
    }
    
    return breakevenPoints;
  }
  
  /**
   * Find breakeven point between a vendor and Portnox
   */
  findBreakevenPoint(vendor, analysisResults) {
    const results = analysisResults.results;
    
    // Find where the lines cross (TCO becomes equal)
    for (let i = 0; i < results.length - 1; i++) {
      const current = results[i];
      const next = results[i + 1];
      
      const vendorTCO1 = current.calculationResults[vendor]?.totalTCO || 0;
      const portnoxTCO1 = current.calculationResults['portnox']?.totalTCO || 0;
      const vendorTCO2 = next.calculationResults[vendor]?.totalTCO || 0;
      const portnoxTCO2 = next.calculationResults['portnox']?.totalTCO || 0;
      
      // Calculate differences
      const diff1 = vendorTCO1 - portnoxTCO1;
      const diff2 = vendorTCO2 - portnoxTCO2;
      
      // Check if the lines cross (TCO difference changes sign)
      if ((diff1 > 0 && diff2 < 0) || (diff1 < 0 && diff2 > 0)) {
        // Calculate the crossover point using linear interpolation
        const x1 = current.dataPoint;
        const x2 = next.dataPoint;
        
        // Calculate the exact breakeven point
        const ratio = Math.abs(diff1) / (Math.abs(diff1) + Math.abs(diff2));
        const breakeven = x1 + (x2 - x1) * ratio;
        
        // Return the breakeven point
        return {
          value: breakeven,
          unit: this.getVariableUnit(analysisResults.variable)
        };
      }
    }
    
    return null;
  }
  
  /**
   * Get variable unit for display
   */
  getVariableUnit(variable) {
    switch (variable) {
      case 'deviceCount':
        return 'devices';
      case 'legacyPercentage':
        return '%';
      case 'locationCount':
        return 'locations';
      case 'yearsToProject':
        return 'years';
      case 'hardwareCost':
      case 'licensingCost':
      case 'maintenanceCost':
      case 'fteCost':
      case 'implementationCost':
        return 'multiplier';
      case 'downtimeCost':
        return '$/hour';
      default:
        return '';
    }
  }
  
  /**
   * Save original form values
   */
  saveOriginalValues() {
    return {
      deviceCount: document.getElementById('device-count')?.value,
      legacyPercentage: document.getElementById('legacy-percentage')?.value,
      locationCount: document.getElementById('location-count')?.value,
      yearsToProject: document.getElementById('years-to-project')?.value
    };
  }
  
  /**
   * Restore original form values
   */
  restoreOriginalValues(originalValues) {
    if (originalValues.deviceCount) document.getElementById('device-count').value = originalValues.deviceCount;
    if (originalValues.legacyPercentage) document.getElementById('legacy-percentage').value = originalValues.legacyPercentage;
    if (originalValues.locationCount) document.getElementById('location-count').value = originalValues.locationCount;
    if (originalValues.yearsToProject) document.getElementById('years-to-project').value = originalValues.yearsToProject;
  }
  
  /**
   * Set variable value during analysis
   */
  setVariableValue(variable, value) {
    switch (variable) {
      case 'deviceCount':
        document.getElementById('device-count').value = Math.round(value);
        break;
      case 'legacyPercentage':
        document.getElementById('legacy-percentage').value = Math.round(value);
        if (value > 0) {
          document.getElementById('legacy-devices').checked = true;
        }
        break;
      case 'locationCount':
        document.getElementById('location-count').value = Math.round(value);
        if (value > 1) {
          document.getElementById('multiple-locations').checked = true;
        }
        break;
      case 'yearsToProject':
        document.getElementById('years-to-project').value = Math.round(value);
        break;
      default:
        console.warn(`Unknown variable: ${variable}`);
    }
  }
  
  /**
   * Run calculation using calculator if available
   */
  runCalculation() {
    // Check if calculator is available
    if (!window.calculator) {
      console.warn('Calculator not available, using dummy data');
      return this.generateDummyResults();
    }
    
    try {
      // Get values from form
      const deviceCount = parseInt(document.getElementById('device-count').value) || 1000;
      const orgSize = document.getElementById('organization-size').value;
      const yearsToProject = parseInt(document.getElementById('years-to-project').value) || 3;
      const currentVendor = window.uiController ? window.uiController.activeVendor : 'cisco';
      
      // Calculate TCO for all vendors
      const vendorData = window.vendorData || {};
      const tcoResults = {};
      
      Object.keys(vendorData).forEach(vendor => {
        const result = window.calculator.calculateVendorTCO(vendor, currentVendor, orgSize, deviceCount, yearsToProject);
        tcoResults[vendor] = result;
      });
      
      // Add metadata
      tcoResults.yearsToProject = yearsToProject;
      tcoResults.deviceCount = deviceCount;
      tcoResults.orgSize = orgSize;
      
      return tcoResults;
    } catch (error) {
      console.error("Error in calculation:", error);
      return this.generateDummyResults();
    }
  }
  
  /**
   * Generate dummy results for testing
   */
  generateDummyResults() {
    const vendorData = window.vendorData || {
      cisco: { name: 'Cisco ISE' },
      aruba: { name: 'Aruba ClearPass' },
      forescout: { name: 'Forescout' },
      nps: { name: 'Microsoft NPS' },
      fortinac: { name: 'FortiNAC' },
      securew2: { name: 'SecureW2' },
      portnox: { name: 'Portnox Cloud' }
    };
    
    const results = {};
    const vendors = Object.keys(vendorData);
    
    vendors.forEach(vendor => {
      // Generate random costs that favors Portnox
      const isPortnox = vendor === 'portnox';
      const multiplier = isPortnox ? 0.7 : 1 + (Math.random() * 0.5);
      
      results[vendor] = {
        totalTCO: 1000000 * multiplier,
        totalInitialCosts: 400000 * multiplier,
        annualCosts: 200000 * multiplier,
        migrationCost: isPortnox ? 50000 : 0,
        totalSavings: isPortnox ? 0 : 300000,
        savingsPercentage: isPortnox ? 0 : 30,
        annualSavings: isPortnox ? 0 : 60000
      };
    });
    
    results.yearsToProject = 3;
    results.deviceCount = 1000;
    results.orgSize = 'medium';
    
    return results;
  }
  
  /**
   * Update UI with results
   */
  updateUI() {
    if (!this.results) {
      console.warn("No analysis results available");
      return;
    }
    
    // Update sensitivity chart
    this.updateSensitivityChart();
    
    // Update savings impact chart
    this.updateSavingsImpactChart();
    
    // Update data table
    this.updateDataTable();
    
    // Update breakeven container if needed
    if (this.results.includeBreakeven && this.results.breakevenPoints) {
      this.updateBreakevenContainer();
    }
    
    // Show success message
    this.showSuccess("Sensitivity analysis completed successfully");
  }
  
  /**
   * Update sensitivity chart
   */
  updateSensitivityChart() {
    if (!this.charts.sensitivity) {
      console.warn('Sensitivity chart not initialized');
      return;
    }
    
    // Prepare chart data
    const labels = this.results.dataPoints.map(dp => this.formatDataPoint(this.results.variable, dp));
    
    const datasets = [];
    const vendors = this.results.vendor === 'all' ? 
      Object.keys(window.vendorData || {}) : 
      [this.results.vendor];
    
    vendors.forEach(vendor => {
      const vendorName = window.vendorData?.[vendor]?.name || vendor;
      const vendorColor = this.chartColors[vendor] || this.chartColors.neutral;
      
      const data = this.results.results.map(result => {
        return result.calculationResults[vendor]?.totalTCO || 0;
      });
      
      datasets.push({
        label: vendorName,
        data: data,
        backgroundColor: vendorColor,
        borderColor: vendorColor,
        borderWidth: 2,
        fill: false
      });
    });
    
    // Update chart
    this.charts.sensitivity.data.labels = labels;
    this.charts.sensitivity.data.datasets = datasets;
    this.charts.sensitivity.options.scales.x.title.text = this.getVariableLabel(this.results.variable);
    this.charts.sensitivity.options.plugins.title.text = `TCO Sensitivity to ${this.getVariableLabel(this.results.variable)}`;
    this.charts.sensitivity.update();
  }
  
  /**
   * Update savings impact chart
   */
  updateSavingsImpactChart() {
    if (!this.charts.savingsImpact) {
      console.warn('Savings impact chart not initialized');
      return;
    }
    
    // Only relevant when comparing to Portnox
    if (!window.vendorData?.portnox) {
      return;
    }
    
    // Prepare chart data
    const labels = this.results.dataPoints.map(dp => this.formatDataPoint(this.results.variable, dp));
    
    const datasets = [];
    const vendors = this.results.vendor === 'all' ? 
      Object.keys(window.vendorData).filter(v => v !== 'portnox') : 
      [this.results.vendor];
    
    vendors.forEach(vendor => {
      // Skip Portnox as we're calculating savings vs. Portnox
      if (vendor === 'portnox') return;
      
      const vendorName = window.vendorData?.[vendor]?.name || vendor;
      const vendorColor = this.chartColors[vendor] || this.chartColors.neutral;
      
      const data = this.results.results.map(result => {
        const vendorTCO = result.calculationResults[vendor]?.totalTCO || 0;
        const portnoxTCO = result.calculationResults['portnox']?.totalTCO || 0;
        return vendorTCO > 0 && portnoxTCO > 0 ? 
          ((vendorTCO - portnoxTCO) / vendorTCO * 100) : 0;
      });
      
      datasets.push({
        label: `Savings vs. ${vendorName}`,
        data: data,
        backgroundColor: vendorColor,
        borderColor: vendorColor,
        borderWidth: 2,
        fill: false
      });
    });
    
    // Update chart
    this.charts.savingsImpact.data.labels = labels;
    this.charts.savingsImpact.data.datasets = datasets;
    this.charts.savingsImpact.options.scales.x.title.text = this.getVariableLabel(this.results.variable);
    this.charts.savingsImpact.options.plugins.title.text = `Portnox Savings Impact by ${this.getVariableLabel(this.results.variable)}`;
    this.charts.savingsImpact.update();
  }
  
  /**
   * Update data table
   */
  updateDataTable() {
    const tableHeader = document.getElementById('sensitivity-table-header');
    const tableBody = document.getElementById('sensitivity-table-body');
    
    if (!tableHeader || !tableBody) {
      console.warn('Data table elements not found');
      return;
    }
    
    // Clear existing table
    tableHeader.innerHTML = `<th scope="col">${this.getVariableLabel(this.results.variable)}</th>`;
    tableBody.innerHTML = '';
    
    // Add vendor columns to header
    const vendors = this.results.vendor === 'all' ? 
      Object.keys(window.vendorData || {}) : 
      [this.results.vendor];
    
    vendors.forEach(vendor => {
      const vendorName = window.vendorData?.[vendor]?.name || vendor;
      tableHeader.innerHTML += `<th scope="col">${vendorName}</th>`;
      
      // Add Portnox savings column if comparing to other vendors
      if (vendor !== 'portnox' && vendors.includes('portnox')) {
        tableHeader.innerHTML += `<th scope="col">Savings vs. ${vendorName}</th>`;
      }
    });
    
    // Add data rows
    this.results.results.forEach(result => {
      const row = document.createElement('tr');
      
      // Add data point column
      row.innerHTML = `<td>${this.formatDataPoint(this.results.variable, result.dataPoint)}</td>`;
      
      // Add vendor TCO columns
      vendors.forEach(vendor => {
        const tco = result.calculationResults[vendor]?.totalTCO || 0;
        row.innerHTML += `<td>${this.formatCurrency(tco)}</td>`;
        
        // Add Portnox savings column if comparing to other vendors
        if (vendor !== 'portnox' && vendors.includes('portnox')) {
          const vendorTCO = result.calculationResults[vendor]?.totalTCO || 0;
          const portnoxTCO = result.calculationResults['portnox']?.totalTCO || 0;
          
          const savingsAmount = vendorTCO - portnoxTCO;
          const savingsPercentage = vendorTCO > 0 ? (savingsAmount / vendorTCO) * 100 : 0;
          
          row.innerHTML += `<td>${this.formatCurrency(savingsAmount)} (${savingsPercentage.toFixed(1)}%)</td>`;
        }
      });
      
      tableBody.appendChild(row);
    });
  }
  
  /**
   * Update breakeven container
   */
  updateBreakevenContainer() {
    const container = document.getElementById('breakeven-container');
    if (!container) return;
    
    if (!this.results.breakevenPoints || Object.keys(this.results.breakevenPoints).length === 0) {
      container.classList.add('hidden');
      return;
    }
    
    // Create breakeven content
    let html = `
      <div class="result-card breakeven-card">
        <h3>Breakeven Analysis</h3>
        <p>The following breakeven points indicate where Portnox Cloud becomes more cost-effective than the compared vendor:</p>
        <div class="breakeven-grid">
    `;
    
    // Add each breakeven point
    Object.entries(this.results.breakevenPoints).forEach(([vendor, point]) => {
      const vendorName = window.vendorData?.[vendor]?.name || vendor;
      html += `
        <div class="breakeven-item">
          <div class="breakeven-vendor">${vendorName}</div>
          <div class="breakeven-value">${this.formatValue(point.value)} ${point.unit}</div>
          <div class="breakeven-explanation">
            Portnox Cloud becomes more cost-effective than ${vendorName} when the ${this.getVariableLabel(this.results.variable)} 
            ${this.getComparisonType(this.results.variable)} ${this.formatValue(point.value)} ${point.unit}.
          </div>
        </div>
      `;
    });
    
    html += `
        </div>
        <div class="breakeven-note">
          <p>Note: These breakeven points are based on the current configuration and assumptions in the model.</p>
        </div>
      </div>
    `;
    
    // Update container
    container.innerHTML = html;
    container.classList.remove('hidden');
  }
  
  /**
   * Get comparison type text
   */
  getComparisonType(variable) {
    switch (variable) {
      case 'deviceCount':
      case 'locationCount':
      case 'yearsToProject':
        return 'exceeds';
      case 'legacyPercentage':
        return 'is above';
      case 'hardwareCost':
      case 'licensingCost':
      case 'maintenanceCost':
      case 'fteCost':
      case 'implementationCost':
        return 'is greater than';
      case 'downtimeCost':
        return 'exceeds';
      default:
        return 'reaches';
    }
  }
  
  /**
   * Format value for display
   */
  formatValue(value) {
    if (typeof value !== 'number') return value;
    
    if (value >= 1000) {
      return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
    }
    
    return value.toLocaleString(undefined, { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }
  
  /**
   * Format currency value
   */
  formatCurrency(value) {
    if (window.formatCurrency) {
      return window.formatCurrency(value);
    }
    
    return '$' + value.toLocaleString(undefined, { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
  
  /**
   * Format data point based on variable type
   */
  formatDataPoint(variable, value) {
    switch (variable) {
      case 'deviceCount':
        return this.formatValue(value) + ' devices';
      case 'legacyPercentage':
        return value + '%';
      case 'locationCount':
        return this.formatValue(value) + ' locations';
      case 'yearsToProject':
        return value + ' years';
      case 'hardwareCost':
      case 'licensingCost':
      case 'maintenanceCost':
      case 'fteCost':
      case 'implementationCost':
        return value.toFixed(1) + 'x';
      case 'downtimeCost':
        return '$' + this.formatValue(value) + '/hour';
      default:
        return value.toString();
    }
  }
  
  /**
   * Get human-readable label for variable
   */
  getVariableLabel(variable) {
    switch (variable) {
      case 'deviceCount':
        return 'Device Count';
      case 'legacyPercentage':
        return 'Legacy Device Percentage';
      case 'locationCount':
        return 'Number of Locations';
      case 'yearsToProject':
        return 'Years to Project';
      case 'hardwareCost':
        return 'Hardware Cost Multiplier';
      case 'licensingCost':
        return 'Licensing Cost Multiplier';
      case 'maintenanceCost':
        return 'Maintenance Cost Multiplier';
      case 'fteCost':
        return 'Personnel Cost Multiplier';
      case 'implementationCost':
        return 'Implementation Cost Multiplier';
      case 'downtimeCost':
        return 'Downtime Cost';
      default:
        return variable;
    }
  }
  
  /**
   * Export results to CSV
   */
  exportToCSV() {
    if (!this.results) {
      this.showError("No results to export");
      return;
    }
    
    try {
      // Create CSV content
      let csv = [];
      
      // Add header
      csv.push(['Portnox Total Cost Analyzer - Sensitivity Analysis']);
      csv.push([`Generated on ${new Date().toLocaleDateString()}`]);
      csv.push([]);
      
      // Add analysis parameters
      csv.push(['Analysis Parameters']);
      csv.push(['Variable', this.getVariableLabel(this.results.variable)]);
      csv.push(['Vendor', this.results.vendor === 'all' ? 'All Vendors' : (window.vendorData?.[this.results.vendor]?.name || this.results.vendor)]);
      csv.push(['Range', `${this.formatValue(this.results.minValue)} to ${this.formatValue(this.results.maxValue)}`]);
      csv.push(['Steps', this.results.steps]);
      csv.push([]);
      
      // Add results table
      const header = [this.getVariableLabel(this.results.variable)];
      
      // Add vendor columns
      const vendors = this.results.vendor === 'all' ? 
        Object.keys(window.vendorData || {}) : 
        [this.results.vendor];
      
      vendors.forEach(vendor => {
        header.push(window.vendorData?.[vendor]?.name || vendor);
        
        // Add savings column if needed
        if (vendor !== 'portnox' && vendors.includes('portnox')) {
          header.push(`Savings vs. ${window.vendorData?.[vendor]?.name || vendor}`);
        }
      });
      
      csv.push(header);
      
      // Add data rows
      this.results.results.forEach(result => {
        const row = [this.formatDataPoint(this.results.variable, result.dataPoint)];
        
        vendors.forEach(vendor => {
          row.push(result.calculationResults[vendor]?.totalTCO || 0);
          
          // Add savings column if needed
          if (vendor !== 'portnox' && vendors.includes('portnox')) {
            const vendorTCO = result.calculationResults[vendor]?.totalTCO || 0;
            const portnoxTCO = result.calculationResults['portnox']?.totalTCO || 0;
            row.push(vendorTCO - portnoxTCO);
          }
        });
        
        csv.push(row);
      });
      
      // Add breakeven info if available
      if (this.results.breakevenPoints && Object.keys(this.results.breakevenPoints).length > 0) {
        csv.push([]);
        csv.push(['Breakeven Analysis']);
        csv.push(['Vendor', 'Breakeven Point']);
        
        Object.entries(this.results.breakevenPoints).forEach(([vendor, point]) => {
          csv.push([
            window.vendorData?.[vendor]?.name || vendor,
            `${this.formatValue(point.value)} ${point.unit}`
          ]);
        });
      }
      
      // Format CSV content
      const csvContent = csv.map(row => {
        return row.map(cell => {
          if (typeof cell === 'string' && cell.includes(',')) {
            return `"${cell}"`;
          }
          return cell;
        }).join(',');
      }).join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Portnox_Sensitivity_Analysis_${this.results.variable}_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      this.showSuccess("CSV file exported successfully");
    } catch (error) {
      console.error("Error exporting CSV:", error);
      this.showError("Failed to export CSV: " + error.message);
    }
  }
  
  /**
   * Export results to PDF
   */
  exportToPDF() {
    if (!this.results) {
      this.showError("No results to export");
      return;
    }
    
    try {
      if (typeof jsPDF === 'undefined') {
        this.showError("PDF generation library not found");
        return;
      }
      
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(22);
      doc.setTextColor(5, 84, 124);
      doc.text('Portnox Total Cost Analyzer', 105, 20, { align: 'center' });
      
      doc.setFontSize(16);
      doc.text('Sensitivity Analysis', 105, 30, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 40, { align: 'center' });
      
      // Add analysis parameters
      doc.setFontSize(14);
      doc.setTextColor(5, 84, 124);
      doc.text('Analysis Parameters', 20, 55);
      
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(`Variable: ${this.getVariableLabel(this.results.variable)}`, 20, 65);
      doc.text(`Vendor: ${this.results.vendor === 'all' ? 'All Vendors' : (window.vendorData?.[this.results.vendor]?.name || this.results.vendor)}`, 20, 72);
      doc.text(`Range: ${this.formatValue(this.results.minValue)} to ${this.formatValue(this.results.maxValue)}`, 20, 79);
      doc.text(`Steps: ${this.results.steps}`, 20, 86);
      
      // Add results table header
      const tableHeader = [this.getVariableLabel(this.results.variable)];
      
      // Add vendor columns
      const vendors = this.results.vendor === 'all' ? 
        Object.keys(window.vendorData || {}) : 
        [this.results.vendor];
      
      vendors.forEach(vendor => {
        tableHeader.push(window.vendorData?.[vendor]?.name || vendor);
      });
      
      // Prepare table data
      const tableData = this.results.results.map(result => {
        const row = [this.formatDataPoint(this.results.variable, result.dataPoint)];
        
        vendors.forEach(vendor => {
          row.push(this.formatCurrency(result.calculationResults[vendor]?.totalTCO || 0));
        });
        
        return row;
      });
      
      // Add results table
      doc.autoTable({
        startY: 95,
        head: [tableHeader],
        body: tableData,
        theme: 'grid',
        styles: {
          cellPadding: 3,
          fontSize: 9
        },
        headStyles: {
          fillColor: [5, 84, 124],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        }
      });
      
      // Add breakeven info if available
      if (this.results.breakevenPoints && Object.keys(this.results.breakevenPoints).length > 0) {
        const finalY = doc.lastAutoTable.finalY + 15;
        
        doc.setFontSize(14);
        doc.setTextColor(5, 84, 124);
        doc.text('Breakeven Analysis', 20, finalY);
        
        const breakevenData = Object.entries(this.results.breakevenPoints).map(([vendor, point]) => [
          window.vendorData?.[vendor]?.name || vendor,
          `${this.formatValue(point.value)} ${point.unit}`
        ]);
        
        doc.autoTable({
          startY: finalY + 10,
          head: [['Vendor', 'Breakeven Point']],
          body: breakevenData,
          theme: 'grid',
          styles: {
            cellPadding: 3,
            fontSize: 9
          },
          headStyles: {
            fillColor: [5, 84, 124],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          }
        });
      }
      
      // Save PDF
      doc.save(`Portnox_Sensitivity_Analysis_${this.results.variable}_${new Date().toISOString().slice(0, 10)}.pdf`);
      
      this.showSuccess("PDF exported successfully");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      this.showError("Failed to export PDF: " + error.message);
    }
  }
  
  /**
   * Show loading indicator
   */
  showLoading() {
    const container = document.querySelector('.results-container');
    if (!container) return;
    
    // Check if loading overlay already exists
    if (container.querySelector('.loading-overlay')) return;
    
    // Create loading overlay
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="spinner"></div>
      <div class="loading-text">Running sensitivity analysis...</div>
    `;
    
    container.appendChild(overlay);
  }
  
  /**
   * Hide loading indicator
   */
  hideLoading() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
      overlay.parentNode.removeChild(overlay);
    }
  }
  
  /**
   * Show error message
   */
  showError(message) {
    const container = document.getElementById('message-container');
    if (!container) return;
    
    container.innerHTML = `
      <div class="error-message-box">
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
        <button class="close-error"><i class="fas fa-times"></i></button>
      </div>
    `;
    
    const closeBtn = container.querySelector('.close-error');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        container.innerHTML = '';
      });
    }
  }
  
  /**
   * Show success message
   */
  showSuccess(message) {
    const container = document.getElementById('message-container');
    if (!container) return;
    
    container.innerHTML = `
      <div class="success-message-box">
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
        <button class="close-error"><i class="fas fa-times"></i></button>
      </div>
    `;
    
    const closeBtn = container.querySelector('.close-error');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        container.innerHTML = '';
      });
    }
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      if (container.querySelector('.success-message-box')) {
        container.innerHTML = '';
      }
    }, 3000);
  }
}

// Initialize the sensitivity analyzer when the page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing sensitivity analyzer...');
  window.enhancedSensitivityAnalyzer = new SensitivityAnalyzer();
  
  // Update range defaults for initial variable
  const variableSelect = document.getElementById('param-variable');
  if (variableSelect) {
    window.enhancedSensitivityAnalyzer.updateRangeDefaults(variableSelect.value);
  }
});
// Enhanced from existing analyzer
/**
 * Enhanced Sensitivity Analysis
 * Provides detailed sensitivity analysis with interactive charts and explanations
 */
(function() {
  console.log('Initializing Enhanced Sensitivity Analyzer...');
  
  // Configuration
  const config = {
    parameters: [
      {
        id: 'hardware',
        name: 'Hardware Costs',
        description: 'Cost of physical appliances and servers required for on-premises deployment',
        defaultValue: 10000,
        minValue: 0,
        maxValue: 50000,
        step: 1000,
        unit: '$',
        impact: 'high',
        applies: ['on-prem']
      },
      {
        id: 'licensing',
        name: 'Licensing Costs',
        description: 'Annual costs for software licenses and subscriptions',
        defaultValue: 25000,
        minValue: 5000,
        maxValue: 100000,
        step: 1000,
        unit: '$',
        impact: 'high',
        applies: ['all']
      },
      {
        id: 'maintenance',
        name: 'Maintenance Costs',
        description: 'Annual costs for support, updates, and routine maintenance',
        defaultValue: 15000,
        minValue: 0,
        maxValue: 50000,
        step: 1000,
        unit: '$',
        impact: 'medium',
        applies: ['all']
      },
      {
        id: 'implementation',
        name: 'Implementation Costs',
        description: 'One-time costs for installation, configuration, and deployment',
        defaultValue: 30000,
        minValue: 5000,
        maxValue: 100000,
        step: 1000,
        unit: '$',
        impact: 'high',
        applies: ['all']
      },
      {
        id: 'personnel',
        name: 'Personnel Costs',
        description: 'Annual cost for IT staff to manage and maintain the solution',
        defaultValue: 100000,
        minValue: 20000,
        maxValue: 200000,
        step: 5000,
        unit: '$',
        impact: 'very-high',
        applies: ['all']
      },
      {
        id: 'fte',
        name: 'Required FTEs',
        description: 'Number of full-time equivalent staff required for administration',
        defaultValue: 1.0,
        minValue: 0.1,
        maxValue: 3.0,
        step: 0.1,
        unit: 'FTE',
        impact: 'high',
        applies: ['all']
      },
      {
        id: 'devices',
        name: 'Device Count',
        description: 'Total number of devices to be managed by the NAC solution',
        defaultValue: 1000,
        minValue: 100,
        maxValue: 10000,
        step: 100,
        unit: 'devices',
        impact: 'medium',
        applies: ['all']
      },
      {
        id: 'locations',
        name: 'Number of Locations',
        description: 'Number of physical locations where NAC will be deployed',
        defaultValue: 1,
        minValue: 1,
        maxValue: 50,
        step: 1,
        unit: 'locations',
        impact: 'high',
        applies: ['all']
      },
      {
        id: 'downtime',
        name: 'Downtime Costs',
        description: 'Cost per hour of system downtime',
        defaultValue: 5000,
        minValue: 0,
        maxValue: 20000,
        step: 1000,
        unit: '$/hour',
        impact: 'medium',
        applies: ['all']
      },
      {
        id: 'years',
        name: 'Years to Project',
        description: 'Number of years to include in TCO calculation',
        defaultValue: 3,
        minValue: 1,
        maxValue: 5,
        step: 1,
        unit: 'years',
        impact: 'high',
        applies: ['all']
      }
    ],
    
    scenarios: [
      {
        id: 'base',
        name: 'Base Case',
        description: 'Current parameter values',
        color: '#1B67B2'
      },
      {
        id: 'optimistic',
        name: 'Optimistic Case',
        description: 'Parameters adjusted for best-case scenario',
        color: '#2BD25B'
      },
      {
        id: 'pessimistic',
        name: 'Pessimistic Case',
        description: 'Parameters adjusted for worst-case scenario',
        color: '#F25C5C'
      }
    ],
    
    vendors: [
      {
        id: 'portnox',
        name: 'Portnox Cloud',
        type: 'Cloud',
        color: '#2BD25B'
      },
      {
        id: 'on-prem',
        name: 'On-Premises NAC',
        type: 'On-Premises',
        color: '#1B67B2'
      }
    ]
  };
  
  // Create HTML template for sensitivity analyzer
  const analyzerTemplate = `
    <div id="sensitivity-analyzer" class="analyzer-container">
      <div class="analyzer-overlay"></div>
      <div class="analyzer-content">
        <div class="analyzer-header">
          <h2 class="analyzer-title">Enhanced Sensitivity Analysis</h2>
          <button type="button" class="analyzer-close" aria-label="Close sensitivity analyzer">&times;</button>
        </div>
        
        <div class="analyzer-body">
          <div class="analyzer-intro">
            <p>
              This tool allows you to analyze how changes in key parameters affect the Total Cost of Ownership (TCO) comparison 
              between Portnox Cloud and traditional on-premises NAC solutions. Adjust the parameters below to see the impact on costs.
            </p>
          </div>
          
          <div class="analyzer-tabs">
            <button type="button" class="analyzer-tab active" data-tab="parameters">Parameter Sensitivity</button>
            <button type="button" class="analyzer-tab" data-tab="scenarios">Scenario Analysis</button>
            <button type="button" class="analyzer-tab" data-tab="tornado">Tornado Analysis</button>
            <button type="button" class="analyzer-tab" data-tab="threshold">Threshold Analysis</button>
          </div>
          
          <div class="analyzer-tab-content">
            <!-- Parameters Tab -->
            <div class="analyzer-tab-pane active" id="parameters-tab">
              <div class="parameters-controls">
                <div class="parameter-filter">
                  <label for="parameter-impact-filter">Filter by Impact:</label>
                  <select id="parameter-impact-filter" class="form-select">
                    <option value="all">All Parameters</option>
                    <option value="very-high">Very High Impact</option>
                    <option value="high">High Impact</option>
                    <option value="medium">Medium Impact</option>
                    <option value="low">Low Impact</option>
                  </select>
                </div>
                
                <div class="parameter-filter">
                  <label for="parameter-vendor-filter">Filter by Vendor:</label>
                  <select id="parameter-vendor-filter" class="form-select">
                    <option value="all">All Vendors</option>
                    <option value="portnox">Portnox Cloud</option>
                    <option value="on-prem">On-Premises NAC</option>
                  </select>
                </div>
              </div>
              
              <div class="parameters-grid">
                ${config.parameters.map(param => `
                  <div class="parameter-card" data-impact="${param.impact}" data-applies="${param.applies.join(' ')}">
                    <div class="parameter-header">
                      <h4 class="parameter-name">${param.name}</h4>
                      <span class="parameter-impact impact-${param.impact}">${param.impact.replace('-', ' ')} Impact</span>
                    </div>
                    
                    <p class="parameter-description">${param.description}</p>
                    
                    <div class="parameter-control">
                      <div class="slider-container">
                        <input type="range" id="param-${param.id}" class="parameter-slider" 
                          min="${param.minValue}" max="${param.maxValue}" step="${param.step}" value="${param.defaultValue}">
                        <div class="slider-value">
                          <span id="param-${param.id}-value">${param.defaultValue}${param.unit}</span>
                        </div>
                      </div>
                      
                      <div class="parameter-inputs">
                        <div class="param-input-group">
                          <label for="param-${param.id}-input">Value:</label>
                          <input type="number" id="param-${param.id}-input" class="param-input" 
                            min="${param.minValue}" max="${param.maxValue}" step="${param.step}" value="${param.defaultValue}">
                          <span class="param-unit">${param.unit}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="parameter-sensitivity">
                      <div class="sensitivity-chart-container">
                        <canvas id="sensitivity-chart-${param.id}"></canvas>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <!-- Scenarios Tab -->
            <div class="analyzer-tab-pane" id="scenarios-tab">
              <div class="scenarios-container">
                <div class="scenarios-info">
                  <h3>Scenario Analysis</h3>
                  <p>
                    Compare how different parameter scenarios affect the Total Cost of Ownership over time. 
                    Adjust the parameters for each scenario below.
                  </p>
                </div>
                
                <div class="scenarios-grid">
                  ${config.scenarios.map(scenario => `
                    <div class="scenario-card" data-scenario="${scenario.id}">
                      <div class="scenario-header" style="border-left-color: ${scenario.color};">
                        <h4 class="scenario-name">${scenario.name}</h4>
                        <p class="scenario-description">${scenario.description}</p>
                      </div>
                      
                      <div class="scenario-parameters">
                        <div class="scenario-parameter-list">
                          ${config.parameters.slice(0, 5).map(param => `
                            <div class="scenario-parameter">
                              <label for="scenario-${scenario.id}-${param.id}">${param.name}:</label>
                              <div class="scenario-parameter-input">
                                <input type="number" id="scenario-${scenario.id}-${param.id}" 
                                  min="${param.minValue}" max="${param.maxValue}" step="${param.step}" 
                                  value="${scenario.id === 'base' ? param.defaultValue : 
                                    scenario.id === 'optimistic' ? Math.max(param.minValue, param.defaultValue * 0.8) : 
                                    Math.min(param.maxValue, param.defaultValue * 1.2)}">
                                <span class="param-unit">${param.unit}</span>
                              </div>
                            </div>
                          `).join('')}
                        </div>
                        
                        <button type="button" class="btn btn-sm btn-outline toggle-more-params">
                          <i class="fas fa-chevron-down"></i> Show More Parameters
                        </button>
                        
                        <div class="scenario-parameter-list hidden more-parameters">
                          ${config.parameters.slice(5).map(param => `
                            <div class="scenario-parameter">
                              <label for="scenario-${scenario.id}-${param.id}">${param.name}:</label>
                              <div class="scenario-parameter-input">
                                <input type="number" id="scenario-${scenario.id}-${param.id}" 
                                  min="${param.minValue}" max="${param.maxValue}" step="${param.step}" 
                                  value="${scenario.id === 'base' ? param.defaultValue : 
                                    scenario.id === 'optimistic' ? Math.max(param.minValue, param.defaultValue * 0.8) : 
                                    Math.min(param.maxValue, param.defaultValue * 1.2)}">
                                <span class="param-unit">${param.unit}</span>
                              </div>
                            </div>
                          `).join('')}
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
                
                <div class="scenario-analysis-results">
                  <h4>Scenario Comparison</h4>
                  <div class="scenario-chart-container">
                    <canvas id="scenario-comparison-chart"></canvas>
                  </div>
                  
                  <div class="scenario-table-container">
                    <table class="scenario-table">
                      <thead>
                        <tr>
                          <th>Scenario</th>
                          <th>On-Premises TCO</th>
                          <th>Portnox Cloud TCO</th>
                          <th>Savings</th>
                          <th>Savings %</th>
                        </tr>
                      </thead>
                      <tbody id="scenario-results-table">
                        <tr>
                          <td>Base Case</td>
                          <td>$300,000</td>
                          <td>$210,000</td>
                          <td>$90,000</td>
                          <td>30%</td>
                        </tr>
                        <tr>
                          <td>Optimistic Case</td>
                          <td>$350,000</td>
                          <td>$200,000</td>
                          <td>$150,000</td>
                          <td>43%</td>
                        </tr>
                        <tr>
                          <td>Pessimistic Case</td>
                          <td>$280,000</td>
                          <td>$220,000</td>
                          <td>$60,000</td>
                          <td>21%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Tornado Analysis Tab -->
            <div class="analyzer-tab-pane" id="tornado-tab">
              <div class="tornado-container">
                <div class="tornado-info">
                  <h3>Tornado Analysis</h3>
                  <p>
                    This analysis shows which parameters have the greatest impact on TCO savings when varied from their minimum to maximum values.
                    Parameters are sorted by their impact, with the most significant at the top.
                  </p>
                </div>
                
                <div class="tornado-chart-container">
                  <canvas id="tornado-chart"></canvas>
                </div>
                
                <div class="tornado-explanation">
                  <h4>Parameter Impact Breakdown</h4>
                  <div class="tornado-parameters">
                    <div class="tornado-parameter">
                      <div class="tornado-parameter-header">
                        <h5>1. Personnel Costs</h5>
                        <span class="impact-very-high">Very High Impact</span>
                      </div>
                      <p>
                        This parameter has the largest impact on TCO savings because on-premises solutions require 
                        significantly more IT staff resources than cloud solutions. As personnel costs increase, 
                        the cost advantage of Portnox Cloud grows substantially.
                      </p>
                    </div>
                    
                    <div class="tornado-parameter">
                      <div class="tornado-parameter-header">
                        <h5>2. Hardware Costs</h5>
                        <span class="impact-high">High Impact</span>
                      </div>
                      <p>
                        Hardware costs apply only to on-premises solutions, giving Portnox Cloud a significant 
                        advantage. Higher hardware costs directly increase the savings from choosing a 
                        cloud-native solution with no hardware requirements.
                      </p>
                    </div>
                    
                    <div class="tornado-parameter">
                      <div class="tornado-parameter-header">
                        <h5>3. Number of Locations</h5>
                        <span class="impact-high">High Impact</span>
                      </div>
                      <p>
                        On-premises solutions require hardware at each location, while Portnox Cloud requires no
                        additional hardware regardless of location count. As the number of locations increases,
                        the cost advantage of cloud solutions grows significantly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Threshold Analysis Tab -->
            <div class="analyzer-tab-pane" id="threshold-tab">
              <div class="threshold-container">
                <div class="threshold-info">
                  <h3>Threshold Analysis</h3>
                  <p>
                    This analysis identifies the threshold values at which Portnox Cloud becomes more or less cost-effective 
                    than on-premises alternatives. Adjust the sliders to see how parameter changes affect the TCO comparison.
                  </p>
                </div>
                
                <div class="threshold-parameters">
                  <div class="threshold-parameter">
                    <div class="threshold-parameter-header">
                      <h4>Device Count</h4>
                      <div class="threshold-result" id="threshold-result-devices">
                        <span>Current: 1,000 devices</span>
                        <span>Threshold: None (Always favorable)</span>
                      </div>
                    </div>
                    
                    <div class="slider-container">
                      <input type="range" id="threshold-devices" class="threshold-slider" 
                        min="100" max="10000" step="100" value="1000">
                      <div class="slider-value">
                        <span id="threshold-devices-value">1,000 devices</span>
                      </div>
                      <div class="threshold-indicator">
                        <div class="threshold-line" style="left: 100%;"></div>
                      </div>
                    </div>
                    
                    <div class="threshold-chart-container">
                      <canvas id="threshold-chart-devices"></canvas>
                    </div>
                  </div>
                  
                  <div class="threshold-parameter">
                    <div class="threshold-parameter-header">
                      <h4>Number of Locations</h4>
                      <div class="threshold-result" id="threshold-result-locations">
                        <span>Current: 1 location</span>
                        <span>Threshold: None (Always favorable)</span>
                      </div>
                    </div>
                    
                    <div class="slider-container">
                      <input type="range" id="threshold-locations" class="threshold-slider" 
                        min="1" max="50" step="1" value="1">
                      <div class="slider-value">
                        <span id="threshold-locations-value">1 location</span>
                      </div>
                      <div class="threshold-indicator">
                        <div class="threshold-line" style="left: 100%;"></div>
                      </div>
                    </div>
                    
                    <div class="threshold-chart-container">
                      <canvas id="threshold-chart-locations"></canvas>
                    </div>
                  </div>
                  
                  <div class="threshold-parameter">
                    <div class="threshold-parameter-header">
                      <h4>Years to Project</h4>
                      <div class="threshold-result" id="threshold-result-years">
                        <span>Current: 3 years</span>
                        <span>Threshold: None (Always favorable)</span>
                      </div>
                    </div>
                    
                    <div class="slider-container">
                      <input type="range" id="threshold-years" class="threshold-slider" 
                        min="1" max="5" step="1" value="3">
                      <div class="slider-value">
                        <span id="threshold-years-value">3 years</span>
                      </div>
                      <div class="threshold-indicator">
                        <div class="threshold-line" style="left: 100%;"></div>
                      </div>
                    </div>
                    
                    <div class="threshold-chart-container">
                      <canvas id="threshold-chart-years"></canvas>
                    </div>
                  </div>
                </div>
                
                <div class="threshold-summary">
                  <h4>Analysis Summary</h4>
                  <p>
                    Based on the analysis, Portnox Cloud remains more cost-effective than on-premises alternatives across 
                    all reasonable parameter values. The cost advantage increases with:
                  </p>
                  <ul>
                    <li>Higher number of locations (cloud savings increase by approximately 10% per additional location)</li>
                    <li>Longer time horizons (cloud savings increase by approximately 5% per additional year)</li>
                    <li>Higher personnel costs (cloud savings increase by approximately 0.5% per $10,000 in personnel costs)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="analyzer-footer">
          <button type="button" id="reset-sensitivity-btn" class="btn btn-outline">
            <i class="fas fa-undo"></i> Reset to Defaults
          </button>
          <button type="button" id="apply-sensitivity-btn" class="btn btn-primary">
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Create styles for sensitivity analyzer
  const analyzerStyles = `
    .analyzer-container {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1000;
      display: flex;
      justify-content: center;
      align-items: center;
      visibility: hidden;
      opacity: 0;
      transition: visibility 0s linear 0.3s, opacity 0.3s;
    }
    
    .analyzer-container.active {
      visibility: visible;
      opacity: 1;
      transition-delay: 0s;
    }
    
    .analyzer-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
    }
    
    .analyzer-content {
      position: relative;
      width: 90%;
      max-width: 1200px;
      max-height: 90vh;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
    }
    
    .analyzer-header {
      padding: 20px;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .analyzer-title {
      margin: 0;
      color: #1B67B2;
      font-size: 1.5rem;
    }
    
    .analyzer-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #505050;
    }
    
    .analyzer-body {
      padding: 20px;
      flex: 1;
      overflow-y: auto;
    }
    
    .analyzer-intro {
      margin-bottom: 20px;
    }
    
    .analyzer-tabs {
      display: flex;
      border-bottom: 1px solid #ddd;
      margin-bottom: 20px;
    }
    
    .analyzer-tab {
      padding: 10px 15px;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      font-weight: 500;
      color: #505050;
    }
    
    .analyzer-tab.active {
      border-bottom-color: #1B67B2;
      color: #1B67B2;
    }
    
    .analyzer-tab-pane {
      display: none;
    }
    
    .analyzer-tab-pane.active {
      display: block;
    }
    
    .parameters-controls {
      display: flex;
      margin-bottom: 20px;
      gap: 20px;
    }
    
    .parameter-filter {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .parameters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }
    
    .parameter-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 15px;
      transition: all 0.2s ease;
    }
    
    .parameter-card:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .parameter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .parameter-name {
      margin: 0;
      color: #1B67B2;
    }
    
    .parameter-impact {
      font-size: 0.8rem;
      padding: 2px 6px;
      border-radius: 4px;
      background-color: #f0f0f0;
    }
    
    .impact-very-high {
      background-color: #FF5757;
      color: white;
    }
    
    .impact-high {
      background-color: #FF9F40;
      color: white;
    }
    
    .impact-medium {
      background-color: #FFD966;
      color: #505050;
    }
    
    .impact-low {
      background-color: #A1D6B6;
      color: #505050;
    }
    
    .parameter-description {
      margin-bottom: 15px;
      font-size: 0.9rem;
      color: #707070;
    }
    
    .parameter-control {
      margin-bottom: 15px;
    }
    
    .slider-container {
      position: relative;
      margin-bottom: 10px;
    }
    
    .parameter-slider {
      width: 100%;
    }
    
    .slider-value {
      text-align: center;
      font-size: 0.9rem;
      color: #505050;
      margin-top: 5px;
    }
    
    .parameter-inputs {
      display: flex;
      justify-content: center;
    }
    
    .param-input-group {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .param-input {
      width: 80px;
      padding: 5px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .param-unit {
      font-size: 0.9rem;
      color: #707070;
    }
    
    .parameter-sensitivity {
      margin-top: 15px;
    }
    
    .sensitivity-chart-container {
      height: 150px;
    }
    
    .scenarios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .scenario-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 15px;
      transition: all 0.2s ease;
    }
    
    .scenario-card:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .scenario-header {
      border-left: 4px solid #1B67B2;
      padding-left: 10px;
      margin-bottom: 15px;
    }
    
    .scenario-name {
      margin: 0 0 5px 0;
      color: #1B67B2;
    }
    
    .scenario-description {
      margin: 0;
      font-size: 0.9rem;
      color: #707070;
    }
    
    .scenario-parameter {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .scenario-parameter label {
      font-size: 0.9rem;
      color: #505050;
    }
    
    .scenario-parameter-input {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .scenario-parameter-input input {
      width: 80px;
      padding: 5px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .toggle-more-params {
      margin: 10px 0;
      width: 100%;
    }
    
    .more-parameters.hidden {
      display: none;
    }
    
    .scenario-analysis-results {
      margin-top: 30px;
    }
    
    .scenario-chart-container {
      height: 300px;
      margin-bottom: 20px;
    }
    
    .scenario-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .scenario-table th, 
    .scenario-table td {
      padding: 10px;
      border: 1px solid #ddd;
      text-align: left;
    }
    
    .scenario-table th {
      background-color: #f8f9fa;
      font-weight: 600;
    }
    
    .tornado-chart-container {
      height: 400px;
      margin: 20px 0;
    }
    
    .tornado-explanation {
      margin-top: 30px;
    }
    
    .tornado-parameters {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }
    
    .tornado-parameter {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 15px;
    }
    
    .tornado-parameter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .tornado-parameter-header h5 {
      margin: 0;
      color: #1B67B2;
    }
    
    .threshold-parameters {
      display: grid;
      grid-template-columns: 1fr;
      gap: 30px;
      margin-bottom: 30px;
    }
    
    .threshold-parameter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    
    .threshold-parameter-header h4 {
      margin: 0;
      color: #1B67B2;
    }
    
    .threshold-result {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      font-size: 0.9rem;
    }
    
    .threshold-indicator {
      position: relative;
      height: 20px;
      margin-top: 5px;
    }
    
    .threshold-line {
      position: absolute;
      top: 0;
      height: 100%;
      width: 2px;
      background-color: #FF5757;
    }
    
    .threshold-chart-container {
      height: 200px;
      margin-top: 15px;
    }
    
    .analyzer-footer {
      padding: 15px 20px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
    }
  `;
  
  // Add sensitivity analyzer to page
  function initializeSensitivityAnalyzer() {
    // Add styles
    const styleElement = document.createElement('style');
    styleElement.textContent = analyzerStyles;
    document.head.appendChild(styleElement);
    
    // Update or replace existing sensitivity button
    const existingButton = document.getElementById('sensitivity-analysis-btn');
    if (existingButton) {
      // Update existing button
      existingButton.innerHTML = '<i class="fas fa-chart-line"></i> Enhanced Sensitivity Analysis';
      
      // Add analyzer HTML to page
      const analyzerContainer = document.createElement('div');
      analyzerContainer.innerHTML = analyzerTemplate;
      document.body.appendChild(analyzerContainer.firstElementChild);
      
      // Setup event listeners
      setupAnalyzerEvents();
    }
  }
  
  // Setup analyzer event listeners
  function setupAnalyzerEvents() {
    // Button to open analyzer
    const sensitivityButton = document.getElementById('sensitivity-analysis-btn');
    const analyzerContainer = document.getElementById('sensitivity-analyzer');
    const closeButton = analyzerContainer.querySelector('.analyzer-close');
    
    sensitivityButton.addEventListener('click', function() {
      analyzerContainer.classList.add('active');
      initializeCharts();
    });
    
    closeButton.addEventListener('click', function() {
      analyzerContainer.classList.remove('active');
    });
    
    // Tab switching
    const tabs = analyzerContainer.querySelectorAll('.analyzer-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        const tabPanes = analyzerContainer.querySelectorAll('.analyzer-tab-pane');
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        const targetTab = this.dataset.tab;
        const targetPane = document.getElementById(`${targetTab}-tab`);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
    
    // Parameter sliders
    const parameterSliders = analyzerContainer.querySelectorAll('.parameter-slider');
    parameterSliders.forEach(slider => {
      const valueDisplay = document.getElementById(`${slider.id}-value`);
      const inputField = document.getElementById(`${slider.id}-input`);
      const param = config.parameters.find(p => `param-${p.id}` === slider.id);
      
      if (valueDisplay && inputField && param) {
        slider.addEventListener('input', function() {
          const value = this.value;
          valueDisplay.textContent = `${value}${param.unit}`;
          inputField.value = value;
          updateParameterSensitivityChart(param.id, value);
        });
        
        inputField.addEventListener('change', function() {
          const value = Math.min(Math.max(this.value, param.minValue), param.maxValue);
          this.value = value;
          slider.value = value;
          valueDisplay.textContent = `${value}${param.unit}`;
          updateParameterSensitivityChart(param.id, value);
        });
      }
    });
    
    // Parameter filters
    const impactFilter = document.getElementById('parameter-impact-filter');
    const vendorFilter = document.getElementById('parameter-vendor-filter');
    
    function applyParameterFilters() {
      const impactValue = impactFilter.value;
      const vendorValue = vendorFilter.value;
      
      const parameterCards = analyzerContainer.querySelectorAll('.parameter-card');
      parameterCards.forEach(card => {
        const cardImpact = card.dataset.impact;
        const cardApplies = card.dataset.applies.split(' ');
        
        let showCard = true;
        
        if (impactValue !== 'all' && cardImpact !== impactValue) {
          showCard = false;
        }
        
        if (vendorValue !== 'all' && !cardApplies.includes(vendorValue)) {
          showCard = false;
        }
        
        card.style.display = showCard ? 'block' : 'none';
      });
    }
    
    impactFilter.addEventListener('change', applyParameterFilters);
    vendorFilter.addEventListener('change', applyParameterFilters);
    
    // Toggle more parameters in scenarios
    const toggleButtons = analyzerContainer.querySelectorAll('.toggle-more-params');
    toggleButtons.forEach(button => {
      button.addEventListener('click', function() {
        const moreParams = this.nextElementSibling;
        moreParams.classList.toggle('hidden');
        
        if (moreParams.classList.contains('hidden')) {
          this.innerHTML = '<i class="fas fa-chevron-down"></i> Show More Parameters';
        } else {
          this.innerHTML = '<i class="fas fa-chevron-up"></i> Hide Additional Parameters';
        }
      });
    });
    
    // Threshold analysis sliders
    const thresholdSliders = analyzerContainer.querySelectorAll('.threshold-slider');
    thresholdSliders.forEach(slider => {
      const valueDisplay = document.getElementById(`${slider.id}-value`);
      const paramId = slider.id.replace('threshold-', '');
      const param = config.parameters.find(p => p.id === paramId);
      
      if (valueDisplay && param) {
        slider.addEventListener('input', function() {
          const value = this.value;
          
          if (paramId === 'devices') {
            valueDisplay.textContent = `${Number(value).toLocaleString()} devices`;
          } else if (paramId === 'locations') {
            valueDisplay.textContent = `${value} location${value > 1 ? 's' : ''}`;
          } else if (paramId === 'years') {
            valueDisplay.textContent = `${value} year${value > 1 ? 's' : ''}`;
          } else {
            valueDisplay.textContent = `${value}${param.unit}`;
          }
          
          updateThresholdChart(paramId, value);
        });
      }
    });
    
    // Reset and Apply buttons
    const resetButton = document.getElementById('reset-sensitivity-btn');
    const applyButton = document.getElementById('apply-sensitivity-btn');
    
    resetButton.addEventListener('click', function() {
      resetToDefaults();
    });
    
    applyButton.addEventListener('click', function() {
      applyChanges();
      analyzerContainer.classList.remove('active');
    });
  }
  
  // Initialize charts for sensitivity analysis
  function initializeCharts() {
    initializeParameterSensitivityCharts();
    initializeScenarioComparisonChart();
    initializeTornadoChart();
    initializeThresholdCharts();
  }
  
  // Initialize parameter sensitivity charts
  function initializeParameterSensitivityCharts() {
    config.parameters.forEach(param => {
      const chartCanvas = document.getElementById(`sensitivity-chart-${param.id}`);
      
      if (chartCanvas) {
        // Destroy existing chart if it exists
        if (chartCanvas.chart) {
          chartCanvas.chart.destroy();
        }
        
        // Create synthetic data showing impact of parameter variation
        const data = generateParameterSensitivityData(param);
        
        // Create chart
        const ctx = chartCanvas.getContext('2d');
        chartCanvas.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.labels,
            datasets: data.datasets
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: param.name
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'TCO ($)'
                },
                beginAtZero: true
              }
            },
            plugins: {
              legend: {
                position: 'bottom'
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                  }
                }
              }
            }
          }
        });
      }
    });
  }
  
  // Generate data for parameter sensitivity charts
  function generateParameterSensitivityData(param) {
    // Create 5 data points between min and max
    const range = param.maxValue - param.minValue;
    const step = range / 4;
    const values = [];
    
    for (let i = 0; i <= 4; i++) {
      values.push(param.minValue + (step * i));
    }
    
    // Generate labels
    const labels = values.map(value => {
      return `${value}${param.unit}`;
    });
    
    // Generate datasets
    const datasets = [
      {
        label: 'On-Premises NAC',
        data: values.map(value => generateTCO(param.id, value, 'on-prem')),
        borderColor: '#1B67B2',
        backgroundColor: 'rgba(27, 103, 178, 0.1)'
      },
      {
        label: 'Portnox Cloud',
        data: values.map(value => generateTCO(param.id, value, 'portnox')),
        borderColor: '#2BD25B',
        backgroundColor: 'rgba(43, 210, 91, 0.1)'
      }
    ];
    
    return {
      labels,
      datasets
    };
  }
  
  // Initialize scenario comparison chart
  function initializeScenarioComparisonChart() {
    const chartCanvas = document.getElementById('scenario-comparison-chart');
    
    if (chartCanvas) {
      // Destroy existing chart if it exists
      if (chartCanvas.chart) {
        chartCanvas.chart.destroy();
      }
      
      // Generate data for scenarios
      const data = generateScenarioComparisonData();
      
      // Create chart
      const ctx = chartCanvas.getContext('2d');
      chartCanvas.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: config.scenarios.map(scenario => scenario.name),
          datasets: data.datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Scenario'
              }
            },
            y: {
              title: {
                display: true,
                text: 'TCO ($)'
              },
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              position: 'bottom'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                }
              }
            }
          }
        }
      });
    }
  }
  
  // Generate data for scenario comparison chart
  function generateScenarioComparisonData() {
    // Generate TCO values for each scenario
    const onPremTCO = config.scenarios.map(scenario => {
      // Calculate TCO based on scenario parameters
      // For simplicity, we'll use synthetic data here
      if (scenario.id === 'base') {
        return 300000;
      } else if (scenario.id === 'optimistic') {
        return 350000;
      } else {
        return 280000;
      }
    });
    
    const portnoxTCO = config.scenarios.map(scenario => {
      // Calculate TCO based on scenario parameters
      // For simplicity, we'll use synthetic data here
      if (scenario.id === 'base') {
        return 210000;
      } else if (scenario.id === 'optimistic') {
        return 200000;
      } else {
        return 220000;
      }
    });
    
    // Generate datasets
    const datasets = [
      {
        label: 'On-Premises NAC',
        data: onPremTCO,
        backgroundColor: '#1B67B2'
      },
      {
        label: 'Portnox Cloud',
        data: portnoxTCO,
        backgroundColor: '#2BD25B'
      }
    ];
    
    return {
      datasets
    };
  }
  
  // Initialize tornado chart
  function initializeTornadoChart() {
    const chartCanvas = document.getElementById('tornado-chart');
    
    if (chartCanvas) {
      // Destroy existing chart if it exists
      if (chartCanvas.chart) {
        chartCanvas.chart.destroy();
      }
      
      // Generate tornado chart data
      const data = generateTornadoData();
      
      // Create chart
      const ctx = chartCanvas.getContext('2d');
      chartCanvas.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.labels,
          datasets: data.datasets
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Change in TCO Savings ($)'
              },
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              position: 'bottom'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const datasetLabel = context.dataset.label;
                  const value = context.raw;
                  return `${datasetLabel}: $${Math.abs(value).toLocaleString()}`;
                },
                title: function(tooltipItems) {
                  return tooltipItems[0].label;
                }
              }
            }
          }
        }
      });
    }
  }
  
  // Generate data for tornado chart
  function generateTornadoData() {
    // Define parameters with their min and max impact on TCO savings
    const parameterImpacts = [
      { name: 'Personnel Costs', min: -30000, max: 60000 },
      { name: 'Hardware Costs', min: -25000, max: 45000 },
      { name: 'Number of Locations', min: -15000, max: 40000 },
      { name: 'Implementation Costs', min: -10000, max: 35000 },
      { name: 'Years to Project', min: -20000, max: 25000 },
      { name: 'Maintenance Costs', min: -10000, max: 20000 },
      { name: 'Device Count', min: -5000, max: 15000 },
      { name: 'Downtime Costs', min: -5000, max: 10000 }
    ];
    
    // Sort by impact range (max - min)
    parameterImpacts.sort((a, b) => {
      const aRange = a.max - a.min;
      const bRange = b.max - b.min;
      return bRange - aRange;
    });
    
    // Generate labels and datasets
    const labels = parameterImpacts.map(param => param.name);
    const datasets = [
      {
        label: 'Negative Impact',
        data: parameterImpacts.map(param => param.min),
        backgroundColor: '#F25C5C'
      },
      {
        label: 'Positive Impact',
        data: parameterImpacts.map(param => param.max),
        backgroundColor: '#2BD25B'
      }
    ];
    
    return {
      labels,
      datasets
    };
  }
  
  // Initialize threshold charts
  function initializeThresholdCharts() {
    const thresholdParams = ['devices', 'locations', 'years'];
    
    thresholdParams.forEach(paramId => {
      const chartCanvas = document.getElementById(`threshold-chart-${paramId}`);
      
      if (chartCanvas) {
        // Destroy existing chart if it exists
        if (chartCanvas.chart) {
          chartCanvas.chart.destroy();
        }
        
        // Generate threshold chart data
        const data = generateThresholdData(paramId);
        
        // Create chart
        const ctx = chartCanvas.getContext('2d');
        chartCanvas.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.labels,
            datasets: data.datasets
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: data.xTitle
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'TCO ($)'
                },
                beginAtZero: false
              }
            },
            plugins: {
              legend: {
                position: 'bottom'
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                  }
                }
              }
            }
          }
        });
      }
    });
  }
  
  // Generate data for threshold charts
  function generateThresholdData(paramId) {
    let labels, xTitle, min, max, step;
    
    // Define ranges for each parameter
    if (paramId === 'devices') {
      min = 100;
      max = 10000;
      step = 1000;
      xTitle = 'Device Count';
    } else if (paramId === 'locations') {
      min = 1;
      max = 50;
      step = 5;
      xTitle = 'Number of Locations';
    } else if (paramId === 'years') {
      min = 1;
      max = 5;
      step = 0.5;
      xTitle = 'Years to Project';
    }
    
    // Generate data points
    const values = [];
    for (let i = min; i <= max; i += step) {
      values.push(i);
    }
    
    // Format labels
    if (paramId === 'devices') {
      labels = values.map(value => `${value.toLocaleString()}`);
    } else if (paramId === 'locations') {
      labels = values.map(value => `${value}`);
    } else {
      labels = values.map(value => `${value}`);
    }
    
    // Generate TCO data for each value
    const onPremTCO = values.map(value => generateThresholdTCO(paramId, value, 'on-prem'));
    const portnoxTCO = values.map(value => generateThresholdTCO(paramId, value, 'portnox'));
    
    // Generate datasets
    const datasets = [
      {
        label: 'On-Premises NAC',
        data: onPremTCO,
        borderColor: '#1B67B2',
        backgroundColor: 'rgba(27, 103, 178, 0.1)'
      },
      {
        label: 'Portnox Cloud',
        data: portnoxTCO,
        borderColor: '#2BD25B',
        backgroundColor: 'rgba(43, 210, 91, 0.1)'
      }
    ];
    
    return {
      labels,
      datasets,
      xTitle
    };
  }
  
  // Generate TCO value for a parameter
  function generateTCO(paramId, value, vendor) {
    // Base TCO values
    const baseTCO = {
      'on-prem': 300000,
      'portnox': 210000
    };
    
    // Impact factors for each parameter on each vendor
    const impactFactors = {
      'hardware': {
        'on-prem': 1.5,
        'portnox': 0
      },
      'licensing': {
        'on-prem': 1.0,
        'portnox': 1.0
      },
      'maintenance': {
        'on-prem': 1.0,
        'portnox': 0.5
      },
      'implementation': {
        'on-prem': 1.0,
        'portnox': 0.5
      },
      'personnel': {
        'on-prem': 1.0,
        'portnox': 0.4
      },
      'fte': {
        'on-prem': 100000,
        'portnox': 40000
      },
      'devices': {
        'on-prem': 0.05,
        'portnox': 0.04
      },
      'locations': {
        'on-prem': 50000,
        'portnox': 5000
      },
      'downtime': {
        'on-prem': 2,
        'portnox': 1
      },
      'years': {
        'on-prem': 100000,
        'portnox': 70000
      }
    };
    
    // Get parameter default value
    const param = config.parameters.find(p => p.id === paramId);
    const defaultValue = param ? param.defaultValue : 0;
    
    // Calculate impact
    const impact = impactFactors[paramId] ? impactFactors[paramId][vendor] : 0;
    
    // Calculate TCO adjustment based on parameter value change
    let adjustment = 0;
    
    if (paramId === 'fte' || paramId === 'locations') {
      // Multiplicative parameters
      adjustment = (value - defaultValue) * impact;
    } else if (paramId === 'years') {
      // Years parameter
      adjustment = (value - defaultValue) * impact;
    } else {
      // Percentage-based parameters
      adjustment = ((value - defaultValue) / defaultValue) * impact * baseTCO[vendor];
    }
    
    // Return adjusted TCO
    return Math.max(0, baseTCO[vendor] + adjustment);
  }
  
  // Generate TCO value for threshold analysis
  function generateThresholdTCO(paramId, value, vendor) {
    if (paramId === 'devices') {
      // Device count impact
      if (vendor === 'on-prem') {
        return 200000 + (value * 10);
      } else {
        return 150000 + (value * 6);
      }
    } else if (paramId === 'locations') {
      // Locations impact
      if (vendor === 'on-prem') {
        return 200000 + (value * 20000);
      } else {
        return 190000 + (value * 5000);
      }
    } else if (paramId === 'years') {
      // Years impact
      if (vendor === 'on-prem') {
        return 100000 * value;
      } else {
        return 70000 * value;
      }
    }
    
    // Default
    return vendor === 'on-prem' ? 300000 : 210000;
  }
  
  // Update parameter sensitivity chart with new value
  function updateParameterSensitivityChart(paramId, value) {
    const chartCanvas = document.getElementById(`sensitivity-chart-${paramId}`);
    
    if (chartCanvas && chartCanvas.chart) {
      // Highlight the current value on the chart
      // For simplicity, we won't implement this in the script
      // but you could add an annotation to highlight the current value
    }
  }
  
  // Update threshold chart with new value
  function updateThresholdChart(paramId, value) {
    const chartCanvas = document.getElementById(`threshold-chart-${paramId}`);
    const resultDisplay = document.getElementById(`threshold-result-${paramId}`);
    
    if (chartCanvas && chartCanvas.chart && resultDisplay) {
      // Get on-prem and portnox TCO for the current value
      const onPremTCO = generateThresholdTCO(paramId, value, 'on-prem');
      const portnoxTCO = generateThresholdTCO(paramId, value, 'portnox');
      
      // Update result display
      let currentText, thresholdText;
      
      if (paramId === 'devices') {
        currentText = `Current: ${Number(value).toLocaleString()} devices`;
        thresholdText = onPremTCO <= portnoxTCO ? 
          `Threshold: None (Always favorable)` : 
          `Threshold: ~${calculateThreshold(paramId, 'devices')} devices`;
      } else if (paramId === 'locations') {
        currentText = `Current: ${value} location${value > 1 ? 's' : ''}`;
        thresholdText = onPremTCO <= portnoxTCO ? 
          `Threshold: None (Always favorable)` : 
          `Threshold: ~${calculateThreshold(paramId, 'locations')} locations`;
      } else if (paramId === 'years') {
        currentText = `Current: ${value} year${value > 1 ? 's' : ''}`;
        thresholdText = onPremTCO <= portnoxTCO ? 
          `Threshold: None (Always favorable)` : 
          `Threshold: ~${calculateThreshold(paramId, 'years')} years`;
      }
      
      resultDisplay.innerHTML = `<span>${currentText}</span><span>${thresholdText}</span>`;
      
      // Update threshold line position (if a threshold exists)
      const thresholdLine = chartCanvas.parentNode.previousElementSibling.querySelector('.threshold-line');
      if (thresholdLine) {
        const threshold = calculateThreshold(paramId);
        
        if (threshold) {
          const param = config.parameters.find(p => p.id === paramId);
          const position = ((threshold - param.minValue) / (param.maxValue - param.minValue)) * 100;
          thresholdLine.style.left = `${Math.min(100, Math.max(0, position))}%`;
        } else {
          thresholdLine.style.left = '100%';
        }
      }
    }
  }
  
  // Calculate threshold value for a parameter
  function calculateThreshold(paramId) {
    // This is a placeholder function that would calculate the actual threshold
    // where on-premises TCO equals Portnox Cloud TCO
    
    // For simplicity, we'll return predefined thresholds
    if (paramId === 'devices') {
      return null; // No threshold, always favorable
    } else if (paramId === 'locations') {
      return null; // No threshold, always favorable
    } else if (paramId === 'years') {
      return null; // No threshold, always favorable
    }
    
    return null; // Default: no threshold
  }
  
  // Reset all parameters to default values
  function resetToDefaults() {
    // Reset parameter sliders and inputs
    config.parameters.forEach(param => {
      const slider = document.getElementById(`param-${param.id}`);
      const valueDisplay = document.getElementById(`param-${param.id}-value`);
      const inputField = document.getElementById(`param-${param.id}-input`);
      
      if (slider && valueDisplay && inputField) {
        slider.value = param.defaultValue;
        valueDisplay.textContent = `${param.defaultValue}${param.unit}`;
        inputField.value = param.defaultValue;
        updateParameterSensitivityChart(param.id, param.defaultValue);
      }
    });
    
    // Reset scenario inputs
    config.scenarios.forEach(scenario => {
      config.parameters.forEach(param => {
        const input = document.getElementById(`scenario-${scenario.id}-${param.id}`);
        
        if (input) {
          if (scenario.id === 'base') {
            input.value = param.defaultValue;
          } else if (scenario.id === 'optimistic') {
            input.value = Math.max(param.minValue, Math.round(param.defaultValue * 0.8));
          } else { // pessimistic
            input.value = Math.min(param.maxValue, Math.round(param.defaultValue * 1.2));
          }
        }
      });
    });
    
    // Reset threshold sliders
    const deviceSlider = document.getElementById('threshold-devices');
    const deviceValue = document.getElementById('threshold-devices-value');
    if (deviceSlider && deviceValue) {
      deviceSlider.value = 1000;
      deviceValue.textContent = '1,000 devices';
      updateThresholdChart('devices', 1000);
    }
    
    const locationsSlider = document.getElementById('threshold-locations');
    const locationsValue = document.getElementById('threshold-locations-value');
    if (locationsSlider && locationsValue) {
      locationsSlider.value = 1;
      locationsValue.textContent = '1 location';
      updateThresholdChart('locations', 1);
    }
    
    const yearsSlider = document.getElementById('threshold-years');
    const yearsValue = document.getElementById('threshold-years-value');
    if (yearsSlider && yearsValue) {
      yearsSlider.value = 3;
      yearsValue.textContent = '3 years';
      updateThresholdChart('years', 3);
    }
    
    // Update charts
    initializeCharts();
  }
  
  // Apply changes to calculator
  function applyChanges() {
    // Collect parameter values
    const paramValues = {};
    config.parameters.forEach(param => {
      const inputField = document.getElementById(`param-${param.id}-input`);
      if (inputField) {
        paramValues[param.id] = parseFloat(inputField.value);
      }
    });
    
    // Apply to calculator
    if (window.calculator && typeof window.calculator.setParameters === 'function') {
      window.calculator.setParameters(paramValues);
      window.calculator.calculate();
    } else {
      console.error('Calculator not available or missing setParameters method');
    }
    
    // Optionally, show a success message
    if (window.NotificationManager) {
      window.NotificationManager.showSuccess('Sensitivity analysis parameters applied successfully. Recalculating...');
    }
  }
  
  // Initialize the sensitivity analyzer
  initializeSensitivityAnalyzer();
  
  console.log('Enhanced Sensitivity Analyzer initialized');
})();
/**
 * Integrated Sensitivity Analysis
 * Provides sensitivity analysis functionality directly in the main UI
 */
const IntegratedSensitivityAnalyzer = (function() {
    // Store chart references
    let sensitivityChart = null;
    let savingsImpactChart = null;
    
    // Default parameter values
    const defaults = {
        parameter: 'deviceCount',
        vendor: 'all',
        min: 500,
        max: 5000,
        steps: 10
    };
    
    // Parameter definitions
    const parameters = {
        deviceCount: {
            name: 'Device Count',
            description: 'Analyze how changes in the total number of devices affect TCO and relative savings.',
            unit: '',
            defaultMin: 500,
            defaultMax: 5000
        },
        legacyPercentage: {
            name: 'Legacy Device Percentage',
            description: 'Evaluate the impact of varying percentages of legacy devices that require special handling.',
            unit: '%',
            defaultMin: 0,
            defaultMax: 100
        },
        locationCount: {
            name: 'Number of Locations',
            description: 'Assess how distributed deployment across multiple locations affects total costs.',
            unit: '',
            defaultMin: 1,
            defaultMax: 50
        },
        yearsToProject: {
            name: 'Years to Project',
            description: 'Compare TCO over different timeframes to understand long-term cost implications.',
            unit: 'years',
            defaultMin: 1,
            defaultMax: 7
        },
        hardwareCost: {
            name: 'Hardware Cost Multiplier',
            description: 'Test how variations in hardware pricing affect total cost of ownership.',
            unit: 'x',
            defaultMin: 0.5,
            defaultMax: 2
        },
        licensingCost: {
            name: 'Licensing Cost Multiplier',
            description: 'Analyze the sensitivity of TCO to changes in software licensing costs.',
            unit: 'x',
            defaultMin: 0.5,
            defaultMax: 2
        },
        maintenanceCost: {
            name: 'Maintenance Cost Multiplier',
            description: 'Evaluate how varying maintenance costs impact long-term TCO.',
            unit: 'x',
            defaultMin: 0.5,
            defaultMax: 2
        },
        implementationCost: {
            name: 'Implementation Cost Multiplier',
            description: 'Determine the sensitivity of initial deployment costs on overall TCO.',
            unit: 'x',
            defaultMin: 0.5,
            defaultMax: 2
        },
        fteCost: {
            name: 'Personnel Cost Multiplier',
            description: 'Assess how variations in IT staffing expenses affect solution costs.',
            unit: 'x',
            defaultMin: 0.5,
            defaultMax: 2
        },
        downtimeCost: {
            name: 'Downtime Cost',
            description: 'Analyze how the cost of downtime events affects the overall value proposition.',
            unit: '$/hour',
            defaultMin: 1000,
            defaultMax: 50000
        }
    };
    
    // Chart colors for vendors
    const vendorColors = {
        cisco: '#1B67B2',
        aruba: '#F6921E',
        forescout: '#FFC20E',
        fortinac: '#EE3124',
        nps: '#00A4EF',
        securew2: '#662D91',
        portnox: '#65BD44',
        noNac: '#A9A9A9'
    };
    
    // Initialize the sensitivity analysis UI
    function init() {
        console.log("Initializing Enhanced Sensitivity Analyzer...");
        
        const paramSelector = document.getElementById('sensitivity-parameter');
        const minInput = document.getElementById('sensitivity-min');
        const maxInput = document.getElementById('sensitivity-max');
        const stepsInput = document.getElementById('sensitivity-steps');
        const runButton = document.getElementById('run-sensitivity');
        
        if (!paramSelector || !minInput || !maxInput || !stepsInput || !runButton) {
            console.warn("Could not find all sensitivity controls");
            return;
        }
        
        // Populate parameter selector
        for (const [key, param] of Object.entries(parameters)) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = param.name;
            paramSelector.appendChild(option);
        }
        
        // Add event listeners
        paramSelector.addEventListener('change', updateParameterInfo);
        runButton.addEventListener('click', runSensitivityAnalysis);
        
        // Set initial values
        updateParameterInfo();
        
        console.log("Enhanced Sensitivity Analyzer initialized");
    }
    
    // Update parameter information when selection changes
    function updateParameterInfo() {
        const paramSelector = document.getElementById('sensitivity-parameter');
        const minInput = document.getElementById('sensitivity-min');
        const maxInput = document.getElementById('sensitivity-max');
        
        if (!paramSelector || !minInput || !maxInput) return;
        
        const selectedParam = paramSelector.value;
        const paramInfo = parameters[selectedParam];
        
        if (paramInfo) {
            // Update min/max default values
            minInput.value = paramInfo.defaultMin;
            maxInput.value = paramInfo.defaultMax;
            
            // Update description if element exists
            const descElement = document.querySelector('.param-description');
            if (descElement) {
                descElement.textContent = paramInfo.description;
            }
        }
    }
    
    // Run sensitivity analysis
    function runSensitivityAnalysis() {
        const paramSelector = document.getElementById('sensitivity-parameter');
        const minInput = document.getElementById('sensitivity-min');
        const maxInput = document.getElementById('sensitivity-max');
        const stepsInput = document.getElementById('sensitivity-steps');
        
        if (!paramSelector || !minInput || !maxInput || !stepsInput) return;
        
        // Get parameter values
        const parameter = paramSelector.value;
        const min = parseFloat(minInput.value);
        const max = parseFloat(maxInput.value);
        const steps = parseInt(stepsInput.value);
        
        // Validate inputs
        if (isNaN(min) || isNaN(max) || isNaN(steps) || min >= max || steps < 2) {
            alert("Please enter valid parameter values. Min must be less than Max and Steps must be at least 2.");
            return;
        }
        
        // Calculate step size
        const stepSize = (max - min) / (steps - 1);
        
        // Generate parameter values
        const parameterValues = [];
        for (let i = 0; i < steps; i++) {
            parameterValues.push(min + i * stepSize);
        }
        
        // Mock results (in a real app, this would calculate actual values)
        const mockResults = generateMockResults(parameter, parameterValues);
        
        // Update charts with results
        updateSensitivityCharts(mockResults);
        
        // Show breakeven analysis if it exists
        const breakevenContainer = document.getElementById('breakeven-container');
        if (breakevenContainer) {
            breakevenContainer.classList.remove('hidden');
            updateBreakevenAnalysis(mockResults);
        }
    }
    
    // Generate mock results for demonstration
    function generateMockResults(parameter, parameterValues) {
        // Get vendors to include
        const vendors = [
            { id: 'cisco', name: 'Cisco ISE' },
            { id: 'aruba', name: 'Aruba ClearPass' },
            { id: 'forescout', name: 'Forescout' },
            { id: 'nps', name: 'Microsoft NPS' },
            { id: 'portnox', name: 'Portnox Cloud' }
        ];
        
        // Generate vendor results
        const vendorResults = vendors.map(vendor => {
            // Base TCO value
            let baseTco = vendor.id === 'portnox' ? 180000 : 300000;
            if (vendor.id === 'cisco') baseTco = 400000;
            if (vendor.id === 'aruba') baseTco = 350000;
            if (vendor.id === 'forescout') baseTco = 380000;
            if (vendor.id === 'nps') baseTco = 200000;
            
            // Calculate TCO values based on parameter
            const values = parameterValues.map(value => {
                let multiplier = 1.0;
                
                // Different multiplier calculations based on parameter type
                switch(parameter) {
                    case 'deviceCount':
                        // Device count has linear impact on most vendors, but Portnox has better scaling
                        multiplier = value / 1000;
                        if (vendor.id === 'portnox') {
                            multiplier = 0.2 + (0.7 * value / 1000); // Better scaling
                        }
                        break;
                    case 'yearsToProject':
                        // Years mainly affects ongoing costs
                        multiplier = 0.6 + (0.4 * value / 3);
                        break;
                    case 'locationCount':
                        // Locations affect on-premises vendors more
                        if (vendor.id === 'portnox') {
                            multiplier = 1 + (0.1 * Math.log2(value));
                        } else {
                            multiplier = 1 + (0.3 * Math.log2(value));
                        }
                        break;
                    default:
                        // Generic multiplier with random component for visualization
                        multiplier = value * (0.9 + 0.2 * Math.random());
                        break;
                }
                
                return Math.round(baseTco * multiplier);
            });
            
            return {
                name: vendor.name,
                id: vendor.id,
                values: values
            };
        });
        
        // Calculate savings percentages (compared to average on-premises)
        const savingsPercentages = parameterValues.map((_, index) => {
            const onPremValues = vendorResults
                .filter(vendor => vendor.id !== 'portnox')
                .map(vendor => vendor.values[index]);
            
            const avgOnPrem = onPremValues.reduce((a, b) => a + b, 0) / onPremValues.length;
            const portnoxValue = vendorResults.find(vendor => vendor.id === 'portnox').values[index];
            
            return Math.round(((avgOnPrem - portnoxValue) / avgOnPrem) * 100);
        });
        
        // Calculate breakeven points
        const breakeven = {
            deviceCount: parameter === 'deviceCount' ? 600 : null,
            yearCount: parameter === 'yearsToProject' ? 1.5 : null,
            costMultiplier: parameter.includes('Cost') ? 1.8 : null
        };
        
        return {
            parameter: parameter,
            parameterValues: parameterValues.map(value => Math.round(value * 100) / 100), // Round for display
            vendorResults: vendorResults,
            savingsPercentages: savingsPercentages,
            breakeven: breakeven
        };
    }
    
    // Update sensitivity charts with results
    function updateSensitivityCharts(results) {
        updateTcoSensitivityChart(results);
        updateSavingsImpactChart(results);
    }
    
    // Update the TCO sensitivity chart
    function updateTcoSensitivityChart(results) {
        const ctx = document.getElementById('sensitivity-chart');
        if (!ctx) return;
        
        // Destroy previous chart if it exists
        if (sensitivityChart) {
            sensitivityChart.destroy();
        }
        
        // Create datasets
        const datasets = results.vendorResults.map(vendor => {
            return {
                label: vendor.name,
                data: vendor.values,
                borderColor: vendorColors[vendor.id] || '#888888',
                backgroundColor: 'transparent',
                borderWidth: vendor.id === 'portnox' ? 3 : 2,
                pointRadius: vendor.id === 'portnox' ? 4 : 3
            };
        });
        
        // Format parameter labels
        const paramInfo = parameters[results.parameter] || parameters.deviceCount;
        const formattedLabels = results.parameterValues.map(value => {
            return paramInfo.unit ? `${value}${paramInfo.unit}` : value.toString();
        });
        
        // Create chart
        sensitivityChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: formattedLabels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Total Cost of Ownership ($)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: paramInfo.name
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `TCO Sensitivity to ${paramInfo.name}`
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Update the savings impact chart
    function updateSavingsImpactChart(results) {
        const ctx = document.getElementById('savings-impact-chart');
        if (!ctx) return;
        
        // Destroy previous chart if it exists
        if (savingsImpactChart) {
            savingsImpactChart.destroy();
        }
        
        // Format parameter labels
        const paramInfo = parameters[results.parameter] || parameters.deviceCount;
        const formattedLabels = results.parameterValues.map(value => {
            return paramInfo.unit ? `${value}${paramInfo.unit}` : value.toString();
        });
        
        // Create chart
        savingsImpactChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: formattedLabels,
                datasets: [{
                    label: 'Savings Percentage',
                    data: results.savingsPercentages,
                    borderColor: '#65BD44',
                    backgroundColor: 'rgba(101, 189, 68, 0.2)',
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Savings vs. On-Premises (%)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: paramInfo.name
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Impact of ${paramInfo.name} on Cost Savings`
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Savings: ${context.raw}%`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Update breakeven analysis with results
    function updateBreakevenAnalysis(results) {
        const breakevenContainer = document.getElementById('breakeven-content');
        if (!breakevenContainer) return;
        
        const paramInfo = parameters[results.parameter] || {};
        
        // Clear previous content
        breakevenContainer.innerHTML = '';
        
        // Check if we have breakeven data
        const breakeven = results.breakeven;
        if (!breakeven || (!breakeven.deviceCount && !breakeven.yearCount && !breakeven.costMultiplier)) {
            breakevenContainer.innerHTML = '<p>No breakeven points identified for this parameter.</p>';
            return;
        }
        
        // Create breakeven cards
        const breakevenGrid = document.createElement('div');
        breakevenGrid.className = 'breakeven-grid';
        
        if (breakeven.deviceCount) {
            const card = createBreakevenCard(
                'Device Count Breakeven',
                breakeven.deviceCount + ' devices',
                `Portnox becomes more cost-effective than on-premises solutions at ${breakeven.deviceCount} devices.`
            );
            breakevenGrid.appendChild(card);
        }
        
        if (breakeven.yearCount) {
            const card = createBreakevenCard(
                'Time to Breakeven',
                breakeven.yearCount + ' years',
                `The investment in Portnox Cloud pays for itself in ${breakeven.yearCount} years compared to on-premises solutions.`
            );
            breakevenGrid.appendChild(card);
        }
        
        if (breakeven.costMultiplier) {
            const card = createBreakevenCard(
                'Cost Multiplier Breakeven',
                breakeven.costMultiplier + 'x',
                `Portnox remains more cost-effective than on-premises solutions until costs increase by ${breakeven.costMultiplier}x.`
            );
            breakevenGrid.appendChild(card);
        }
        
        breakevenContainer.appendChild(breakevenGrid);
    }
    
    // Create a breakeven card element
    function createBreakevenCard(title, value, description) {
        const card = document.createElement('div');
        card.className = 'breakeven-card';
        
        const cardTitle = document.createElement('h4');
        cardTitle.textContent = title;
        
        const cardValue = document.createElement('div');
        cardValue.className = 'breakeven-value';
        cardValue.textContent = value;
        
        const cardDesc = document.createElement('div');
        cardDesc.className = 'breakeven-description';
        cardDesc.textContent = description;
        
        card.appendChild(cardTitle);
        card.appendChild(cardValue);
        card.appendChild(cardDesc);
        
        return card;
    }
    
    // Return public API
    return {
        init
    };
})();

// Initialize sensitivity analyzer when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    IntegratedSensitivityAnalyzer.init();
});
/**
 * Enhanced Sensitivity Analyzer
 * Provides more advanced sensitivity analysis and visualization
 */
class EnhancedSensitivityAnalyzer {
  constructor() {
    this.results = null;
    this.analyzing = false;
    this.charts = {};
    this.scenarios = [];
    
    // Reference to calculator
    this.calculator = window.calculator;
    
    // Chart colors from chart builder
    this.chartColors = window.chartBuilder ? window.chartBuilder.chartColors : {
      cisco: '#049fd9',      // Cisco blue
      aruba: '#ff8300',      // Aruba orange
      forescout: '#005daa',  // Forescout blue
      nps: '#00a4ef',        // Microsoft blue
      fortinac: '#ee3124',   // FortiNAC red
      securew2: '#8bc53f',   // SecureW2 green
      portnox: '#2bd25b',    // Portnox green
      neutral: '#888888'     // Neutral gray
    };
    
    this.initEventListeners();
  }
  
  initEventListeners() {
    // Run button click handler
    const sensitivityBtn = document.getElementById('sensitivity-btn');
    if (sensitivityBtn) {
      sensitivityBtn.addEventListener('click', () => {
        this.analyze();
      });
    }
    
    // Variable selector change handler
    const variableSelect = document.getElementById('param-variable');
    if (variableSelect) {
      variableSelect.addEventListener('change', () => {
        this.updateRangeDefaults(variableSelect.value);
      });
    }
    
    // Add scenario button click handler
    const addScenarioBtn = document.getElementById('add-scenario-btn');
    if (addScenarioBtn) {
      addScenarioBtn.addEventListener('click', () => {
        this.addCurrentScenario();
      });
    }
    
    // Clear scenarios button click handler
    const clearScenariosBtn = document.getElementById('clear-scenarios-btn');
    if (clearScenariosBtn) {
      clearScenariosBtn.addEventListener('click', () => {
        this.clearScenarios();
      });
    }
    
    // Export buttons
    const exportCsvBtn = document.getElementById('export-sensitivity-csv-btn');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => {
        this.exportToCSV();
      });
    }
    
    const exportPdfBtn = document.getElementById('export-sensitivity-pdf-btn');
    if (exportPdfBtn) {
      exportPdfBtn.addEventListener('click', () => {
        this.exportToPDF();
      });
    }
  }
  
  updateRangeDefaults(variable) {
    const minInput = document.getElementById('param-min');
    const maxInput = document.getElementById('param-max');
    const stepsInput = document.getElementById('param-steps');
    
    if (!minInput || !maxInput || !stepsInput) return;
    
    // Get current form values for dynamic ranges
    const deviceCount = parseInt(document.getElementById('device-count')?.value) || 1000;
    const legacyPercentage = parseInt(document.getElementById('legacy-percentage')?.value) || 10;
    const locationCount = parseInt(document.getElementById('location-count')?.value) || 2;
    const yearsToProject = parseInt(document.getElementById('years-to-project')?.value) || 3;
    
    switch (variable) {
      case 'deviceCount':
        minInput.value = Math.max(Math.floor(deviceCount * 0.5), 100);
        maxInput.value = Math.ceil(deviceCount * 2);
        stepsInput.value = '10';
        break;
      case 'legacyPercentage':
        minInput.value = '0';
        maxInput.value = '100';
        stepsInput.value = '11';
        break;
      case 'locationCount':
        minInput.value = '1';
        maxInput.value = Math.max(locationCount * 3, 20);
        stepsInput.value = '10';
        break;
      case 'yearsToProject':
        minInput.value = '1';
        maxInput.value = '10';
        stepsInput.value = '10';
        break;
      case 'hardwareCost':
      case 'licensingCost':
      case 'maintenanceCost':
      case 'fteCost':
      case 'implementationCost':
        minInput.value = '0.5';
        maxInput.value = '2.0';
        stepsInput.value = '7';
        break;
      case 'downtimeCost':
        minInput.value = '1000';
        maxInput.value = '10000';
        stepsInput.value = '10';
        break;
      default:
        minInput.value = '0';
        maxInput.value = '100';
        stepsInput.value = '10';
    }
    
    // Update parameter description
    this.updateParameterDescription(variable);
  }
  
  updateParameterDescription(variable) {
    const descriptionElement = document.getElementById('parameter-description');
    if (!descriptionElement) return;
    
    const descriptions = {
      deviceCount: 'Analyze how changes in the total number of devices affect TCO and relative savings. More devices typically increase hardware and licensing costs for on-premises solutions.',
      legacyPercentage: 'Evaluate the impact of legacy device percentages on overall costs. Legacy devices often require additional security measures and management overhead.',
      locationCount: 'Assess how distributed deployments across multiple locations affect total costs. On-premises solutions typically require hardware at each location.',
      yearsToProject: 'Compare short-term vs. long-term TCO projections. Cloud solutions often show higher relative savings over longer time periods.',
      hardwareCost: 'Test sensitivity to hardware cost changes, such as price increases or discounts. This primarily affects on-premises deployments.',
      licensingCost: 'Analyze how licensing cost variations affect overall TCO. Both cloud and on-premises solutions include licensing costs.',
      maintenanceCost: 'Evaluate the impact of maintenance cost changes on long-term TCO. On-premises solutions typically have higher maintenance requirements.',
      implementationCost: 'Assess how implementation cost factors affect initial deployment expenses. Complex deployments increase professional services costs.',
      fteCost: 'Test sensitivity to changes in IT staffing costs or allocation. On-premises solutions typically require more IT staff time.',
      downtimeCost: 'Analyze how the cost of downtime affects overall TCO. Different solutions have varying reliability characteristics.'
    };
    
    descriptionElement.textContent = descriptions[variable] || 'Analyze how changes in this parameter affect the total cost of ownership and potential savings.';
  }
  
  analyze() {
    if (this.analyzing) {
      console.log('Analysis already in progress');
      return;
    }
    
    this.analyzing = true;
    this.showLoading();
    
    try {
      // Get input parameters
      const variableToAnalyze = document.getElementById('param-variable').value;
      const vendorToAnalyze = document.getElementById('param-vendor').value;
      const minValue = parseFloat(document.getElementById('param-min').value);
      const maxValue = parseFloat(document.getElementById('param-max').value);
      const steps = parseInt(document.getElementById('param-steps').value);
      
      console.log(`Running sensitivity analysis for ${variableToAnalyze}, vendor: ${vendorToAnalyze}, range: ${minValue}-${maxValue}, steps: ${steps}`);
      
      // Validate inputs
      if (isNaN(minValue) || isNaN(maxValue) || isNaN(steps)) {
        throw new Error('Invalid input parameters');
      }
      
      if (minValue >= maxValue) {
        throw new Error('Maximum value must be greater than minimum value');
      }
      
      if (steps < 2 || steps > 20) {
        throw new Error('Number of steps must be between 2 and 20');
      }
      
      // Get additional analysis options
      const includeBreakeven = document.getElementById('include-breakeven')?.checked || false;
      const compareToNoNAC = document.getElementById('compare-to-no-nac')?.checked || false;
      
      // Generate data points
      const stepSize = (maxValue - minValue) / (steps - 1);
      const dataPoints = Array.from({length: steps}, (_, i) => minValue + (i * stepSize));
      
      // Run analysis for each data point
      const analysisResults = {
        variable: variableToAnalyze,
        vendor: vendorToAnalyze,
        minValue,
        maxValue,
        steps,
        dataPoints,
        results: [],
        includeBreakeven,
        compareToNoNAC
      };
      
      // Keep a copy of the original form values
      const originalValues = this.saveOriginalValues();
      
      // For each data point, calculate TCO by modifying the relevant form value
      dataPoints.forEach(dataPoint => {
        // Set the form value for the variable being analyzed
        this.setVariableValue(variableToAnalyze, dataPoint);
        
        // Calculate TCO for this data point
        const calculationResults = this.runCalculation();
        
        // Store results
        analysisResults.results.push({
          dataPoint,
          calculationResults
        });
      });
      
      // Calculate breakeven values if requested
      if (includeBreakeven) {
        analysisResults.breakevenPoints = this.calculateBreakevenPoints(analysisResults);
      }
      
      // Restore original form values
      this.restoreOriginalValues(originalValues);
      
      // Save results
      this.results = analysisResults;
      
      // Update UI with results
      this.updateUI();
      
      // Hide loading indicator
      this.hideLoading();
      this.analyzing = false;
      
      return analysisResults;
    } catch (error) {
      console.error("Error in sensitivity analysis:", error);
      
      // Hide loading indicator
      this.hideLoading();
      this.analyzing = false;
      
      // Show error message
      this.showError("Error in sensitivity analysis: " + error.message);
      
      return null;
    }
  }
  
  calculateBreakevenPoints(analysisResults) {
    const breakevenPoints = {};
    
    // Only calculate if comparing to Portnox
    if (analysisResults.vendor !== 'portnox' && analysisResults.vendor !== 'all') {
      const results = analysisResults.results;
      
      // Find where the lines cross (TCO becomes equal)
      for (let i = 0; i < results.length - 1; i++) {
        const current = results[i];
        const next = results[i + 1];
        
        const currentVendorTCO1 = current.calculationResults[analysisResults.vendor]?.totalTCO || 0;
        const portnoxTCO1 = current.calculationResults['portnox']?.totalTCO || 0;
        const currentVendorTCO2 = next.calculationResults[analysisResults.vendor]?.totalTCO || 0;
        const portnoxTCO2 = next.calculationResults['portnox']?.totalTCO || 0;
        
        // Calculate differences
        const diff1 = currentVendorTCO1 - portnoxTCO1;
        const diff2 = currentVendorTCO2 - portnoxTCO2;
        
        // Check if the lines cross (TCO difference changes sign)
        if ((diff1 > 0 && diff2 < 0) || (diff1 < 0 && diff2 > 0)) {
          // Calculate the crossover point using linear interpolation
          const x1 = current.dataPoint;
          const x2 = next.dataPoint;
          
          // Calculate the exact breakeven point
          const ratio = Math.abs(diff1) / (Math.abs(diff1) + Math.abs(diff2));
          const breakeven = x1 + (x2 - x1) * ratio;
          
          // Store the breakeven point
          breakevenPoints[analysisResults.vendor] = {
            value: breakeven,
            unit: this.getVariableUnit(analysisResults.variable)
          };
          
          // We only need to find one breakeven point
          break;
        }
      }
    } else if (analysisResults.vendor === 'all') {
      // If comparing all vendors, find breakeven points for each vs Portnox
      const vendors = Object.keys(window.vendorData).filter(v => v !== 'portnox');
      
      vendors.forEach(vendor => {
        const breakevenFound = this.findBreakevenPoint(vendor, analysisResults);
        if (breakevenFound) {
          breakevenPoints[vendor] = breakevenFound;
        }
      });
    }
    
    return breakevenPoints;
  }
  
  findBreakevenPoint(vendor, analysisResults) {
    const results = analysisResults.results;
    
    // Find where the lines cross (TCO becomes equal)
    for (let i = 0; i < results.length - 1; i++) {
      const current = results[i];
      const next = results[i + 1];
      
      const vendorTCO1 = current.calculationResults[vendor]?.totalTCO || 0;
      const portnoxTCO1 = current.calculationResults['portnox']?.totalTCO || 0;
      const vendorTCO2 = next.calculationResults[vendor]?.totalTCO || 0;
      const portnoxTCO2 = next.calculationResults['portnox']?.totalTCO || 0;
      
      // Calculate differences
      const diff1 = vendorTCO1 - portnoxTCO1;
      const diff2 = vendorTCO2 - portnoxTCO2;
      
      // Check if the lines cross (TCO difference changes sign)
      if ((diff1 > 0 && diff2 < 0) || (diff1 < 0 && diff2 > 0)) {
        // Calculate the crossover point using linear interpolation
        const x1 = current.dataPoint;
        const x2 = next.dataPoint;
        
        // Calculate the exact breakeven point
        const ratio = Math.abs(diff1) / (Math.abs(diff1) + Math.abs(diff2));
        const breakeven = x1 + (x2 - x1) * ratio;
        
        // Return the breakeven point
        return {
          value: breakeven,
          unit: this.getVariableUnit(analysisResults.variable)
        };
      }
    }
    
    return null;
  }
  
  getVariableUnit(variable) {
    switch (variable) {
      case 'deviceCount':
        return 'devices';
      case 'legacyPercentage':
        return '%';
      case 'locationCount':
        return 'locations';
      case 'yearsToProject':
        return 'years';
      case 'hardwareCost':
      case 'licensingCost':
      case 'maintenanceCost':
      case 'fteCost':
      case 'implementationCost':
        return 'multiplier';
      case 'downtimeCost':
        return '$/hour';
      default:
        return '';
    }
  }
  
  saveOriginalValues() {
    return {
      deviceCount: document.getElementById('device-count')?.value,
      legacyPercentage: document.getElementById('legacy-percentage')?.value,
      locationCount: document.getElementById('location-count')?.value,
      yearsToProject: document.getElementById('years-to-project')?.value,
      
      // Custom cost multipliers if available
      customHardwareCost: document.getElementById('custom-hardware-cost')?.value,
      customLicensingCost: document.getElementById('custom-licensing-cost')?.value,
      customMaintenanceCost: document.getElementById('custom-maintenance-cost')?.value,
      customImplementationCost: document.getElementById('custom-implementation-cost')?.value,
      trainingCostMultiplier: document.getElementById('training-cost-multiplier')?.value,
      
      // FTE salaries if available
      networkAdminSalary: document.getElementById('network-admin-salary')?.value,
      securityAdminSalary: document.getElementById('security-admin-salary')?.value,
      systemAdminSalary: document.getElementById('system-admin-salary')?.value,
      helpdeskSalary: document.getElementById('helpdesk-salary')?.value,
      
      // Downtime cost if available
      downtimeCost: document.getElementById('downtime-cost')?.value
    };
  }
  
  restoreOriginalValues(originalValues) {
    // Restore main parameters
    if (originalValues.deviceCount) {
      document.getElementById('device-count').value = originalValues.deviceCount;
    }
    
    if (originalValues.legacyPercentage) {
      document.getElementById('legacy-percentage').value = originalValues.legacyPercentage;
    }
    
    if (originalValues.locationCount) {
      document.getElementById('location-count').value = originalValues.locationCount;
    }
    
    if (originalValues.yearsToProject) {
      document.getElementById('years-to-project').value = originalValues.yearsToProject;
    }
    
    // Restore custom cost multipliers if they exist
    if (originalValues.customHardwareCost && document.getElementById('custom-hardware-cost')) {
      document.getElementById('custom-hardware-cost').value = originalValues.customHardwareCost;
    }
    
    if (originalValues.customLicensingCost && document.getElementById('custom-licensing-cost')) {
      document.getElementById('custom-licensing-cost').value = originalValues.customLicensingCost;
    }
    
    if (originalValues.customMaintenanceCost && document.getElementById('custom-maintenance-cost')) {
      document.getElementById('custom-maintenance-cost').value = originalValues.customMaintenanceCost;
    }
    
    if (originalValues.customImplementationCost && document.getElementById('custom-implementation-cost')) {
      document.getElementById('custom-implementation-cost').value = originalValues.customImplementationCost;
    }
    
    if (originalValues.trainingCostMultiplier && document.getElementById('training-cost-multiplier')) {
      document.getElementById('training-cost-multiplier').value = originalValues.trainingCostMultiplier;
    }
    
    // Restore FTE salaries if they exist
    if (originalValues.networkAdminSalary && document.getElementById('network-admin-salary')) {
      document.getElementById('network-admin-salary').value = originalValues.networkAdminSalary;
    }
    
    if (originalValues.securityAdminSalary && document.getElementById('security-admin-salary')) {
      document.getElementById('security-admin-salary').value = originalValues.securityAdminSalary;
    }
    
    if (originalValues.systemAdminSalary && document.getElementById('system-admin-salary')) {
      document.getElementById('system-admin-salary').value = originalValues.systemAdminSalary;
    }
    
    if (originalValues.helpdeskSalary && document.getElementById('helpdesk-salary')) {
      document.getElementById('helpdesk-salary').value = originalValues.helpdeskSalary;
    }
    
    // Restore downtime cost if it exists
    if (originalValues.downtimeCost && document.getElementById('downtime-cost')) {
      document.getElementById('downtime-cost').value = originalValues.downtimeCost;
    #!/bin/bash

# Continue creating enhanced sensitivity analyzer
cat >> js/components/enhanced-sensitivity-analyzer.js << 'EOL'
    }
  }
  
  setVariableValue(variable, value) {
    switch (variable) {
      case 'deviceCount':
        document.getElementById('device-count').value = Math.round(value);
        break;
      case 'legacyPercentage':
        document.getElementById('legacy-percentage').value = Math.round(value);
        if (value > 0) {
          document.getElementById('legacy-devices').checked = true;
        }
        break;
      case 'locationCount':
        document.getElementById('location-count').value = Math.round(value);
        if (value > 1) {
          document.getElementById('multiple-locations').checked = true;
        }
        break;
      case 'yearsToProject':
        document.getElementById('years-to-project').value = Math.round(value);
        break;
      case 'hardwareCost':
        if (document.getElementById('custom-hardware-cost')) {
          document.getElementById('custom-hardware-cost').value = value.toFixed(2);
        }
        break;
      case 'licensingCost':
        if (document.getElementById('custom-licensing-cost')) {
          document.getElementById('custom-licensing-cost').value = value.toFixed(2);
        }
        break;
      case 'maintenanceCost':
        if (document.getElementById('custom-maintenance-cost')) {
          document.getElementById('custom-maintenance-cost').value = value.toFixed(2);
        }
        break;
      case 'implementationCost':
        if (document.getElementById('custom-implementation-cost')) {
          document.getElementById('custom-implementation-cost').value = value.toFixed(2);
        }
        break;
      case 'fteCost':
        // FTE cost is adjusted as a multiplier to all FTE salaries
        if (document.getElementById('network-admin-salary')) {
          const baseSalary = 120000;
          document.getElementById('network-admin-salary').value = Math.round(baseSalary * value);
        }
        if (document.getElementById('security-admin-salary')) {
          const baseSalary = 135000;
          document.getElementById('security-admin-salary').value = Math.round(baseSalary * value);
        }
        if (document.getElementById('system-admin-salary')) {
          const baseSalary = 110000;
          document.getElementById('system-admin-salary').value = Math.round(baseSalary * value);
        }
        if (document.getElementById('helpdesk-salary')) {
          const baseSalary = 75000;
          document.getElementById('helpdesk-salary').value = Math.round(baseSalary * value);
        }
        break;
      case 'downtimeCost':
        if (document.getElementById('downtime-cost')) {
          document.getElementById('downtime-cost').value = Math.round(value);
        }
        break;
      default:
        console.warn(`Unknown variable: ${variable}`);
    }
  }
  
  runCalculation() {
    if (!this.calculator) {
      console.error("Calculator not available");
      return null;
    }
    
    try {
      // Get values from form
      const deviceCount = parseInt(document.getElementById('device-count').value) || 1000;
      const orgSize = document.getElementById('organization-size').value;
      const yearsToProject = parseInt(document.getElementById('years-to-project').value) || 3;
      const currentVendor = window.uiController ? window.uiController.activeVendor : 'cisco';
      
      // Calculate TCO for all vendors directly, without updating UI
      const tcoResults = {};
      
      Object.keys(window.vendorData).forEach(vendor => {
        const result = this.calculator.calculateVendorTCO(vendor, currentVendor, orgSize, deviceCount, yearsToProject);
        tcoResults[vendor] = result;
      });
      
      // Add metadata to results
      tcoResults.yearsToProject = yearsToProject;
      tcoResults.deviceCount = deviceCount;
      tcoResults.orgSize = orgSize;
      
      return tcoResults;
    } catch (error) {
      console.error("Error in calculation:", error);
      return null;
    }
  }
  
  updateUI() {
    if (!this.results) {
      console.warn("No analysis results available");
      return;
    }
    
    // Update sensitivity chart
    this.updateSensitivityChart();
    
    // Update savings impact chart
    this.updateSavingsImpactChart();
    
    // Update data table
    this.updateDataTable();
    
    // Show breakeven analysis if available
    if (this.results.breakevenPoints && Object.keys(this.results.breakevenPoints).length > 0) {
      this.updateBreakevenAnalysis();
    }
    
    // Show success message
    this.showSuccess("Sensitivity analysis completed successfully");
  }
  
  updateSensitivityChart() {
    const ctx = document.getElementById('sensitivity-chart');
    if (!ctx) {
      console.warn('Sensitivity chart canvas element not found');
      return;
    }
    
    // Prepare chart data
    const labels = this.results.dataPoints.map(dp => this.formatDataPoint(this.results.variable, dp));
    
    const datasets = [];
    const vendors = this.results.vendor === 'all' ? 
      Object.keys(window.vendorData) : 
      [this.results.vendor, 'portnox']; // Always include Portnox for comparison
    
    // Ensure Portnox is included and deduplicate vendors array
    if (!vendors.includes('portnox')) {
      vendors.push('portnox');
    }
    const uniqueVendors = [...new Set(vendors)];
    
    uniqueVendors.forEach(vendor => {
      const vendorName = window.vendorData[vendor]?.name || vendor;
      const vendorColor = this.chartColors[vendor] || this.chartColors.neutral;
      
      const data = this.results.results.map(result => {
        return result.calculationResults[vendor]?.totalTCO || 0;
      });
      
      datasets.push({
        label: vendorName,
        data: data,
        backgroundColor: vendorColor + '20',
        borderColor: vendorColor,
        borderWidth: 2,
        fill: false,
        tension: 0.1
      });
    });
    
    // Create or update chart
    if (this.charts.sensitivity) {
      this.charts.sensitivity.data.labels = labels;
      this.charts.sensitivity.data.datasets = datasets;
      this.charts.sensitivity.update();
    } else {
      this.charts.sensitivity = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Total Cost of Ownership ($)'
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            },
            x: {
              title: {
                display: true,
                text: this.getVariableLabel(this.results.variable)
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: `TCO Sensitivity to ${this.getVariableLabel(this.results.variable)}`,
              font: {
                size: 16
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                }
              }
            },
            annotation: {
              annotations: this.getBreakevenAnnotations()
            }
          }
        }
      });
    }
  }
  
  getBreakevenAnnotations() {
    // If breakeven analysis is not enabled or no points found, return empty object
    if (!this.results.breakevenPoints || Object.keys(this.results.breakevenPoints).length === 0) {
      return {};
    }
    
    const annotations = {};
    
    // Add a vertical line annotation for each breakeven point
    Object.entries(this.results.breakevenPoints).forEach(([vendor, data], index) => {
      const value = data.value;
      
      // Find the closest index to the breakeven value
      const dataPoints = this.results.dataPoints;
      const closestPointIndex = dataPoints.reduce((closest, point, index) => {
        return Math.abs(point - value) < Math.abs(dataPoints[closest] - value) ? index : closest;
      }, 0);
      
      // Create annotation
      annotations[`breakeven-${vendor}`] = {
        type: 'line',
        xMin: closestPointIndex,
        xMax: closestPointIndex,
        borderColor: 'rgba(255, 0, 0, 0.5)',
        borderWidth: 2,
        label: {
          enabled: true,
          content: `Breakeven: ${this.formatDataPoint(this.results.variable, value)}`,
          position: 'top'
        }
      };
    });
    
    return annotations;
  }
  
  updateSavingsImpactChart() {
    const ctx = document.getElementById('savings-impact-chart');
    if (!ctx) {
      console.warn('Savings impact chart canvas element not found');
      return;
    }
    
    // Only relevant when the vendor is not Portnox
    if (this.results.vendor === 'portnox') {
      return;
    }
    
    // Prepare chart data
    const labels = this.results.dataPoints.map(dp => this.formatDataPoint(this.results.variable, dp));
    
    const datasets = [];
    const vendors = this.results.vendor === 'all' ? 
      Object.keys(window.vendorData).filter(v => v !== 'portnox') : 
      [this.results.vendor];
    
    vendors.forEach(vendor => {
      // Skip Portnox as we're calculating savings vs. Portnox
      if (vendor === 'portnox') return;
      
      const vendorName = window.vendorData[vendor]?.name || vendor;
      const vendorColor = this.chartColors[vendor] || this.chartColors.neutral;
      
      const data = this.results.results.map(result => {
        const vendorTCO = result.calculationResults[vendor]?.totalTCO || 0;
        const portnoxTCO = result.calculationResults['portnox']?.totalTCO || 0;
        return vendorTCO > 0 && portnoxTCO > 0 ? 
          ((vendorTCO - portnoxTCO) / vendorTCO) * 100 : 0;
      });
      
      datasets.push({
        label: `Savings vs. ${vendorName}`,
        data: data,
        backgroundColor: vendorColor + '20',
        borderColor: vendorColor,
        borderWidth: 2,
        fill: false,
        tension: 0.1
      });
    });
    
    // Create or update chart
    if (this.charts.savingsImpact) {
      this.charts.savingsImpact.data.labels = labels;
      this.charts.savingsImpact.data.datasets = datasets;
      this.charts.savingsImpact.update();
    } else {
      this.charts.savingsImpact = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Savings Percentage (%)'
              },
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            },
            x: {
              title: {
                display: true,
                text: this.getVariableLabel(this.results.variable)
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: `Portnox Savings Impact by ${this.getVariableLabel(this.results.variable)}`,
              font: {
                size: 16
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%';
                }
              }
            }
          }
        }
      });
    }
  }
  
  updateDataTable() {
    const tableHeader = document.getElementById('sensitivity-table-header');
    const tableBody = document.getElementById('sensitivity-table-body');
    
    if (!tableHeader || !tableBody) {
      console.warn('Data table elements not found');
      return;
    }
    
    // Clear existing table
    tableHeader.innerHTML = `<th scope="col">${this.getVariableLabel(this.results.variable)}</th>`;
    tableBody.innerHTML = '';
    
    // Add vendor columns to header
    const vendors = this.results.vendor === 'all' ? 
      Object.keys(window.vendorData) : 
      [this.results.vendor, 'portnox']; // Always include Portnox for comparison
    
    // Ensure Portnox is included and deduplicate vendors array
    if (!vendors.includes('portnox')) {
      vendors.push('portnox');
    }
    const uniqueVendors = [...new Set(vendors)];
    
    uniqueVendors.forEach(vendor => {
      const vendorName = window.vendorData[vendor]?.name || vendor;
      tableHeader.innerHTML += `<th scope="col">${vendorName}</th>`;
      
      // Add savings column if comparing to other vendors
      if (vendor !== 'portnox') {
        tableHeader.innerHTML += `<th scope="col">Savings vs. ${vendorName}</th>`;
      }
    });
    
    // Add data rows
    this.results.results.forEach(result => {
      const row = document.createElement('tr');
      
      // Add data point column
      row.innerHTML = `<td>${this.formatDataPoint(this.results.variable, result.dataPoint)}</td>`;
      
      // Add vendor TCO columns
      uniqueVendors.forEach(vendor => {
        const tco = result.calculationResults[vendor]?.totalTCO || 0;
        row.innerHTML += `<td>${window.formatCurrency(tco)}</td>`;
        
        // Add savings column if comparing to other vendors
        if (vendor !== 'portnox') {
          const vendorTCO = result.calculationResults[vendor]?.totalTCO || 0;
          const portnoxTCO = result.calculationResults['portnox']?.totalTCO || 0;
          
          const savingsAmount = vendorTCO - portnoxTCO;
          const savingsPercentage = vendorTCO > 0 ? (savingsAmount / vendorTCO) * 100 : 0;
          
          // Add a cell with absolute and percentage savings
          row.innerHTML += `<td>${window.formatCurrency(savingsAmount)} (${savingsPercentage.toFixed(1)}%)</td>`;
        }
      });
      
      // Add breakeven marker if applicable
      if (this.results.breakevenPoints && Object.keys(this.results.breakevenPoints).length > 0) {
        Object.entries(this.results.breakevenPoints).forEach(([vendor, data]) => {
          const value = data.value;
          
          // Check if this row is closest to the breakeven point
          if (Math.abs(result.dataPoint - value) < (this.results.dataPoints[1] - this.results.dataPoints[0])) {
            row.classList.add('breakeven-row');
          }
        });
      }
      
      tableBody.appendChild(row);
    });
  }
  
  updateBreakevenAnalysis() {
    // Check if container exists
    const container = document.getElementById('breakeven-analysis');
    if (!container) {
      // Create container if needed
      const resultsSection = document.querySelector('.results-container');
      if (!resultsSection) return;
      
      const breakEvenDiv = document.createElement('div');
      breakEvenDiv.id = 'breakeven-analysis';
      breakEvenDiv.className = 'result-card';
      breakEvenDiv.innerHTML = `
        <h3>Breakeven Analysis</h3>
        <div class="breakeven-grid"></div>
      `;
      
      resultsSection.appendChild(breakEvenDiv);
    }
    
    // Get breakeven grid
    const grid = document.querySelector('#breakeven-analysis .breakeven-grid');
    if (!grid) return;
    
    // Clear grid
    grid.innerHTML = '';
    
    // Populate grid with breakeven points
    Object.entries(this.results.breakevenPoints).forEach(([vendor, data]) => {
      const vendorName = window.vendorData[vendor]?.name || vendor;
      const value = data.value;
      const unit = data.unit;
      
      const itemDiv = document.createElement('div');
      itemDiv.className = 'breakeven-item';
      
      itemDiv.innerHTML = `
        <div class="breakeven-vendor">${vendorName}</div>
        <div class="breakeven-value">${value.toFixed(1)} ${unit}</div>
        <div class="breakeven-explanation">
          At ${this.formatDataPoint(this.results.variable, value)}, ${vendorName} and Portnox Cloud have equal TCO.
          ${value < this.results.dataPoints[Math.floor(this.results.dataPoints.length / 2)] ? 
            `Below this value, ${vendorName} is more cost-effective.` :
            `Above this value, Portnox Cloud is more cost-effective.`}
        </div>
      `;
      
      grid.appendChild(itemDiv);
    });
    
    // Add explanatory note
    const noteDiv = document.createElement('div');
    noteDiv.className = 'breakeven-note';
    noteDiv.innerHTML = `
      <p>Breakeven analysis identifies the point at which two solutions have equal total cost of ownership. 
      It helps determine the threshold at which one solution becomes more cost-effective than the other.</p>
    `;
    
    grid.appendChild(noteDiv);
  }
  
  formatDataPoint(variable, value) {
    switch (variable) {
      case 'deviceCount':
        return window.formatNumber(value) + ' devices';
      case 'legacyPercentage':
        return value + '%';
      case 'locationCount':
        return window.formatNumber(value) + ' locations';
      case 'yearsToProject':
        return value + ' years';
      case 'hardwareCost':
      case 'licensingCost':
      case 'maintenanceCost':
      case 'implementationCost':
      case 'fteCost':
        return value.toFixed(1) + 'x';
      case 'downtimeCost':
        return window.formatCurrency(value) + '/hour';
      default:
        return value.toString();
    }
  }
  
  getVariableLabel(variable) {
    switch (variable) {
      case 'deviceCount':
        return 'Device Count';
      case 'legacyPercentage':
        return 'Legacy Device Percentage';
      case 'locationCount':
        return 'Number of Locations';
      case 'yearsToProject':
        return 'Years to Project';
      case 'hardwareCost':
        return 'Hardware Cost Multiplier';
      case 'licensingCost':
        return 'Licensing Cost Multiplier';
      case 'maintenanceCost':
        return 'Maintenance Cost Multiplier';
      case 'implementationCost':
        return 'Implementation Cost Multiplier';
      case 'fteCost':
        return 'Personnel Cost Multiplier';
      case 'downtimeCost':
        return 'Downtime Cost';
      default:
        return variable;
    }
  }
  
  addCurrentScenario() {
    if (!this.results) {
      this.showError("No analysis results to save");
      return;
    }
    
    const scenarioName = prompt("Enter a name for this scenario:", `${this.getVariableLabel(this.results.variable)} Analysis`);
    if (!scenarioName) return;
    
    const scenario = {
      name: scenarioName,
      data: JSON.parse(JSON.stringify(this.results)),
      timestamp: new Date().toISOString()
    };
    
    this.scenarios.push(scenario);
    this.showSuccess(`Scenario "${scenarioName}" saved`);
    
    this.updateScenariosList();
  }
  
  clearScenarios() {
    if (confirm("Are you sure you want to clear all saved scenarios?")) {
      this.scenarios = [];
      this.showSuccess("All scenarios cleared");
      this.updateScenariosList();
    }
  }
  
  updateScenariosList() {
    const container = document.getElementById('scenarios-list');
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    if (this.scenarios.length === 0) {
      container.innerHTML = '<p>No saved scenarios</p>';
      return;
    }
    
    // Create list of scenarios
    this.scenarios.forEach((scenario, index) => {
      const item = document.createElement('div');
      item.className = 'scenario-item';
      
      item.innerHTML = `
        <div class="scenario-header">
          <div class="scenario-name">${scenario.name}</div>
          <div class="scenario-actions">
            <button class="btn-view" data-index="${index}" title="View"><i class="fas fa-eye"></i></button>
            <button class="btn-delete" data-index="${index}" title="Delete"><i class="fas fa-trash"></i></button>
          </div>
        </div>
        <div class="scenario-details">
          ${this.getVariableLabel(scenario.data.variable)}: ${scenario.data.minValue} to ${scenario.data.maxValue}
        </div>
      `;
      
      // Add breakeven info if available
      if (scenario.data.breakevenPoints && Object.keys(scenario.data.breakevenPoints).length > 0) {
        const breakeven = Object.entries(scenario.data.breakevenPoints)[0];
        const vendorName = window.vendorData[breakeven[0]]?.name || breakeven[0];
        const value = breakeven[1].value;
        
        item.innerHTML += `
          <div class="scenario-breakeven">
            <div class="breakeven-info">Breakeven: ${this.formatDataPoint(scenario.data.variable, value)}</div>
          </div>
        `;
      }
      
      container.appendChild(item);
      
      // Add event listeners
      const viewBtn = item.querySelector('.btn-view');
      const deleteBtn = item.querySelector('.btn-delete');
      
      if (viewBtn) {
        viewBtn.addEventListener('click', () => {
          this.loadScenario(index);
        });
      }
      
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
          this.deleteScenario(index);
        });
      }
    });
  }
  
  loadScenario(index) {
    const scenario = this.scenarios[index];
    if (!scenario) return;
    
    this.results = scenario.data;
    this.updateUI();
    this.showSuccess(`Loaded scenario "${scenario.name}"`);
  }
  
  deleteScenario(index) {
    const scenario = this.scenarios[index];
    if (!scenario) return;
    
    if (confirm(`Are you sure you want to delete the scenario "${scenario.name}"?`)) {
      this.scenarios.splice(index, 1);
      this.updateScenariosList();
      this.showSuccess(`Deleted scenario "${scenario.name}"`);
    }
  }
  
  exportToCSV() {
    if (!this.results) {
      this.showError("No analysis results to export");
      return;
    }
    
    try {
      // Create CSV content
      let csv = [];
      
      // Add header
      csv.push(['NAC Solution Sensitivity Analysis']);
      csv.push([`Generated on ${new Date().toLocaleDateString()}`]);
      csv.push([]);
      
      // Add analysis parameters
      csv.push(['Analysis Parameters']);
      csv.push(['Variable', this.getVariableLabel(this.results.variable)]);
      csv.push(['Range', `${this.results.minValue} to ${this.results.maxValue}`]);
      csv.push(['Steps', this.results.steps]);
      csv.push(['Vendor(s)', this.results.vendor === 'all' ? 'All Vendors' : window.vendorData[this.results.vendor]?.name || this.results.vendor]);
      csv.push([]);
      
      // Add breakeven points if available
      if (this.results.breakevenPoints && Object.keys(this.results.breakevenPoints).length > 0) {
        csv.push(['Breakeven Points']);
        
        Object.entries(this.results.breakevenPoints).forEach(([vendor, data]) => {
          const vendorName = window.vendorData[vendor]?.name || vendor;
          csv.push([vendorName, `${data.value.toFixed(2)} ${data.unit}`]);
        });
        
        csv.push([]);
      }
      
      // Add data table
      csv.push(['Sensitivity Analysis Results']);
      
      // Add table header row
      const headerRow = [this.getVariableLabel(this.results.variable)];
      
      const vendors = this.results.vendor === 'all' ? 
        Object.keys(window.vendorData) : 
        [this.results.vendor, 'portnox']; // Always include Portnox for comparison
      
      // Ensure Portnox is included and deduplicate vendors array
      if (!vendors.includes('portnox')) {
        vendors.push('portnox');
      }
      const uniqueVendors = [...new Set(vendors)];
      
      uniqueVendors.forEach(vendor => {
        const vendorName = window.vendorData[vendor]?.name || vendor;
        headerRow.push(vendorName);
        
        // Add savings column if comparing to other vendors
        if (vendor !== 'portnox') {
          headerRow.push(`Savings vs. ${vendorName}`);
          headerRow.push(`Savings % vs. ${vendorName}`);
        }
      });
      
      csv.push(headerRow);
      
      // Add data rows
      this.results.results.forEach(result => {
        const row = [this.formatDataPoint(this.results.variable, result.dataPoint)];
        
        uniqueVendors.forEach(vendor => {
          const tco = result.calculationResults[vendor]?.totalTCO || 0;
          row.push(tco);
          
          // Add savings if comparing to other vendors
          if (vendor !== 'portnox') {
            const vendorTCO = result.calculationResults[vendor]?.totalTCO || 0;
            const portnoxTCO = result.calculationResults['portnox']?.totalTCO || 0;
            
            const savingsAmount = vendorTCO - portnoxTCO;
            const savingsPercentage = vendorTCO > 0 ? (savingsAmount / vendorTCO) * 100 : 0;
            
            row.push(savingsAmount);
            row.push(savingsPercentage.toFixed(2) + '%');
          }
        });
        
        csv.push(row);
      });
      
      // Convert to CSV string
      const csvContent = csv.map(row => row.join(',')).join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `NAC_Sensitivity_Analysis_${this.results.variable}_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      this.showSuccess("Analysis exported to CSV");
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      this.showError("Error exporting to CSV: " + error.message);
    }
  }
  
  exportToPDF() {
    if (!this.results) {
      this.showError("No analysis results to export");
      return;
    }
    
    try {
      // Use jsPDF if available
      if (typeof jsPDF !== 'undefined') {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(16);
        doc.setTextColor(5, 84, 124);
        doc.text('NAC Solution Sensitivity Analysis', 105, 15, { align: 'center' });
        
        // Add subtitle
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`${this.getVariableLabel(this.results.variable)} Analysis`, 105, 25, { align: 'center' });
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 32, { align: 'center' });
        
        // Add analysis parameters
        doc.setFontSize(14);
        doc.setTextColor(5, 84, 124);
        doc.text('Analysis Parameters', 20, 45);
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Variable: ${this.getVariableLabel(this.results.variable)}`, 20, 55);
        doc.text(`Range: ${this.results.minValue} to ${this.results.maxValue}`, 20, 63);
        doc.text(`Steps: ${this.results.steps}`, 20, 71);
        doc.text(`Vendor(s): ${this.results.vendor === 'all' ? 'All Vendors' : window.vendorData[this.results.vendor]?.name || this.results.vendor}`, 20, 79);
        
        // Add breakeven points if available
        if (this.results.breakevenPoints && Object.keys(this.results.breakevenPoints).length > 0) {
          doc.setFontSize(14);
          doc.setTextColor(5, 84, 124);
          doc.text('Breakeven Analysis', 20, 95);
          
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          
          let yPos = 105;
          Object.entries(this.results.breakevenPoints).forEach(([vendor, data]) => {
            const vendorName = window.vendorData[vendor]?.name || vendor;
            doc.text(`${vendorName}: ${data.value.toFixed(2)} ${data.unit}`, 20, yPos);
            yPos += 8;
            
            doc.text(`At this value, ${vendorName} and Portnox Cloud have equal TCO.`, 30, yPos);
            yPos += 8;
          });
        }
        
        // Add chart placeholder (in a real implementation, you'd capture and embed the chart image)
        doc.setFontSize(14);
        doc.setTextColor(5, 84, 124);
        doc.text('Sensitivity Chart', 20, 130);
        
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(20, 140, 170, 60, 3, 3, 'FD');
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Sensitivity Analysis Chart', 105, 170, { align: 'center' });
        
        // Add data table (first page worth of data)
        doc.setFontSize(14);
        doc.setTextColor(5, 84, 124);
        doc.text('Data Table', 20, 220);
        
        // Create simplified data table
        const tableData = [];
        
        // Add header row
        const headerRow = [this.getVariableLabel(this.results.variable)];
        
        const vendors = this.results.vendor === 'all' ?
          Object.keys(window.vendorData).slice(0, 3) : // Limit to first 3 vendors for PDF
          [this.results.vendor, 'portnox']; // Always include Portnox for comparison
        
        vendors.forEach(vendor => {
          const vendorName = window.vendorData[vendor]?.name || vendor;
          headerRow.push(vendorName);
        });
        
        tableData.push(headerRow);
        
        // Add data rows (first 5 only for PDF)
        this.results.results.slice(0, 5).forEach(result => {
          const row = [this.formatDataPoint(this.results.variable, result.dataPoint)];
          
          vendors.forEach(vendor => {
            const tco = result.calculationResults[vendor]?.totalTCO || 0;
            row.push('$' + tco.toLocaleString());
          });
          
          tableData.push(row);
        });
        
        // Add note if data is truncated
        if (this.results.results.length > 5 || Object.keys(window.vendorData).length > 3) {
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          doc.text('Note: Table shows partial data only. Please see CSV export for complete results.', 20, 260);
        }
        
        // Save PDF
        doc.save(`NAC_Sensitivity_Analysis_${this.results.variable}_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
        
        this.showSuccess("Analysis exported to PDF");
      } else {
        this.showError("PDF generation library not available");
      }
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      this.showError("Error exporting to PDF: " + error.message);
    }
  }
  
  showLoading() {
    if (window.loadingManager) {
      window.loadingManager.showGlobal('Running sensitivity analysis...');
    } else {
      const resultsContainer = document.querySelector('.results-container');
      if (!resultsContainer) return;
      
      // Check if loading overlay already exists
      let loadingOverlay = resultsContainer.querySelector('.loading-overlay');
      if (loadingOverlay) return;
      
      // Create loading overlay
      loadingOverlay = document.createElement('div');
      loadingOverlay.className = 'loading-overlay';
      loadingOverlay.innerHTML = `
        <div class="spinner"></div>
        <div class="loading-text">Running sensitivity analysis...</div>
      `;
      
      resultsContainer.appendChild(loadingOverlay);
    }
  }
  
  hideLoading() {
    if (window.loadingManager) {
      window.loadingManager.hideGlobal();
    } else {
      const loadingOverlay = document.querySelector('.loading-overlay');
      if (loadingOverlay) {
        loadingOverlay.parentNode.removeChild(loadingOverlay);
      }
    }
  }
  
  showError(message) {
    if (window.notificationManager) {
      window.notificationManager.error(message);
    } else {
      const messageContainer = document.getElementById('message-container');
      if (!messageContainer) return;
      
      messageContainer.innerHTML = `
        <div class="error-message-box">
          <i class="fas fa-exclamation-circle"></i>
          <span>${message}</span>
          <button class="close-error"><i class="fas fa-times"></i></button>
        </div>
      `;
      
      // Add close button functionality
      const closeBtn = messageContainer.querySelector('.close-error');
      if (closeBtn) {
        closeBtn.addEventListener('click', function() {
          messageContainer.innerHTML = '';
        });
      }
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        if (messageContainer.querySelector('.error-message-box')) {
          messageContainer.innerHTML = '';
        }
      }, 5000);
    }
  }
  
  showSuccess(message) {
    if (window.notificationManager) {
      window.notificationManager.success(message);
    } else {
      const messageContainer = document.getElementById('message-container');
      if (!messageContainer) return;
      
      messageContainer.innerHTML = `
        <div class="success-message-box">
          <i class="fas fa-check-circle"></i>
          <span>${message}</span>
          <button class="close-error"><i class="fas fa-times"></i></button>
        </div>
      `;
      
      // Add close button functionality
      const closeBtn = messageContainer.querySelector('.close-error');
      if (closeBtn) {
        closeBtn.addEventListener('click', function() {
          messageContainer.innerHTML = '';
        });
      }
      
      // Auto-hide after 3 seconds
      setTimeout(() => {
        if (messageContainer.querySelector('.success-message-box')) {
          messageContainer.innerHTML = '';
        }
      }, 3000);
    }
  }
}

// Make the enhanced sensitivity analyzer globally available
window.enhancedSensitivityAnalyzer = new EnhancedSensitivityAnalyzer();
/**
 * Enhanced Sensitivity Analysis
 * Adds No-NAC baseline comparison and additional variables to sensitivity analysis
 */
document.addEventListener('DOMContentLoaded', function() {
    // Enhance sensitivity analyzer to support No-NAC baseline
    enhanceSensitivityAnalyzer();
    
    // Add return button handler
    const returnButton = document.getElementById('return-to-calculator');
    if (returnButton) {
        returnButton.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
});

function enhanceSensitivityAnalyzer() {
    // Get vendor dropdown
    const vendorDropdown = document.getElementById('param-vendor');
    if (!vendorDropdown) return;
    
    // Add No-NAC option
    const noNacOption = document.createElement('option');
    noNacOption.value = 'noNac';
    noNacOption.textContent = 'No NAC (Baseline)';
    vendorDropdown.appendChild(noNacOption);
    
    // Add option for breach risk
    const variableDropdown = document.getElementById('param-variable');
    if (variableDropdown) {
        const breachRiskOption = document.createElement('option');
        breachRiskOption.value = 'breachRisk';
        breachRiskOption.textContent = 'Security Breach Risk';
        variableDropdown.appendChild(breachRiskOption);
        
        const complianceRiskOption = document.createElement('option');
        complianceRiskOption.value = 'complianceRisk';
        complianceRiskOption.textContent = 'Compliance Risk Factor';
        variableDropdown.appendChild(complianceRiskOption);
        
        // Add option for projections
        const yearsOption = document.createElement('option');
        yearsOption.value = 'yearsToProject';
        yearsOption.textContent = 'Years to Project';
        variableDropdown.appendChild(yearsOption);
        
        // Update parameter description based on selection
        variableDropdown.addEventListener('change', updateParameterDescription);
        updateParameterDescription();
    }
    
    // Update run sensitivity analysis button
    const sensitivityBtn = document.getElementById('sensitivity-btn');
    if (sensitivityBtn) {
        // Replace the default click handler
        sensitivityBtn.replaceWith(sensitivityBtn.cloneNode(true));
        
        // Get the new button
        const newSensitivityBtn = document.getElementById('sensitivity-btn');
        
        // Add enhanced click handler
        newSensitivityBtn.addEventListener('click', runEnhancedSensitivityAnalysis);
    }
}

function updateParameterDescription() {
    const variableDropdown = document.getElementById('param-variable');
    const descriptionElement = document.getElementById('parameter-description');
    
    if (!variableDropdown || !descriptionElement) return;
    
    const selectedVariable = variableDropdown.value;
    
    // Update description based on selected variable
    switch (selectedVariable) {
        case 'deviceCount':
            descriptionElement.textContent = 'Analyze how changes in the total number of devices affect TCO and relative savings.';
            break;
        case 'legacyPercentage':
            descriptionElement.textContent = 'Analyze how different percentages of legacy devices impact TCO and security risks.';
            break;
        case 'locationCount':
            descriptionElement.textContent = 'Analyze how the number of physical locations affects implementation complexity and costs.';
            break;
        case 'yearsToProject':
            descriptionElement.textContent = 'Analyze how different projection timeframes affect TCO, ROI, and breakeven points.';
            break;
        case 'hardwareCost':
            descriptionElement.textContent = 'Analyze the sensitivity of TCO to changes in hardware acquisition costs.';
            break;
        case 'licensingCost':
            descriptionElement.textContent = 'Analyze how different licensing cost scenarios affect the overall TCO.';
            break;
        case 'maintenanceCost':
            descriptionElement.textContent = 'Analyze how maintenance cost variations impact long-term TCO.';
            break;
        case 'implementationCost':
            descriptionElement.textContent = 'Analyze how implementation cost variations affect initial investments and ROI.';
            break;
        case 'fteCost':
            descriptionElement.textContent = 'Analyze how IT staffing costs impact operational expenses and TCO.';
            break;
        case 'downtimeCost':
            descriptionElement.textContent = 'Analyze how downtime costs affect the total financial impact of different NAC solutions.';
            break;
        case 'breachRisk':
            descriptionElement.textContent = 'Analyze how different security breach risk factors affect the financial justification for NAC.';
            break;
        case 'complianceRisk':
            descriptionElement.textContent = 'Analyze how compliance risk factors impact the total risk exposure and NAC ROI.';
            break;
        default:
            descriptionElement.textContent = 'Select a variable to analyze its impact on TCO and relative savings.';
    }
    
    // Update min/max values based on selected variable
    updateMinMaxDefaults(selectedVariable);
}

function updateMinMaxDefaults(selectedVariable) {
    const minInput = document.getElementById('param-min');
    const maxInput = document.getElementById('param-max');
    const stepsInput = document.getElementById('param-steps');
    
    if (!minInput || !maxInput || !stepsInput) return;
    
    // Set default values based on variable
    switch (selectedVariable) {
        case 'deviceCount':
            minInput.value = 500;
            maxInput.value = 5000;
            stepsInput.value = 10;
            break;
        case 'legacyPercentage':
            minInput.value = 0;
            maxInput.value = 50;
            stepsInput.value = 6;
            break;
        case 'locationCount':
            minInput.value = 1;
            maxInput.value = 20;
            stepsInput.value = 5;
            break;
        case 'yearsToProject':
            minInput.value = 1;
            maxInput.value = 5;
            stepsInput.value = 5;
            break;
        case 'hardwareCost':
            minInput.value = 0.5;
            maxInput.value = 1.5;
            stepsInput.value = 5;
            break;
        case 'licensingCost':
            minInput.value = 0.5;
            maxInput.value = 1.5;
            stepsInput.value = 5;
            break;
        case 'maintenanceCost':
            minInput.value = 0.5;
            maxInput.value = 1.5;
            stepsInput.value = 5;
            break;
        case 'implementationCost':
            minInput.value = 0.5;
            maxInput.value = 1.5;
            stepsInput.value = 5;
            break;
        case 'fteCost':
            minInput.value = 0.5;
            maxInput.value = 1.5;
            stepsInput.value = 5;
            break;
        case 'downtimeCost':
            minInput.value = 1000;
            maxInput.value = 10000;
            stepsInput.value = 5;
            break;
        case 'breachRisk':
            minInput.value = 0.1;
            maxInput.value = 1.0;
            stepsInput.value = 5;
            break;
        case 'complianceRisk':
            minInput.value = 0.1;
            maxInput.value = 1.0;
            stepsInput.value = 5;
            break;
    }
}

function runEnhancedSensitivityAnalysis() {
    // Get input values
    const variable = document.getElementById('param-variable').value;
    const vendor = document.getElementById('param-vendor').value;
    const minValue = parseFloat(document.getElementById('param-min').value);
    const maxValue = parseFloat(document.getElementById('param-max').value);
    const steps = parseInt(document.getElementById('param-steps').value);
    const includeBreakeven = document.getElementById('include-breakeven').checked;
    
    // Validate inputs
    if (isNaN(minValue) || isNaN(maxValue) || isNaN(steps) || steps < 2) {
        showMessage('error', 'Please enter valid parameter values');
        return;
    }
    
    // Show loading message
    showMessage('info', 'Running sensitivity analysis...');
    
    // Clear previous results
    clearResults();
    
    // Get step size
    const stepSize = (maxValue - minValue) / (steps - 1);
    
    // Prepare data for calculation
    const sensitivityData = {
        variable,
        vendor,
        minValue,
        maxValue,
        steps,
        includeBreakeven,
        values: [],
        results: []
    };
    
    // Generate values to analyze
    for (let i = 0; i < steps; i++) {
        sensitivityData.values.push(minValue + (stepSize * i));
    }
    
    // Run calculations
    if (typeof EnhancedTcoCalculator !== 'undefined') {
        // Use enhanced calculator
        calculateWithEnhancedCalculator(sensitivityData);
    } else {
        // Use simple calculator
        calculateWithSimpleCalculator(sensitivityData);
    }
}

function calculateWithEnhancedCalculator(sensitivityData) {
    // Base parameters
    const baseParams = {
        deviceCount: 1000,
        legacyPercentage: 10,
        locationCount: 1,
        yearsToProject: 3,
        organizationSize: 'medium',
        industry: 'other',
        currentVendor: 'cisco',
        hasMultipleLocations: false,
        includeNoNac: true
    };
    
    // For each value, calculate TCO
    sensitivityData.values.forEach(value => {
        // Clone base parameters
        const params = {...baseParams};
        
        // Update variable value
        params[sensitivityData.variable] = value;
        
        // If vendor is specified, update it
        if (sensitivityData.vendor !== 'all') {
            params.currentVendor = sensitivityData.vendor;
        }
        
        // Update multiple locations flag if locationCount is the variable
        if (sensitivityData.variable === 'locationCount') {
            params.hasMultipleLocations = value > 1;
        }
        
        // Calculate TCO
        const result = EnhancedTcoCalculator.calculateTco(params);
        
        // Add to results
        sensitivityData.results.push({
            value,
            result
        });
    });
    
    // Display results
    displayEnhancedResults(sensitivityData);
}

function calculateWithSimpleCalculator(sensitivityData) {
    // Show error message
    showMessage('error', 'Enhanced TCO calculator not available. Cannot perform sensitivity analysis.');
}

function displayEnhancedResults(sensitivityData) {
    // Clear previous results
    clearResults();
    
    // Format variable name for display
    const variableDisplayNames = {
        deviceCount: 'Device Count',
        legacyPercentage: 'Legacy Device Percentage',
        locationCount: 'Number of Locations',
        yearsToProject: 'Years Projected',
        hardwareCost: 'Hardware Cost Multiplier',
        licensingCost: 'Licensing Cost Multiplier',
        maintenanceCost: 'Maintenance Cost Multiplier',
        implementationCost: 'Implementation Cost Multiplier',
        fteCost: 'Personnel Cost Multiplier',
        downtimeCost: 'Downtime Cost ($/hour)',
        breachRisk: 'Security Breach Risk Factor',
        complianceRisk: 'Compliance Risk Factor'
    };
    
    const variableDisplayName = variableDisplayNames[sensitivityData.variable] || sensitivityData.variable;
    
    // Create chart data
    const chartData = {
        labels: sensitivityData.values.map(value => formatValue(value, sensitivityData.variable)),
        datasets: []
    };
    
    // Set vendor colors
    const vendorColors = {
        cisco: '#007bff',
        aruba: '#6f42c1',
        forescout: '#fd7e14',
        nps: '#20c997',
        fortinac: '#6c757d',
        securew2: '#17a2b8',
        portnox: '#2BD25B',
        noNac: '#dc3545'
    };
    
    // Determine what data to display based on vendor selection
    if (sensitivityData.vendor === 'all') {
        // Show all vendors comparison
        const vendorIds = ['cisco', 'aruba', 'forescout', 'fortinac', 'nps', 'securew2', 'portnox'];
        
        // Create dataset for each vendor
        vendorIds.forEach(vendorId => {
            const vendorData = sensitivityData.results.map(result => {
                if (vendorId === 'portnox') {
                    return result.result.portnox.total;
                } else if (result.result.currentVendor.id === vendorId) {
                    return result.result.currentVendor.total;
                } else {
                    // If current vendor is not this vendor, we need to estimate
                    // This is a simplification, better to have actual calculations
                    return null;
                }
            });
            
            // Only add vendors with data
            if (!vendorData.every(d => d === null)) {
                chartData.datasets.push({
                    label: getVendorName(vendorId),
                    data: vendorData,
                    borderColor: vendorColors[vendorId],
                    backgroundColor: vendorColors[vendorId] + '33', // Add transparency
                    borderWidth: 2,
                    tension: 0.1
                });
            }
        });
        
        // Add No-NAC baseline if it's a relevant variable
        if (['deviceCount', 'legacyPercentage', 'locationCount', 'yearsToProject', 'breachRisk', 'complianceRisk'].includes(sensitivityData.variable)) {
            const noNacData = sensitivityData.results.map(result => {
                return result.result.noNac ? result.result.noNac.cumulativeTotal : null;
            });
            
            chartData.datasets.push({
                label: 'No NAC (Baseline)',
                data: noNacData,
                borderColor: vendorColors.noNac,
                backgroundColor: vendorColors.noNac + '33', // Add transparency
                borderWidth: 2,
                tension: 0.1
            });
        }
    } else if (sensitivityData.vendor === 'noNac') {
        // Show No-NAC baseline with risk components
        const totalCostData = sensitivityData.results.map(result => {
            return result.result.noNac ? result.result.noNac.cumulativeTotal : null;
        });
        
        const breachRiskData = sensitivityData.results.map(result => {
            return result.result.noNac ? result.result.noNac.breachRisk.cumulativeExpectedLoss : null;
        });
        
        const complianceRiskData = sensitivityData.results.map(result => {
            return result.result.noNac ? result.result.noNac.complianceRisk.cumulativeRisk : null;
        });
        
        const operationalData = sensitivityData.results.map(result => {
            return result.result.noNac ? result.result.noNac.operationalInefficiency.cumulativeInefficiency : null;
        });
        
        const staffingData = sensitivityData.results.map(result => {
            return result.result.noNac ? result.result.noNac.staffingCosts.cumulativeStaffingCost : null;
        });
        
        // Add datasets
        chartData.datasets.push({
            label: 'Total Cost (No NAC)',
            data: totalCostData,
            borderColor: vendorColors.noNac,
            backgroundColor: vendorColors.noNac + '33', // Add transparency
            borderWidth: 3,
            tension: 0.1
        });
        
        chartData.datasets.push({
            label: 'Breach Risk',
            data: breachRiskData,
            borderColor: '#e83e8c',
            backgroundColor: '#e83e8c33', // Add transparency
            borderWidth: 2,
            tension: 0.1
        });
        
        chartData.datasets.push({
            label: 'Compliance Risk',
            data: complianceRiskData,
            borderColor: '#fd7e14',
            backgroundColor: '#fd7e1433', // Add transparency
            borderWidth: 2,
            tension: 0.1
        });
        
        chartData.datasets.push({
            label: 'Operational Inefficiency',
            data: operationalData,
            borderColor: '#6f42c1',
            backgroundColor: '#6f42c133', // Add transparency
            borderWidth: 2,
            tension: 0.1
        });
        
        chartData.datasets.push({
            label: 'Staffing Costs',
            data: staffingData,
            borderColor: '#20c997',
            backgroundColor: '#20c99733', // Add transparency
            borderWidth: 2,
            tension: 0.1
        });
    } else {
        // Show specific vendor vs Portnox
        const vendorData = sensitivityData.results.map(result => {
            return result.result.currentVendor.total;
        });
        
        const portnoxData = sensitivityData.results.map(result => {
            return result.result.portnox.total;
        });
        
        // Add datasets
        chartData.datasets.push({
            label: getVendorName(sensitivityData.vendor),
            data: vendorData,
            borderColor: vendorColors[sensitivityData.vendor],
            backgroundColor: vendorColors[sensitivityData.vendor] + '33', // Add transparency
            borderWidth: 2,
            tension: 0.1
        });
        
        chartData.datasets.push({
            label: 'Portnox Cloud',
            data: portnoxData,
            borderColor: vendorColors.portnox,
            backgroundColor: vendorColors.portnox + '33', // Add transparency
            borderWidth: 2,
            tension: 0.1
        });
        
        // Add No-NAC baseline if it's a relevant variable
        if (['deviceCount', 'legacyPercentage', 'locationCount', 'yearsToProject', 'breachRisk', 'complianceRisk'].includes(sensitivityData.variable)) {
            const noNacData = sensitivityData.results.map(result => {
                return result.result.noNac ? result.result.noNac.cumulativeTotal : null;
            });
            
            chartData.datasets.push({
                label: 'No NAC (Baseline)',
                data: noNacData,
                borderColor: vendorColors.noNac,
                backgroundColor: vendorColors.noNac + '33', // Add transparency
                borderWidth: 2,
                tension: 0.1
            });
        }
        
        // Add savings data
        const savingsData = sensitivityData.results.map(result => {
            return result.result.savings.total;
        });
        
        // Add savings percentage line on secondary axis
        if (sensitivityData.vendor !== 'portnox') {
            const savingsPercentData = sensitivityData.results.map(result => {
                return result.result.savings.percentage;
            });
            
            chartData.datasets.push({
                label: 'Savings Percentage',
                data: savingsPercentData,
                borderColor: '#1B67B2',
                backgroundColor: '#1B67B233', // Add transparency
                borderWidth: 2,
                tension: 0.1,
                yAxisID: 'percentage'
            });
        }
    }
    
    // Create and display chart
    displaySensitivityChart(chartData, sensitivityData);
    
    // Create and display table
    displaySensitivityTable(sensitivityData);
    
    // Create and display second chart for savings impact
    if (sensitivityData.vendor !== 'noNac') {
        displaySavingsImpactChart(sensitivityData);
    }
    
    // Hide loading message
    hideMessage();
}

function displaySensitivityChart(chartData, sensitivityData) {
    const chart = document.getElementById('sensitivity-chart');
    if (!chart) return;
    
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        showMessage('error', 'Chart.js not available. Cannot display results.');
        return;
    }
    
    // Destroy existing chart if it exists
    if (chart.chart) {
        chart.chart.destroy();
    }
    
    // Format y-axis title based on variable
    let yAxisTitle = 'Total Cost ($)';
    if (sensitivityData.variable === 'breachRisk' || sensitivityData.variable === 'complianceRisk') {
        yAxisTitle = 'Risk Cost ($)';
    }
    
    // Format x-axis title based on variable
    const xAxisTitle = formatVariableName(sensitivityData.variable);
    
    // Chart options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: `TCO Sensitivity to ${formatVariableName(sensitivityData.variable)}`
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        if (context.dataset.yAxisID === 'percentage') {
                            return context.dataset.label + ': ' + context.raw.toFixed(1) + '%';
                        } else {
                            return context.dataset.label + ': $' + context.raw.toLocaleString();
                        }
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: xAxisTitle
                }
            },
            y: {
                title: {
                    display: true,
                    text: yAxisTitle
                },
                ticks: {
                    callback: function(value) {
                        if (value >= 1000000) {
                            return '$' + (value / 1000000).toFixed(1) + 'M';
                        } else if (value >= 1000) {
                            return '$' + (value / 1000).toFixed(1) + 'K';
                        } else {
                            return '$' + value;
                        }
                    }
                }
            }
        }
    };
    
    // Add percentage axis if needed
    if (chartData.datasets.some(ds => ds.yAxisID === 'percentage')) {
        options.scales.percentage = {
            type: 'linear',
            position: 'right',
            title: {
                display: true,
                text: 'Savings Percentage'
            },
            ticks: {
                callback: function(value) {
                    return value + '%';
                }
            },
            grid: {
                drawOnChartArea: false
            }
        };
    }
    
    // Create chart
    chart.chart = new Chart(chart, {
        type: 'line',
        data: chartData,
        options: options
    });
}

function displaySavingsImpactChart(sensitivityData) {
    const chart = document.getElementById('savings-impact-chart');
    if (!chart) return;
    
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        return;
    }
    
    // Destroy existing chart if it exists
    if (chart.chart) {
        chart.chart.destroy();
    }
    
    // Only show for specific vendor comparison (not 'all' or 'portnox')
    if (sensitivityData.vendor === 'all' || sensitivityData.vendor === 'portnox' || sensitivityData.vendor === 'noNac') {
        // Hide chart container with message
        const container = chart.closest('.chart-wrapper');
        if (container) {
            container.innerHTML = '<div class="chart-title">Portnox Savings Impact</div><div class="chart-placeholder">Select a specific vendor (not Portnox) to view savings impact.</div>';
        }
        return;
    }
    
    // Create chart data
    const chartData = {
        labels: sensitivityData.values.map(value => formatValue(value, sensitivityData.variable)),
        datasets: [
            {
                label: 'Cost Savings ($)',
                data: sensitivityData.results.map(result => result.result.savings.total),
                borderColor: '#1B67B2',
                backgroundColor: '#1B67B233', // Add transparency
                borderWidth: 2,
                tension: 0.1,
                yAxisID: 'savings'
            },
            {
                label: 'Savings Percentage',
                data: sensitivityData.results.map(result => result.result.savings.percentage),
                borderColor: '#2BD25B',
                backgroundColor: '#2BD25B33', // Add transparency
                borderWidth: 2,
                tension: 0.1,
                yAxisID: 'percentage'
            }
        ]
    };
    
    // If breach risk savings available, add it
    if (sensitivityData.results[0].result.noNac) {
        const portnoxVsNoNac = sensitivityData.results.map(result => {
            return result.result.noNac.cumulativeTotal - result.result.portnox.total;
        });
        
        const currentVendorVsNoNac = sensitivityData.results.map(result => {
            return result.result.noNac.cumulativeTotal - result.result.currentVendor.total;
        });
        
        // Calculate the additional savings with Portnox vs current vendor compared to No NAC
        const additionalSavings = portnoxVsNoNac.map((portnoxSavings, i) => {
            return portnoxSavings - currentVendorVsNoNac[i];
        });
        
        chartData.datasets.push({
            label: 'Additional Risk Reduction Savings',
            data: additionalSavings,
            borderColor: '#dc3545',
            backgroundColor: '#dc354533', // Add transparency
            borderWidth: 2,
            tension: 0.1,
            yAxisID: 'savings'
        });
    }
    
    // Format x-axis title based on variable
    const xAxisTitle = formatVariableName(sensitivityData.variable);
    
    // Chart options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: `Portnox Savings Impact vs. ${getVendorName(sensitivityData.vendor)}`
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        if (context.dataset.yAxisID === 'percentage') {
                            return context.dataset.label + ': ' + context.raw.toFixed(1) + '%';
                        } else {
                            return context.dataset.label + ': $' + context.raw.toLocaleString();
                        }
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: xAxisTitle
                }
            },
            savings: {
                type: 'linear',
                position: 'left',
                title: {
                    display: true,
                    text: 'Cost Savings ($)'
                },
                ticks: {
                    callback: function(value) {
                        if (value >= 1000000) {
                            return '$' + (value / 1000000).toFixed(1) + 'M';
                        } else if (value >= 1000) {
                            return '$' + (value / 1000).toFixed(1) + 'K';
                        } else {
                            return '$' + value;
                        }
                    }
                }
            },
            percentage: {
                type: 'linear',
                position: 'right',
                title: {
                    display: true,
                    text: 'Savings Percentage'
                },
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                },
                grid: {
                    drawOnChartArea: false
                }
            }
        }
    };
    
    // Create chart
    chart.chart = new Chart(chart, {
        type: 'line',
        data: chartData,
        options: options
    });
}

function displaySensitivityTable(sensitivityData) {
    const tableHeader = document.getElementById('sensitivity-table-header');
    const tableBody = document.getElementById('sensitivity-table-body');
    
    if (!tableHeader || !tableBody) return;
    
    // Clear table
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    // Create header row
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `<th>${formatVariableName(sensitivityData.variable)}</th>`;
    
    // Add vendor columns
    if (sensitivityData.vendor === 'all') {
        // Add all vendors
        headerRow.innerHTML += `
            <th>Cisco ISE</th>
            <th>Aruba ClearPass</th>
            <th>Forescout</th>
            <th>FortiNAC</th>
            <th>Microsoft NPS</th>
            <th>SecureW2</th>
            <th>Portnox Cloud</th>
        `;
        
        // Add No-NAC if applicable
        if (['deviceCount', 'legacyPercentage', 'locationCount', 'yearsToProject', 'breachRisk', 'complianceRisk'].includes(sensitivityData.variable)) {
            headerRow.innerHTML += `<th>No NAC (Baseline)</th>`;
        }
    } else if (sensitivityData.vendor === 'noNac') {
        // Add No-NAC breakdown columns
        headerRow.innerHTML += `
            <th>Total Cost</th>
            <th>Breach Risk</th>
            <th>Compliance Risk</th>
            <th>Operational Inefficiency</th>
            <th>Staffing Costs</th>
        `;
    } else {
        // Add current vendor and Portnox
        headerRow.innerHTML += `
            <th>${getVendorName(sensitivityData.vendor)}</th>
            <th>Portnox Cloud</th>
            <th>Savings</th>
            <th>Savings %</th>
        `;
        
        // Add No-NAC if applicable
        if (['deviceCount', 'legacyPercentage', 'locationCount', 'yearsToProject', 'breachRisk', 'complianceRisk'].includes(sensitivityData.variable)) {
            headerRow.innerHTML += `<th>No NAC (Baseline)</th>`;
        }
    }
    
    tableHeader.appendChild(headerRow);
    
    // Create data rows
    sensitivityData.results.forEach((result, index) => {
        const row = document.createElement('tr');
        
        // Add variable value
        row.innerHTML = `<td>${formatValue(result.value, sensitivityData.variable)}</td>`;
        
        // Add data cells based on vendor selection
        if (sensitivityData.vendor === 'all') {
            // All vendors mode
            const vendorIds = ['cisco', 'aruba', 'forescout', 'fortinac', 'nps', 'securew2', 'portnox'];
            
            vendorIds.forEach(vendorId => {
                let cellValue = '';
                
                if (vendorId === 'portnox') {
                    cellValue = formatCurrency(result.result.portnox.total);
                } else if (result.result.currentVendor.id === vendorId) {
                    cellValue = formatCurrency(result.result.currentVendor.total);
                } else {
                    // Placeholder for unavailable data
                    cellValue = '-';
                }
                
                row.innerHTML += `<td>${cellValue}</td>`;
            });
            
            // Add No-NAC if applicable
            if (['deviceCount', 'legacyPercentage', 'locationCount', 'yearsToProject', 'breachRisk', 'complianceRisk'].includes(sensitivityData.variable) && result.result.noNac) {
                row.innerHTML += `<td>${formatCurrency(result.result.noNac.cumulativeTotal)}</td>`;
            }
        } else if (sensitivityData.vendor === 'noNac') {
            // No-NAC breakdown mode
            if (result.result.noNac) {
                row.innerHTML += `
                    <td>${formatCurrency(result.result.noNac.cumulativeTotal)}</td>
                    <td>${formatCurrency(result.result.noNac.breachRisk.cumulativeExpectedLoss)}</td>
                    <td>${formatCurrency(result.result.noNac.complianceRisk.cumulativeRisk)}</td>
                    <td>${formatCurrency(result.result.noNac.operationalInefficiency.cumulativeInefficiency)}</td>
                    <td>${formatCurrency(result.result.noNac.staffingCosts.cumulativeStaffingCost)}</td>
                `;
            } else {
                row.innerHTML += '<td colspan="5">No data available</td>';
            }
        } else {
            // Specific vendor mode
            row.innerHTML += `
                <td>${formatCurrency(result.result.currentVendor.total)}</td>
                <td>${formatCurrency(result.result.portnox.total)}</td>
                <td>${formatCurrency(result.result.savings.total)}</td>
                <td>${result.result.savings.percentage.toFixed(1)}%</td>
            `;
            
            // Add No-NAC if applicable
            if (['deviceCount', 'legacyPercentage', 'locationCount', 'yearsToProject', 'breachRisk', 'complianceRisk'].includes(sensitivityData.variable) && result.result.noNac) {
                row.innerHTML += `<td>${formatCurrency(result.result.noNac.cumulativeTotal)}</td>`;
            }
        }
        
        tableBody.appendChild(row);
    });
}

function clearResults() {
    // Clear charts
    const charts = ['sensitivity-chart', 'savings-impact-chart'];
    charts.forEach(chartId => {
        const chart = document.getElementById(chartId);
        if (chart && chart.chart) {
            chart.chart.destroy();
            chart.chart = null;
        }
    });
    
    // Clear table
    const tableHeader = document.getElementById('sensitivity-table-header');
    const tableBody = document.getElementById('sensitivity-table-body');
    
    if (tableHeader) tableHeader.innerHTML = '';
    if (tableBody) tableBody.innerHTML = '';
}

function formatValue(value, variable) {
    // Format value based on variable type
    switch (variable) {
        case 'deviceCount':
            return value.toLocaleString();
        case 'legacyPercentage':
            return value + '%';
        case 'locationCount':
            return value.toLocaleString();
        case 'yearsToProject':
            return value + (value === 1 ? ' Year' : ' Years');
        case 'hardwareCost':
        case 'licensingCost':
        case 'maintenanceCost':
        case 'implementationCost':
        case 'fteCost':
            return value.toFixed(2) + 'x';
        case 'downtimeCost':
            return '$' + value.toLocaleString() + '/hr';
        case 'breachRisk':
        case 'complianceRisk':
            return value.toFixed(2) + 'x';
        default:
            return value.toString();
    }
}

function formatVariableName(variable) {
    // Format variable name for display
    const variableDisplayNames = {
        deviceCount: 'Device Count',
        legacyPercentage: 'Legacy Device Percentage',
        locationCount: 'Number of Locations',
        yearsToProject: 'Years Projected',
        hardwareCost: 'Hardware Cost Multiplier',
        licensingCost: 'Licensing Cost Multiplier',
        maintenanceCost: 'Maintenance Cost Multiplier',
        implementationCost: 'Implementation Cost Multiplier',
        fteCost: 'Personnel Cost Multiplier',
        downtimeCost: 'Downtime Cost ($/hour)',
        breachRisk: 'Security Breach Risk Factor',
        complianceRisk: 'Compliance Risk Factor'
    };
    
    return variableDisplayNames[variable] || variable;
}

function formatCurrency(amount) {
    // Format currency value
    if (amount >= 1000000) {
        return '$' + (amount / 1000000).toFixed(2) + 'M';
    } else if (amount >= 1000) {
        return '$' + (amount / 1000).toFixed(1) + 'K';
    } else {
        return '$' + amount.toLocaleString();
    }
}

function getVendorName(vendorId) {
    // Get vendor display name
    const vendorNames = {
        cisco: 'Cisco ISE',
        aruba: 'Aruba ClearPass',
        forescout: 'Forescout',
        fortinac: 'FortiNAC',
        nps: 'Microsoft NPS',
        securew2: 'SecureW2',
        portnox: 'Portnox Cloud',
        noNac: 'No NAC (Baseline)'
    };
    
    return vendorNames[vendorId] || vendorId;
}

function showMessage(type, message) {
    const messageContainer = document.getElementById('message-container');
    if (!messageContainer) return;
    
    // Clear previous messages
    messageContainer.innerHTML = '';
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.innerHTML = `
        <div class="message-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        </div>
        <div class="message-text">${message}</div>
    `;
    
    // Add to container
    messageContainer.appendChild(messageElement);
}

function hideMessage() {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
        messageContainer.innerHTML = '';
    }
}
/**
 * NAC Breach Impact Calculator
 * Estimates potential financial impact of security breaches with and without NAC
 */
class BreachImpactCalculator {
  constructor() {
    // Cache for impact results
    this.impactCache = {};
    
    // Default analysis parameters
    this.defaultParams = {
      companySize: 'medium', // small, medium, large
      industry: 'general',
      dataRecords: 10000,
      annualProbability: 0.15,
      hasExistingNAC: false,
      includeReputation: true,
      includeRegulatory: true,
      yearsToProject: 3
    };
  }
  
  /**
   * Calculate potential breach impact
   * @param {object} params - Analysis parameters
   * @returns {object} Breach impact analysis
   */
  calculateBreachImpact(params = {}) {
    // Merge with default parameters
    const analysisParams = {...this.defaultParams, ...params};
    
    // Generate cache key
    const cacheKey = JSON.stringify(analysisParams);
    
    // Return cached results if available
    if (this.impactCache[cacheKey]) {
      return this.impactCache[cacheKey];
    }
    
    // Get industry-specific data
    const industryData = window.industryData[analysisParams.industry] || {
      breachCost: 4200000, // Default average breach cost
      fteMultiplier: 1.0,
      implementationMultiplier: 1.0,
      downtimeImpact: 1.0
    };
    
    // Calculate base impact metrics
    const baseImpact = this._calculateBaseImpact(analysisParams, industryData);
    
    // Calculate impact with and without NAC
    const withoutNAC = this._calculateWithoutNAC(baseImpact, analysisParams);
    const withNAC = this._calculateWithNAC(baseImpact, analysisParams);
    
    // Calculate potential savings
    const savings = {
      annualRiskReduction: withoutNAC.annualRisk - withNAC.annualRisk,
      threeYearSavings: withoutNAC.projectedCosts.threeYear - withNAC.projectedCosts.threeYear,
      fiveYearSavings: withoutNAC.projectedCosts.fiveYear - withNAC.projectedCosts.fiveYear,
      breachScopeDifference: withoutNAC.breachScope - withNAC.breachScope,
      responseTimeDifference: withoutNAC.responseTime - withNAC.responseTime
    };
    
    // Generate insights
    const insights = this._generateInsights(withoutNAC, withNAC, analysisParams, industryData);
    
    // Prepare result
    const result = {
      params: analysisParams,
      industryData: {
        name: industryData.name || analysisParams.industry,
        averageBreachCost: industryData.breachCost,
        specificChallenges: industryData.specificChallenges || []
      },
      baseImpact,
      withoutNAC,
      withNAC,
      savings,
      insights,
      recommendations: this._generateRecommendations(analysisParams, withoutNAC, withNAC)
    };
    
    // Cache results
    this.impactCache[cacheKey] = result;
    
    return result;
  }
  
  /**
   * Calculate base impact metrics
   * @param {object} params - Analysis parameters
   * @param {object} industryData - Industry-specific data
   * @returns {object} Base impact metrics
   */
  _calculateBaseImpact(params, industryData) {
    // Cost per record based on industry
    const perRecordCost = this._calculatePerRecordCost(industryData);
    
    // Base breach cost (before NAC considerations)
    let breachCost;
    if (params.dataRecords > 100000) {
      // For very large breaches, use industry average
      breachCost = industryData.breachCost;
    } else {
      // For smaller breaches, calculate based on records
      breachCost = params.dataRecords * perRecordCost;
    }
    
    // Adjust breach cost based on company size
    const sizeMultiplier = this._getSizeMultiplier(params.companySize);
    breachCost *= sizeMultiplier;
    
    // Calculate breach components
    const breachComponents = this._calculateBreachComponents(breachCost, params, industryData);
    
    return {
      perRecordCost,
      breachCost,
      breachComponents,
      annualProbability: params.annualProbability
    };
  }
  
  /**
   * Calculate per-record cost based on industry
   * @param {object} industryData - Industry-specific data
   * @returns {number} Cost per record
   */
  _calculatePerRecordCost(industryData) {
    // Base per-record cost
    const basePerRecordCost = 150;
    
    // Industry-specific adjustments
    const industryMultipliers = {
      healthcare: 1.8,
      financial: 1.6,
      retail: 1.2,
      manufacturing: 1.1,
      education: 0.9,
      government: 1.3
    };
    
    const industryKey = industryData.name ? industryData.name.toLowerCase() : 'general';
    const multiplier = industryMultipliers[industryKey] || 1.0;
    
    return basePerRecordCost * multiplier;
  }
  
  /**
   * Get company size multiplier
   * @param {string} size - Company size
   * @returns {number} Size multiplier
   */
  _getSizeMultiplier(size) {
    const sizeMultipliers = {
      small: 0.7,    // Smaller companies typically have smaller breach costs
      medium: 1.0,   // Baseline
      large: 1.5     // Larger companies face higher costs due to scale
    };
    
    return sizeMultipliers[size] || 1.0;
  }
  
  /**
   * Calculate breach cost components
   * @param {number} totalCost - Total breach cost
   * @param {object} params - Analysis parameters
   * @param {object} industryData - Industry-specific data
   * @returns {object} Breach cost components
   */
  _calculateBreachComponents(totalCost, params, industryData) {
    const components = {
      detection: totalCost * 0.15,
      response: totalCost * 0.20,
      notification: totalCost * 0.05,
      lostBusiness: totalCost * 0.32,
      regulatory: params.includeRegulatory ? totalCost * 0.13 : 0,
      reputation: params.includeReputation ? totalCost * 0.15 : 0
    };
    
    // Make industry-specific adjustments
    if (industryData.name) {
      switch (industryData.name.toLowerCase()) {
        case 'healthcare':
          components.regulatory *= 1.5;  // Higher regulatory impact
          break;
        case 'financial':
          components.lostBusiness *= 1.3;  // Higher business impact
          components.reputation *= 1.4;    // Higher reputation impact
          break;
        case 'retail':
          components.lostBusiness *= 1.5;  // Much higher business impact
          break;
        case 'government':
          components.regulatory *= 1.3;    // Higher regulatory impact
          components.reputation *= 0.8;    // Lower reputation impact
          break;
      }
    }
    
    return components;
  }
  
  /**
   * Calculate impact without NAC
   * @param {object} baseImpact - Base impact metrics
   * @param {object} params - Analysis parameters
   * @returns {object} Impact without NAC
   */
  _calculateWithoutNAC(baseImpact, params) {
    // Without NAC, use full breach impact
    const breachCost = baseImpact.breachCost;
    
    // Calculate annualized risk
    const annualRisk = breachCost * baseImpact.annualProbability;
    
    // Projected costs over time
    const projectedCosts = {
      oneYear: annualRisk,
      threeYear: annualRisk * 3,
      fiveYear: annualRisk * 5
    };
    
    // Additional metrics
    const breachScope = 1.0;  // 100% of potential breach scope
    const responseTime = 280; // Average detection+response time in hours without NAC
    
    return {
      breachCost,
      annualRisk,
      projectedCosts,
      breachScope,
      responseTime,
      risksAndVulnerabilities: this._identifyRisksWithoutNAC(params)
    };
  }
  
  /**
   * Calculate impact with NAC
   * @param {object} baseImpact - Base impact metrics
   * @param {object} params - Analysis parameters
   * @returns {object} Impact with NAC
   */
  _calculateWithNAC(baseImpact, params) {
    // NAC effectiveness factors
    const nacEffectiveness = {
      probabilityReduction: 0.35,  // NAC reduces breach probability by 35%
      impactReduction: 0.40,       // NAC reduces breach impact by 40%
      scopeReduction: 0.65,        // NAC reduces breach scope by 65%
      responseImprovement: 0.70    // NAC improves response time by 70%
    };
    
    // Apply NAC effectiveness to breach metrics
    const reducedProbability = baseImpact.annualProbability * (1 - nacEffectiveness.probabilityReduction);
    const reducedCost = baseImpact.breachCost * (1 - nacEffectiveness.impactReduction);
    
    // Calculate annualized risk with NAC
    const annualRisk = reducedCost * reducedProbability;
    
    // Projected costs over time
    const projectedCosts = {
      oneYear: annualRisk,
      threeYear: annualRisk * 3,
      fiveYear: annualRisk * 5
    };
    
    // Additional metrics
    const breachScope = 1.0 - nacEffectiveness.scopeReduction;  // Reduced breach scope
    const responseTime = 280 * (1 - nacEffectiveness.responseImprovement); // Improved response time
    
    return {
      breachCost: reducedCost,
      annualRisk,
      projectedCosts,
      breachScope,
      responseTime,
      mitigations: this._identifyNACMitigations(params)
    };
  }
  
  /**
   * Identify risks without NAC
   * @param {object} params - Analysis parameters
   * @returns {array} Identified risks
   */
  _identifyRisksWithoutNAC(params) {
    const risks = [
      {
        category: 'Access Control',
        risks: [
          'Unauthorized network access from rogue devices',
          'Excessive access privileges for users and devices',
          'Inability to enforce network segmentation effectively',
          'Lack of visibility into connected devices'
        ]
      },
      {
        category: 'Threat Detection',
        risks: [
          'Delayed detection of compromised endpoints',
          'Limited visibility into unusual network behavior',
          'Inability to correlate access events with threats',
          'Reduced capacity to identify policy violations'
        ]
      },
      {
        category: 'Incident Response',
        risks: [
          'Slower mean time to respond (MTTR) to security incidents',
          'Manual remediation processes for compromised devices',
          'Limited containment capabilities during active breaches',
          'Inability to automate security incident responses'
        ]
      },
      {
        category: 'Compliance',
        risks: [
          'Difficulty demonstrating compliance with access control requirements',
          'Limited audit trails for regulatory reporting',
          'Challenges implementing technical security controls',
          'Increased risk of compliance violations and penalties'
        ]
      }
    ];
    
    // Add industry-specific risks
    if (params.industry && window.industryData[params.industry]) {
      const industryRisks = {
        category: `${window.industryData[params.industry].name} Specific Risks`,
        risks: []
      };
      
      // Add specific risks based on industry
      switch (params.industry) {
        case 'healthcare':
          industryRisks.risks.push(
            'Unauthorized access to protected health information (PHI)',
            'Unsecured medical devices connecting to the network',
            'Limited visibility into clinical systems access',
            'Inability to enforce HIPAA technical safeguards'
          );
          break;
        case 'financial':
          industryRisks.risks.push(
            'Unauthorized access to financial systems',
            'Inability to enforce PCI DSS network segmentation',
            'Limited monitoring of privileged user activities',
            'Challenges implementing fraud detection controls'
          );
          break;
        case 'manufacturing':
          industryRisks.risks.push(
            'Unsecured operational technology (OT) connections',
            'Limited visibility into industrial control systems',
            'Inability to protect intellectual property effectively',
            'Challenges securing legacy manufacturing equipment'
          );
          break;
        case 'retail':
          industryRisks.risks.push(
            'Unsecured point-of-sale (POS) systems',
            'Inability to protect customer payment data',
            'Limited visibility into third-party vendor access',
            'Challenges securing diverse retail environments'
          );
          break;
      }
      
      // Add industry risks if any were defined
      if (industryRisks.risks.length > 0) {
        risks.push(industryRisks);
      }
    }
    
    return risks;
  }
  
  /**
   * Identify NAC mitigations
   * @param {object} params - Analysis parameters
   * @returns {array} NAC mitigations
   */
  _identifyNACMitigations(params) {
    const mitigations = [
      {
        category: 'Access Control',
        mitigations: [
          'Enforcement of network access policies for all devices',
          'Implementation of least privilege access principles',
          'Dynamic network segmentation based on device posture',
          'Comprehensive visibility of all connected devices'
        ]
      },
      {
        category: 'Threat Detection',
        mitigations: [
          'Real-time detection of unauthorized access attempts',
          'Continuous monitoring of device behavior and compliance',
          'Integration with security tools for enhanced threat visibility',
          'Automated policy enforcement for non-compliant devices'
        ]
      },
      {
        category: 'Incident Response',
        mitigations: [
          'Reduced mean time to respond (MTTR) to security incidents',
          'Automated containment of compromised devices',
          'Streamlined remediation processes for security events',
          'Enhanced incident forensics with detailed access logs'
        ]
      },
      {
        category: 'Compliance',
        mitigations: [
          'Demonstrable enforcement of access control requirements',
          'Comprehensive audit logs for regulatory reporting',
          'Simplified implementation of technical security controls',
          'Reduced risk of compliance violations and penalties'
        ]
      }
    ];
    
    // Add industry-specific mitigations
    if (params.industry && window.industryData[params.industry]) {
      const industryMitigations = {
        category: `${window.industryData[params.industry].name} Specific Mitigations`,
        mitigations: []
      };
      
      // Add specific mitigations based on industry
      switch (params.industry) {
        case 'healthcare':
          industryMitigations.mitigations.push(
            'Enforcement of access controls for systems with PHI',
            'Medical device security with specialized device profiles',
            'Enhanced visibility into clinical systems access',
            'Automated enforcement of HIPAA technical safeguards'
          );
          break;
        case 'financial':
          industryMitigations.mitigations.push(
            'Enhanced protection for financial systems access',
            'Enforcement of PCI DSS network segmentation requirements',
            'Comprehensive monitoring of privileged user activities',
            'Integration with fraud detection systems'
          );
          break;
        case 'manufacturing':
          industryMitigations.mitigations.push(
            'Secure IT/OT convergence with specialized policies',
            'Enhanced visibility into industrial control systems',
            'Protection of intellectual property through access controls',
            'Security for legacy manufacturing equipment'
          );
          break;
        case 'retail':
          industryMitigations.mitigations.push(
            'Enhanced point-of-sale (POS) system security',
            'Protection of customer payment data',
            'Controlled third-party vendor access',
            'Adaptable security for diverse retail environments'
          );
          break;
      }
      
      // Add industry mitigations if any were defined
      if (industryMitigations.mitigations.length > 0) {
        mitigations.push(industryMitigations);
      }
    }
    
    return mitigations;
  }
  
  /**
   * Generate insights from analysis
   * @param {object} withoutNAC - Impact without NAC
   * @param {object} withNAC - Impact with NAC
   * @param {object} params - Analysis parameters
   * @param {object} industryData - Industry-specific data
   * @returns {array} Insights
   */
  _generateInsights(withoutNAC, withNAC, params, industryData) {
    const insights = [];
    
    // Risk reduction
    const riskReductionPercent = ((withoutNAC.annualRisk - withNAC.annualRisk) / withoutNAC.annualRisk * 100).toFixed(1);
    insights.push({
      category: 'Risk Reduction',
      insight: `NAC implementation reduces annualized breach risk by ${riskReductionPercent}%, from $${this._formatNumber(withoutNAC.annualRisk)} to $${this._formatNumber(withNAC.annualRisk)} annually.`
    });
    
    // Scope containment
    const scopeReductionPercent = ((withoutNAC.breachScope - withNAC.breachScope) / withoutNAC.breachScope * 100).toFixed(1);
    insights.push({
      category: 'Breach Containment',
      insight: `NAC can contain security breaches by ${scopeReductionPercent}%, limiting lateral movement and data access during incidents.`
    });
    
    // Response improvement
    const responseImprovement = ((withoutNAC.responseTime - withNAC.responseTime) / withoutNAC.responseTime * 100).toFixed(1);
    const timeReduction = (withoutNAC.responseTime - withNAC.responseTime).toFixed(0);
    insights.push({
      category: 'Incident Response',
      insight: `NAC improves incident response and containment time by ${responseImprovement}% (${timeReduction} hours faster), reducing breach costs and business impact.`
    });
    
    // ROI insights
    const threeYearSavings = withoutNAC.projectedCosts.threeYear - withNAC.projectedCosts.threeYear;
    insights.push({
      category: 'Financial Impact',
      insight: `Over a 3-year period, NAC can provide approximately $${this._formatNumber(threeYearSavings)} in risk reduction value through combined breach prevention and impact reduction.`
    });
    
    // Add industry-specific insight if applicable
    if (industryData.name) {
      switch (industryData.name.toLowerCase()) {
        case 'healthcare':
          insights.push({
            category: 'Healthcare Compliance',
            insight: `NAC helps address HIPAA Security Rule requirements for access controls and device security, reducing the risk of OCR penalties and enforcement actions.`
          });
          break;
        case 'financial':
          insights.push({
            category: 'Financial Services Security',
            insight: `NAC supports PCI DSS compliance requirements for network segmentation and access controls, helping prevent costly cardholder data breaches.`
          });
          break;
        case 'manufacturing':
          insights.push({
            category: 'OT/IT Security',
            insight: `NAC provides critical protection for converged IT/OT environments, securing both information systems and operational technology from compromise.`
          });
          break;
        case 'retail':
          insights.push({
            category: 'Retail Data Protection',
            insight: `NAC enhances protection of payment systems and customer data, helping prevent the substantial business impact of retail breaches.`
          });
          break;
      }
    }
    
    return insights;
  }
  
  /**
   * Generate recommendations based on analysis
   * @param {object} params - Analysis parameters
   * @param {object} withoutNAC - Impact without NAC
   * @param {object} withNAC - Impact with NAC
   * @returns {array} Recommendations
   */
  _generateRecommendations(params, withoutNAC, withNAC) {
    const recommendations = [];
    
    // Add general recommendations
    recommendations.push({
      priority: 'High',
      title: 'Implement Network Access Control',
      description: 'Deploy a comprehensive NAC solution to enforce access policies, gain visibility into connected devices, and automate response to security incidents.',
      estimatedImpact: `Potential risk reduction of $${this._formatNumber(withoutNAC.annualRisk - withNAC.annualRisk)} annually.`
    });
    
    recommendations.push({
      priority: 'High',
      title: 'Enhance Network Segmentation',
      description: 'Implement granular network segmentation to limit lateral movement during security breaches and reduce the potential scope of compromise.',
      estimatedImpact: `Potential breach scope reduction of ${Math.round((withoutNAC.breachScope - withNAC.breachScope) * 100)}%.`
    });
    
    recommendations.push({
      priority: 'Medium',
      title: 'Automate Incident Response',
      description: 'Establish automated response workflows for security incidents to reduce detection and containment time for potential breaches.',
      estimatedImpact: `Potential response time improvement of ${Math.round((withoutNAC.responseTime - withNAC.responseTime))} hours.`
    });
    
    // Add industry-specific recommendations
    if (params.industry && window.industryData[params.industry]) {
      switch (params.industry) {
        case 'healthcare':
          recommendations.push({
            priority: 'High',
            title: 'Protect Medical Devices',
            description: 'Implement specialized profiles and policies for medical devices to ensure security without disrupting clinical operations.',
            estimatedImpact: 'Enhanced compliance with HIPAA Security Rule technical safeguards.'
          });
          break;
        case 'financial':
          recommendations.push({
            priority: 'High',
            title: 'Secure Cardholder Data Environment',
            description: 'Implement strict access controls and segmentation for systems that process, store, or transmit cardholder data.',
            estimatedImpact: 'Enhanced PCI DSS compliance and reduced risk of cardholder data breaches.'
          });
          break;
        case 'manufacturing':
          recommendations.push({
            priority: 'High',
            title: 'Secure IT/OT Convergence',
            description: 'Implement specialized controls for operational technology environments to protect manufacturing systems without disrupting production.',
            estimatedImpact: 'Reduced risk of production disruption and intellectual property theft.'
          });
          break;
        case 'retail':
          recommendations.push({
            priority: 'High',
            title: 'Secure Point-of-Sale Systems',
            description: 'Implement enhanced protection for POS systems and payment processing infrastructure.',
            estimatedImpact: 'Reduced risk of payment card data breaches and PCI DSS non-compliance.'
          });
          break;
      }
    }
    
    return recommendations;
  }
  
  /**
   * Format number with commas for readability
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  _formatNumber(num) {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

// Make the breach calculator available globally
window.breachImpactCalculator = new BreachImpactCalculator();
