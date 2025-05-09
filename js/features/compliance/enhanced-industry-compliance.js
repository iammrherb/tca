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
