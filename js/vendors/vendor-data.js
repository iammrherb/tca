/**
 * Vendor Data for Total Cost Analyzer
 * Contains cost data for various NAC vendors
 */

// Define vendor data - structure matches the calculator's expected properties
const vendorData = {
    cisco: {
        name: "Cisco ISE",
        initialCosts: {
            hardware: 50000,
            software: 75000,
            implementation: 45000
        },
        annualCosts: {
            licensing: 35000,
            maintenance: 15000,
            support: 20000,
            personnel: 85000
        },
        // Legacy property names for backward compatibility
        initialHardware: 50000,
        initialSoftware: 75000,
        initialImplementation: 45000,
        annualLicensing: 35000,
        annualMaintenance: 15000,
        annualSupport: 20000,
        annualPersonnel: 85000
    },
    aruba: {
        name: "Aruba ClearPass",
        initialCosts: {
            hardware: 45000,
            software: 65000,
            implementation: 40000
        },
        annualCosts: {
            licensing: 30000,
            maintenance: 12000,
            support: 18000,
            personnel: 80000
        },
        // Legacy property names for backward compatibility
        initialHardware: 45000,
        initialSoftware: 65000,
        initialImplementation: 40000,
        annualLicensing: 30000,
        annualMaintenance: 12000,
        annualSupport: 18000,
        annualPersonnel: 80000
    },
    forescout: {
        name: "Forescout",
        initialCosts: {
            hardware: 55000,
            software: 70000,
            implementation: 50000
        },
        annualCosts: {
            licensing: 38000,
            maintenance: 16000,
            support: 22000,
            personnel: 90000
        },
        // Legacy property names for backward compatibility
        initialHardware: 55000,
        initialSoftware: 70000,
        initialImplementation: 50000,
        annualLicensing: 38000,
        annualMaintenance: 16000,
        annualSupport: 22000,
        annualPersonnel: 90000
    },
    nps: {
        name: "Microsoft NPS",
        initialCosts: {
            hardware: 25000,
            software: 10000,
            implementation: 35000
        },
        annualCosts: {
            licensing: 5000,
            maintenance: 8000,
            support: 12000,
            personnel: 95000
        },
        // Legacy property names for backward compatibility
        initialHardware: 25000,
        initialSoftware: 10000,
        initialImplementation: 35000,
        annualLicensing: 5000,
        annualMaintenance: 8000,
        annualSupport: 12000,
        annualPersonnel: 95000
    },
    fortinac: {
        name: "FortiNAC",
        initialCosts: {
            hardware: 40000,
            software: 60000,
            implementation: 38000
        },
        annualCosts: {
            licensing: 28000,
            maintenance: 14000,
            support: 18000,
            personnel: 82000
        },
        // Legacy property names for backward compatibility
        initialHardware: 40000,
        initialSoftware: 60000,
        initialImplementation: 38000,
        annualLicensing: 28000,
        annualMaintenance: 14000,
        annualSupport: 18000,
        annualPersonnel: 82000
    },
    securew2: {
        name: "SecureW2",
        initialCosts: {
            hardware: 15000,
            software: 50000,
            implementation: 30000
        },
        annualCosts: {
            licensing: 25000,
            maintenance: 10000,
            support: 15000,
            personnel: 75000
        },
        // Legacy property names for backward compatibility
        initialHardware: 15000,
        initialSoftware: 50000,
        initialImplementation: 30000,
        annualLicensing: 25000,
        annualMaintenance: 10000,
        annualSupport: 15000,
        annualPersonnel: 75000
    },
    portnox: {
        name: "Portnox Cloud",
        initialCosts: {
            hardware: 0,
            software: 30000,
            implementation: 15000
        },
        annualCosts: {
            licensing: 45000,
            maintenance: 0,
            support: 10000,
            personnel: 40000
        },
        // Legacy property names for backward compatibility
        initialHardware: 0,
        initialSoftware: 30000,
        initialImplementation: 15000,
        annualLicensing: 45000,
        annualMaintenance: 0,
        annualSupport: 10000,
        annualPersonnel: 40000
    }
};
