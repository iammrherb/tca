/**
 * NAC Calculator Documentation
 * Provides detailed explanations of charts, calculations, and methodologies
 */
window.nacDocumentation = {
  // Chart documentation
  charts: {
    tcoComparison: {
      title: "TCO Comparison Chart",
      description: "This chart compares the Total Cost of Ownership (TCO) between your current NAC solution and Portnox Cloud over the selected time period.",
      methodology: "TCO is calculated by combining initial costs (hardware, implementation, training) with ongoing costs (maintenance, licensing, staff, downtime) over the projected years.",
      interpretation: "Lower bars indicate lower overall costs. The chart breaks down costs into initial and recurring components to show where the most significant differences occur."
    },
    cumulativeCost: {
      title: "Cumulative Cost Chart",
      description: "This chart shows how costs accumulate over time for both solutions, helping identify when Portnox Cloud begins to provide cost advantages.",
      methodology: "The chart plots total costs at each time period, starting with initial investments and adding annual costs for each projected year.",
      interpretation: "The gap between lines represents cumulative savings. The break-even point occurs where Portnox's line crosses below the current solution's line."
    },
    costBreakdown: {
      title: "Cost Breakdown Charts",
      description: "These pie charts show the relative proportion of different cost categories for each solution.",
      methodology: "Each segment represents a cost category's percentage of the total cost over the projected period.",
      interpretation: "Larger segments represent areas with the most significant cost impact. Compare the charts to identify where the most substantial differences exist between solutions."
    },
    implementationComparison: {
      title: "Implementation Timeline Comparison",
      description: "This chart compares the time required for each phase of implementation between your current solution and Portnox Cloud.",
      methodology: "Implementation times are derived from industry benchmarks and adjusted based on organization size and complexity factors.",
      interpretation: "Shorter bars for Portnox indicate time savings during implementation, which translates to faster time-to-value and reduced project costs."
    },
    featureComparison: {
      title: "Feature Comparison Chart",
      description: "This radar chart compares the capabilities of your current solution and Portnox Cloud across key feature categories.",
      methodology: "Feature ratings are based on analysis of vendor documentation, product reviews, and customer feedback on a scale of 1-10.",
      interpretation: "Larger area coverage indicates stronger overall capabilities. Focus on the dimensions most important for your organization's needs."
    },
    roiChart: {
      title: "Return on Investment Chart",
      description: "This chart visualizes the cumulative value of migrating to Portnox Cloud over time, including the break-even point.",
      methodology: "ROI is calculated by comparing the investment cost (migration + implementation) against the cumulative savings in annual costs over time.",
      interpretation: "The break-even point indicates when the initial investment is fully recovered. Beyond this point, all savings contribute directly to positive ROI."
    }
  },
  
  // Calculation methodologies
  calculations: {
    initialCosts: {
      title: "Initial Costs Calculation",
      description: "Initial costs include all one-time expenses required to implement the NAC solution.",
      formula: "Initial Costs = Hardware + Network Redesign + Implementation + Training + Migration",
      components: {
        hardware: "Hardware costs include servers, appliances, and other physical infrastructure. Cloud solutions typically have minimal or no hardware costs.",
        networkRedesign: "Network redesign costs include any necessary changes to network architecture to accommodate the NAC solution.",
        implementation: "Implementation costs include professional services and internal resource time to deploy the solution.",
        training: "Training costs include both formal training expenses and productivity impact during the learning period.",
        migration: "Migration costs apply when transitioning from an existing solution and include data migration, parallel operation, and testing."
      },
      notes: "Hardware and implementation costs typically scale most dramatically with organization size, while training and network redesign scale more moderately."
    },
    annualCosts: {
      title: "Annual Costs Calculation",
      description: "Annual costs include all recurring expenses associated with operating and maintaining the NAC solution.",
      formula: "Annual Costs = Maintenance + Licensing + Downtime Costs + IT Personnel Costs",
      components: {
        maintenance: "Maintenance includes vendor support costs and internal costs for applying updates and performing routine maintenance.",
        licensing: "Licensing includes subscription fees or recurring license costs based on the number of devices managed.",
        downtimeCosts: "Downtime costs calculate the business impact of service interruptions based on frequency and duration of outages.",
        personnel: "Personnel costs account for the time IT staff spend managing and supporting the NAC solution."
      },
      notes: "Cloud solutions typically have higher licensing costs but lower maintenance, downtime, and personnel costs compared to on-premises solutions."
    },
    complexityMultiplier: {
      title: "Complexity Multiplier Calculation",
      description: "The complexity multiplier adjusts costs based on specific organizational factors that increase implementation and operational complexity.",
      formula: "Base multiplier of 1.0, adjusted up to 2.0 based on complexity factors",
      components: {
        multipleLocations: "Each additional location adds 0.1 to the multiplier, up to a maximum of 1.0 extra.",
        complexAuthentication: "Complex authentication requirements add 0.15 to the multiplier.",
        legacyDevices: "Legacy device support adds up to 0.3 to the multiplier based on the percentage of legacy devices.",
        cloudIntegration: "Cloud integration requirements add 0.1 to the multiplier.",
        customPolicies: "Custom policy requirements add 0.05, 0.15, or 0.25 to the multiplier based on complexity."
      },
      notes: "Cloud-based solutions are less affected by complexity factors, with impacts reduced by approximately 60%."
    },
    roi: {
      title: "Return on Investment Calculation",
      description: "ROI measures the financial return from migrating to Portnox Cloud relative to the investment required.",
      formula: "ROI = (Cumulative Savings - Initial Investment) / Initial Investment × 100%",
      components: {
        initialInvestment: "Sum of Portnox Cloud implementation costs plus migration costs from current solution.",
        annualSavings: "Difference in annual costs between current solution and Portnox Cloud.",
        paybackPeriod: "Initial Investment ÷ Annual Savings (years to recover the initial investment)",
        npv: "Net Present Value accounts for the time value of money using a discount rate (typically 10%)."
      },
      notes: "A positive ROI indicates a financially beneficial migration. The higher the ROI percentage, the greater the financial benefit."
    }
  },
  
  // Vendor-specific explanations
  vendors: {
    cisco: {
      title: "Cisco ISE",
      architecture: "On-premises solution requiring dedicated appliances and servers.",
      strengths: "Strong integration with Cisco ecosystem, comprehensive policy controls, industry reputation.",
      weaknesses: "High hardware and implementation costs, complex deployment, high IT resource requirements.",
      costFactors: "Hardware costs and IT staffing are the largest contributors to TCO. Annual maintenance costs are also significant."
    },
    aruba: {
      title: "Aruba ClearPass",
      architecture: "On-premises solution with hardware appliance requirements.",
      strengths: "Strong multi-vendor support, extensive authentication options, mature guest management.",
      weaknesses: "Moderate to high implementation complexity, significant hardware requirements, ongoing maintenance overhead.",
      costFactors: "Hardware, implementation, and IT staffing are primary cost drivers. Annual maintenance and licensing costs are moderate to high."
    },
    forescout: {
      title: "Forescout",
      architecture: "On-premises solution requiring dedicated appliances.",
      strengths: "Excellent device discovery and classification, strong visibility capabilities, flexible deployment options.",
      weaknesses: "Premium pricing, moderate implementation complexity, ongoing maintenance requirements.",
      costFactors: "Premium pricing model makes licensing a significant cost factor. Hardware and implementation costs are also substantial."
    },
    nps: {
      title: "Microsoft NPS",
      architecture: "On-premises solution built on Windows Server.",
      strengths: "Low initial licensing costs (included with Windows Server), familiar Microsoft environment.",
      weaknesses: "Limited NAC capabilities, high administrative overhead, limited scalability, minimal ongoing development.",
      costFactors: "IT staffing is the largest cost factor due to high administrative requirements. Hardware costs are lower than dedicated NAC appliances."
    },
    fortinac: {
      title: "FortiNAC",
      architecture: "On-premises solution requiring dedicated appliances.",
      strengths: "Integration with Fortinet security ecosystem, moderate policy controls, improving feature set.",
      weaknesses: "Moderate implementation complexity, ongoing maintenance requirements, evolving platform.",
      costFactors: "Hardware, implementation, and annual maintenance are the primary cost drivers."
    },
    securew2: {
      title: "SecureW2",
      architecture: "Cloud-based identity and certificate management with NAC capabilities.",
      strengths: "Simplified deployment, minimal hardware requirements, certificate-based authentication focus.",
      weaknesses: "More limited NAC functionality compared to dedicated solutions, evolving feature set.",
      costFactors: "Annual licensing is the primary cost driver, with significantly lower hardware and implementation costs."
    },
    portnox: {
      title: "Portnox Cloud",
      architecture: "Cloud-native NAC solution with zero on-premises hardware requirements.",
      strengths: "Zero infrastructure footprint, rapid deployment, low maintenance overhead, automatic updates.",
      weaknesses: "Cloud connectivity requirement, potentially higher per-device licensing costs.",
      costFactors: "Annual licensing is the primary cost driver, with minimal implementation costs and significantly reduced IT staffing requirements."
    }
  },
  
  // Industry-specific documentation
  industries: {
    healthcare: {
      title: "Healthcare Industry",
      description: "Healthcare organizations face unique NAC requirements due to medical devices, PHI protection, and regulatory compliance demands.",
      keyRequirements: [
        "HIPAA compliance for electronic protected health information (ePHI)",
        "Medical device security with specialized policies for clinical systems",
        "Support for legacy medical equipment with limited security capabilities",
        "24/7 operational requirements with minimal acceptable downtime"
      ],
      benchmarks: {
        breachCost: "$9.8 million average per incident",
        implementationTime: "30% longer than typical environments",
        fteCost: "20% higher staffing requirements due to complexity",
        downtimeImpact: "50% higher business impact due to critical nature of services"
      },
      recommendations: "Cloud-based NAC solutions provide significant advantages for healthcare by reducing implementation complexity and ongoing maintenance while providing flexible policies for diverse device types."
    },
    financial: {
      title: "Financial Services Industry",
      description: "Financial institutions require stringent security controls and compliance with financial regulations.",
      keyRequirements: [
        "PCI DSS compliance for cardholder data environments",
        "SOX compliance for systems affecting financial reporting",
        "Multi-factor authentication capabilities",
        "Granular access controls and network segmentation"
      ],
      benchmarks: {
        breachCost: "$6.08 million average per incident",
        implementationTime: "20% longer due to testing and validation requirements",
        fteCost: "15% higher staffing requirements for compliance management",
        downtimeImpact: "80% higher business impact due to transaction systems"
      },
      recommendations: "Financial institutions benefit from the comprehensive logging and reporting capabilities of modern NAC solutions, though many prefer on-premises solutions for perceived control over critical security infrastructure."
    },
    manufacturing: {
      title: "Manufacturing Industry",
      description: "Manufacturing environments must secure both IT and OT networks with minimal production impact.",
      keyRequirements: [
        "OT/IT convergence security capabilities",
        "Legacy equipment support with minimal agents",
        "Production continuity with minimal disruption",
        "Supply chain security integration"
      ],
      benchmarks: {
        breachCost: "$5.56 million average per incident",
        implementationTime: "40% longer due to production constraints",
        fteCost: "Standard staffing requirements",
        downtimeImpact: "70% higher business impact due to production disruption"
      },
      recommendations: "Manufacturing environments benefit from incremental NAC deployment approaches, starting with monitoring before enforcement to minimize production disruptions."
    },
    retail: {
      title: "Retail Industry",
      description: "Retail organizations need to secure customer data while maintaining operational efficiency.",
      keyRequirements: [
        "PCI DSS compliance for payment systems",
        "POS system security integration",
        "Flexible seasonal staffing support",
        "Multi-location deployment capabilities"
      ],
      benchmarks: {
        breachCost: "$4.8 million average per incident",
        implementationTime: "10% shorter due to standardized environments",
        fteCost: "10% lower staffing requirements",
        downtimeImpact: "40% higher business impact during peak shopping periods"
      },
      recommendations: "Retail environments benefit from cloud-based NAC solutions due to multi-location requirements and the need for flexible scaling during seasonal periods."
    },
    education: {
      title: "Education Industry",
      description: "Educational institutions must balance open access with security across diverse user populations.",
      keyRequirements: [
        "BYOD support for student and faculty devices",
        "Research network security isolation",
        "FERPA compliance for student data",
        "Flexible policies for different campus areas"
      ],
      benchmarks: {
        breachCost: "$4.35 million average per incident",
        implementationTime: "20% shorter due to academic scheduling",
        fteCost: "20% lower staffing requirements",
        downtimeImpact: "10% higher impact during registration periods"
      },
      recommendations: "Educational institutions benefit from NAC solutions with strong BYOD support and flexible policy options to accommodate diverse user types and network areas."
    },
    government: {
      title: "Government Industry",
      description: "Government agencies face strict security requirements and compliance mandates.",
      keyRequirements: [
        "FISMA compliance and NIST framework alignment",
        "Strict security controls for sensitive data",
        "Legacy system integration capabilities",
        "FedRAMP certification for cloud solutions"
      ],
      benchmarks: {
        breachCost: "$5.2 million average per incident",
        implementationTime: "20% longer due to approval processes",
        fteCost: "10% higher staffing requirements for compliance",
        downtimeImpact: "30% higher business impact for critical services"
      },
      recommendations: "Government agencies typically require solutions with strong compliance documentation and certifications, with many still preferring on-premises solutions for controlled environments."
    }
  },
  
  // Compliance-related documentation
  compliance: {
    hipaa: {
      title: "HIPAA Compliance",
      description: "The Health Insurance Portability and Accountability Act (HIPAA) requires safeguards for protected health information (PHI).",
      relevantControls: [
        "Access Control (§ 164.312(a)(1)): Implement technical policies and procedures for electronic information systems that maintain ePHI to allow access only to authorized persons or software programs.",
        "Audit Controls (§ 164.312(b)): Implement hardware, software, and/or procedural mechanisms that record and examine activity in information systems that contain or use ePHI.",
        "Integrity (§ 164.312(c)(1)): Implement policies and procedures to protect ePHI from improper alteration or destruction.",
        "Person or Entity Authentication (§ 164.312(d)): Implement procedures to verify that a person or entity seeking access to ePHI is the one claimed."
      ],
      nacImpact: "NAC solutions directly support HIPAA compliance through access controls, authentication, and audit logging. Cloud NAC solutions must be configured to maintain appropriate BAA (Business Associate Agreement) compliance."
    },
    pci: {
      title: "PCI DSS Compliance",
      description: "The Payment Card Industry Data Security Standard (PCI DSS) protects cardholder data with specific security requirements.",
      relevantControls: [
        "Requirement 1: Install and maintain a firewall configuration to protect cardholder data.",
        "Requirement 7: Restrict access to cardholder data by business need to know.",
        "Requirement 8: Identify and authenticate access to system components.",
        "Requirement 10: Track and monitor all access to network resources and cardholder data."
      ],
      nacImpact: "NAC solutions support PCI DSS compliance through network segmentation, access control enforcement, and authentication management. NAC helps create and maintain a clearly defined cardholder data environment (CDE)."
    },
    gdpr: {
      title: "GDPR Compliance",
      description: "The General Data Protection Regulation (GDPR) protects personal data of EU residents with strict privacy requirements.",
      relevantControls: [
        "Article 25: Data protection by design and by default.",
        "Article 32: Security of processing, including the ability to ensure the ongoing confidentiality, integrity, availability, and resilience of processing systems and services.",
        "Article 30: Records of processing activities.",
        "Article 33: Notification of personal data breaches to the supervisory authority."
      ],
      nacImpact: "NAC solutions support GDPR compliance through access controls, device visibility, and authentication management. NAC helps demonstrate 'appropriate technical measures' for data protection."
    },
    cmmc: {
      title: "CMMC Compliance",
      description: "The Cybersecurity Maturity Model Certification (CMMC) establishes cybersecurity standards for defense contractors.",
      relevantControls: [
        "AC.1.001: Limit information system access to authorized users, processes, or devices.",
        "AC.1.002: Limit information system access to the types of transactions and functions that authorized users are permitted to execute.",
        "AC.2.013: Monitor and control remote access sessions.",
        "AC.2.016: Control the flow of CUI in accordance with approved authorizations."
      ],
      nacImpact: "NAC solutions directly support CMMC compliance through access control, network segmentation, and continuous monitoring capabilities. NAC is particularly relevant for Level 2 and Level 3 CMMC requirements."
    }
  },
  
  // Security incident documentation
  securityIncidents: {
    networkAccess: [
      {
        title: "Unauthorized Network Access via Rogue Devices",
        description: "Attackers connect unauthorized devices to networks to bypass perimeter security.",
        impact: "Data theft, lateral movement, persistent access for ongoing attacks.",
        mitigation: "NAC enforces device authentication and authorization before granting network access, preventing rogue devices from connecting."
      },
      {
        title: "Compromised Credentials",
        description: "Attackers use stolen credentials to access corporate networks legitimately.",
        impact: "Authorized but malicious access, difficult to detect using traditional methods.",
        mitigation: "NAC can incorporate multi-factor authentication and device health checks, preventing access even with valid credentials if device conditions are suspicious."
      },
      {
        title: "IoT Device Compromise",
        description: "Attackers exploit vulnerable IoT devices as entry points to networks.",
        impact: "Persistent access, pivoting to higher-value targets, botnet recruitment.",
        mitigation: "NAC provides visibility into all connected devices, enforces security policies for IoT devices, and can quarantine compromised devices."
      }
    ],
    lateralMovement: [
      {
        title: "Network Segmentation Bypass",
        description: "Attackers exploit flat networks or segmentation weaknesses to access sensitive areas.",
        impact: "Access to critical systems and data beyond initial compromise point.",
        mitigation: "NAC enforces dynamic network segmentation based on device type, user role, and security posture."
      },
      {
        title: "Privilege Escalation via Unsecured Devices",
        description: "Attackers compromise weakly secured devices to gain elevated privileges.",
        impact: "Administrative access, configuration changes, security control bypasses.",
        mitigation: "NAC continuously assesses device security posture and can limit access based on compliance status."
      }
    ],
    compliance: [
      {
        title: "Regulatory Non-Compliance Due to Unauthorized Devices",
        description: "Unmanaged or unauthorized devices create compliance violations.",
        impact: "Regulatory penalties, failed audits, mandatory breach notifications.",
        mitigation: "NAC maintains continuous inventory of all devices, enforces compliance policies, and provides audit logs for regulatory requirements."
      },
      {
        title: "Failure to Detect Security Control Gaps",
        description: "Organizations unable to identify missing or inadequate security controls.",
        impact: "Compliance gaps, security vulnerabilities, failed audits.",
        mitigation: "NAC provides continuous visibility into device security status, identifying non-compliant systems."
      }
    ],
    response: [
      {
        title: "Delayed Breach Detection",
        description: "Organizations take months to identify network breaches.",
        impact: "Extended attacker dwell time, increased data loss, higher breach costs.",
        mitigation: "NAC provides real-time visibility into abnormal network behavior and can identify unauthorized access attempts."
      },
      {
        title: "Ineffective Incident Containment",
        description: "Organizations struggle to contain breaches once detected.",
        impact: "Breach expansion, increased recovery costs, business disruption.",
        mitigation: "NAC enables rapid quarantine of compromised devices, limiting lateral movement and containing security incidents."
      }
    ]
  },
  
  // Sensitivity analysis documentation
  sensitivityAnalysis: {
    title: "Sensitivity Analysis",
    description: "Sensitivity analysis evaluates how changes in key variables affect TCO and comparison results.",
    usage: "Use sensitivity analysis to identify which variables have the most significant impact on your NAC solution costs.",
    parameters: {
      deviceCount: {
        title: "Device Count",
        description: "The total number of devices managed by the NAC solution.",
        impact: "Most NAC solutions have per-device licensing costs, making device count a primary scaling factor for TCO. Cloud solutions typically scale more efficiently than on-premises at higher device counts."
      },
      legacyPercentage: {
        title: "Legacy Device Percentage",
        description: "The percentage of devices that require special handling due to limited security capabilities.",
        impact: "Higher legacy device percentages increase implementation complexity and ongoing maintenance requirements. Cloud solutions often handle legacy devices more efficiently through specialized policies."
      },
      locationCount: {
        title: "Number of Locations",
        description: "The number of physical locations where the NAC solution is deployed.",
        impact: "On-premises solutions require hardware at each location, causing costs to scale linearly with location count. Cloud solutions have minimal location-based cost scaling."
      },
      yearsToProject: {
        title: "Years to Project",
        description: "The time period for TCO projection.",
        impact: "Longer projection periods typically favor cloud solutions due to the elimination of hardware refresh cycles and reduced maintenance requirements."
      },
      hardwareCost: {
        title: "Hardware Cost Multiplier",
        description: "A multiplier that adjusts hardware costs based on specific requirements or market changes.",
        impact: "Hardware costs primarily affect on-premises solutions. Cloud solutions like Portnox have minimal or zero hardware requirements."
      },
      licensingCost: {
        title: "Licensing Cost Multiplier",
        description: "A multiplier that adjusts licensing costs based on specific requirements or market changes.",
        impact: "Licensing costs affect all solutions but are typically the primary cost driver for cloud solutions."
      },
      maintenanceCost: {
        title: "Maintenance Cost Multiplier",
        description: "A multiplier that adjusts ongoing maintenance costs based on specific requirements or environment complexity.",
        impact: "Maintenance costs primarily affect on-premises solutions. Cloud solutions typically include maintenance in the licensing costs."
      },
      implementationCost: {
        title: "Implementation Cost Multiplier",
        description: "A multiplier that adjusts implementation costs based on specific requirements or environment complexity.",
        impact: "Implementation costs scale with complexity for all solutions but are typically lower for cloud solutions."
      },
      fteCost: {
        title: "Personnel Cost Multiplier",
        description: "A multiplier that adjusts IT staffing costs based on specific requirements or regional labor costs.",
        impact: "Personnel costs are a significant factor for on-premises solutions due to higher ongoing maintenance and administration requirements."
      },
      downtimeCost: {
        title: "Downtime Cost ($/hour)",
        description: "The business impact cost of solution downtime per hour.",
        impact: "Downtime costs are typically lower for cloud solutions due to higher availability design and automated maintenance."
      }
    },
    interpretation: {
      title: "Interpreting Sensitivity Analysis Results",
      breakeven: "The breakeven points identify thresholds where one solution becomes more cost-effective than another.",
      costDrivers: "Variables with steep TCO sensitivity curves represent the most significant cost drivers.",
      recommendations: "Focus optimization efforts on variables with the highest sensitivity impact to maximize cost efficiency."
    }
  }
};

/**
 * Helper function to get documentation for a specific chart
 * @param {string} chartId - ID of the chart
 * @returns {object} Chart documentation
 */
window.getChartDocumentation = function(chartId) {
  const docs = window.nacDocumentation.charts;
  
  switch(chartId) {
    case 'tco-comparison-chart':
      return docs.tcoComparison;
    case 'cumulative-cost-chart':
      return docs.cumulativeCost;
    case 'current-breakdown-chart':
    case 'alternative-breakdown-chart':
      return docs.costBreakdown;
    case 'implementation-comparison-chart':
      return docs.implementationComparison;
    case 'feature-comparison-chart':
      return docs.featureComparison;
    case 'roi-chart':
      return docs.roiChart;
    default:
      return {
        title: "Chart Documentation",
        description: "Detailed documentation for this chart is not available.",
        methodology: "Please refer to the general calculation methodologies for more information.",
        interpretation: "For help interpreting this chart, please contact support."
      };
  }
};

/**
 * Helper function to get documentation for a specific vendor
 * @param {string} vendorId - ID of the vendor
 * @returns {object} Vendor documentation
 */
window.getVendorDocumentation = function(vendorId) {
  const docs = window.nacDocumentation.vendors;
  
  if (docs[vendorId]) {
    return docs[vendorId];
  }
  
  return {
    title: "Vendor Documentation",
    description: "Detailed documentation for this vendor is not available.",
    architecture: "Please refer to the vendor's website for more information.",
    strengths: "For detailed strengths, please contact support.",
    weaknesses: "For detailed weaknesses, please contact support.",
    costFactors: "For detailed cost factors, please contact support."
  };
};

/**
 * Helper function to get documentation for a specific industry
 * @param {string} industryId - ID of the industry
 * @returns {object} Industry documentation
 */
window.getIndustryDocumentation = function(industryId) {
  const docs = window.nacDocumentation.industries;
  
  if (docs[industryId]) {
    return docs[industryId];
  }
  
  return {
    title: "Industry Documentation",
    description: "Detailed documentation for this industry is not available.",
    keyRequirements: [
      "For detailed requirements, please contact support."
    ],
    benchmarks: {
      breachCost: "Industry-specific data not available",
      implementationTime: "Industry-specific data not available",
      fteCost: "Industry-specific data not available",
      downtimeImpact: "Industry-specific data not available"
    },
    recommendations: "For industry-specific recommendations, please contact support."
  };
};

/**
 * Helper function to get documentation for a specific compliance framework
 * @param {string} complianceId - ID of the compliance framework
 * @returns {object} Compliance documentation
 */
window.getComplianceDocumentation = function(complianceId) {
  const docs = window.nacDocumentation.compliance;
  
  if (docs[complianceId]) {
    return docs[complianceId];
  }
  
  return {
    title: "Compliance Documentation",
    description: "Detailed documentation for this compliance framework is not available.",
    relevantControls: [
      "For detailed controls, please contact support."
    ],
    nacImpact: "For specific NAC impacts on this framework, please contact support."
  };
};

/**
 * Helper function to get documentation for sensitivity analysis
 * @param {string} parameterId - Optional ID of the specific parameter
 * @returns {object} Sensitivity analysis documentation
 */
window.getSensitivityDocumentation = function(parameterId) {
  const docs = window.nacDocumentation.sensitivityAnalysis;
  
  if (parameterId && docs.parameters[parameterId]) {
    return docs.parameters[parameterId];
  }
  
  return docs;
};

/**
 * Add documentation tooltips to charts
 */
window.addDocumentationTooltips = function() {
  // Get all chart containers
  const chartContainers = document.querySelectorAll('.chart-container');
  
  chartContainers.forEach(container => {
    // Get the chart ID
    const canvas = container.querySelector('canvas');
    if (!canvas) return;
    
    const chartId = canvas.id;
    const docs = window.getChartDocumentation(chartId);
    
    // Create info icon
    const infoIcon = document.createElement('div');
    infoIcon.className = 'chart-info-icon';
    infoIcon.innerHTML = '<i class="fas fa-info-circle"></i>';
    infoIcon.setAttribute('title', docs.description);
    infoIcon.setAttribute('data-chart-id', chartId);
    
    // Add tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'chart-tooltip';
    tooltip.innerHTML = `
      <h4>${docs.title}</h4>
      <p><strong>Description:</strong> ${docs.description}</p>
      <p><strong>Methodology:</strong> ${docs.methodology}</p>
      <p><strong>Interpretation:</strong> ${docs.interpretation}</p>
    `;
    
    infoIcon.appendChild(tooltip);
    container.appendChild(infoIcon);
    
    // Add event listeners
    infoIcon.addEventListener('mouseenter', () => {
      tooltip.style.display = 'block';
    });
    
    infoIcon.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });
  });
};

// Initialize documentation when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Add tooltip styles to the document
  const style = document.createElement('style');
  style.textContent = `
    .chart-info-icon {
      position: absolute;
      top: 5px;
      right: 5px;
      color: var(--primary-color);
      cursor: pointer;
      font-size: 16px;
      z-index: 10;
    }
    
    .chart-tooltip {
      display: none;
      position: absolute;
      right: 0;
      top: 20px;
      width: 300px;
      background-color: white;
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-md);
      padding: var(--spacing-md);
      box-shadow: var(--shadow-md);
      z-index: 100;
      font-size: var(--font-size-sm);
    }
    
    .chart-tooltip h4 {
      margin-top: 0;
      margin-bottom: var(--spacing-sm);
    }
    
    .chart-tooltip p {
      margin: var(--spacing-xs) 0;
    }
    
    .help-panel {
      max-height: 500px;
      overflow-y: auto;
      padding: var(--spacing-md);
      background-color: var(--card-background);
      border-radius: var(--border-radius-md);
      box-shadow: var(--shadow-sm);
    }
  `;
  
  document.head.appendChild(style);
  
  // Create help panel if it doesn't exist
  if (!document.getElementById('help-panel')) {
    const helpPanel = document.createElement('div');
    helpPanel.id = 'help-panel';
    helpPanel.className = 'help-panel hidden';
    
    // Find a good place to insert it
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.appendChild(helpPanel);
    } else {
      document.body.appendChild(helpPanel);
    }
  }
  
  // Add documentation tooltips to charts
  setTimeout(window.addDocumentationTooltips, 1000);
});
