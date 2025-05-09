/**
 * Vendor Advantages Module
 * Provides detailed vendor comparison data and visualization functions
 */

const VendorAdvantages = (function() {
  // Vendor data
  const vendors = {
    cisco: {
      id: 'cisco',
      name: 'Cisco ISE',
      logo: 'img/vendors/cisco-logo.png',
      description: 'Comprehensive on-premises NAC solution with extensive enterprise features.',
      type: 'On-Premises',
      deploymentTime: '3-6 months',
      implementation: {
        complexity: 'High',
        expertise: 'Cisco Certified Network Professional (CCNP)',
        resources: '1-2 FTE',
        hardware: 'Dedicated appliances or VMs',
        support: 'Enterprise support required'
      },
      strengths: [
        'Comprehensive network policy management',
        'Deep integration with Cisco network infrastructure',
        'Advanced device profiling',
        'Strong ecosystem of security integrations',
        'Extensive compliance features'
      ],
      weaknesses: [
        'Complex deployment and configuration',
        'High hardware and licensing costs',
        'Significant IT overhead for maintenance',
        'Requires specialized expertise',
        'Long implementation timelines'
      ]
    },
    aruba: {
      id: 'aruba',
      name: 'Aruba ClearPass',
      logo: 'img/vendors/aruba-logo.png',
      description: 'Advanced NAC solution from HPE Aruba with strong multi-vendor support.',
      type: 'On-Premises',
      deploymentTime: '2-4 months',
      implementation: {
        complexity: 'Medium-High',
        expertise: 'Network and security specialists',
        resources: '0.5-1 FTE',
        hardware: 'Dedicated appliances or VMs',
        support: 'Enterprise support recommended'
      },
      strengths: [
        'Strong multi-vendor support',
        'Excellent guest management',
        'Flexible policy model',
        'Integration with MDM solutions',
        'Built-in vulnerability assessment'
      ],
      weaknesses: [
        'Complex configuration interface',
        'Significant hardware requirements',
        'Lengthy implementation process',
        'High licensing costs',
        'Ongoing maintenance overhead'
      ]
    },
    forescout: {
      id: 'forescout',
      name: 'Forescout',
      logo: 'img/vendors/forescout-logo.png',
      description: 'Specialized in device visibility and control with agentless capabilities.',
      type: 'On-Premises',
      deploymentTime: '2-4 months',
      implementation: {
        complexity: 'Medium-High',
        expertise: 'Network security specialists',
        resources: '0.5-1 FTE',
        hardware: 'Dedicated appliances',
        support: 'Enterprise support required'
      },
      strengths: [
        'Agentless device discovery',
        'Extensive OT/IoT device support',
        'Strong network visibility',
        'Real-time monitoring capabilities',
        'Integration with security tools'
      ],
      weaknesses: [
        'High licensing costs',
        'Complex deployment',
        'Significant hardware requirements',
        'Requires specialized expertise',
        'Ongoing maintenance overhead'
      ]
    },
    fortinac: {
      id: 'fortinac',
      name: 'FortiNAC',
      logo: 'img/vendors/fortinac-logo.png',
      description: 'Security-focused NAC solution integrated with Fortinet Security Fabric.',
      type: 'On-Premises',
      deploymentTime: '1-3 months',
      implementation: {
        complexity: 'Medium',
        expertise: 'Network security specialists',
        resources: '0.5-1 FTE',
        hardware: 'Dedicated appliances or VMs',
        support: 'Enterprise support recommended'
      },
      strengths: [
        'Integration with Fortinet Security Fabric',
        'Protection against IoT threats',
        'Automated threat response',
        'Network access control',
        'Device visibility'
      ],
      weaknesses: [
        'Limited multi-vendor support',
        'Less mature than competitors',
        'Complex policy management',
        'Hardware requirements',
        'Ongoing maintenance needs'
      ]
    },
    nps: {
      id: 'nps',
      name: 'Microsoft NPS',
      logo: 'img/vendors/microsoft-logo.png',
      description: 'Basic Windows-integrated NAC solution with limited capabilities.',
      type: 'On-Premises',
      deploymentTime: '2-4 weeks',
      implementation: {
        complexity: 'Low-Medium',
        expertise: 'Windows Server administrators',
        resources: '0.25-0.5 FTE',
        hardware: 'Windows Server',
        support: 'Standard Microsoft support'
      },
      strengths: [
        'Included with Windows Server',
        'Simple Windows integration',
        'Basic authentication capabilities',
        'Low initial cost',
        'Familiar Windows administration'
      ],
      weaknesses: [
        'Very limited feature set',
        'Basic device visibility',
        'Limited authentication options',
        'Minimal IoT support',
        'Windows-centric environment required'
      ]
    },
    securew2: {
      id: 'securew2',
      name: 'SecureW2',
      logo: 'img/vendors/securew2-logo.png',
      description: 'Certificate-focused authentication specialist with cloud management.',
      type: 'Cloud/Hybrid',
      deploymentTime: '1-3 weeks',
      implementation: {
        complexity: 'Medium',
        expertise: 'Certificate and PKI specialists',
        resources: '0.25-0.5 FTE',
        hardware: 'None (cloud-based)',
        support: 'Vendor support included'
      },
      strengths: [
        'Certificate-based authentication expertise',
        'Modern cloud management',
        'Strong integration with identity providers',
        'Passwordless capabilities',
        'Simplified certificate enrollment'
      ],
      weaknesses: [
        'Limited full NAC capabilities',
        'Focused primarily on certificates',
        'Less comprehensive device control',
        'Requires integration with existing systems',
        'May need complementary solutions'
      ]
    },
    portnox: {
      id: 'portnox',
      name: 'Portnox Cloud',
      logo: 'img/vendors/portnox-logo.png',
      description: 'True cloud-native NAC with rapid deployment and simplified management.',
      type: 'Cloud-Native',
      deploymentTime: '1-7 days',
      implementation: {
        complexity: 'Low',
        expertise: 'General IT skills',
        resources: '0.1-0.25 FTE',
        hardware: 'None (cloud-native)',
        support: 'Vendor support included'
      },
      strengths: [
        'Rapid deployment (days vs. months)',
        'No hardware requirements',
        'Minimal IT overhead',
        'Automatic updates and maintenance',
        'AI-powered device fingerprinting'
      ],
      weaknesses: [
        'Newer platform in the market',
        'Internet dependency',
        'Limited on-premises control',
        'Fewer integration points than established vendors',
        'Simpler feature set than enterprise solutions'
      ]
    }
  };
  
  // Comparison data - Portnox advantages over each competitor
  const portnoxAdvantages = {
    cisco: [
      {
        category: 'Deployment & Implementation',
        items: [
          '1-7 days implementation vs. 3-6 months',
          'No hardware procurement or setup',
          'No specialized expertise required',
          'Zero-touch remote location deployment',
          'Near-immediate feature availability'
        ]
      },
      {
        category: 'Operational Costs',
        items: [
          '65-75% lower TCO',
          'No hardware maintenance costs',
          'No infrastructure upgrade costs',
          'Automatic updates without downtime',
          'Reduced IT staff requirements (0.1-0.25 FTE vs. 1-2 FTE)'
        ]
      },
      {
        category: 'Management & Maintenance',
        items: [
          'Intuitive cloud interface vs. complex console',
          'No version upgrades or patches to manage',
          'Centralized management for all locations',
          'No database maintenance required',
          'No performance tuning or capacity planning'
        ]
      },
      {
        category: 'Scalability & Flexibility',
        items: [
          'Instant elastic scaling',
          'No additional hardware for expansion',
          'Consistent performance regardless of scale',
          'Global deployment from central console',
          'No "per-appliance" limitations'
        ]
      }
    ],
    aruba: [
      {
        category: 'Deployment & Implementation',
        items: [
          '1-7 days implementation vs. 2-4 months',
          'No hardware requirements',
          'General IT skills vs. specialized expertise',
          'Simplified configuration process',
          'Automated deployment workflows'
        ]
      },
      {
        category: 'Operational Costs',
        items: [
          '60-70% lower TCO',
          'Elimination of hardware costs',
          'Reduced management overhead',
          'Subscription-based predictable pricing',
          'Minimal training requirements'
        ]
      },
      {
        category: 'Management & Maintenance',
        items: [
          'Modern cloud interface vs. complex portal',
          'Automatic updates and new features',
          'No database maintenance',
          'Simplified policy management',
          'Centralized visibility across all locations'
        ]
      },
      {
        category: 'Scalability & Flexibility',
        items: [
          'On-demand scaling without hardware',
          'Remote location support without appliances',
          'Consistent performance at all scales',
          'Quick adaptation to changing requirements',
          'Support for distributed workforce'
        ]
      }
    ],
    forescout: [
      {
        category: 'Deployment & Implementation',
        items: [
          '1-7 days implementation vs. 2-4 months',
          'No costly appliances required',
          'Simplified network integration',
          'Lower expertise requirements',
          'Faster time to value'
        ]
      },
      {
        category: 'Operational Costs',
        items: [
          '55-65% lower TCO',
          'No hardware refresh costs',
          'Lower ongoing maintenance costs',
          'Reduced personnel requirements',
          'Predictable subscription pricing'
        ]
      },
      {
        category: 'Management & Maintenance',
        items: [
          'Automatic updates vs. manual upgrades',
          'Simplified policy management',
          'No infrastructure tuning required',
          'Reduced administrative overhead',
          'Modern cloud interface'
        ]
      },
      {
        category: 'Visibility & Control',
        items: [
          'Comparable device identification capabilities',
          'AI-powered device fingerprinting',
          '260,000+ device fingerprints',
          'Cloud-enhanced threat intelligence',
          'Cross-customer anonymized data insights'
        ]
      }
    ],
    fortinac: [
      {
        category: 'Deployment & Implementation',
        items: [
          '1-7 days implementation vs. 1-3 months',
          'No hardware procurement',
          'Simplified network integration',
          'Less networking expertise required',
          'Faster time to protection'
        ]
      },
      {
        category: 'Operational Costs',
        items: [
          '50-60% lower TCO',
          'Elimination of appliance costs',
          'Reduced maintenance overhead',
          'Less IT staff time required',
          'No infrastructure upgrade costs'
        ]
      },
      {
        category: 'Management & Maintenance',
        items: [
          'Simpler policy management',
          'Automatic updates and enhancements',
          'Continuous firmware security',
          'No version management',
          'Reduced complexity'
        ]
      },
      {
        category: 'Vendor-Agnostic Approach',
        items: [
          'Multi-vendor support vs. Fortinet-focused',
          'Neutrality in network architecture',
          'Works with all switching vendors',
          'Seamless integration with diverse environments',
          'No vendor lock-in'
        ]
      }
    ],
    nps: [
      {
        category: 'Capabilities & Features',
        items: [
          'Full NAC solution vs. basic authentication',
          'Advanced device fingerprinting',
          'Comprehensive policy controls',
          'Detailed visibility and analytics',
          'Broader compliance capabilities'
        ]
      },
      {
        category: 'Management & Administration',
        items: [
          'Modern cloud interface vs. Windows Server tools',
          'Purpose-built for NAC vs. general RADIUS server',
          'Simplified certificate management',
          'Automated device onboarding',
          'Enhanced guest management'
        ]
      },
      {
        category: 'Scalability & Performance',
        items: [
          'Cloud-native elastic scaling',
          'Consistent performance regardless of load',
          'Global deployment capabilities',
          'No Windows Server dependencies',
          'Cross-platform support'
        ]
      },
      {
        category: 'Security & Compliance',
        items: [
          'Purpose-built security features',
          'Advanced compliance automation',
          'Continuous security updates',
          'Modern authentication methods',
          'Broader regulatory support'
        ]
      }
    ],
    securew2: [
      {
        category: 'NAC Capabilities',
        items: [
          'Complete NAC solution vs. certificate focus',
          'Comprehensive device control',
          'Broader authentication methods',
          'Advanced policy enforcement',
          'More extensive compliance controls'
        ]
      },
      {
        category: 'Device Visibility',
        items: [
          'AI-powered device fingerprinting',
          '260,000+ device fingerprints',
          'Enhanced device classification',
          'Detailed visibility dashboards',
          'Greater context for decision-making'
        ]
      },
      {
        category: 'Operational Simplicity',
        items: [
          'Single platform for all NAC needs',
          'All-inclusive solution vs. component approach',
          'Streamlined management interface',
          'Less integration complexity',
          'Simplified deployment'
        ]
      },
      {
        category: 'Cost Efficiency',
        items: [
          'All-in-one pricing model',
          'No need for complementary solutions',
          'Lower total implementation costs',
          'Reduced integration expenses',
          'Better cost predictability'
        ]
      }
    ]
  };
  
  // Feature comparison matrix data
  const featureMatrix = {
    categories: [
      {
        name: 'Deployment',
        features: [
          { name: 'Cloud-Native Architecture', description: 'True SaaS platform built for the cloud' },
          { name: 'On-Premises Deployment', description: 'Traditional deployment on company hardware' },
          { name: 'Hybrid Deployment', description: 'Mix of cloud and on-premises components' },
          { name: 'Deployment Timeline', description: 'Time required for full implementation' },
          { name: 'Hardware Requirements', description: 'Physical infrastructure needed' }
        ]
      },
      {
        name: 'Authentication & Access',
        features: [
          { name: '802.1X Support', description: 'Standard port-based network access control' },
          { name: 'Certificate-Based Auth', description: 'Using digital certificates for authentication' },
          { name: 'RADIUS Service', description: 'Authentication, Authorization, and Accounting' },
          { name: 'TACACS+ Support', description: 'Network device administration protocol' },
          { name: 'Cloud Identity Support', description: 'Integration with cloud identity providers' }
        ]
      },
      {
        name: 'Device Management',
        features: [
          { name: 'Device Fingerprinting', description: 'Automatic device identification' },
          { name: 'BYOD Support', description: 'Bring Your Own Device management' },
          { name: 'IoT Device Support', description: 'Internet of Things device management' },
          { name: 'Guest Management', description: 'Temporary access for visitors' },
          { name: 'Agentless Operation', description: 'Functions without endpoint agents' }
        ]
      },
      {
        name: 'Management & Operations',
        features: [
          { name: 'Automatic Updates', description: 'Software updates without manual intervention' },
          { name: 'Multi-Site Management', description: 'Centralized control of distributed locations' },
          { name: 'API Availability', description: 'Programmable interfaces for integration' },
          { name: 'Operational Overhead', description: 'Ongoing management requirements' },
          { name: 'Implementation Complexity', description: 'Difficulty of initial setup' }
        ]
      },
      {
        name: 'Security & Compliance',
        features: [
          { name: 'Zero Trust Support', description: 'Never trust, always verify architecture' },
          { name: 'Posture Assessment', description: 'Endpoint security state evaluation' },
          { name: 'Compliance Reporting', description: 'Automated regulatory compliance' },
          { name: 'Threat Response', description: 'Automated actions based on security threats' },
          { name: 'Vulnerability Management', description: 'Identification and remediation of vulnerabilities' }
        ]
      }
    ],
    vendors: [
      { id: 'cisco', name: 'Cisco ISE' },
      { id: 'aruba', name: 'Aruba ClearPass' },
      { id: 'forescout', name: 'Forescout' },
      { id: 'fortinac', name: 'FortiNAC' },
      { id: 'nps', name: 'Microsoft NPS' },
      { id: 'securew2', name: 'SecureW2' },
      { id: 'portnox', name: 'Portnox Cloud' }
    ],
    ratings: {
      cisco: {
        'Cloud-Native Architecture': 3,
        'On-Premises Deployment': 10,
        'Hybrid Deployment': 7,
        'Deployment Timeline': 2,
        'Hardware Requirements': 2,
        '802.1X Support': 10,
        'Certificate-Based Auth': 9,
        'RADIUS Service': 10,
        'TACACS+ Support': 10,
        'Cloud Identity Support': 6,
        'Device Fingerprinting': 8,
        'BYOD Support': 9,
        'IoT Device Support': 8,
        'Guest Management': 9,
        'Agentless Operation': 6,
        'Automatic Updates': 4,
        'Multi-Site Management': 7,
        'API Availability': 8,
        'Operational Overhead': 3,
        'Implementation Complexity': 2,
        'Zero Trust Support': 8,
        'Posture Assessment': 9,
        'Compliance Reporting': 9,
        'Threat Response': 8,
        'Vulnerability Management': 8
      },
      aruba: {
        'Cloud-Native Architecture': 4,
        'On-Premises Deployment': 9,
        'Hybrid Deployment': 8,
        'Deployment Timeline': 3,
        'Hardware Requirements': 3,
        '802.1X Support': 10,
        'Certificate-Based Auth': 9,
        'RADIUS Service': 10,
        'TACACS+ Support': 8,
        'Cloud Identity Support': 7,
        'Device Fingerprinting': 8,
        'BYOD Support': 9,
        'IoT Device Support': 7,
        'Guest Management': 10,
        'Agentless Operation': 7,
        'Automatic Updates': 5,
        'Multi-Site Management': 8,
        'API Availability': 8,
        'Operational Overhead': 4,
        'Implementation Complexity': 3,
        'Zero Trust Support': 8,
        'Posture Assessment': 9,
        'Compliance Reporting': 9,
        'Threat Response': 8,
        'Vulnerability Management': 8
      },
      forescout: {
        'Cloud-Native Architecture': 3,
        'On-Premises Deployment': 9,
        'Hybrid Deployment': 7,
        'Deployment Timeline': 3,
        'Hardware Requirements': 3,
        '802.1X Support': 8,
        'Certificate-Based Auth': 7,
        'RADIUS Service': 8,
        'TACACS+ Support': 6,
        'Cloud Identity Support': 6,
        'Device Fingerprinting': 10,
        'BYOD Support': 8,
        'IoT Device Support': 10,
        'Guest Management': 7,
        'Agentless Operation': 10,
        'Automatic Updates': 4,
        'Multi-Site Management': 7,
        'API Availability': 8,
        'Operational Overhead': 4,
        'Implementation Complexity': 3,
        'Zero Trust Support': 8,
        'Posture Assessment': 9,
        'Compliance Reporting': 8,
        'Threat Response': 9,
        'Vulnerability Management': 9
      },
      fortinac: {
        'Cloud-Native Architecture': 2,
        'On-Premises Deployment': 9,
        'Hybrid Deployment': 6,
        'Deployment Timeline': 4,
        'Hardware Requirements': 3,
        '802.1X Support': 8,
        'Certificate-Based Auth': 7,
        'RADIUS Service': 8,
        'TACACS+ Support': 6,
        'Cloud Identity Support': 5,
        'Device Fingerprinting': 7,
        'BYOD Support': 7,
        'IoT Device Support': 8,
        'Guest Management': 7,
        'Agentless Operation': 7,
        'Automatic Updates': 5,
        'Multi-Site Management': 7,
        'API Availability': 7,
        'Operational Overhead': 5,
        'Implementation Complexity': 4,
        'Zero Trust Support': 7,
        'Posture Assessment': 8,
        'Compliance Reporting': 8,
        'Threat Response': 9,
        'Vulnerability Management': 8
      },
      nps: {
        'Cloud-Native Architecture': 1,
        'On-Premises Deployment': 8,
        'Hybrid Deployment': 3,
        'Deployment Timeline': 6,
        'Hardware Requirements': 5,
        '802.1X Support': 7,
        'Certificate-Based Auth': 6,
        'RADIUS Service': 7,
        'TACACS+ Support': 1,
        'Cloud Identity Support': 6,
        'Device Fingerprinting': 1,
        'BYOD Support': 3,
        'IoT Device Support': 1,
        'Guest Management': 2,
        'Agentless Operation': 7,
        'Automatic Updates': 5,
        'Multi-Site Management': 4,
        'API Availability': 4,
        'Operational Overhead': 5,
        'Implementation Complexity': 5,
        'Zero Trust Support': 3,
        'Posture Assessment': 2,
        'Compliance Reporting': 2,
        'Threat Response': 2,
        'Vulnerability Management': 1
      },
      securew2: {
        'Cloud-Native Architecture': 8,
        'On-Premises Deployment': 3,
        'Hybrid Deployment': 8,
        'Deployment Timeline': 7,
        'Hardware Requirements': 9,
        '802.1X Support': 9,
        'Certificate-Based Auth': 10,
        'RADIUS Service': 9,
        'TACACS+ Support': 3,
        'Cloud Identity Support': 10,
        'Device Fingerprinting': 4,
        'BYOD Support': 9,
        'IoT Device Support': 4,
        'Guest Management': 7,
        'Agentless Operation': 6,
        'Automatic Updates': 9,
        'Multi-Site Management': 9,
        'API Availability': 8,
        'Operational Overhead': 8,
        'Implementation Complexity': 7,
        'Zero Trust Support': 8,
        'Posture Assessment': 5,
        'Compliance Reporting': 6,
        'Threat Response': 4,
        'Vulnerability Management': 3
      },
      portnox: {
        'Cloud-Native Architecture': 10,
        'On-Premises Deployment': 3,
        'Hybrid Deployment': 8,
        'Deployment Timeline': 10,
        'Hardware Requirements': 10,
        '802.1X Support': 9,
        'Certificate-Based Auth': 9,
        'RADIUS Service': 9,
        'TACACS+ Support': 7,
        'Cloud Identity Support': 10,
        'Device Fingerprinting': 9,
        'BYOD Support': 9,
        'IoT Device Support': 9,
        'Guest Management': 9,
        'Agentless Operation': 9,
        'Automatic Updates': 10,
        'Multi-Site Management': 10,
        'API Availability': 9,
        'Operational Overhead': 9,
        'Implementation Complexity': 9,
        'Zero Trust Support': 9,
        'Posture Assessment': 8,
        'Compliance Reporting': 8,
        'Threat Response': 8,
        'Vulnerability Management': 7
      }
    }
  };
  
  // Implementation timeline comparison data
  const implementationTimeline = {
    phases: [
      {
        name: 'Planning & Design',
        description: 'Scoping requirements, designing architecture, and planning deployment',
        ciscoISE: { days: 30, tasks: 12 },
        arubaClearPass: { days: 21, tasks: 10 },
        forescout: { days: 21, tasks: 9 },
        portnox: { days: 1, tasks: 3 }
      },
      {
        name: 'Hardware Procurement',
        description: 'Ordering, shipping, and installing physical appliances',
        ciscoISE: { days: 21, tasks: 5 },
        arubaClearPass: { days: 14, tasks: 5 },
        forescout: { days: 14, tasks: 5 },
        portnox: { days: 0, tasks: 0 }
      },
      {
        name: 'Software Installation',
        description: 'Installing, configuring, and testing base software',
        ciscoISE: { days: 7, tasks: 8 },
        arubaClearPass: { days: 5, tasks: 7 },
        forescout: { days: 5, tasks: 6 },
        portnox: { days: 0.5, tasks: 2 }
      },
      {
        name: 'Network Integration',
        description: 'Integrating with switches, wireless, and existing infrastructure',
        ciscoISE: { days: 14, tasks: 10 },
        arubaClearPass: { days: 10, tasks: 9 },
        forescout: { days: 7, tasks: 7 },
        portnox: { days: 1, tasks: 3 }
      },
      {
        name: 'Policy Configuration',
        description: 'Creating and testing access policies',
        ciscoISE: { days: 21, tasks: 15 },
        arubaClearPass: { days: 14, tasks: 12 },
        forescout: { days: 10, tasks: 10 },
        portnox: { days: 2, tasks: 5 }
      },
      {
        name: 'Testing & Validation',
        description: 'Testing all scenarios and validating functionality',
        ciscoISE: { days: 14, tasks: 20 },
        arubaClearPass: { days: 10, tasks: 15 },
        forescout: { days: 7, tasks: 12 },
        portnox: { days: 1, tasks: 5 }
      },
      {
        name: 'Deployment & Rollout',
        description: 'Rolling out to production environment',
        ciscoISE: { days: 30, tasks: 25 },
        arubaClearPass: { days: 21, tasks: 20 },
        forescout: { days: 14, tasks: 15 },
        portnox: { days: 2, tasks: 6 }
      },
      {
        name: 'Knowledge Transfer',
        description: 'Training IT staff on management and operations',
        ciscoISE: { days: 5, tasks: 6 },
        arubaClearPass: { days: 4, tasks: 5 },
        forescout: { days: 3, tasks: 4 },
        portnox: { days: 0.5, tasks: 2 }
      }
    ]
  };
  
  // Public functions
  function createVendorComparisonCard(selector, competitor) {
    const container = document.querySelector(selector);
    if (!container) return;
    
    const competitorData = vendors[competitor];
    if (!competitorData) return;
    
    const portnoxData = vendors.portnox;
    const advantages = portnoxAdvantages[competitor];
    
    // Create comparison card
    const card = document.createElement('div');
    card.className = 'vendor-head-to-head';
    
    // Header
    const header = document.createElement('div');
    header.className = 'vendor-head-to-head-header';
    header.innerHTML = `
      <div class="vendor-head-to-head-title">
        <i class="fas fa-exchange-alt mr-2"></i>
        Portnox Cloud vs ${competitorData.name}
      </div>
      <div class="vendor-comparison-actions">
        <button class="btn-sm btn-light" id="download-comparison">
          <i class="fas fa-download mr-1"></i> Export
        </button>
      </div>
    `;
    card.appendChild(header);
    
    // Body - Grid with two columns
    const body = document.createElement('div');
    body.className = 'vendor-head-to-head-body';
    
    const grid = document.createElement('div');
    grid.className = 'vendor-comparison-grid';
    
    // Competitor column
    const competitorColumn = document.createElement('div');
    competitorColumn.className = 'vendor-column';
    
    const competitorHeader = document.createElement('div');
    competitorHeader.className = 'vendor-column-header';
    competitorHeader.innerHTML = `
      <img src="${competitorData.logo}" alt="${competitorData.name} Logo" class="vendor-logo">
      <div>
        <div class="vendor-name">${competitorData.name}</div>
        <div class="vendor-type">${competitorData.type}</div>
      </div>
    `;
    competitorColumn.appendChild(competitorHeader);
    
    const competitorDesc = document.createElement('div');
    competitorDesc.className = 'vendor-description';
    competitorDesc.textContent = competitorData.description;
    competitorColumn.appendChild(competitorDesc);
    
    // Implementation details
    const competitorImplementation = document.createElement('div');
    competitorImplementation.className = 'vendor-implementation-details mt-4 mb-4';
    competitorImplementation.innerHTML = `
      <div class="implementation-title font-medium text-gray-700 mb-2">Implementation Details</div>
      <div class="implementation-grid grid grid-cols-2 gap-2">
        <div class="implementation-item">
          <div class="text-sm text-gray-500">Deployment Time</div>
          <div class="font-medium">${competitorData.deploymentTime}</div>
        </div>
        <div class="implementation-item">
          <div class="text-sm text-gray-500">Complexity</div>
          <div class="font-medium">${competitorData.implementation.complexity}</div>
        </div>
        <div class="implementation-item">
          <div class="text-sm text-gray-500">Expertise Required</div>
          <div class="font-medium">${competitorData.implementation.expertise}</div>
        </div>
        <div class="implementation-item">
          <div class="text-sm text-gray-500">IT Resources</div>
          <div class="font-medium">${competitorData.implementation.resources}</div>
        </div>
      </div>
    `;
    competitorColumn.appendChild(competitorImplementation);
    
    // Strengths
    const competitorStrengths = document.createElement('div');
    competitorStrengths.className = 'vendor-feature-section mt-4';
    competitorStrengths.innerHTML = `<div class="font-medium text-gray-700 mb-2">Key Strengths</div>`;
    
    const strengthsList = document.createElement('ul');
    strengthsList.className = 'vendor-feature-list';
    
    competitorData.strengths.forEach(strength => {
      const item = document.createElement('li');
      item.className = 'vendor-feature-item';
      item.innerHTML = `
        <div class="vendor-feature-icon plus">
          <i class="fas fa-plus-circle"></i>
        </div>
        <div class="vendor-feature-text">${strength}</div>
      `;
      strengthsList.appendChild(item);
    });
    
    competitorStrengths.appendChild(strengthsList);
    competitorColumn.appendChild(competitorStrengths);
    
    // Weaknesses
    const competitorWeaknesses = document.createElement('div');
    competitorWeaknesses.className = 'vendor-feature-section mt-4';
    competitorWeaknesses.innerHTML = `<div class="font-medium text-gray-700 mb-2">Limitations</div>`;
    
    const weaknessesList = document.createElement('ul');
    weaknessesList.className = 'vendor-feature-list';
    
    competitorData.weaknesses.forEach(weakness => {
      const item = document.createElement('li');
      item.className = 'vendor-feature-item';
      item.innerHTML = `
        <div class="vendor-feature-icon minus">
          <i class="fas fa-minus-circle"></i>
        </div>
        <div class="vendor-feature-text">${weakness}</div>
      `;
      weaknessesList.appendChild(item);
    });
    
    competitorWeaknesses.appendChild(weaknessesList);
    competitorColumn.appendChild(competitorWeaknesses);
    
    // Portnox column
    const portnoxColumn = document.createElement('div');
    portnoxColumn.className = 'vendor-column';
    
    // Add winner badge
    const winnerBadge = document.createElement('div');
    winnerBadge.className = 'winner-badge';
    portnoxColumn.appendChild(winnerBadge);
    
    const portnoxHeader = document.createElement('div');
    portnoxHeader.className = 'vendor-column-header';
    portnoxHeader.innerHTML = `
      <img src="${portnoxData.logo}" alt="${portnoxData.name} Logo" class="vendor-logo">
      <div>
        <div class="vendor-name">${portnoxData.name}</div>
        <div class="vendor-type">${portnoxData.type}</div>
      </div>
    `;
    portnoxColumn.appendChild(portnoxHeader);
    
    const portnoxDesc = document.createElement('div');
    portnoxDesc.className = 'vendor-description';
    portnoxDesc.textContent = portnoxData.description;
    portnoxColumn.appendChild(portnoxDesc);
    
    // Implementation details
    const portnoxImplementation = document.createElement('div');
    portnoxImplementation.className = 'vendor-implementation-details mt-4 mb-4';
    portnoxImplementation.innerHTML = `
      <div class="implementation-title font-medium text-gray-700 mb-2">Implementation Details</div>
      <div class="implementation-grid grid grid-cols-2 gap-2">
        <div class="implementation-item">
          <div class="text-sm text-gray-500">Deployment Time</div>
          <div class="font-medium text-green-600">${portnoxData.deploymentTime}</div>
        </div>
        <div class="implementation-item">
          <div class="text-sm text-gray-500">Complexity</div>
          <div class="font-medium text-green-600">${portnoxData.implementation.complexity}</div>
        </div>
        <div class="implementation-item">
          <div class="text-sm text-gray-500">Expertise Required</div>
          <div class="font-medium text-green-600">${portnoxData.implementation.expertise}</div>
        </div>
        <div class="implementation-item">
          <div class="text-sm text-gray-500">IT Resources</div>
          <div class="font-medium text-green-600">${portnoxData.implementation.resources}</div>
        </div>
      </div>
    `;
    portnoxColumn.appendChild(portnoxImplementation);
    
    // Advantage categories
    advantages.forEach(category => {
      const categorySection = document.createElement('div');
      categorySection.className = 'vendor-advantage-section mt-4';
      categorySection.innerHTML = `<div class="font-medium text-green-600 mb-2">${category.category}</div>`;
      
      const advantagesList = document.createElement('ul');
      advantagesList.className = 'vendor-feature-list';
      
      category.items.forEach(item => {
        const listItem = document.createElement('li');
        listItem.className = 'vendor-feature-item';
        listItem.innerHTML = `
          <div class="vendor-feature-icon plus text-green-600">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="vendor-feature-text">${item}</div>
        `;
        advantagesList.appendChild(listItem);
      });
      
      categorySection.appendChild(advantagesList);
      portnoxColumn.appendChild(categorySection);
    });
    
    grid.appendChild(competitorColumn);
    grid.appendChild(portnoxColumn);
    body.appendChild(grid);
    card.appendChild(body);
    
    // Footer
    const footer = document.createElement('div');
    footer.className = 'vendor-comparison-footer';
    footer.innerHTML = `Based on analysis of vendor documentation, customer feedback, and industry research. TCO calculations based on 1000-device deployment over 3 years.`;
    card.appendChild(footer);
    
    // Add to container
    container.innerHTML = '';
    container.appendChild(card);
  }
  
  function createFeatureMatrixTable(selector, vendorIds = []) {
    const container = document.querySelector(selector);
    if (!container) return;
    
    // If no specific vendors, use all
    if (vendorIds.length === 0) {
      vendorIds = featureMatrix.vendors.map(v => v.id);
    }
    
    // Filter to selected vendors
    const selectedVendors = featureMatrix.vendors.filter(v => vendorIds.includes(v.id));
    
    // Create table
    const table = document.createElement('table');
    table.className = 'feature-matrix';
    
    // Create header row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    // Feature column header
    const featureHeader = document.createElement('th');
    featureHeader.textContent = 'Feature';
    headerRow.appendChild(featureHeader);
    
    // Vendor column headers
    selectedVendors.forEach(vendor => {
      const vendorHeader = document.createElement('th');
      vendorHeader.textContent = vendor.name;
      headerRow.appendChild(vendorHeader);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    // Add category rows and feature rows
    featureMatrix.categories.forEach(category => {
      // Category row
      const categoryRow = document.createElement('tr');
      categoryRow.className = 'category-row';
      
      const categoryCell = document.createElement('td');
      categoryCell.textContent = category.name;
      categoryCell.colSpan = selectedVendors.length + 1;
      categoryRow.appendChild(categoryCell);
      tbody.appendChild(categoryRow);
      
      // Feature rows
      category.features.forEach(feature => {
        const featureRow = document.createElement('tr');
        
        const featureCell = document.createElement('td');
        featureCell.innerHTML = `
          <div class="tooltip-modern">
            ${feature.name}
            <div class="tooltip-content">${feature.description}</div>
          </div>
        `;
        featureRow.appendChild(featureCell);
        
        // Add vendor ratings
        selectedVendors.forEach(vendor => {
          const ratingCell = document.createElement('td');
          const rating = featureMatrix.ratings[vendor.id][feature.name];
          
          let ratingClass = '';
          if (rating >= 9) ratingClass = 'feature-rating-10';
          else if (rating >= 7) ratingClass = 'feature-rating-8';
          else if (rating >= 5) ratingClass = 'feature-rating-6';
          else if (rating >= 3) ratingClass = 'feature-rating-4';
          else ratingClass = 'feature-rating-2';
          
          ratingCell.innerHTML = `<div class="feature-rating ${ratingClass}">${rating}</div>`;
          featureRow.appendChild(ratingCell);
        });
        
        tbody.appendChild(featureRow);
      });
    });
    
    table.appendChild(tbody);
    
    // Add to container
    container.innerHTML = '';
    container.appendChild(table);
  }
  
  function createImplementationTimeline(selector, competitorId) {
    const container = document.querySelector(selector);
    if (!container) return;
    
    const competitor = vendors[competitorId];
    if (!competitor) return;
    
    // Create timeline data
    const timelineData = {
      competitor: {
        id: competitorId,
        name: competitor.name
      },
      phases: implementationTimeline.phases.map(phase => {
        let competitorDuration = 0;
        
        // Get the appropriate competitor duration
        if (competitorId === 'cisco') competitorDuration = phase.ciscoISE.days;
        else if (competitorId === 'aruba') competitorDuration = phase.arubaClearPass.days;
        else if (competitorId === 'forescout') competitorDuration = phase.forescout.days;
        else competitorDuration = phase.ciscoISE.days; // Default if not specified
        
        return {
          name: phase.name,
          description: phase.description,
          competitorDuration: competitorDuration,
          portnoxDuration: phase.portnox.days
        };
      })
    };
    
    // Use ModernCharts to create the timeline
    if (typeof ModernCharts !== 'undefined' && ModernCharts.charts.migrationTimeline) {
      ModernCharts.charts.migrationTimeline(selector, timelineData);
    } else {
      console.error('ModernCharts.charts.migrationTimeline is not available');
    }
  }
  
  // Return public API
  return {
    vendors: vendors,
    advantages: portnoxAdvantages,
    featureMatrix: featureMatrix,
    implementationTimeline: implementationTimeline,
    createVendorComparisonCard: createVendorComparisonCard,
    createFeatureMatrixTable: createFeatureMatrixTable,
    createImplementationTimeline: createImplementationTimeline
  };
})();
