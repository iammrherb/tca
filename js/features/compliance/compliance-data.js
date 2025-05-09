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
