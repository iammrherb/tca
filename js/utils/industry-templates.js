/**
 * Industry Templates for the Total Cost Analyzer
 * Provides industry-specific configurations and insights
 */

// Industry templates with defaults and regulatory requirements
window.industryTemplates = {
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
          description: 'The Health Insurance Portability and Accountability Act sets the standard for protecting sensitive patient data',
          relevance: 'NAC helps satisfy HIPAA Security Rule requirements for access controls, audit controls, and device controls'
        },
        {
          name: 'HITECH Act',
          description: 'The Health Information Technology for Economic and Clinical Health Act expanded HIPAA requirements',
          relevance: 'NAC provides technical capabilities to meet requirements for access restriction and activity logging'
        },
        {
          name: 'FDA Medical Device Regulations',
          description: 'FDA guidelines for medical device cybersecurity',
          relevance: 'NAC can identify and classify medical devices, apply appropriate policies, and protect them from threats'
        }
      ]
    },
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
      fteCost: 185000
    },
    portnoxAdvantages: [
      "Zero hardware requirements ideal for clinical environments",
      "Specialized medical device profiles and classification",
      "Automatic HIPAA compliance monitoring and reporting",
      "Support for legacy medical equipment without agents",
      "Cloud architecture allows remote facilities management from a single console"
    ]
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
          description: 'The Payment Card Industry Data Security Standard for securing payment card environments',
          relevance: 'NAC helps meet requirements for network segmentation, access control, monitoring, and security testing'
        },
        {
          name: 'SOX',
          description: 'The Sarbanes-Oxley Act requires strict financial controls and security',
          relevance: 'NAC provides access controls and audit trails that support SOX section 404 compliance'
        },
        {
          name: 'GLBA',
          description: 'The Gramm-Leach-Bliley Act requires protection of customer data',
          relevance: 'NAC supports the Safeguards Rule by providing controls that protect customer information'
        }
      ]
    },
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
      fteCost: 210000
    },
    portnoxAdvantages: [
      "Continuous PCI DSS compliance monitoring and enforcement",
      "Branch office security management from a central console",
      "Advanced MFA integration for identity verification",
      "Detailed audit logs for regulatory reporting",
      "Fast deployment without security compromises"
    ]
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
          description: 'The Family Educational Rights and Privacy Act protects student education records',
          relevance: 'NAC helps restrict access to systems containing student records to authorized personnel'
        },
        {
          name: 'COPPA',
          description: 'The Children\'s Online Privacy Protection Act applies to operators of websites and online services',
          relevance: 'NAC can help implement appropriate controls for networks accessed by minors'
        },
        {
          name: 'CIPA',
          description: 'The Children\'s Internet Protection Act requires internet filters to protect children',
          relevance: 'NAC supports policy-based filtering and monitoring requirements'
        }
      ]
    },
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
      fteCost: 150000
    },
    portnoxAdvantages: [
      "Simplified BYOD onboarding for students and faculty",
      "Cost-effective subscription model ideal for education budgets",
      "Flexible access policies for different campus areas",
      "Zero hardware investment with cloud-based deployment",
      "Easy scaling for enrollment fluctuations"
    ]
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
          description: 'International standards for industrial automation and control systems security',
          relevance: 'NAC provides zone-based segmentation and access controls aligned with security levels'
        },
        {
          name: 'NIST 800-82',
          description: 'Guide to Industrial Control Systems Security',
          relevance: 'NAC helps implement recommended access control and network segmentation measures'
        },
        {
          name: 'NERC CIP',
          description: 'North American Electric Reliability Corporation Critical Infrastructure Protection standards',
          relevance: 'NAC supports electronic security perimeter requirements and access control measures'
        }
      ]
    },
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
      fteCost: 165000
    },
    portnoxAdvantages: [
      "Non-disruptive implementation for continuous production",
      "Agentless monitoring of legacy industrial equipment",
      "IT/OT convergence security without hardware appliances",
      "Supply chain access security with vendor controls",
      "Low impact deployment with rapid implementation"
    ]
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
          description: 'Payment Card Industry Data Security Standard',
          relevance: 'NAC provides segmentation, access controls, and monitoring for PCI DSS compliance'
        },
        {
          name: 'CCPA/CPRA',
          description: 'California Consumer Privacy Act and California Privacy Rights Act',
          relevance: 'NAC helps restrict access to systems containing customer data'
        },
        {
          name: 'GDPR',
          description: 'General Data Protection Regulation for EU customers',
          relevance: 'NAC helps implement appropriate technical measures to protect personal data'
        }
      ]
    },
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
      fteCost: 140000
    },
    portnoxAdvantages: [
      "Central management of distributed store locations",
      "PCI DSS continuous compliance monitoring",
      "Fast seasonal staff onboarding and offboarding",
      "No hardware deployment required at retail locations",
      "Simplified management for limited IT staff environments"
    ]
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
          description: 'The Federal Information Security Modernization Act',
          relevance: 'NAC provides the access controls, monitoring, and documentation required for compliance'
        },
        {
          name: 'NIST 800-53',
          description: 'Security and privacy controls for federal information systems and organizations',
          relevance: 'NAC implements multiple control families including Access Control, Identification and Authentication, and Configuration Management'
        },
        {
          name: 'CJIS',
          description: 'Criminal Justice Information Services security policy',
          relevance: 'NAC helps implement advanced authentication and access controls required for compliance'
        }
      ]
    },
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
      fteCost: 195000
    },
    portnoxAdvantages: [
      "FedRAMP compliance with strong security controls",
      "FIPS 140-2 validated cryptography in Azure Key Vault",
      "Zero trust architecture implementation",
      "Legacy system support without agents",
      "Government-specific compliance reporting"
    ]
  }
};

// Add enhanced Portnox advantages and TCO factors for all industries
Object.keys(window.industryTemplates).forEach(industry => {
  window.industryTemplates[industry].tcoFactors = {
    implementationSpeed: {
      traditional: window.industryTemplates[industry].benchmarks.implementationTime,
      portnox: Math.round(window.industryTemplates[industry].benchmarks.implementationTime * 0.25) // 75% faster
    },
    annualMaintenanceSavings: Math.round(window.industryTemplates[industry].benchmarks.averageTCO * 0.15), // 15% of TCO
    hardwareEliminationSavings: Math.round(window.industryTemplates[industry].benchmarks.averageTCO * 0.25), // 25% of TCO
    staffingReduction: {
      fte: Math.round(window.industryTemplates[industry].benchmarks.fteCost * 0.6) // 60% FTE cost reduction
    },
    complianceCost: {
      traditional: Math.round(window.industryTemplates[industry].benchmarks.averageTCO * 0.12), // 12% of TCO
      portnox: Math.round(window.industryTemplates[industry].benchmarks.averageTCO * 0.05) // 5% of TCO
    },
    threeYearTCOSavings: Math.round(window.industryTemplates[industry].benchmarks.averageTCO * 0.4) // 40% total savings
  };
});
