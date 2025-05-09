/**
 * Financial View
 * Provides detailed financial analysis for cost justification
 */
(function() {
  console.log("Initializing Financial View");
  
  // Execute when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Wait for the tabs to be available
    waitForElement('.tabs', addFinancialView);
  });
  
  // Wait for an element to be available
  function waitForElement(selector, callback, checkFrequencyInMs = 100, timeoutInMs = 10000) {
    var startTimeInMs = Date.now();
    
    (function loopSearch() {
      if (document.querySelector(selector) != null) {
        callback();
        return;
      }
      else {
        setTimeout(function () {
          if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs) {
            console.log("Element not found within timeout: " + selector);
            return;
          }
          loopSearch();
        }, checkFrequencyInMs);
      }
    })();
  }
  
  // Add Financial View tab
  function addFinancialView() {
    console.log("Adding Financial View");
    
    // Get tabs container
    const tabsContainer = document.querySelector('.tabs');
    if (!tabsContainer) {
      console.error("Tabs container not found");
      return;
    }
    
    // Get tab content container
    const tabContent = document.querySelector('.tab-content');
    if (!tabContent) {
      console.error("Tab content container not found");
      return;
    }
    
    // Check if tab already exists
    if (document.getElementById('tab-financial')) {
      console.log("Financial View tab already exists");
      return;
    }
    
    // Add Financial tab button
    const financialTabButton = document.createElement('button');
    financialTabButton.id = 'tab-financial';
    financialTabButton.className = 'tab-button';
    financialTabButton.setAttribute('data-tab', 'financial-tab');
    financialTabButton.setAttribute('role', 'tab');
    financialTabButton.setAttribute('aria-selected', 'false');
    financialTabButton.textContent = 'Financial Analysis';
    
    // Insert after ROI tab if exists, otherwise after Comparison tab
    const roiTab = document.getElementById('tab-roi');
    const comparisonTab = document.getElementById('tab-comparison');
    if (roiTab) {
      tabsContainer.insertBefore(financialTabButton, roiTab.nextSibling);
    } else if (comparisonTab) {
      tabsContainer.insertBefore(financialTabButton, comparisonTab.nextSibling);
    } else {
      tabsContainer.appendChild(financialTabButton);
    }
    
    // Create Financial tab pane
    const financialTabPane = document.createElement('div');
    financialTabPane.id = 'financial-tab';
    financialTabPane.className = 'tab-pane';
    financialTabPane.setAttribute('role', 'tabpanel');
    financialTabPane.setAttribute('aria-labelledby', 'tab-financial');
    tabContent.appendChild(financialTabPane);
    
    // Add Financial View content
    populateFinancialView(financialTabPane);
    
    // Add tab click event
    financialTabButton.addEventListener('click', function() {
      // Update button states
      tabsContainer.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      financialTabButton.classList.add('active');
      financialTabButton.setAttribute('aria-selected', 'true');
      
      // Update tab pane visibility
      tabContent.querySelectorAll('.tab-pane').forEach(pane => {
        if (pane.id === 'financial-tab') {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
    
    console.log("Financial View tab added");
  }
  
  // Populate Financial View with content
  function populateFinancialView(tabPane) {
    console.log("Populating Financial View");
    
    // Financial content
    const financialContent = `
      <div class="result-card">
        <h3>Financial Summary</h3>
        <div class="financial-summary">
          <div class="summary-metrics">
            <div class="metric-item">
              <div class="metric-label">3-Year TCO Savings</div>
              <div class="metric-value" id="financial-tco-savings">$180,000</div>
            </div>
            <div class="metric-item">
              <div class="metric-label">Savings Percentage</div>
              <div class="metric-value" id="financial-savings-percentage">42%</div>
            </div>
            <div class="metric-item">
              <div class="metric-label">Return on Investment</div>
              <div class="metric-value" id="financial-roi">157%</div>
            </div>
            <div class="metric-item">
              <div class="metric-label">Payback Period</div>
              <div class="metric-value" id="financial-payback">8.3 months</div>
            </div>
          </div>
          
          <div class="chart-container" style="height: 250px;">
            <canvas id="financial-summary-chart"></canvas>
          </div>
        </div>
      </div>
      
      <div class="results-grid">
        <div class="result-card">
          <h3>Direct Cost Analysis</h3>
          <div class="chart-container">
            <canvas id="direct-cost-chart"></canvas>
          </div>
        </div>
        
        <div class="result-card">
          <h3>Indirect Cost Analysis</h3>
          <div class="chart-container">
            <canvas id="indirect-cost-chart"></canvas>
          </div>
        </div>
      </div>
      
      <div class="result-card">
        <h3>Detailed Cost Breakdown (3-Year)</h3>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Cost Category</th>
                <th>Current Solution</th>
                <th>Portnox Cloud</th>
                <th>Savings</th>
                <th>% Savings</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Direct Costs</strong></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Hardware</td>
                <td>$80,000</td>
                <td>$0</td>
                <td>$80,000</td>
                <td>100%</td>
              </tr>
              <tr>
                <td>Software/Licensing</td>
                <td>$120,000</td>
                <td>$150,000</td>
                <td>-$30,000</td>
                <td>-25%</td>
              </tr>
              <tr>
                <td>Maintenance & Support</td>
                <td>$60,000</td>
                <td>$0</td>
                <td>$60,000</td>
                <td>100%</td>
              </tr>
              <tr>
                <td>Hardware Refresh (Year 3)</td>
                <td>$40,000</td>
                <td>$0</td>
                <td>$40,000</td>
                <td>100%</td>
              </tr>
              <tr>
                <td><strong>Implementation Costs</strong></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Professional Services</td>
                <td>$50,000</td>
                <td>$15,000</td>
                <td>$35,000</td>
                <td>70%</td>
              </tr>
              <tr>
                <td>Internal IT Resources</td>
                <td>$30,000</td>
                <td>$5,000</td>
                <td>$25,000</td>
                <td>83%</td>
              </tr>
              <tr>
                <td><strong>Operational Costs</strong></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>Administrative Overhead (FTE)</td>
                <td>$90,000</td>
                <td>$50,000</td>
                <td>$40,000</td>
                <td>44%</td>
              </tr>
              <tr>
                <td>Training</td>
                <td>$10,000</td>
                <td>$5,000</td>
                <td>$5,000</td>
                <td>50%</td>
              </tr>
              <tr>
                <td>Power & Cooling</td>
                <td>$15,000</td>
                <td>$0</td>
                <td>$15,000</td>
                <td>100%</td>
              </tr>
              <tr>
                <td>Data Center Space</td>
                <td>$8,000</td>
                <td>$0</td>
                <td>$8,000</td>
                <td>100%</td>
              </tr>
              <tr>
                <td>Network Infrastructure</td>
                <td>$10,000</td>
                <td>$0</td>
                <td>$10,000</td>
                <td>100%</td>
              </tr>
              <tr class="total-row">
                <td><strong>Total</strong></td>
                <td><strong>$513,000</strong></td>
                <td><strong>$225,000</strong></td>
                <td><strong>$288,000</strong></td>
                <td><strong>56%</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="result-card">
        <h3>Cash Flow Analysis</h3>
        <div class="chart-container">
          <canvas id="cash-flow-chart"></canvas>
        </div>
      </div>
      
      <div class="results-grid">
        <div class="result-card">
          <h3>Break-Even Analysis</h3>
          <div class="chart-container">
            <canvas id="break-even-chart"></canvas>
          </div>
        </div>
        
        <div class="result-card">
          <h3>Risk-Adjusted ROI</h3>
          <div class="risk-adjusted-roi">
            <p>The risk-adjusted ROI analysis accounts for implementation risks and adoption variables to provide a more conservative estimate of financial returns.</p>
            
            <div class="roi-scenarios">
              <div class="roi-scenario">
                <h4>Conservative Scenario</h4>
                <div class="scenario-metrics">
                  <div class="scenario-metric">
                    <span class="metric-label">ROI</span>
                    <span class="metric-value">120%</span>
                  </div>
                  <div class="scenario-metric">
                    <span class="metric-label">Payback</span>
                    <span class="metric-value">10.5 months</span>
                  </div>
                </div>
              </div>
              
              <div class="roi-scenario">
                <h4>Expected Scenario</h4>
                <div class="scenario-metrics">
                  <div class="scenario-metric">
                    <span class="metric-label">ROI</span>
                    <span class="metric-value">157%</span>
                  </div>
                  <div class="scenario-metric">
                    <span class="metric-label">Payback</span>
                    <span class="metric-value">8.3 months</span>
                  </div>
                </div>
              </div>
              
              <div class="roi-scenario">
                <h4>Optimistic Scenario</h4>
                <div class="scenario-metrics">
                  <div class="scenario-metric">
                    <span class="metric-label">ROI</span>
                    <span class="metric-value">195%</span>
                  </div>
                  <div class="scenario-metric">
                    <span class="metric-label">Payback</span>
                    <span class="metric-value">6.8 months</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="result-card">
        <h3>Additional Financial Benefits</h3>
        <div class="additional-benefits">
          <div class="benefit-item">
            <h4>Security Incident Cost Avoidance</h4>
            <p>Enhanced security capabilities are estimated to reduce the likelihood of security incidents by 40%, with an average incident cost of $150,000, resulting in potential annual savings of $60,000.</p>
          </div>
          
          <div class="benefit-item">
            <h4>Compliance Audit Efficiency</h4>
            <p>Automated compliance monitoring and reporting reduces audit preparation time by 70%, saving approximately 120 person-hours annually at an average cost of $85/hour, resulting in $10,200 annual savings.</p>
          </div>
          
          <div class="benefit-item">
            <h4>Operational Efficiency Gains</h4>
            <p>Streamlined device onboarding and automated remediation reduce IT helpdesk tickets by an estimated 30%, saving 250 hours annually at an average cost of $45/hour, resulting in $11,250 annual savings.</p>
          </div>
          
          <div class="benefit-item">
            <h4>Business Continuity Benefits</h4>
            <p>Reduced network downtime due to faster recovery capabilities saves an estimated 6 hours of business disruption annually at an average cost of $5,000/hour, resulting in $30,000 annual savings.</p>
          </div>
        </div>
      </div>
    `;
    
    // Set the content
    tabPane.innerHTML = financialContent;
    
    // Initialize charts
    setTimeout(initializeFinancialCharts, 500);
  }
  
  // Initialize Financial View charts
  function initializeFinancialCharts() {
    // Financial summary chart
    const summaryChartCanvas = document.getElementById('financial-summary-chart');
    if (summaryChartCanvas && typeof Chart !== 'undefined') {
      new Chart(summaryChartCanvas, {
        type: 'bar',
        data: {
          labels: ['Current Solution', 'Portnox Cloud', 'Savings'],
          datasets: [{
            label: '3-Year TCO ($)',
            data: [513000, 225000, 288000],
            backgroundColor: ['#05547C', '#65BD44', '#4BC0C0']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
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
          },
          scales: {
            y: {
              beginAtZero: true,
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
    
    // Direct cost chart
    const directCostChartCanvas = document.getElementById('direct-cost-chart');
    if (directCostChartCanvas && typeof Chart !== 'undefined') {
      new Chart(directCostChartCanvas, {
        type: 'bar',
        data: {
          labels: ['Hardware', 'Software/Licensing', 'Maintenance & Support', 'Hardware Refresh'],
          datasets: [
            {
              label: 'Current Solution',
              data: [80000, 120000, 60000, 40000],
              backgroundColor: '#05547C'
            },
            {
              label: 'Portnox Cloud',
              data: [0, 150000, 0, 0],
              backgroundColor: '#65BD44'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
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
                text: 'Cost ($)'
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
    
    // Indirect cost chart
    const indirectCostChartCanvas = document.getElementById('indirect-cost-chart');
    if (indirectCostChartCanvas && typeof Chart !== 'undefined') {
      new Chart(indirectCostChartCanvas, {
        type: 'bar',
        data: {
          labels: ['Implementation', 'IT Resources', 'Training', 'Infrastructure', 'Facilities'],
          datasets: [
            {
              label: 'Current Solution',
              data: [50000, 90000, 10000, 10000, 23000],
              backgroundColor: '#05547C'
            },
            {
              label: 'Portnox Cloud',
              data: [15000, 50000, 5000, 0, 0],
              backgroundColor: '#65BD44'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
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
                text: 'Cost ($)'
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
    
    // Cash flow chart
    const cashFlowChartCanvas = document.getElementById('cash-flow-chart');
    if (cashFlowChartCanvas && typeof Chart !== 'undefined') {
      new Chart(cashFlowChartCanvas, {
        type: 'line',
        data: {
          labels: ['Initial', 'Month 3', 'Month 6', 'Month 9', 'Month 12', 'Month 15', 'Month 18', 'Month 21', 'Month 24', 'Month 27', 'Month 30', 'Month 33', 'Month 36'],
          datasets: [
            {
              label: 'Cumulative Cash Flow',
              data: [-180000, -150000, -120000, -90000, -60000, -30000, 0, 30000, 60000, 120000, 180000, 240000, 288000],
              borderColor: '#65BD44',
              backgroundColor: 'rgba(101, 189, 68, 0.1)',
              fill: true,
              tension: 0.3
            },
            {
              label: 'Break-Even Point',
              data: [null, null, null, null, null, null, 0, null, null, null, null, null, null],
              pointBackgroundColor: '#FF6384',
              pointBorderColor: '#FF6384',
              pointRadius: 6,
              pointHoverRadius: 8,
              showLine: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  if (context.dataset.label === 'Break-Even Point') {
                    return 'Break-Even Point: Month 18';
                  }
                  return context.dataset.label + ': $' + context.raw.toLocaleString();
                }
              }
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Cumulative Cash Flow ($)'
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
    
    // Break-even chart
    const breakEvenChartCanvas = document.getElementById('break-even-chart');
    if (breakEvenChartCanvas && typeof Chart !== 'undefined') {
      new Chart(breakEvenChartCanvas, {
        type: 'line',
        data: {
          labels: ['Month 0', 'Month 3', 'Month 6', 'Month 9', 'Month 12', 'Month 15', 'Month 18', 'Month 21', 'Month 24'],
          datasets: [
            {
              label: 'Current Solution',
              data: [0, 42750, 85500, 128250, 171000, 213750, 256500, 299250, 342000],
              borderColor: '#05547C',
              backgroundColor: 'transparent',
              borderWidth: 2
            },
            {
              label: 'Portnox Cloud',
              data: [170000, 176875, 183750, 190625, 197500, 204375, 211250, 218125, 225000],
              borderColor: '#65BD44',
              backgroundColor: 'transparent',
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': $' + context.raw.toLocaleString();
                }
              }
            },
            annotation: {
              annotations: {
                breakEvenPoint: {
                  type: 'point',
                  xValue: 'Month 18',
                  yValue: 211250,
                  backgroundColor: '#FF6384',
                  radius: 6
                },
                breakEvenLine: {
                  type: 'line',
                  xMin: 'Month 0',
                  xMax: 'Month 18',
                  yMin: 211250,
                  yMax: 211250,
                  borderColor: '#FF6384',
                  borderWidth: 1,
                  borderDash: [5, 5]
                }
              }
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Cumulative Cost ($)'
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
  }
  
  // Add CSS for Financial View
  function addFinancialViewStyles() {
    // Check if styles already exist
    if (document.getElementById('financial-view-styles')) return;
    
    // Create style element
    const style = document.createElement('style');
    style.id = 'financial-view-styles';
    
    // Add CSS
    style.textContent = `
      /* Financial Summary */
      .financial-summary {
        display: grid;
        grid-template-columns: minmax(300px, 1fr) 2fr;
        gap: 20px;
      }
      
      .summary-metrics {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
      }
      
      .metric-item {
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
      }
      
      .metric-label {
        color: #666;
        font-size: 0.9rem;
        margin-bottom: 5px;
      }
      
      .metric-value {
        color: #05547C;
        font-weight: 600;
        font-size: 1.3rem;
      }
      
      /* Table styling */
      .data-table .total-row {
        background-color: #f8f9fa;
        font-weight: 600;
      }
      
      .data-table .total-row td {
        border-top: 2px solid #ddd;
      }
      
      /* Risk-adjusted ROI */
      .risk-adjusted-roi {
        padding: 15px;
      }
      
      .risk-adjusted-roi p {
        margin-top: 0;
        margin-bottom: 20px;
        color: #666;
      }
      
      .roi-scenarios {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
      }
      
      .roi-scenario {
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
      }
      
      .roi-scenario h4 {
        margin-top: 0;
        margin-bottom: 15px;
        color: #05547C;
        font-size: 1.1rem;
        text-align: center;
      }
      
      .scenario-metrics {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }
      
      .scenario-metric {
        text-align: center;
      }
      
      .scenario-metric .metric-label {
        font-size: 0.85rem;
      }
      
      .scenario-metric .metric-value {
        font-size: 1.2rem;
      }
      
      /* Additional benefits */
      .additional-benefits {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }
      
      .benefit-item {
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
      }
      
      .benefit-item h4 {
        margin-top: 0;
        margin-bottom: 10px;
        color: #05547C;
        font-size: 1.1rem;
      }
      
      .benefit-item p {
        margin: 0;
        color: #666;
        font-size: 0.95rem;
      }
      
      /* Responsive adjustments */
      @media (max-width: 992px) {
        .financial-summary {
          grid-template-columns: 1fr;
        }
        
        .roi-scenarios {
          grid-template-columns: 1fr;
        }
      }
      
      @media (max-width: 768px) {
        .summary-metrics {
          grid-template-columns: 1fr;
        }
        
        .additional-benefits {
          grid-template-columns: 1fr;
        }
      }
    `;
    
    // Add to document
    document.head.appendChild(style);
  }
  
  // Add Financial View styles
  addFinancialViewStyles();
})();
