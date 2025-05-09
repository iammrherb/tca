/**
 * Enhanced report generation for different user views
 */
document.addEventListener('DOMContentLoaded', function() {
  // Fix for missing report-type selector
  const reportTypeSelector = document.getElementById('report-type');
  if (!reportTypeSelector) {
    const exportOptions = document.querySelector('.export-options');
    if (exportOptions) {
      // Create report type selector
      const select = document.createElement('select');
      select.id = 'report-type';
      select.className = 'form-select';
      
      // Add options
      const options = [
        { value: 'complete', label: 'Complete Report' },
        { value: 'executive', label: 'Executive Summary' },
        { value: 'financial', label: 'Financial Analysis' },
        { value: 'technical', label: 'Technical Report' }
      ];
      
      options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.value;
        opt.textContent = option.label;
        select.appendChild(opt);
      });
      
      // Add to export options
      exportOptions.appendChild(select);
      console.log('Added report type selector');
    }
  }
  
  // Fix for PDF report generation
  if (typeof window.PDFReportGenerator === 'undefined') {
    // Basic implementation of PDFReportGenerator
    class BasicPDFReportGenerator {
      constructor() {
        // Check if jsPDF is available
        if (typeof jsPDF === 'undefined') {
          console.warn('jsPDF library not available');
        }
      }
      
      generateReport(results, currentVendor, reportType = 'complete') {
        if (!results || !results[currentVendor] || !results['portnox']) {
          throw new Error('Invalid results data');
        }
        
        // Create PDF document
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true
        });
        
        // Add title and header
        doc.setFontSize(20);
        doc.setTextColor(27, 103, 178); // Primary color
        
        let title = 'NAC Solution TCO Analysis';
        switch (reportType) {
          case 'executive':
            title = 'NAC Solution Executive Summary';
            break;
          case 'financial':
            title = 'NAC Solution Financial Analysis';
            break;
          case 'technical':
            title = 'NAC Solution Technical Report';
            break;
        }
        
        doc.text(title, 105, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100); // Gray
        doc.text(`Comparing ${results[currentVendor].vendorName} vs. Portnox Cloud`, 105, 30, { align: 'center' });
        doc.text(`Generated ${new Date().toLocaleDateString()}`, 105, 38, { align: 'center' });
        
        // Add organization info
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('Organization Details', 20, 50);
        
        // Add organization details
        doc.setFontSize(10);
        doc.text(`Device Count: ${results.deviceCount}`, 20, 60);
        doc.text(`Organization Size: ${results.orgSize.charAt(0).toUpperCase() + results.orgSize.slice(1)}`, 20, 67);
        doc.text(`Years Projected: ${results.yearsToProject}`, 20, 74);
        
        // Add basic cost comparison
        doc.setFontSize(14);
        doc.setTextColor(27, 103, 178);
        doc.text('Cost Comparison', 20, 90);
        
        // Add simple table with TCO
        const currentVendorResults = results[currentVendor];
        const portnoxResults = results['portnox'];
        
        const headers = ['Cost Component', currentVendorResults.vendorName, 'Portnox Cloud', 'Savings'];
        const data = [
          ['Initial Costs', 
            window.formatCurrency(currentVendorResults.totalInitialCosts), 
            window.formatCurrency(portnoxResults.totalInitialCosts),
            window.formatCurrency(currentVendorResults.totalInitialCosts - portnoxResults.totalInitialCosts)
          ],
          ['Ongoing Costs', 
            window.formatCurrency(currentVendorResults.annualCosts * results.yearsToProject), 
            window.formatCurrency(portnoxResults.annualCosts * results.yearsToProject),
            window.formatCurrency(currentVendorResults.annualCosts * results.yearsToProject - portnoxResults.annualCosts * results.yearsToProject)
          ],
          ['Total TCO', 
            window.formatCurrency(currentVendorResults.totalCosts), 
            window.formatCurrency(portnoxResults.totalCosts),
            window.formatCurrency(portnoxResults.totalSavings)
          ]
        ];
        
        // Add table
        doc.autoTable({
          head: [headers],
          body: data,
          startY: 95,
          theme: 'grid',
          styles: {
            fontSize: 9
          },
          headStyles: {
            fillColor: [27, 103, 178],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          }
        });
        
        // Add footer with page number
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text('Portnox Cloud NAC Solution', 20, 285);
          doc.text(`Page ${i} of ${pageCount}`, 180, 285);
        }
        
        return doc;
      }
    }
    
    // Register the generator
    window.PDFReportGenerator = BasicPDFReportGenerator;
    console.log('Registered basic PDF report generator');
  }
});
