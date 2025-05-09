/**
 * Enhanced Report Generator
 * Creates comprehensive PDF reports with TCO analysis, compliance insights,
 * and security impact assessments
 */
class EnhancedReportGenerator {
  constructor() {
    this.reportTypes = {
      executive: {
        title: 'Executive Summary',
        description: 'High-level overview of TCO analysis and business benefits'
      },
      financial: {
        title: 'Financial Analysis',
        description: 'Detailed cost breakdown and ROI analysis'
      },
      technical: {
        title: 'Technical Report',
        description: 'Implementation details and feature comparison'
      },
      compliance: {
        title: 'Compliance Report',
        description: 'Compliance impact and regulatory considerations'
      },
      security: {
        title: 'Security Impact Report',
        description: 'Security risk analysis and breach prevention benefits'
      },
      complete: {
        title: 'Complete NAC Assessment',
        description: 'Comprehensive analysis covering all aspects'
      }
    };
  }
  
  /**
   * Generate PDF report
   * @param {string} reportType - Type of report to generate
   * @param {object} calculationResults - Calculator results
   * @param {object} params - Report parameters
   * @returns {Promise} Promise that resolves when the report is generated
   */
  async generateReport(reportType, calculationResults, params = {}) {
    // Check if jsPDF is available
    if (!window.jspdf || !window.jspdf.jsPDF) {
      throw new Error('jsPDF library not available');
    }
    
    // Create new PDF document
    const jsPDF = window.jspdf.jsPDF;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });
    
    // Set up document properties
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const contentWidth = pageWidth - margin * 2;
    
    // Get report configuration
    const reportConfig = this.reportTypes[reportType] || this.reportTypes.complete;
    
    // Generate report content based on type
    switch (reportType) {
      case 'executive':
        await this._generateExecutiveReport(doc, calculationResults, params);
        break;
      case 'financial':
        await this._generateFinancialReport(doc, calculationResults, params);
        break;
      case 'technical':
        await this._generateTechnicalReport(doc, calculationResults, params);
        break;
      case 'compliance':
        await this._generateComplianceReport(doc, calculationResults, params);
        break;
      case 'security':
        await this._generateSecurityReport(doc, calculationResults, params);
        break;
      case 'complete':
      default:
        await this._generateCompleteReport(doc, calculationResults, params);
        break;
    }
    
    // Add footer to all pages
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      this._addFooter(doc, i, pageCount);
    }
    
    // Generate filename
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filename = `NAC_${reportConfig.title.replace(/\s+/g, '_')}_${timestamp}.pdf`;
    
    // Save document
    doc.save(filename);
    
    return filename;
  }
  
  /**
   * Generate executive report
   * @param {object} doc - jsPDF document
   * @param {object} results - Calculator results
   * @param {object} params - Report parameters
   */
  async _generateExecutiveReport(doc, results, params) {
    // Executive summary is focused on high-level metrics and business value
    
    // Add cover page
    this._addCoverPage(doc, 'Executive Summary', 'NAC Solution TCO Analysis');
    doc.addPage();
    
    // Get comparison data
    const comparison = results.comparison;
    if (!comparison) {
      throw new Error('Comparison data not available');
    }
    
    const currentVendor = results[comparison.vendorComparison.currentVendor];
    const portnox = results[comparison.vendorComparison.portnox];
    
    // Executive summary
    this._addHeading(doc, 'Executive Summary');
    
    let text = `This report summarizes the Total Cost of Ownership (TCO) analysis comparing ${currentVendor.vendor} with Portnox Cloud for a ${params.organizationSize} organization with ${params.deviceCount.toLocaleString()} devices over ${params.yearsToProject} years.`;
    this._addText(doc, text);
    
    // Key findings table
    this._addHeading(doc, 'Key Findings', 2);
    
    const tableData = [
      ['Metric', `${currentVendor.vendor}`, 'Portnox Cloud', 'Difference'],
      ['Total TCO', `$${this._formatNumber(currentVendor.totalTCO)}`, `$${this._formatNumber(portnox.totalTCO)}`, `$${this._formatNumber(comparison.costSavings)}`],
      ['Annual Operating Costs', `$${this._formatNumber(currentVendor.annualCosts.total)}`, `$${this._formatNumber(portnox.annualCosts.total)}`, `$${this._formatNumber(currentVendor.annualCosts.total - portnox.annualCosts.total)}`],
      ['Implementation Time', `${currentVendor.totalImplementationDays} days`, `${portnox.totalImplementationDays} days`, `${comparison.implementationReduction} days`],
      ['IT Resource Requirements', `${currentVendor.fteRequirements.total.toFixed(2)} FTE`, `${portnox.fteRequirements.total.toFixed(2)} FTE`, `${comparison.fteReduction.toFixed(2)} FTE`]
    ];
    
    this._addTable(doc, tableData);
    doc.addPage();
    
    // Financial highlights
    this._addHeading(doc, 'Financial Benefits');
    
    // ROI metrics
    if (comparison.roi) {
      const roiText = `Switching to Portnox Cloud provides an ROI of ${comparison.roi.threeYearROI.toFixed(0)}% over three years with a payback period of ${comparison.roi.paybackPeriod.toFixed(1)} years. The five-year ROI increases to ${comparison.roi.fiveYearROI.toFixed(0)}%.`;
      this._addText(doc, roiText);
    }
    
    // Cost savings breakdown
    text = `The total cost savings of $${this._formatNumber(comparison.costSavings)} (${comparison.savingsPercentage.toFixed(0)}%) over ${params.yearsToProject} years are achieved through:`;
    this._addText(doc, text);
    
    const savingsData = [
      ['Savings Category', 'Amount', 'Description'],
      ['Hardware Elimination', `$${this._formatNumber(comparison.infrastructureReduction)}`, `${comparison.infrastructurePercentage.toFixed(0)}% reduction in hardware costs`],
      ['Annual Maintenance', `$${this._formatNumber((currentVendor.annualCosts.annualMaintenance - portnox.annualCosts.annualMaintenance) * params.yearsToProject)}`, 'Reduced maintenance and support costs'],
      ['IT Staffing', `$${this._formatNumber((currentVendor.annualCosts.fteCosts - portnox.annualCosts.fteCosts) * params.yearsToProject)}`, `${comparison.ftePercentage.toFixed(0)}% reduction in IT resource requirements`],
      ['Downtime Reduction', `$${this._formatNumber((currentVendor.annualCosts.downtimeCost - portnox.annualCosts.downtimeCost) * params.yearsToProject)}`, 'Less business disruption from outages']
    ];
    
    this._addTable(doc, savingsData);
    
    // Add TCO comparison chart
    doc.addPage();
    this._addHeading(doc, 'TCO Comparison');
    
    // Implement chart image here
    // Note: This would require generating charts as images server-side
    // or using a client-side approach to generate and capture charts
    
    text = `The chart above illustrates the significant total cost difference between ${currentVendor.vendor} ($${this._formatNumber(currentVendor.totalTCO)}) and Portnox Cloud ($${this._formatNumber(portnox.totalTCO)}) over ${params.yearsToProject} years, representing a ${comparison.savingsPercentage.toFixed(0)}% reduction in TCO.`;
    this._addText(doc, text);
    
    // Strategic benefits
    this._addHeading(doc, 'Strategic Benefits', 2);
    
    const strategicBenefits = [
      'Accelerated time-to-value with 75% faster implementation',
      'Reduced operational overhead and IT staffing requirements',
      'Enhanced security posture with continuous compliance monitoring',
      'Greater scalability and flexibility for evolving business needs',
      'Elimination of hardware refresh cycles and upgrade windows',
      'Automatic updates with zero downtime'
    ];
    
    this._addBulletList(doc, strategicBenefits);
    
    // Recommendations
    doc.addPage();
    this._addHeading(doc, 'Recommendations');
    
    const recommendations = [
      `Transition from ${currentVendor.vendor} to Portnox Cloud to realize significant cost savings and operational benefits`,
      'Implement a phased migration approach to minimize disruption',
      'Establish clear success criteria for the migration project',
      'Develop comprehensive training plan for IT staff',
      'Create a communication plan for end users during the transition'
    ];
    
    this._addBulletList(doc, recommendations);
    
    // Next steps
    this._addHeading(doc, 'Next Steps', 2);
    
    const nextSteps = [
      'Schedule a detailed technical assessment',
      'Develop a migration plan based on your specific requirements',
      'Define success metrics for implementation',
      'Establish a project timeline and resource allocation',
      'Begin pilot implementation with non-critical segments'
    ];
    
    this._addBulletList(doc, nextSteps);
  }
  
  /**
   * Generate financial report
   * @param {object} doc - jsPDF document
   * @param {object} results - Calculator results
   * @param {object} params - Report parameters
   */
  async _generateFinancialReport(doc, results, params) {
    // Financial report focuses on detailed cost analysis and ROI
    
    // Add cover page
    this._addCoverPage(doc, 'Financial Analysis', 'NAC Solution TCO Assessment');
    doc.addPage();
    
    // Get comparison data
    const comparison = results.comparison;
    if (!comparison) {
      throw new Error('Comparison data not available');
    }
    
    const currentVendor = results[comparison.vendorComparison.currentVendor];
    const portnox = results[comparison.vendorComparison.portnox];
    
    // Financial overview
    this._addHeading(doc, 'Financial Analysis Overview');
    
    let text = `This report provides a detailed financial analysis comparing ${currentVendor.vendor} with Portnox Cloud for a ${params.organizationSize} organization with ${params.deviceCount.toLocaleString()} devices over ${params.yearsToProject} years. The analysis includes direct costs, indirect costs, and return on investment calculations.`;
    this._addText(doc, text);
    
    // Total cost comparison
    this._addHeading(doc, 'Total Cost Comparison', 2);
    
    const totalCostData = [
      ['Cost Category', `${currentVendor.vendor}`, 'Portnox Cloud', 'Savings'],
      ['Initial Costs', `$${this._formatNumber(currentVendor.initialCosts.total)}`, `$${this._formatNumber(portnox.initialCosts.total)}`, `$${this._formatNumber(currentVendor.initialCosts.total - portnox.initialCosts.total)}`],
      ['Annual Costs (per year)', `$${this._formatNumber(currentVendor.annualCosts.total)}`, `$${this._formatNumber(portnox.annualCosts.total)}`, `$${this._formatNumber(currentVendor.annualCosts.total - portnox.annualCosts.total)}`],
      [`Annual Costs (${params.yearsToProject} years)`, `$${this._formatNumber(currentVendor.annualCosts.total * params.yearsToProject)}`, `$${this._formatNumber(portnox.annualCosts.total * params.yearsToProject)}`, `$${this._formatNumber((currentVendor.annualCosts.total - portnox.annualCosts.total) * params.yearsToProject)}`],
      ['Migration Costs', `$0`, `$${this._formatNumber(portnox.migrationCosts)}`, `-$${this._formatNumber(portnox.migrationCosts)}`],
      ['Total TCO', `$${this._formatNumber(currentVendor.totalTCO)}`, `$${this._formatNumber(portnox.totalTCO)}`, `$${this._formatNumber(comparison.costSavings)}`]
    ];
    
    this._addTable(doc, totalCostData);
    doc.addPage();
    
    // Initial costs breakdown
    this._addHeading(doc, 'Initial Costs Breakdown');
    
    const initialCostsData = [
      ['Initial Cost Component', `${currentVendor.vendor}`, 'Portnox Cloud', 'Difference'],
      ['Hardware', `$${this._formatNumber(currentVendor.initialCosts.initialHardware)}`, `$${this._formatNumber(portnox.initialCosts.initialHardware)}`, `$${this._formatNumber(currentVendor.initialCosts.initialHardware - portnox.initialCosts.initialHardware)}`],
      ['Network Redesign', `$${this._formatNumber(currentVendor.initialCosts.networkRedesign)}`, `$${this._formatNumber(portnox.initialCosts.networkRedesign)}`, `$${this._formatNumber(currentVendor.initialCosts.networkRedesign - portnox.initialCosts.networkRedesign)}`],
      ['Implementation', `$${this._formatNumber(currentVendor.initialCosts.implementation)}`, `$${this._formatNumber(portnox.initialCosts.implementation)}`, `$${this._formatNumber(currentVendor.initialCosts.implementation - portnox.initialCosts.implementation)}`],
      ['Training', `$${this._formatNumber(currentVendor.initialCosts.training)}`, `$${this._formatNumber(portnox.initialCosts.training)}`, `$${this._formatNumber(currentVendor.initialCosts.training - portnox.initialCosts.training)}`],
      ['Migration', `$0`, `$${this._formatNumber(portnox.migrationCosts)}`, `-$${this._formatNumber(portnox.migrationCosts)}`],
      ['Total Initial Investment', `$${this._formatNumber(currentVendor.initialCosts.total)}`, `$${this._formatNumber(portnox.initialCosts.total + portnox.migrationCosts)}`, `$${this._formatNumber((currentVendor.initialCosts.total) - (portnox.initialCosts.total + portnox.migrationCosts))}`]
    ];
    
    this._addTable(doc, initialCostsData);
    
    // Annual costs breakdown
    this._addHeading(doc, 'Annual Costs Breakdown');
    
    const annualCostsData = [
      ['Annual Cost Component', `${currentVendor.vendor}`, 'Portnox Cloud', 'Difference'],
      ['Maintenance', `${this._formatNumber(currentVendor.annualCosts.annualMaintenance)}`, `${this._formatNumber(portnox.annualCosts.annualMaintenance)}`, `${this._formatNumber(currentVendor.annualCosts.annualMaintenance - portnox.annualCosts.annualMaintenance)}`],
      ['Licensing', `${this._formatNumber(currentVendor.annualCosts.annualLicensing)}`, `${this._formatNumber(portnox.annualCosts.annualLicensing)}`, `${this._formatNumber(currentVendor.annualCosts.annualLicensing - portnox.annualCosts.annualLicensing)}`],
      ['Downtime Costs', `${this._formatNumber(currentVendor.annualCosts.downtimeCost)}`, `${this._formatNumber(portnox.annualCosts.downtimeCost)}`, `${this._formatNumber(currentVendor.annualCosts.downtimeCost - portnox.annualCosts.downtimeCost)}`],
      ['IT Personnel', `${this._formatNumber(currentVendor.annualCosts.fteCosts)}`, `${this._formatNumber(portnox.annualCosts.fteCosts)}`, `${this._formatNumber(currentVendor.annualCosts.fteCosts - portnox.annualCosts.fteCosts)}`],
      ['Total Annual Costs', `${this._formatNumber(currentVendor.annualCosts.total)}`, `${this._formatNumber(portnox.annualCosts.total)}`, `${this._formatNumber(currentVendor.annualCosts.total - portnox.annualCosts.total)}`]
    ];
    
    this._addTable(doc, annualCostsData);
    doc.addPage();
    
    // Cumulative costs
    this._addHeading(doc, 'Cumulative Cost Analysis');
    
    text = `The following table shows the cumulative costs for both solutions over ${params.yearsToProject} years, including initial investment and ongoing annual costs.`;
    this._addText(doc, text);
    
    const cumulativeData = [
      ['Year', `${currentVendor.vendor}`, 'Portnox Cloud', 'Annual Savings', 'Cumulative Savings']
    ];
    
    let currentVendorCumulative = currentVendor.initialCosts.total;
    let portnoxCumulative = portnox.initialCosts.total + portnox.migrationCosts;
    let cumulativeSavings = currentVendorCumulative - portnoxCumulative;
    
    cumulativeData.push([
      'Initial Investment',
      `${this._formatNumber(currentVendorCumulative)}`,
      `${this._formatNumber(portnoxCumulative)}`,
      `${this._formatNumber(currentVendorCumulative - portnoxCumulative)}`,
      `${this._formatNumber(cumulativeSavings)}`
    ]);
    
    for (let year = 1; year <= params.yearsToProject; year++) {
      currentVendorCumulative += currentVendor.annualCosts.total;
      portnoxCumulative += portnox.annualCosts.total;
      const annualSavings = currentVendor.annualCosts.total - portnox.annualCosts.total;
      cumulativeSavings += annualSavings;
      
      cumulativeData.push([
        `Year ${year}`,
        `${this._formatNumber(currentVendorCumulative)}`,
        `${this._formatNumber(portnoxCumulative)}`,
        `${this._formatNumber(annualSavings)}`,
        `${this._formatNumber(cumulativeSavings)}`
      ]);
    }
    
    this._addTable(doc, cumulativeData);
    doc.addPage();
    
    // ROI analysis
    this._addHeading(doc, 'Return on Investment (ROI) Analysis');
    
    if (comparison.roi) {
      const roiData = [
        ['ROI Metric', 'Value', 'Description'],
        ['Initial Investment', `${this._formatNumber(comparison.roi.investment)}`, 'Portnox implementation costs plus migration'],
        ['Annual Savings', `${this._formatNumber(comparison.roi.yearlySavings)}`, 'Recurring annual savings with Portnox'],
        ['Payback Period', `${comparison.roi.paybackPeriod.toFixed(1)} years`, 'Time to recoup initial investment'],
        ['3-Year ROI', `${comparison.roi.threeYearROI.toFixed(1)}%`, 'Return on investment over 3 years'],
        ['5-Year ROI', `${comparison.roi.fiveYearROI.toFixed(1)}%`, 'Return on investment over 5 years'],
        ['Net Present Value', `${this._formatNumber(comparison.roi.npv)}`, 'NPV at 10% discount rate']
      ];
      
      this._addTable(doc, roiData);
      
      // ROI explanation
      text = `The ROI analysis above demonstrates that the initial investment in Portnox Cloud will be recouped in ${comparison.roi.paybackPeriod.toFixed(1)} years, with significant positive returns thereafter. The 3-year ROI of ${comparison.roi.threeYearROI.toFixed(1)}% indicates a strong financial case for migration.`;
      this._addText(doc, text);
    }
    
    // IT resource analysis
    this._addHeading(doc, 'IT Resource Analysis', 2);
    
    const fteData = [
      ['Role', `${currentVendor.vendor}`, 'Portnox Cloud', 'Reduction'],
      ['Network Admin', `${currentVendor.fteRequirements.networkAdmin.toFixed(2)} FTE`, `${portnox.fteRequirements.networkAdmin.toFixed(2)} FTE`, `${(currentVendor.fteRequirements.networkAdmin - portnox.fteRequirements.networkAdmin).toFixed(2)} FTE`],
      ['Security Admin', `${currentVendor.fteRequirements.securityAdmin.toFixed(2)} FTE`, `${portnox.fteRequirements.securityAdmin.toFixed(2)} FTE`, `${(currentVendor.fteRequirements.securityAdmin - portnox.fteRequirements.securityAdmin).toFixed(2)} FTE`],
      ['System Admin', `${currentVendor.fteRequirements.systemAdmin.toFixed(2)} FTE`, `${portnox.fteRequirements.systemAdmin.toFixed(2)} FTE`, `${(currentVendor.fteRequirements.systemAdmin - portnox.fteRequirements.systemAdmin).toFixed(2)} FTE`],
      ['Help Desk', `${currentVendor.fteRequirements.helpDesk.toFixed(2)} FTE`, `${portnox.fteRequirements.helpDesk.toFixed(2)} FTE`, `${(currentVendor.fteRequirements.helpDesk - portnox.fteRequirements.helpDesk).toFixed(2)} FTE`],
      ['Total', `${currentVendor.fteRequirements.total.toFixed(2)} FTE`, `${portnox.fteRequirements.total.toFixed(2)} FTE`, `${comparison.fteReduction.toFixed(2)} FTE`]
    ];
    
    this._addTable(doc, fteData);
    
    // Resource cost explanation
    text = `The IT resource reduction of ${comparison.fteReduction.toFixed(2)} FTE represents annual cost savings of ${this._formatNumber(currentVendor.annualCosts.fteCosts - portnox.annualCosts.fteCosts)}. This staff time can be reallocated to higher-value strategic initiatives rather than NAC maintenance and administration.`;
    this._addText(doc, text);
  }
  
  /**
   * Generate technical report
   * @param {object} doc - jsPDF document
   * @param {object} results - Calculator results
   * @param {object} params - Report parameters
   */
  async _generateTechnicalReport(doc, results, params) {
    // Technical report focuses on implementation details and feature comparison
    
    // Add cover page
    this._addCoverPage(doc, 'Technical Report', 'NAC Solution Technical Comparison');
    doc.addPage();
    
    // Get comparison data
    const comparison = results.comparison;
    if (!comparison) {
      throw new Error('Comparison data not available');
    }
    
    const currentVendor = results[comparison.vendorComparison.currentVendor];
    const portnox = results[comparison.vendorComparison.portnox];
    
    // Technical overview
    this._addHeading(doc, 'Technical Overview');
    
    let text = `This report provides a detailed technical comparison between ${currentVendor.vendor} and Portnox Cloud, including solution architecture, implementation requirements, feature analysis, and migration considerations.`;
    this._addText(doc, text);
    
    // Solution architecture comparison
    this._addHeading(doc, 'Solution Architecture Comparison', 2);
    
    const architectureData = [
      ['Architecture Aspect', `${currentVendor.vendor}`, 'Portnox Cloud'],
      ['Deployment Model', `${currentVendor.cloudBased ? 'Cloud-based' : 'On-premises'}`, 'Cloud-native'],
      ['Hardware Requirements', `${currentVendor.cloudBased ? 'Minimal' : 'Significant'}`, 'None'],
      ['Infrastructure Footprint', `${currentVendor.cloudBased ? 'Low' : 'High'}`, 'Zero'],
      ['Scaling Approach', `${currentVendor.cloudBased ? 'Elastic with limitations' : 'Additional hardware required'}`, 'Fully elastic'],
      ['Updates and Maintenance', `${currentVendor.cloudBased ? 'Managed with scheduled downtime' : 'Manual with maintenance windows'}`, 'Automatic with zero downtime']
    ];
    
    this._addTable(doc, architectureData);
    doc.addPage();
    
    // Feature comparison
    this._addHeading(doc, 'Feature Comparison');
    
    const features = [
      'Device Visibility',
      'Policy Enforcement',
      'Guest Management',
      'Reporting',
      'Third-Party Integration',
      'Compliance',
      'Scalability',
      'Ease of Management'
    ];
    
    if (comparison.featureComparison) {
      const featureData = [
        ['Feature', `${currentVendor.vendor}`, 'Portnox Cloud', 'Difference']
      ];
      
      features.forEach(feature => {
        const camelCaseFeature = feature.replace(/\s+/g, '').replace(/^[A-Z]/, c => c.toLowerCase());
        
        if (comparison.featureComparison[camelCaseFeature]) {
          const compData = comparison.featureComparison[camelCaseFeature];
          featureData.push([
            feature,
            `${compData.currentVendor.toFixed(1)}/10`,
            `${compData.portnox.toFixed(1)}/10`,
            compData.difference.toFixed(1)
          ]);
        }
      });
      
      this._addTable(doc, featureData);
      
      // Feature analysis
      text = `The feature comparison highlights Portnox Cloud's strengths in scalability (${comparison.featureComparison.scalability?.portnox.toFixed(1)}/10) and ease of management (${comparison.featureComparison.easOfManagement?.portnox.toFixed(1)}/10). ${currentVendor.vendor} offers stronger capabilities in ${this._getStrongestFeature(currentVendor.features)}.`;
      this._addText(doc, text);
    }
    
    // Implementation timeline
    this._addHeading(doc, 'Implementation Timeline', 2);
    
    text = `The implementation timeline shows a significant difference between the solutions, with Portnox Cloud requiring ${portnox.totalImplementationDays} days compared to ${currentVendor.totalImplementationDays} days for ${currentVendor.vendor}, a ${comparison.implementationPercentage.toFixed(0)}% reduction.`;
    this._addText(doc, text);
    
    const timelineData = [
      ['Implementation Phase', `${currentVendor.vendor} (days)`, 'Portnox Cloud (days)', 'Time Savings (days)']
    ];
    
    // Add each implementation phase
    Object.keys(currentVendor.implementationTimeline).forEach(phase => {
      if (phase !== 'total' && portnox.implementationTimeline[phase] !== undefined) {
        const phaseName = phase.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
        const currentDays = currentVendor.implementationTimeline[phase];
        const portnoxDays = portnox.implementationTimeline[phase];
        const savings = currentDays - portnoxDays;
        
        timelineData.push([
          phaseName,
          currentDays,
          portnoxDays,
          savings
        ]);
      }
    });
    
    // Add total
    timelineData.push([
      'Total Implementation',
      currentVendor.totalImplementationDays,
      portnox.totalImplementationDays,
      comparison.implementationReduction
    ]);
    
    this._addTable(doc, timelineData);
    doc.addPage();
    
    // Migration considerations
    this._addHeading(doc, 'Migration Considerations');
    
    // Migration phases
    const migrationPhases = [
      {
        phase: 'Assessment & Planning',
        description: 'Evaluate existing deployment, establish migration success criteria, and develop a comprehensive migration plan.',
        duration: '1-2 weeks'
      },
      {
        phase: 'Pilot Deployment',
        description: 'Implement Portnox Cloud in a controlled environment to validate functionality and train administrators.',
        duration: '1-2 weeks'
      },
      {
        phase: 'Phased Rollout',
        description: 'Deploy to non-critical segments first, then gradually expand to more sensitive areas based on pilot learnings.',
        duration: '2-4 weeks'
      },
      {
        phase: 'Full Adoption & Optimization',
        description: 'Complete organization-wide deployment, refine policies, and optimize configurations for maximum effectiveness.',
        duration: '1-2 weeks'
      }
    ];
    
    migrationPhases.forEach(phase => {
      this._addHeading(doc, phase.phase, 3);
      text = `${phase.description} Estimated duration: ${phase.duration}.`;
      this._addText(doc, text);
    });
    
    // Technical risks and mitigations
    this._addHeading(doc, 'Technical Risks and Mitigations', 2);
    
    const riskData = [
      ['Risk', 'Mitigation Strategy'],
      ['Policy translation errors', 'Comprehensive policy audit and testing in pilot phase'],
      ['Authentication disruption', 'Overlapping deployment with fallback authentication'],
      ['Device visibility gaps', 'Parallel monitoring during transition phase'],
      ['Integration challenges', 'Pre-migration testing of all critical integrations'],
      ['User access interruptions', 'Gradual rollout with enhanced help desk support']
    ];
    
    this._addTable(doc, riskData);
  }
  
  /**
   * Generate compliance report
   * @param {object} doc - jsPDF document
   * @param {object} results - Calculator results
   * @param {object} params - Report parameters
   */
  async _generateComplianceReport(doc, results, params) {
    // Compliance report focuses on regulatory requirements and compliance benefits
    
    // Add cover page
    this._addCoverPage(doc, 'Compliance Impact Analysis', 'NAC Solution Compliance Assessment');
    doc.addPage();
    
    // Get comparison data
    const comparison = results.comparison;
    if (!comparison) {
      throw new Error('Comparison data not available');
    }
    
    const currentVendor = results[comparison.vendorComparison.currentVendor];
    const portnox = results[comparison.vendorComparison.portnox];
    
    // Compliance overview
    this._addHeading(doc, 'Compliance Impact Overview');
    
    let text = `This report analyzes the compliance implications of migrating from ${currentVendor.vendor} to Portnox Cloud, focusing on regulatory requirements, compliance capabilities, and risk reduction.`;
    this._addText(doc, text);
    
    // Check if compliance analyzer is available
    if (!window.complianceAnalyzer) {
      text = 'Detailed compliance analysis not available. Please enable the compliance analyzer module.';
      this._addText(doc, text);
    } else {
      // Regulatory frameworks
      this._addHeading(doc, 'Regulatory Framework Analysis', 2);
      
      // Get industry data
      const industryKey = params.industry || 'general';
      const industryData = window.industryData[industryKey] || {};
      
      // Get relevant compliance frameworks
      const frameworks = industryData.complianceRequirements || ['hipaa', 'pci', 'gdpr', 'cmmc'];
      
      text = `The following analysis examines key compliance frameworks relevant to ${industryData.name || 'your industry'}: ${frameworks.join(', ')}.`;
      this._addText(doc, text);
      
      // Analyze each framework
      for (const framework of frameworks.slice(0, 3)) { // Limit to first 3 frameworks for brevity
        if (window.complianceCostData[framework.toLowerCase()]) {
          // Get framework data
          const frameworkData = window.complianceCostData[framework.toLowerCase()];
          
          this._addHeading(doc, frameworkData.name, 3);
          text = frameworkData.description;
          this._addText(doc, text);
          
          // Analyze compliance for both vendors
          try {
            const currentVendorCompliance = window.complianceAnalyzer.analyzeVendorCompliance(
              currentVendor.vendorId, 
              framework.toLowerCase(), 
              { industry: industryKey }
            );
            
            const portnoxCompliance = window.complianceAnalyzer.analyzeVendorCompliance(
              'portnox', 
              framework.toLowerCase(), 
              { industry: industryKey }
            );
            
            // Create compliance comparison table
            const complianceData = [
              ['Compliance Metric', `${currentVendor.vendor}`, 'Portnox Cloud', 'Difference'],
              ['Overall Compliance Score', `${currentVendorCompliance.complianceScore}%`, `${portnoxCompliance.complianceScore}%`, `${portnoxCompliance.complianceScore - currentVendorCompliance.complianceScore}%`],
              ['Compliance Gaps', `${currentVendorCompliance.gapAnalysis.length}`, `${portnoxCompliance.gapAnalysis.length}`, `${currentVendorCompliance.gapAnalysis.length - portnoxCompliance.gapAnalysis.length}`]
            ];
            
            this._addTable(doc, complianceData);
            
            // Show key gap analysis
            if (currentVendorCompliance.gapAnalysis.length > 0) {
              this._addHeading(doc, `${currentVendor.vendor} Compliance Gaps`, 4);
              
              const gapData = [
                ['Requirement', 'Severity', 'Impact']
              ];
              
              // Show up to 3 critical gaps
              currentVendorCompliance.gapAnalysis
                .filter(gap => gap.severity === 'High')
                .slice(0, 3)
                .forEach(gap => {
                  gapData.push([
                    gap.requirement,
                    gap.severity,
                    gap.impact.substring(0, 100) + (gap.impact.length > 100 ? '...' : '')
                  ]);
                });
              
              this._addTable(doc, gapData);
            }
            
            // Compliance recommendations
            if (currentVendorCompliance.recommendations && currentVendorCompliance.recommendations.length > 0) {
              doc.addPage();
              this._addHeading(doc, `${frameworkData.name} Compliance Recommendations`, 3);
              
              currentVendorCompliance.recommendations.slice(0, 3).forEach((rec, index) => {
                this._addHeading(doc, `Recommendation ${index + 1}`, 4);
                text = `For requirement: ${rec.forGap}\n\n${rec.recommendation}`;
                this._addText(doc, text);
              });
            }
          } catch (error) {
            text = `Unable to analyze compliance for ${frameworkData.name}. ${error.message}`;
            this._addText(doc, text);
          }
        }
      }
      
      doc.addPage();
      
      // Compliance benefit summary
      this._addHeading(doc, 'Compliance Benefits Summary');
      
      const complianceBenefits = [
        {
          benefit: 'Automated Compliance Monitoring',
          description: 'Portnox Cloud provides continuous monitoring of compliance posture, automatically detecting and alerting on potential violations.',
          impact: 'Reduces compliance monitoring costs by 40-60% compared to manual processes.'
        },
        {
          benefit: 'Streamlined Audit Processes',
          description: 'Comprehensive audit logs and reporting capabilities simplify evidence collection for regulatory audits.',
          impact: 'Reduces audit preparation time by 30-50% and improves audit outcomes.'
        },
        {
          benefit: 'Rapid Adaptation to New Requirements',
          description: 'Cloud-based architecture enables rapid updates to address evolving compliance requirements.',
          impact: 'Typical implementation time for new compliance controls reduced from 2-4 months to 2-4 weeks.'
        },
        {
          benefit: 'Enhanced Policy Enforcement',
          description: 'Consistent policy enforcement across all network access points ensures compliance with access control requirements.',
          impact: 'Significantly reduces risk of non-compliance penalties and security breaches.'
        }
      ];
      
      complianceBenefits.forEach(benefit => {
        this._addHeading(doc, benefit.benefit, 3);
        text = `${benefit.description}\n\nImpact: ${benefit.impact}`;
        this._addText(doc, text);
      });
      
      // Compliance-specific ROI
      this._addHeading(doc, 'Compliance-Related Cost Savings', 2);
      
      const complianceSavingsData = [
        ['Cost Category', 'Annual Savings', 'Description'],
        ['Compliance Monitoring', '$25,000 - $75,000', 'Reduced staff time for manual compliance checks'],
        ['Audit Preparation', '$15,000 - $40,000', 'Streamlined evidence collection and reporting'],
        ['Remediation Activities', '$30,000 - $90,000', 'Reduced effort to address compliance gaps'],
        ['Potential Penalty Reduction', 'Varies by industry', 'Lower risk of non-compliance penalties']
      ];
      
      this._addTable(doc, complianceSavingsData);
    }
  }
  
  /**
   * Generate security report
   * @param {object} doc - jsPDF document
   * @param {object} results - Calculator results
   * @param {object} params - Report parameters
   */
  async _generateSecurityReport(doc, results, params) {
    // Security report focuses on security benefits and breach prevention
    
    // Add cover page
    this._addCoverPage(doc, 'Security Impact Analysis', 'NAC Solution Security Assessment');
    doc.addPage();
    
    // Get comparison data
    const comparison = results.comparison;
    if (!comparison) {
      throw new Error('Comparison data not available');
    }
    
    const currentVendor = results[comparison.vendorComparison.currentVendor];
    const portnox = results[comparison.vendorComparison.portnox];
    
    // Security overview
    this._addHeading(doc, 'Security Impact Overview');
    
    let text = `This report analyzes the security implications of migrating from ${currentVendor.vendor} to Portnox Cloud, focusing on risk reduction, breach prevention capabilities, and security operation improvements.`;
    this._addText(doc, text);
    
    // Check if breach analyzer is available
    if (!window.breachImpactCalculator) {
      text = 'Detailed breach impact analysis not available. Please enable the breach impact calculator module.';
      this._addText(doc, text);
    } else {
      // Security risk analysis
      this._addHeading(doc, 'Security Risk Analysis', 2);
      
      // Get industry data
      const industryKey = params.industry || 'general';
      
      // Calculate breach impact
      try {
        const breachAnalysis = window.breachImpactCalculator.calculateBreachImpact({
          companySize: params.organizationSize,
          industry: industryKey,
          dataRecords: params.deviceCount * 10, // Estimate 10 records per device
          yearsToProject: params.yearsToProject
        });
        
        // Add breach impact summary
        text = `Based on industry data, a security breach for a ${params.organizationSize} organization in the ${breachAnalysis.industryData.name || 'general'} industry could result in a total impact of ${this._formatNumber(breachAnalysis.baseImpact.breachCost)}. With NAC, this risk can be significantly reduced.`;
        this._addText(doc, text);
        
        // Risk comparison table
        const riskData = [
          ['Risk Metric', 'Without NAC', 'With NAC', 'Reduction'],
          ['Breach Probability', `${(breachAnalysis.baseImpact.annualProbability * 100).toFixed(1)}%`, `${((breachAnalysis.baseImpact.annualProbability * (1 - 0.35)) * 100).toFixed(1)}%`, '35%'],
          ['Potential Breach Cost', `${this._formatNumber(breachAnalysis.withoutNAC.breachCost)}`, `${this._formatNumber(breachAnalysis.withNAC.breachCost)}`, `${this._formatNumber(breachAnalysis.withoutNAC.breachCost - breachAnalysis.withNAC.breachCost)}`],
          ['Annualized Risk', `${this._formatNumber(breachAnalysis.withoutNAC.annualRisk)}`, `${this._formatNumber(breachAnalysis.withNAC.annualRisk)}`, `${this._formatNumber(breachAnalysis.withoutNAC.annualRisk - breachAnalysis.withNAC.annualRisk)}`],
          ['Breach Scope', '100%', `${(breachAnalysis.withNAC.breachScope * 100).toFixed(0)}%`, `${((1 - breachAnalysis.withNAC.breachScope) * 100).toFixed(0)}%`],
          ['Response Time (hours)', `${breachAnalysis.withoutNAC.responseTime.toFixed(0)}`, `${breachAnalysis.withNAC.responseTime.toFixed(0)}`, `${(breachAnalysis.withoutNAC.responseTime - breachAnalysis.withNAC.responseTime).toFixed(0)}`]
        ];
        
        this._addTable(doc, riskData);
        
        // Projected risk over time
        this._addHeading(doc, 'Projected Security Risk Over Time', 3);
        
        const projectionData = [
          ['Time Period', 'Risk Without NAC', 'Risk With NAC', 'Risk Reduction']
        ];
        
        // Calculate for each year
        for (let year = 1; year <= params.yearsToProject; year++) {
          const withoutNACRisk = breachAnalysis.withoutNAC.annualRisk * year;
          const withNACRisk = breachAnalysis.withNAC.annualRisk * year;
          const reduction = withoutNACRisk - withNACRisk;
          
          projectionData.push([
            `Year ${year}`,
            `${this._formatNumber(withoutNACRisk)}`,
            `${this._formatNumber(withNACRisk)}`,
            `${this._formatNumber(reduction)}`
          ]);
        }
        
        this._addTable(doc, projectionData);
        doc.addPage();
        
        // Security improvement analysis
        this._addHeading(doc, 'Security Capabilities Comparison');
        
        // Identify risks and mitigations
        if (breachAnalysis.withoutNAC.risksAndVulnerabilities && breachAnalysis.withNAC.mitigations) {
          const risksData = [
            ['Security Category', 'Risks Without NAC', 'Mitigations With NAC']
          ];
          
          // Combine risks and mitigations by category
          const categories = new Set();
          breachAnalysis.withoutNAC.risksAndVulnerabilities.forEach(rv => categories.add(rv.category));
          breachAnalysis.withNAC.mitigations.forEach(m => categories.add(m.category));
          
          // For each category, show risks and mitigations
          Array.from(categories).slice(0, 4).forEach(category => {
            const risks = breachAnalysis.withoutNAC.risksAndVulnerabilities
              .find(rv => rv.category === category)?.risks.join('\n\n') || '';
            
            const mitigations = breachAnalysis.withNAC.mitigations
              .find(m => m.category === category)?.mitigations.join('\n\n') || '';
            
            risksData.push([category, risks, mitigations]);
          });
          
          this._addTable(doc, risksData);
        }
        
        // Add insights
        if (breachAnalysis.insights) {
          doc.addPage();
          this._addHeading(doc, 'Key Security Insights');
          
          breachAnalysis.insights.forEach(insight => {
            this._addHeading(doc, insight.category, 3);
            text = insight.insight;
            this._addText(doc, text);
          });
        }
        
        // Add recommendations
        if (breachAnalysis.recommendations) {
          this._addHeading(doc, 'Security Recommendations', 2);
          
          const recData = [
            ['Priority', 'Recommendation', 'Impact']
          ];
          
          breachAnalysis.recommendations.forEach(rec => {
            recData.push([
              rec.priority,
              rec.title + ': ' + rec.description,
              rec.estimatedImpact
            ]);
          });
          
          this._addTable(doc, recData);
        }
      } catch (error) {
        text = `Unable to analyze breach impact. ${error.message}`;
        this._addText(doc, text);
      }
    }
    
    doc.addPage();
    
    // Real-world security case studies
    this._addHeading(doc, 'Security Breach Case Studies');
    
    const caseStudies = [
      {
        title: 'Major Healthcare Data Breach',
        description: 'A healthcare organization experienced a significant data breach affecting 9.3 million patient records due to inadequate network segmentation and access controls.',
        impact: 'The organization faced a $5.1 million regulatory settlement plus additional costs for notification, remediation, and reputational damage.',
        prevention: 'Proper NAC implementation would have contained the breach through network segmentation and prevented lateral movement within the network.'
      },
      {
        title: 'Critical Infrastructure Ransomware Attack',
        description: 'A critical infrastructure provider was compromised via an inactive but enabled VPN account without multi-factor authentication.',
        impact: 'The attack resulted in a six-day operational shutdown affecting significant portions of the supply chain, with millions in ransom and recovery costs.',
        prevention: 'NAC with strong authentication policies and continuous monitoring would have prevented the initial compromise and limited attack progression.'
      },
      {
        title: 'Retail Point-of-Sale Breach',
        description: 'A retailer experienced a breach through compromised vendor credentials, allowing attackers to move laterally to point-of-sale systems.',
        impact: 'The breach affected millions of payment cards, resulting in over $200 million in direct expenses and settlements.',
        prevention: 'NAC would have enforced strict vendor access controls and prevented lateral movement to sensitive systems.'
      }
    ];
    
    caseStudies.forEach(cs => {
      this._addHeading(doc, cs.title, 3);
      text = `${cs.description}\n\nImpact: ${cs.impact}\n\nPrevention: ${cs.prevention}`;
      this._addText(doc, text);
    });
    
    // Zero Trust enablement
    this._addHeading(doc, 'Zero Trust Security Enablement', 2);
    
    text = 'Implementing Portnox Cloud facilitates a Zero Trust security approach by enforcing the principle of "never trust, always verify" at the network access layer. Key Zero Trust benefits include:';
    this._addText(doc, text);
    
    const ztBenefits = [
      'Continuous verification of device trust and security posture',
      'Dynamic adjustment of access rights based on contextual factors',
      'Microsegmentation to limit lateral movement',
      'Least privilege access enforcement',
      'Comprehensive visibility into all connected devices'
    ];
    
    this._addBulletList(doc, ztBenefits);
  }
  
  /**
   * Generate complete report
   * @param {object} doc - jsPDF document
   * @param {object} results - Calculator results
   * @param {object} params - Report parameters
   */
  async _generateCompleteReport(doc, results, params) {
    // Complete report includes sections from all report types
    
    // Add cover page
    this._addCoverPage(doc, 'Complete NAC Assessment', 'Comprehensive NAC Solution Analysis');
    doc.addPage();
    
    // Table of contents
    this._addHeading(doc, 'Table of Contents');
    
    const tocItems = [
      { title: 'Executive Summary', page: 3 },
      { title: 'Financial Analysis', page: 6 },
      { title: 'Technical Comparison', page: 12 },
      { title: 'Implementation & Migration', page: 16 },
      { title: 'Security Impact Analysis', page: 20 },
      { title: 'Compliance Assessment', page: 25 },
      { title: 'Recommendations & Next Steps', page: 29 }
    ];
    
    tocItems.forEach(item => {
      doc.text(`${item.title}`, 60, doc._y);
      doc.text(`${item.page}`, 400, doc._y);
      doc._y += 20;
    });
    
    doc.addPage();
    
    // Add sections from each report type
    // Executive section
    await this._generateExecutiveReport(doc, results, params);
    
    // Financial section
    doc.addPage();
    await this._generateFinancialReport(doc, results, params);
    
    // Technical section
    doc.addPage();
    await this._generateTechnicalReport(doc, results, params);
    
    // Security section
    doc.addPage();
    await this._generateSecurityReport(doc, results, params);
    
    // Compliance section
    doc.addPage();
    await this._generateComplianceReport(doc, results, params);
  }
  
  /**
   * Add cover page to document
   * @param {object} doc - jsPDF document
   * @param {string} title - Report title
   * @param {string} subtitle - Report subtitle
   */
  _addCoverPage(doc, title, subtitle) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Add background color
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Add title
    doc.setFontSize(28);
    doc.setTextColor(27, 103, 178); // Portnox blue
    doc.text(title, pageWidth / 2, pageHeight / 3, { align: 'center' });
    
    // Add subtitle
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(subtitle, pageWidth / 2, pageHeight / 3 + 30, { align: 'center' });
    
    // Add date
    const date = new Date().toLocaleDateString();
    doc.setFontSize(12);
    doc.text(`Generated on ${date}`, pageWidth / 2, pageHeight / 3 + 60, { align: 'center' });
    
    // Add Portnox logo placeholder
    doc.setFillColor(27, 103, 178); // Portnox blue
    doc.rect(pageWidth / 2 - 50, pageHeight - 120, 100, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Portnox', pageWidth / 2, pageHeight - 95, { align: 'center' });
  }
  
  /**
   * Add heading to document
   * @param {object} doc - jsPDF document
   * @param {string} text - Heading text
   * @param {number} level - Heading level (1-4)
   */
  _addHeading(doc, text, level = 1) {
    // Set font size based on heading level
    const fontSizes = {
      1: 18,
      2: 16,
      3: 14,
      4: 12
    };
    
    const fontSize = fontSizes[level] || 16;
    
    // Add spacing before heading
    doc._y += 15;
    
    // Add heading
    doc.setFontSize(fontSize);
    doc.setFont(undefined, level <= 2 ? 'bold' : 'normal');
    doc.text(text, 40, doc._y);
    
    // Add spacing after heading
    doc._y += 10;
    
    // Add underline for level 1 and 2 headings
    if (level <= 2) {
      const textWidth = doc.getStringUnitWidth(text) * fontSize / doc.internal.scaleFactor;
      doc.setDrawColor(27, 103, 178); // Portnox blue
      doc.line(40, doc._y - 5, 40 + textWidth + 10, doc._y - 5);
      doc._y += 5;
    }
  }
  
  /**
   * Add text to document
   * @param {object} doc - jsPDF document
   * @param {string} text - Text content
   */
  _addText(doc, text) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    const contentWidth = pageWidth - margin * 2;
    
    // Set font size for body text
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    
    // Split text into lines
    const lines = doc.splitTextToSize(text, contentWidth);
    
    // Check if text will overflow page
    const lineHeight = doc.getLineHeight() / doc.internal.scaleFactor;
    const totalHeight = lines.length * lineHeight;
    
    if (doc._y + totalHeight > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      doc._y = margin;
    }
    
    // Add text
    doc.text(lines, margin, doc._y);
    
    // Update y position
    doc._y += totalHeight + 10;
  }
  
  /**
   * Add table to document
   * @param {object} doc - jsPDF document
   * @param {array} data - Table data (array of arrays)
   */
  _addTable(doc, data) {
    // Check if jspdf-autotable is available
    if (!doc.autoTable) {
      throw new Error('jspdf-autotable plugin not available');
    }
    
    // Get current position
    const startY = doc._y;
    
    // Add table
    doc.autoTable({
      head: [data[0]],
      body: data.slice(1),
      startY: startY,
      styles: {
        fontSize: 10
      },
      headStyles: {
        fillColor: [27, 103, 178], // Portnox blue
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      margin: { left: 40, right: 40 }
    });
    
    // Update y position
    doc._y = doc.lastAutoTable.finalY + 10;
  }
  
  /**
   * Add bullet list to document
   * @param {object} doc - jsPDF document
   * @param {array} items - List items
   */
  _addBulletList(doc, items) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    const contentWidth = pageWidth - margin * 2 - 10; // Adjust for bullet
    
    // Set font size for body text
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    
    // Add each item
    items.forEach(item => {
      // Split item text into lines
      const lines = doc.splitTextToSize(item, contentWidth);
      
      // Check if item will overflow page
      const lineHeight = doc.getLineHeight() / doc.internal.scaleFactor;
      const totalHeight = lines.length * lineHeight;
      
      if (doc._y + totalHeight > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        doc._y = margin;
      }
      
      // Add bullet
      doc.text('•', margin, doc._y);
      
      // Add item text
      doc.text(lines, margin + 10, doc._y);
      
      // Update y position
      doc._y += totalHeight + 5;
    });
    
    // Add extra spacing after list
    doc._y += 5;
  }
  
  /**
   * Add footer to document
   * @param {object} doc - jsPDF document
   * @param {number} currentPage - Current page number
   * @param {number} pageCount - Total page count
   */
  _addFooter(doc, currentPage, pageCount) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Set font for footer
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    
    // Add page number
    doc.text(`Page ${currentPage} of ${pageCount}`, pageWidth / 2, pageHeight - 20, { align: 'center' });
    
    // Add copyright
    doc.text('© 2025 Portnox. Confidential. All Rights Reserved.', pageWidth / 2, pageHeight - 10, { align: 'center' });
  }
  
  /**
   * Format number with commas
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  _formatNumber(num) {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  /**
   * Get strongest feature for a vendor
   * @param {object} features - Vendor features
   * @returns {string} Strongest feature
   */
  _getStrongestFeature(features) {
    if (!features) {
      return 'N/A';
    }
    
    let strongestFeature = '';
    let highestScore = 0;
    
    Object.entries(features).forEach(([feature, score]) => {
      if (score > highestScore) {
        highestScore = score;
        strongestFeature = feature;
      }
    });
    
    // Convert camelCase to readable text
    return strongestFeature
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, s => s.toUpperCase());
  }
}

// Make the report generator available globally
window.enhancedReportGenerator = new EnhancedReportGenerator();
