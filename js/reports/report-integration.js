/**
 * Report generation integration
 * Integrates enhanced report generator with the UI
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize enhanced PDF generator if jsPDF is available
  if (typeof jsPDF !== 'undefined') {
    window.enhancedPDFGenerator = new EnhancedPDFReportGenerator();
    console.log('Enhanced PDF Generator initialized');
    
    // Replace export to PDF function in UI controller
    if (window.uiController) {
      // Store original function as fallback
      window.uiController._originalExportToPDF = window.uiController.exportToPDF;
      
      // Replace with enhanced version
      window.uiController.exportToPDF = function() {
        try {
          if (!window.calculator || !window.calculator.results) {
            throw new Error('No calculation results available');
          }
          
          const results = window.calculator.results;
          const currentVendor = this.activeVendor || 'cisco';
          const reportType = document.getElementById('report-type')?.value || 'complete';
          
          // Get customer info if available
          const customerInfo = this.getCustomerInfo();
          
          // Check if industry data is available for compliance report
          let industryData = null;
          if (reportType === 'compliance' && window.industryTemplates) {
            const industry = document.getElementById('industry-selector')?.value;
            if (industry && industry !== 'none' && window.industryTemplates[industry]) {
              industryData = window.industryTemplates[industry];
            }
          }
          
          // Generate report
          const doc = window.enhancedPDFGenerator.generateReport(
            results, 
            currentVendor, 
            reportType, 
            { 
              customerInfo: customerInfo,
              industryData: industryData
            }
          );
          
          // Save PDF
          doc.save(`NAC_TCO_${reportType}_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
          
          // Show success notification
          if (window.notificationManager) {
            window.notificationManager.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report exported successfully`);
          } else {
            alert(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report exported successfully`);
          }
        } catch (error) {
          console.error('Error exporting to PDF:', error);
          
          // Fall back to original export function
          if (this._originalExportToPDF) {
            console.log('Falling back to original PDF export function');
            return this._originalExportToPDF.call(this);
          }
          
          // Show error notification
          if (window.notificationManager) {
            window.notificationManager.error('Error exporting to PDF: ' + error.message);
          } else {
            alert('Error exporting to PDF: ' + error.message);
          }
        }
      };
      
      // Add customer info function
      window.uiController.getCustomerInfo = function() {
        // This would normally come from a form or saved settings
        // For now, return empty object or default values
        return {
          name: '',
          contact: '',
          email: ''
        };
      };
      
      // Add function to set customer logo
      window.uiController.setCustomerLogo = function(logoDataUrl) {
        if (window.enhancedPDFGenerator) {
          window.enhancedPDFGenerator.setCustomerLogo(logoDataUrl);
        }
      };
      
      console.log('Enhanced PDF export function integrated');
    }
    
    // Add customer logo uploader
    createCustomerLogoUploader();
  }
  
  // Add report type selector if missing
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
        { value: 'technical', label: 'Technical Report' },
        { value: 'compliance', label: 'Compliance Report' }
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
});

/**
 * Create customer logo uploader
 */
function createCustomerLogoUploader() {
  const exportOptions = document.querySelector('.export-options');
  if (!exportOptions) return;
  
  // Create logo upload button
  const uploadButton = document.createElement('button');
  uploadButton.id = 'upload-logo-btn';
  uploadButton.className = 'btn btn-outline';
  uploadButton.innerHTML = '<i class="fas fa-image"></i> Add Logo to Reports';
  
  // Create hidden file input
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.id = 'logo-file-input';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  
  // Add event listeners
  uploadButton.addEventListener('click', function() {
    fileInput.click();
  });
  
  fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.match('image.*')) {
      if (window.notificationManager) {
        window.notificationManager.error('Please select an image file');
      } else {
        alert('Please select an image file');
      }
      return;
    }
    
    // Read file as data URL
    const reader = new FileReader();
    reader.onload = function(e) {
      const logoDataUrl = e.target.result;
      
      // Set logo in PDF generator
      if (window.uiController && typeof window.uiController.setCustomerLogo === 'function') {
        window.uiController.setCustomerLogo(logoDataUrl);
        
        // Show success notification
        if (window.notificationManager) {
          window.notificationManager.success('Logo added to reports');
        } else {
          alert('Logo added to reports');
        }
        
        // Update button to show logo is set
        uploadButton.innerHTML = '<i class="fas fa-check"></i> Logo Added to Reports';
        
        // Reset after 3 seconds
        setTimeout(function() {
          uploadButton.innerHTML = '<i class="fas fa-image"></i> Update Logo';
        }, 3000);
      }
    };
    
    reader.readAsDataURL(file);
  });
  
  // Add to export options
  exportOptions.appendChild(uploadButton);
  exportOptions.appendChild(fileInput);
}
