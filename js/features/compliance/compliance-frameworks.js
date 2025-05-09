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
