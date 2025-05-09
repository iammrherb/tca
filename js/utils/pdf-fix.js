/**
 * PDF Generator Fix
 * Resolves issues with the PDF generator related to undefined variables
 */
(function() {
  console.log('Applying PDF Generator Fix...');
  
  // Track PDF generator creation
  const originalPDFReportGenerator = window.PDFReportGenerator;
  
  // Redefine PDFReportGenerator with fixes
  window.PDFReportGenerator = function(...args) {
    console.log('Creating fixed PDF Generator...');
    
    // Create instance of original generator
    const generator = new originalPDFReportGenerator(...args);
    
    // Override generateCompleteReport method to fix orgSize issue
    const originalGenerateCompleteReport = generator.generateCompleteReport;
    generator.generateCompleteReport = function(data) {
      console.log('Running enhanced PDF report generation...');
      
      // Make sure orgSize is defined
      if (!data.orgSize) {
        data.orgSize = this.organizationData?.size || 'medium';
      }
      
      // Also make sure it's applied to the generator itself
      this.orgSize = data.orgSize || 'medium';
      
      // Make sure other potentially undefined properties exist
      data.vendorData = data.vendorData || window.vendorData || {};
      data.calculationResults = data.calculationResults || window.calculationResults || {};
      data.comparisonResults = data.comparisonResults || window.comparisonResults || {};
      
      // Call original method with fixed data
      return originalGenerateCompleteReport.call(this, data);
    };
    
    // Also fix other problematic methods
    if (generator.generateReport) {
      const originalGenerateReport = generator.generateReport;
      generator.generateReport = function(...args) {
        try {
          return originalGenerateReport.apply(this, args);
        } catch (error) {
          console.error('Error in generateReport, using fallback:', error);
          
          // Create a basic PDF as fallback
          const doc = new jsPDF();
          doc.setFontSize(16);
          doc.text('Total Cost Analysis Report', 20, 20);
          doc.setFontSize(12);
          doc.text('Report generation encountered an error. Please try again.', 20, 30);
          
          // Return the basic PDF
          return doc;
        }
      };
    }
    
    return generator;
  };
  
  // Copy prototype and static properties
  window.PDFReportGenerator.prototype = originalPDFReportGenerator.prototype;
  Object.keys(originalPDFReportGenerator).forEach(key => {
    window.PDFReportGenerator[key] = originalPDFReportGenerator[key];
  });
  
  console.log('PDF Generator Fix applied successfully');
})();
