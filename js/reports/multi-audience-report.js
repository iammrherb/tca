/**
 * Multi-Audience Report Generator
 * Creates tailored reports for technical, financial, and executive audiences
 */
class MultiAudienceReportGenerator {
  constructor() {
    this.jsPDF = window.jspdf?.jsPDF;
    
    // Check if required libraries are available
    if (!this.jsPDF) {
      console.error('jsPDF library not loaded');
    }
    
    // Color scheme for reports
    this.colors = {
      primary: [5, 84, 124],       // #05547C
      secondary: [101, 189, 68],   // #65BD44
      accent: [247, 148, 29],      // #F7941D
      text: [32, 32, 32],          // #202020
      lightText: [112, 112, 112],  // #707070
      border: [224, 224, 224],     // #E0E0E0
      background: [245, 247, 250]  // #F5F7FA
    };
    
    // Font sizes
    this.fonts = {
      title: 20,
      subtitle: 16,
      heading: 14,
      subheading: 12,
      body: 10,
      small: 8
    };
  }
  
  /**
   * Generate a report
   * @param {Object} results - TCO calculation results
   * @param {string} currentVendor - Current vendor ID
   * @param {string} reportType - executive, financial, technical, or complete
   * @returns {jsPDF} PDF document
   */
  generateReport(results, currentVendor, reportType) {
    if (!this.jsPDF) {
      console.error('jsPDF library not loaded');
      return null;
    }
    
    // Create a new document
    const doc = new this.jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add report cover
    this.addReportCover(doc, reportType);
    
    // Generate appropriate report based on type
    switch (reportType) {
      case 'executive':
        return this.generateExecutiveSummary(doc, results, currentVendor);
      case 'financial':
        return this.generateFinancialAnalysis(doc, results, currentVendor);
      case 'technical':
        return this.generateTechnicalReport(doc, results, currentVendor);
      case 'complete':
      default:
        return this.generateCompleteReport(doc, results, currentVendor);
    }
  }
  
  /**
   * Add report cover page
   * @param {jsPDF} doc - PDF document
   * @param {string} reportType - Report type
   */
  addReportCover(doc, reportType) {
    // Set background color
    doc.setFillColor(...this.colors.background);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Add header with gradient
    for (let i = 0; i < 50; i++) {
      const r = this.colors.primary[0] + (i / 50) * (this.colors.secondary[0] - this.colors.primary[0]);
      const g = this.colors.primary[1] + (i / 50) * (this.colors.secondary[1] - this.colors.primary[1]);
      const b = this.colors.primary[2] + (i / 50) * (this.colors.secondary[2] - this.colors.primary[2]);
      
      doc.setFillColor(r, g, b);
      doc.rect(0, i, 210, 1, 'F');
    }
    
    // Add logo placeholder
    doc.setFillColor(...this.colors.primary);
    doc.rect(20, 60, 40, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('PORTNOX', 25, 70);
    
    // Add title
    doc.setFontSize(this.fonts.title);
    doc.setTextColor(...this.colors.primary);
    doc.text('NAC Total Cost Analysis', 20, 100);
    
    // Add subtitle based on report type
    doc.setFontSize(this.fonts.subtitle);
    let subtitle = '';
    switch (reportType) {
      case 'executive':
        subtitle = 'Executive Summary';
        break;
      case 'financial':
        subtitle = 'Financial Analysis';
        break;
      case 'technical':
        subtitle = 'Technical Report';
        break;
      case 'complete':
      default:
        subtitle = 'Comprehensive Analysis';
    }
    doc.text(subtitle, 20, 110);
    
    // Add report date
    doc.setFontSize(this.fonts.body);
    doc.setTextColor(...this.colors.lightText);
    const today = new Date();
    const date = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`Generated on ${date}`, 20, 120);
    
    // Add decorative element
    doc.setDrawColor(...this.colors.secondary);
    doc.setLineWidth(1);
    doc.line(20, 130, 190, 130);
    
    // Add report description
    doc.setFontSize(this.fonts.body);
    doc.setTextColor(...this.colors.text);
    
    let description = '';
    switch (reportType) {
      case 'executive':
        description = 'This executive summary provides a high-level overview of the cost benefits and strategic advantages of deploying Portnox Cloud compared to traditional NAC solutions. It highlights key financial metrics, implementation timelines, and business impact.';
        break;
      case 'financial':
        description = 'This financial analysis provides a detailed breakdown of the total cost of ownership for NAC solutions, comparing Portnox Cloud with traditional on-premises alternatives. It includes cost breakdowns, ROI analysis, and long-term financial projections.';
        break;
      case 'technical':
        description = 'This technical report provides in-depth implementation details, architecture comparisons, and feature analysis for NAC solutions. It compares Portnox Cloud with traditional on-premises alternatives from a technical perspective.';
        break;
      case 'complete':
      default:
        description = 'This comprehensive analysis combines executive, financial, and technical perspectives on NAC solutions, providing a complete view of the total cost of ownership, implementation considerations, and strategic benefits of Portnox Cloud compared to traditional alternatives.';
    }
    
    const splitDescription = doc.splitTextToSize(description, 150);
    doc.text(splitDescription, 20, 140);
    
    // Add footer
    doc.setFontSize(this.fonts.small);
    doc.setTextColor(...this.colors.lightText);
    doc.text('Confidential - For internal use only', 20, 280);
    doc.text('Portnox', 180, 280, { align: 'right' });
    
    // Add new page
    doc.addPage();
  }
  
  /**
   * Generate executive summary
   * @param {jsPDF} doc - PDF document
   * @param {Object} results - TCO calculation results
   * @param {string} currentVendor - Current vendor ID
   * @returns {jsPDF} PDF document
   */
  generateExecutiveSummary(doc, results, currentVendor) {
    try {
      const currentResults = results[currentVendor];
      const portnoxResults = results.portnox;
      const yearsToProject = results.yearsToProject || 3;
      
      // Add title
      doc.setFontSize(this.fonts.title);
      doc.setTextColor(...this.colors.primary);
      doc.text('Executive Summary', 105, 20, { align: 'center' });
      
      // Add subtitle with vendor comparison
      doc.setFontSize(this.fonts.subtitle);
      doc.setTextColor(...this.colors.text);
      doc.text(`${window.vendorData[currentVendor].name} vs. Portnox Cloud`, 105, 30, { align: 'center' });
      
      // Add key metrics section
      doc.setFontSize(this.fonts.heading);
      doc.setTextColor(...this.colors.primary);
      doc.text('Key Metrics', 20, 45);
      
      // Draw key metrics boxes
      this.drawKeyMetricsBoxes(doc, results, currentVendor);
      
      // Add strategic benefits section
      doc.setFontSize(this.fonts.heading);
      doc.setTextColor(...this.colors.primary);
      doc.text('Strategic Benefits', 20, 110);
      
      // Add benefits
      doc.setFontSize(this.fonts.body);
      doc.setTextColor(...this.colors.text);
      const benefits = [
        'Eliminate hardware costs and maintenance overhead',
        'Reduce IT staffing requirements by 60-80%',
        'Accelerate implementation by 75%',
        'Improve security posture with continuous updates',
        'Simplify multi-location management',
        'Scale effortlessly without hardware constraints'
      ];
      
      benefits.forEach((benefit, index) => {
        const y = 120 + (index * 10);
        doc.setDrawColor(...this.colors.secondary);
        doc.setFillColor(...this.colors.secondary);
        doc.circle(23, y - 2, 1.5, 'F');
        doc.text(benefit, 27, y);
      });
      
      // Add chart section
      doc.setFontSize(this.fonts.heading);
      doc.setTextColor(...this.colors.primary);
      doc.text('Cost Comparison', 20, 190);
      
      // Add chart image placeholder - in a real implementation, you'd generate and embed a chart image
      doc.setDrawColor(...this.colors.border);
      doc.setFillColor(240, 240, 240);
      doc.roundedRect(20, 200, 170, 60, 3, 3, 'FD');
      doc.setFontSize(this.fonts.body);
      doc.setTextColor(...this.colors.lightText);
      doc.text('TCO Comparison Chart', 105, 230, { align: 'center' });
      
      // Add footer with page numbers
      this.addPageNumbers(doc);
      
      return doc;
    } catch (error) {
      console.error('Error generating executive summary:', error);
      
      // Return basic report
      doc.setFontSize(this.fonts.heading);
      doc.setTextColor(...this.colors.primary);
      doc.text('Error generating executive summary', 105, 20, { align: 'center' });
      doc.setFontSize(this.fonts.body);
      doc.setTextColor(...this.colors.text);
      doc.text('Please try again or contact support.', 105, 30, { align: 'center' });
      
      return doc;
    }
  }
  
  /**
   * Draw key metrics boxes for executive summary
   * @param {jsPDF} doc - PDF document
   * @param {Object} results - TCO calculation results
   * @param {string} currentVendor - Current vendor ID
   */
  drawKeyMetricsBoxes(doc, results, currentVendor) {
    const currentResults = results[currentVendor];
    const portnoxResults = results.portnox;
    const yearsToProject = results.yearsToProject || 3;
    
    // Calculate key metrics
    const totalSavings = portnoxResults.totalSavings;
    const savingsPercentage = portnoxResults.savingsPercentage;
    const implementationDifference = results.implementationResults?.[currentVendor] - results.implementationResults?.portnox;
    const fteSavings = (currentResults.fteCost - portnoxResults.fteCost) * yearsToProject;
    
    // Define metrics data
    const metrics = [
      {
        title: 'Total Cost Savings',
        value: window.formatCurrency(totalSavings),
        subtext: `${savingsPercentage.toFixed(1)}% reduction over ${yearsToProject} years`
      },
      {
        title: 'Faster Implementation',
        value: `${implementationDifference} days`,
        subtext: 'Reduced deployment time'
      },
      {
        title: 'Annual Cost Reduction',
        value: window.formatCurrency(portnoxResults.annualSavings),
        subtext: 'Reduced yearly expenses'
      },
      {
        title: 'IT Staffing Savings',
        value: window.formatCurrency(fteSavings),
        subtext: 'Reduced administrative overhead'
      }
    ];
    
    // Draw each metric box
    metrics.forEach((metric, index) => {
      const x = 20 + (index % 2) * 90;
      const y = 50 + Math.floor(index / 2) * 25;
      
      doc.setDrawColor(...this.colors.border);
      doc.setFillColor(250, 250, 250);
      doc.roundedRect(x, y, 80, 20, 2, 2, 'FD');
      
      doc.setFontSize(this.fonts.subheading);
      doc.setTextColor(...this.colors.primary);
      doc.text(metric.title, x + 5, y + 5);
      
      doc.setFontSize(this.fonts.heading);
      doc.setTextColor(...this.colors.secondary);
      doc.text(metric.value, x + 5, y + 13);
      
      doc.setFontSize(this.fonts.small);
      doc.setTextColor(...this.colors.lightText);
      doc.text(metric.subtext, x + 5, y + 18);
    });
  }
  
  /**
   * Generate financial analysis report
   * @param {jsPDF} doc - PDF document
   * @param {Object} results - TCO calculation results
   * @param {string} currentVendor - Current vendor ID
   * @returns {jsPDF} PDF document
   */
  generateFinancialAnalysis(doc, results, currentVendor) {
    try {
      const currentResults = results[currentVendor];
      const portnoxResults = results.portnox;
      const yearsToProject = results.yearsToProject || 3;
      
      // Add title and subtitle
      doc.setFontSize(this.fonts.title);
      doc.setTextColor(...this.colors.primary);
      doc.text('Financial Analysis', 105, 20, { align: 'center' });
      
      doc.setFontSize(this.fonts.subtitle);
      doc.setTextColor(...this.colors.text);
      doc.text(`${window.vendorData[currentVendor].name} vs. Portnox Cloud`, 105, 30, { align: 'center' });
      
      // Add summary section
      doc.setFontSize(this.fonts.heading);
      doc.setTextColor(...this.colors.primary);
      doc.text('Financial Summary', 20, 45);
      
      // Add summary text
      doc.setFontSize(this.fonts.body);
      doc.setTextColor(...this.colors.text);
      const summary = `This analysis compares the ${yearsToProject}-year Total Cost of Ownership (TCO) between ${window.vendorData[currentVendor].name} and Portnox Cloud. The Portnox Cloud solution provides a total saving of ${window.formatCurrency(portnoxResults.totalSavings)} (${portnoxResults.savingsPercentage.toFixed(1)}%) over the ${yearsToProject}-year period.`;
      const splitSummary = doc.splitTextToSize(summary, 170);
      doc.text(splitSummary, 20, 55);
      
      // Add TCO breakdown table
      doc.setFontSize(this.fonts.heading);
      doc.setTextColor(...this.colors.primary);
      doc.text('TCO Breakdown', 20, 75);
      
      // Generate cost breakdown table
      this.generateCostBreakdownTable(doc, results, currentVendor, 80);
      
      // Add annual cost comparison
      doc.setFontSize(this.fonts.heading);
      doc.setTextColor(...this.colors.primary);
      doc.text('Annual Cost Comparison', 20, 170);
      
      // Generate annual cost table
      this.generateAnnualCostTable(doc, results, currentVendor, 175);
      
      // Add ROI analysis section
      doc.setFontSize(this.fonts.heading);
      doc.setTextColor(...this.colors.primary);
      doc.text('Return on Investment Analysis', 20, 225);
      
     // Generate ROI analysis text
      doc.setFontSize(this.fonts.body);
      doc.setTextColor(...this.colors.text);
      
      // Calculate ROI data
      const initialInvestmentDiff = portnoxResults.totalInitialCosts - currentResults.totalInitialCosts + portnoxResults.migrationCost;
      const annualSavings = currentResults.annualCosts - portnoxResults.annualCosts;
      const paybackPeriod = initialInvestmentDiff > 0 ? initialInvestmentDiff / annualSavings : 0;
      
      let roiText = '';
      if (initialInvestmentDiff <= 0) {
        roiText = `The Portnox Cloud solution has a lower initial investment than ${window.vendorData[currentVendor].name}, resulting in immediate cost savings from day one. The solution continues to deliver annual savings of ${window.formatCurrency(annualSavings)} per year.`;
      } else {
        roiText = `The Portnox Cloud solution requires an initial investment of ${window.formatCurrency(initialInvestmentDiff)} compared to ${window.vendorData[currentVendor].name}. With annual savings of ${window.formatCurrency(annualSavings)}, the payback period is ${paybackPeriod.toFixed(1)} years. After this period, the solution delivers net positive returns.`;
      }
      
      const splitRoiText = doc.splitTextToSize(roiText, 170);
      doc.text(splitRoiText, 20, 235);
      
      // Add chart placeholder
      doc.setDrawColor(...this.colors.border);
      doc.setFillColor(240, 240, 240);
      doc.roundedRect(20, 250, 170, 30, 3, 3, 'FD');
      doc.setFontSize(this.fonts.body);
      doc.setTextColor(...this.colors.lightText);
      doc.text('ROI Analysis Chart', 105, 265, { align: 'center' });
      
      // Add page numbers
      this.addPageNumbers(doc);
      
      return doc;
    } catch (error) {
      console.error('Error generating financial analysis:', error);
      
      // Return basic report
      doc.setFontSize(this.fonts.heading);
      doc.setTextColor(...this.colors.primary);
      doc.text('Error generating financial analysis', 105, 20, { align: 'center' });
      doc.setFontSize(this.fonts.body);
      doc.setTextColor(...this.colors.text);
      doc.text('Please try again or contact support.', 105, 30, { align: 'center' });
      
      return doc;
    }
  }
  
  /**
   * Generate cost breakdown table
   * @param {jsPDF} doc - PDF document
   * @param {Object} results - TCO calculation results
   * @param {string} currentVendor - Current vendor ID
   * @param {number} y - Y position
   */
  generateCostBreakdownTable(doc, results, currentVendor, y) {
    const currentResults = results[currentVendor];
    const portnoxResults = results.portnox;
    const yearsToProject = results.yearsToProject || 3;
    
    // Define table headers
    const headers = ['Cost Component', window.vendorData[currentVendor].name, 'Portnox Cloud', 'Savings'];
    
    // Define table data
    const data = [
      ['Hardware', currentResults.hardwareCost, portnoxResults.hardwareCost, currentResults.hardwareCost - portnoxResults.hardwareCost],
      ['Implementation', currentResults.implementationCost + currentResults.networkRedesignCost, portnoxResults.implementationCost + portnoxResults.networkRedesignCost, currentResults.implementationCost + currentResults.networkRedesignCost - (portnoxResults.implementationCost + portnoxResults.networkRedesignCost)],
      ['Training', currentResults.trainingCost, portnoxResults.trainingCost, currentResults.trainingCost - portnoxResults.trainingCost],
      ['Migration', 0, portnoxResults.migrationCost, -portnoxResults.migrationCost],
      [`Maintenance (${yearsToProject} years)`, currentResults.maintenanceCost * yearsToProject, portnoxResults.maintenanceCost * yearsToProject, (currentResults.maintenanceCost - portnoxResults.maintenanceCost) * yearsToProject],
      [`Licensing (${yearsToProject} years)`, currentResults.licensingCost * yearsToProject, portnoxResults.licensingCost * yearsToProject, (currentResults.licensingCost - portnoxResults.licensingCost) * yearsToProject],
      [`Personnel (${yearsToProject} years)`, currentResults.fteCost * yearsToProject, portnoxResults.fteCost * yearsToProject, (currentResults.fteCost - portnoxResults.fteCost) * yearsToProject],
      [`Downtime (${yearsToProject} years)`, currentResults.annualDowntimeCost * yearsToProject, portnoxResults.annualDowntimeCost * yearsToProject, (currentResults.annualDowntimeCost - portnoxResults.annualDowntimeCost) * yearsToProject],
      [`Total ${yearsToProject}-Year TCO`, currentResults.totalTCO, portnoxResults.totalTCO, portnoxResults.totalSavings]
    ];
    
    // Draw table headers
    doc.setFillColor(...this.colors.primary);
    doc.rect(20, y, 70, 7, 'F');
    doc.rect(90, y, 30, 7, 'F');
    doc.rect(120, y, 30, 7, 'F');
    doc.rect(150, y, 30, 7, 'F');
    
    doc.setFontSize(this.fonts.body);
    doc.setTextColor(255, 255, 255);
    doc.text(headers[0], 22, y + 5);
    doc.text(headers[1], 90 + 15, y + 5, { align: 'center' });
    doc.text(headers[2], 120 + 15, y + 5, { align: 'center' });
    doc.text(headers[3], 150 + 15, y + 5, { align: 'center' });
    
    // Draw table rows
    doc.setTextColor(...this.colors.text);
    data.forEach((row, index) => {
      const rowY = y + 10 + (index * 7);
      const isLastRow = index === data.length - 1;
      
      // Set background color for alternate rows
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(20, rowY - 5, 160, 7, 'F');
      }
      
      // Highlight total row
      if (isLastRow) {
        doc.setFillColor(230, 230, 230);
        doc.rect(20, rowY - 5, 160, 7, 'F');
        doc.setFontSize(this.fonts.body);
        doc.setTextColor(...this.colors.primary);
      } else {
        doc.setFontSize(this.fonts.body);
        doc.setTextColor(...this.colors.text);
      }
      
      // Draw cells
      doc.text(row[0], 22, rowY);
      doc.text(this.formatCurrency(row[1]), 90 + 15, rowY, { align: 'center' });
      doc.text(this.formatCurrency(row[2]), 120 + 15, rowY, { align: 'center' });
      
      // Draw savings with color coding
      if (row[3] >= 0) {
        doc.setTextColor(0, 128, 0); // Green for positive savings
      } else {
        doc.setTextColor(192, 0, 0); // Red for negative savings
      }
      doc.text(this.formatCurrency(row[3]), 150 + 15, rowY, { align: 'center' });
      
      // Reset text color
      doc.setTextColor(...this.colors.text);
    });
  }
  
  /**
   * Generate annual cost table
   * @param {jsPDF} doc - PDF document
   * @param {Object} results - TCO calculation results
   * @param {string} currentVendor - Current vendor ID
   * @param {number} y - Y position
   */
  generateAnnualCostTable(doc, results, currentVendor, y) {
    const currentResults = results[currentVendor];
    const portnoxResults = results.portnox;
    
    // Define table headers
    const headers = ['Cost Category', window.vendorData[currentVendor].name, 'Portnox Cloud', 'Annual Savings'];
    
    // Define table data
    const data = [
      ['Maintenance', currentResults.maintenanceCost, portnoxResults.maintenanceCost, currentResults.maintenanceCost - portnoxResults.maintenanceCost],
      ['Licensing', currentResults.licensingCost, portnoxResults.licensingCost, currentResults.licensingCost - portnoxResults.licensingCost],
      ['Personnel', currentResults.fteCost, portnoxResults.fteCost, currentResults.fteCost - portnoxResults.fteCost],
      ['Downtime', currentResults.annualDowntimeCost, portnoxResults.annualDowntimeCost, currentResults.annualDowntimeCost - portnoxResults.annualDowntimeCost],
      ['Total Annual Cost', currentResults.annualCosts, portnoxResults.annualCosts, currentResults.annualCosts - portnoxResults.annualCosts]
    ];
    
    // Draw table headers
    doc.setFillColor(...this.colors.primary);
    doc.rect(20, y, 70, 7, 'F');
    doc.rect(90, y, 30, 7, 'F');
    doc.rect(120, y, 30, 7, 'F');
    doc.rect(150, y, 30, 7, 'F');
    
    doc.setFontSize(this.fonts.body);
    doc.setTextColor(255, 255, 255);
    doc.text(headers[0], 22, y + 5);
    doc.text(headers[1], 90 + 15, y + 5, { align: 'center' });
    doc.text(headers[2], 120 + 15, y + 5, { align: 'center' });
    doc.text(headers[3], 150 + 15, y + 5, { align: 'center' });
    
    // Draw table rows
    doc.setTextColor(...this.colors.text);
    data.forEach((row, index) => {
      const rowY = y + 10 + (index * 7);
      const isLastRow = index === data.length - 1;
      
      // Set background color for alternate rows
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(20, rowY - 5, 160, 7, 'F');
      }
      
      // Highlight total row
      if (isLastRow) {
        doc.setFillColor(230, 230, 230);
        doc.rect(20, rowY - 5, 160, 7, 'F');
        doc.setFontSize(this.fonts.body);
        doc.setTextColor(...this.colors.primary);
      } else {
        doc.setFontSize(this.fonts.body);
        doc.setTextColor(...this.colors.text);
      }
      
      // Draw cells
      doc.text(row[0], 22, rowY);
      doc.text(this.formatCurrency(row[1]), 90 + 15, rowY, { align: 'center' });
      doc.text(this.formatCurrency(row[2]), 120 + 15, rowY, { align: 'center' });
      
      // Draw savings with color coding
      if (row[3] >= 0) {
        doc.setTextColor(0, 128, 0); // Green for positive savings
      } else {
        doc.setTextColor(192, 0, 0); // Red for negative savings
      }
      doc.text(this.formatCurrency(row[3]), 150 + 15, rowY, { align: 'center' });
      
      // Reset text color
      doc.setTextColor(...this.colors.text);
    });
  }
  
  /**
   * Generate technical report
   * @param {jsPDF} doc - PDF document
   * @param {Object} results - TCO calculation results
   * @param {string} currentVendor - Current vendor ID
   * @returns {jsPDF} PDF document
   */
  generateTechnicalReport(doc, results, currentVendor) {
    try {
      const currentResults = results[currentVendor];
      const portnoxResults = results.portnox;
      const yearsToProject = results.yearsToProject || 3;
      const orgSize = results.orgSize || 'medium';
      
      // Add title and subtitle
      doc.setFontSize(this.fonts.title);
      doc.setTextColor(...this.colors.primary);
      doc.text('Technical Report', 105, 20, { align: 'center' });
      
      doc.setFontSize(this.fonts.subtitle);
      doc.setTextColor(...this.colors.text);
      doc.text(`${window.vendorData[currentVendor].name} vs. Portnox Cloud`, 105, 30, { align: 'center' });
      
      // Add environment section
      doc.setFontSize(this.fonts.heading);
      doc.setTextColor(...this.colors.primary);
      doc.text('Environment Details', 20, 45);
      
      // Generate environment table
      this.generateEnvironmentTable(doc, results, 50);
      
      // Add implementation comparison section
      doc.setFontSize(this.fonts.heading);
      doc.setTextColor(...this.colors.primary);
      doc.text('Implementation Comparison', 20, 100);
      
      // Generate implementation comparison table
      this.generateImplementationTable(doc, results, currentVendor, 105);
      
      // Add architecture comparison
      doc.addPage();
      
      doc.setFontSize(this.fonts.heading);
      doc.setTextColor(...this.colors.primary);
      doc.text('Architecture Comparison', 20, 20);
      
      // Generate architecture comparison
      this.generateArchitectureComparison(doc, 25);
      
      // Add feature comparison
      doc.setFontSize(this.fonts.heading);
      doc.setTextColor(...this.colors.primary);
      doc.text('Feature Comparison', 20, 120);
      
      // Generate feature comparison table
      this.generateFeatureComparisonTable(doc, currentVendor, 125);
      
      // Add IT resource utilization section
      doc.addPage();
      
      doc.setFontSize(this.fonts.heading);
      doc.setTextColor(...this.colors.primary);
      doc.text('IT Resource Utilization', 20, 20);
      
      // Generate IT resource utilization table
      this.generateResourceUtilizationTable(doc, results, currentVendor, 25);
      
      // Add page numbers
      this.addPageNumbers(doc);
      
      return doc;
    } catch (error) {
      console.error('Error generating technical report:', error);
      
      // Return basic report
      doc.setFontSize(this.fonts.heading);
      doc.setTextColor(...this.colors.primary);
      doc.text('Error generating technical report', 105, 20, { align: 'center' });
      doc.setFontSize(this.fonts.body);
      doc.setTextColor(...this.colors.text);
      doc.text('Please try again or contact support.', 105, 30, { align: 'center' });
      
      return doc;
    }
  }
  
  /**
   * Generate environment table
   * @param {jsPDF} doc - PDF document
   * @param {Object} results - TCO calculation results
   * @param {number} y - Y position
   */
  generateEnvironmentTable(doc, results, y) {
    // Define table headers
    const headers = ['Parameter', 'Value'];
    
    // Define table data
    const data = [
      ['Device Count', results.deviceCount],
      ['Organization Size', results.orgSize.charAt(0).toUpperCase() + results.orgSize.slice(1)],
      ['Multiple Locations', results.multipleLocations ? 'Yes' : 'No'],
      ['Location Count', results.locationCount],
      ['Complex Authentication', results.complexAuthentication ? 'Yes' : 'No'],
      ['Legacy Devices', results.legacyDevices ? 'Yes' : 'No'],
      ['Legacy Percentage', results.legacyPercentage + '%'],
      ['Cloud Integration', results.cloudIntegration ? 'Yes' : 'No'],
      ['Custom Policies', results.customPolicies ? 'Yes' : 'No'],
      ['Policy Complexity', results.policyComplexity.charAt(0).toUpperCase() + results.policyComplexity.slice(1)]
    ];
    
    // Draw table headers
    doc.setFillColor(...this.colors.primary);
    doc.rect(20, y, 50, 7, 'F');
    doc.rect(70, y, 50, 7, 'F');
    
    doc.setFontSize(this.fonts.body);
    doc.setTextColor(255, 255, 255);
    doc.text(headers[0], 22, y + 5);
    doc.text(headers[1], 72, y + 5);
    
    // Draw table rows
    doc.setTextColor(...this.colors.text);
    data.forEach((row, index) => {
      const rowY = y + 10 + (index * 7);
      
      // Set background color for alternate rows
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(20, rowY - 5, 100, 7, 'F');
      }
      
      // Draw cells
      doc.text(row[0], 22, rowY);
      doc.text(row[1].toString(), 72, rowY);
    });
  }
  
  /**
   * Generate implementation comparison table
   * @param {jsPDF} doc - PDF document
   * @param {Object} results - TCO calculation results
   * @param {string} currentVendor - Current vendor ID
   * @param {number} y - Y position
   */
  generateImplementationTable(doc, results, currentVendor, y) {
    // Ensure implementation results exist
    if (!results.implementationResults) return;
    
    const currentVendorData = window.vendorData[currentVendor];
    const portnoxData = window.vendorData.portnox;
    const orgSize = results.orgSize || 'medium';
    
    // Check if implementation timelines exist
    if (!currentVendorData[orgSize] || !currentVendorData[orgSize].implementationTimeline ||
        !portnoxData[orgSize] || !portnoxData[orgSize].implementationTimeline) {
      return;
    }
    
    const currentTimeline = currentVendorData[orgSize].implementationTimeline;
    const portnoxTimeline = portnoxData[orgSize].implementationTimeline;
    
    // Define table headers
    const headers = ['Implementation Phase', currentVendorData.name, 'Portnox Cloud', 'Time Savings'];
    
    // Define table data
    const phases = [...new Set([...Object.keys(currentTimeline), ...Object.keys(portnoxTimeline)])];
    const data = phases.map(phase => {
      const currentDays = currentTimeline[phase] || 0;
      const portnoxDays = portnoxTimeline[phase] || 0;
      const savings = currentDays - portnoxDays;
      
      return [
        phase.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        currentDays + ' days',
        portnoxDays + ' days',
        savings > 0 ? savings + ' days' : (savings === 0 ? 'None' : Math.abs(savings) + ' days longer')
      ];
    });
    
    // Add total row
    const currentTotal = Object.values(currentTimeline).reduce((a, b) => a + b, 0);
    const portnoxTotal = Object.values(portnoxTimeline).reduce((a, b) => a + b, 0);
    const totalSavings = currentTotal - portnoxTotal;
    
    data.push([
      'Total Implementation Time',
      currentTotal + ' days',
      portnoxTotal + ' days',
      totalSavings > 0 ? totalSavings + ' days' : (totalSavings === 0 ? 'None' : Math.abs(totalSavings) + ' days longer')
    ]);
    
    // Draw table headers
    doc.setFillColor(...this.colors.primary);
    doc.rect(20, y, 50, 7, 'F');
    doc.rect(70, y, 40, 7, 'F');
    doc.rect(110, y, 40, 7, 'F');
    doc.rect(150, y, 40, 7, 'F');
    
    doc.setFontSize(this.fonts.body);
    doc.setTextColor(255, 255, 255);
    doc.text(headers[0], 22, y + 5);
    doc.text(headers[1], 70 + 20, y + 5, { align: 'center' });
    doc.text(headers[2], 110 + 20, y + 5, { align: 'center' });
    doc.text(headers[3], 150 + 20, y + 5, { align: 'center' });
    
    // Draw table rows
    doc.setTextColor(...this.colors.text);
    data.forEach((row, index) => {
      const rowY = y + 10 + (index * 7);
      const isLastRow = index === data.length - 1;
      
      // Set background color for alternate rows
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(20, rowY - 5, 170, 7, 'F');
      }
      
      // Highlight total row
      if (isLastRow) {
        doc.setFillColor(230, 230, 230);
        doc.rect(20, rowY - 5, 170, 7, 'F');
        doc.setFontSize(this.fonts.body);
        doc.setTextColor(...this.colors.primary);
      } else {
        doc.setFontSize(this.fonts.body);
        doc.setTextColor(...this.colors.text);
      }
      
      // Draw cells
      doc.text(row[0], 22, rowY);
      doc.text(row[1], 70 + 20, rowY, { align: 'center' });
      doc.text(row[2], 110 + 20, rowY, { align: 'center' });
      
      // Draw savings with color coding
      if (row[3].includes('longer')) {
        doc.setTextColor(192, 0, 0); // Red for negative savings
      } else if (row[3] !== 'None') {
        doc.setTextColor(0, 128, 0); // Green for positive savings
      }
      doc.text(row[3], 150 + 20, rowY, { align: 'center' });
      
      // Reset text color
      doc.setTextColor(...this.colors.text);
    });
  }
  
  /**
   * Generate architecture comparison
   * @param {jsPDF} doc - PDF document
   * @param {number} y - Y position
   */
  generateArchitectureComparison(doc, y) {
    // Set up section header
    doc.setFontSize(this.fonts.subheading);
    doc.setTextColor(...this.colors.primary);
    doc.text('On-Premises NAC', 60, y + 5, { align: 'center' });
    doc.text('Portnox Cloud NAC', 150, y + 5, { align: 'center' });
    
    // Draw boxes for comparison
    doc.setDrawColor(...this.colors.border);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(20, y + 10, 80, 80, 3, 3, 'FD');
    doc.roundedRect(110, y + 10, 80, 80, 3, 3, 'FD');
    
    // On-premises architecture description
    doc.setFontSize(this.fonts.small);
    doc.setTextColor(...this.colors.text);
    const onPremPoints = [
      'Hardware appliances required at each site',
      'Complex network integration',
      'Manual updates and maintenance',
      'Specialized expertise needed',
      'High availability requires redundant hardware',
      'Downtime during upgrades',
      'CapEx-heavy investment model',
      'Hardware refresh cycles (3-5 years)'
    ];
    
    onPremPoints.forEach((point, index) => {
      const pointY = y + 20 + (index * 7);
      doc.setDrawColor(...this.colors.primary);
      doc.setFillColor(...this.colors.primary);
      doc.circle(25, pointY - 2, 1, 'F');
      doc.text(point, 28, pointY);
    });
    
    // Cloud architecture description
    const cloudPoints = [
      'Zero hardware requirements',
      'Simple cloud connectors',
      'Automatic updates with no downtime',
      'Minimal IT expertise required',
      'Built-in redundancy and availability',
      'Continuous feature updates',
      'OpEx subscription model',
      'No hardware refresh cycles'
    ];
    
    cloudPoints.forEach((point, index) => {
      const pointY = y + 20 + (index * 7);
      doc.setDrawColor(...this.colors.secondary);
      doc.setFillColor(...this.colors.secondary);
      doc.circle(115, pointY - 2, 1, 'F');
      doc.text(point, 118, pointY);
    });
  }
  
  /**
   * Generate feature comparison table
   * @param {jsPDF} doc - PDF document
   * @param {string} currentVendor - Current vendor ID
   * @param {number} y - Y position
   */
  generateFeatureComparisonTable(doc, currentVendor, y) {
    // Ensure vendor data contains feature ratings
    if (!window.vendorData[currentVendor] || !window.vendorData[currentVendor].features) return;
    if (!window.vendorData.portnox || !window.vendorData.portnox.features) return;
    
    const currentFeatures = window.vendorData[currentVendor].features;
    const portnoxFeatures = window.vendorData.portnox.features;
    
    // Feature keys and display names
    const features = [
      { key: 'deviceProfiling', name: 'Device Profiling' },
      { key: 'userAuthentication', name: 'User Authentication' },
      { key: 'policyEnforcement', name: 'Policy Enforcement' },
      { key: 'guestManagement', name: 'Guest Management' },
      { key: 'remoteAccess', name: 'Remote Access' },
      { key: 'cloudIntegration', name: 'Cloud Integration' },
      { key: 'deploymentFlexibility', name: 'Deployment Flexibility' },
      { key: 'managementInterface', name: 'Management Interface' },
      { key: 'multiVendorSupport', name: 'Multi-Vendor Support' },
      { key: 'complianceReporting', name: 'Compliance Reporting' }
    ];
    
    // Define table headers
    const headers = ['Feature', window.vendorData[currentVendor].name, 'Portnox Cloud', 'Advantage'];
    
    // Define table data
    const data = features.map(feature => {
      const currentScore = currentFeatures[feature.key] || 0;
      const portnoxScore = portnoxFeatures[feature.key] || 0;
      const advantage = portnoxScore > currentScore ? 'Portnox' : 
                        (portnoxScore < currentScore ? currentVendor : 'Equal');
      
      return [
        feature.name,
        currentScore + '/10',
        portnoxScore + '/10',
        advantage
      ];
    });
    
    // Draw table headers
    doc.setFillColor(...this.colors.primary);
    doc.rect(20, y, 60, 7, 'F');
    doc.rect(80, y, 30, 7, 'F');
    doc.rect(110, y, 30, 7, 'F');
    doc.rect(140, y, 30, 7, 'F');
    
    doc.setFontSize(this.fonts.body);
    doc.setTextColor(255, 255, 255);
    doc.text(headers[0], 22, y + 5);
    doc.text(headers[1], 80 + 15, y + 5, { align: 'center' });
    doc.text(headers[2], 110 + 15, y + 5, { align: 'center' });
    doc.text(headers[3], 140 + 15, y + 5, { align: 'center' });
    
    // Draw table rows
    doc.setTextColor(...this.colors.text);
    data.forEach((row, index) => {
      const rowY = y + 10 + (index * 7);
      
      // Set background color for alternate rows
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(20, rowY - 5, 150, 7, 'F');
      }
      
      // Draw cells
      doc.text(row[0], 22, rowY);
      doc.text(row[1], 80 + 15, rowY, { align: 'center' });
      doc.text(row[2], 110 + 15, rowY, { align: 'center' });
      
      // Draw advantage with color coding
      if (row[3] === 'Portnox') {
        doc.setTextColor(...this.colors.secondary);
      } else if (row[3] === currentVendor) {
        doc.setTextColor(...this.colors.primary);
      } else {
        doc.setTextColor(...this.colors.lightText);
      }
      doc.text(row[3], 140 + 15, rowY, { align: 'center' });
      
      // Reset text color
      doc.setTextColor(...this.colors.text);
    });
  }
  
  /**
   * Generate IT resource utilization table
   * @param {jsPDF} doc - PDF document
   * @param {Object} results - TCO calculation results
   * @param {string} currentVendor - Current vendor ID
   * @param {number} y - Y position
   */
  generateResourceUtilizationTable(doc, results, currentVendor, y) {
    const orgSize = results.orgSize || 'medium';
    
    // Check if FTE allocation exists
    if (!window.vendorData[currentVendor] || !window.vendorData[currentVendor][orgSize] || 
        !window.vendorData[currentVendor][orgSize].fteAllocation) return;
    
    if (!window.vendorData.portnox || !window.vendorData.portnox[orgSize] || 
        !window.vendorData.portnox[orgSize].fteAllocation) return;
    
    const currentFTE = window.vendorData[currentVendor][orgSize].fteAllocation;
    const portnoxFTE = window.vendorData.portnox[orgSize].fteAllocation;
    
    // Define table headers
    const headers = ['IT Role', window.vendorData[currentVendor].name, 'Portnox Cloud', 'FTE Reduction'];
    
    // Define table data
    const data = [
      ['Network Administrator', currentFTE.networkAdmin.toFixed(2) + ' FTE', portnoxFTE.networkAdmin.toFixed(2) + ' FTE', (currentFTE.networkAdmin - portnoxFTE.networkAdmin).toFixed(2) + ' FTE'],
      ['Security Administrator', currentFTE.securityAdmin.toFixed(2) + ' FTE', portnoxFTE.securityAdmin.toFixed(2) + ' FTE', (currentFTE.securityAdmin - portnoxFTE.securityAdmin).toFixed(2) + ' FTE'],
      ['System Administrator', currentFTE.systemAdmin.toFixed(2) + ' FTE', portnoxFTE.systemAdmin.toFixed(2) + ' FTE', (currentFTE.systemAdmin - portnoxFTE.systemAdmin).toFixed(2) + ' FTE'],
      ['Help Desk', currentFTE.helpDesk.toFixed(2) + ' FTE', portnoxFTE.helpDesk.toFixed(2) + ' FTE', (currentFTE.helpDesk - portnoxFTE.helpDesk).toFixed(2) + ' FTE']
    ];
    
    // Calculate totals
    const currentTotal = Object.values(currentFTE).reduce((a, b) => a + b, 0);
    const portnoxTotal = Object.values(portnoxFTE).reduce((a, b) => a + b, 0);
    const totalReduction = currentTotal - portnoxTotal;
    
    data.push(['Total IT Staff', currentTotal.toFixed(2) + ' FTE', portnoxTotal.toFixed(2) + ' FTE', totalReduction.toFixed(2) + ' FTE']);
    
    // Draw table headers
    doc.setFillColor(...this.colors.primary);
    doc.rect(20, y, 60, 7, 'F');
    doc.rect(80, y, 30, 7, 'F');
    doc.rect(110, y, 30, 7, 'F');
    doc.rect(140, y, 30, 7, 'F');
    
    doc.setFontSize(this.fonts.body);
    doc.setTextColor(255, 255, 255);
    doc.text(headers[0], 22, y + 5);
    doc.text(headers[1], 80 + 15, y + 5, { align: 'center' });
    doc.text(headers[2], 110 + 15, y + 5, { align: 'center' });
    doc.text(headers[3], 140 + 15, y + 5, { align: 'center' });
    
    // Draw table rows
    doc.setTextColor(...this.colors.text);
    data.forEach((row, index) => {
      const rowY = y + 10 + (index * 7);
      const isLastRow = index === data.length - 1;
      
      // Set background color for alternate rows
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(20, rowY - 5, 150, 7, 'F');
      }
      
      // Highlight total row
      if (isLastRow) {
        doc.setFillColor(230, 230, 230);
        doc.rect(20, rowY - 5, 150, 7, 'F');
        doc.setFontSize(this.fonts.body);
        doc.setTextColor(...this.colors.primary);
      } else {
        doc.setFontSize(this.fonts.body);
        doc.setTextColor(...this.colors.text);
      }
      
      // Draw cells
      doc.text(row[0], 22, rowY);
      doc.text(row[1], 80 + 15, rowY, { align: 'center' });
      doc.text(row[2], 110 + 15, rowY, { align: 'center' });
      
      // Draw reduction with color coding
      if (row[3].startsWith('-')) {
        doc.setTextColor(192, 0, 0); // Red for negative reduction (increase)
      } else if (row[3] !== '0.00 FTE') {
        doc.setTextColor(0, 128, 0); // Green for positive reduction
      }
      doc.text(row[3], 140 + 15, rowY, { align: 'center' });
      
      // Reset text color
      doc.setTextColor(...this.colors.text);
    });
    
    // Add explanatory text
    doc.setFontSize(this.fonts.body);
    doc.setTextColor(...this.colors.text);
    doc.setDrawColor(...this.colors.primary);
    doc.rect(20, y + 50, 170, 50, 'S');
    
    const fteText = `The table above shows the Full-Time Equivalent (FTE) staff required to manage and operate each NAC solution. Portnox Cloud reduces IT staffing requirements by ${(totalReduction / currentTotal * 100).toFixed(0)}% compared to ${window.vendorData[currentVendor].name}, resulting in significant operational cost savings.`;
    const fteTextLines = doc.splitTextToSize(fteText, 160);
    doc.text(fteTextLines, 25, y + 60);
    
    const annualSavingsText = `Based on industry-average IT salaries, this FTE reduction represents an estimated annual savings of ${this.formatCurrency(totalReduction * 150000)} in IT staffing costs.`;
    const annualSavingsTextLines = doc.splitTextToSize(annualSavingsText, 160);
    doc.text(annualSavingsTextLines, 25, y + 80);
  }
  
  /**
   * Generate complete report combining all sections
   * @param {jsPDF} doc - PDF document
   * @param {Object} results - TCO calculation results
   * @param {string} currentVendor - Current vendor ID
   * @returns {jsPDF} PDF document
   */
  generateCompleteReport(doc, results, currentVendor) {
    try {
      // Add table of contents
      this.addTableOfContents(doc);
      
      // Add executive summary
      doc.addPage();
      this.generateExecutiveSummary(doc, results, currentVendor);
      
      // Add financial analysis
      doc.addPage();
      this.generateFinancialAnalysis(doc, results, currentVendor);
      
      // Add technical report
      doc.addPage();
      this.generateTechnicalReport(doc, results, currentVendor);
      
      // Add page numbers
      this.addPageNumbers(doc);
      
      return doc;
    } catch (error) {
      console.error('Error generating complete report:', error);
      
      // Return basic report
      doc.setFontSize(this.fonts.heading);
      doc.setTextColor(...this.colors.primary);
      doc.text('Error generating complete report', 105, 20, { align: 'center' });
      doc.setFontSize(this.fonts.body);
      doc.setTextColor(...this.colors.text);
      doc.text('Please try again or contact support.', 105, 30, { align: 'center' });
      
      return doc;
    }
  }
  
  /**
   * Add table of contents
   * @param {jsPDF} doc - PDF document
   */
  addTableOfContents(doc) {
    // Add title
    doc.setFontSize(this.fonts.title);
    doc.setTextColor(...this.colors.primary);
    doc.text('Table of Contents', 105, 20, { align: 'center' });
    
    // Add TOC items
    doc.setFontSize(this.fonts.heading);
    doc.setTextColor(...this.colors.text);
    
    const tocItems = [
      { title: '1. Executive Summary', page: 3 },
      { title: '2. Financial Analysis', page: 5 },
      { title: '   2.1. Cost Breakdown', page: 5 },
      { title: '   2.2. Annual Cost Comparison', page: 6 },
      { title: '   2.3. Return on Investment', page: 7 },
      { title: '3. Technical Report', page: 8 },
      { title: '   3.1. Environment Details', page: 8 },
      { title: '   3.2. Implementation Comparison', page: 9 },
      { title: '   3.3. Architecture Comparison', page: 10 },
      { title: '   3.4. Feature Comparison', page: 11 },
      { title: '   3.5. IT Resource Utilization', page: 12 }
    ];
    
    tocItems.forEach((item, index) => {
      const y = 40 + (index * 10);
      doc.text(item.title, 20, y);
      doc.text(item.page.toString(), 190, y, { align: 'right' });
      
      // Add dotted line
      if (!item.title.startsWith('   ')) {
        doc.setDrawColor(...this.colors.lightText);
        for (let i = 0; i < 150; i += 3) {
          doc.line(50 + i, y + 1, 51 + i, y + 1);
        }
      }
    });
  }
  
  /**
   * Add page numbers to all pages
   * @param {jsPDF} doc - PDF document
   */
  addPageNumbers(doc) {
    const pageCount = doc.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(this.fonts.small);
      doc.setTextColor(...this.colors.lightText);
      doc.text(`Page ${i} of ${pageCount}`, 190, 285, { align: 'right' });
    }
  }
  
  /**
   * Format currency for display
   * @param {number} value - Currency value
   * @returns {string} Formatted currency string
   */
  formatCurrency(value) {
    if (typeof value !== 'number') return value;
    return '$' + value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
}

// Make the multi-audience report generator globally available
window.multiAudienceReportGenerator = new MultiAudienceReportGenerator();
