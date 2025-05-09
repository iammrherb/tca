/**
 * Advanced Sensitivity Analyzer
 * Provides detailed sensitivity analysis with explainable AI-style analysis
 */
(function() {
  console.log('Installing Advanced Sensitivity Analyzer...');
  
  // Styling for sensitivity analyzer
  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Sensitivity Analysis Modal Styling */
      .sensitivity-modal-container {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        justify-content: center;
        align-items: center;
      }
      
      .sensitivity-modal-container.visible {
        display: flex;
      }
      
      .sensitivity-analysis-modal {
        background: white;
        width: 90%;
        max-width: 1200px;
        max-height: 90vh;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      
      .sensitivity-modal-header {
        background: #1B67B2;
        color: white;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }
      
      .sensitivity-modal-header h2 {
        margin: 0;
        font-size: 1.5rem;
      }
      
      .sensitivity-modal-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        margin: 0;
      }
      
      .sensitivity-modal-body {
        padding: 20px;
        overflow-y: auto;
        max-height: calc(90vh - 136px);
      }
      
      .sensitivity-modal-footer {
        padding: 15px 20px;
        background: #f8f9fa;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        border-top: 1px solid #ddd;
      }
      
      .introduction-section {
        margin-bottom: 30px;
      }
      
      .sensitivity-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 30px;
      }
      
      @media (max-width: 768px) {
        .sensitivity-grid {
          grid-template-columns: 1fr;
        }
      }
      
      .sensitivity-panel {
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
      }
      
      .sensitivity-panel-header {
        background: #f8f9fa;
        padding: 15px 20px;
        border-bottom: 1px solid #ddd;
      }
      
      .sensitivity-panel-header h3 {
        margin: 0;
        color: #1B67B2;
        font-size: 1.2rem;
      }
      
      .sensitivity-panel-body {
        padding: 20px;
      }
      
      .chart-container {
        height: 300px;
        margin-bottom: 20px;
      }
      
      .sensitivity-controls {
        margin-top: 30px;
      }
      
      .parameter-sliders {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }
      
      .parameter-slider {
        margin-bottom: 15px;
      }
      
      .parameter-slider label {
        display: block;
        font-weight: 500;
        margin-bottom: 5px;
        color: #303030;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .parameter-slider label .sensitivity-badge {
        font-size: 0.8rem;
        padding: 2px 8px;
        border-radius: 10px;
        font-weight: 500;
      }
      
      .sensitivity-badge.high {
        background-color: #ffcccc;
        color: #cc0000;
      }
      
      .sensitivity-badge.medium {
        background-color: #fff2cc;
        color: #cc7a00;
      }
      
      .sensitivity-badge.low {
        background-color: #d9ecd9;
        color: #007a00;
      }
      
      .parameter-slider .slider-container {
        position: relative;
        padding-top: 25px;
      }
      
      .parameter-slider input[type="range"] {
        width: 100%;
        margin: 0;
      }
      
      .parameter-slider .slider-values {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #707070;
        margin-top: 5px;
      }
      
      .parameter-slider .slider-value {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        background: #1B67B2;
        color: white;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 12px;
        white-space: nowrap;
      }
      
      .analysis-card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.07);
        padding: 20px;
        margin-bottom: 20px;
        transition: all 0.3s ease;
      }
      
      .analysis-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 14px rgba(0,0,0,0.1);
      }
      
      .analysis-card h4 {
        color: #1B67B2;
        margin-top: 0;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(0,0,0,0.05);
      }
      
      .parameter-impact {
        margin-bottom: 15px;
      }
      
      .parameter-impact h5 {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 0;
        margin-bottom: 10px;
        color: #505050;
      }
      
      .impact-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 15px;
        margin-top: 20px;
      }
      
      .impact-card {
        background: white;
        border-radius: 6px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        padding: 15px;
        border-left: 4px solid #1B67B2;
      }
      
      .impact-card.positive {
        border-left-color: #2BD25B;
      }
      
      .impact-card.negative {
        border-left-color: #cc0000;
      }
      
      .impact-card.neutral {
        border-left-color: #ffcc00;
      }
      
      .impact-card h5 {
        margin-top: 0;
        margin-bottom: 10px;
        color: #303030;
      }
      
      .impact-card p {
        margin: 0;
        font-size: 0.9rem;
        color: #505050;
      }
      
      .breakeven-analysis {
        margin-top: 30px;
      }
      
      .breakeven-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 15px;
      }
      
      .breakeven-card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.07);
        padding: 20px;
        border-left: 4px solid #1B67B2;
      }
      
      .breakeven-card h4 {
        margin-top: 0;
        margin-bottom: 15px;
        color: #1B67B2;
      }
      
      .breakeven-value {
        font-size: 1.8rem;
        font-weight: 600;
        color: #2BD25B;
        margin-bottom: 10px;
      }
      
      .breakeven-card p {
        margin: 0;
        color: #505050;
      }
      
      .roi-chart {
        margin-top: 30px;
      }
      
      .recommendations-section {
        margin-top: 30px;
      }
      
      .recommendations-list {
        margin-top: 15px;
      }
      
      .recommendation-item {
        display: flex;
        gap: 15px;
        margin-bottom: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid #eee;
      }
      
      .recommendation-item:last-child {
        border-bottom: none;
      }
      
      .recommendation-icon {
        color: #2BD25B;
        font-size: 1.5rem;
        min-width: 24px;
      }
      
      .recommendation-content h5 {
        margin-top: 0;
        margin-bottom: 8px;
        color: #303030;
      }
      
      .recommendation-content p {
        margin: 0;
        color: #505050;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // Create Advanced Sensitivity Analyzer
  function createSensitivityAnalyzer() {
    // Update existing button
    const existingBtn = document.getElementById('sensitivity-analysis-btn');
    if (existingBtn) {
      // Replace click handler
      const newClickHandler = function(e) {
        e.preventDefault();
        openSensitivityModal();
      };
      
      // Clone node to remove existing event listeners
      const newBtn = existingBtn.cloneNode(true);
      existingBtn.parentNode.replaceChild(newBtn, existingBtn);
      
      // Add new click handler
      newBtn.addEventListener('click', newClickHandler);
    }
    
    // Create sensitivity modal
    const modalContainer = document.createElement('div');
    modalContainer.className = 'sensitivity-modal-container';
    modalContainer.id = 'sensitivity-analysis-modal-container';
    
    modalContainer.innerHTML = `
      <div class="sensitivity-analysis-modal">
        <div class="sensitivity-modal-header">
          <h2><i class="fas fa-chart-line"></i> Advanced Sensitivity Analysis</h2>
          <button type="button" class="sensitivity-modal-close">&times;</button>
        </div>
        <div class="sensitivity-modal-body">
          <div class="introduction-section">
            <h3>TCO Sensitivity Analysis</h3>
            <p>This advanced analysis allows you to understand how different parameters affect your Total Cost of Ownership (TCO) and Return on Investment (ROI) when comparing Portnox Cloud with on-premises NAC solutions.</p>
            <p>Adjust the parameters below to see how changes impact the final results. The analysis will update in real-time to show you which factors have the most significant impact on your TCO and ROI.</p>
          </div>
          
          <div class="sensitivity-grid">
            <div class="sensitivity-panel">
              <div class="sensitivity-panel-header">
                <h3>Cost Impact Analysis</h3>
              </div>
              <div class="sensitivity-panel-body">
                <div class="chart-container">
                  <canvas id="sensitivity-cost-chart"></canvas>
                </div>
                <p>This chart shows how adjusting each parameter affects the 3-year TCO difference between Portnox Cloud and on-premises solutions. Positive values indicate increased savings with Portnox Cloud.</p>
              </div>
            </div>
            
            <div class="sensitivity-panel">
              <div class="sensitivity-panel-header">
                <h3>ROI Timeline Analysis</h3>
              </div>
              <div class="sensitivity-panel-body">
                <div class="chart-container">
                  <canvas id="sensitivity-roi-chart"></canvas>
                </div>
                <p>This chart illustrates how different parameters affect the Return on Investment (ROI) timeline. Negative impact means longer ROI timelines, while positive impact means faster ROI.</p>
              </div>
            </div>
          </div>
          
          <div class="sensitivity-controls">
            <h3>Parameter Sensitivity Controls</h3>
            <p>Adjust the parameters below to see how they impact your TCO and ROI. Parameters with high sensitivity have a stronger impact on the final results.</p>
            
            <div class="parameter-sliders">
              <div class="parameter-slider">
                <label for="sa-devices-slider">
                  Number of Devices
                  <span class="sensitivity-badge high">High Sensitivity</span>
                </label>
                <div class="slider-container">
                  <input type="range" id="sa-devices-slider" min="100" max="10000" step="100" value="1000">
                  <div class="slider-value" id="sa-devices-value">1,000 devices</div>
                </div>
                <div class="slider-values">
                  <span>100</span>
                  <span>10,000</span>
                </div>
              </div>
              
              <div class="parameter-slider">
                <label for="sa-locations-slider">
                  Number of Locations
                  <span class="sensitivity-badge high">High Sensitivity</span>
                </label>
                <div class="slider-container">
                  <input type="range" id="sa-locations-slider" min="1" max="50" step="1" value="3">
                  <div class="slider-value" id="sa-locations-value">3 locations</div>
                </div>
                <div class="slider-values">
                  <span>1</span>
                  <span>50</span>
                </div>
              </div>
              
              <div class="parameter-slider">
                <label for="sa-implementation-slider">
                  Implementation Complexity
                  <span class="sensitivity-badge medium">Medium Sensitivity</span>
                </label>
                <div class="slider-container">
                  <input type="range" id="sa-implementation-slider" min="1" max="5" step="1" value="3">
                  <div class="slider-value" id="sa-implementation-value">Medium (3/5)</div>
                </div>
                <div class="slider-values">
                  <span>Simple</span>
                  <span>Complex</span>
                </div>
              </div>
              
              <div class="parameter-slider">
                <label for="sa-staff-slider">
                  IT Staff Cost ($/yr)
                  <span class="sensitivity-badge medium">Medium Sensitivity</span>
                </label>
                <div class="slider-container">
                  <input type="range" id="sa-staff-slider" min="50000" max="200000" step="10000" value="100000">
                  <div class="slider-value" id="sa-staff-value">$100,000</div>
                </div>
                <div class="slider-values">
                  <span>$50K</span>
                  <span>$200K</span>
                </div>
              </div>
              
              <div class="parameter-slider">
                <label for="sa-hardware-slider">
                  Hardware Cost Multiplier
                  <span class="sensitivity-badge medium">Medium Sensitivity</span>
                </label>
                <div class="slider-container">
                  <input type="range" id="sa-hardware-slider" min="0.5" max="2.0" step="0.1" value="1.0">
                  <div class="slider-value" id="sa-hardware-value">1.0x</div>
                </div>
                <div class="slider-values">
                  <span>0.5x</span>
                  <span>2.0x</span>
                </div>
              </div>
              
              <div class="parameter-slider">
                <label for="sa-licensing-slider">
                  Licensing Cost Multiplier
                  <span class="sensitivity-badge high">High Sensitivity</span>
                </label>
                <div class="slider-container">
                  <input type="range" id="sa-licensing-slider" min="0.5" max="2.0" step="0.1" value="1.0">
                  <div class="slider-value" id="sa-licensing-value">1.0x</div>
                </div>
                <div class="slider-values">
                  <span>0.5x</span>
                  <span>2.0x</span>
                </div>
              </div>
              
              <div class="parameter-slider">
                <label for="sa-compliance-slider">
                  Compliance Requirements
                  <span class="sensitivity-badge medium">Medium Sensitivity</span>
                </label>
                <div class="slider-container">
                  <input type="range" id="sa-compliance-slider" min="1" max="5" step="1" value="3">
                  <div class="slider-value" id="sa-compliance-value">Medium (3/5)</div>
                </div>
                <div class="slider-values">
                  <span>Basic</span>
                  <span>Stringent</span>
                </div>
              </div>
              
              <div class="parameter-slider">
                <label for="sa-years-slider">
                  Projection Years
                  <span class="sensitivity-badge low">Low Sensitivity</span>
                </label>
                <div class="slider-container">
                  <input type="range" id="sa-years-slider" min="1" max="7" step="1" value="3">
                  <div class="slider-value" id="sa-years-value">3 years</div>
                </div>
                <div class="slider-values">
                  <span>1</span>
                  <span>7</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="analysis-card">
            <h4>Parameter Impact Analysis</h4>
            <p>This analysis shows how each parameter affects your TCO and ROI when comparing Portnox Cloud to on-premises NAC solutions.</p>
            
            <div class="parameter-impact">
              <h5><i class="fas fa-server"></i> Device Count Impact</h5>
              <p>As device count increases, on-premises solutions scale less efficiently than cloud-based alternatives. Hardware costs and management overhead increase significantly with each additional location for on-premises deployments.</p>
              <p><strong>Current Impact:</strong> <span id="device-impact-value">$75,000 additional savings with Portnox Cloud</span></p>
            </div>
            
            <div class="parameter-impact">
              <h5><i class="fas fa-map-marker-alt"></i> Location Count Impact</h5>
              <p>Each additional location requires hardware deployment, maintenance, and management for on-premises solutions, while cloud solutions maintain centralized management regardless of location count.</p>
              <p><strong>Current Impact:</strong> <span id="location-impact-value">$45,000 additional savings with Portnox Cloud</span></p>
            </div>
            
            <div class="parameter-impact">
              <h5><i class="fas fa-tools"></i> Implementation Complexity Impact</h5>
              <p>Higher implementation complexity exponentially increases professional services costs and deployment time for on-premises solutions, while cloud deployments maintain a more linear cost increase.</p>
              <p><strong>Current Impact:</strong> <span id="complexity-impact-value">$30,000 additional savings with Portnox Cloud</span></p>
            </div>
            
            <div class="impact-grid">
              <div class="impact-card positive">
                <h5>Scalability Advantage</h5>
                <p>Portnox Cloud scales efficiently with increased device counts and locations, maintaining consistent per-device costs regardless of deployment size.</p>
              </div>
              
              <div class="impact-card positive">
                <h5>Implementation Timeline</h5>
                <p>Implementation timelines for on-premises solutions increase with complexity, while cloud deployments maintain relatively consistent timelines.</p>
              </div>
              
              <div class="impact-card positive">
                <h5>Maintenance Overhead</h5>
                <p>Maintenance requirements scale with complexity and size for on-premises solutions, while cloud solutions maintain consistent overhead regardless of scale.</p>
              </div>
              
              <div class="impact-card neutral">
                <h5>Licensing Costs</h5>
                <p>Both solutions scale licensing costs with device count, though on-premises solutions often have more complex licensing structures.</p>
              </div>
            </div>
          </div>
          
          <div class="breakeven-analysis">
            <h3>Breakeven Analysis</h3>
            <p>Based on your current parameters, these are the breakeven points for key metrics:</p>
            
            <div class="breakeven-grid">
              <div class="breakeven-card">
                <h4>ROI Breakeven</h4>
                <div class="breakeven-value" id="roi-breakeven-value">9 months</div>
                <p>The time required to recover the initial investment in Portnox Cloud compared to on-premises alternatives.</p>
              </div>
              
              <div class="breakeven-card">
                <h4>TCO Breakeven</h4>
                <div class="breakeven-value" id="tco-breakeven-value">18 months</div>
                <p>The point where the total cost of Portnox Cloud becomes lower than on-premises alternatives.</p>
              </div>
              
              <div class="breakeven-card">
                <h4>Device Count Breakeven</h4>
                <div class="breakeven-value" id="device-breakeven-value">250 devices</div>
                <p>The minimum device count where Portnox Cloud provides cost savings compared to on-premises alternatives.</p>
              </div>
            </div>
          </div>
          
          <div class="roi-chart">
            <h3>Cumulative ROI Projection</h3>
            <div class="chart-container">
              <canvas id="roi-projection-chart"></canvas>
            </div>
            <p>This chart shows the cumulative ROI over time for both solutions based on your current parameter settings. Positive values indicate positive returns on investment.</p>
          </div>
          
          <div class="recommendations-section">
            <h3>Recommendations Based on Sensitivity Analysis</h3>
            <p>Based on your organization's parameters and sensitivity analysis, here are key recommendations:</p>
            
            <div class="recommendations-list">
              <div class="recommendation-item">
                <div class="recommendation-icon">
                  <i class="fas fa-check-circle"></i>
                </div>
                <div class="recommendation-content">
                  <h5>Prioritize Multi-Location Analysis</h5>
                  <p>Your multi-location environment significantly impacts TCO calculations. Ensure detailed analysis of hardware and support requirements for each location in on-premises scenarios.</p>
                </div>
              </div>
              
              <div class="recommendation-item">
                <div class="recommendation-icon">
                  <i class="fas fa-check-circle"></i>
                </div>
                <div class="recommendation-content">
                  <h5>Account for Scaling Complexity</h5>
                  <p>Implementation and maintenance complexity increases non-linearly with on-premises solutions as device count grows. Factor in additional professional services costs for larger deployments.</p>
                </div>
              </div>
              
              <div class="recommendation-item">
                <div class="recommendation-icon">
                  <i class="fas fa-check-circle"></i>
                </div>
                <div class="recommendation-content">
                  <h5>Consider IT Resource Allocation</h5>
                  <p>On-premises solutions require significant IT resources for management and maintenance. Factor in opportunity costs of IT personnel when evaluating TCO.</p>
                </div>
              </div>
              
              <div class="recommendation-item">
                <div class="recommendation-icon">
                  <i class="fas fa-check-circle"></i>
                </div>
                <div class="recommendation-content">
                  <h5>Evaluate Compliance Overhead</h5>
                  <p>Compliance requirements add significant overhead to both solutions, but impact on-premises deployments more heavily. Consider the long-term compliance maintenance costs in your TCO evaluation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="sensitivity-modal-footer">
          <button id="sensitivity-apply-btn" class="btn btn-primary">Apply Analysis</button>
          <button id="sensitivity-close-btn" class="btn btn-outline">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modalContainer);
    
    // Set up event listeners
    setupSensitivityModalListeners();
    
    // Initialize charts
    setTimeout(initializeSensitivityCharts, 500);
  }
  
  // Set up event listeners for sensitivity modal
  function setupSensitivityModalListeners() {
    const modalContainer = document.getElementById('sensitivity-analysis-modal-container');
    const closeBtn = modalContainer.querySelector('.sensitivity-modal-close');
    const applyBtn = document.getElementById('sensitivity-apply-btn');
    const closeFooterBtn = document.getElementById('sensitivity-close-btn');
    
    // Close button handler
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modalContainer.classList.remove('visible');
      });
    }
    
    // Close footer button handler
    if (closeFooterBtn) {
      closeFooterBtn.addEventListener('click', () => {
        modalContainer.classList.remove('visible');
      });
    }
    
    // Click outside to close
    modalContainer.addEventListener('click', (e) => {
      if (e.target === modalContainer) {
        modalContainer.classList.remove('visible');
      }
    });
    
    // Apply button handler
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        applySensitivityAnalysis();
        modalContainer.classList.remove('visible');
      });
    }
    
    // Set up sliders
    setupSensitivitySliders();
  }
  
  // Open sensitivity modal
  function openSensitivityModal() {
    const modalContainer = document.getElementById('sensitivity-analysis-modal-container');
    if (modalContainer) {
      modalContainer.classList.add('visible');
      
      // Update charts
      updateSensitivityCharts();
      
      // Update impact values
      updateImpactValues();
      
      // Update breakeven values
      updateBreakevenValues();
    }
  }
  
  // Set up sensitivity sliders
  function setupSensitivitySliders() {
    const slidersData = [
      { id: 'sa-devices-slider', valueId: 'sa-devices-value', format: (val) => `${parseInt(val).toLocaleString()} devices` },
      { id: 'sa-locations-slider', valueId: 'sa-locations-value', format: (val) => `${val} location${val > 1 ? 's' : ''}` },
      { id: 'sa-staff-slider', valueId: 'sa-staff-value', format: (val) => `$${parseInt(val).toLocaleString()}` },
      { id: 'sa-years-slider', valueId: 'sa-years-value', format: (val) => `${val} year${val > 1 ? 's' : ''}` },
      { id: 'sa-hardware-slider', valueId: 'sa-hardware-value', format: (val) => `${val}x` },
      { id: 'sa-licensing-slider', valueId: 'sa-licensing-value', format: (val) => `${val}x` },
      { 
        id: 'sa-implementation-slider', 
        valueId: 'sa-implementation-value', 
        format: (val) => {
          const labels = ['Very Simple', 'Simple', 'Medium', 'Complex', 'Very Complex'];
          return `${labels[val-1]} (${val}/5)`;
        } 
      },
      { 
        id: 'sa-compliance-slider', 
        valueId: 'sa-compliance-value', 
        format: (val) => {
          const labels = ['Basic', 'Standard', 'Medium', 'Advanced', 'Stringent'];
          return `${labels[val-1]} (${val}/5)`;
        } 
      }
    ];
    
    slidersData.forEach(sliderData => {
      const slider = document.getElementById(sliderData.id);
      const valueEl = document.getElementById(sliderData.valueId);
      
      if (slider && valueEl) {
        // Set initial value
        valueEl.textContent = sliderData.format(slider.value);
        
        // Add input event listener
        slider.addEventListener('input', function() {
          valueEl.textContent = sliderData.format(this.value);
          
          // Update charts
          updateSensitivityCharts();
          
          // Update impact values
          updateImpactValues();
          
          // Update breakeven values
          updateBreakevenValues();
        });
      }
    });
  }
  
  // Initialize sensitivity charts
  function initializeSensitivityCharts() {
    // Cost Impact Chart
    const costCanvas = document.getElementById('sensitivity-cost-chart');
    if (costCanvas) {
      const ctx = costCanvas.getContext('2d');
      
      window._sensitivityCostChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Device Count', 'Locations', 'Complexity', 'IT Staff Cost', 'Hardware Cost', 'Licensing Cost', 'Compliance'],
          datasets: [
            {
              label: 'Impact on TCO Savings ($)',
              data: [75000, 45000, 30000, 25000, 20000, 35000, 15000],
              backgroundColor: 'rgba(43, 210, 91, 0.7)',
              borderColor: 'rgba(43, 210, 91, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': $' + context.raw.toLocaleString();
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Impact on TCO Savings ($)'
              },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          }
        }
      });
    }
    
    // ROI Timeline Chart
    const roiCanvas = document.getElementById('sensitivity-roi-chart');
    if (roiCanvas) {
      const ctx = roiCanvas.getContext('2d');
      
      window._sensitivityRoiChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Device Count', 'Locations', 'Complexity', 'IT Staff Cost', 'Hardware Cost', 'Licensing Cost', 'Compliance'],
          datasets: [
            {
              label: 'Impact on ROI Timeline (months)',
              data: [-3, -2, -1.5, -1, -0.8, 2, 0.5],
              backgroundColor: function(context) {
                const value = context.dataset.data[context.dataIndex];
                return value < 0 ? 'rgba(43, 210, 91, 0.7)' : 'rgba(255, 99, 132, 0.7)';
              },
              borderColor: function(context) {
                const value = context.dataset.data[context.dataIndex];
                return value < 0 ? 'rgba(43, 210, 91, 1)' : 'rgba(255, 99, 132, 1)';
              },
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.raw;
                  return value < 0 
                    ? `${context.dataset.label}: ${Math.abs(value)} months faster ROI` 
                    : `${context.dataset.label}: ${value} months slower ROI`;
                }
              }
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Impact on ROI Timeline (months)'
              },
              ticks: {
                callback: function(value) {
                  return value < 0 ? Math.abs(value) + ' mo faster' : value + ' mo slower';
                }
              }
            }
          }
        }
      });
    }
    
    // ROI Projection Chart
    const projectionCanvas = document.getElementById('roi-projection-chart');
    if (projectionCanvas) {
      const ctx = projectionCanvas.getContext('2d');
      
      window._roiProjectionChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Month 0', 'Month 3', 'Month 6', 'Month 9', 'Month 12', 'Month 18', 'Month 24', 'Month 36'],
          datasets: [
            {
              label: 'Portnox Cloud Cumulative ROI',
              data: [-75000, -50000, -25000, 0, 25000, 75000, 125000, 225000],
              borderColor: 'rgba(43, 210, 91, 1)',
              backgroundColor: 'rgba(43, 210, 91, 0.1)',
              tension: 0.3,
              fill: true
            },
            {
              label: 'On-Premises NAC Cumulative ROI',
              data: [-150000, -140000, -130000, -120000, -100000, -60000, -20000, 40000],
              borderColor: 'rgba(27, 103, 178, 1)',
              backgroundColor: 'rgba(27, 103, 178, 0.1)',
              tension: 0.3,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.raw;
                  const sign = value < 0 ? '-' : '';
                  return context.dataset.label + ': ' + sign + '$' + Math.abs(value).toLocaleString();
                }
              }
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Cumulative ROI ($)'
              },
              ticks: {
                callback: function(value) {
                  const sign = value < 0 ? '-' : '';
                  return sign + '$' + Math.abs(value).toLocaleString();
                }
              }
            }
          }
        }
      });
    }
    
    // Initial update
    updateSensitivityCharts();
  }
  
  // Update sensitivity charts based on slider values
  function updateSensitivityCharts() {
    // Get slider values
    const deviceCount = parseInt(document.getElementById('sa-devices-slider')?.value || 1000);
    const locationCount = parseInt(document.getElementById('sa-locations-slider')?.value || 3);
    const implementationComplexity = parseInt(document.getElementById('sa-implementation-slider')?.value || 3);
    const staffCost = parseInt(document.getElementById('sa-staff-slider')?.value || 100000);
    const hardwareCostMultiplier = parseFloat(document.getElementById('sa-hardware-slider')?.value || 1.0);
    const licensingCostMultiplier = parseFloat(document.getElementById('sa-licensing-slider')?.value || 1.0);
    const complianceComplexity = parseInt(document.getElementById('sa-compliance-slider')?.value || 3);
    const years = parseInt(document.getElementById('sa-years-slider')?.value || 3);
    
    // Calculate impact values for cost savings
    const deviceImpact = calculateDeviceImpact(deviceCount);
    const locationImpact = calculateLocationImpact(locationCount);
    const complexityImpact = calculateComplexityImpact(implementationComplexity);
    const staffImpact = calculateStaffImpact(staffCost);
    const hardwareImpact = calculateHardwareImpact(hardwareCostMultiplier);
    const licensingImpact = calculateLicensingImpact(licensingCostMultiplier);
    const complianceImpact = calculateComplianceImpact(complianceComplexity);
    
    // Update Cost Impact Chart
    if (window._sensitivityCostChart) {
      window._sensitivityCostChart.data.datasets[0].data = [
        deviceImpact,
        locationImpact,
        complexityImpact,
        staffImpact,
        hardwareImpact,
        licensingImpact,
        complianceImpact
      ];
      
      window._sensitivityCostChart.update();
    }
    
    // Calculate impact values for ROI timeline
    const deviceRoiImpact = calculateDeviceRoiImpact(deviceCount);
    const locationRoiImpact = calculateLocationRoiImpact(locationCount);
    const complexityRoiImpact = calculateComplexityRoiImpact(implementationComplexity);
    const staffRoiImpact = calculateStaffRoiImpact(staffCost);
    const hardwareRoiImpact = calculateHardwareRoiImpact(hardwareCostMultiplier);
    const licensingRoiImpact = calculateLicensingRoiImpact(licensingCostMultiplier);
    const complianceRoiImpact = calculateComplianceRoiImpact(complianceComplexity);
    
    // Update ROI Timeline Chart
    if (window._sensitivityRoiChart) {
      window._sensitivityRoiChart.data.datasets[0].data = [
        deviceRoiImpact,
        locationRoiImpact,
        complexityRoiImpact,
        staffRoiImpact,
        hardwareRoiImpact,
        licensingRoiImpact,
        complianceRoiImpact
      ];
      
      window._sensitivityRoiChart.update();
    }
    
    // Update ROI Projection Chart
    if (window._roiProjectionChart) {
      // Calculate ROI projection
      const portnoxRoi = calculatePortnoxRoi(
        deviceCount, 
        locationCount, 
        implementationComplexity, 
        staffCost, 
        hardwareCostMultiplier, 
        licensingCostMultiplier, 
        complianceComplexity
      );
      
      const onPremRoi = calculateOnPremRoi(
        deviceCount, 
        locationCount, 
        implementationComplexity, 
        staffCost, 
        hardwareCostMultiplier, 
        licensingCostMultiplier, 
        complianceComplexity
      );
      
      window._roiProjectionChart.data.datasets[0].data = portnoxRoi;
      window._roiProjectionChart.data.datasets[1].data = onPremRoi;
      
      window._roiProjectionChart.update();
    }
  }
  
  // Update impact values in the UI
  function updateImpactValues() {
    // Get slider values
    const deviceCount = parseInt(document.getElementById('sa-devices-slider')?.value || 1000);
    const locationCount = parseInt(document.getElementById('sa-locations-slider')?.value || 3);
    const implementationComplexity = parseInt(document.getElementById('sa-implementation-slider')?.value || 3);
    
    // Calculate impacts
    const deviceImpact = calculateDeviceImpact(deviceCount);
    const locationImpact = calculateLocationImpact(locationCount);
    const complexityImpact = calculateComplexityImpact(implementationComplexity);
    
    // Update UI
    document.getElementById('device-impact-value').textContent = `$${deviceImpact.toLocaleString()} additional savings with Portnox Cloud`;
    document.getElementById('location-impact-value').textContent = `$${locationImpact.toLocaleString()} additional savings with Portnox Cloud`;
    document.getElementById('complexity-impact-value').textContent = `$${complexityImpact.toLocaleString()} additional savings with Portnox Cloud`;
  }
  
  // Update breakeven values in the UI
  function updateBreakevenValues() {
    // Get slider values
    const deviceCount = parseInt(document.getElementById('sa-devices-slider')?.value || 1000);
    const locationCount = parseInt(document.getElementById('sa-locations-slider')?.value || 3);
    const implementationComplexity = parseInt(document.getElementById('sa-implementation-slider')?.value || 3);
    const staffCost = parseInt(document.getElementById('sa-staff-slider')?.value || 100000);
    const hardwareCostMultiplier = parseFloat(document.getElementById('sa-hardware-slider')?.value || 1.0);
    const licensingCostMultiplier = parseFloat(document.getElementById('sa-licensing-slider')?.value || 1.0);
    const complianceComplexity = parseInt(document.getElementById('sa-compliance-slider')?.value || 3);
    
    // Calculate breakeven values
    const roiBreakeven = calculateRoiBreakeven(
      deviceCount, 
      locationCount, 
      implementationComplexity, 
      staffCost, 
      hardwareCostMultiplier, 
      licensingCostMultiplier, 
      complianceComplexity
    );
    
    const tcoBreakeven = calculateTcoBreakeven(
      deviceCount, 
      locationCount, 
      implementationComplexity, 
      staffCost, 
      hardwareCostMultiplier, 
      licensingCostMultiplier, 
      complianceComplexity
    );
    
    const deviceBreakeven = calculateDeviceBreakeven(
      locationCount, 
      implementationComplexity, 
      staffCost, 
      hardwareCostMultiplier, 
      licensingCostMultiplier, 
      complianceComplexity
    );
    
    // Update UI
    document.getElementById('roi-breakeven-value').textContent = roiBreakeven <= 0 ? 'Immediate' : 
      (roiBreakeven < 1 ? 'Less than 1 month' : `${roiBreakeven} month${roiBreakeven !== 1 ? 's' : ''}`);
    
    document.getElementById('tco-breakeven-value').textContent = tcoBreakeven <= 0 ? 'Immediate' : 
      (tcoBreakeven < 1 ? 'Less than 1 month' : `${tcoBreakeven} month${tcoBreakeven !== 1 ? 's' : ''}`);
    
    document.getElementById('device-breakeven-value').textContent = deviceBreakeven <= 0 ? 'Any device count' : 
      `${deviceBreakeven} device${deviceBreakeven !== 1 ? 's' : ''}`;
  }
  
  // Apply sensitivity analysis to calculator
  function applySensitivityAnalysis() {
    // Get slider values
    const deviceCount = parseInt(document.getElementById('sa-devices-slider')?.value || 1000);
    const locationCount = parseInt(document.getElementById('sa-locations-slider')?.value || 3);
    const implementationComplexity = parseInt(document.getElementById('sa-implementation-slider')?.value || 3);
    const staffCost = parseInt(document.getElementById('sa-staff-slider')?.value || 100000);
    const hardwareCostMultiplier = parseFloat(document.getElementById('sa-hardware-slider')?.value || 1.0);
    const licensingCostMultiplier = parseFloat(document.getElementById('sa-licensing-slider')?.value || 1.0);
    const complianceComplexity = parseInt(document.getElementById('sa-compliance-slider')?.value || 3);
    const years = parseInt(document.getElementById('sa-years-slider')?.value || 3);
    
    // Apply to calculator
    if (window.calculator) {
      // Update device count
      const deviceCountInput = document.getElementById('device-count');
      if (deviceCountInput) {
        deviceCountInput.value = deviceCount;
      }
      
      // Update organization size based on device count
      const orgSizeSelect = document.getElementById('organization-size');
      if (orgSizeSelect) {
        if (deviceCount <= 1000) {
          orgSizeSelect.value = 'small';
        } else if (deviceCount <= 5000) {
          orgSizeSelect.value = 'medium';
        } else {
          orgSizeSelect.value = 'large';
        }
      }
      
      // Update years to project
      const yearsInput = document.getElementById('years-to-project');
      if (yearsInput) {
        yearsInput.value = years;
      }
      
      // Update multiple locations
      const multipleLocationsCheckbox = document.getElementById('multiple-locations');
      if (multipleLocationsCheckbox) {
        multipleLocationsCheckbox.checked = locationCount > 1;
        
        // Trigger change event
        const event = new Event('change');
        multipleLocationsCheckbox.dispatchEvent(event);
        
        // Update location count if checkbox is checked
        if (locationCount > 1) {
          const locationCountInput = document.getElementById('location-count');
          if (locationCountInput) {
            locationCountInput.value = locationCount;
          }
        }
      }
      
      // Update calculator metrics
      if (typeof window.calculator.setCustomMetrics === 'function') {
        // Convert complexity to checkbox values
        const complexAuthentication = implementationComplexity >= 3;
        const customPolicies = implementationComplexity >= 4;
        const legacyDevices = implementationComplexity >= 2;
        
        // Update complexity checkboxes
        const complexAuthCheckbox = document.getElementById('complex-authentication');
        const customPoliciesCheckbox = document.getElementById('custom-policies');
        const legacyDevicesCheckbox = document.getElementById('legacy-devices');
        
        if (complexAuthCheckbox) {
          complexAuthCheckbox.checked = complexAuthentication;
        }
        
        if (customPoliciesCheckbox) {
          customPoliciesCheckbox.checked = customPolicies;
        }
        
        if (legacyDevicesCheckbox) {
          legacyDevicesCheckbox.checked = legacyDevices;
        }
        
        // Calculate costs based on multipliers
        const baseHardwareCost = 10000 * hardwareCostMultiplier;
        const baseLicensingCost = 25000 * licensingCostMultiplier;
        
        // Set custom metrics
        window.calculator.setCustomMetrics({
          hardwareCost: baseHardwareCost,
          licensingCost: baseLicensingCost,
          maintenanceCost: 15000,
          implementationCost: 30000,
          personnelCost: staffCost,
          downtimeCost: 5000,
          portnoxDiscount: 25,
          competitorDiscount: 0,
          complianceComplexity
        });
      }
      
      // Run calculation
      if (typeof window.calculator.calculate === 'function') {
        window.calculator.calculate();
      }
    }
  }
  
  // Impact calculation functions
  function calculateDeviceImpact(deviceCount) {
    // Higher device counts favor cloud solutions
    const baseImpact = 50000;
    const scaleFactor = (deviceCount - 1000) / 9000; // 0 to 1 for 1K to 10K
    const scaledImpact = baseImpact + (scaleFactor * 100000);
    return Math.round(scaledImpact);
  }
  
  function calculateLocationImpact(locationCount) {
    // Higher location counts favor cloud solutions
    const baseImpact = 20000;
    const scaleFactor = (locationCount - 1) / 49; // 0 to 1 for 1 to 50
    const scaledImpact = baseImpact + (scaleFactor * 150000);
    return Math.round(scaledImpact);
  }
  
  function calculateComplexityImpact(complexity) {
    // Higher complexity favors cloud solutions
    const baseImpact = 15000;
    const scaleFactor = (complexity - 1) / 4; // 0 to 1 for 1 to 5
    const scaledImpact = baseImpact + (scaleFactor * 60000);
    return Math.round(scaledImpact);
  }
  
  function calculateStaffImpact(staffCost) {
    // Higher staff costs favor cloud solutions
    const baseImpact = 15000;
    const scaleFactor = (staffCost - 50000) / 150000; // 0 to 1 for $50K to $200K
    const scaledImpact = baseImpact + (scaleFactor * 50000);
    return Math.round(scaledImpact);
  }
  
  function calculateHardwareImpact(multiplier) {
    // Higher hardware costs favor cloud solutions
    const baseImpact = 20000;
    const scaledImpact = baseImpact * multiplier;
    return Math.round(scaledImpact);
  }
  
  function calculateLicensingImpact(multiplier) {
    // Licensing impacts both solutions, but on-premises more heavily
    const baseImpact = 35000;
    const scaledImpact = baseImpact * multiplier;
    return Math.round(scaledImpact);
  }
  
  function calculateComplianceImpact(complexity) {
    // Higher compliance complexity favors cloud solutions
    const baseImpact = 10000;
    const scaleFactor = (complexity - 1) / 4; // 0 to 1 for 1 to 5
    const scaledImpact = baseImpact + (scaleFactor * 25000);
    return Math.round(scaledImpact);
  }
  
  // ROI impact calculation functions
  function calculateDeviceRoiImpact(deviceCount) {
    // Higher device counts improve ROI timeline
    const baseImpact = -1.5;
    const scaleFactor = (deviceCount - 1000) / 9000; // 0 to 1 for 1K to 10K
    const scaledImpact = baseImpact - (scaleFactor * 4.5);
    return Math.round(scaledImpact * 10) / 10; // Round to 1 decimal place
  }
  
  function calculateLocationRoiImpact(locationCount) {
    // Higher location counts improve ROI timeline
    const baseImpact = -1;
    const scaleFactor = (locationCount - 1) / 49; // 0 to 1 for 1 to 50
    const scaledImpact = baseImpact - (scaleFactor * 4);
    return Math.round(scaledImpact * 10) / 10; // Round to 1 decimal place
  }
  
  function calculateComplexityRoiImpact(complexity) {
    // Higher complexity improves ROI timeline
    const baseImpact = -0.5;
    const scaleFactor = (complexity - 1) / 4; // 0 to 1 for 1 to 5
    const scaledImpact = baseImpact - (scaleFactor * 3);
    return Math.round(scaledImpact * 10) / 10; // Round to 1 decimal place
  }
  
  function calculateStaffRoiImpact(staffCost) {
    // Higher staff costs improve ROI timeline
    const baseImpact = -0.5;
    const scaleFactor = (staffCost - 50000) / 150000; // 0 to 1 for $50K to $200K
    const scaledImpact = baseImpact - (scaleFactor * 2);
    return Math.round(scaledImpact * 10) / 10; // Round to 1 decimal place
  }
  
  function calculateHardwareRoiImpact(multiplier) {
    // Higher hardware costs improve ROI timeline
    const baseImpact = -0.5;
    const scaledImpact = baseImpact * multiplier;
    return Math.round(scaledImpact * 10) / 10; // Round to 1 decimal place
  }
  
  function calculateLicensingRoiImpact(multiplier) {
    // Higher licensing costs can worsen ROI timeline for cloud
    const baseImpact = 1;
    const scaledImpact = baseImpact * multiplier;
    return Math.round(scaledImpact * 10) / 10; // Round to 1 decimal place
  }
  
  function calculateComplianceRoiImpact(complexity) {
    // Compliance impact on ROI timeline
    const baseImpact = 0.5;
    const scaleFactor = (complexity - 1) / 4; // 0 to 1 for 1 to 5
    const scaledImpact = baseImpact - (scaleFactor * 1.5); // Turns negative at higher complexity
    return Math.round(scaledImpact * 10) / 10; // Round to 1 decimal place
  }
  
  // Breakeven calculation functions
  function calculateRoiBreakeven(deviceCount, locationCount, complexity, staffCost, hardwareMultiplier, licensingMultiplier, complianceComplexity) {
    // Base ROI breakeven in months
    let baseBreakeven = 12;
    
    // Adjust based on parameters
    // Device count adjustment (more devices = faster breakeven)
    const deviceAdjustment = (deviceCount - 1000) / 9000 * -6; // -6 to 0 months
    
    // Location count adjustment (more locations = faster breakeven)
    const locationAdjustment = (locationCount - 1) / 49 * -8; // -8 to 0 months
    
    // Complexity adjustment (more complexity = faster breakeven)
    const complexityAdjustment = (complexity - 1) / 4 * -5; // -5 to 0 months
    
    // Staff cost adjustment (higher staff cost = faster breakeven)
    const staffAdjustment = (staffCost - 50000) / 150000 * -3; // -3 to 0 months
    
    // Hardware cost adjustment (higher hardware cost = faster breakeven)
    const hardwareAdjustment = (hardwareMultiplier - 1) * -3; // -3 to 0 months for 1.0 to 2.0
    
    // Licensing cost adjustment (higher licensing impact varies)
    const licensingAdjustment = (licensingMultiplier - 1) * 2; // 0 to 2 months for 1.0 to 2.0
    
    // Compliance adjustment (higher compliance = faster breakeven)
    const complianceAdjustment = (complianceComplexity - 1) / 4 * -2; // -2 to 0 months
    
    // Calculate final breakeven
    const finalBreakeven = baseBreakeven + 
      deviceAdjustment + 
      locationAdjustment + 
      complexityAdjustment + 
      staffAdjustment + 
      hardwareAdjustment + 
      licensingAdjustment + 
      complianceAdjustment;
    
    return Math.max(0, Math.round(finalBreakeven));
  }
  
  function calculateTcoBreakeven(deviceCount, locationCount, complexity, staffCost, hardwareMultiplier, licensingMultiplier, complianceComplexity) {
    // Base TCO breakeven in months
    let baseBreakeven = 18;
    
    // Adjust based on parameters (similar to ROI but different weights)
    // Device count adjustment (more devices = faster breakeven)
    const deviceAdjustment = (deviceCount - 1000) / 9000 * -10; // -10 to 0 months
    
    // Location count adjustment (more locations = faster breakeven)
    const locationAdjustment = (locationCount - 1) / 49 * -12; // -12 to 0 months
    
    // Complexity adjustment (more complexity = faster breakeven)
    const complexityAdjustment = (complexity - 1) / 4 * -8; // -8 to 0 months
    
    // Staff cost adjustment (higher staff cost = faster breakeven)
    const staffAdjustment = (staffCost - 50000) / 150000 * -6; // -6 to 0 months
    
    // Hardware cost adjustment (higher hardware cost = faster breakeven)
    const hardwareAdjustment = (hardwareMultiplier - 1) * -5; // -5 to 0 months for 1.0 to 2.0
    
    // Licensing cost adjustment (higher licensing impact varies)
    const licensingAdjustment = (licensingMultiplier - 1) * 3; // 0 to 3 months for 1.0 to 2.0
    
    // Compliance adjustment (higher compliance = faster breakeven)
    const complianceAdjustment = (complianceComplexity - 1) / 4 * -4; // -4 to 0 months
    
    // Calculate final breakeven
    const finalBreakeven = baseBreakeven + 
      deviceAdjustment + 
      locationAdjustment + 
      complexityAdjustment + 
      staffAdjustment + 
      hardwareAdjustment + 
      licensingAdjustment + 
      complianceAdjustment;
    
    return Math.max(0, Math.round(finalBreakeven));
  }
  
  function calculateDeviceBreakeven(locationCount, complexity, staffCost, hardwareMultiplier, licensingMultiplier, complianceComplexity) {
    // Base device breakeven count
    let baseBreakeven = 250;
    
    // Adjust based on parameters
    // Location count adjustment (more locations = lower device threshold)
    const locationAdjustment = (locationCount - 1) / 49 * -150; // -150 to 0 devices
    
    // Complexity adjustment (more complexity = lower device threshold)
    const complexityAdjustment = (complexity - 1) / 4 * -100; // -100 to 0 devices
    
    // Staff cost adjustment (higher staff cost = lower device threshold)
    const staffAdjustment = (staffCost - 50000) / 150000 * -100; // -100 to 0 devices
    
    // Hardware cost adjustment (higher hardware cost = lower device threshold)
    const hardwareAdjustment = (hardwareMultiplier - 1) * -75; // -75 to 0 devices for 1.0 to 2.0
    
    // Licensing cost adjustment (higher licensing = higher device threshold)
    const licensingAdjustment = (licensingMultiplier - 1) * 100; // 0 to 100 devices for 1.0 to 2.0
    
    // Compliance adjustment (higher compliance = lower device threshold)
    const complianceAdjustment = (complianceComplexity - 1) / 4 * -50; // -50 to 0 devices
    
    // Calculate final breakeven
    const finalBreakeven = baseBreakeven + 
      locationAdjustment + 
      complexityAdjustment + 
      staffAdjustment + 
      hardwareAdjustment + 
      licensingAdjustment + 
      complianceAdjustment;
    
    return Math.max(0, Math.round(finalBreakeven));
  }
  
  // ROI projection calculation functions
  function calculatePortnoxRoi(deviceCount, locationCount, complexity, staffCost, hardwareMultiplier, licensingMultiplier, complianceComplexity) {
    // Base ROI values for Portnox (monthly progression)
    const baseRoi = [-75000, -50000, -25000, 0, 25000, 75000, 125000, 225000];
    
    // Calculate adjustment factor based on parameters
    const deviceFactor = 1 + (deviceCount - 1000) / 9000 * 0.3; // 1.0 to 1.3
    const locationFactor = 1 + (locationCount - 1) / 49 * 0.3; // 1.0 to 1.3
    const complexityFactor = 1 + (complexity - 1) / 4 * 0.2; // 1.0 to 1.2
    const staffFactor = 1 + (staffCost - 50000) / 150000 * 0.2; // 1.0 to 1.2
    const hardwareFactor = 1; // Hardware doesn't affect Portnox much
    const licensingFactor = licensingMultiplier; // Direct impact
    const complianceFactor = 1 + (complianceComplexity - 1) / 4 * 0.1; // 1.0 to 1.1
    
    // Combined factor
    const combinedFactor = (deviceFactor + locationFactor + complexityFactor + staffFactor + hardwareFactor + licensingFactor + complianceFactor) / 7;
    
    // Adjust ROI values
    return baseRoi.map(value => Math.round(value * combinedFactor));
  }
  
  function calculateOnPremRoi(deviceCount, locationCount, complexity, staffCost, hardwareMultiplier, licensingMultiplier, complianceComplexity) {
    // Base ROI values for On-Prem (monthly progression)
    const baseRoi = [-150000, -140000, -130000, -120000, -100000, -60000, -20000, 40000];
    
    // Calculate adjustment factor based on parameters
    const deviceFactor = 1 + (deviceCount - 1000) / 9000 * 0.5; // 1.0 to 1.5
    const locationFactor = 1 + (locationCount - 1) / 49 * 0.8; // 1.0 to 1.8
    const complexityFactor = 1 + (complexity - 1) / 4 * 0.5; // 1.0 to 1.5
    const staffFactor = 1 + (staffCost - 50000) / 150000 * 0.4; // 1.0 to 1.4
    const hardwareFactor = hardwareMultiplier; // Direct impact
    const licensingFactor = licensingMultiplier * 0.8; // Slightly reduced impact
    const complianceFactor = 1 + (complianceComplexity - 1) / 4 * 0.3; // 1.0 to 1.3
    
    // Combined factor
    const combinedFactor = (deviceFactor + locationFactor + complexityFactor + staffFactor + hardwareFactor + licensingFactor + complianceFactor) / 7;
    
    // Adjust ROI values
    return baseRoi.map(value => Math.round(value * combinedFactor));
  }
  
  // Initialize
  function init() {
    // Add styles
    addStyles();
    
    // Create sensitivity analyzer
    createSensitivityAnalyzer();
    
    console.log('Advanced Sensitivity Analyzer initialized');
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  console.log('Advanced Sensitivity Analyzer setup complete');
})();
