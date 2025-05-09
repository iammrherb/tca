/**
 * Sensitivity Analyzer Fix
 * Enhanced sensitivity analysis with detailed explanations and visualizations
 */
(function() {
  console.log('Installing Enhanced Sensitivity Analyzer...');
  
  // Fix for sensitivity analyzer modal
  function createSensitivityAnalyzerModal() {
    // Remove any existing modal
    const existingModal = document.getElementById('sensitivity-analysis-modal');
    if (existingModal) {
      existingModal.parentNode.removeChild(existingModal);
    }
    
    // Create modal element
    const modal = document.createElement('div');
    modal.id = 'sensitivity-analysis-modal';
    modal.className = 'modal fade';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'sensitivity-analysis-title');
    modal.setAttribute('aria-hidden', 'true');
    
    // Modal content
    modal.innerHTML = `
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="sensitivity-analysis-title">
              <i class="fas fa-chart-line"></i> Enhanced Sensitivity Analysis
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="sensitivity-container">
              <div class="sensitivity-intro">
                <p>Sensitivity analysis helps you understand how changes in key parameters affect the Total Cost of Ownership (TCO) comparison between Portnox Cloud and your current NAC solution.</p>
                <p>Use the controls below to adjust different parameters and see the impact on your TCO and savings.</p>
              </div>
              
              <div class="sensitivity-tabs">
                <button class="sensitivity-tab active" data-tab="organization">Organization Impact</button>
                <button class="sensitivity-tab" data-tab="cost">Cost Factors</button>
                <button class="sensitivity-tab" data-tab="scale">Scaling Impact</button>
                <button class="sensitivity-tab" data-tab="roi">ROI Analysis</button>
              </div>
              
              <div class="sensitivity-tab-content active" id="organization-tab">
                <div class="sensitivity-controls">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="sensitivity-control">
                        <label for="device-count-slider">Device Count</label>
                        <div class="range-container">
                          <input type="range" id="device-count-slider" min="100" max="10000" step="100" value="1000" class="form-range">
                          <div class="range-value">
                            <span id="device-count-value">1,000</span>
                          </div>
                        </div>
                        <div class="control-description">
                          <p>Total number of devices requiring network access control</p>
                          <p class="impact-note" id="device-count-impact">Impact: <span>Medium</span></p>
                        </div>
                      </div>
                    </div>
                    
                    <div class="col-md-6">
                      <div class="sensitivity-control">
                        <label for="location-count-slider">Number of Locations</label>
                        <div class="range-container">
                          <input type="range" id="location-count-slider" min="1" max="50" step="1" value="1" class="form-range">
                          <div class="range-value">
                            <span id="location-count-value">1</span>
                          </div>
                        </div>
                        <div class="control-description">
                          <p>Number of physical locations where NAC will be deployed</p>
                          <p class="impact-note" id="location-count-impact">Impact: <span>High</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="col-md-6">
                      <div class="sensitivity-control">
                        <label for="years-slider">Years to Project</label>
                        <div class="range-container">
                          <input type="range" id="years-slider" min="1" max="10" step="1" value="3" class="form-range">
                          <div class="range-value">
                            <span id="years-value">3</span>
                          </div>
                        </div>
                        <div class="control-description">
                          <p>Number of years to calculate TCO and ROI</p>
                          <p class="impact-note" id="years-impact">Impact: <span>Medium</span></p>
                        </div>
                      </div>
                    </div>
                    
                    <div class="col-md-6">
                      <div class="sensitivity-control">
                        <label for="legacy-percentage-slider">Legacy Device Percentage</label>
                        <div class="range-container">
                          <input type="range" id="legacy-percentage-slider" min="0" max="100" step="5" value="10" class="form-range">
                          <div class="range-value">
                            <span id="legacy-percentage-value">10%</span>
                          </div>
                        </div>
                        <div class="control-description">
                          <p>Percentage of devices that require special handling</p>
                          <p class="impact-note" id="legacy-impact">Impact: <span>Low</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="sensitivity-visualization">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="sensitivity-chart-container">
                        <h4>TCO Comparison</h4>
                        <canvas id="organization-tco-chart"></canvas>
                      </div>
                    </div>
                    
                    <div class="col-md-6">
                      <div class="sensitivity-chart-container">
                        <h4>TCO Breakdown by Location</h4>
                        <canvas id="organization-location-chart"></canvas>
                      </div>
                    </div>
                  </div>
                  
                  <div class="sensitivity-insight-card">
                    <h4><i class="fas fa-lightbulb"></i> Key Insights</h4>
                    <div id="organization-insights">
                      <p>Adjust the parameters to see how they affect the TCO comparison.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="sensitivity-tab-content" id="cost-tab">
                <div class="sensitivity-controls">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="sensitivity-control">
                        <label for="hardware-cost-slider">Hardware Cost ($)</label>
                        <div class="range-container">
                          <input type="range" id="hardware-cost-slider" min="0" max="50000" step="1000" value="10000" class="form-range">
                          <div class="range-value">
                            <span id="hardware-cost-value">$10,000</span>
                          </div>
                        </div>
                        <div class="control-description">
                          <p>Base hardware cost for on-premises deployment</p>
                          <p class="impact-note" id="hardware-cost-impact">Impact: <span>High</span></p>
                        </div>
                      </div>
                    </div>
                    
                    <div class="col-md-6">
                      <div class="sensitivity-control">
                        <label for="licensing-cost-slider">Licensing Cost ($)</label>
                        <div class="range-container">
                          <input type="range" id="licensing-cost-slider" min="0" max="100000" step="5000" value="25000" class="form-range">
                          <div class="range-value">
                            <span id="licensing-cost-value">$25,000</span>
                          </div>
                        </div>
                        <div class="control-description">
                          <p>Annual licensing fees per vendor</p>
                          <p class="impact-note" id="licensing-cost-impact">Impact: <span>High</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="col-md-6">
                      <div class="sensitivity-control">
                        <label for="maintenance-cost-slider">Maintenance Cost ($)</label>
                        <div class="range-container">
                          <input type="range" id="maintenance-cost-slider" min="0" max="50000" step="1000" value="15000" class="form-range">
                          <div class="range-value">
                            <span id="maintenance-cost-value">$15,000</span>
                          </div>
                        </div>
                        <div class="control-description">
                          <p>Annual maintenance and support costs</p>
                          <p class="impact-note" id="maintenance-cost-impact">Impact: <span>Medium</span></p>
                        </div>
                      </div>
                    </div>
                    
                    <div class="col-md-6">
                      <div class="sensitivity-control">
                        <label for="implementation-cost-slider">Implementation Cost ($)</label>
                        <div class="range-container">
                          <input type="range" id="implementation-cost-slider" min="0" max="100000" step="5000" value="30000" class="form-range">
                          <div class="range-value">
                            <span id="implementation-cost-value">$30,000</span>
                          </div>
                        </div>
                        <div class="control-description">
                          <p>Base implementation and professional services costs</p>
                          <p class="impact-note" id="implementation-cost-impact">Impact: <span>Medium</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="col-md-6">
                      <div class="sensitivity-control">
                        <label for="personnel-cost-slider">Personnel Cost ($)</label>
                        <div class="range-container">
                          <input type="range" id="personnel-cost-slider" min="50000" max="200000" step="10000" value="100000" class="form-range">
                          <div class="range-value">
                            <span id="personnel-cost-value">$100,000</span>
                          </div>
                        </div>
                        <div class="control-description">
                          <p>Annual cost per full-time equivalent (FTE)</p>
                          <p class="impact-note" id="personnel-cost-impact">Impact: <span>Very High</span></p>
                        </div>
                      </div>
                    </div>
                    
                    <div class="col-md-6">
                      <div class="sensitivity-control">
                        <label for="portnox-discount-slider">Portnox Discount (%)</label>
                        <div class="range-container">
                          <input type="range" id="portnox-discount-slider" min="0" max="40" step="5" value="0" class="form-range">
                          <div class="range-value">
                            <span id="portnox-discount-value">0%</span>
                          </div>
                        </div>
                        <div class="control-description">
                          <p>Discount percentage on Portnox subscription</p>
                          <p class="impact-note" id="portnox-discount-impact">Impact: <span>Medium</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="sensitivity-visualization">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="sensitivity-chart-container">
                        <h4>Cost Breakdown Comparison</h4>
                        <canvas id="cost-breakdown-chart"></canvas>
                      </div>
                    </div>
                    
                    <div class="col-md-6">
                      <div class="sensitivity-chart-container">
                        <h4>Cost Sensitivity Analysis</h4>
                        <canvas id="cost-sensitivity-chart"></canvas>
                      </div>
                    </div>
                  </div>
                  
                  <div class="sensitivity-insight-card">
                    <h4><i class="fas fa-lightbulb"></i> Key Insights</h4>
                    <div id="cost-insights">
                      <p>Adjust the cost parameters to see how they affect the TCO comparison.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="sensitivity-tab-content" id="scale-tab">
                <div class="sensitivity-controls">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="sensitivity-control">
                        <label for="scale-device-slider">Number of Devices</label>
                        <div class="range-container">
                          <input type="range" id="scale-device-slider" min="100" max="50000" step="100" value="1000" class="form-range">
                          <div class="range-value">
                            <span id="scale-device-value">1,000</span>
                          </div>
                        </div>
                        <div class="control-description">
                          <p>How TCO changes as your device count grows</p>
                          <p class="impact-note" id="scale-device-impact">Impact: <span>High</span></p>
                        </div>
                      </div>
                    </div>
                    
                    <div class="col-md-6">
                      <div class="sensitivity-control">
                        <label for="scale-location-slider">Number of Locations</label>
                        <div class="range-container">
                          <input type="range" id="scale-location-slider" min="1" max="100" step="1" value="1" class="form-range">
                          <div class="range-value">
                            <span id="scale-location-value">1</span>
                          </div>
                        </div>
                        <div class="control-description">
                          <p>How TCO changes as you add more locations</p>
                          <p class="impact-note" id="scale-location-impact">Impact: <span>Very High</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="col-md-6">
                      <div class="sensitivity-control">
                        <label for="scale-years-slider">Growth Rate (%/year)</label>
                        <div class="range-container">
                          <input type="range" id="scale-growth-slider" min="0" max="50" step="5" value="10" class="form-range">
                          <div class="range-value">
                            <span id="scale-growth-value">10%</span>
          </div>
        </div>
        <div class="control-description">
          <p>Annual growth rate in devices</p>
          <p class="impact-note" id="scale-growth-impact">Impact: <span>Medium</span></p>
        </div>
      </div>
    </div>
    
    <div class="col-md-6">
      <div class="sensitivity-control">
        <label for="scale-complexity-slider">Environment Complexity</label>
        <div class="range-container">
          <input type="range" id="scale-complexity-slider" min="1" max="10" step="1" value="5" class="form-range">
          <div class="range-value">
            <span id="scale-complexity-value">5</span>
          </div>
        </div>
        <div class="control-description">
          <p>Higher values indicate more complex environments</p>
          <p class="impact-note" id="scale-complexity-impact">Impact: <span>High</span></p>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="sensitivity-visualization">
  <div class="row">
    <div class="col-md-6">
      <div class="sensitivity-chart-container">
        <h4>TCO by Device Count</h4>
        <canvas id="scale-device-chart"></canvas>
      </div>
    </div>
    
    <div class="col-md-6">
      <div class="sensitivity-chart-container">
        <h4>TCO by Location Count</h4>
        <canvas id="scale-location-chart"></canvas>
      </div>
    </div>
  </div>
  
  <div class="sensitivity-insight-card">
    <h4><i class="fas fa-lightbulb"></i> Key Insights</h4>
    <div id="scale-insights">
      <p>Adjust the scaling parameters to see how they affect the TCO at different scales.</p>
    </div>
  </div>
</div>
</div>

<div class="sensitivity-tab-content" id="roi-tab">
<div class="sensitivity-controls">
  <div class="row">
    <div class="col-md-6">
      <div class="sensitivity-control">
        <label for="roi-years-slider">Years to Project</label>
        <div class="range-container">
          <input type="range" id="roi-years-slider" min="1" max="10" step="1" value="3" class="form-range">
          <div class="range-value">
            <span id="roi-years-value">3</span>
          </div>
        </div>
        <div class="control-description">
          <p>Number of years for ROI calculation</p>
          <p class="impact-note" id="roi-years-impact">Impact: <span>High</span></p>
        </div>
      </div>
    </div>
    
    <div class="col-md-6">
      <div class="sensitivity-control">
        <label for="roi-discount-rate-slider">Discount Rate (%)</label>
        <div class="range-container">
          <input type="range" id="roi-discount-rate-slider" min="0" max="15" step="0.5" value="5" class="form-range">
          <div class="range-value">
            <span id="roi-discount-rate-value">5%</span>
          </div>
        </div>
        <div class="control-description">
          <p>Discount rate for present value calculations</p>
          <p class="impact-note" id="roi-discount-rate-impact">Impact: <span>Medium</span></p>
        </div>
      </div>
    </div>
  </div>
  
  <div class="row">
    <div class="col-md-6">
      <div class="sensitivity-control">
        <label for="roi-initial-investment-slider">Initial Investment Ratio</label>
        <div class="range-container">
          <input type="range" id="roi-initial-investment-slider" min="0.5" max="2" step="0.1" value="1" class="form-range">
          <div class="range-value">
            <span id="roi-initial-investment-value">1.0x</span>
          </div>
        </div>
        <div class="control-description">
          <p>Ratio of initial investment relative to baseline</p>
          <p class="impact-note" id="roi-initial-investment-impact">Impact: <span>Medium</span></p>
        </div>
      </div>
    </div>
    
    <div class="col-md-6">
      <div class="sensitivity-control">
        <label for="roi-annual-savings-slider">Annual Savings Ratio</label>
        <div class="range-container">
          <input type="range" id="roi-annual-savings-slider" min="0.5" max="2" step="0.1" value="1" class="form-range">
          <div class="range-value">
            <span id="roi-annual-savings-value">1.0x</span>
          </div>
        </div>
        <div class="control-description">
          <p>Ratio of annual savings relative to baseline</p>
          <p class="impact-note" id="roi-annual-savings-impact">Impact: <span>High</span></p>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="sensitivity-visualization">
  <div class="row">
    <div class="col-md-6">
      <div class="sensitivity-chart-container">
        <h4>ROI Timeline</h4>
        <canvas id="roi-timeline-chart"></canvas>
      </div>
    </div>
    
    <div class="col-md-6">
      <div class="sensitivity-chart-container">
        <h4>NPV and Payback Period</h4>
        <canvas id="roi-npv-chart"></canvas>
      </div>
    </div>
  </div>
  
  <div class="sensitivity-insight-card">
    <h4><i class="fas fa-lightbulb"></i> Key Insights</h4>
    <div id="roi-insights">
      <p>Adjust the ROI parameters to see how they affect the return on investment and payback period.</p>
    </div>
  </div>
</div>
</div>
</div>

<div class="sensitivity-footer">
<div class="row">
  <div class="col-md-6">
    <div class="sensitivity-summary">
      <h4>Analysis Summary</h4>
      <ul id="sensitivity-summary-list">
        <li>Adjust parameters to see the impact on TCO.</li>
      </ul>
    </div>
  </div>
  
  <div class="col-md-6">
    <div class="sensitivity-actions">
      <button id="sensitivity-reset-btn" class="btn btn-outline-secondary">
        <i class="fas fa-sync-alt"></i> Reset to Defaults
      </button>
      <button id="sensitivity-apply-btn" class="btn btn-primary">
        <i class="fas fa-check"></i> Apply These Settings
      </button>
    </div>
  </div>
</div>
</div>
</div>
</div>
<div class="modal-footer">
<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
<button type="button" class="btn btn-primary" id="sensitivity-export-btn">Export Analysis</button>
</div>
</div>
</div>
</div>
    `;
    
    document.body.appendChild(modal);
    
    // Add CSS for sensitivity analyzer
    addSensitivityStyles();
    
    // Setup event listeners
    setupSensitivityEventListeners();
    
    // Initialize charts
    initializeSensitivityCharts();
    
    return modal;
  }
  
  // Add styles for sensitivity analyzer
  function addSensitivityStyles() {
    // Check if styles already exist
    if (document.getElementById('sensitivity-analyzer-styles')) {
      return;
    }
    
    const style = document.createElement('style');
    style.id = 'sensitivity-analyzer-styles';
    style.textContent = `
      .sensitivity-container {
        padding: 0 10px;
      }
      
      .sensitivity-intro {
        margin-bottom: 20px;
      }
      
      .sensitivity-tabs {
        display: flex;
        margin-bottom: 20px;
        border-bottom: 1px solid #e0e0e0;
      }
      
      .sensitivity-tab {
        padding: 10px 15px;
        background: none;
        border: none;
        border-bottom: 3px solid transparent;
        cursor: pointer;
        font-weight: 500;
        color: #505050;
        transition: all 0.2s ease;
      }
      
      .sensitivity-tab:hover {
        color: #1B67B2;
      }
      
      .sensitivity-tab.active {
        color: #1B67B2;
        border-bottom-color: #1B67B2;
      }
      
      .sensitivity-tab-content {
        display: none;
      }
      
      .sensitivity-tab-content.active {
        display: block;
        animation: fadeIn 0.3s ease-in-out;
      }
      
      .sensitivity-controls {
        margin-bottom: 20px;
        background-color: #f8f9fa;
        border-radius: 8px;
        padding: 15px;
      }
      
      .sensitivity-control {
        margin-bottom: 20px;
      }
      
      .sensitivity-control label {
        display: block;
        font-weight: 500;
        margin-bottom: 5px;
        color: #303030;
      }
      
      .range-container {
        display: flex;
        align-items: center;
      }
      
      .range-container input[type="range"] {
        flex: 1;
      }
      
      .range-value {
        width: 80px;
        text-align: right;
        font-weight: 500;
        color: #1B67B2;
      }
      
      .control-description {
        font-size: 12px;
        color: #505050;
        margin-top: 5px;
      }
      
      .impact-note span {
        font-weight: 600;
        color: #1B67B2;
      }
      
      .sensitivity-visualization {
        margin-bottom: 20px;
      }
      
      .sensitivity-chart-container {
        background-color: white;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        height: 300px;
        margin-bottom: 20px;
      }
      
      .sensitivity-chart-container h4 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 16px;
        color: #303030;
      }
      
      .sensitivity-insight-card {
        background-color: rgba(27, 103, 178, 0.05);
        border-radius: 8px;
        padding: 15px;
        border-left: 4px solid #1B67B2;
      }
      
      .sensitivity-insight-card h4 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 16px;
        color: #1B67B2;
      }
      
      .sensitivity-footer {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #e0e0e0;
      }
      
      .sensitivity-summary {
        margin-bottom: 20px;
      }
      
      .sensitivity-summary h4 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 16px;
        color: #303030;
      }
      
      .sensitivity-summary ul {
        padding-left: 20px;
        margin-bottom: 0;
      }
      
      .sensitivity-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // Set up event listeners for sensitivity analyzer
  function setupSensitivityEventListeners() {
    // Tab switching
    const tabs = document.querySelectorAll('.sensitivity-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        const tabId = this.getAttribute('data-tab');
        document.querySelectorAll('.sensitivity-tab-content').forEach(content => {
          content.classList.toggle('active', content.id === tabId + '-tab');
        });
        
        // Update charts for the active tab
        updateSensitivityCharts(tabId);
      });
    });
    
    // Sliders
    setupSliderListeners();
    
    // Reset button
    const resetBtn = document.getElementById('sensitivity-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', resetSensitivityControls);
    }
    
    // Apply button
    const applyBtn = document.getElementById('sensitivity-apply-btn');
    if (applyBtn) {
      applyBtn.addEventListener('click', applySensitivitySettings);
    }
    
    // Export button
    const exportBtn = document.getElementById('sensitivity-export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', exportSensitivityAnalysis);
    }
  }
  
  // Set up slider listeners
  function setupSliderListeners() {
    // Organization tab sliders
    setupSlider('device-count-slider', 'device-count-value', (value) => {
      return value.toLocaleString();
    });
    
    setupSlider('location-count-slider', 'location-count-value', (value) => {
      return value.toLocaleString();
    });
    
    setupSlider('years-slider', 'years-value');
    
    setupSlider('legacy-percentage-slider', 'legacy-percentage-value', (value) => {
      return value + '%';
    });
    
    // Cost tab sliders
    setupSlider('hardware-cost-slider', 'hardware-cost-value', (value) => {
      return '$' + value.toLocaleString();
    });
    
    setupSlider('licensing-cost-slider', 'licensing-cost-value', (value) => {
      return '$' + value.toLocaleString();
    });
    
    setupSlider('maintenance-cost-slider', 'maintenance-cost-value', (value) => {
      return '$' + value.toLocaleString();
    });
    
    setupSlider('implementation-cost-slider', 'implementation-cost-value', (value) => {
      return '$' + value.toLocaleString();
    });
    
    setupSlider('personnel-cost-slider', 'personnel-cost-value', (value) => {
      return '$' + value.toLocaleString();
    });
    
    setupSlider('portnox-discount-slider', 'portnox-discount-value', (value) => {
      return value + '%';
    });
    
    // Scale tab sliders
    setupSlider('scale-device-slider', 'scale-device-value', (value) => {
      return value.toLocaleString();
    });
    
    setupSlider('scale-location-slider', 'scale-location-value', (value) => {
      return value.toLocaleString();
    });
    
    setupSlider('scale-growth-slider', 'scale-growth-value', (value) => {
      return value + '%';
    });
    
    setupSlider('scale-complexity-slider', 'scale-complexity-value');
    
    // ROI tab sliders
    setupSlider('roi-years-slider', 'roi-years-value');
    
    setupSlider('roi-discount-rate-slider', 'roi-discount-rate-value', (value) => {
      return value + '%';
    });
    
    setupSlider('roi-initial-investment-slider', 'roi-initial-investment-value', (value) => {
      return value.toFixed(1) + 'x';
    });
    
    setupSlider('roi-annual-savings-slider', 'roi-annual-savings-value', (value) => {
      return value.toFixed(1) + 'x';
    });
  }
  
  // Helper function to set up a slider
  function setupSlider(sliderId, valueId, formatter = (value) => value) {
    const slider = document.getElementById(sliderId);
    const valueDisplay = document.getElementById(valueId);
    
    if (!slider || !valueDisplay) return;
    
    slider.addEventListener('input', function() {
      valueDisplay.textContent = formatter(parseFloat(this.value));
      
      // Update charts for the active tab
      const activeTab = document.querySelector('.sensitivity-tab.active');
      if (activeTab) {
        updateSensitivityCharts(activeTab.getAttribute('data-tab'));
      }
      
      // Update insights
      updateSensitivityInsights();
    });
  }
  
  // Initialize sensitivity charts
  function initializeSensitivityCharts() {
    // Create chart instances
    createOrganizationCharts();
    createCostCharts();
    createScaleCharts();
    createROICharts();
  }
  
  // Create organization tab charts
  function createOrganizationCharts() {
    // TCO comparison chart
    const tcoCtx = document.getElementById('organization-tco-chart');
    if (tcoCtx) {
      window.organizationTCOChart = new Chart(tcoCtx, {
        type: 'bar',
        data: {
          labels: ['Portnox Cloud', 'Current Solution'],
          datasets: [{
            label: '3-Year TCO',
            data: [250000, 350000],
            backgroundColor: ['#65BD44', '#1B67B2']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return '$' + context.raw.toLocaleString();
                }
              }
            }
          }
        }
      });
    }
    
    // Location chart
    const locationCtx = document.getElementById('organization-location-chart');
    if (locationCtx) {
      window.organizationLocationChart = new Chart(locationCtx, {
        type: 'line',
        data: {
          labels: [1, 2, 3, 4, 5],
          datasets: [
            {
              label: 'Portnox Cloud',
              data: [250000, 300000, 350000, 400000, 450000],
              borderColor: '#65BD44',
              backgroundColor: 'rgba(101, 189, 68, 0.1)',
              fill: true
            },
            {
              label: 'Current Solution',
              data: [350000, 450000, 550000, 650000, 750000],
              borderColor: '#1B67B2',
              backgroundColor: 'rgba(27, 103, 178, 0.1)',
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Number of Locations'
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': $' + context.raw.toLocaleString();
                }
              }
            }
          }
        }
      });
    }
  }
  
  // Create cost tab charts
  function createCostCharts() {
    // Cost breakdown chart
    const breakdownCtx = document.getElementById('cost-breakdown-chart');
    if (breakdownCtx) {
      window.costBreakdownChart = new Chart(breakdownCtx, {
        type: 'bar',
        data: {
          labels: ['Hardware', 'Software', 'Implementation', 'Maintenance', 'Personnel'],
          datasets: [
            {
              label: 'Portnox Cloud',
              data: [0, 60000, 15000, 10000, 50000],
              backgroundColor: '#65BD44'
            },
            {
              label: 'Current Solution',
              data: [30000, 75000, 30000, 25000, 100000],
              backgroundColor: '#1B67B2'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: false
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': $' + context.raw.toLocaleString();
                }
              }
            }
          }
        }
      });
    }
    
    // Cost sensitivity chart
    const sensitivityCtx = document.getElementById('cost-sensitivity-chart');
    if (sensitivityCtx) {
      window.costSensitivityChart = new Chart(sensitivityCtx, {
        type: 'radar',
        data: {
          labels: ['Hardware', 'Licensing', 'Maintenance', 'Implementation', 'Personnel', 'Downtime'],
          datasets: [
            {
              label: 'Cost Sensitivity',
              data: [7, 8, 6, 7, 9, 5],
              borderColor: '#1B67B2',
              backgroundColor: 'rgba(27, 103, 178, 0.2)'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              min: 0,
              max: 10,
              ticks: {
                stepSize: 2
              },
              pointLabels: {
                font: {
                  size: 12
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  const impact = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
                  const value = context.raw;
                  const impactLevel = Math.floor(value / 2.5);
                  return 'Sensitivity: ' + impact[impactLevel];
                }
              }
            }
          }
        }
      });
    }
  }
  
  // Create scale tab charts
  function createScaleCharts() {
    // Device chart
    const deviceCtx = document.getElementById('scale-device-chart');
    if (deviceCtx) {
      window.scaleDeviceChart = new Chart(deviceCtx, {
        type: 'line',
        data: {
          labels: [1000, 5000, 10000, 20000, 50000],
          datasets: [
            {
              label: 'Portnox Cloud',
              data: [150000, 250000, 350000, 500000, 750000],
              borderColor: '#65BD44',
              backgroundColor: 'rgba(101, 189, 68, 0.1)',
              fill: true
            },
            {
              label: 'Current Solution',
              data: [250000, 450000, 650000, 1000000, 1750000],
              borderColor: '#1B67B2',
              backgroundColor: 'rgba(27, 103, 178, 0.1)',
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Number of Devices'
              },
              type: 'logarithmic'
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': $' + context.raw.toLocaleString();
                }
              }
            }
          }
        }
      });
    }
    
    // Location chart
    const locationCtx = document.getElementById('scale-location-chart');
    if (locationCtx) {
      window.scaleLocationChart = new Chart(locationCtx, {
        type: 'line',
        data: {
          labels: [1, 5, 10, 25, 50, 100],
          datasets: [
            {
              label: 'Portnox Cloud',
              data: [150000, 200000, 250000, 350000, 500000, 750000],
              borderColor: '#65BD44',
              backgroundColor: 'rgba(101, 189, 68, 0.1)',
              fill: true
            },
            {
              label: 'Current Solution',
              data: [250000, 500000, 750000, 1250000, 2000000, 3500000],
              borderColor: '#1B67B2',
              backgroundColor: 'rgba(27, 103, 178, 0.1)',
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Number of Locations'
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': $' + context.raw.toLocaleString();
                }
              }
            }
          }
        }
      });
    }
  }
  
  // Create ROI tab charts
  function createROICharts() {
    // ROI timeline chart
    const timelineCtx = document.getElementById('roi-timeline-chart');
    if (timelineCtx) {
      window.roiTimelineChart = new Chart(timelineCtx, {
        type: 'line',
        data: {
          labels: ['Year 0', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
          datasets: [
            {
              label: 'Cumulative Savings',
              data: [-50000, 0, 50000, 100000, 150000, 200000],
              borderColor: '#65BD44',
              backgroundColor: 'rgba(101, 189, 68, 0.1)',
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          },
          plugins: {
            annotation: {
              annotations: {
                breakeven: {
                  type: 'line',
                  yMin: 0,
                  yMax: 0,
                  borderColor: '#FF6384',
                  borderWidth: 2,
                  borderDash: [5, 5],
                  label: {
                    content: 'Break-even',
                    enabled: true,
                    position: 'right',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    color: '#FF6384',
                    font: {
                      weight: 'bold'
                    }
                  }
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return 'Cumulative Savings: $' + context.raw.toLocaleString();
                }
              }
            }
          }
        }
      });
    }
    
    // NPV chart
    const npvCtx = document.getElementById('roi-npv-chart');
    if (npvCtx) {
      window.roiNpvChart = new Chart(npvCtx, {
        type: 'bar',
        data: {
          labels: ['NPV', 'IRR', 'Payback Period'],
          datasets: [{
            label: 'ROI Metrics',
            data: [150000, 42, 1.5],
            backgroundColor: ['#65BD44', '#1B67B2', '#FF6384']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              ticks: {
                callback: function(value, index) {
                  if (index === 0) return '$' + value.toLocaleString();
                  if (index === 1) return value + '%';
                  if (index === 2) return value + ' years';
                  return value;
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  const index = context.dataIndex;
                  const value = context.raw;
                  
                  if (index === 0) return 'Net Present Value: $' + value.toLocaleString();
                  if (index === 1) return 'Internal Rate of Return: ' + value + '%';
                  if (index === 2) return 'Payback Period: ' + value + ' years';
                  
                  return value;
                }
              }
            }
          }
        }
      });
    }
  }
  
  // Update sensitivity charts based on current tab and slider values
  function updateSensitivityCharts(tab) {
    switch (tab) {
      case 'organization':
        updateOrganizationCharts();
        break;
      case 'cost':
        updateCostCharts();
        break;
      case 'scale':
        updateScaleCharts();
        break;
      case 'roi':
        updateROICharts();
        break;
    }
  }
  
  // Update organization tab charts
  function updateOrganizationCharts() {
    // Get slider values
    const deviceCount = parseInt(document.getElementById('device-count-slider').value) || 1000;
    const locationCount = parseInt(document.getElementById('location-count-slider').value) || 1;
    const years = parseInt(document.getElementById('years-slider').value) || 3;
    const legacyPercentage = parseInt(document.getElementById('legacy-percentage-slider').value) || 10;
    
    // Calculate TCO for Portnox and current solution
    const portnoxTCO = calculateTCO('portnox', {
      deviceCount,
      locationCount,
      years,
      legacyPercentage
    });
    
    const currentTCO = calculateTCO('current', {
      deviceCount,
      locationCount,
      years,
      legacyPercentage
    });
    
    // Update TCO comparison chart
    if (window.organizationTCOChart) {
      window.organizationTCOChart.data.labels = ['Portnox Cloud', getVendorName()];
      window.organizationTCOChart.data.datasets[0].data = [portnoxTCO, currentTCO];
      window.organizationTCOChart.data.datasets[0].label = `${years}-Year TCO`;
      window.organizationTCOChart.update();
    }
    
    // Update location chart
    if (window.organizationLocationChart) {
      const maxLocations = Math.max(5, locationCount);
      const locations = Array.from({length: 5}, (_, i) => i + 1);
      
      const portnoxData = locations.map(loc => 
        calculateTCO('portnox', {
          deviceCount,
          locationCount: loc,
          years,
          legacyPercentage
        })
      );
      
      const currentData = locations.map(loc => 
        calculateTCO('current', {
          deviceCount,
          locationCount: loc,
          years,
          legacyPercentage
        })
      );
      
      window.organizationLocationChart.data.labels = locations;
      window.organizationLocationChart.data.datasets[0].data = portnoxData;
      window.organizationLocationChart.data.datasets[1].data = currentData;
      window.organizationLocationChart.data.datasets[1].label = getVendorName();
      window.organizationLocationChart.update();
    }
    
    // Update organization insights
    updateOrganizationInsights({
      portnoxTCO,
      currentTCO,
      deviceCount,
      locationCount,
      years,
      legacyPercentage
    });
  }
  
  // Update cost tab charts
  function updateCostCharts() {
    // Get slider values
    const hardwareCost = parseInt(document.getElementById('hardware-cost-slider').value) || 10000;
    const licensingCost = parseInt(document.getElementById('licensing-cost-slider').value) || 25000;
    const maintenanceCost = parseInt(document.getElementById('maintenance-cost-slider').value) || 15000;
    const implementationCost = parseInt(document.getElementById('implementation-cost-slider').value) || 30000;
    const personnelCost = parseInt(document.getElementById('personnel-cost-slider').value) || 100000;
    const portnoxDiscount = parseInt(document.getElementById('portnox-discount-slider').value) || 0;
    
    // Calculate cost components for Portnox
    const portnoxHardware = 0;
    const portnoxLicensing = 60000 * (1 - portnoxDiscount / 100);
    const portnoxImplementation = 15000;
    const portnoxMaintenance = 10000;
    const portnoxPersonnel = 50000;
    
    // Calculate cost components for current solution
    const currentHardware = hardwareCost;
    const currentLicensing = licensingCost;
    const currentImplementation = implementationCost;
    const currentMaintenance = maintenanceCost;
    const currentPersonnel = personnelCost;
    
    // Update cost breakdown chart
    if (window.costBreakdownChart) {
      window.costBreakdownChart.data.datasets[0].data = [
        portnoxHardware,
        portnoxLicensing,
        portnoxImplementation,
        portnoxMaintenance,
        portnoxPersonnel
      ];
      
      window.costBreakdownChart.data.datasets[1].data = [
        currentHardware,
        currentLicensing,
        currentImplementation,
        currentMaintenance,
        currentPersonnel
      ];
      
      window.costBreakdownChart.data.datasets[1].label = getVendorName();
      window.costBreakdownChart.update();
    }
    
    // Update cost sensitivity chart
    if (window.costSensitivityChart) {
      // Calculate sensitivity ratings
      const hardwareSensitivity = calculateSensitivity(hardwareCost, 5000, 20000);
      const licensingSensitivity = calculateSensitivity(licensingCost, 10000, 50000);
      const maintenanceSensitivity = calculateSensitivity(maintenanceCost, 5000, 30000);
      const implementationSensitivity = calculateSensitivity(implementationCost, 10000, 60000);
      const personnelSensitivity = calculateSensitivity(personnelCost, 50000, 150000);
      const downtimeSensitivity = 5; // Fixed value for simplicity
      
      window.costSensitivityChart.data.datasets[0].data = [
        hardwareSensitivity,
        licensingSensitivity,
        maintenanceSensitivity,
        implementationSensitivity,
        personnelSensitivity,
        downtimeSensitivity
      ];
      
      window.costSensitivityChart.update();
    }
    
    // Update cost insights
    updateCostInsights({
      hardwareCost,
      licensingCost,
      maintenanceCost,
      implementationCost,
      personnelCost,
      portnoxDiscount,
      portnoxTotal: portnoxHardware + portnoxLicensing + portnoxImplementation + portnoxMaintenance + portnoxPersonnel,
      currentTotal: currentHardware + currentLicensing + currentImplementation + currentMaintenance + currentPersonnel
    });
  }
  
  // Update scale tab charts
  function updateScaleCharts() {
    // Get slider values
    const deviceCount = parseInt(document.getElementById('scale-device-slider').value) || 1000;
    const locationCount = parseInt(document.getElementById('scale-location-slider').value) || 1;
    const growthRate = parseInt(document.getElementById('scale-growth-slider').value) || 10;
    const complexity = parseInt(document.getElementById('scale-complexity-slider').value) || 5;
    
    // Create device scale points
    const devicePoints = [1000, 5000, 10000, 20000, 50000];
    
    // Calculate TCO for each device point
    const portnoxDeviceData = devicePoints.map(devices => 
      calculateTCO('portnox', {
        deviceCount: devices,
        locationCount,
        years: 3,
        complexity
      })
    );
    
    const currentDeviceData = devicePoints.map(devices => 
      calculateTCO('current', {
        deviceCount: devices,
        locationCount,
        years: 3,
        complexity
      })
    );
    
    // Update device chart
    if (window.scaleDeviceChart) {
      window.scaleDeviceChart.data.datasets[0].data = portnoxDeviceData;
      window.scaleDeviceChart.data.datasets[1].data = currentDeviceData;
      window.scaleDeviceChart.data.datasets[1].label = getVendorName();
      window.scaleDeviceChart.update();
    }
    
    // Create location scale points
    const locationPoints = [1, 5, 10, 25, 50, 100];
    
    // Calculate TCO for each location point
    const portnoxLocationData = locationPoints.map(locations => 
      calculateTCO('portnox', {
        deviceCount,
        locationCount: locations,
        years: 3,
        complexity
      })
    );
    
    const currentLocationData = locationPoints.map(locations => 
      calculateTCO('current', {
        deviceCount,
        locationCount: locations,
        years: 3,
        complexity
      })
    );
    
    // Update location chart
    if (window.scaleLocationChart) {
      window.scaleLocationChart.data.datasets[0].data = portnoxLocationData;
      window.scaleLocationChart.data.datasets[1].data = currentLocationData;
      window.scaleLocationChart.data.datasets[1].label = getVendorName();
      window.scaleLocationChart.update();
    }
    
    // Update scale insights
    updateScaleInsights({
      deviceCount,
      locationCount,
      growthRate,
      complexity,
      deviceSavings: devicePoints.map((d, i) => (currentDeviceData[i] - portnoxDeviceData[i]) / currentDeviceData[i] * 100),
      locationSavings: locationPoints.map((l, i) => (currentLocationData[i] - portnoxLocationData[i]) / currentLocationData[i] * 100)
    });
  }
  
  // Update ROI tab charts
  function updateROICharts() {
    // Get slider values
    const years = parseInt(document.getElementById('roi-years-slider').value) || 3;
    const discountRate = parseFloat(document.getElementById('roi-discount-rate-slider').value) || 5;
    const initialInvestmentRatio = parseFloat(document.getElementById('roi-initial-investment-slider').value) || 1;
    const annualSavingsRatio = parseFloat(document.getElementById('roi-annual-savings-slider').value) || 1;
    
    // Define base values
    const baseInitialInvestment = 50000;
    const baseAnnualSavings = 75000;
    
    // Calculate adjusted values
    const initialInvestment = baseInitialInvestment * initialInvestmentRatio;
    const annualSavings = baseAnnualSavings * annualSavingsRatio;
    
    // Calculate ROI timeline
    const timelineData = [];
    let cumulativeSavings = -initialInvestment;
    
    timelineData.push(cumulativeSavings);
    
    for (let i = 1; i <= years + 2; i++) {
      cumulativeSavings += annualSavings;
      
      // Apply discount rate
      const discountFactor = 1 / Math.pow(1 + (discountRate / 100), i);
      const discountedSavings = -initialInvestment + annualSavings * ((1 - Math.pow(discountFactor, i)) / (1 - discountFactor));
      
      timelineData.push(discountedSavings);
    }
    
    // Calculate break-even point
    const breakEvenPoint = initialInvestment / annualSavings;
    
    // Update ROI timeline chart
    if (window.roiTimelineChart) {
      window.roiTimelineChart.data.labels = ['Year 0'].concat(Array.from({length: years + 2}, (_, i) => `Year ${i + 1}`));
      window.roiTimelineChart.data.datasets[0].data = timelineData;
      
      // Update annotation
      if (window.roiTimelineChart.options.plugins.annotation) {
        window.roiTimelineChart.options.plugins.annotation.annotations.breakeven.label.content = `Break-even: ${breakEvenPoint.toFixed(1)} years`;
      }
      
      window.roiTimelineChart.update();
    }
    
    // Calculate NPV
    const npv = -initialInvestment + annualSavings * ((1 - Math.pow(1 / (1 + (discountRate / 100)), years)) / (discountRate / 100));
    
    // Calculate IRR (simplified approximation)
    let irr = (annualSavings / initialInvestment) * 100;
    if (years > 1) {
      irr = ((Math.pow(annualSavings * years / initialInvestment, 1 / years) - 1) * 100);
    }
    
    // Update NPV chart
    if (window.roiNpvChart) {
      window.roiNpvChart.data.datasets[0].data = [npv, irr, breakEvenPoint];
      window.roiNpvChart.update();
    }
    
    // Update ROI insights
    updateROIInsights({
      initialInvestment,
      annualSavings,
      npv,
      irr,
      breakEvenPoint,
      years,
      discountRate
    });
  }
  
  // Update sensitivity insights
  function updateSensitivityInsights() {
    const activeTab = document.querySelector('.sensitivity-tab.active');
    if (!activeTab) return;
    
    const tabId = activeTab.getAttribute('data-tab');
    
    switch (tabId) {
      case 'organization':
        updateOrganizationCharts();
        break;
      case 'cost':
        updateCostCharts();
        break;
      case 'scale':
        updateScaleCharts();
        break;
      case 'roi':
        updateROICharts();
        break;
    }
    
    // Update summary
    updateSensitivitySummary();
  }
  
  // Update organization insights
  function updateOrganizationInsights(data) {
    const insights = document.getElementById('organization-insights');
    if (!insights) return;
    
    const savingsAmount = data.currentTCO - data.portnoxTCO;
    const savingsPercentage = (savingsAmount / data.currentTCO * 100).toFixed(0);
    
    insights.innerHTML = `
      <p><strong>Overall Savings:</strong> With a device count of ${data.deviceCount.toLocaleString()} across ${data.locationCount} location${data.locationCount > 1 ? 's' : ''}, Portnox Cloud provides approximately <strong>$${savingsAmount.toLocaleString()}</strong> in savings over ${data.years} years (${savingsPercentage}% reduction in TCO).</p>
      <p><strong>Location Impact:</strong> ${data.locationCount > 1 ? `With ${data.locationCount} locations, on-premises solutions require hardware at each site, significantly increasing costs. Portnox Cloud's zero-hardware approach provides greater savings with more locations.` : 'Even with a single location, Portnox Cloud provides significant savings due to reduced hardware, maintenance, and personnel costs.'}</p>
      <p><strong>Legacy Devices:</strong> ${data.legacyPercentage > 25 ? `With ${data.legacyPercentage}% legacy devices, Portnox Cloud's agentless approach provides significant advantages for managing diverse device types.` : `Your environment includes ${data.legacyPercentage}% legacy devices, which Portnox Cloud can manage without requiring agents or hardware modifications.`}</p>
    `;
  }
  
  // Update cost insights
  function updateCostInsights(data) {
    const insights = document.getElementById('cost-insights');
    if (!insights) return;
    
    const savingsAmount = data.currentTotal - data.portnoxTotal;
    const savingsPercentage = (savingsAmount / data.currentTotal * 100).toFixed(0);
    
    // Identify biggest impact factors
    const costFactors = [
      { name: 'Hardware', value: data.hardwareCost, impact: data.hardwareCost / data.currentTotal },
      { name: 'Licensing', value: data.licensingCost, impact: data.licensingCost / data.currentTotal },
      { name: 'Maintenance', value: data.maintenanceCost, impact: data.maintenanceCost / data.currentTotal },
      { name: 'Implementation', value: data.implementationCost, impact: data.implementationCost / data.currentTotal },
      { name: 'Personnel', value: data.personnelCost, impact: data.personnelCost / data.currentTotal }
    ];
    
    costFactors.sort((a, b) => b.impact - a.impact);
    const topFactors = costFactors.slice(0, 2);
    
    insights.innerHTML = `
      <p><strong>Overall Savings:</strong> Based on the current parameters, Portnox Cloud provides approximately <strong>$${savingsAmount.toLocaleString()}</strong> in savings (${savingsPercentage}% reduction in annual costs).</p>
      <p><strong>Key Cost Drivers:</strong> ${topFactors[0].name} ($${topFactors[0].value.toLocaleString()}) and ${topFactors[1].name} ($${topFactors[1].value.toLocaleString()}) are the largest cost components for your current solution, representing ${(topFactors[0].impact * 100).toFixed(0)}% and ${(topFactors[1].impact * 100).toFixed(0)}% of total costs respectively.</p>
      ${data.portnoxDiscount > 0 ? `<p><strong>Portnox Discount:</strong> A ${data.portnoxDiscount}% discount on Portnox Cloud licensing reduces annual subscription costs from $60,000 to $${(60000 * (1 - data.portnoxDiscount / 100)).toLocaleString()}, further improving ROI.</p>` : ''}
      <p><strong>Zero Hardware Advantage:</strong> Portnox Cloud eliminates the need for dedicated hardware, providing immediate savings of $${data.hardwareCost.toLocaleString()} in capital expenditure.</p>
    `;
  }
  
  // Update scale insights
  function updateScaleInsights(data) {
    const insights = document.getElementById('scale-insights');
    if (!insights) return;
    
    // Calculate average savings percentage
    const avgDeviceSavings = data.deviceSavings.reduce((a, b) => a + b, 0) / data.deviceSavings.length;
    const avgLocationSavings = data.locationSavings.reduce((a, b) => a + b, 0) / data.locationSavings.length;
    
    // Check if savings increase with scale
    const deviceSavingsIncrease = data.deviceSavings[data.deviceSavings.length - 1] > data.deviceSavings[0];
    const locationSavingsIncrease = data.locationSavings[data.locationSavings.length - 1] > data.locationSavings[0];
    
    insights.innerHTML = `
      <p><strong>Scaling Efficiency:</strong> As your organization scales from ${data.deviceCount.toLocaleString()} devices to 50,000 devices, Portnox Cloud maintains an average TCO savings of <strong>${avgDeviceSavings.toFixed(0)}%</strong> compared to on-premises alternatives, with savings ${deviceSavingsIncrease ? 'increasing' : 'stabilizing'} at larger scales.</p>
      <p><strong>Multi-Site Advantage:</strong> The TCO advantage of Portnox Cloud ${locationSavingsIncrease ? 'increases significantly' : 'remains strong'} as locations increase, reaching <strong>${data.locationSavings[data.locationSavings.length - 1].toFixed(0)}%</strong> savings at 100 locations compared to on-premises solutions that require hardware at each site.</p>
      <p><strong>Growth Planning:</strong> With an annual growth rate of ${data.growthRate}%, Portnox Cloud's subscription model provides predictable costs and eliminates the need for hardware refreshes and capacity planning as your network expands.</p>
      ${data.complexity > 7 ? `<p><strong>Complexity Management:</strong> Your high complexity rating (${data.complexity}/10) indicates an environment where Portnox Cloud's simplified architecture would provide significant operational advantages beyond direct cost savings.</p>` : ''}
    `;
  }
  
  // Update ROI insights
  function updateROIInsights(data) {
    const insights = document.getElementById('roi-insights');
    if (!insights) return;
    
    insights.innerHTML = `
      <p><strong>Break-Even Timeline:</strong> Based on an initial investment of $${data.initialInvestment.toLocaleString()} and annual savings of $${data.annualSavings.toLocaleString()}, your organization will reach break-even in <strong>${data.breakEvenPoint.toFixed(1)} years</strong>.</p>
      <p><strong>Net Present Value:</strong> Over a ${data.years}-year period with a discount rate of ${data.discountRate}%, the NPV of switching to Portnox Cloud is <strong>$${data.npv.toLocaleString()}</strong>, representing the economic value added to your organization.</p>
      <p><strong>Return on Investment:</strong> The internal rate of return (IRR) is approximately <strong>${data.irr.toFixed(1)}%</strong>, which ${data.irr > 20 ? 'exceeds typical corporate investment thresholds' : 'represents a positive return on your investment'}.</p>
      ${data.years > 5 ? `<p><strong>Long-Term Value:</strong> Your ${data.years}-year projection timeline demonstrates that Portnox Cloud continues to deliver increasing value beyond the initial payback period, with cumulative savings growing significantly in later years.</p>` : ''}
    `;
  }
  
  // Update sensitivity summary
  function updateSensitivitySummary() {
    const summaryList = document.getElementById('sensitivity-summary-list');
    if (!summaryList) return;
    
    // Get active tab
    const activeTab = document.querySelector('.sensitivity-tab.active');
    if (!activeTab) return;
    
    const tabId = activeTab.getAttribute('data-tab');
    
    // Get basic values
    const deviceCount = parseInt(document.getElementById('device-count-slider')?.value || document.getElementById('scale-device-slider')?.value) || 1000;
    const locationCount = parseInt(document.getElementById('location-count-slider')?.value || document.getElementById('scale-location-slider')?.value) || 1;
    const years = parseInt(document.getElementById('years-slider')?.value || document.getElementById('roi-years-slider')?.value) || 3;
    
    // Calculate TCO values
    const portnoxTCO = calculateTCO('portnox', { deviceCount, locationCount, years });
    const currentTCO = calculateTCO('current', { deviceCount, locationCount, years });
    const savingsAmount = currentTCO - portnoxTCO;
    const savingsPercentage = (savingsAmount / currentTCO * 100).toFixed(0);
    
    // Create summary
    let summaryItems = [
      `<strong>Base Scenario:</strong> ${deviceCount.toLocaleString()} devices, ${locationCount} location${locationCount > 1 ? 's' : ''}, ${years}-year projection.`,
      `<strong>Total Cost Savings:</strong> $${savingsAmount.toLocaleString()} (${savingsPercentage}% reduction in TCO).`
    ];
    
    // Add tab-specific insights
    switch (tabId) {
      case 'organization':
        summaryItems.push(`<strong>Location Impact:</strong> Adding locations significantly increases the TCO advantage of Portnox Cloud.`);
        break;
      case 'cost':
        const personnelCost = parseInt(document.getElementById('personnel-cost-slider').value) || 100000;
        summaryItems.push(`<strong>Personnel Impact:</strong> FTE costs of $${personnelCost.toLocaleString()} significantly impact TCO for on-premises solutions.`);
        break;
      case 'scale':
        const growthRate = parseInt(document.getElementById('scale-growth-slider').value) || 10;
        summaryItems.push(`<strong>Growth Impact:</strong> With ${growthRate}% annual growth, Portnox Cloud provides more predictable scaling costs.`);
        break;
      case 'roi':
        const breakEvenPoint = (portnoxTCO / (currentTCO - portnoxTCO) * years).toFixed(1);
        summaryItems.push(`<strong>ROI Timeline:</strong> Break-even occurs at approximately ${breakEvenPoint} years with current parameters.`);
        break;
    }
    
    // Update summary list
    summaryList.innerHTML = summaryItems.map(item => `<li>${item}</li>`).join('');
  }
  
  // Reset sensitivity controls to defaults
  function resetSensitivityControls() {
    // Reset organization tab sliders
    if (document.getElementById('device-count-slider')) {
      document.getElementById('device-count-slider').value = 1000;
      document.getElementById('device-count-value').textContent = '1,000';
    }
    
    if (document.getElementById('location-count-slider')) {
      document.getElementById('location-count-slider').value = 1;
      document.getElementById('location-count-value').textContent = '1';
    }
    
    if (document.getElementById('years-slider')) {
      document.getElementById('years-slider').value = 3;
      document.getElementById('years-value').textContent = '3';
    }
    
    if (document.getElementById('legacy-percentage-slider')) {
      document.getElementById('legacy-percentage-slider').value = 10;
      document.getElementById('legacy-percentage-value').textContent = '10%';
    }
    
    // Reset cost tab sliders
    if (document.getElementById('hardware-cost-slider')) {
      document.getElementById('hardware-cost-slider').value = 10000;
      document.getElementById('hardware-cost-value').textContent = '$10,000';
    }
    
    if (document.getElementById('licensing-cost-slider')) {
      document.getElementById('licensing-cost-slider').value = 25000;
      document.getElementById('licensing-cost-value').textContent = '$25,000';
    }
    
    if (document.getElementById('maintenance-cost-slider')) {
      document.getElementById('maintenance-cost-slider').value = 15000;
      document.getElementById('maintenance-cost-value').textContent = '$15,000';
    }
    
    if (document.getElementById('implementation-cost-slider')) {
      document.getElementById('implementation-cost-slider').value = 30000;
      document.getElementById('implementation-cost-value').textContent = '$30,000';
    }
    
    if (document.getElementById('personnel-cost-slider')) {
      document.getElementById('personnel-cost-slider').value = 100000;
      document.getElementById('personnel-cost-value').textContent = '$100,000';
    }
    
    if (document.getElementById('portnox-discount-slider')) {
      document.getElementById('portnox-discount-slider').value = 0;
      document.getElementById('portnox-discount-value').textContent = '0%';
    }
    
    // Reset scale tab sliders
    if (document.getElementById('scale-device-slider')) {
      document.getElementById('scale-device-slider').value = 1000;
      document.getElementById('scale-device-value').textContent = '1,000';
    }
    
    if (document.getElementById('scale-location-slider')) {
      document.getElementById('scale-location-slider').value = 1;
      document.getElementById('scale-location-value').textContent = '1';
    }
    
    if (document.getElementById('scale-growth-slider')) {
      document.getElementById('scale-growth-slider').value = 10;
      document.getElementById('scale-growth-value').textContent = '10%';
    }
    
    if (document.getElementById('scale-complexity-slider')) {
      document.getElementById('scale-complexity-slider').value = 5;
      document.getElementById('scale-complexity-value').textContent = '5';
    }
    
    // Reset ROI tab sliders
    if (document.getElementById('roi-years-slider')) {
      document.getElementById('roi-years-slider').value = 3;
      document.getElementById('roi-years-value').textContent = '3';
    }
    
    if (document.getElementById('roi-discount-rate-slider')) {
      document.getElementById('roi-discount-rate-slider').value = 5;
      document.getElementById('roi-discount-rate-value').textContent = '5%';
    }
    
    if (document.getElementById('roi-initial-investment-slider')) {
      document.getElementById('roi-initial-investment-slider').value = 1;
      document.getElementById('roi-initial-investment-value').textContent = '1.0x';
    }
    
    if (document.getElementById('roi-annual-savings-slider')) {
      document.getElementById('roi-annual-savings-slider').value = 1;
      document.getElementById('roi-annual-savings-value').textContent = '1.0x';
    }
    
    // Update charts and insights
    const activeTab = document.querySelector('.sensitivity-tab.active');
    if (activeTab) {
      updateSensitivityCharts(activeTab.getAttribute('data-tab'));
    }
  }
  
  // Apply sensitivity settings to calculator
  function applySensitivitySettings() {
    // Get organization values
    const deviceCount = parseInt(document.getElementById('device-count-slider')?.value) || 1000;
    const locationCount = parseInt(document.getElementById('location-count-slider')?.value) || 1;
    const years = parseInt(document.getElementById('years-slider')?.value) || 3;
    const legacyPercentage = parseInt(document.getElementById('legacy-percentage-slider')?.value) || 10;
    
    // Get cost values
    const hardwareCost = parseInt(document.getElementById('hardware-cost-slider')?.value) || 10000;
    const licensingCost = parseInt(document.getElementById('licensing-cost-slider')?.value) || 25000;
    const maintenanceCost = parseInt(document.getElementById('maintenance-cost-slider')?.value) || 15000;
    const implementationCost = parseInt(document.getElementById('implementation-cost-slider')?.value) || 30000;
    const personnelCost = parseInt(document.getElementById('personnel-cost-slider')?.value) || 100000;
    
    // Apply settings to calculator
    if (window.calculator) {
      // Update organization details
      if (document.getElementById('device-count')) {
        document.getElementById('device-count').value = deviceCount;
      }
      
      if (document.getElementById('years-to-project')) {
        document.getElementById('years-to-project').value = years;
      }
      
      if (document.getElementById('multiple-locations')) {
        document.getElementById('multiple-locations').checked = locationCount > 1;
      }
      
      if (document.getElementById('location-count')) {
        document.getElementById('location-count').value = locationCount;
        
        // Show/hide location count container
        const locationCountContainer = document.getElementById('location-count-container');
        if (locationCountContainer) {
          locationCountContainer.classList.toggle('hidden', locationCount <= 1);
        }
      }
      
      if (document.getElementById('legacy-devices')) {
        document.getElementById('legacy-devices').checked = legacyPercentage > 0;
      }
      
      if (document.getElementById('legacy-percentage')) {
        document.getElementById('legacy-percentage').value = legacyPercentage;
        
        // Show/hide legacy percentage container
        const legacyPercentageContainer = document.getElementById('legacy-percentage-container');
        if (legacyPercentageContainer) {
          legacyPercentageContainer.classList.toggle('hidden', legacyPercentage <= 0);
        }
      }
      
      // Apply cost configurations if available
      if (window.calculator.data && !window.calculator.data.costConfig) {
        window.calculator.data.costConfig = {};
      }
      
      if (window.calculator.data && window.calculator.data.costConfig) {
        window.calculator.data.costConfig.hardwareCost = hardwareCost;
        window.calculator.data.costConfig.licensingCost = licensingCost;
        window.calculator.data.costConfig.maintenanceCost = maintenanceCost;
        window.calculator.data.costConfig.implementationCost = implementationCost;
        window.calculator.data.costConfig.personnelCost = personnelCost;
      }
      
      // Run calculation
      window.calculator.calculate();
      
      // Close modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('sensitivity-analysis-modal'));
      if (modal) {
        modal.hide();
      }
    }
  }
  
  // Export sensitivity analysis to PDF
  function exportSensitivityAnalysis() {
    // Redirect to built-in export functionality
    if (document.getElementById('export-pdf-btn')) {
      document.getElementById('export-pdf-btn').click();
    }
  }
  
  // Helper function to calculate TCO
  function calculateTCO(type, params) {
    const { deviceCount = 1000, locationCount = 1, years = 3, legacyPercentage = 10, complexity = 5 } = params;
    
    // Base costs
    let hardwareCost = 0;
    let licensingCost = 0;
    let implementationCost = 0;
    let maintenanceCost = 0;
    let personnelCost = 0;
    
    if (type === 'portnox') {
      // Portnox Cloud costs
      hardwareCost = 0; // No hardware required
      licensingCost = 20 * deviceCount; // $20 per device per year
      implementationCost = 15000 + (5000 * Math.sqrt(locationCount)); // Base + per location
      maintenanceCost = 10000; // Flat maintenance cost
      personnelCost = 50000 * (0.5 + (0.1 * Math.log10(deviceCount))); // 0.5 FTE base scaling with device count
    } else {
      // Current solution costs (on-premises)
      hardwareCost = 10000 * locationCount * (1 + (0.2 * Math.log10(deviceCount / 1000))); // Base hardware per location, scaling with device count
      licensingCost = 25 * deviceCount; // $25 per device per year
      implementationCost = 30000 + (15000 * locationCount) + (0.5 * deviceCount); // Base + per location + per device
      maintenanceCost = 15000 * locationCount; // Maintenance per location
      personnelCost = 100000 * (1 + (0.2 * Math.log10(deviceCount)) + (0.15 * locationCount)); // 1 FTE base scaling with device count and locations
    }
    
    // Apply complexity factor
    implementationCost *= 1 + ((complexity - 5) / 10);
    maintenanceCost *= 1 + ((complexity - 5) / 10);
    personnelCost *= 1 + ((complexity - 5) / 10);
    
    // Apply legacy device factor
    if (legacyPercentage > 0) {
      const legacyFactor = legacyPercentage / 100;
      implementationCost *= 1 + (legacyFactor * 0.2);
      maintenanceCost *= 1 + (legacyFactor * 0.3);
      personnelCost *= 1 + (legacyFactor * 0.1);
    }
    
    // Calculate total cost over specified years
    const initialCosts = hardwareCost + implementationCost;
    const annualCosts = licensingCost + maintenanceCost + personnelCost;
    
    return initialCosts + (annualCosts * years);
  }
  
  // Helper function to calculate sensitivity rating (0-10 scale)
  function calculateSensitivity(value, min, max) {
    // Normalize to 0-10 scale
    return Math.min(10, Math.max(0, ((value - min) / (max - min)) * 10));
  }
  
  // Helper function to get vendor name
  function getVendorName() {
    if (window.calculator && window.calculator.activeVendor) {
      return window.calculator.activeVendor;
    }
    return 'Current Vendor';
  }
  
  // Add event listener to sensitivity analysis button
  function setupSensitivityButton() {
    const sensitivityBtn = document.getElementById('sensitivity-analysis-btn');
    if (!sensitivityBtn) return;
    
    // Remove existing event listeners
    const newBtn = sensitivityBtn.cloneNode(true);
    sensitivityBtn.parentNode.replaceChild(newBtn, sensitivityBtn);
    
    // Add new event listener
    newBtn.addEventListener('click', function() {
      // Create modal if it doesn't exist
      const modal = document.getElementById('sensitivity-analysis-modal') || createSensitivityAnalyzerModal();
      
      // Show modal using Bootstrap
      const modalInstance = new bootstrap.Modal(modal);
      modalInstance.show();
      
      // Update initial values
      setTimeout(() => {
        // Initialize charts
        const activeTab = document.querySelector('.sensitivity-tab.active');
        if (activeTab) {
          updateSensitivityCharts(activeTab.getAttribute('data-tab'));
        }
      }, 100);
    });
  }
  
  // Initialize
  function init() {
    console.log('Setting up Enhanced Sensitivity Analyzer...');
    
    // Set up sensitivity button
    setupSensitivityButton();
    
    console.log('Enhanced Sensitivity Analyzer setup complete');
  }
  
  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
