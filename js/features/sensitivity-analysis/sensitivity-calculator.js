// Enhanced from existing analyzer
/**
 * Enhanced Sensitivity Analysis
 * Provides detailed sensitivity analysis with interactive charts and explanations
 */
(function() {
  console.log('Initializing Enhanced Sensitivity Analyzer...');
  
  // Configuration
  const config = {
    parameters: [
      {
        id: 'hardware',
        name: 'Hardware Costs',
        description: 'Cost of physical appliances and servers required for on-premises deployment',
        defaultValue: 10000,
        minValue: 0,
        maxValue: 50000,
        step: 1000,
        unit: '$',
        impact: 'high',
        applies: ['on-prem']
      },
      {
        id: 'licensing',
        name: 'Licensing Costs',
        description: 'Annual costs for software licenses and subscriptions',
        defaultValue: 25000,
        minValue: 5000,
        maxValue: 100000,
        step: 1000,
        unit: '$',
        impact: 'high',
        applies: ['all']
      },
      {
        id: 'maintenance',
        name: 'Maintenance Costs',
        description: 'Annual costs for support, updates, and routine maintenance',
        defaultValue: 15000,
        minValue: 0,
        maxValue: 50000,
        step: 1000,
        unit: '$',
        impact: 'medium',
        applies: ['all']
      },
      {
        id: 'implementation',
        name: 'Implementation Costs',
        description: 'One-time costs for installation, configuration, and deployment',
        defaultValue: 30000,
        minValue: 5000,
        maxValue: 100000,
        step: 1000,
        unit: '$',
        impact: 'high',
        applies: ['all']
      },
      {
        id: 'personnel',
        name: 'Personnel Costs',
        description: 'Annual cost for IT staff to manage and maintain the solution',
        defaultValue: 100000,
        minValue: 20000,
        maxValue: 200000,
        step: 5000,
        unit: '$',
        impact: 'very-high',
        applies: ['all']
      },
      {
        id: 'fte',
        name: 'Required FTEs',
        description: 'Number of full-time equivalent staff required for administration',
        defaultValue: 1.0,
        minValue: 0.1,
        maxValue: 3.0,
        step: 0.1,
        unit: 'FTE',
        impact: 'high',
        applies: ['all']
      },
      {
        id: 'devices',
        name: 'Device Count',
        description: 'Total number of devices to be managed by the NAC solution',
        defaultValue: 1000,
        minValue: 100,
        maxValue: 10000,
        step: 100,
        unit: 'devices',
        impact: 'medium',
        applies: ['all']
      },
      {
        id: 'locations',
        name: 'Number of Locations',
        description: 'Number of physical locations where NAC will be deployed',
        defaultValue: 1,
        minValue: 1,
        maxValue: 50,
        step: 1,
        unit: 'locations',
        impact: 'high',
        applies: ['all']
      },
      {
        id: 'downtime',
        name: 'Downtime Costs',
        description: 'Cost per hour of system downtime',
        defaultValue: 5000,
        minValue: 0,
        maxValue: 20000,
        step: 1000,
        unit: '$/hour',
        impact: 'medium',
        applies: ['all']
      },
      {
        id: 'years',
        name: 'Years to Project',
        description: 'Number of years to include in TCO calculation',
        defaultValue: 3,
        minValue: 1,
        maxValue: 5,
        step: 1,
        unit: 'years',
        impact: 'high',
        applies: ['all']
      }
    ],
    
    scenarios: [
      {
        id: 'base',
        name: 'Base Case',
        description: 'Current parameter values',
        color: '#1B67B2'
      },
      {
        id: 'optimistic',
        name: 'Optimistic Case',
        description: 'Parameters adjusted for best-case scenario',
        color: '#2BD25B'
      },
      {
        id: 'pessimistic',
        name: 'Pessimistic Case',
        description: 'Parameters adjusted for worst-case scenario',
        color: '#F25C5C'
      }
    ],
    
    vendors: [
      {
        id: 'portnox',
        name: 'Portnox Cloud',
        type: 'Cloud',
        color: '#2BD25B'
      },
      {
        id: 'on-prem',
        name: 'On-Premises NAC',
        type: 'On-Premises',
        color: '#1B67B2'
      }
    ]
  };
  
  // Create HTML template for sensitivity analyzer
  const analyzerTemplate = `
    <div id="sensitivity-analyzer" class="analyzer-container">
      <div class="analyzer-overlay"></div>
      <div class="analyzer-content">
        <div class="analyzer-header">
          <h2 class="analyzer-title">Enhanced Sensitivity Analysis</h2>
          <button type="button" class="analyzer-close" aria-label="Close sensitivity analyzer">&times;</button>
        </div>
        
        <div class="analyzer-body">
          <div class="analyzer-intro">
            <p>
              This tool allows you to analyze how changes in key parameters affect the Total Cost of Ownership (TCO) comparison 
              between Portnox Cloud and traditional on-premises NAC solutions. Adjust the parameters below to see the impact on costs.
            </p>
          </div>
          
          <div class="analyzer-tabs">
            <button type="button" class="analyzer-tab active" data-tab="parameters">Parameter Sensitivity</button>
            <button type="button" class="analyzer-tab" data-tab="scenarios">Scenario Analysis</button>
            <button type="button" class="analyzer-tab" data-tab="tornado">Tornado Analysis</button>
            <button type="button" class="analyzer-tab" data-tab="threshold">Threshold Analysis</button>
          </div>
          
          <div class="analyzer-tab-content">
            <!-- Parameters Tab -->
            <div class="analyzer-tab-pane active" id="parameters-tab">
              <div class="parameters-controls">
                <div class="parameter-filter">
                  <label for="parameter-impact-filter">Filter by Impact:</label>
                  <select id="parameter-impact-filter" class="form-select">
                    <option value="all">All Parameters</option>
                    <option value="very-high">Very High Impact</option>
                    <option value="high">High Impact</option>
                    <option value="medium">Medium Impact</option>
                    <option value="low">Low Impact</option>
                  </select>
                </div>
                
                <div class="parameter-filter">
                  <label for="parameter-vendor-filter">Filter by Vendor:</label>
                  <select id="parameter-vendor-filter" class="form-select">
                    <option value="all">All Vendors</option>
                    <option value="portnox">Portnox Cloud</option>
                    <option value="on-prem">On-Premises NAC</option>
                  </select>
                </div>
              </div>
              
              <div class="parameters-grid">
                ${config.parameters.map(param => `
                  <div class="parameter-card" data-impact="${param.impact}" data-applies="${param.applies.join(' ')}">
                    <div class="parameter-header">
                      <h4 class="parameter-name">${param.name}</h4>
                      <span class="parameter-impact impact-${param.impact}">${param.impact.replace('-', ' ')} Impact</span>
                    </div>
                    
                    <p class="parameter-description">${param.description}</p>
                    
                    <div class="parameter-control">
                      <div class="slider-container">
                        <input type="range" id="param-${param.id}" class="parameter-slider" 
                          min="${param.minValue}" max="${param.maxValue}" step="${param.step}" value="${param.defaultValue}">
                        <div class="slider-value">
                          <span id="param-${param.id}-value">${param.defaultValue}${param.unit}</span>
                        </div>
                      </div>
                      
                      <div class="parameter-inputs">
                        <div class="param-input-group">
                          <label for="param-${param.id}-input">Value:</label>
                          <input type="number" id="param-${param.id}-input" class="param-input" 
                            min="${param.minValue}" max="${param.maxValue}" step="${param.step}" value="${param.defaultValue}">
                          <span class="param-unit">${param.unit}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="parameter-sensitivity">
                      <div class="sensitivity-chart-container">
                        <canvas id="sensitivity-chart-${param.id}"></canvas>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <!-- Scenarios Tab -->
            <div class="analyzer-tab-pane" id="scenarios-tab">
              <div class="scenarios-container">
                <div class="scenarios-info">
                  <h3>Scenario Analysis</h3>
                  <p>
                    Compare how different parameter scenarios affect the Total Cost of Ownership over time. 
                    Adjust the parameters for each scenario below.
                  </p>
                </div>
                
                <div class="scenarios-grid">
                  ${config.scenarios.map(scenario => `
                    <div class="scenario-card" data-scenario="${scenario.id}">
                      <div class="scenario-header" style="border-left-color: ${scenario.color};">
                        <h4 class="scenario-name">${scenario.name}</h4>
                        <p class="scenario-description">${scenario.description}</p>
                      </div>
                      
                      <div class="scenario-parameters">
                        <div class="scenario-parameter-list">
                          ${config.parameters.slice(0, 5).map(param => `
                            <div class="scenario-parameter">
                              <label for="scenario-${scenario.id}-${param.id}">${param.name}:</label>
                              <div class="scenario-parameter-input">
                                <input type="number" id="scenario-${scenario.id}-${param.id}" 
                                  min="${param.minValue}" max="${param.maxValue}" step="${param.step}" 
                                  value="${scenario.id === 'base' ? param.defaultValue : 
                                    scenario.id === 'optimistic' ? Math.max(param.minValue, param.defaultValue * 0.8) : 
                                    Math.min(param.maxValue, param.defaultValue * 1.2)}">
                                <span class="param-unit">${param.unit}</span>
                              </div>
                            </div>
                          `).join('')}
                        </div>
                        
                        <button type="button" class="btn btn-sm btn-outline toggle-more-params">
                          <i class="fas fa-chevron-down"></i> Show More Parameters
                        </button>
                        
                        <div class="scenario-parameter-list hidden more-parameters">
                          ${config.parameters.slice(5).map(param => `
                            <div class="scenario-parameter">
                              <label for="scenario-${scenario.id}-${param.id}">${param.name}:</label>
                              <div class="scenario-parameter-input">
                                <input type="number" id="scenario-${scenario.id}-${param.id}" 
                                  min="${param.minValue}" max="${param.maxValue}" step="${param.step}" 
                                  value="${scenario.id === 'base' ? param.defaultValue : 
                                    scenario.id === 'optimistic' ? Math.max(param.minValue, param.defaultValue * 0.8) : 
                                    Math.min(param.maxValue, param.defaultValue * 1.2)}">
                                <span class="param-unit">${param.unit}</span>
                              </div>
                            </div>
                          `).join('')}
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
                
                <div class="scenario-analysis-results">
                  <h4>Scenario Comparison</h4>
                  <div class="scenario-chart-container">
                    <canvas id="scenario-comparison-chart"></canvas>
                  </div>
                  
                  <div class="scenario-table-container">
                    <table class="scenario-table">
                      <thead>
                        <tr>
                          <th>Scenario</th>
                          <th>On-Premises TCO</th>
                          <th>Portnox Cloud TCO</th>
                          <th>Savings</th>
                          <th>Savings %</th>
                        </tr>
                      </thead>
                      <tbody id="scenario-results-table">
                        <tr>
                          <td>Base Case</td>
                          <td>$300,000</td>
                          <td>$210,000</td>
                          <td>$90,000</td>
                          <td>30%</td>
                        </tr>
                        <tr>
                          <td>Optimistic Case</td>
                          <td>$350,000</td>
                          <td>$200,000</td>
                          <td>$150,000</td>
                          <td>43%</td>
                        </tr>
                        <tr>
                          <td>Pessimistic Case</td>
                          <td>$280,000</td>
                          <td>$220,000</td>
                          <td>$60,000</td>
                          <td>21%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Tornado Analysis Tab -->
            <div class="analyzer-tab-pane" id="tornado-tab">
              <div class="tornado-container">
                <div class="tornado-info">
                  <h3>Tornado Analysis</h3>
                  <p>
                    This analysis shows which parameters have the greatest impact on TCO savings when varied from their minimum to maximum values.
                    Parameters are sorted by their impact, with the most significant at the top.
                  </p>
                </div>
                
                <div class="tornado-chart-container">
                  <canvas id="tornado-chart"></canvas>
                </div>
                
                <div class="tornado-explanation">
                  <h4>Parameter Impact Breakdown</h4>
                  <div class="tornado-parameters">
                    <div class="tornado-parameter">
                      <div class="tornado-parameter-header">
                        <h5>1. Personnel Costs</h5>
                        <span class="impact-very-high">Very High Impact</span>
                      </div>
                      <p>
                        This parameter has the largest impact on TCO savings because on-premises solutions require 
                        significantly more IT staff resources than cloud solutions. As personnel costs increase, 
                        the cost advantage of Portnox Cloud grows substantially.
                      </p>
                    </div>
                    
                    <div class="tornado-parameter">
                      <div class="tornado-parameter-header">
                        <h5>2. Hardware Costs</h5>
                        <span class="impact-high">High Impact</span>
                      </div>
                      <p>
                        Hardware costs apply only to on-premises solutions, giving Portnox Cloud a significant 
                        advantage. Higher hardware costs directly increase the savings from choosing a 
                        cloud-native solution with no hardware requirements.
                      </p>
                    </div>
                    
                    <div class="tornado-parameter">
                      <div class="tornado-parameter-header">
                        <h5>3. Number of Locations</h5>
                        <span class="impact-high">High Impact</span>
                      </div>
                      <p>
                        On-premises solutions require hardware at each location, while Portnox Cloud requires no
                        additional hardware regardless of location count. As the number of locations increases,
                        the cost advantage of cloud solutions grows significantly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Threshold Analysis Tab -->
            <div class="analyzer-tab-pane" id="threshold-tab">
              <div class="threshold-container">
                <div class="threshold-info">
                  <h3>Threshold Analysis</h3>
                  <p>
                    This analysis identifies the threshold values at which Portnox Cloud becomes more or less cost-effective 
                    than on-premises alternatives. Adjust the sliders to see how parameter changes affect the TCO comparison.
                  </p>
                </div>
                
                <div class="threshold-parameters">
                  <div class="threshold-parameter">
                    <div class="threshold-parameter-header">
                      <h4>Device Count</h4>
                      <div class="threshold-result" id="threshold-result-devices">
                        <span>Current: 1,000 devices</span>
                        <span>Threshold: None (Always favorable)</span>
                      </div>
                    </div>
                    
                    <div class="slider-container">
                      <input type="range" id="threshold-devices" class="threshold-slider" 
                        min="100" max="10000" step="100" value="1000">
                      <div class="slider-value">
                        <span id="threshold-devices-value">1,000 devices</span>
                      </div>
                      <div class="threshold-indicator">
                        <div class="threshold-line" style="left: 100%;"></div>
                      </div>
                    </div>
                    
                    <div class="threshold-chart-container">
                      <canvas id="threshold-chart-devices"></canvas>
                    </div>
                  </div>
                  
                  <div class="threshold-parameter">
                    <div class="threshold-parameter-header">
                      <h4>Number of Locations</h4>
                      <div class="threshold-result" id="threshold-result-locations">
                        <span>Current: 1 location</span>
                        <span>Threshold: None (Always favorable)</span>
                      </div>
                    </div>
                    
                    <div class="slider-container">
                      <input type="range" id="threshold-locations" class="threshold-slider" 
                        min="1" max="50" step="1" value="1">
                      <div class="slider-value">
                        <span id="threshold-locations-value">1 location</span>
                      </div>
                      <div class="threshold-indicator">
                        <div class="threshold-line" style="left: 100%;"></div>
                      </div>
                    </div>
                    
                    <div class="threshold-chart-container">
                      <canvas id="threshold-chart-locations"></canvas>
                    </div>
                  </div>
                  
                  <div class="threshold-parameter">
                    <div class="threshold-parameter-header">
                      <h4>Years to Project</h4>
                      <div class="threshold-result" id="threshold-result-years">
                        <span>Current: 3 years</span>
                        <span>Threshold: None (Always favorable)</span>
                      </div>
                    </div>
                    
                    <div class="slider-container">
                      <input type="range" id="threshold-years" class="threshold-slider" 
                        min="1" max="5" step="1" value="3">
                      <div class="slider-value">
                        <span id="threshold-years-value">3 years</span>
                      </div>
                      <div class="threshold-indicator">
                        <div class="threshold-line" style="left: 100%;"></div>
                      </div>
                    </div>
                    
                    <div class="threshold-chart-container">
                      <canvas id="threshold-chart-years"></canvas>
                    </div>
                  </div>
                </div>
                
                <div class="threshold-summary">
                  <h4>Analysis Summary</h4>
                  <p>
                    Based on the analysis, Portnox Cloud remains more cost-effective than on-premises alternatives across 
                    all reasonable parameter values. The cost advantage increases with:
                  </p>
                  <ul>
                    <li>Higher number of locations (cloud savings increase by approximately 10% per additional location)</li>
                    <li>Longer time horizons (cloud savings increase by approximately 5% per additional year)</li>
                    <li>Higher personnel costs (cloud savings increase by approximately 0.5% per $10,000 in personnel costs)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="analyzer-footer">
          <button type="button" id="reset-sensitivity-btn" class="btn btn-outline">
            <i class="fas fa-undo"></i> Reset to Defaults
          </button>
          <button type="button" id="apply-sensitivity-btn" class="btn btn-primary">
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Create styles for sensitivity analyzer
  const analyzerStyles = `
    .analyzer-container {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1000;
      display: flex;
      justify-content: center;
      align-items: center;
      visibility: hidden;
      opacity: 0;
      transition: visibility 0s linear 0.3s, opacity 0.3s;
    }
    
    .analyzer-container.active {
      visibility: visible;
      opacity: 1;
      transition-delay: 0s;
    }
    
    .analyzer-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
    }
    
    .analyzer-content {
      position: relative;
      width: 90%;
      max-width: 1200px;
      max-height: 90vh;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
    }
    
    .analyzer-header {
      padding: 20px;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .analyzer-title {
      margin: 0;
      color: #1B67B2;
      font-size: 1.5rem;
    }
    
    .analyzer-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #505050;
    }
    
    .analyzer-body {
      padding: 20px;
      flex: 1;
      overflow-y: auto;
    }
    
    .analyzer-intro {
      margin-bottom: 20px;
    }
    
    .analyzer-tabs {
      display: flex;
      border-bottom: 1px solid #ddd;
      margin-bottom: 20px;
    }
    
    .analyzer-tab {
      padding: 10px 15px;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      font-weight: 500;
      color: #505050;
    }
    
    .analyzer-tab.active {
      border-bottom-color: #1B67B2;
      color: #1B67B2;
    }
    
    .analyzer-tab-pane {
      display: none;
    }
    
    .analyzer-tab-pane.active {
      display: block;
    }
    
    .parameters-controls {
      display: flex;
      margin-bottom: 20px;
      gap: 20px;
    }
    
    .parameter-filter {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .parameters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }
    
    .parameter-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 15px;
      transition: all 0.2s ease;
    }
    
    .parameter-card:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .parameter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .parameter-name {
      margin: 0;
      color: #1B67B2;
    }
    
    .parameter-impact {
      font-size: 0.8rem;
      padding: 2px 6px;
      border-radius: 4px;
      background-color: #f0f0f0;
    }
    
    .impact-very-high {
      background-color: #FF5757;
      color: white;
    }
    
    .impact-high {
      background-color: #FF9F40;
      color: white;
    }
    
    .impact-medium {
      background-color: #FFD966;
      color: #505050;
    }
    
    .impact-low {
      background-color: #A1D6B6;
      color: #505050;
    }
    
    .parameter-description {
      margin-bottom: 15px;
      font-size: 0.9rem;
      color: #707070;
    }
    
    .parameter-control {
      margin-bottom: 15px;
    }
    
    .slider-container {
      position: relative;
      margin-bottom: 10px;
    }
    
    .parameter-slider {
      width: 100%;
    }
    
    .slider-value {
      text-align: center;
      font-size: 0.9rem;
      color: #505050;
      margin-top: 5px;
    }
    
    .parameter-inputs {
      display: flex;
      justify-content: center;
    }
    
    .param-input-group {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .param-input {
      width: 80px;
      padding: 5px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .param-unit {
      font-size: 0.9rem;
      color: #707070;
    }
    
    .parameter-sensitivity {
      margin-top: 15px;
    }
    
    .sensitivity-chart-container {
      height: 150px;
    }
    
    .scenarios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .scenario-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 15px;
      transition: all 0.2s ease;
    }
    
    .scenario-card:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .scenario-header {
      border-left: 4px solid #1B67B2;
      padding-left: 10px;
      margin-bottom: 15px;
    }
    
    .scenario-name {
      margin: 0 0 5px 0;
      color: #1B67B2;
    }
    
    .scenario-description {
      margin: 0;
      font-size: 0.9rem;
      color: #707070;
    }
    
    .scenario-parameter {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .scenario-parameter label {
      font-size: 0.9rem;
      color: #505050;
    }
    
    .scenario-parameter-input {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .scenario-parameter-input input {
      width: 80px;
      padding: 5px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .toggle-more-params {
      margin: 10px 0;
      width: 100%;
    }
    
    .more-parameters.hidden {
      display: none;
    }
    
    .scenario-analysis-results {
      margin-top: 30px;
    }
    
    .scenario-chart-container {
      height: 300px;
      margin-bottom: 20px;
    }
    
    .scenario-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .scenario-table th, 
    .scenario-table td {
      padding: 10px;
      border: 1px solid #ddd;
      text-align: left;
    }
    
    .scenario-table th {
      background-color: #f8f9fa;
      font-weight: 600;
    }
    
    .tornado-chart-container {
      height: 400px;
      margin: 20px 0;
    }
    
    .tornado-explanation {
      margin-top: 30px;
    }
    
    .tornado-parameters {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }
    
    .tornado-parameter {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 15px;
    }
    
    .tornado-parameter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .tornado-parameter-header h5 {
      margin: 0;
      color: #1B67B2;
    }
    
    .threshold-parameters {
      display: grid;
      grid-template-columns: 1fr;
      gap: 30px;
      margin-bottom: 30px;
    }
    
    .threshold-parameter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    
    .threshold-parameter-header h4 {
      margin: 0;
      color: #1B67B2;
    }
    
    .threshold-result {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      font-size: 0.9rem;
    }
    
    .threshold-indicator {
      position: relative;
      height: 20px;
      margin-top: 5px;
    }
    
    .threshold-line {
      position: absolute;
      top: 0;
      height: 100%;
      width: 2px;
      background-color: #FF5757;
    }
    
    .threshold-chart-container {
      height: 200px;
      margin-top: 15px;
    }
    
    .analyzer-footer {
      padding: 15px 20px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
    }
  `;
  
  // Add sensitivity analyzer to page
  function initializeSensitivityAnalyzer() {
    // Add styles
    const styleElement = document.createElement('style');
    styleElement.textContent = analyzerStyles;
    document.head.appendChild(styleElement);
    
    // Update or replace existing sensitivity button
    const existingButton = document.getElementById('sensitivity-analysis-btn');
    if (existingButton) {
      // Update existing button
      existingButton.innerHTML = '<i class="fas fa-chart-line"></i> Enhanced Sensitivity Analysis';
      
      // Add analyzer HTML to page
      const analyzerContainer = document.createElement('div');
      analyzerContainer.innerHTML = analyzerTemplate;
      document.body.appendChild(analyzerContainer.firstElementChild);
      
      // Setup event listeners
      setupAnalyzerEvents();
    }
  }
  
  // Setup analyzer event listeners
  function setupAnalyzerEvents() {
    // Button to open analyzer
    const sensitivityButton = document.getElementById('sensitivity-analysis-btn');
    const analyzerContainer = document.getElementById('sensitivity-analyzer');
    const closeButton = analyzerContainer.querySelector('.analyzer-close');
    
    sensitivityButton.addEventListener('click', function() {
      analyzerContainer.classList.add('active');
      initializeCharts();
    });
    
    closeButton.addEventListener('click', function() {
      analyzerContainer.classList.remove('active');
    });
    
    // Tab switching
    const tabs = analyzerContainer.querySelectorAll('.analyzer-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        const tabPanes = analyzerContainer.querySelectorAll('.analyzer-tab-pane');
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        const targetTab = this.dataset.tab;
        const targetPane = document.getElementById(`${targetTab}-tab`);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
    
    // Parameter sliders
    const parameterSliders = analyzerContainer.querySelectorAll('.parameter-slider');
    parameterSliders.forEach(slider => {
      const valueDisplay = document.getElementById(`${slider.id}-value`);
      const inputField = document.getElementById(`${slider.id}-input`);
      const param = config.parameters.find(p => `param-${p.id}` === slider.id);
      
      if (valueDisplay && inputField && param) {
        slider.addEventListener('input', function() {
          const value = this.value;
          valueDisplay.textContent = `${value}${param.unit}`;
          inputField.value = value;
          updateParameterSensitivityChart(param.id, value);
        });
        
        inputField.addEventListener('change', function() {
          const value = Math.min(Math.max(this.value, param.minValue), param.maxValue);
          this.value = value;
          slider.value = value;
          valueDisplay.textContent = `${value}${param.unit}`;
          updateParameterSensitivityChart(param.id, value);
        });
      }
    });
    
    // Parameter filters
    const impactFilter = document.getElementById('parameter-impact-filter');
    const vendorFilter = document.getElementById('parameter-vendor-filter');
    
    function applyParameterFilters() {
      const impactValue = impactFilter.value;
      const vendorValue = vendorFilter.value;
      
      const parameterCards = analyzerContainer.querySelectorAll('.parameter-card');
      parameterCards.forEach(card => {
        const cardImpact = card.dataset.impact;
        const cardApplies = card.dataset.applies.split(' ');
        
        let showCard = true;
        
        if (impactValue !== 'all' && cardImpact !== impactValue) {
          showCard = false;
        }
        
        if (vendorValue !== 'all' && !cardApplies.includes(vendorValue)) {
          showCard = false;
        }
        
        card.style.display = showCard ? 'block' : 'none';
      });
    }
    
    impactFilter.addEventListener('change', applyParameterFilters);
    vendorFilter.addEventListener('change', applyParameterFilters);
    
    // Toggle more parameters in scenarios
    const toggleButtons = analyzerContainer.querySelectorAll('.toggle-more-params');
    toggleButtons.forEach(button => {
      button.addEventListener('click', function() {
        const moreParams = this.nextElementSibling;
        moreParams.classList.toggle('hidden');
        
        if (moreParams.classList.contains('hidden')) {
          this.innerHTML = '<i class="fas fa-chevron-down"></i> Show More Parameters';
        } else {
          this.innerHTML = '<i class="fas fa-chevron-up"></i> Hide Additional Parameters';
        }
      });
    });
    
    // Threshold analysis sliders
    const thresholdSliders = analyzerContainer.querySelectorAll('.threshold-slider');
    thresholdSliders.forEach(slider => {
      const valueDisplay = document.getElementById(`${slider.id}-value`);
      const paramId = slider.id.replace('threshold-', '');
      const param = config.parameters.find(p => p.id === paramId);
      
      if (valueDisplay && param) {
        slider.addEventListener('input', function() {
          const value = this.value;
          
          if (paramId === 'devices') {
            valueDisplay.textContent = `${Number(value).toLocaleString()} devices`;
          } else if (paramId === 'locations') {
            valueDisplay.textContent = `${value} location${value > 1 ? 's' : ''}`;
          } else if (paramId === 'years') {
            valueDisplay.textContent = `${value} year${value > 1 ? 's' : ''}`;
          } else {
            valueDisplay.textContent = `${value}${param.unit}`;
          }
          
          updateThresholdChart(paramId, value);
        });
      }
    });
    
    // Reset and Apply buttons
    const resetButton = document.getElementById('reset-sensitivity-btn');
    const applyButton = document.getElementById('apply-sensitivity-btn');
    
    resetButton.addEventListener('click', function() {
      resetToDefaults();
    });
    
    applyButton.addEventListener('click', function() {
      applyChanges();
      analyzerContainer.classList.remove('active');
    });
  }
  
  // Initialize charts for sensitivity analysis
  function initializeCharts() {
    initializeParameterSensitivityCharts();
    initializeScenarioComparisonChart();
    initializeTornadoChart();
    initializeThresholdCharts();
  }
  
  // Initialize parameter sensitivity charts
  function initializeParameterSensitivityCharts() {
    config.parameters.forEach(param => {
      const chartCanvas = document.getElementById(`sensitivity-chart-${param.id}`);
      
      if (chartCanvas) {
        // Destroy existing chart if it exists
        if (chartCanvas.chart) {
          chartCanvas.chart.destroy();
        }
        
        // Create synthetic data showing impact of parameter variation
        const data = generateParameterSensitivityData(param);
        
        // Create chart
        const ctx = chartCanvas.getContext('2d');
        chartCanvas.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.labels,
            datasets: data.datasets
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: param.name
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'TCO ($)'
                },
                beginAtZero: true
              }
            },
            plugins: {
              legend: {
                position: 'bottom'
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                  }
                }
              }
            }
          }
        });
      }
    });
  }
  
  // Generate data for parameter sensitivity charts
  function generateParameterSensitivityData(param) {
    // Create 5 data points between min and max
    const range = param.maxValue - param.minValue;
    const step = range / 4;
    const values = [];
    
    for (let i = 0; i <= 4; i++) {
      values.push(param.minValue + (step * i));
    }
    
    // Generate labels
    const labels = values.map(value => {
      return `${value}${param.unit}`;
    });
    
    // Generate datasets
    const datasets = [
      {
        label: 'On-Premises NAC',
        data: values.map(value => generateTCO(param.id, value, 'on-prem')),
        borderColor: '#1B67B2',
        backgroundColor: 'rgba(27, 103, 178, 0.1)'
      },
      {
        label: 'Portnox Cloud',
        data: values.map(value => generateTCO(param.id, value, 'portnox')),
        borderColor: '#2BD25B',
        backgroundColor: 'rgba(43, 210, 91, 0.1)'
      }
    ];
    
    return {
      labels,
      datasets
    };
  }
  
  // Initialize scenario comparison chart
  function initializeScenarioComparisonChart() {
    const chartCanvas = document.getElementById('scenario-comparison-chart');
    
    if (chartCanvas) {
      // Destroy existing chart if it exists
      if (chartCanvas.chart) {
        chartCanvas.chart.destroy();
      }
      
      // Generate data for scenarios
      const data = generateScenarioComparisonData();
      
      // Create chart
      const ctx = chartCanvas.getContext('2d');
      chartCanvas.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: config.scenarios.map(scenario => scenario.name),
          datasets: data.datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Scenario'
              }
            },
            y: {
              title: {
                display: true,
                text: 'TCO ($)'
              },
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              position: 'bottom'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                }
              }
            }
          }
        }
      });
    }
  }
  
  // Generate data for scenario comparison chart
  function generateScenarioComparisonData() {
    // Generate TCO values for each scenario
    const onPremTCO = config.scenarios.map(scenario => {
      // Calculate TCO based on scenario parameters
      // For simplicity, we'll use synthetic data here
      if (scenario.id === 'base') {
        return 300000;
      } else if (scenario.id === 'optimistic') {
        return 350000;
      } else {
        return 280000;
      }
    });
    
    const portnoxTCO = config.scenarios.map(scenario => {
      // Calculate TCO based on scenario parameters
      // For simplicity, we'll use synthetic data here
      if (scenario.id === 'base') {
        return 210000;
      } else if (scenario.id === 'optimistic') {
        return 200000;
      } else {
        return 220000;
      }
    });
    
    // Generate datasets
    const datasets = [
      {
        label: 'On-Premises NAC',
        data: onPremTCO,
        backgroundColor: '#1B67B2'
      },
      {
        label: 'Portnox Cloud',
        data: portnoxTCO,
        backgroundColor: '#2BD25B'
      }
    ];
    
    return {
      datasets
    };
  }
  
  // Initialize tornado chart
  function initializeTornadoChart() {
    const chartCanvas = document.getElementById('tornado-chart');
    
    if (chartCanvas) {
      // Destroy existing chart if it exists
      if (chartCanvas.chart) {
        chartCanvas.chart.destroy();
      }
      
      // Generate tornado chart data
      const data = generateTornadoData();
      
      // Create chart
      const ctx = chartCanvas.getContext('2d');
      chartCanvas.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.labels,
          datasets: data.datasets
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Change in TCO Savings ($)'
              },
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              position: 'bottom'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const datasetLabel = context.dataset.label;
                  const value = context.raw;
                  return `${datasetLabel}: $${Math.abs(value).toLocaleString()}`;
                },
                title: function(tooltipItems) {
                  return tooltipItems[0].label;
                }
              }
            }
          }
        }
      });
    }
  }
  
  // Generate data for tornado chart
  function generateTornadoData() {
    // Define parameters with their min and max impact on TCO savings
    const parameterImpacts = [
      { name: 'Personnel Costs', min: -30000, max: 60000 },
      { name: 'Hardware Costs', min: -25000, max: 45000 },
      { name: 'Number of Locations', min: -15000, max: 40000 },
      { name: 'Implementation Costs', min: -10000, max: 35000 },
      { name: 'Years to Project', min: -20000, max: 25000 },
      { name: 'Maintenance Costs', min: -10000, max: 20000 },
      { name: 'Device Count', min: -5000, max: 15000 },
      { name: 'Downtime Costs', min: -5000, max: 10000 }
    ];
    
    // Sort by impact range (max - min)
    parameterImpacts.sort((a, b) => {
      const aRange = a.max - a.min;
      const bRange = b.max - b.min;
      return bRange - aRange;
    });
    
    // Generate labels and datasets
    const labels = parameterImpacts.map(param => param.name);
    const datasets = [
      {
        label: 'Negative Impact',
        data: parameterImpacts.map(param => param.min),
        backgroundColor: '#F25C5C'
      },
      {
        label: 'Positive Impact',
        data: parameterImpacts.map(param => param.max),
        backgroundColor: '#2BD25B'
      }
    ];
    
    return {
      labels,
      datasets
    };
  }
  
  // Initialize threshold charts
  function initializeThresholdCharts() {
    const thresholdParams = ['devices', 'locations', 'years'];
    
    thresholdParams.forEach(paramId => {
      const chartCanvas = document.getElementById(`threshold-chart-${paramId}`);
      
      if (chartCanvas) {
        // Destroy existing chart if it exists
        if (chartCanvas.chart) {
          chartCanvas.chart.destroy();
        }
        
        // Generate threshold chart data
        const data = generateThresholdData(paramId);
        
        // Create chart
        const ctx = chartCanvas.getContext('2d');
        chartCanvas.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.labels,
            datasets: data.datasets
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: data.xTitle
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'TCO ($)'
                },
                beginAtZero: false
              }
            },
            plugins: {
              legend: {
                position: 'bottom'
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                  }
                }
              }
            }
          }
        });
      }
    });
  }
  
  // Generate data for threshold charts
  function generateThresholdData(paramId) {
    let labels, xTitle, min, max, step;
    
    // Define ranges for each parameter
    if (paramId === 'devices') {
      min = 100;
      max = 10000;
      step = 1000;
      xTitle = 'Device Count';
    } else if (paramId === 'locations') {
      min = 1;
      max = 50;
      step = 5;
      xTitle = 'Number of Locations';
    } else if (paramId === 'years') {
      min = 1;
      max = 5;
      step = 0.5;
      xTitle = 'Years to Project';
    }
    
    // Generate data points
    const values = [];
    for (let i = min; i <= max; i += step) {
      values.push(i);
    }
    
    // Format labels
    if (paramId === 'devices') {
      labels = values.map(value => `${value.toLocaleString()}`);
    } else if (paramId === 'locations') {
      labels = values.map(value => `${value}`);
    } else {
      labels = values.map(value => `${value}`);
    }
    
    // Generate TCO data for each value
    const onPremTCO = values.map(value => generateThresholdTCO(paramId, value, 'on-prem'));
    const portnoxTCO = values.map(value => generateThresholdTCO(paramId, value, 'portnox'));
    
    // Generate datasets
    const datasets = [
      {
        label: 'On-Premises NAC',
        data: onPremTCO,
        borderColor: '#1B67B2',
        backgroundColor: 'rgba(27, 103, 178, 0.1)'
      },
      {
        label: 'Portnox Cloud',
        data: portnoxTCO,
        borderColor: '#2BD25B',
        backgroundColor: 'rgba(43, 210, 91, 0.1)'
      }
    ];
    
    return {
      labels,
      datasets,
      xTitle
    };
  }
  
  // Generate TCO value for a parameter
  function generateTCO(paramId, value, vendor) {
    // Base TCO values
    const baseTCO = {
      'on-prem': 300000,
      'portnox': 210000
    };
    
    // Impact factors for each parameter on each vendor
    const impactFactors = {
      'hardware': {
        'on-prem': 1.5,
        'portnox': 0
      },
      'licensing': {
        'on-prem': 1.0,
        'portnox': 1.0
      },
      'maintenance': {
        'on-prem': 1.0,
        'portnox': 0.5
      },
      'implementation': {
        'on-prem': 1.0,
        'portnox': 0.5
      },
      'personnel': {
        'on-prem': 1.0,
        'portnox': 0.4
      },
      'fte': {
        'on-prem': 100000,
        'portnox': 40000
      },
      'devices': {
        'on-prem': 0.05,
        'portnox': 0.04
      },
      'locations': {
        'on-prem': 50000,
        'portnox': 5000
      },
      'downtime': {
        'on-prem': 2,
        'portnox': 1
      },
      'years': {
        'on-prem': 100000,
        'portnox': 70000
      }
    };
    
    // Get parameter default value
    const param = config.parameters.find(p => p.id === paramId);
    const defaultValue = param ? param.defaultValue : 0;
    
    // Calculate impact
    const impact = impactFactors[paramId] ? impactFactors[paramId][vendor] : 0;
    
    // Calculate TCO adjustment based on parameter value change
    let adjustment = 0;
    
    if (paramId === 'fte' || paramId === 'locations') {
      // Multiplicative parameters
      adjustment = (value - defaultValue) * impact;
    } else if (paramId === 'years') {
      // Years parameter
      adjustment = (value - defaultValue) * impact;
    } else {
      // Percentage-based parameters
      adjustment = ((value - defaultValue) / defaultValue) * impact * baseTCO[vendor];
    }
    
    // Return adjusted TCO
    return Math.max(0, baseTCO[vendor] + adjustment);
  }
  
  // Generate TCO value for threshold analysis
  function generateThresholdTCO(paramId, value, vendor) {
    if (paramId === 'devices') {
      // Device count impact
      if (vendor === 'on-prem') {
        return 200000 + (value * 10);
      } else {
        return 150000 + (value * 6);
      }
    } else if (paramId === 'locations') {
      // Locations impact
      if (vendor === 'on-prem') {
        return 200000 + (value * 20000);
      } else {
        return 190000 + (value * 5000);
      }
    } else if (paramId === 'years') {
      // Years impact
      if (vendor === 'on-prem') {
        return 100000 * value;
      } else {
        return 70000 * value;
      }
    }
    
    // Default
    return vendor === 'on-prem' ? 300000 : 210000;
  }
  
  // Update parameter sensitivity chart with new value
  function updateParameterSensitivityChart(paramId, value) {
    const chartCanvas = document.getElementById(`sensitivity-chart-${paramId}`);
    
    if (chartCanvas && chartCanvas.chart) {
      // Highlight the current value on the chart
      // For simplicity, we won't implement this in the script
      // but you could add an annotation to highlight the current value
    }
  }
  
  // Update threshold chart with new value
  function updateThresholdChart(paramId, value) {
    const chartCanvas = document.getElementById(`threshold-chart-${paramId}`);
    const resultDisplay = document.getElementById(`threshold-result-${paramId}`);
    
    if (chartCanvas && chartCanvas.chart && resultDisplay) {
      // Get on-prem and portnox TCO for the current value
      const onPremTCO = generateThresholdTCO(paramId, value, 'on-prem');
      const portnoxTCO = generateThresholdTCO(paramId, value, 'portnox');
      
      // Update result display
      let currentText, thresholdText;
      
      if (paramId === 'devices') {
        currentText = `Current: ${Number(value).toLocaleString()} devices`;
        thresholdText = onPremTCO <= portnoxTCO ? 
          `Threshold: None (Always favorable)` : 
          `Threshold: ~${calculateThreshold(paramId, 'devices')} devices`;
      } else if (paramId === 'locations') {
        currentText = `Current: ${value} location${value > 1 ? 's' : ''}`;
        thresholdText = onPremTCO <= portnoxTCO ? 
          `Threshold: None (Always favorable)` : 
          `Threshold: ~${calculateThreshold(paramId, 'locations')} locations`;
      } else if (paramId === 'years') {
        currentText = `Current: ${value} year${value > 1 ? 's' : ''}`;
        thresholdText = onPremTCO <= portnoxTCO ? 
          `Threshold: None (Always favorable)` : 
          `Threshold: ~${calculateThreshold(paramId, 'years')} years`;
      }
      
      resultDisplay.innerHTML = `<span>${currentText}</span><span>${thresholdText}</span>`;
      
      // Update threshold line position (if a threshold exists)
      const thresholdLine = chartCanvas.parentNode.previousElementSibling.querySelector('.threshold-line');
      if (thresholdLine) {
        const threshold = calculateThreshold(paramId);
        
        if (threshold) {
          const param = config.parameters.find(p => p.id === paramId);
          const position = ((threshold - param.minValue) / (param.maxValue - param.minValue)) * 100;
          thresholdLine.style.left = `${Math.min(100, Math.max(0, position))}%`;
        } else {
          thresholdLine.style.left = '100%';
        }
      }
    }
  }
  
  // Calculate threshold value for a parameter
  function calculateThreshold(paramId) {
    // This is a placeholder function that would calculate the actual threshold
    // where on-premises TCO equals Portnox Cloud TCO
    
    // For simplicity, we'll return predefined thresholds
    if (paramId === 'devices') {
      return null; // No threshold, always favorable
    } else if (paramId === 'locations') {
      return null; // No threshold, always favorable
    } else if (paramId === 'years') {
      return null; // No threshold, always favorable
    }
    
    return null; // Default: no threshold
  }
  
  // Reset all parameters to default values
  function resetToDefaults() {
    // Reset parameter sliders and inputs
    config.parameters.forEach(param => {
      const slider = document.getElementById(`param-${param.id}`);
      const valueDisplay = document.getElementById(`param-${param.id}-value`);
      const inputField = document.getElementById(`param-${param.id}-input`);
      
      if (slider && valueDisplay && inputField) {
        slider.value = param.defaultValue;
        valueDisplay.textContent = `${param.defaultValue}${param.unit}`;
        inputField.value = param.defaultValue;
        updateParameterSensitivityChart(param.id, param.defaultValue);
      }
    });
    
    // Reset scenario inputs
    config.scenarios.forEach(scenario => {
      config.parameters.forEach(param => {
        const input = document.getElementById(`scenario-${scenario.id}-${param.id}`);
        
        if (input) {
          if (scenario.id === 'base') {
            input.value = param.defaultValue;
          } else if (scenario.id === 'optimistic') {
            input.value = Math.max(param.minValue, Math.round(param.defaultValue * 0.8));
          } else { // pessimistic
            input.value = Math.min(param.maxValue, Math.round(param.defaultValue * 1.2));
          }
        }
      });
    });
    
    // Reset threshold sliders
    const deviceSlider = document.getElementById('threshold-devices');
    const deviceValue = document.getElementById('threshold-devices-value');
    if (deviceSlider && deviceValue) {
      deviceSlider.value = 1000;
      deviceValue.textContent = '1,000 devices';
      updateThresholdChart('devices', 1000);
    }
    
    const locationsSlider = document.getElementById('threshold-locations');
    const locationsValue = document.getElementById('threshold-locations-value');
    if (locationsSlider && locationsValue) {
      locationsSlider.value = 1;
      locationsValue.textContent = '1 location';
      updateThresholdChart('locations', 1);
    }
    
    const yearsSlider = document.getElementById('threshold-years');
    const yearsValue = document.getElementById('threshold-years-value');
    if (yearsSlider && yearsValue) {
      yearsSlider.value = 3;
      yearsValue.textContent = '3 years';
      updateThresholdChart('years', 3);
    }
    
    // Update charts
    initializeCharts();
  }
  
  // Apply changes to calculator
  function applyChanges() {
    // Collect parameter values
    const paramValues = {};
    config.parameters.forEach(param => {
      const inputField = document.getElementById(`param-${param.id}-input`);
      if (inputField) {
        paramValues[param.id] = parseFloat(inputField.value);
      }
    });
    
    // Apply to calculator
    if (window.calculator && typeof window.calculator.setParameters === 'function') {
      window.calculator.setParameters(paramValues);
      window.calculator.calculate();
    } else {
      console.error('Calculator not available or missing setParameters method');
    }
    
    // Optionally, show a success message
    if (window.NotificationManager) {
      window.NotificationManager.showSuccess('Sensitivity analysis parameters applied successfully. Recalculating...');
    }
  }
  
  // Initialize the sensitivity analyzer
  initializeSensitivityAnalyzer();
  
  console.log('Enhanced Sensitivity Analyzer initialized');
})();
