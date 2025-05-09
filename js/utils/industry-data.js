/**
 * Industry Data
 * Contains industry-specific metrics, compliance frameworks, and implementation details
 */
const IndustryData = {
    // Industry descriptions and metrics
    industries: {
        healthcare: {
            title: "Healthcare",
            icon: "fas fa-hospital",
            description: "Healthcare organizations face unique challenges in securing medical devices, patient data, and maintaining compliance with strict regulations like HIPAA while ensuring easy access for clinical staff.",
            implementationTime: "16-24 weeks",
            cloudSavings: "35-45%",
            cloudAdoption: "62%"
        },
        financial: {
            title: "Financial Services",
            icon: "fas fa-university",
            description: "Financial institutions require robust security for protecting sensitive financial data, ensuring regulatory compliance, and maintaining service availability under strict audit requirements.",
            implementationTime: "12-20 weeks",
            cloudSavings: "25-35%",
            cloudAdoption: "58%"
        },
        retail: {
            title: "Retail",
            icon: "fas fa-shopping-cart",
            description: "Retail environments need to secure payment systems, customer data, and diverse store networks while providing convenient guest access and supporting seasonal fluctuations.",
            implementationTime: "8-16 weeks",
            cloudSavings: "35-45%",
            cloudAdoption: "70%"
        },
        education: {
            title: "Education",
            icon: "fas fa-graduation-cap",
            description: "Educational institutions must balance open access for students and faculty with protecting sensitive data and research while managing seasonal network usage patterns.",
            implementationTime: "10-18 weeks",
            cloudSavings: "45-55%",
            cloudAdoption: "75%"
        },
        government: {
            title: "Government",
            icon: "fas fa-landmark",
            description: "Government agencies require advanced security controls to protect sensitive information, meet strict compliance requirements, and defend against sophisticated threats.",
            implementationTime: "18-30 weeks",
            cloudSavings: "20-30%",
            cloudAdoption: "48%"
        },
        manufacturing: {
            title: "Manufacturing",
            icon: "fas fa-industry",
            description: "Manufacturing environments face challenges with securing both IT and OT networks, managing legacy equipment, and maintaining production continuity while implementing security controls.",
            implementationTime: "12-24 weeks",
            cloudSavings: "40-50%",
            cloudAdoption: "65%"
        },
        technology: {
            title: "Technology",
            icon: "fas fa-microchip",
            description: "Technology companies need flexible security that supports innovation, protects intellectual property, and adapts to fast-changing environments and frequent network changes.",
            implementationTime: "8-14 weeks",
            cloudSavings: "40-50%",
            cloudAdoption: "82%"
        },
        hospitality: {
            title: "Hospitality",
            icon: "fas fa-hotel",
            description: "Hospitality businesses require secure guest access, PCI compliance for payment systems, and effective segmentation between guest, staff, and payment networks.",
            implementationTime: "8-16 weeks",
            cloudSavings: "35-45%",
            cloudAdoption: "72%"
        },
        other: {
            title: "Other Industries",
            icon: "fas fa-building",
            description: "Organizations across various industries benefit from NAC for network security, access control, and meeting compliance requirements specific to their business needs.",
            implementationTime: "10-20 weeks",
            cloudSavings: "30-40%",
            cloudAdoption: "65%"
        }
    },
    
    // Industry-specific breach costs and probabilities
    breachMetrics: {
        healthcare: {
            averageBreachCost: 9800000,
            annualProbability: 0.328,
            recordCost: 511
        },
        financial: {
            averageBreachCost: 6080000,
            annualProbability: 0.297,
            recordCost: 402
        },
        retail: {
            averageBreachCost: 4240000,
            annualProbability: 0.236,
            recordCost: 218
        },
        education: {
            averageBreachCost: 3850000,
            annualProbability: 0.246,
            recordCost: 187
        },
        government: {
            averageBreachCost: 5100000,
            annualProbability: 0.267,
            recordCost: 272
        },
        manufacturing: {
            averageBreachCost: 5560000,
            annualProbability: 0.257,
            recordCost: 241
        },
        technology: {
            averageBreachCost: 4700000,
            annualProbability: 0.277,
            recordCost: 227
        },
        hospitality: {
            averageBreachCost: 3200000,
            annualProbability: 0.225,
            recordCost: 162
        },
        other: {
            averageBreachCost: 4350000,
            annualProbability: 0.250,
            recordCost: 205
        }
    },
    
    // FTE requirements by industry
    fteRequirements: {
        healthcare: {
            cloudNac: 0.2, // per 1000 endpoints
            onPremiseNac: 0.5 // per 1000 endpoints
        },
        financial: {
            cloudNac: 0.15,
            onPremiseNac: 0.4
        },
        manufacturing: {
            cloudNac: 0.1,
            onPremiseNac: 0.3
        },
        education: {
            cloudNac: 0.08,
            onPremiseNac: 0.25
        },
        government: {
            cloudNac: 0.2,
            onPremiseNac: 0.5
        },
        retail: {
            cloudNac: 0.05,
            onPremiseNac: 0.2
        },
        technology: {
            cloudNac: 0.1,
            onPremiseNac: 0.3
        },
        hospitality: {
            cloudNac: 0.05,
            onPremiseNac: 0.2
        },
        other: {
            cloudNac: 0.15,
            onPremiseNac: 0.35
        }
    }
};
