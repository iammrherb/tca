/**
 * Enhanced PDF Report Generator
 * Provides role-specific reports for different audiences
 */
class PDFReportGenerator {
  constructor() {
    this.defaultOptions = {
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    };
  }

  generateReport(results, currentVendor, reportType = 'complete') {
    if (!results || !results[currentVendor] || !results['portnox']) {
      throw new Error('Invalid results data');
    }

    // Create PDF document
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF(this.defaultOptions);

    // Generate role-specific content
    switch(reportType) {
      case 'executive':
        this.generateExecutiveSummary(doc, results, currentVendor);
        break;
      case 'financial':
        this.generateFinancialAnalysis(doc, results, currentVendor);
        break;
      case 'technical':
        this.generateTechnicalReport(doc, results, currentVendor);
        break;
      case 'complete':
      default:
        this.generateCompleteReport(doc, results, currentVendor);
    }

    return doc;
  }

  // Executive Summary - Brief, high-level overview for decision makers
  generateExecutiveSummary(doc, results, currentVendor) {
    const currentResults = results[currentVendor];
    const portnoxResults = results['portnox'];
    const yearsToProject = results.yearsToProject;

    // Calculate key metrics
    const savingsAmount = currentResults.totalCosts - portnoxResults.totalCosts;
    const savingsPercentage = (savingsAmount / currentResults.totalCosts) * 100;

    // Add title and header
    doc.setFontSize(24);
    doc.setTextColor(27, 103, 178); // Primary color
    doc.text('Executive Summary', 105, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100); // Gray
    doc.text(`NAC Solution TCO Analysis`, 105, 30, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Generated ${new Date().toLocaleDateString()}`, 105, 38, { align: 'center' });

    // Add organization info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Organization Overview', 20, 50);

    doc.setFontSize(10);
    doc.text(`Devices: ${results.deviceCount}`, 25, 60);
    doc.text(`Environment Size: ${results.orgSize.charAt(0).toUpperCase() + results.orgSize.slice(1)}`, 25, 67);
    doc.text(`Analysis Period: ${yearsToProject} Years`, 25, 74);

    // Add key findings
    doc.setFontSize(14);
    doc.setTextColor(27, 103, 178);
    doc.text('Key Findings', 20, 90);

    // Create key metrics box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(20, 95, 170, 50, 3, 3, 'FD');

    doc.setFontSize(18);
    doc.setTextColor(43, 210, 91); // Accent color
    doc.text(`${savingsPercentage.toFixed(1)}% Total Cost Reduction`, 105, 110, { align: 'center' });

    doc.setFontSize(14);
    doc.text(`${window.formatCurrency(savingsAmount)} Savings Over ${yearsToProject} Years`, 105, 122, { align: 'center' });

    // Implementation time savings
    if (results.implementationResults && results.implementationResults[currentVendor] && results.implementationResults['portnox']) {
      const currentImplementationTime = results.implementationResults[currentVendor];
      const portnoxImplementationTime = results.implementationResults['portnox'];
      const timeSavings = currentImplementationTime - portnoxImplementationTime;
      const timeSavingsPercentage = (timeSavings / currentImplementationTime) * 100;

      doc.text(`${timeSavingsPercentage.toFixed(0)}% Faster Implementation (${timeSavings} days)`, 105, 134, { align: 'center' });
    }

    // Add TCO comparison table
    doc.setFontSize(14);
    doc.setTextColor(27, 103, 178);
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
        fillColor: [27, 103, 178],
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

    // Add strategic recommendations
    doc.setFontSize(14);
    doc.setTextColor(27, 103, 178);
    doc.text('Strategic Recommendations', 20, doc.autoTable.previous.finalY + 20);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    const recommendations = [
      `Transition from ${currentResults.vendorName} to Portnox Cloud to achieve significant cost savings and operational efficiencies.`,
      'Leverage cloud-based NAC solution to reduce hardware costs and simplify deployment across multiple locations.',
      'Minimize IT staff overhead with a managed NAC solution that requires less administrative time.',
      'Improve security posture with automatic updates and seamless scaling capabilities.'
    ];

    let yPos = doc.autoTable.previous.finalY + 30;

    recommendations.forEach(recommendation => {
      doc.circle(25, yPos - 2, 1.5, 'F');
      doc.text(recommendation, 30, yPos);
      yPos += 10;
    });

    // Add footer with page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Portnox Cloud NAC Solution', 20, 285);
      doc.text(`Page ${i} of ${pageCount}`, 180, 285);
    }
  }

  // Financial Analysis - Detailed cost breakdown for financial teams
  generateFinancialAnalysis(doc, results, currentVendor) {
    const currentResults = results[currentVendor];
    const portnoxResults = results['portnox'];
    const yearsToProject = results.yearsToProject;

    // Calculate key metrics
    const savingsAmount = currentResults.totalCosts - portnoxResults.totalCosts;
    const savingsPercentage = (savingsAmount / currentResults.totalCosts) * 100;

    // Add title and header
    doc.setFontSize(20);
    doc.setTextColor(27, 103, 178); // Primary color
    doc.text('NAC Solution Financial Analysis', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100); // Gray
    doc.text(`Comparing ${currentResults.vendorName} vs. Portnox Cloud`, 105, 30, { align: 'center' });
    doc.text(`Generated ${new Date().toLocaleDateString()}`, 105, 38, { align: 'center' });

    // Add organization info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Organization Parameters', 20, 50);

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
      startY: 55,
      theme: 'plain',
      styles: {
        fontSize: 9
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 40 }
      }
    });

    // Add cost comparison table
    doc.setFontSize(14);
    doc.setTextColor(27, 103, 178);
    doc.text('Detailed Cost Comparison', 20, doc.autoTable.previous.finalY + 15);

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
        fillColor: [27, 103, 178],
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
            const savingsValue = parseFloat(costData[data.row.index][3].replace(/[^0-9.-]+/g, ''));
            if (savingsValue > 0) {
              data.cell.styles.textColor = [43, 210, 91]; // Green for savings
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
    doc.setTextColor(27, 103, 178);
    doc.text('Annual Cost Breakdown', 20, 20);

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
      startY: 25,
      theme: 'grid',
      headStyles: {
        fillColor: [27, 103, 178],
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
      }
    });

    // Add ROI analysis
    doc.setFontSize(14);
    doc.setTextColor(27, 103, 178);
    doc.text('Return on Investment Analysis', 20, doc.autoTable.previous.finalY + 20);

    // Calculate ROI metrics
    const initialInvestment = portnoxResults.totalInitialCosts - currentResults.totalInitialCosts;
    const annualSavings = currentResults.annualCosts - portnoxResults.annualCosts;

    // Only calculate if there are annual savings
    if (annualSavings > 0) {
      const breakEvenYears = initialInvestment > 0 ? initialInvestment / annualSavings : 0;
      const breakEvenMonths = Math.round(breakEvenYears * 12);

      const roi = ((savingsAmount - initialInvestment) / initialInvestment) * 100;

      // Draw ROI box
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(20, doc.autoTable.previous.finalY + 25, 170, 50, 3, 3, 'FD');

      // Add ROI metrics
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);

      doc.text(`Initial Investment Difference: ${window.formatCurrency(initialInvestment)}`, 30, doc.autoTable.previous.finalY + 35);
      doc.text(`Annual Savings: ${window.formatCurrency(annualSavings)}`, 30, doc.autoTable.previous.finalY + 45);
      doc.text(`Break-even Point: ${breakEvenMonths} months (${breakEvenYears.toFixed(1)} years)`, 30, doc.autoTable.previous.finalY + 55);
      doc.text(`${yearsToProject}-Year ROI: ${roi.toFixed(1)}%`, 30, doc.autoTable.previous.finalY + 65);

      // Add NPV analysis if initial investment is positive
      if (initialInvestment > 0) {
        doc.setFontSize(14);
        doc.setTextColor(27, 103, 178);
        doc.text('NPV Analysis', 20, doc.autoTable.previous.finalY + 85);

        // Assume 10% discount rate
        const discountRate = 0.10;

        // Calculate NPV
        let npv = -initialInvestment;
        for (let i = 1; i <= yearsToProject; i++) {
          npv += annualSavings / Math.pow(1 + discountRate, i);
        }

        // Draw NPV box
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(245, 245, 245);
        doc.roundedRect(20, doc.autoTable.previous.finalY + 90, 170, 40, 3, 3, 'FD');

        // Add NPV metrics
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);

        doc.text(`Discount Rate: 10%`, 30, doc.autoTable.previous.finalY + 100);
        doc.text(`Net Present Value (NPV): ${window.formatCurrency(npv)}`, 30, doc.autoTable.previous.finalY + 110);
        doc.text(`NPV-to-Investment Ratio: ${(npv / initialInvestment).toFixed(2)}`, 30, doc.autoTable.previous.finalY + 120);
      }
    } else {
      // If no annual savings, indicate immediate savings
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Portnox provides immediate cost advantages with both lower initial and ongoing costs.', 20, doc.autoTable.previous.finalY + 35);
      doc.text(`No break-even analysis needed as there is immediate ${savingsPercentage.toFixed(1)}% savings.`, 20, doc.autoTable.previous.finalY + 45);
    }

    // Add footer with page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Portnox Cloud NAC Solution - Financial Analysis', 20, 285);
      doc.text(`Page ${i} of ${pageCount}`, 180, 285);
    }
  }

  // Technical Report - Implementation and technical details for IT teams
  generateTechnicalReport(doc, results, currentVendor) {
    const currentResults = results[currentVendor];
    const portnoxResults = results['portnox'];
    const yearsToProject = results.yearsToProject;

    // Add title and header
    doc.setFontSize(20);
    doc.setTextColor(27, 103, 178); // Primary color
    doc.text('NAC Solution Technical Comparison', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100); // Gray
    doc.text(`Comparing ${currentResults.vendorName} vs. Portnox Cloud`, 105, 30, { align: 'center' });
    doc.text(`Generated ${new Date().toLocaleDateString()}`, 105, 38, { align: 'center' });

    // Add environment details
    doc.setFontSize(14);
    doc.setTextColor(27, 103, 178);
    doc.text('Environment Details', 20, 50);

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
      startY: 55,
      theme: 'plain',
      styles: {
        fontSize: 9
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 40 }
      }
    });

    // Add implementation comparison
    doc.setFontSize(14);
    doc.setTextColor(27, 103, 178);
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
          fillColor: [27, 103, 178],
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
        }
      });
    }

    // Add architecture comparison
    doc.addPage();

    doc.setFontSize(14);
    doc.setTextColor(27, 103, 178);
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
        fillColor: [27, 103, 178],
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
      }
    });

    // Add migration plan
    doc.setFontSize(14);
    doc.setTextColor(27, 103, 178);
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
        fillColor: [27, 103, 178],
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

    // Add resource utilization comparison
    doc.addPage();

    doc.setFontSize(14);
    doc.setTextColor(27, 103, 178);
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
        fillColor: [27, 103, 178],
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
      }
    });

    // Add technical recommendations
    doc.setFontSize(14);
    doc.setTextColor(27, 103, 178);
    doc.text('Technical Recommendations', 20, doc.autoTable.previous.finalY + 20);

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

    let yPos = doc.autoTable.previous.finalY + 30;

    recommendations.forEach(recommendation => {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'bold');
      doc.text(recommendation.title, 20, yPos);
      doc.setFont(undefined, 'normal');

      doc.setFontSize(10);
      doc.text(recommendation.details, 25, yPos + 7);

      yPos += 18;
    });

    // Add footer with page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Portnox Cloud NAC Solution - Technical Analysis', 20, 285);
      doc.text(`Page ${i} of ${pageCount}`, 180, 285);
    }
  }

  // Complete Report - Comprehensive TCO analysis with all sections
  generateCompleteReport(doc, results, currentVendor) {
    // Add cover page
    this.createCoverPage(doc, results, currentVendor);

    // Add table of contents
    doc.addPage();
    this.createTableOfContents(doc);

    // Add executive summary
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(27, 103, 178);
    doc.text('1. Executive Summary', 20, 20);

    // Include executive content (simpler version)
    const currentResults = results[currentVendor];
    const portnoxResults = results['portnox'];
    const yearsToProject = results.yearsToProject;

    // Calculate key metrics
    const savingsAmount = currentResults.totalCosts - portnoxResults.totalCosts;
    const savingsPercentage = (savingsAmount / currentResults.totalCosts) * 100;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`This report analyzes the total cost of ownership (TCO) for Network Access Control solutions,`, 20, 35);
    doc.text(`comparing ${currentResults.vendorName} with Portnox Cloud for an organization with ${results.deviceCount} devices`, 20, 42);
    doc.text(`over a ${yearsToProject}-year period.`, 20, 49);

    // Create key metrics box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(20, 60, 170, 50, 3, 3, 'FD');

    doc.setFontSize(14);
    doc.setTextColor(43, 210, 91); // Accent color
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
    doc.setTextColor(27, 103, 178);
    doc.text('2. Organization Profile', 20, 130);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    // Create organization details table
    const orgHeaders = ['Parameter', 'Value'];
    const orgData = [
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
      head: [orgHeaders],
      body: orgData,
      startY: 140,
      theme: 'grid',
      headStyles: {
        fillColor: [27, 103, 178],
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

    // Add financial analysis
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(27, 103, 178);
    doc.text('3. Financial Analysis', 20, 20);

    // TCO table
    doc.setFontSize(12);
    doc.text('3.1. TCO Comparison', 20, 35);

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
        fillColor: [27, 103, 178],
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
            const savingsValue = parseFloat(tcoData[data.row.index][3].replace(/[^0-9.-]+/g, ''));
            if (savingsValue > 0) {
              data.cell.styles.textColor = [43, 210, 91]; // Green for savings
            } else if (savingsValue < 0) {
              data.cell.styles.textColor = [220, 53, 69]; // Red for costs
            }
          }
        }
      }
    });

    // Add ROI analysis section
    doc.setFontSize(12);
    doc.setTextColor(27, 103, 178);
    doc.text('3.2. Return on Investment', 20, doc.autoTable.previous.finalY + 15);

    // Calculate ROI metrics
    const initialInvestment = portnoxResults.totalInitialCosts - currentResults.totalInitialCosts;
    const annualSavings = currentResults.annualCosts - portnoxResults.annualCosts;

    // Only calculate if there are annual savings
    if (annualSavings > 0) {
      const breakEvenYears = initialInvestment > 0 ? initialInvestment / annualSavings : 0;
      const breakEvenMonths = Math.round(breakEvenYears * 12);

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      doc.text(`Based on the analysis, migrating from ${currentResults.vendorName} to Portnox Cloud has a`, 20, doc.autoTable.previous.finalY + 25);
      doc.text(`break-even point of ${breakEvenMonths} months.`, 20, doc.autoTable.previous.finalY + 32);

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
        startY: doc.autoTable.previous.finalY + 40,
        theme: 'grid',
        headStyles: {
          fillColor: [27, 103, 178],
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
      doc.setTextColor(0, 0, 0);
      doc.text('Portnox provides immediate cost advantages with both lower initial and ongoing costs.', 20, doc.autoTable.previous.finalY + 25);
      doc.text(`No break-even analysis needed as there is immediate ${savingsPercentage.toFixed(1)}% savings.`, 20, doc.autoTable.previous.finalY + 32);
    }

    // Add technical analysis
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(27, 103, 178);
    doc.text('4. Technical Analysis', 20, 20);

    // Implementation comparison
    doc.setFontSize(12);
    doc.text('4.1. Implementation Comparison', 20, 35);

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
        startY: 40,
        theme: 'grid',
        headStyles: {
          fillColor: [27, 103, 178],
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
        }
      });
    }

    // Add architecture comparison
    doc.setFontSize(12);
    doc.setTextColor(27, 103, 178);
    doc.text('4.2. Architecture Comparison', 20, doc.autoTable.previous.finalY + 15);

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
        fillColor: [27, 103, 178],
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
      }
    });

    // Add IT resource utilization
    doc.addPage();

    doc.setFontSize(12);
    doc.setTextColor(27, 103, 178);
    doc.text('4.3. IT Resource Utilization', 20, 20);

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
        fillColor: [27, 103, 178],
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
      }
    });

    // Add migration planning
    doc.setFontSize(12);
    doc.setTextColor(27, 103, 178);
    doc.text('5. Migration Planning', 20, doc.autoTable.previous.finalY + 15);

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
      startY: doc.autoTable.previous.finalY + 20,
      theme: 'grid',
      headStyles: {
        fillColor: [27, 103, 178],
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

    // Add recommendations and conclusion
    doc.addPage();

    doc.setFontSize(16);
    doc.setTextColor(27, 103, 178);
    doc.text('6. Recommendations & Conclusion', 20, 20);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

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

    let yPos = 60;

    keyRecommendations.forEach(recommendation => {
      doc.circle(25, yPos - 2, 1.5, 'F');
      doc.text(recommendation, 30, yPos);
      yPos += 10;
    });

    doc.setFontSize(12);
    doc.setTextColor(27, 103, 178);
    doc.text('Conclusion', 20, yPos + 10);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    doc.text(`The transition to Portnox Cloud presents a compelling business case with significant financial and`, 20, yPos + 20);
    doc.text(`operational benefits. The cloud-based NAC solution aligns with modern network security best practices`, 20, yPos + 27);
    doc.text(`while reducing complexity and cost. Implementing this solution will position the organization for greater`, 20, yPos + 34);
    doc.text(`security, scalability, and cost efficiency.`, 20, yPos + 41);

    // Add footer with page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Portnox Cloud NAC Solution - TCO Analysis', 20, 285);
      doc.text(`Page ${i} of ${pageCount}`, 180, 285);
    }
  }

  // Create cover page
  createCoverPage(doc, results, currentVendor) {
    // Add title
    doc.setFontSize(28);
    doc.setTextColor(27, 103, 178); // Primary color
    doc.text('NAC Solution', 105, 80, { align: 'center' });
    doc.text('TCO Analysis Report', 105, 95, { align: 'center' });

    // Add subtitle
    doc.setFontSize(16);
    doc.setTextColor(100, 100, 100); // Gray
    doc.text(`Comparing ${results[currentVendor].vendorName} vs. Portnox Cloud`, 105, 120, { align: 'center' });

    // Add company and date
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 145, { align: 'center' });

    // Add portnox logo
    // Note: In a real implementation, you would use doc.addImage() here with the logo data

    // Add footer
    doc.setFontSize(10);
    doc.text('Confidential - For Internal Use Only', 105, 270, { align: 'center' });
  }

  // Create table of contents
  createTableOfContents(doc) {
    doc.setFontSize(20);
    doc.setTextColor(27, 103, 178);
    doc.text('Table of Contents', 105, 40, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    const tocItems = [
      { title: '1. Executive Summary', page: 3 },
      { title: '2. Organization Profile', page: 3 },
      { title: '3. Financial Analysis', page: 4 },
      { title: '   3.1. TCO Comparison', page: 4 },
      { title: '   3.2. Return on Investment', page: 4 },
      { title: '4. Technical Analysis', page: 5 },
      { title: '   4.1. Implementation Comparison', page: 5 },
      { title: '   4.2. Architecture Comparison', page: 5 },
      { title: '   4.3. IT Resource Utilization', page: 6 },
      { title: '5. Migration Planning', page: 6 },
      { title: '6. Recommendations & Conclusion', page: 7 }
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

      yPos += 15;
    });
  }
}

// Export the PDF generator class
window.PDFReportGenerator = PDFReportGenerator;
