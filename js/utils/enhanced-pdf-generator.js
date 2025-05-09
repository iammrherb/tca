/**
 * Enhanced PDF Report Generator
 * Provides comprehensive, customizable reports for different audiences
 */
class EnhancedPDFReportGenerator {
  constructor() {
    this.defaultOptions = {
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    };
    
    this.colors = {
      primary: [5, 84, 124],      // Portnox blue
      primaryLight: [27, 141, 192],
      accent: [101, 189, 68],     // Portnox green
      accentLight: [142, 208, 112],
      text: [32, 32, 32],
      textLight: [80, 80, 80],
      background: [248, 249, 250],
      border: [224, 224, 224]
    };
    
    this.customerLogo = null;
  }
  
  /**
   * Set customer logo for reports
   * @param {string} logoDataUrl - Base64 encoded logo image
   */
  setCustomerLogo(logoDataUrl) {
    this.customerLogo = logoDataUrl;
  }
  
  /**
   * Generate PDF report based on results and report type
   * @param {Object} results - Calculation results
   * @param {string} currentVendor - Current vendor ID
   * @param {string} reportType - Report type (complete, executive, financial, technical)
   * @param {Object} options - Additional options
   * @returns {Object} jsPDF document object
   */
  generateReport(results, currentVendor, reportType = 'complete', options = {}) {
    if (!results || !results[currentVendor] || !results['portnox']) {
      throw new Error('Invalid results data');
    }
    
    // Create PDF document
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
      throw new Error('jsPDF library not available');
    }
    
    const doc = new jsPDF(this.defaultOptions);
    
    // Add customer info if provided
    const customerInfo = options.customerInfo || null;
    
    // Generate report based on type
    switch(reportType) {
      case 'executive':
        this.generateExecutiveSummary(doc, results, currentVendor, customerInfo);
        break;
      case 'financial':
        this.generateFinancialAnalysis(doc, results, currentVendor, customerInfo);
        break;
      case 'technical':
        this.generateTechnicalReport(doc, results, currentVendor, customerInfo);
        break;
      case 'compliance':
        this.generateComplianceReport(doc, results, currentVendor, customerInfo, options.industryData);
        break;
      case 'complete':
      default:
        this.generateCompleteReport(doc, results, currentVendor, customerInfo);
    }
    
    return doc;
  }
  
  /**
   * Generate executive summary
   * Brief, high-level overview for decision makers
   */
  generateExecutiveSummary(doc, results, currentVendor, customerInfo) {
    // Get results data
    const currentResults = results[currentVendor];
    const portnoxResults = results['portnox'];
    const yearsToProject = results.yearsToProject;
    
    // Calculate key metrics
    const savingsAmount = currentResults.totalCosts - portnoxResults.totalCosts;
    const savingsPercentage = (savingsAmount / currentResults.totalCosts) * 100;
    
    // Create cover page
    this.createCoverPage(doc, 'Executive Summary', results, currentVendor, customerInfo);
    
    // Add organization overview
    doc.addPage();
    doc.setFontSize(18);
    doc.setTextColor(...this.colors.primary);
    doc.text('Executive Summary', 20, 20);
    
    // Key findings section
    doc.setFontSize(14);
    doc.text('Key Findings', 20, 40);
    
    // Create key metrics box
    doc.setFillColor(...this.colors.background);
    doc.setDrawColor(...this.colors.border);
    doc.roundedRect(20, 45, 170, 50, 3, 3, 'FD');
    
    doc.setFontSize(18);
    doc.setTextColor(...this.colors.accent);
    doc.text(`${savingsPercentage.toFixed(1)}% Total Cost Reduction`, 105, 60, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text(`${window.formatCurrency(savingsAmount)} Savings Over ${yearsToProject} Years`, 105, 75, { align: 'center' });
    
    // Implementation time savings
    if (results.implementationResults && results.implementationResults[currentVendor] && results.implementationResults['portnox']) {
      const currentImplementationTime = results.implementationResults[currentVendor];
      const portnoxImplementationTime = results.implementationResults['portnox'];
      const timeSavings = currentImplementationTime - portnoxImplementationTime;
      const timeSavingsPercentage = (timeSavings / currentImplementationTime) * 100;
      
      doc.text(`${timeSavingsPercentage.toFixed(0)}% Faster Implementation (${timeSavings} days)`, 105, 85, { align: 'center' });
    }
    
    // Add summary text
    doc.setFontSize(11);
    doc.setTextColor(...this.colors.text);
    doc.text('This analysis compares the Total Cost of Ownership (TCO) between your current', 20, 110);
    doc.text(`${currentResults.vendorName} NAC solution and Portnox Cloud over a ${yearsToProject}-year period.`, 20, 117);
    doc.text('The analysis includes all direct and indirect costs including hardware, software,', 20, 130);
    doc.text('maintenance, implementation, and ongoing operational expenses.', 20, 137);
    
    // Add TCO comparison table
    doc.setFontSize(14);
    doc.setTextColor(...this.colors.primary);
    doc.text('TCO Comparison', 20, 160);
    
    // Prepare table data
    const headers = ['Cost Category', currentResults.vendorName, 'Portnox Cloud', 'Savings'];
    
    const tableData = [
      ['Initial Costs',
        window.formatCurrency(currentResults.totalInitialCosts),
        window.formatCurrency(portnoxResults.totalInitialCosts),
        window.formatCurrency(currentResults.totalInitialCosts - portnoxResults.totalInitialCosts)
      ],
      ['Operational Costs (Annual)',
        window.formatCurrency(currentResults.annualCosts),
        window.formatCurrency(portnoxResults.annualCosts),
        window.formatCurrency(currentResults.annualCosts - portnoxResults.annualCosts)
      ],
      [`Total ${yearsToProject}-Year TCO`,
        window.formatCurrency(currentResults.totalCosts),
        window.formatCurrency(portnoxResults.totalCosts),
        window.formatCurrency(savingsAmount)
      ]
    ];
    
    // Create table
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 165,
      theme: 'grid',
      headStyles: {
        fillColor: this.colors.primary,
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      styles: {
        cellPadding: 5
      }
    });
    
    // Add key benefits section
    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(...this.colors.primary);
    doc.text('Key Benefits of Portnox Cloud', 20, 20);
    
    // Define benefits
    const benefits = [
      {
        title: 'Reduced Capital Expenditure',
        description: 'Zero hardware deployment eliminates upfront investments in appliances, servers, and infrastructure.',
        metric: '100% Hardware Cost Elimination'
      },
      {
        title: 'Simplified Deployment',
        description: 'Cloud-based architecture with lightweight connectors eliminates complex on-premises installations.',
        metric: `${results.implementationResults ? (results.implementationResults[currentVendor] - results.implementationResults['portnox']) : '60'} Days Faster Implementation`
      },
      {
        title: 'Lower Operational Overhead',
        description: 'Automated updates, maintenance, and scaling reduce IT staff time requirements.',
        metric: `${((currentResults.fteCost - portnoxResults.fteCost) / currentResults.fteCost * 100).toFixed(0)}% IT Staff Time Reduction`
      },
      {
        title: 'Multi-Location Efficiency',
        description: 'Single cloud instance manages all locations without requiring hardware at each site.',
        metric: 'Uniform Security Across All Locations'
      },
      {
        title: 'Continuous Compliance',
        description: 'Automated policy enforcement and comprehensive reporting ensure ongoing security compliance.',
        metric: 'Real-Time Compliance Monitoring'
      },
      {
        title: 'Future-Proof Solution',
        description: 'Automatic updates and new feature releases ensure the solution evolves with security needs.',
        metric: 'No Hardware Refresh Requirements'
      }
    ];
    
    // Create benefits grid
    let yPos = 30;
    benefits.forEach((benefit, index) => {
      // Check if we need to add a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFillColor(...this.colors.background);
      doc.setDrawColor(...this.colors.border);
      doc.roundedRect(20, yPos, 170, 32, 3, 3, 'FD');
      
      doc.setFontSize(12);
      doc.setTextColor(...this.colors.primary);
      doc.text(benefit.title, 25, yPos + 10);
      
      doc.setFontSize(10);
      doc.setTextColor(...this.colors.text);
      doc.text(benefit.description, 25, yPos + 20);
      
      doc.setFontSize(11);
      doc.setTextColor(...this.colors.accent);
      doc.text(benefit.metric, 25, yPos + 28);
      
      yPos += 40;
    });
    
    // Add recommendations
    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(...this.colors.primary);
    doc.text('Strategic Recommendations', 20, 20);
    
    doc.setFontSize(11);
    doc.setTextColor(...this.colors.text);
    
    const recommendations = [
      `Transition from ${currentResults.vendorName} to Portnox Cloud to achieve significant cost savings and operational efficiencies.`,
      'Leverage cloud-based NAC solution to reduce hardware costs and simplify deployment across multiple locations.',
      'Minimize IT staff overhead with a managed NAC solution that requires less administrative time.',
      'Improve security posture with automatic updates and seamless scaling capabilities.',
      'Implement a phased migration approach starting with non-critical network segments to minimize disruption.',
      `Reinvest the projected ${yearsToProject}-year savings of ${window.formatCurrency(savingsAmount)} in other critical security initiatives.`
    ];
    
    yPos = 30;
    recommendations.forEach(recommendation => {
      doc.circle(25, yPos - 2, 1.5, 'F');
      doc.text(recommendation, 30, yPos, { maxWidth: 160 });
      
      // Calculate height of wrapped text and adjust yPos accordingly
      const textLines = doc.splitTextToSize(recommendation, 160);
      yPos += textLines.length * 7;
    });
    
    // Add next steps section
    doc.setFontSize(14);
    doc.setTextColor(...this.colors.primary);
    doc.text('Next Steps', 20, yPos + 10);
    
    doc.setFontSize(11);
    doc.setTextColor(...this.colors.text);
    
    const nextSteps = [
      'Schedule a Portnox Cloud demo to see the solution in action',
      'Request a detailed migration plan customized to your environment',
      'Identify pilot deployment candidates for initial implementation',
      'Review detailed financial analysis for budgeting purposes'
    ];
    
    yPos += 20;
    nextSteps.forEach(step => {
      doc.setTextColor(...this.colors.accent);
      doc.text(`→`, 25, yPos);
      doc.setTextColor(...this.colors.text);
      doc.text(step, 30, yPos);
      yPos += 10;
    });
    
    // Add footer with page numbers
    this.addFooter(doc, 'Executive Summary');
  }
  
  /**
   * Generate financial analysis
   * Detailed cost breakdown for financial teams
   */
  generateFinancialAnalysis(doc, results, currentVendor, customerInfo) {
    // Get results data
    const currentResults = results[currentVendor];
    const portnoxResults = results['portnox'];
    const yearsToProject = results.yearsToProject;
    
    // Calculate key metrics
    const savingsAmount = currentResults.totalCosts - portnoxResults.totalCosts;
    const savingsPercentage = (savingsAmount / currentResults.totalCosts) * 100;
    
    // Create cover page
    this.createCoverPage(doc, 'Financial Analysis', results, currentVendor, customerInfo);
    
    // Add financial analysis title
    doc.addPage();
    doc.setFontSize(18);
    doc.setTextColor(...this.colors.primary);
    doc.text('Financial Analysis', 20, 20);
    
    // Add organization info
    doc.setFontSize(12);
    doc.setTextColor(...this.colors.text);
    doc.text('Organization Parameters', 20, 40);
    
    // Create parameters table
    const paramHeaders = ['Parameter', 'Value'];
    const paramData = [
      ['Device Count', results.deviceCount],
      ['Organization Size', results.orgSize.charAt(0).toUpperCase() + results.orgSize.slice(1)],
      ['Years Projected', yearsToProject],
      ['Multiple Locations', results.multipleLocations ? 'Yes' : 'No'],
      ['Location Count', results.locationCount],
      ['Complex Authentication', results.complexAuthentication ? 'Yes' : 'No'],
      ['Legacy Devices', results.legacyDevices ? 'Yes' : 'No'],
      ['Legacy Percentage', results.legacyPercentage + '%'],
      ['Cloud Integration', results.cloudIntegration ? 'Yes' : 'No']
    ];
    
    doc.autoTable({
      head: [paramHeaders],
      body: paramData,
      startY: 45,
      theme: 'plain',
      styles: {
        fontSize: 10
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 40 }
      }
    });
    
    // Add cost comparison table
    doc.setFontSize(14);
    doc.setTextColor(...this.colors.primary);
    doc.text('Cost Comparison', 20, doc.autoTable.previous.finalY + 15);
    
    // Prepare cost comparison table
    const costHeaders = ['Cost Component', currentResults.vendorName, 'Portnox Cloud', 'Savings', 'Savings %'];
    
    // Calculate individual savings
    const hardwareSavings = currentResults.hardwareCost - portnoxResults.hardwareCost;
    const networkRedesignSavings = currentResults.networkRedesignCost - portnoxResults.networkRedesignCost;
    const implementationSavings = currentResults.implementationCost - portnoxResults.implementationCost;
    const trainingSavings = currentResults.trainingCost - portnoxResults.trainingCost;
    const migrationCosts = -portnoxResults.migrationCost; // Migration is a cost, not a saving
    const maintenanceSavings = (currentResults.maintenanceCost - portnoxResults.maintenanceCost) * yearsToProject;
    const licensingSavings = (currentResults.licensingCost - portnoxResults.licensingCost) * yearsToProject;
    const fteSavings = (currentResults.fteCost - portnoxResults.fteCost) * yearsToProject;
    const downtimeSavings = (currentResults.annualDowntimeCost - portnoxResults.annualDowntimeCost) * yearsToProject;
    
    // Calculate savings percentages
    const hardwareSavingsPct = currentResults.hardwareCost > 0 ? (hardwareSavings / currentResults.hardwareCost) * 100 : 0;
    const networkRedesignSavingsPct = currentResults.networkRedesignCost > 0 ? (networkRedesignSavings / currentResults.networkRedesignCost) * 100 : 0;
    const implementationSavingsPct = currentResults.implementationCost > 0 ? (implementationSavings / currentResults.implementationCost) * 100 : 0;
    const trainingSavingsPct = currentResults.trainingCost > 0 ? (trainingSavings / currentResults.trainingCost) * 100 : 0;
    const migrationCostsPct = 'N/A';
    const maintenanceSavingsPct = currentResults.maintenanceCost > 0 ? (maintenanceSavings / (currentResults.maintenanceCost * yearsToProject)) * 100 : 0;
    const licensingSavingsPct = currentResults.licensingCost > 0 ? (licensingSavings / (currentResults.licensingCost * yearsToProject)) * 100 : 0;
    const fteSavingsPct = currentResults.fteCost > 0 ? (fteSavings / (currentResults.fteCost * yearsToProject)) * 100 : 0;
    const downtimeSavingsPct = currentResults.annualDowntimeCost > 0 ? (downtimeSavings / (currentResults.annualDowntimeCost * yearsToProject)) * 100 : 0;
    
    const costData = [
      ['Hardware Costs',
        window.formatCurrency(currentResults.hardwareCost),
        window.formatCurrency(portnoxResults.hardwareCost),
        window.formatCurrency(hardwareSavings),
        hardwareSavingsPct.toFixed(1) + '%'
      ],
      ['Network Redesign',
        window.formatCurrency(currentResults.networkRedesignCost),
        window.formatCurrency(portnoxResults.networkRedesignCost),
        window.formatCurrency(networkRedesignSavings),
        networkRedesignSavingsPct.toFixed(1) + '%'
      ],
      ['Implementation',
        window.formatCurrency(currentResults.implementationCost),
        window.formatCurrency(portnoxResults.implementationCost),
        window.formatCurrency(implementationSavings),
        implementationSavingsPct.toFixed(1) + '%'
      ],
      ['Training',
        window.formatCurrency(currentResults.trainingCost),
        window.formatCurrency(portnoxResults.trainingCost),
        window.formatCurrency(trainingSavings),
        trainingSavingsPct.toFixed(1) + '%'
      ],
      ['Migration Costs',
        window.formatCurrency(0),
        window.formatCurrency(portnoxResults.migrationCost),
        window.formatCurrency(migrationCosts),
        migrationCostsPct
      ],
      [`Maintenance (${yearsToProject} years)`,
        window.formatCurrency(currentResults.maintenanceCost * yearsToProject),
        window.formatCurrency(portnoxResults.maintenanceCost * yearsToProject),
        window.formatCurrency(maintenanceSavings),
        maintenanceSavingsPct.toFixed(1) + '%'
      ],
      [`Licensing (${yearsToProject} years)`,
        window.formatCurrency(currentResults.licensingCost * yearsToProject),
        window.formatCurrency(portnoxResults.licensingCost * yearsToProject),
        window.formatCurrency(licensingSavings),
        licensingSavingsPct.toFixed(1) + '%'
      ],
      [`Personnel (${yearsToProject} years)`,
        window.formatCurrency(currentResults.fteCost * yearsToProject),
        window.formatCurrency(portnoxResults.fteCost * yearsToProject),
        window.formatCurrency(fteSavings),
        fteSavingsPct.toFixed(1) + '%'
      ],
      [`Downtime (${yearsToProject} years)`,
        window.formatCurrency(currentResults.annualDowntimeCost * yearsToProject),
        window.formatCurrency(portnoxResults.annualDowntimeCost * yearsToProject),
        window.formatCurrency(downtimeSavings),
        downtimeSavingsPct.toFixed(1) + '%'
      ],
      [`Total ${yearsToProject}-Year TCO`,
        window.formatCurrency(currentResults.totalCosts),
        window.formatCurrency(portnoxResults.totalCosts),
        window.formatCurrency(savingsAmount),
        savingsPercentage.toFixed(1) + '%'
      ]
    ];
    
    doc.autoTable({
      head: [costHeaders],
      body: costData,
      startY: doc.autoTable.previous.finalY + 20,
      theme: 'grid',
      headStyles: {
        fillColor: this.colors.primary,
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 45 },
        1: { cellWidth: 35, halign: 'right' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' },
        4: { cellWidth: 30, halign: 'right' }
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      styles: {
        cellPadding: 5,
        fontSize: 8
      },
      didParseCell: function(data) {
        // Highlight total row
        if (data.row.index === costData.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [230, 230, 230];
        }
        
        // Highlight savings cells
        if (data.column.index === 3 || data.column.index === 4) {
          // Check if the value is a saving (positive) or cost (negative)
          if (data.row.index < costData.length - 1) { // Skip the total row
            const savingsText = costData[data.row.index][3];
            const savingsValue = parseFloat(savingsText.replace(/[^0-9.-]+/g, ''));
            if (savingsValue > 0) {
              data.cell.styles.textColor = [101, 189, 68]; // Green for savings
            } else if (savingsValue < 0) {
              data.cell.styles.textColor = [220, 53, 69]; // Red for costs
            }
          }
        }
      }
    });
    
    // Add annual costs breakdown
    doc.addPage();
    
    doc.setFontSize(14);
    doc.setTextColor(...this.colors.primary);
    doc.text('Annual Cost Breakdown', 20, 20);
    
    // Prepare annual costs table
	# Continuing with the enhanced-pdf-generator.js file:
cat >> js/reports/enhanced-pdf-generator.js << 'EOF'
    const annualHeaders = ['Annual Cost Component', currentResults.vendorName, 'Portnox Cloud', 'Annual Savings'];

    const annualData = [
      ['Maintenance',
        window.formatCurrency(currentResults.maintenanceCost),
        window.formatCurrency(portnoxResults.maintenanceCost),
        window.formatCurrency(currentResults.maintenanceCost - portnoxResults.maintenanceCost)
      ],
      ['Licensing',
        window.formatCurrency(currentResults.licensingCost),
        window.formatCurrency(portnoxResults.licensingCost),
        window.formatCurrency(currentResults.licensingCost - portnoxResults.licensingCost)
      ],
      ['Personnel (FTE)',
        window.formatCurrency(currentResults.fteCost),
        window.formatCurrency(portnoxResults.fteCost),
        window.formatCurrency(currentResults.fteCost - portnoxResults.fteCost)
      ],
      ['Downtime',
        window.formatCurrency(currentResults.annualDowntimeCost),
        window.formatCurrency(portnoxResults.annualDowntimeCost),
        window.formatCurrency(currentResults.annualDowntimeCost - portnoxResults.annualDowntimeCost)
      ],
      ['Total Annual Cost',
        window.formatCurrency(currentResults.annualCosts),
        window.formatCurrency(portnoxResults.annualCosts),
        window.formatCurrency(currentResults.annualCosts - portnoxResults.annualCosts)
      ]
    ];

    doc.autoTable({
      head: [annualHeaders],
      body: annualData,
      startY: 25,
      theme: 'grid',
      headStyles: {
        fillColor: this.colors.primary,
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      styles: {
        cellPadding: 5
      },
      didParseCell: function(data) {
        // Highlight total row
        if (data.row.index === annualData.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [230, 230, 230];
        }
        
        // Highlight savings cells
        if (data.column.index === 3) {
          const savingsText = annualData[data.row.index][3];
          const savingsValue = parseFloat(savingsText.replace(/[^0-9.-]+/g, ''));
          if (savingsValue > 0) {
            data.cell.styles.textColor = [101, 189, 68]; // Green for savings
          } else if (savingsValue < 0) {
            data.cell.styles.textColor = [220, 53, 69]; // Red for costs
          }
        }
      }
    });

    // Add ROI analysis
    doc.setFontSize(14);
    doc.setTextColor(...this.colors.primary);
    doc.text('Return on Investment Analysis', 20, doc.autoTable.previous.finalY + 20);

    // Calculate ROI metrics
    const initialInvestment = portnoxResults.totalInitialCosts - currentResults.totalInitialCosts;
    const annualSavings = currentResults.annualCosts - portnoxResults.annualCosts;

    // Only calculate if there are annual savings
    if (annualSavings > 0) {
      const breakEvenYears = initialInvestment > 0 ? initialInvestment / annualSavings : 0;
      const breakEvenMonths = Math.round(breakEvenYears * 12);

      const roi = ((savingsAmount - initialInvestment) / Math.max(initialInvestment, 1)) * 100;

      // Draw ROI box
      doc.setDrawColor(...this.colors.border);
      doc.setFillColor(...this.colors.background);
      doc.roundedRect(20, doc.autoTable.previous.finalY + 25, 170, 50, 3, 3, 'FD');

      // Add ROI metrics
      doc.setFontSize(12);
      doc.setTextColor(...this.colors.text);

      doc.text(`Initial Investment Difference: ${window.formatCurrency(initialInvestment)}`, 30, doc.autoTable.previous.finalY + 35);
      doc.text(`Annual Savings: ${window.formatCurrency(annualSavings)}`, 30, doc.autoTable.previous.finalY + 45);
      doc.text(`Break-even Point: ${breakEvenMonths} months (${breakEvenYears.toFixed(1)} years)`, 30, doc.autoTable.previous.finalY + 55);
      doc.text(`${yearsToProject}-Year ROI: ${roi.toFixed(1)}%`, 30, doc.autoTable.previous.finalY + 65);

      // Add NPV analysis if initial investment is positive
      if (initialInvestment > 0) {
        doc.setFontSize(14);
        doc.setTextColor(...this.colors.primary);
        doc.text('NPV Analysis', 20, doc.autoTable.previous.finalY + 85);

        // Assume 10% discount rate
        const discountRate = 0.10;

        // Calculate NPV
        let npv = -initialInvestment;
        for (let i = 1; i <= yearsToProject; i++) {
          npv += annualSavings / Math.pow(1 + discountRate, i);
        }

        // Draw NPV box
        doc.setDrawColor(...this.colors.border);
        doc.setFillColor(...this.colors.background);
        doc.roundedRect(20, doc.autoTable.previous.finalY + 90, 170, 40, 3, 3, 'FD');

        // Add NPV metrics
        doc.setFontSize(12);
        doc.setTextColor(...this.colors.text);

        doc.text(`Discount Rate: 10%`, 30, doc.autoTable.previous.finalY + 100);
        doc.text(`Net Present Value (NPV): ${window.formatCurrency(npv)}`, 30, doc.autoTable.previous.finalY + 110);
        doc.text(`NPV-to-Investment Ratio: ${(npv / initialInvestment).toFixed(2)}`, 30, doc.autoTable.previous.finalY + 120);
      }
    } else {
      // If no annual savings, indicate immediate savings
      doc.setFontSize(12);
      doc.setTextColor(...this.colors.text);
      doc.text('Portnox provides immediate cost advantages with both lower initial and ongoing costs.', 20, doc.autoTable.previous.finalY + 35);
      doc.text(`No break-even analysis needed as there is immediate ${savingsPercentage.toFixed(1)}% savings.`, 20, doc.autoTable.previous.finalY + 45);
    }

    // Add budget impact section
    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(...this.colors.primary);
    doc.text('Budgetary Impact', 20, 20);

    // Create a simple table showing yearly costs for both solutions
    const budgetHeaders = ['Year', currentResults.vendorName, 'Portnox Cloud', 'Annual Savings', 'Cumulative Savings'];
    const budgetData = [];

    // Initial year (Year 0)
    budgetData.push([
      'Initial Deployment',
      window.formatCurrency(currentResults.totalInitialCosts),
      window.formatCurrency(portnoxResults.totalInitialCosts),
      window.formatCurrency(currentResults.totalInitialCosts - portnoxResults.totalInitialCosts),
      window.formatCurrency(currentResults.totalInitialCosts - portnoxResults.totalInitialCosts)
    ]);

    // Subsequent years
    let cumulativeSavings = currentResults.totalInitialCosts - portnoxResults.totalInitialCosts;
    for (let i = 1; i <= yearsToProject; i++) {
      const annualSaving = currentResults.annualCosts - portnoxResults.annualCosts;
      cumulativeSavings += annualSaving;

      budgetData.push([
        `Year ${i}`,
        window.formatCurrency(currentResults.annualCosts),
        window.formatCurrency(portnoxResults.annualCosts),
        window.formatCurrency(annualSaving),
        window.formatCurrency(cumulativeSavings)
      ]);
    }

    // Total row
    budgetData.push([
      `Total (${yearsToProject} Years)`,
      window.formatCurrency(currentResults.totalCosts),
      window.formatCurrency(portnoxResults.totalCosts),
      window.formatCurrency(savingsAmount),
      ''
    ]);

    doc.autoTable({
      head: [budgetHeaders],
      body: budgetData,
      startY: 30,
      theme: 'grid',
      headStyles: {
        fillColor: this.colors.primary,
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      styles: {
        cellPadding: 5
      },
      didParseCell: function(data) {
        // Highlight total row
        if (data.row.index === budgetData.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [230, 230, 230];
        }
        
        // Highlight savings cells
        if (data.column.index === 3 || data.column.index === 4) {
          const savingsText = data.row.raw[data.column.index];
          if (savingsText) {
            const savingsValue = parseFloat(savingsText.replace(/[^0-9.-]+/g, ''));
            if (savingsValue > 0) {
              data.cell.styles.textColor = [101, 189, 68]; // Green for savings
            } else if (savingsValue < 0) {
              data.cell.styles.textColor = [220, 53, 69]; // Red for costs
            }
          }
        }
      }
    });

    // Add financial summary
    doc.setFontSize(14);
    doc.setTextColor(...this.colors.primary);
    doc.text('Financial Summary', 20, doc.autoTable.previous.finalY + 20);

    doc.setFontSize(11);
    doc.setTextColor(...this.colors.text);
    
    const summary = [
      `The financial analysis shows a total cost of ownership reduction of ${savingsPercentage.toFixed(1)}% over ${yearsToProject} years by migrating from ${currentResults.vendorName} to Portnox Cloud.`,
      `This represents a total savings of ${window.formatCurrency(savingsAmount)} that could be reallocated to other strategic initiatives.`,
      `The cloud-based architecture eliminates hardware costs and reduces ongoing maintenance and IT staff requirements.`,
      `The subscription-based pricing model converts capital expenditures to operational expenditures, improving budget predictability.`
    ];

    let yPos = doc.autoTable.previous.finalY + 30;
    summary.forEach(paragraph => {
      doc.text(paragraph, 20, yPos, { maxWidth: 170 });
      yPos += 12;
    });

    // Add footer with page numbers
    this.addFooter(doc, 'Financial Analysis');
  }
  
  /**
   * Generate technical report
   * Implementation and technical details for IT teams
   */
  generateTechnicalReport(doc, results, currentVendor, customerInfo) {
    // Get results data
    const currentResults = results[currentVendor];
    const portnoxResults = results['portnox'];
    const yearsToProject = results.yearsToProject;

    // Create cover page
    this.createCoverPage(doc, 'Technical Report', results, currentVendor, customerInfo);

    // Add technical overview
    doc.addPage();
    doc.setFontSize(18);
    doc.setTextColor(...this.colors.primary);
    doc.text('Technical Report', 20, 20);

    doc.setFontSize(14);
    doc.text('Environment Details', 20, 40);

    // Create environment table
    const envHeaders = ['Parameter', 'Value'];
    const envData = [
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

    doc.autoTable({
      head: [envHeaders],
      body: envData,
      startY: 45,
      theme: 'plain',
      styles: {
        fontSize: 10
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 40 }
      }
    });

    // Add implementation comparison
    doc.setFontSize(14);
    doc.setTextColor(...this.colors.primary);
    doc.text('Implementation Comparison', 20, doc.autoTable.previous.finalY + 15);

    // Get implementation timeline data
    const vendorData = window.vendorData || {};
    const currentVendorData = vendorData[currentVendor] || {};
    const portnoxData = vendorData['portnox'] || {};

    if (currentVendorData && portnoxData) {
      const orgSize = results.orgSize || 'medium';

      const currentTimeline = currentVendorData[orgSize]?.implementationTimeline || {};
      const portnoxTimeline = portnoxData[orgSize]?.implementationTimeline || {};

      // Combine all phase names
      const phases = new Set([...Object.keys(currentTimeline), ...Object.keys(portnoxTimeline)]);

      // Prepare implementation table
      const implHeaders = ['Implementation Phase', currentResults.vendorName, 'Portnox Cloud', 'Time Savings'];
      const implData = [];

      // Add rows for each phase
      phases.forEach(phase => {
        const currentDays = currentTimeline[phase] || 0;
        const portnoxDays = portnoxTimeline[phase] || 0;
        const savings = currentDays - portnoxDays;

        implData.push([
          phase.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
          currentDays + ' days',
          portnoxDays + ' days',
          savings > 0 ? savings + ' days' : '-'
        ]);
      });

      // Add total row
      const currentTotal = Object.values(currentTimeline).reduce((sum, days) => sum + days, 0);
      const portnoxTotal = Object.values(portnoxTimeline).reduce((sum, days) => sum + days, 0);
      const totalSavings = currentTotal - portnoxTotal;

      implData.push([
        'Total Implementation Time',
        currentTotal + ' days',
        portnoxTotal + ' days',
        totalSavings > 0 ? totalSavings + ' days' : '-'
      ]);

      doc.autoTable({
        head: [implHeaders],
        body: implData,
        startY: doc.autoTable.previous.finalY + 20,
        theme: 'grid',
        headStyles: {
          fillColor: this.colors.primary,
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        styles: {
          cellPadding: 5
        },
        didParseCell: function(data) {
          // Highlight total row
          if (data.row.index === implData.length - 1) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [230, 230, 230];
          }
          
          // Highlight savings cells
          if (data.column.index === 3) {
            const savingsText = data.row.raw[data.column.index];
            if (savingsText && savingsText !== '-') {
              data.cell.styles.textColor = [101, 189, 68]; // Green for savings
            }
          }
        }
      });
    }

    // Add architecture comparison
    doc.addPage();

    doc.setFontSize(14);
    doc.setTextColor(...this.colors.primary);
    doc.text('Architecture Comparison', 20, 20);

    // Create Cloud vs On-Premises comparison table
    const archHeaders = ['Feature', 'On-Premises NAC', 'Portnox Cloud'];

    const archData = [
      ['Deployment Model', 'Hardware appliances', 'SaaS solution, no hardware'],
      ['Initial Setup', '2-4 weeks typical setup time', 'Same-day deployment'],
      ['Redundancy', 'Requires additional hardware', 'Built-in cloud redundancy'],
      ['Updates & Patching', 'Manual update process', 'Automatic updates'],
      ['Scalability', 'Requires hardware sizing', 'Unlimited elastic scaling'],
      ['Multi-Location Support', 'Requires hardware at each site', 'Single cloud instance for all sites'],
      ['Remote Access', 'VPN or additional appliances', 'Native anywhere access'],
      ['Disaster Recovery', 'Requires separate DR site', 'Built-in geo-redundancy'],
      ['Administrator Overhead', 'High maintenance requirements', 'Minimal administration'],
      ['Implementation Complexity', 'Complex network integration', 'Simple cloud connector model']
    ];

    doc.autoTable({
      head: [archHeaders],
      body: archData,
      startY: 25,
      theme: 'grid',
      headStyles: {
        fillColor: this.colors.primary,
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 70 },
        2: { cellWidth: 70 }
      },
      styles: {
        cellPadding: 5
      },
      didParseCell: function(data) {
        // Highlight cloud advantages
        if (data.column.index === 2) {
          data.cell.styles.textColor = [101, 189, 68]; // Green for Portnox advantages
        }
      }
    });

    // Add migration plan
    doc.setFontSize(14);
    doc.setTextColor(...this.colors.primary);
    doc.text('Migration Plan', 20, doc.autoTable.previous.finalY + 20);

    // Define migration phases
    const migrationPhases = [
      {
        phase: 'Assessment & Discovery',
        description: 'Evaluate current environment, identify devices, authentication methods, and network topology.',
        duration: '3-5 days'
      },
      {
        phase: 'Architecture Planning',
        description: 'Design authentication flows and integration points for cloud NAC solution.',
        duration: '3-5 days'
      },
      {
        phase: 'Portnox Cloud Setup',
        description: 'Configure cloud portal, authentication methods, and deploy local connectors.',
        duration: '1-2 days'
      },
      {
        phase: 'Policy Migration',
        description: 'Transfer and adapt existing policies to the cloud platform.',
        duration: '2-4 days'
      },
      {
        phase: 'Pilot Deployment',
        description: 'Test with limited device groups to verify configuration and policy enforcement.',
        duration: '3-5 days'
      },
      {
        phase: 'Full Deployment',
        description: 'Expand to all network segments and user groups, phase out legacy solution.',
        duration: '5-10 days'
      }
    ];

    // Create migration plan table
    const migrationHeaders = ['Phase', 'Description', 'Estimated Duration'];
    const migrationData = migrationPhases.map(phase => [
      phase.phase,
      phase.description,
      phase.duration
    ]);

    doc.autoTable({
      head: [migrationHeaders],
      body: migrationData,
      startY: doc.autoTable.previous.finalY + 25,
      theme: 'grid',
      headStyles: {
        fillColor: this.colors.primary,
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 100 },
        2: { cellWidth: 40 }
      },
      styles: {
        cellPadding: 5
      }
    });

    // Add IT resource utilization comparison
    doc.addPage();

    doc.setFontSize(14);
    doc.setTextColor(...this.colors.primary);
    doc.text('IT Resource Utilization Comparison', 20, 20);

    // Get FTE allocation
    const currentFTE = currentVendorData[orgSize]?.fteAllocation || {};
    const portnoxFTE = portnoxData[orgSize]?.fteAllocation || {};

    // Create FTE comparison table
    const fteHeaders = ['IT Role', currentResults.vendorName, 'Portnox Cloud', 'FTE Reduction'];

    const fteData = [
      ['Network Administrator',
        (currentFTE.networkAdmin || 0.5).toFixed(2) + ' FTE',
        (portnoxFTE.networkAdmin || 0.2).toFixed(2) + ' FTE',
        ((currentFTE.networkAdmin || 0.5) - (portnoxFTE.networkAdmin || 0.2)).toFixed(2) + ' FTE'
      ],
      ['Security Administrator',
        (currentFTE.securityAdmin || 0.4).toFixed(2) + ' FTE',
        (portnoxFTE.securityAdmin || 0.15).toFixed(2) + ' FTE',
        ((currentFTE.securityAdmin || 0.4) - (portnoxFTE.securityAdmin || 0.15)).toFixed(2) + ' FTE'
      ],
      ['System Administrator',
        (currentFTE.systemAdmin || 0.3).toFixed(2) + ' FTE',
        (portnoxFTE.systemAdmin || 0.05).toFixed(2) + ' FTE',
        ((currentFTE.systemAdmin || 0.3) - (portnoxFTE.systemAdmin || 0.05)).toFixed(2) + ' FTE'
      ],
      ['Help Desk',
        (currentFTE.helpDesk || 0.1).toFixed(2) + ' FTE',
        (portnoxFTE.helpDesk || 0.05).toFixed(2) + ' FTE',
        ((currentFTE.helpDesk || 0.1) - (portnoxFTE.helpDesk || 0.05)).toFixed(2) + ' FTE'
      ],
      ['Total IT Staff',
        ((currentFTE.networkAdmin || 0.5) + (currentFTE.securityAdmin || 0.4) +
         (currentFTE.systemAdmin || 0.3) + (currentFTE.helpDesk || 0.1)).toFixed(2) + ' FTE',
        ((portnoxFTE.networkAdmin || 0.2) + (portnoxFTE.securityAdmin || 0.15) +
         (portnoxFTE.systemAdmin || 0.05) + (portnoxFTE.helpDesk || 0.05)).toFixed(2) + ' FTE',
        (((currentFTE.networkAdmin || 0.5) + (currentFTE.securityAdmin || 0.4) +
          (currentFTE.systemAdmin || 0.3) + (currentFTE.helpDesk || 0.1)) -
         ((portnoxFTE.networkAdmin || 0.2) + (portnoxFTE.securityAdmin || 0.15) +
          (portnoxFTE.systemAdmin || 0.05) + (portnoxFTE.helpDesk || 0.05))).toFixed(2) + ' FTE'
      ]
    ];

    doc.autoTable({
      head: [fteHeaders],
      body: fteData,
      startY: 25,
      theme: 'grid',
      headStyles: {
        fillColor: this.colors.primary,
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      styles: {
        cellPadding: 5
      },
      didParseCell: function(data) {
        // Highlight total row
        if (data.row.index === fteData.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [230, 230, 230];
        }
        
        // Highlight reduction cells
        if (data.column.index === 3) {
          data.cell.styles.textColor = [101, 189, 68]; // Green for reduction
        }
      }
    });

    // Add feature comparison section
    doc.setFontSize(14);
    doc.setTextColor(...this.colors.primary);
    doc.text('Feature Comparison', 20, doc.autoTable.previous.finalY + 20);
    
    // Create feature comparison table
    const featureHeaders = ['Feature', currentResults.vendorName, 'Portnox Cloud'];
    
    const featureData = [
      ['Deployment Model', 'On-premises hardware', 'Cloud SaaS'],
      ['Authentication Support', '802.1X, MAC, Web Portal', '802.1X, MAC, Web Portal, SAML, Certificate'],
      ['Multi-factor Authentication', 'Limited', 'Comprehensive'],
      ['BYOD Support', 'Basic', 'Advanced'],
      ['Guest Access', 'Yes', 'Yes, with self-service'],
      ['IoT Device Support', 'Basic', 'Advanced profiling'],
      ['Integration Capabilities', 'Limited APIs', 'Extensive API support'],
      ['HA/DR Capabilities', 'Requires additional hardware', 'Built-in redundancy'],
      ['Automatic Updates', 'Manual process', 'Automatic'],
      ['Compliance Reporting', 'Basic', 'Comprehensive']
    ];
    
    doc.autoTable({
      head: [featureHeaders],
      body: featureData,
      startY: doc.autoTable.previous.finalY + 25,
      theme: 'grid',
      headStyles: {
        fillColor: this.colors.primary,
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      styles: {
        cellPadding: 5
      }
    });

    // Add technical recommendations
    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(...this.colors.primary);
    doc.text('Technical Recommendations', 20, 20);

    const recommendations = [
      {
        title: 'Phase Migration Approach',
        details: 'Implement a phased migration starting with non-critical segments to validate configurations and minimize disruption.'
      },
      {
        title: 'Authentication Integration',
        details: 'Leverage existing Active Directory/LDAP infrastructure with SAML or RADIUS for seamless authentication.'
      },
      {
        title: 'Policy Migration Strategy',
        details: 'Document existing policies and map to Portnox equivalent constructs, prioritizing critical security policies.'
      },
      {
        title: 'Network Visibility',
        details: 'Deploy cloud connectors at strategic network locations to ensure comprehensive device visibility.'
      },
      {
        title: 'Testing Methodology',
        details: 'Implement A/B testing between current NAC and Portnox to validate policy enforcement before full cutover.'
      },
      {
        title: 'Legacy System Handling',
        details: 'Create custom policies for legacy devices that cannot support modern authentication methods.'
      }
    ];

    let yPos = 30;
    recommendations.forEach(recommendation => {
      doc.setFontSize(12);
      doc.setTextColor(...this.colors.primary);
      doc.setFont(undefined, 'bold');
      doc.text(recommendation.title, 20, yPos);
      doc.setFont(undefined, 'normal');

      doc.setFontSize(10);
      doc.setTextColor(...this.colors.text);
      doc.text(recommendation.details, 25, yPos + 7, { maxWidth: 165 });

      yPos += 20;
    });

    // Add technical benefits section
    doc.setFontSize(14);
    doc.setTextColor(...this.colors.primary);
    doc.text('Technical Benefits', 20, yPos + 10);

    const benefits = [
      'Simplified architecture with cloud-based management',
      'Reduced hardware footprint and associated maintenance',
      'Automatic updates and new feature rollouts',
      'Improved scalability and performance',
      'Enhanced monitoring and reporting capabilities',
      'Reduced IT staff time for routine management tasks',
      'Greater flexibility for remote and distributed workforces',
      'More comprehensive device profiling and control',
      'Simplified integration with other security tools',
      'Faster response to emerging threats and vulnerabilities'
    ];

    yPos += 20;
    benefits.forEach(benefit => {
      doc.setFontSize(10);
      doc.setTextColor(...this.colors.text);
      doc.circle(25, yPos - 2, 1.5, 'F');
      doc.text(benefit, 30, yPos);
      yPos += 10;
    });

    // Add footer with page numbers
    this.addFooter(doc, 'Technical Report');
  }
  
  /**
   * Generate compliance report
   * Specialized report focusing on compliance aspects
   */
  generateComplianceReport(doc, results, currentVendor, customerInfo, industryData) {
    // Get results data
    const currentResults = results[currentVendor];
    const portnoxResults = results['portnox'];
    const yearsToProject = results.yearsToProject;
    
    // Create cover page
    this.createCoverPage(doc, 'Compliance Report', results, currentVendor, customerInfo);
    
    // Add compliance overview
    doc.addPage();
    doc.setFontSize(18);
    doc.setTextColor(...this.colors.primary);
    doc.text('Compliance Requirements Overview', 20, 20);
    
    if (!industryData) {
      // Generic compliance information if industry data is not available
      doc.setFontSize(12);
      doc.setTextColor(...this.colors.text);
      doc.text('Network Access Control solutions are critical components for maintaining', 20, 40);
      doc.text('regulatory compliance across multiple frameworks including PCI DSS, HIPAA,', 20, 47);
      doc.text('NIST, ISO 27001, and other industry-specific regulations.', 20, 54);
      
      // Add general compliance requirements
      doc.setFontSize(14);
      doc.setTextColor(...this.colors.primary);
      doc.text('Key Compliance Requirements Addressed by NAC', 20, 74);
      
      const requirements = [
        'Access Control: Implement technical controls to restrict network access to authorized devices and users',
        'Authentication: Enforce strong authentication mechanisms appropriate to the level of risk',
        'Asset Management: Maintain inventory of devices connecting to the network',
        'Monitoring: Continuously monitor network access events and policy violations',
        'Audit Logging: Generate detailed logs of all authentication and authorization activities',
        'Network Segmentation: Enforce separation between different security zones',
        'Vulnerability Management: Identify and isolate non-compliant or vulnerable devices'
      ];
      
      let yPos = 84;
      requirements.forEach(requirement => {
        doc.setFontSize(10);
        doc.setTextColor(...this.colors.text);
        doc.circle(25, yPos - 2, 1.5, 'F');
        doc.text(requirement, 30, yPos, { maxWidth: 160 });
        
        // Calculate height of wrapped text and adjust yPos accordingly
        const textLines = doc.splitTextToSize(requirement, 160);
        yPos += textLines.length * 7;
      });
    } else {
      // Industry-specific compliance information
      doc.setFontSize(12);
      doc.setTextColor(...this.colors.text);
      doc.text(industryData.complianceInfo.details, 20, 40, { maxWidth: 170 });
      
      // Add industry-specific requirements
      doc.setFontSize(14);
      doc.setTextColor(...this.colors.primary);
      doc.text('Key Compliance Requirements', 20, 70);
      
      let yPos = 80;
      industryData.complianceInfo.keyRequirements.forEach(requirement => {
        doc.setFontSize(10);
        doc.setTextColor(...this.colors.text);
        doc.circle(25, yPos - 2, 1.5, 'F');
        doc.text(requirement, 30, yPos);
        yPos += 10;
      });
      
      // Add applicable regulations
      doc.setFontSize(14);
      doc.setTextColor(...this.colors.primary);
      doc.text('Applicable Regulations', 20, yPos + 10);
      
      const regHeaders = ['Regulation', 'Description', 'NAC Relevance'];
      const regData = industryData.complianceInfo.regulations.map(reg => [
        reg.name,
        reg.description,
        reg.relevance
      ]);
      
      doc.autoTable({
        head: [regHeaders],
        body: regData,
        startY: yPos + 20,
        theme: 'grid',
        headStyles: {
          fillColor: this.colors.primary,
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 70 },
          2: { cellWidth: 70 }
        },
        styles: {
          cellPadding: 5,
          fontSize: 9
        }
      });
    }
    
    // Add compliance gap analysis
    doc.addPage();
    doc.setFontSize(18);
    doc.setTextColor(...this.colors.primary);
    doc.text('Compliance Gap Analysis', 20, 20);
    
    // Create comparison table for compliance capabilities
    doc.setFontSize(14);
    doc.text('Compliance Capabilities Comparison', 20, 40);
    
    const complianceHeaders = ['Compliance Capability', currentResults.vendorName, 'Portnox Cloud'];
    
    const complianceData = [
      ['Authentication Management', 'Basic methods', 'Comprehensive methods including MFA'],
      ['Detailed Audit Logging', 'Limited retention', 'Extended retention with search'],
      ['Real-time Compliance Checks', 'Limited', 'Comprehensive'],
      ['Automated Remediation', 'Basic', 'Advanced'],
      ['Reporting Capabilities', 'Manual report generation', 'Automated compliance reports'],
      ['Integration with SIEM', 'Limited', 'Comprehensive API'],
      ['Policy Consistency', 'Varies by location', 'Uniform across all locations'],
      ['Compliance Dashboards', 'Basic', 'Advanced with drill-down'],
      ['Continuous Monitoring', 'Periodic', 'Real-time'],
      ['Device Authentication Options', 'Limited', 'Extensive']
    ];
    
    doc.autoTable({
      head: [complianceHeaders],
      body: complianceData,
      startY: 45,
      theme: 'grid',
      headStyles: {
        fillColor: this.colors.primary,
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      styles: {
        cellPadding: 5
      },
      didParseCell: function(data) {
        // Highlight Portnox advantages
        if (data.column.index === 2) {
          data.cell.styles.textColor = [101, 189, 68]; // Green for Portnox advantages
        }
      }
    });
    
    // Add compliance improvement section
    doc.setFontSize(14);
    doc.setTextColor(...this.colors.primary);
    doc.text('Compliance Improvements with Cloud NAC', 20, doc.autoTable.previous.finalY + 20);
    
    const improvements = [
      {
        title: 'Centralized Policy Management',
        description: 'Ensures consistent application of security policies across all network segments and locations from a single management console.'
      },
      {
        title: 'Enhanced Visibility',
        description: 'Provides comprehensive visibility into all connected devices, their security posture, and compliance status in real time.'
      },
      {
        title: 'Automated Compliance Enforcement',
        description: 'Automatically enforces security policies and quarantines non-compliant devices without manual intervention.'
      },
      {
        title: 'Comprehensive Audit Trail',
        description: 'Maintains detailed logs of all authentication and authorization events to support audit requirements.'
      },
      {
        title: 'Continuous Compliance Monitoring',
        description: 'Continuously monitors device compliance status and detects changes that may affect security posture.'
      },
      {
        title: 'Simplified Compliance Reporting',
        description: 'Provides pre-built reports aligned with common regulatory frameworks to streamline audit processes.'
      }
    ];
    
    let yPos = doc.autoTable.previous.finalY + 35;
    improvements.forEach(improvement => {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 30;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(...this.colors.primary);
      doc.setFont(undefined, 'bold');
      doc.text(improvement.title, 20, yPos);
      doc.setFont(undefined, 'normal');
      
      doc.setFontSize(10);
      doc.setTextColor(...this.colors.text);
      doc.text(improvement.description, 25, yPos + 7, { maxWidth: 165 });
      
      yPos += 25;
    });
    
    // Add industry-specific challenges mitigated section if available
    if (industryData && industryData.challengesMitigated) {
      doc.addPage();
      doc.setFontSize(14);
      doc.setTextColor(...this.colors.primary);
      doc.text('Industry-Specific Challenges Mitigated', 20, 20);
      
      let yPos = 35;
      industryData.challengesMitigated.forEach(challenge => {
        doc.setFontSize(12);
        doc.setTextColor(...this.colors.primary);
        doc.setFont(undefined, 'bold');
        doc.text(challenge.challenge, 20, yPos);
        doc.setFont(undefined, 'normal');
        
        doc.setFontSize(10);
        doc.setTextColor(...this.colors.text);
        doc.text(challenge.mitigation, 25, yPos + 7, { maxWidth: 165 });
        
        yPos += 25;
      });
    }
    
    // Add benchmarking if available
    if (industryData && industryData.benchmarks) {
      const benchmarks = industryData.benchmarks;
      
      doc.setFontSize(14);
      doc.setTextColor(...this.colors.primary);
      
      if (yPos > 200) {
        doc.addPage();
        yPos = 20;
      } else {
        yPos += 10;
      }
      
      doc.text('Industry Benchmarking', 20, yPos);
      
      // Create benchmark table
      const benchmarkHeaders = ['Metric', 'Industry Average', 'Your Projected Results', 'Improvement'];
      
      const averageTCO = benchmarks.averageTCO || 3000000;
      const tcoDifference = averageTCO - portnoxResults.totalCosts;
      const tcoPercentage = (tcoDifference / averageTCO) * 100;
      
      const averageImplementationTime = benchmarks.implementationTime || 150;
      const timeProjected = results.implementationResults?.['portnox'] || 60;
      const timeDifference = averageImplementationTime - timeProjected;
      const timePercentage = (timeDifference / averageImplementationTime) * 100;
      
      const averageFTECost = benchmarks.fteCost || 500000;
      const fteProjected = portnoxResults.fteCost * yearsToProject;
      const fteDifference = averageFTECost - fteProjected;
      const ftePercentage = (fteDifference / averageFTECost) * 100;
      
      const benchmarkData = [
        ['Total Cost of Ownership',
          window.formatCurrency(averageTCO),
          window.formatCurrency(portnoxResults.totalCosts),
          tcoPercentage.toFixed(1) + '% below average'
        ],
        ['Implementation Time',
          averageImplementationTime + ' days',
          timeProjected + ' days',
          timePercentage.toFixed(1) + '% faster'
        ],
        ['IT Staff Costs',
          window.formatCurrency(averageFTECost),
          window.formatCurrency(fteProjected),
          ftePercentage.toFixed(1) + '% lower'
        ]
      ];
      
      doc.autoTable({
        head: [benchmarkHeaders],
        body: benchmarkData,
        startY: yPos + 10,
        theme: 'grid',
        headStyles: {
          fillColor: this.colors.primary,
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        styles: {
          cellPadding: 5
        },
        didParseCell: function(data) {
          // Highlight improvements
          if (data.column.index === 3) {
            data.cell.styles.textColor = [101, 189, 68]; // Green for improvements
          }
        }
      });
    }
    
    // Add compliance recommendations
    doc.addPage();
    doc.setFontSize(18);
    doc.setTextColor(...this.colors.primary);
    doc.text('Compliance Recommendations', 20, 20);
    
    doc.setFontSize(11);
    doc.setTextColor(...this.colors.text);
    doc.text('To maximize compliance benefits from implementing Portnox Cloud NAC, consider the following recommendations:', 20, 35, { maxWidth: 170 });
    
    const recommendations = [
      {
        title: 'Map Compliance Requirements to NAC Policies',
        description: 'Document specific compliance requirements applicable to your organization and map them to NAC policies to ensure comprehensive coverage.'
      },
      {
        title: 'Develop a Phased Implementation Plan',
        description: 'Create a phased approach that prioritizes critical assets and compliance requirements to minimize disruption and maximize security benefits.'
      },
      {
        title: 'Integrate with Existing Security Tools',
        description: 'Leverage Portnox Cloud\'s API capabilities to integrate with SIEM, vulnerability management, and other security tools for a unified security approach.'
      },
      {
        title: 'Establish Compliance Reporting Procedures',
        description: 'Define regular compliance reporting procedures that utilize Portnox Cloud\'s reporting capabilities to support ongoing compliance verification.'
      },
      {
        title: 'Create Role-Based Administration',
        description: 'Define role-based access controls within the NAC management console to comply with least privilege principles.'
      },
      {
        title: 'Document NAC Controls for Auditors',
        description: 'Create comprehensive documentation that maps NAC controls to specific compliance requirements for auditor review.'
      },
      {
        title: 'Test Compliance Scenarios',
        description: 'Regularly test compliance scenarios to validate that NAC policies correctly enforce regulatory requirements.'
      }
    ];
    
    let yPos = 50;
    recommendations.forEach(recommendation => {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(...this.colors.primary);
      doc.setFont(undefined, 'bold');
      doc.text(recommendation.title, 20, yPos);
      doc.setFont(undefined, 'normal');
      
      doc.setFontSize(10);
      doc.setTextColor(...this.colors.text);
      doc.text(recommendation.description, 25, yPos + 7, { maxWidth: 165 });
      
      yPos += 25;
    });
    
    // Add footer with page numbers
    this.addFooter(doc, 'Compliance Report');
  }
  
  /**
   * Generate complete report
   * Comprehensive TCO analysis with all sections
   */
  generateCompleteReport(doc, results, currentVendor, customerInfo) {
    // Create cover page
    this.createCoverPage(doc, 'Complete TCO Analysis', results, currentVendor, customerInfo);

    // Add table of contents
    doc.addPage();
    this.createTableOfContents(doc);

    // Add executive summary (simplified version)
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(...this.colors.primary);
    doc.text('1. Executive Summary', 20, 20);

    // Include executive content (simpler version)
    const currentResults = results[currentVendor];
    const portnoxResults = results['portnox'];
    const yearsToProject = results.yearsToProject;

    // Calculate key metrics
    const savingsAmount = currentResults.totalCosts - portnoxResults.totalCosts;
    const savingsPercentage = (savingsAmount / currentResults.totalCosts) * 100;

    doc.setFontSize(10);
    doc.setTextColor(...this.colors.text);
    doc.text(`This report analyzes the total cost of ownership (TCO) for Network Access Control solutions,`, 20, 35);
    doc.text(`comparing ${currentResults.vendorName} with Portnox Cloud for an organization with ${results.deviceCount} devices`, 20, 42);
    doc.text(`over a ${yearsToProject}-year period.`, 20, 49);

    // Create key metrics box
    doc.setDrawColor(...this.colors.border);
    doc.setFillColor(...this.colors.background);
    doc.roundedRect(20, 60, 170, 50, 3, 3, 'FD');

    doc.setFontSize(14);
    doc.setTextColor(...this.colors.accent);
    doc.text(`${savingsPercentage.toFixed(1)}% Total Cost Reduction with Portnox Cloud`, 105, 75, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`${window.formatCurrency(savingsAmount)} Savings Over ${yearsToProject} Years`, 105, 85, { align: 'center' });

    // Implementation time savings
    if (results.implementationResults && results.implementationResults[currentVendor] && results.implementationResults['portnox']) {
      const currentImplementationTime = results.implementationResults[currentVendor];
      const portnoxImplementationTime = results.implementationResults['portnox'];
      const timeSavings = currentImplementationTime - portnoxImplementationTime;
      const timeSavingsPercentage = (timeSavings / currentImplementationTime) * 100;

      doc.text(`${timeSavingsPercentage.toFixed(0)}% Faster Implementation (${timeSavings} days)`, 105, 95, { align: 'center' });
    }

    // Add organization details section
    doc.setFontSize(16);
    doc.setTextColor(...this.colors.primary);
    doc.text('2. Organization Profile', 20, 130);

    doc.setFontSize(10);
    doc.setTextColor(...this.colors.text);

    // Create organization details table
    const orgHeaders = ['Parameter', 'Value'];
    const orgData = [
      ['Device Count', results.deviceCount],
      ['Organization Size', results.orgSize.charAt(0).toUpperCase() + results.orgSize.slice(1)],
      ['Years to Project', yearsToProject],
      ['Multiple Locations', results.multipleLocations ? 'Yes' : 'No'],
      ['Location Count', results.locationCount],
      ['Complex Authentication', results.complexAuthentication ? 'Yes' : 'No'],
      ['Legacy Devices', results.legacyDevices ? 'Yes' : 'No'],
      ['Legacy Percentage', results.legacyPercentage + '%'],
      ['Cloud Integration', results.cloudIntegration ? 'Yes' : 'No'],
      ['Custom Policies', results.customPolicies ? 'Yes' : 'No'],
      ['Policy Complexity', results.policyComplexity.charAt(0).toUpperCase() + results.policyComplexity.slice(1)]
    ];

    doc.autoTable({
      head: [orgHeaders],
      body: orgData,
      startY: 140,
      theme: 'grid',
      headStyles: {
        fillColor: this.colors.primary,
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      styles: {
        cellPadding: 5
      }
    });

    // Add financial analysis section
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(...this.colors.primary);
    doc.text('3. Financial Analysis', 20, 20);

    // TCO comparison
    doc.setFontSize(12);
    doc.text('3.1 TCO Comparison', 20, 35);

    // Prepare TCO table
    const tcoHeaders = ['Cost Component', currentResults.vendorName, 'Portnox Cloud', 'Savings'];

    const tcoData = [
      ['Hardware Costs',
        window.formatCurrency(currentResults.hardwareCost),
        window.formatCurrency(portnoxResults.hardwareCost),
        window.formatCurrency(currentResults.hardwareCost - portnoxResults.hardwareCost)
      ],
      ['Network Redesign',
        window.formatCurrency(currentResults.networkRedesignCost),
        window.formatCurrency(portnoxResults.networkRedesignCost),
        window.formatCurrency(currentResults.networkRedesignCost - portnoxResults.networkRedesignCost)
      ],
      ['Implementation',
        window.formatCurrency(currentResults.implementationCost),
        window.formatCurrency(portnoxResults.implementationCost),
        window.formatCurrency(currentResults.implementationCost - portnoxResults.implementationCost)
      ],
      ['Training',
        window.formatCurrency(currentResults.trainingCost),
        window.formatCurrency(portnoxResults.trainingCost),
        window.formatCurrency(currentResults.trainingCost - portnoxResults.trainingCost)
      ],
      ['Migration Costs',
        window.formatCurrency(0),
        window.formatCurrency(portnoxResults.migrationCost),
        window.formatCurrency(-portnoxResults.migrationCost)
      ],
      [`Maintenance (${yearsToProject} years)`,
        window.formatCurrency(currentResults.maintenanceCost * yearsToProject),
        window.formatCurrency(portnoxResults.maintenanceCost * yearsToProject),
        window.formatCurrency((currentResults.maintenanceCost - portnoxResults.maintenanceCost) * yearsToProject)
      ],
      [`Licensing (${yearsToProject} years)`,
        window.formatCurrency(currentResults.licensingCost * yearsToProject),
        window.formatCurrency(portnoxResults.licensingCost * yearsToProject),
        window.formatCurrency((currentResults.licensingCost - portnoxResults.licensingCost) * yearsToProject)
      ],
      [`Personnel (${yearsToProject} years)`,
        window.formatCurrency(currentResults.fteCost * yearsToProject),
        window.formatCurrency(portnoxResults.fteCost * yearsToProject),
        window.formatCurrency((currentResults.fteCost - portnoxResults.fteCost) * yearsToProject)
      ],
      [`Downtime (${yearsToProject} years)`,
        window.formatCurrency(currentResults.annualDowntimeCost * yearsToProject),
        window.formatCurrency(portnoxResults.annualDowntimeCost * yearsToProject),
        window.formatCurrency((currentResults.annualDowntimeCost - portnoxResults.annualDowntimeCost) * yearsToProject)
      ],
      [`Total ${yearsToProject}-Year TCO`,
        window.formatCurrency(currentResults.totalCosts),
        window.formatCurrency(portnoxResults.totalCosts),
        window.formatCurrency(savingsAmount)
      ]
    ];

    doc.autoTable({
      head: [tcoHeaders],
      body: tcoData,
      startY: 40,
      theme: 'grid',
      headStyles: {
        fillColor: this.colors.primary,
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 45, halign: 'right' },
        2: { cellWidth: 45, halign: 'right' },
        3: { cellWidth: 45, halign: 'right' }
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      styles: {
        cellPadding: 5,
        fontSize: 8
      },
      didParseCell: function(data) {
        // Highlight total row
        if (data.row.index === tcoData.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [230, 230, 230];
        }

        // Highlight savings cells
        if (data.column.index === 3) {
          // Check if the value is a saving (positive) or cost (negative)
          if (data.row.index < tcoData.length - 1) { // Skip the total row
            const savingsText = tcoData[data.row.index][3];
            const savingsValue = parseFloat(savingsText.replace(/[^0-9.-]+/g, ''));
            if (savingsValue > 0) {
              data.cell.styles.textColor = [101, 189, 68]; // Green for savings
            } else if (savingsValue < 0) {
              data.cell.styles.textColor = [220, 53, 69]; // Red for costs
            }
          } else {
            // Total row savings
            data.cell.styles.textColor = [101, 189, 68]; // Green for total savings
          }
        }
      }
    });

    // Add annual costs section
    doc.setFontSize(12);
    doc.setTextColor(...this.colors.primary);
    doc.text('3.2 Annual Operating Costs', 20, doc.autoTable.previous.finalY + 15);

    // Prepare annual costs table
    const annualHeaders = ['Annual Cost Component', currentResults.vendorName, 'Portnox Cloud', 'Annual Savings'];

    const annualData = [
      ['Maintenance',
        window.formatCurrency(currentResults.maintenanceCost),
        window.formatCurrency(portnoxResults.maintenanceCost),
        window.formatCurrency(currentResults.maintenanceCost - portnoxResults.maintenanceCost)
      ],
      ['Licensing',
        window.formatCurrency(currentResults.licensingCost),
        window.formatCurrency(portnoxResults.licensingCost),
        window.formatCurrency(currentResults.licensingCost - portnoxResults.licensingCost)
      ],
      ['Personnel (FTE)',
        window.formatCurrency(currentResults.fteCost),
        window.formatCurrency(portnoxResults.fteCost),
        window.formatCurrency(currentResults.fteCost - portnoxResults.fteCost)
      ],
      ['Downtime',
        window.formatCurrency(currentResults.annualDowntimeCost),
        window.formatCurrency(portnoxResults.annualDowntimeCost),
        window.formatCurrency(currentResults.annualDowntimeCost - portnoxResults.annualDowntimeCost)
      ],
      ['Total Annual Cost',
        window.formatCurrency(currentResults.annualCosts),
        window.formatCurrency(portnoxResults.annualCosts),
        window.formatCurrency(currentResults.annualCosts - portnoxResults.annualCosts)
      ]
    ];

    doc.autoTable({
      head: [annualHeaders],
      body: annualData,
      startY: doc.autoTable.previous.finalY + 20,
      theme: 'grid',
      headStyles: {
        fillColor: this.colors.primary,
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      styles: {
        cellPadding: 5
      },
      didParseCell: function(data) {
        // Highlight total row
        if (data.row.index === annualData.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [230, 230, 230];
        }
        
        // Highlight savings cells
        if (data.column.index === 3) {
          const savingsText = annualData[data.row.index][3];
          const savingsValue = parseFloat(savingsText.replace(/[^0-9.-]+/g, ''));
          if (savingsValue > 0) {
            data.cell.styles.textColor = [101, 189, 68]; // Green for savings
          } else if (savingsValue < 0) {
            data.cell.styles.textColor = [220, 53, 69]; // Red for costs
          }
        }
      }
    });

    // Add ROI analysis
    doc.setFontSize(12);
    doc.setTextColor(...this.colors.primary);
    doc.text('3.3 Return on Investment', 20, doc.autoTable.previous.finalY + 15);

    // Calculate ROI metrics
    const initialInvestment = portnoxResults.totalInitialCosts - currentResults.totalInitialCosts;
    const annualSavings = currentResults.annualCosts - portnoxResults.annualCosts;

    // Add ROI info
    if (annualSavings > 0) {
      const breakEvenYears = initialInvestment > 0 ? initialInvestment / annualSavings : 0;
      const breakEvenMonths = Math.round(breakEvenYears * 12);

      // Create ROI table
      const roiHeaders = ['ROI Metric', 'Value'];
      const roiData = [
        ['Initial Investment', window.formatCurrency(initialInvestment)],
        ['Annual Savings', window.formatCurrency(annualSavings)],
        ['Break-even Point', `${breakEvenMonths} months (${breakEvenYears.toFixed(1)} years)`],
        ['5-Year Savings', window.formatCurrency(annualSavings * 5 - initialInvestment)]
      ];

      doc.autoTable({
        head: [roiHeaders],
        body: roiData,
        startY: doc.autoTable.previous.finalY + 20,
        theme: 'grid',
        headStyles: {
          fillColor: this.colors.primary,
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        styles: {
          cellPadding: 5
        }
      });
    } else {
      // If no annual savings, indicate immediate savings
      doc.setFontSize(10);
      doc.setTextColor(...this.colors.text);
      doc.text('Portnox provides immediate cost advantages with both lower initial and ongoing costs.', 20, doc.autoTable.previous.finalY + 25);
      doc.text(`No break-even analysis needed as there is immediate ${savingsPercentage.toFixed(1)}% savings.`, 20, doc.autoTable.previous.finalY + 32);
    }

    // Add technical analysis section
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(...this.colors.primary);
    doc.text('4. Technical Analysis', 20, 20);

    // Add implementation comparison
    doc.setFontSize(12);
    doc.text('4.1 Implementation Comparison', 20, 35);

    // Get implementation timeline data
    const vendorData = window.vendorData || {};
    const currentVendorData = vendorData[currentVendor] || {};
    const portnoxData = vendorData['portnox'] || {};

    if (currentVendorData && portnoxData) {
      const orgSize = results.orgSize || 'medium';

      const currentTimeline = currentVendorData[orgSize]?.implementationTimeline || {};
      const portnoxTimeline = portnoxData[orgSize]?.implementationTimeline || {};

      // Combine all phase names
      const phases = new Set([...Object.keys(currentTimeline), ...Object.keys(portnoxTimeline)]);

      // Prepare implementation table
      const implHeaders = ['Implementation Phase', currentResults.vendorName, 'Portnox Cloud', 'Time Savings'];
      const implData = [];

      // Add rows
	  # Continuing with the enhanced-pdf-generator.js file:
cat >> js/reports/enhanced-pdf-generator.js << 'EOF'
      // Add rows for each phase
      phases.forEach(phase => {
        const currentDays = currentTimeline[phase] || 0;
        const portnoxDays = portnoxTimeline[phase] || 0;
        const savings = currentDays - portnoxDays;

        implData.push([
          phase.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
          currentDays + ' days',
          portnoxDays + ' days',
          savings > 0 ? savings + ' days' : '-'
        ]);
      });

      // Add total row
      const currentTotal = Object.values(currentTimeline).reduce((sum, days) => sum + days, 0);
      const portnoxTotal = Object.values(portnoxTimeline).reduce((sum, days) => sum + days, 0);
      const totalSavings = currentTotal - portnoxTotal;

      implData.push([
        'Total Implementation Time',
        currentTotal + ' days',
        portnoxTotal + ' days',
        totalSavings > 0 ? totalSavings + ' days' : '-'
      ]);

      doc.autoTable({
        head: [implHeaders],
        body: implData,
        startY: 40,
        theme: 'grid',
        headStyles: {
          fillColor: this.colors.primary,
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        styles: {
          cellPadding: 5
        },
        didParseCell: function(data) {
          // Highlight total row
          if (data.row.index === implData.length - 1) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [230, 230, 230];
          }
          
          // Highlight savings cells
          if (data.column.index === 3) {
            const savingsText = data.row.raw[data.column.index];
            if (savingsText && savingsText !== '-') {
              data.cell.styles.textColor = [101, 189, 68]; // Green for savings
            }
          }
        }
      });
    }

    // Add architecture comparison
    doc.setFontSize(12);
    doc.setTextColor(...this.colors.primary);
    doc.text('4.2 Architecture Comparison', 20, doc.autoTable.previous.finalY + 15);

    // Create Cloud vs On-Premises comparison table
    const archHeaders = ['Feature', 'On-Premises NAC', 'Portnox Cloud'];

    const archData = [
      ['Deployment Model', 'Hardware appliances', 'SaaS solution, no hardware'],
      ['Initial Setup', '2-4 weeks typical setup time', 'Same-day deployment'],
      ['Redundancy', 'Requires additional hardware', 'Built-in cloud redundancy'],
      ['Updates & Patching', 'Manual update process', 'Automatic updates'],
      ['Scalability', 'Requires hardware sizing', 'Unlimited elastic scaling'],
      ['Multi-Location Support', 'Requires hardware at each site', 'Single cloud instance for all sites'],
      ['Remote Access', 'VPN or additional appliances', 'Native anywhere access'],
      ['Disaster Recovery', 'Requires separate DR site', 'Built-in geo-redundancy']
    ];

    doc.autoTable({
      head: [archHeaders],
      body: archData,
      startY: doc.autoTable.previous.finalY + 20,
      theme: 'grid',
      headStyles: {
        fillColor: this.colors.primary,
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 70 },
        2: { cellWidth: 70 }
      },
      styles: {
        cellPadding: 5
      },
      didParseCell: function(data) {
        // Highlight cloud advantages
        if (data.column.index === 2) {
          data.cell.styles.textColor = [101, 189, 68]; // Green for Portnox advantages
        }
      }
    });

    // Add IT resource utilization
    doc.addPage();

    doc.setFontSize(12);
    doc.setTextColor(...this.colors.primary);
    doc.text('4.3 IT Resource Utilization', 20, 20);

    // Get FTE allocation
    const currentFTE = currentVendorData[orgSize]?.fteAllocation || {};
    const portnoxFTE = portnoxData[orgSize]?.fteAllocation || {};

    // Create FTE comparison table
    const fteHeaders = ['IT Role', currentResults.vendorName, 'Portnox Cloud', 'FTE Reduction'];

    const fteData = [
      ['Network Administrator',
        (currentFTE.networkAdmin || 0.5).toFixed(2) + ' FTE',
        (portnoxFTE.networkAdmin || 0.2).toFixed(2) + ' FTE',
        ((currentFTE.networkAdmin || 0.5) - (portnoxFTE.networkAdmin || 0.2)).toFixed(2) + ' FTE'
      ],
      ['Security Administrator',
        (currentFTE.securityAdmin || 0.4).toFixed(2) + ' FTE',
        (portnoxFTE.securityAdmin || 0.15).toFixed(2) + ' FTE',
        ((currentFTE.securityAdmin || 0.4) - (portnoxFTE.securityAdmin || 0.15)).toFixed(2) + ' FTE'
      ],
      ['System Administrator',
        (currentFTE.systemAdmin || 0.3).toFixed(2) + ' FTE',
        (portnoxFTE.systemAdmin || 0.05).toFixed(2) + ' FTE',
        ((currentFTE.systemAdmin || 0.3) - (portnoxFTE.systemAdmin || 0.05)).toFixed(2) + ' FTE'
      ],
      ['Help Desk',
        (currentFTE.helpDesk || 0.1).toFixed(2) + ' FTE',
        (portnoxFTE.helpDesk || 0.05).toFixed(2) + ' FTE',
        ((currentFTE.helpDesk || 0.1) - (portnoxFTE.helpDesk || 0.05)).toFixed(2) + ' FTE'
      ],
      ['Total IT Staff',
        ((currentFTE.networkAdmin || 0.5) + (currentFTE.securityAdmin || 0.4) +
         (currentFTE.systemAdmin || 0.3) + (currentFTE.helpDesk || 0.1)).toFixed(2) + ' FTE',
        ((portnoxFTE.networkAdmin || 0.2) + (portnoxFTE.securityAdmin || 0.15) +
         (portnoxFTE.systemAdmin || 0.05) + (portnoxFTE.helpDesk || 0.05)).toFixed(2) + ' FTE',
        (((currentFTE.networkAdmin || 0.5) + (currentFTE.securityAdmin || 0.4) +
          (currentFTE.systemAdmin || 0.3) + (currentFTE.helpDesk || 0.1)) -
         ((portnoxFTE.networkAdmin || 0.2) + (portnoxFTE.securityAdmin || 0.15) +
          (portnoxFTE.systemAdmin || 0.05) + (portnoxFTE.helpDesk || 0.05))).toFixed(2) + ' FTE'
      ]
    ];

    doc.autoTable({
      head: [fteHeaders],
      body: fteData,
      startY: 25,
      theme: 'grid',
      headStyles: {
        fillColor: this.colors.primary,
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      styles: {
        cellPadding: 5
      },
      didParseCell: function(data) {
        // Highlight total row
        if (data.row.index === fteData.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [230, 230, 230];
        }
        
        // Highlight reduction cells
        if (data.column.index === 3) {
          data.cell.styles.textColor = [101, 189, 68]; // Green for reduction
        }
      }
    });

    // Add migration planning section
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(...this.colors.primary);
    doc.text('5. Migration Planning', 20, 20);

    doc.setFontSize(10);
    doc.setTextColor(...this.colors.text);
    doc.text('The migration from your current NAC solution to Portnox Cloud can be implemented using this step-by-step approach:', 20, 35);

    // Define migration phases
    const migrationPhases = [
      {
        phase: 'Assessment & Discovery',
        description: 'Evaluate current environment, identify devices, authentication methods, and network topology.',
        duration: '3-5 days'
      },
      {
        phase: 'Architecture Planning',
        description: 'Design authentication flows and integration points for cloud NAC solution.',
        duration: '3-5 days'
      },
      {
        phase: 'Portnox Cloud Setup',
        description: 'Configure cloud portal, authentication methods, and deploy local connectors.',
        duration: '1-2 days'
      },
      {
        phase: 'Policy Migration',
        description: 'Transfer and adapt existing policies to the cloud platform.',
        duration: '2-4 days'
      },
      {
        phase: 'Pilot Deployment',
        description: 'Test with limited device groups to verify configuration and policy enforcement.',
        duration: '3-5 days'
      },
      {
        phase: 'Full Deployment',
        description: 'Expand to all network segments and user groups, phase out legacy solution.',
        duration: '5-10 days'
      }
    ];

    // Create migration plan table
    const migrationHeaders = ['Phase', 'Description', 'Estimated Duration'];
    const migrationData = migrationPhases.map(phase => [
      phase.phase,
      phase.description,
      phase.duration
    ]);

    doc.autoTable({
      head: [migrationHeaders],
      body: migrationData,
      startY: 45,
      theme: 'grid',
      headStyles: {
        fillColor: this.colors.primary,
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 100 },
        2: { cellWidth: 40 }
      },
      styles: {
        cellPadding: 5
      }
    });

    // Add migration success factors
    doc.setFontSize(12);
    doc.setTextColor(...this.colors.primary);
    doc.text('Migration Success Factors', 20, doc.autoTable.previous.finalY + 20);

    const successFactors = [
      'Phased Approach - Implement in stages, starting with non-critical segments',
      'Clear Success Criteria - Define measurable objectives for each phase',
      'Stakeholder Engagement - Involve all key stakeholders early in the process',
      'Training - Provide comprehensive training before and during migration',
      'Testing - Thoroughly test each phase before moving to production',
      'Rollback Plan - Maintain the ability to revert changes if issues arise',
      'Communication Plan - Keep all affected users informed throughout the process'
    ];

    let yPos = doc.autoTable.previous.finalY + 30;
    successFactors.forEach(factor => {
      doc.setFontSize(10);
      doc.setTextColor(...this.colors.text);
      doc.circle(25, yPos - 2, 1.5, 'F');
      doc.text(factor, 30, yPos);
      yPos += 10;
    });

    // Add recommendations and conclusion
    doc.addPage();

    doc.setFontSize(16);
    doc.setTextColor(...this.colors.primary);
    doc.text('6. Recommendations & Conclusion', 20, 20);

    doc.setFontSize(10);
    doc.setTextColor(...this.colors.text);

    doc.text(`Based on the comprehensive analysis of Network Access Control solutions for an organization`, 20, 35);
    doc.text(`with ${results.deviceCount} devices over a ${yearsToProject}-year period, migrating from ${currentResults.vendorName} to`, 20, 42);
    doc.text(`Portnox Cloud is strongly recommended for the following key reasons:`, 20, 49);

    const keyRecommendations = [
      `Cost Savings: ${savingsPercentage.toFixed(1)}% reduction in TCO resulting in ${window.formatCurrency(savingsAmount)} savings.`,
      'Reduced Implementation Time: Up to 75% faster deployment compared to traditional NAC solutions.',
      'Lower IT Resource Requirements: Decrease NAC administration overhead by up to 80%.',
      'Simplified Architecture: Cloud-based solution eliminates hardware costs and complex deployments.',
      'Improved Scalability: Elastic scaling without hardware sizing constraints.',
      'Reduced Downtime: Automated updates and built-in redundancy minimize business disruption.',
      'Enhanced Multi-Site Support: Single cloud instance manages all locations without local hardware.'
    ];

    yPos = 60;

    keyRecommendations.forEach(recommendation => {
      doc.circle(25, yPos - 2, 1.5, 'F');
      doc.text(recommendation, 30, yPos, { maxWidth: 160 });
      
      // Calculate height of wrapped text and adjust yPos accordingly
      const textLines = doc.splitTextToSize(recommendation, 160);
      yPos += textLines.length * 7;
    });

    doc.setFontSize(12);
    doc.setTextColor(...this.colors.primary);
    doc.text('Conclusion', 20, yPos + 10);

    doc.setFontSize(10);
    doc.setTextColor(...this.colors.text);

    const conclusion = [
      `The transition to Portnox Cloud presents a compelling business case with significant financial and operational benefits. The cloud-based NAC solution aligns with modern network security best practices while reducing complexity and cost.`,
      `Implementing this solution will position the organization for greater security, scalability, and cost efficiency while freeing up IT resources to focus on strategic initiatives.`
    ];

    yPos += 20;
    conclusion.forEach(paragraph => {
      doc.text(paragraph, 20, yPos, { maxWidth: 170 });
      
      // Calculate height of wrapped text and adjust yPos accordingly
      const textLines = doc.splitTextToSize(paragraph, 170);
      yPos += textLines.length * 7;
    });

    // Add footer with page numbers
    this.addFooter(doc, 'Complete TCO Analysis');
  }
  
  /**
   * Create a cover page for the report
   */
  createCoverPage(doc, reportType, results, currentVendor, customerInfo) {
    const currentResults = results[currentVendor];
    
    // Add background rectangle
    doc.setFillColor(...this.colors.primary);
    doc.rect(0, 0, 210, 60, 'F');
    
    // Add accent rectangle
    doc.setFillColor(...this.colors.accent);
    doc.rect(0, 60, 210, 5, 'F');
    
    // Add title
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text('NAC Solution', 105, 30, { align: 'center' });
    doc.text(`${reportType}`, 105, 45, { align: 'center' });
    
    // Add subtitle
    doc.setFontSize(16);
    doc.setTextColor(...this.colors.text);
    doc.text(`Comparing ${results[currentVendor].vendorName} vs. Portnox Cloud`, 105, 80, { align: 'center' });
    
    // Add customer logo if available
    if (customerInfo && customerInfo.logo && this.customerLogo) {
      try {
        doc.addImage(this.customerLogo, 'PNG', 20, 100, 50, 25);
      } catch (error) {
        console.warn('Error adding customer logo:', error);
      }
    }
    
    // Add Portnox logo
    // In a real implementation, add your logo here
    
    // Add organization info if available
    if (customerInfo) {
      doc.setFontSize(12);
      doc.setTextColor(...this.colors.text);
      
      let yPos = 140;
      
      if (customerInfo.name) {
        doc.text(`Organization: ${customerInfo.name}`, 20, yPos);
        yPos += 10;
      }
      
      if (customerInfo.contact) {
        doc.text(`Contact: ${customerInfo.contact}`, 20, yPos);
        yPos += 10;
      }
      
      if (customerInfo.email) {
        doc.text(`Email: ${customerInfo.email}`, 20, yPos);
        yPos += 10;
      }
    }
    
    // Add report details
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 190);
    doc.text(`Device Count: ${results.deviceCount}`, 20, 200);
    doc.text(`Projection Period: ${results.yearsToProject} years`, 20, 210);
    
    // Add key metrics
    doc.setFillColor(...this.colors.background);
    doc.roundedRect(105, 180, 85, 40, 3, 3, 'F');
    
    const savingsAmount = currentResults.totalCosts - results['portnox'].totalCosts;
    const savingsPercentage = (savingsAmount / currentResults.totalCosts) * 100;
    
    doc.setFontSize(12);
    doc.setTextColor(...this.colors.primary);
    doc.text('Key Findings:', 110, 190);
    
    doc.setFontSize(14);
    doc.setTextColor(...this.colors.accent);
    doc.text(`${savingsPercentage.toFixed(1)}% Cost Reduction`, 110, 200);
    doc.text(`${window.formatCurrency(savingsAmount)} Savings`, 110, 210);
    
    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(...this.colors.textLight);
    doc.text('Confidential - For Internal Use Only', 105, 277, { align: 'center' });
  }
  
  /**
   * Create a table of contents
   */
  createTableOfContents(doc) {
    doc.setFontSize(20);
    doc.setTextColor(...this.colors.primary);
    doc.text('Table of Contents', 105, 40, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(...this.colors.text);
    
    const tocItems = [
      { title: '1. Executive Summary', page: 3 },
      { title: '2. Organization Profile', page: 3 },
      { title: '3. Financial Analysis', page: 4 },
      { title: '   3.1. TCO Comparison', page: 4 },
      { title: '   3.2. Annual Operating Costs', page: 4 },
      { title: '   3.3. Return on Investment', page: 4 },
      { title: '4. Technical Analysis', page: 5 },
      { title: '   4.1. Implementation Comparison', page: 5 },
      { title: '   4.2. Architecture Comparison', page: 5 },
      { title: '   4.3. IT Resource Utilization', page: 6 },
      { title: '5. Migration Planning', page: 7 },
      { title: '6. Recommendations & Conclusion', page: 8 }
    ];
    
    let yPos = 60;
    
    tocItems.forEach(item => {
      doc.setFontSize(12);
      
      // Check if this is a main section or subsection
      if (item.title.includes('.')) {
        const parts = item.title.split('.');
        if (parts.length > 2) {
          // This is a subsection
          doc.setFont(undefined, 'normal');
        } else {
          // This is a main section
          doc.setFont(undefined, 'bold');
        }
      }
      
      doc.text(item.title, 40, yPos);
      
      // Add dots between title and page number
      const titleWidth = doc.getTextDimensions(item.title).w;
      const pageWidth = doc.getTextDimensions(item.page.toString()).w;
      const maxWidth = 150;
      const dotsWidth = maxWidth - titleWidth - pageWidth - 40;
      
      let dots = '';
      const dotWidth = doc.getTextDimensions('.').w;
      const numberOfDots = Math.floor(dotsWidth / dotWidth);
      
      for (let i = 0; i < numberOfDots; i++) {
        dots += '.';
      }
      
      doc.text(dots, 40 + titleWidth, yPos);
      doc.text(item.page.toString(), 180, yPos);
      
      yPos += 12;
    });
  }
  
  /**
   * Add footer with page numbers to each page
   */
  addFooter(doc, reportType) {
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(...this.colors.textLight);
      doc.text('Portnox Cloud NAC Solution - ' + reportType, 20, 285);
      doc.text(`Page ${i} of ${pageCount}`, 180, 285);
    }
  }
}

// Export the enhanced PDF generator class
window.EnhancedPDFReportGenerator = EnhancedPDFReportGenerator;
