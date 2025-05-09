/**
 * FTE (Full-Time Equivalent) Cost Analysis Module
 * Calculates personnel time and cost savings for different NAC solutions
 */

class FTEAnalyzer {
  constructor() {
    this.hourlyRates = {
      networkAdmin: 65,
      securityAnalyst: 75,
      helpDeskTech: 40,
      complianceOfficer: 80
    };
    
    // Default FTE requirements per vendor (hours per month)
    this.defaultFTERequirements = {
      cisco: {
        networkAdmin: 32,
        securityAnalyst: 24,
        helpDeskTech: 80,
        complianceOfficer: 16
      },
      aruba: {
        networkAdmin: 28,
        securityAnalyst: 24,
        helpDeskTech: 72,
        complianceOfficer: 16
      },
      forescout: {
        networkAdmin: 32,
        securityAnalyst: 40,
        helpDeskTech: 60,
        complianceOfficer: 20
      },
      nps: {
        networkAdmin: 40,
        securityAnalyst: 16,
        helpDeskTech: 60,
        complianceOfficer: 16
      },
      fortinac: {
        networkAdmin: 28,
        securityAnalyst: 32,
        helpDeskTech: 60,
        complianceOfficer: 16
      },
      securew2: {
        networkAdmin: 24,
        securityAnalyst: 20,
        helpDeskTech: 60,
        complianceOfficer: 12
      },
      portnox: {
        networkAdmin: 8,
        securityAnalyst: 12,
        helpDeskTech: 40,
        complianceOfficer: 8
      }
    };
  }
  
  // Calculate FTE costs for a specific vendor and organization size
  calculateFTECosts(vendor, orgSize = 'medium', customHourlyRates = null) {
    if (!this.defaultFTERequirements[vendor]) {
      console.warn('No FTE requirements found for vendor:', vendor);
      return null;
    }
    
    // Use custom hourly rates if provided
    const rates = customHourlyRates || this.hourlyRates;
    
    // Scale FTE requirements based on organization size
    const sizeMultipliers = {
      small: 0.6,
      medium: 1.0,
      large: 1.8,
      enterprise: 3.0
    };
    
    const multiplier = sizeMultipliers[orgSize] || 1.0;
    
    // Calculate hours per role
    const fteHours = {};
    let totalHours = 0;
    let totalCost = 0;
    
    for (const role in this.defaultFTERequirements[vendor]) {
      const baseHours = this.defaultFTERequirements[vendor][role];
      const scaledHours = Math.round(baseHours * multiplier);
      const roleCost = scaledHours * rates[role];
      
      fteHours[role] = scaledHours;
      totalHours += scaledHours;
      totalCost += roleCost;
    }
    
    return {
      hoursPerRole: fteHours,
      hoursPerMonth: totalHours,
      costPerMonth: totalCost,
      costPerYear: totalCost * 12
    };
  }
  
  // Calculate FTE savings compared to a reference vendor (usually Portnox)
  calculateFTESavings(vendorResults, referenceVendor = 'portnox') {
    if (!vendorResults || !vendorResults[referenceVendor]) {
      console.warn('Missing vendor results or reference vendor data');
      return {};
    }
    
    const referenceData = vendorResults[referenceVendor];
    const savings = {};
    
    for (const vendor in vendorResults) {
      if (vendor === referenceVendor) continue;
      
      const vendorData = vendorResults[vendor];
      
      if (vendorData.fte && referenceData.fte) {
        const hoursSaved = vendorData.fte.hoursPerMonth - referenceData.fte.hoursPerMonth;
        const costSaved = vendorData.fte.costPerYear - referenceData.fte.costPerYear;
        const percentSaved = (costSaved / vendorData.fte.costPerYear * 100).toFixed(1);
        
        savings[vendor] = {
          hoursSavedPerMonth: hoursSaved,
          costSavedPerYear: costSaved,
          percentSaved: percentSaved
        };
      }
    }
    
    return savings;
  }
  
  // Generate FTE savings report
  generateFTESavingsReport(vendorResults, referenceVendor = 'portnox') {
    const savings = this.calculateFTESavings(vendorResults, referenceVendor);
    const refVendorName = window.vendorData && window.vendorData[referenceVendor] ? 
      window.vendorData[referenceVendor].name : referenceVendor;
    
    let report = `<div class="fte-savings-report">
      <h3>FTE Cost Savings with ${refVendorName}</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>Vendor</th>
            <th>Hours Saved (Monthly)</th>
            <th>Cost Saved (Yearly)</th>
            <th>Savings %</th>
          </tr>
        </thead>
        <tbody>`;
    
    for (const vendor in savings) {
      const vendorName = window.vendorData && window.vendorData[vendor] ? 
        window.vendorData[vendor].name : vendor;
      const data = savings[vendor];
      
      report += `<tr>
        <td>${vendorName}</td>
        <td>${data.hoursSavedPerMonth}</td>
        <td>${new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(data.costSavedPerYear)}</td>
        <td>${data.percentSaved}%</td>
      </tr>`;
    }
    
    report += `</tbody>
      </table>
    </div>`;
    
    return report;
  }
}

// Initialize FTE analyzer on window
window.fteAnalyzer = new FTEAnalyzer();

console.log('FTE Analyzer initialized and available as window.fteAnalyzer');
