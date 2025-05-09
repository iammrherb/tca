/**
 * Compliance UI Controller for Zero Trust NAC Architecture Designer Pro
 * Manages industry and compliance visualization UI
 */

class ComplianceUI {
  constructor() {
    this.analyzer = window.complianceAnalyzer;
    this.chartBuilder = window.chartBuilder;
    this.activeIndustry = 'healthcare';
    this.activeFramework = 'hipaa';
    this.currentVendor = window.uiController ? window.uiController.activeVendor : 'cisco';
    
    this.init();
  }
  
  init() {
    console.log('Initializing Compliance UI...');
    
    this.setupEventListeners();
    this.initComplianceChart();
    
    // Initial UI update
    this.updateIndustryUI(this.activeIndustry);
    this.updateFrameworkUI(this.activeFramework);
    
    console.log('Compliance UI initialized');
  }
  
  setupEventListeners() {
    // Industry selector
    const industryOptions = document.querySelectorAll('.industry-option');
    industryOptions.forEach(option => {
      option.addEventListener('click', () => {
        const industry = option.dataset.industry;
        this.setActiveIndustry(industry);
      });
    });
    
    // Framework tabs
    const frameworkTabs = document.querySelectorAll('.scorecard-tab');
    frameworkTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const framework = tab.dataset.framework;
        this.setActiveFramework(framework);
      });
    });
    
    // Help button
    const helpBtn = document.getElementById('compliance-help-btn');
    const helpModal = document.getElementById('compliance-help-modal');
    const helpModalClose = document.getElementById('compliance-help-modal-close');
    const helpModalCloseBtn = document.getElementById('compliance-help-modal-close-btn');
    
    if (helpBtn && helpModal) {
      helpBtn.addEventListener('click', () => {
        helpModal.classList.remove('hidden');
      });
      
      if (helpModalClose) {
        helpModalClose.addEventListener('click', () => {
          helpModal.classList.add('hidden');
        });
      }
      
      if (helpModalCloseBtn) {
        helpModalCloseBtn.addEventListener('click', () => {
          helpModal.classList.add('hidden');
        });
      }
    }
    
    // Return to calculator button
    const returnBtn = document.getElementById('return-to-calculator');
    if (returnBtn) {
      returnBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    }
    
    // Print report button
    const printBtn = document.getElementById('compliance-print-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
    
    // Add event delegation for framework detail buttons
    document.addEventListener('click', (event) => {
      if (event.target.classList.contains('view-framework-btn') || 
          event.target.closest('.view-framework-btn')) {
        const btn = event.target.classList.contains('view-framework-btn') ? 
          event.target : event.target.closest('.view-framework-btn');
        const framework = btn.dataset.framework;
        
        // Switch to framework in scorecard tabs
        this.setActiveFramework(framework);
        
        // Scroll to scorecard section
        document.querySelector('.compliance-scorecards').scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  }
  
  setActiveIndustry(industry) {
    if (this.activeIndustry === industry) return;
    
    this.activeIndustry = industry;
    
    // Update UI
    document.querySelectorAll('.industry-option').forEach(option => {
      option.classList.toggle('active', option.dataset.industry === industry);
    });
    
    this.updateIndustryUI(industry);
    
    // Set active framework to first relevant one
    const relevantFrameworks = this.analyzer.getIndustryFrameworks(industry);
    if (relevantFrameworks.length > 0 && !relevantFrameworks.includes(this.activeFramework)) {
      this.setActiveFramework(relevantFrameworks[0]);
    } else {
      this.updateFrameworkUI(this.activeFramework);
    }
    
    // Update compliance chart
    this.updateComplianceChart();
  }
  
  setActiveFramework(framework) {
    if (this.activeFramework === framework) return;
    
    this.activeFramework = framework;
    
    // Update UI
    document.querySelectorAll('.scorecard-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.framework === framework);
    });
    
    this.updateFrameworkUI(framework);
  }
  
  updateIndustryUI(industry) {
    const industryData = this.analyzer.data.industries[industry];
    if (!industryData) return;
    
    // Update industry name
    const industryNameEl = document.getElementById('industry-name');
    if (industryNameEl) {
      industryNameEl.textContent = industryData.name;
    }
    
    // Update regulatory requirements
    const regulatoryContent = document.getElementById('regulatory-content');
    if (regulatoryContent) {
      regulatoryContent.innerHTML = this.analyzer.generateRegulatoryRequirements(industry);
    }
    
    // Update framework tabs visibility based on relevance
    const relevantFrameworks = industryData.frameworks || [];
    document.querySelectorAll('.scorecard-tab').forEach(tab => {
      const framework = tab.dataset.framework;
      tab.style.display = relevantFrameworks.includes(framework) ? 'block' : 'none';
    });
    
    // Update industry requirements
    this.updateIndustryRequirements(industry);
  }
  
  updateFrameworkUI(framework) {
    // Update scorecard content
    const scorecardDetails = document.getElementById('scorecard-details');
    if (scorecardDetails) {
      scorecardDetails.innerHTML = this.analyzer.generateFrameworkScorecard(framework, this.currentVendor);
    }
  }
  
  updateIndustryRequirements(industry) {
    const industryData = this.analyzer.data.industries[industry];
    if (!industryData || !industryData.requirements) return;
    
    // Update requirement cards
    const requirements = industryData.requirements;
    const requirementCards = document.querySelectorAll('.requirement-card');
    
    if (requirementCards.length === requirements.length) {
      requirementCards.forEach((card, index) => {
        const req = requirements[index];
        const portnoxScore = req.vendorScores['portnox'] || 0;
        const currentScore = req.vendorScores[this.currentVendor] || 0;
        
        // Update card content
        const icon = card.querySelector('.requirement-icon i');
        const title = card.querySelector('h4');
        const meter = card.querySelector('.compliance-value');
        const portnoxScoreEl = card.querySelector('.vendor-score.portnox');
        const currentScoreEl = card.querySelector('.vendor-score.current');
        
        if (title) title.textContent = req.name;
        if (meter) meter.style.width = portnoxScore + '%';
        if (portnoxScoreEl) portnoxScoreEl.textContent = portnoxScore + '%';
        if (currentScoreEl) currentScoreEl.textContent = currentScore + '%';
      });
    }
  }
  
  initComplianceChart() {
    const ctx = document.getElementById('compliance-coverage-chart');
    if (!ctx) {
      console.warn('Compliance coverage chart canvas element not found');
      return;
    }
    
    try {
      const ctxCanvas = ctx.getContext('2d');
      if (!ctxCanvas) {
        console.warn('Could not get 2D context for compliance coverage chart');
        return;
      }
      
      // Define chart configuration
      const chartConfig = {
        type: 'radar',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Portnox Cloud',
              data: [],
              backgroundColor: 'rgba(43, 210, 91, 0.3)',
              borderColor: '#2bd25b',
              borderWidth: 2,
              pointBackgroundColor: '#2bd25b',
              pointRadius: 4
            },
            {
              label: 'Current Solution',
              data: [],
              backgroundColor: 'rgba(136, 136, 136, 0.3)',
              borderColor: '#888888',
              borderWidth: 2,
              pointBackgroundColor: '#888888',
              pointRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              angleLines: {
                display: true
              },
              suggestedMin: 0,
              suggestedMax: 100,
              ticks: {
                stepSize: 20,
                callback: function(value) {
                  return value + '%';
                }
              }
            }
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 15,
                padding: 15
              }
            },
            title: {
              display: true,
              text: 'Compliance Framework Coverage',
              font: {
                size: 16,
                weight: 'bold'
              },
              padding: {
                top: 10,
                bottom: 20
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + context.raw + '%';
                }
              }
            }
          }
        }
      };
      
      // Create chart
      window.complianceChart = new Chart(ctxCanvas, chartConfig);
      
      // Initial update
      this.updateComplianceChart();
      
      console.log('Compliance coverage chart initialized');
    } catch (error) {
      console.error('Error initializing compliance coverage chart:', error);
    }
  }
  
  updateComplianceChart() {
    if (!window.complianceChart) {
      console.warn('Compliance chart not initialized');
      return;
    }
    
    try {
      // Get relevant frameworks for current industry
      const industryData = this.analyzer.data.industries[this.activeIndustry];
      if (!industryData) return;
      
      const frameworks = industryData.frameworks || [];
      const frameworkLabels = frameworks.map(id => {
        const framework = this.analyzer.data.frameworks[id];
        return framework ? framework.name : id;
      });
      
      // Get scores
      const portnoxScores = frameworks.map(id => {
        return this.analyzer.data.vendorCompliance['portnox'][id] || 0;
      });
      
      const currentScores = frameworks.map(id => {
        return this.analyzer.data.vendorCompliance[this.currentVendor][id] || 0;
      });
      
      // Update chart data
      window.complianceChart.data.labels = frameworkLabels;
      window.complianceChart.data.datasets[0].data = portnoxScores;
      window.complianceChart.data.datasets[1].data = currentScores;
      
      // Update current vendor label
      window.complianceChart.data.datasets[1].label = window.vendorData && window.vendorData[this.currentVendor] ? 
        window.vendorData[this.currentVendor].name : 'Current Solution';
      
      // Update legend in the document
      const currentVendorLegend = document.querySelector('.legend-item.current-vendor .legend-text');
      if (currentVendorLegend) {
        currentVendorLegend.textContent = window.vendorData && window.vendorData[this.currentVendor] ? 
          window.vendorData[this.currentVendor].name : 'Current Solution';
      }
      
      const currentVendorColor = document.querySelector('.legend-item.current-vendor .legend-color');
      if (currentVendorColor && window.chartBuilder && window.chartBuilder.chartColors) {
        currentVendorColor.style.backgroundColor = window.chartBuilder.chartColors[this.currentVendor] || '#888888';
      }
      
      // Update chart
      window.complianceChart.update();
      
      console.log('Compliance chart updated');
    } catch (error) {
      console.error('Error updating compliance chart:', error);
    }
  }
}

// Initialize compliance UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.complianceUI = new ComplianceUI();
});
