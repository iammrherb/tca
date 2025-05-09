/**
 * Fix for industry dropdown functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  // Create industry templates if they don't exist
  if (!window.industryTemplates) {
    window.industryTemplates = {
      healthcare: {
        name: "Healthcare",
        defaults: {
          deviceCount: 2500,
          multipleLocations: true,
          locationCount: 5,
          complexAuthentication: true,
          legacyDevices: true,
          legacyPercentage: 25,
          cloudIntegration: true,
          customPolicies: true,
          policyComplexity: "high",
          yearsToProject: 5
        },
        complianceInfo: {
          title: "Healthcare Compliance Requirements",
          details: "Healthcare organizations need to comply with HIPAA, HITECH, and other regulations that mandate strong access controls, audit logging, and protection of patient health information (PHI).",
          keyRequirements: [
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
            },
            {
              name: "GDPR",
              description: "General Data Protection Regulation",
              relevance: "For healthcare organizations handling EU patient data, NAC helps enforce data protection requirements."
            }
          ]
        },
        benchmarks: {
          averageTCO: 3500000,
          implementationTime: 90,
          fteCost: 450000
        },
        challengesMitigated: [
          {
            challenge: "IoT Medical Device Management",
            mitigation: "Cloud NAC provides automated classification and secure onboarding for diverse medical IoT devices."
          },
          {
            challenge: "Clinician Workstation Security",
            mitigation: "Ensures seamless authentication while enforcing security policies, balancing usability with compliance."
          },
          {
            challenge: "Multi-facility Deployment",
            mitigation: "Cloud architecture enables consistent policy enforcement across all locations with centralized management."
          },
          {
            challenge: "Regulatory Compliance Reporting",
            mitigation: "Automated documentation of access controls and comprehensive audit logging simplifies compliance audits."
          }
        ]
      },
      financial: {
        name: "Financial Services",
        defaults: {
          deviceCount: 5000,
          multipleLocations: true,
          locationCount: 10,
          complexAuthentication: true,
          legacyDevices: true,
          legacyPercentage: 15,
          cloudIntegration: true,
          customPolicies: true,
          policyComplexity: "high",
          yearsToProject: 5
        },
        complianceInfo: {
          title: "Financial Services Compliance Requirements",
          details: "Financial institutions must comply with regulations such as PCI DSS, GLBA, SOX, and others that require strict access controls, network segmentation, and extensive audit capabilities.",
          keyRequirements: [
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
            },
            {
              name: "SOX",
              description: "Sarbanes-Oxley Act",
              relevance: "NAC contributes to internal controls over financial reporting systems."
            }
          ]
        },
        benchmarks: {
          averageTCO: 4200000,
          implementationTime: 120,
          fteCost: 570000
        },
        challengesMitigated: [
          {
            challenge: "Securing Multiple Branch Locations",
            mitigation: "Cloud NAC provides consistent security across all branches without requiring hardware at each location."
          },
          {
            challenge: "Third-Party Access Management",
            mitigation: "Granular policies for contractors, auditors, and partners with temporary access requirements."
          },
          {
            challenge: "Regulatory Audit Preparation",
            mitigation: "Comprehensive logging and reporting capabilities provide ready documentation for auditors."
          },
          {
            challenge: "BYOD and Remote Access",
            mitigation: "Secure authentication and policy enforcement for employee-owned devices and remote access scenarios."
          }
        ]
      },
      education: {
        name: "Education",
        defaults: {
          deviceCount: 7500,
          multipleLocations: true,
          locationCount: 3,
          complexAuthentication: false,
          legacyDevices: true,
          legacyPercentage: 35,
          cloudIntegration: true,
          customPolicies: true,
          policyComplexity: "medium",
          yearsToProject: 4
        },
        complianceInfo: {
          title: "Education Compliance Requirements",
          details: "Educational institutions must comply with regulations like FERPA, COPPA, and in some cases HIPAA for student health services, requiring strong access controls while supporting a diverse and dynamic user population.",
          keyRequirements: [
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
            },
            {
              name: "CIPA",
              description: "Children's Internet Protection Act",
              relevance: "NAC can help enforce appropriate internet access policies."
            }
          ]
        },
        benchmarks: {
          averageTCO: 2800000,
          implementationTime: 75,
          fteCost: 320000
        },
        challengesMitigated: [
          {
            challenge: "High Device Turnover",
            mitigation: "Simplified onboarding and offboarding process for student devices at the beginning and end of academic terms."
          },
          {
            challenge: "Diverse Device Types",
            mitigation: "Comprehensive device profiling handles various operating systems and device types common in educational environments."
          },
          {
            challenge: "Budget Constraints",
            mitigation: "Cloud-based subscription model reduces capital expenditure and ongoing administrative costs."
          },
          {
            challenge: "Research Network Security",
            mitigation: "Flexible policy options allow for secure but less restrictive access for research networks while protecting sensitive data."
          }
        ]
      },
      government: {
        name: "Government",
        defaults: {
          deviceCount: 10000,
          multipleLocations: true,
          locationCount: 8,
          complexAuthentication: true,
          legacyDevices: true,
          legacyPercentage: 40,
          cloudIntegration: false,
          customPolicies: true,
          policyComplexity: "high",
          yearsToProject: 5
        },
        complianceInfo: {
          title: "Government Compliance Requirements",
          details: "Government agencies must adhere to regulations such as FISMA, NIST 800-53, FedRAMP, and others that mandate strong security controls, continuous monitoring, and risk management.",
          keyRequirements: [
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
            },
            {
              name: "FedRAMP",
              description: "Federal Risk and Authorization Management Program",
              relevance: "For cloud deployments, FedRAMP compliance ensures appropriate security controls."
            }
          ]
        },
        benchmarks: {
          averageTCO: 4800000,
          implementationTime: 150,
          fteCost: 620000
        },
        challengesMitigated: [
          {
            challenge: "Legacy System Integration",
            mitigation: "Specialized support for older systems that must remain in service due to mission requirements."
          },
          {
            challenge: "Compliance Documentation",
            mitigation: "Comprehensive reporting capabilities to demonstrate compliance with federal security requirements."
          },
          {
            challenge: "Cross-Agency Access",
            mitigation: "Secure authentication mechanisms for personnel who require access across different agencies or departments."
          },
          {
            challenge: "Secure Remote Access",
            mitigation: "Strong authentication combined with device posture checking for teleworkers and field personnel."
          }
        ]
      },
      manufacturing: {
        name: "Manufacturing",
        defaults: {
          deviceCount: 3000,
          multipleLocations: true,
          locationCount: 4,
          complexAuthentication: false,
          legacyDevices: true,
          legacyPercentage: 50,
          cloudIntegration: true,
          customPolicies: true,
          policyComplexity: "medium",
          yearsToProject: 4
        },
        complianceInfo: {
          title: "Manufacturing Compliance Requirements",
          details: "Manufacturing environments need to secure both IT and OT (Operational Technology) networks, often requiring compliance with industry standards such as NIST CSF, IEC 62443, and potentially regulated standards depending on the industry.",
          keyRequirements: [
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
            },
            {
              name: "ISO 27001",
              description: "Information Security Management",
              relevance: "NAC contributes to meeting access control requirements of this standard."
            }
          ]
        },
        benchmarks: {
          averageTCO: 2500000,
          implementationTime: 95,
          fteCost: 380000
        },
        challengesMitigated: [
          {
            challenge: "OT/IT Convergence",
            mitigation: "Specialized policies for operational technology devices while maintaining security boundaries."
          },
          {
            challenge: "Legacy Industrial Equipment",
            mitigation: "Support for older industrial protocols and devices that cannot be easily upgraded."
          },
          {
            challenge: "Production Network Availability",
            mitigation: "High availability design ensures authentication systems do not impact production uptime."
          },
          {
            challenge: "Third-Party Maintenance Access",
            mitigation: "Secure, temporary access for equipment vendors and maintenance contractors."
          }
        ]
      }
    };
    console.log('Industry templates created');
  }
  
  // Initialize industry selector
  const industrySelector = document.getElementById('industry-selector');
  if (industrySelector) {
    // Clear existing options
    while (industrySelector.options.length > 1) {
      industrySelector.remove(1);
    }
    
    // Add industry options
    Object.entries(window.industryTemplates).forEach(([id, industry]) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = industry.name;
      industrySelector.appendChild(option);
    });
    
    // Add event listener if not already present
    if (!industrySelector._initialized) {
      industrySelector.addEventListener('change', function() {
        const industry = this.value;
        if (industry === 'none') return;
        
        const template = window.industryTemplates[industry];
        if (!template) return;
        
        // Apply industry defaults
        if (template.defaults) {
          // Apply each default value
          Object.entries(template.defaults).forEach(([key, value]) => {
            const input = document.getElementById(key);
            if (!input) return;
            
            if (input.type === 'checkbox') {
              input.checked = value;
              
              // Trigger change event to show dependent fields
              const event = new Event('change');
              input.dispatchEvent(event);
            } else {
              input.value = value;
              
              // For range inputs, update the displayed value
              if (input.type === 'range') {
                const valueDisplay = document.getElementById(`${key}-value`);
                if (valueDisplay) {
                  valueDisplay.textContent = value + '%';
                }
              }
            }
          });
        }
        
        // Display compliance info
        if (template.complianceInfo) {
          const container = document.getElementById('compliance-info-container');
          if (container) {
            container.innerHTML = '';
            const card = document.createElement('div');
            card.className = 'compliance-info-card';
            
            card.innerHTML = `
              <h3>${template.complianceInfo.title}</h3>
              <p>${template.complianceInfo.details}</p>
              <h4>Key Requirements</h4>
              <ul class="compliance-requirements">
                ${template.complianceInfo.keyRequirements.map(req => `<li>${req}</li>`).join('')}
              </ul>
            `;
            
            container.appendChild(card);
            container.classList.remove('hidden');
          }
        }
        
        // Run calculation if calculator is available
        if (window.calculator && typeof window.calculator.calculate === 'function') {
          window.calculator.calculate();
        }
        
        console.log(`Applied ${template.name} industry template`);
      });
      
      industrySelector._initialized = true;
      console.log('Industry selector initialized');
    }
  }
});
