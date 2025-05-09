/**
 * Executive View
 * Provides executive-level summary and visualizations
 */
(function() {
  console.log("Initializing Executive View");
  
  // Execute when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Wait for the tabs to be available
    waitForElement('.tabs', addExecutiveView);
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
  
  // Add Executive View tab
  function addExecutiveView() {
    console.log("Adding Executive View");
    
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
    if (document.getElementById('tab-executive')) {
      console.log("Executive View tab already exists");
      return;
    }
    
    // Add Executive tab button
    const executiveTabButton = document.createElement('button');
    executiveTabButton.id = 'tab-executive';
    executiveTabButton.className = 'tab-button';
    executiveTabButton.setAttribute('data-tab', 'executive-tab');
    executiveTabButton.setAttribute('role', 'tab');
    executiveTabButton.setAttribute('aria-selected', 'false');
    executiveTabButton.textContent = 'Executive Summary';
    
    // Insert after Comparison tab
    const comparisonTab = document.getElementById('tab-comparison');
    if (comparisonTab) {
      tabsContainer.insertBefore(executiveTabButton, comparisonTab.nextSibling);
    } else {
      tabsContainer.appendChild(executiveTabButton);
    }
    
    // Create Executive tab pane
    const executiveTabPane = document.createElement('div');
    executiveTabPane.id = 'executive-tab';
    executiveTabPane.className = 'tab-pane';
    executiveTabPane.setAttribute('role', 'tabpanel');
    executiveTabPane.setAttribute('aria-labelledby', 'tab-executive');
    tabContent.appendChild(executiveTabPane);
    
    // Add Executive View content
    populateExecutiveView(executiveTabPane);
    
    // Add tab click event
    executiveTabButton.addEventListener('click', function() {
      // Update button states
      tabsContainer.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      executiveTabButton.classList.add('active');
      executiveTabButton.setAttribute('aria-selected', 'true');
      
      // Update tab pane visibility
      tabContent.querySelectorAll('.tab-pane').forEach(pane => {
        if (pane.id === 'executive-tab') {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
    
    console.log("Executive View tab added");
  }
  
  // Populate Executive View with content
  function populateExecutiveView(tabPane) {
    console.log("Populating Executive View");
    
    // Executive content
    const executiveContent = `
      <div class="executive-summary-card">
        <h3>Executive Summary</h3>
        <div class="summary-content">
          <p class="summary-intro">This analysis compares the Total Cost of Ownership (TCO) and operational impact of your current NAC solution with Portnox Cloud, a cloud-native Network Access Control platform.</p>
          
          <div class="key-findings">
            <h4>Key Findings</h4>
            <div class="findings-grid">
              <div class="finding-item">
                <div class="finding-icon"><i class="fas fa-dollar-sign"></i></div>
                <div class="finding-content">
                  <div class="finding-title">3-Year TCO Savings</div>
                  <div class="finding-value" id="exec-tco-savings">$180,000 (42%)</div>
                  <div class="finding-description">Reduction in total cost compared to current solution</div>
                </div>
              </div>
              
              <div class="finding-item">
                <div class="finding-icon"><i class="fas fa-clock"></i></div>
                <div class="finding-content">
                  <div class="finding-title">Implementation Time</div>
                  <div class="finding-value" id="exec-implementation-time">85% Reduction</div>
                  <div class="finding-description">From months to days compared to traditional NAC</div>
                </div>
              </div>
              
              <div class="finding-item">
                <div class="finding-icon"><i class="fas fa-server"></i></div>
                <div class="finding-content">
                  <div class="finding-title">Infrastructure Savings</div>
                  <div class="finding-value" id="exec-infrastructure-savings">100%</div>
                  <div class="finding-description">No hardware requirements vs. traditional NAC</div>
                </div>
              </div>
              
              <div class="finding-item">
                <div class="finding-icon"><i class="fas fa-user-tie"></i></div>
                <div class="finding-content">
                  <div class="finding-title">IT Resource Efficiency</div>
                  <div class="finding-value" id="exec-resource-efficiency">75%</div>
                  <div class="finding-description">Reduction in management overhead</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="results-grid">
        <div class="result-card">
          <h3>Cost Comparison Summary</h3>
          <div class="chart-container">
            <canvas id="executive-cost-chart"></canvas>
          </div>
        </div>
        
        <div class="result-card">
          <h3>Operational Impact</h3>
          <div class="chart-container">
            <canvas id="executive-impact-chart"></canvas>
          </div>
        </div>
      </div>
      
      <div class="result-card">
        <h3>Strategic Benefits</h3>
        <div class="strategic-benefits-grid">
          <div class="benefit-item">
            <div class="benefit-icon"><i class="fas fa-shield-alt"></i></div>
            <div class="benefit-content">
              <h4>Enhanced Security Posture</h4>
              <p>Continuous monitoring and verification of all devices with automatic remediation of security issues reduces the risk of breaches by up to 60%.</p>
            </div>
          </div>
          
          <div class="benefit-item">
            <div class="benefit-icon"><i class="fas fa-tasks"></i></div>
            <div class="benefit-content">
              <h4>Operational Efficiency</h4>
              <p>Cloud-native architecture eliminates hardware management, reduces deployment time by 85%, and simplifies policy administration across all locations.</p>
            </div>
          </div>
          
          <div class="benefit-item">
            <div class="benefit-icon"><i class="fas fa-chart-line"></i></div>
            <div class="benefit-content">
              <h4>Scalability & Flexibility</h4>
              <p>Automatically scales to meet changing device needs without additional hardware purchases, supporting remote and hybrid work environments.</p>
            </div>
          </div>
          
          <div class="benefit-item">
            <div class="benefit-icon"><i class="fas fa-file-contract"></i></div>
            <div class="benefit-content">
              <h4>Simplified Compliance</h4>
              <p>Continuous compliance monitoring with automated reporting reduces audit preparation time by 70% and provides real-time visibility into compliance status.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="result-card">
        <h3>Implementation Roadmap</h3>
        <div class="implementation-timeline">
          <div class="timeline-phase">
            <div class="phase-marker">1</div>
            <div class="phase-content">
              <h4>Assessment & Planning</h4>
              <p class="phase-description">Evaluate current environment, define requirements, and develop migration strategy.</p>
              <p class="phase-duration">Duration: 1-2 days</p>
            </div>
          </div>
          
          <div class="timeline-phase">
            <div class="phase-marker">2</div>
            <div class="phase-content">
              <h4>Pilot Deployment</h4>
              <p class="phase-description">Implement in limited environment to validate configuration and train administrators.</p>
              <p class="phase-duration">Duration: 1-3 days</p>
            </div>
          </div>
          
          <div class="timeline-phase">
            <div class="phase-marker">3</div>
            <div class="phase-content">
              <h4>Phased Rollout</h4>
              <p class="phase-description">Expand deployment across organization in controlled phases with monitoring.</p>
              <p class="phase-duration">Duration: 2-5 days</p>
            </div>
          </div>
          
          <div class="timeline-phase">
            <div class="phase-marker">4</div>
            <div class="phase-content">
              <h4>Optimization</h4>
              <p class="phase-description">Fine-tune policies, integrate with existing security tools, and implement advanced features.</p>
              <p class="phase-duration">Duration: Ongoing</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="result-card">
        <h3>Recommendation</h3>
        <p class="recommendation-text">Based on the comprehensive analysis of costs, operational efficiency, security impact, and compliance benefits, we recommend transitioning from your current NAC solution to Portnox Cloud. This cloud-native approach delivers significant cost savings while enhancing security capabilities and reducing administrative overhead.</p>
        
        <div class="next-steps">
          <h4>Recommended Next Steps</h4>
          <ol>
            <li>Schedule a technical demonstration to evaluate Portnox Cloud's capabilities in your environment</li>
            <li>Develop a detailed migration plan with phased implementation approach</li>
            <li>Identify initial deployment scope for pilot implementation</li>
            <li>Review and update network security policies to leverage cloud-native capabilities</li>
          </ol>
        </div>
      </div>
    `;
    
    // Set the content
    tabPane.innerHTML = executiveContent;
    
    // Initialize charts
    setTimeout(initializeExecutiveCharts, 500);
  }
  
  // Initialize Executive View charts
  function initializeExecutiveCharts() {
    // Cost comparison chart
    const costChartCanvas = document.getElementById('executive-cost-chart');
    if (costChartCanvas && typeof Chart !== 'undefined') {
      new Chart(costChartCanvas, {
        type: 'bar',
        data: {
          labels: ['Hardware', 'Software', 'Implementation', 'Maintenance', 'IT Resources', 'Total'],
          datasets: [
            {
              label: 'Current Solution',
              data: [80000, 120000, 60000, 80000, 90000, 430000],
              backgroundColor: '#05547C'
            },
            {
              label: 'Portnox Cloud',
              data: [0, 150000, 20000, 30000, 50000, 250000],
              backgroundColor: '#65BD44'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: '3-Year Total Cost of Ownership'
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
    
    // Operational impact chart
    const impactChartCanvas = document.getElementById('executive-impact-chart');
    if (impactChartCanvas && typeof Chart !== 'undefined') {
      new Chart(impactChartCanvas, {
        type: 'radar',
        data: {
          labels: [
            'Deployment Speed',
            'Operational Efficiency',
            'Scalability',
            'Security Effectiveness',
            'Compliance Automation',
            'Cost Efficiency'
          ],
          datasets: [
            {
              label: 'Current Solution',
              data: [30, 50, 40, 70, 50, 40],
              backgroundColor: 'rgba(5, 84, 124, 0.2)',
              borderColor: '#05547C',
              pointBackgroundColor: '#05547C'
            },
            {
              label: 'Portnox Cloud',
              data: [90, 85, 95, 85, 90, 85],
              backgroundColor: 'rgba(101, 189, 68, 0.2)',
              borderColor: '#65BD44',
              pointBackgroundColor: '#65BD44'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: {
                display: false
              }
            }
          }
        }
      });
    }
  }
  
  // Add CSS for Executive View
  function addExecutiveViewStyles() {
    // Check if styles already exist
    if (document.getElementById('executive-view-styles')) return;
    
    // Create style element
    const style = document.createElement('style');
    style.id = 'executive-view-styles';
    
    // Add CSS
    style.textContent = `
      /* Executive Summary Card */
      .executive-summary-card {
        background-color: #f8f9fa;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
        border-left: 4px solid #05547C;
      }
      
      .summary-intro {
        font-size: 1.1rem;
        margin-bottom: 20px;
        color: #444;
      }
      
      /* Key Findings */
      .key-findings {
        margin-top: 20px;
      }
      
      .key-findings h4 {
        color: #05547C;
        margin-top: 0;
        margin-bottom: 15px;
        font-size: 1.2rem;
      }
      
      .findings-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
      }
      
      .finding-item {
        display: flex;
        gap: 15px;
        background-color: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.05);
      }
      
      .finding-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background-color: #05547C;
        color: white;
        border-radius: 50%;
        flex-shrink: 0;
      }
      
      .finding-content {
        flex: 1;
      }
      
      .finding-title {
        color: #666;
        font-size: 0.9rem;
        margin-bottom: 5px;
      }
      
      .finding-value {
        color: #05547C;
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 5px;
      }
      
      .finding-description {
        color: #888;
        font-size: 0.85rem;
      }
      
      /* Strategic Benefits */
      .strategic-benefits-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }
      
      .benefit-item {
        display: flex;
        gap: 15px;
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
      }
      
      .benefit-icon {
        color: #65BD44;
        font-size: 1.4rem;
        flex-shrink: 0;
      }
      
      .benefit-content {
        flex: 1;
      }
      
      .benefit-content h4 {
        color: #05547C;
        margin-top: 0;
        margin-bottom: 8px;
        font-size: 1.1rem;
      }
      
      .benefit-content p {
        margin: 0;
        color: #666;
        font-size: 0.95rem;
      }
      
      /* Implementation Timeline */
      .implementation-timeline {
        padding: 20px 0;
      }
      
      .timeline-phase {
        display: flex;
        margin-bottom: 30px;
        position: relative;
      }
      
      .timeline-phase:not(:last-child)::after {
        content: '';
        position: absolute;
        top: 40px;
        left: 20px;
        height: calc(100% + 10px);
        width: 2px;
        background-color: #e0e0e0;
      }
      
      .phase-marker {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #65BD44;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        margin-right: 20px;
        z-index: 2;
        flex-shrink: 0;
      }
      
      .phase-content {
        flex: 1;
      }
      
      .phase-content h4 {
        color: #05547C;
        margin-top: 0;
        margin-bottom: 8px;
        font-size: 1.1rem;
      }
      
      .phase-description {
        color: #666;
        margin: 0 0 5px 0;
      }
      
      .phase-duration {
        color: #888;
        font-style: italic;
        margin: 0;
        font-size: 0.9rem;
      }
      
      /* Recommendation */
      .recommendation-text {
        font-size: 1.05rem;
        line-height: 1.5;
        color: #444;
        margin-bottom: 20px;
      }
      
      .next-steps h4 {
        color: #05547C;
        margin-bottom: 10px;
        font-size: 1.1rem;
      }
      
      .next-steps ol {
        margin: 0;
        padding-left: 20px;
      }
      
      .next-steps li {
        margin-bottom: 8px;
        color: #666;
      }
      
      /* Responsive adjustments */
      @media (max-width: 768px) {
        .findings-grid, .strategic-benefits-grid {
          grid-template-columns: 1fr;
        }
      }
    `;
    
    // Add to document
    document.head.appendChild(style);
  }
  
  // Add Executive View styles
  addExecutiveViewStyles();
})();
