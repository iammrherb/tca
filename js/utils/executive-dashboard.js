/**
 * Executive Dashboard for Zero Trust NAC Architecture Designer Pro
 * Focuses on ROI, TCO, Security Benefits, and Executive Decision Support
 */

class ExecutiveDashboard {
  constructor() {
    this.calculator = window.calculator;
    this.chartBuilder = window.chartBuilder;
    this.fteAnalyzer = window.fteAnalyzer;
    this.results = null;
    
    this.init();
  }
  
  init() {
    console.log('Initializing Executive Dashboard...');
    
    // Load latest results from calculator
    if (this.calculator && this.calculator.results) {
      this.results = this.calculator.results;
    } else {
      // Show message if no results available
      this.showMessage('No calculation results available. Please run the calculator first.', 'warning');
      return;
    }
    
    // Initialize dashboard
    this.initCharts();
    this.updateKPIs();
    this.setupEventListeners();
    
    console.log('Executive Dashboard initialized');
  }
  
  initCharts() {
    // Initialize all charts using the enhanced chart builder
    if (this.chartBuilder.initExecutiveDashboard) {
      this.chartBuilder.initExecutiveDashboard();
    } else {
      console.warn('Enhanced chart builder not available, using standard charts');
      this.chartBuilder.initTCOComparisonChart();
      this.chartBuilder.initROIChart();
      this.chartBuilder.initFeatureComparisonChart();
    }
    
    // Update charts with data
    this.updateCharts();
  }
  
  updateCharts() {
    if (!this.results) return;
    
    const currentVendor = window.uiController ? window.uiController.activeVendor : 'cisco';
    
    // Update standard charts
    this.chartBuilder.updateTCOComparisonChart(this.results);
    this.chartBuilder.updateROIChart(this.results);
    this.chartBuilder.updateFeatureComparisonChart(currentVendor);
    
    // Update enhanced charts if available
    if (this.chartBuilder.updateFTESavingsChart) {
      this.chartBuilder.updateFTESavingsChart(this.results);
    }
    
    if (this.chartBuilder.updateComplianceRadarChart) {
      this.chartBuilder.updateComplianceRadarChart(currentVendor);
    }
    
    if (this.chartBuilder.updateCostProjectionChart) {
      this.chartBuilder.updateCostProjectionChart(this.results);
    }
  }
  
  updateKPIs() {
    if (!this.results) return;
    
    const currentVendor = window.uiController ? window.uiController.activeVendor : 'cisco';
    
    if (!this.results[currentVendor] || !this.results['portnox']) {
      console.warn('Missing data for KPI calculation');
      return;
    }
    
    // Calculate 5-year TCO savings
    const currentTCO = this.results[currentVendor].totalCost;
    const portnoxTCO = this.results['portnox'].totalCost;
    const tcoSavings = currentTCO - portnoxTCO;
    const tcoSavingsPercent = (tcoSavings / currentTCO * 100).toFixed(0);
    
    // Format for display
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    
    // Update TCO savings KPI
    document.getElementById('tco-savings').textContent = formatter.format(tcoSavings);
    document.querySelector('#tco-savings + .metric-change').textContent = 
      tcoSavingsPercent + '% lower than current solution';
    
    // Calculate implementation time comparison
    const currentImplTime = this.results[currentVendor].implementationDays || 60;
    const portnoxImplTime = this.results['portnox'].implementationDays || 15;
    const implSavingsPercent = ((currentImplTime - portnoxImplTime) / currentImplTime * 100).toFixed(0);
    
    // Update implementation time KPI
    document.getElementById('implementation-time').textContent = portnoxImplTime + ' days';
    document.querySelector('#implementation-time + .metric-change').textContent = 
      implSavingsPercent + '% faster than current solution';
    
    // Calculate FTE savings
    let fteSavings = 180000; // Default value
    let fteCount = 3; // Default value
    
    if (this.fteAnalyzer) {
      // Calculate FTE costs for each vendor
      const vendorFTECosts = {};
      
      for (const vendor in this.results) {
        vendorFTECosts[vendor] = this.fteAnalyzer.calculateFTECosts(vendor);
      }
      
      // Calculate FTE savings
      if (vendorFTECosts[currentVendor] && vendorFTECosts['portnox']) {
        fteSavings = vendorFTECosts[currentVendor].costPerYear - vendorFTECosts['portnox'].costPerYear;
        const hoursSaved = vendorFTECosts[currentVendor].hoursPerMonth - vendorFTECosts['portnox'].hoursPerMonth;
        fteCount = (hoursSaved / 160).toFixed(1); // Assuming 160 hours = 1 FTE
      }
    }
    
    // Update FTE savings KPI
    document.getElementById('fte-savings').textContent = formatter.format(fteSavings);
    document.querySelector('#fte-savings + .metric-change').textContent = 
      fteCount + ' FTEs redeployed to strategic initiatives';
    
    // Calculate security improvement
    const secImprovement = this.calculateSecurityImprovement(currentVendor);
    
    // Update security improvement KPI
    document.getElementById('security-improvement').textContent = secImprovement + '%';
  }
  
  calculateSecurityImprovement(currentVendor) {
    // Define security scores for each vendor (0-100 scale)
    const securityScores = {
      cisco: { score: 72, maxPossible: 100 },
      aruba: { score: 68, maxPossible: 100 },
      forescout: { score: 75, maxPossible: 100 },
      nps: { score: 55, maxPossible: 100 },
      fortinac: { score: 70, maxPossible: 100 },
      securew2: { score: 65, maxPossible: 100 },
      portnox: { score: 90, maxPossible: 100 }
    };
    
    if (!securityScores[currentVendor]) return 25; // Default
    
    const currentScore = securityScores[currentVendor].score;
    const portnoxScore = securityScores['portnox'].score;
    const improvement = ((portnoxScore - currentScore) / currentScore * 100).toFixed(0);
    
    return improvement;
  }
  
  setupEventListeners() {
    // Help button
    const helpBtn = document.getElementById('dashboard-help-btn');
    const helpModal = document.getElementById('dashboard-help-modal');
    const helpModalClose = document.getElementById('dashboard-help-modal-close');
    const helpModalCloseBtn = document.getElementById('dashboard-help-modal-close-btn');
    
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
    const printBtn = document.getElementById('exec-print-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }
  
  showMessage(message, type = 'info') {
    const messageContainer = document.getElementById('message-container');
    if (!messageContainer) return;
    
    const messageEl = document.createElement('div');
    messageEl.className = `alert alert-${type}`;
    messageEl.innerHTML = message;
    
    messageContainer.innerHTML = '';
    messageContainer.appendChild(messageEl);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      messageEl.style.opacity = '0';
      setTimeout(() => {
        messageContainer.innerHTML = '';
      }, 300);
    }, 5000);
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.executiveDashboard = new ExecutiveDashboard();
});
