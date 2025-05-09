/**
 * Security View
 * Provides detailed security analysis and comparison
 */
(function() {
  console.log("Initializing Security View");
  
  // Execute when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Wait for the tabs to be available
    waitForElement('.tabs', addSecurityView);
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
  
  // Add Security View tab
  function addSecurityView() {
    console.log("Adding Security View");
    
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
    if (document.getElementById('tab-security')) {
      console.log("Security View tab already exists");
      return;
    }
    
    // Add Security tab button
    const securityTabButton = document.createElement('button');
    securityTabButton.id = 'tab-security';
    securityTabButton.className = 'tab-button';
    securityTabButton.setAttribute('data-tab', 'security-tab');
    securityTabButton.setAttribute('role', 'tab');
    securityTabButton.setAttribute('aria-selected', 'false');
    securityTabButton.textContent = 'Security Analysis';
    
    // Insert after Breach tab if exists, otherwise after Comparison tab
    const breachTab = document.getElementById('tab-breach');
    const comparisonTab = document.getElementById('tab-comparison');
    if (breachTab) {
      tabsContainer.insertBefore(securityTabButton, breachTab.nextSibling);
    } else if (comparisonTab) {
      tabsContainer.insertBefore(securityTabButton, comparisonTab.nextSibling);
    } else {
      tabsContainer.appendChild(securityTabButton);
    }
    
    // Create Security tab pane
    const securityTabPane = document.createElement('div');
    securityTabPane.id = 'security-tab';
    securityTabPane.className = 'tab-pane';
    securityTabPane.setAttribute('role', 'tabpanel');
    securityTabPane.setAttribute('aria-labelledby', 'tab-security');
    tabContent.appendChild(securityTabPane);
    
    // Add Security View content
    populateSecurityView(securityTabPane);
    
    // Add tab click event
    securityTabButton.addEventListener('click', function() {
      // Update button states
      tabsContainer.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      securityTabButton.classList.add('active');
      securityTabButton.setAttribute('aria-selected', 'true');
      
      // Update tab pane visibility
      tabContent.querySelectorAll('.tab-pane').forEach(pane => {
        if (pane.id === 'security-tab') {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
    
    console.log("Security View tab added");
  }
  
  // Populate Security View with content
  function populateSecurityView(tabPane) {
    console.log("Populating Security View");
    
    // Security content
    const securityContent = `
      <div class="result-card">
        <h3>Security Capabilities Comparison</h3>
        <div class="chart-container">
          <canvas id="security-capabilities-chart"></canvas>
        </div>
      </div>
      
      <div class="results-grid">
        <div class="result-card">
          <h3>Risk Reduction</h3>
          <div class="chart-container">
            <canvas id="risk-reduction-chart"></canvas>
          </div>
        </div>
        
        <div class="result-card">
          <h3>Threat Protection Coverage</h3>
          <div class="chart-container">
            <canvas id="threat-protection-chart"></canvas>
          </div>
        </div>
      </div>
      
      <div class="result-card">
        <h3>Security Capabilities Detail</h3>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Capability</th>
                <th>Current Solution</th>
                <th>Portnox Cloud</th>
                <th>Security Impact</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Device Authentication</td>
                <td>802.1X, MAC Authentication</td>
                <td>802.1X, Certificate-based, MAC Authentication, Risk-based</td>
                <td class="security-impact high">High</td>
              </tr>
              <tr>
                <td>Device Visibility</td>
                <td>Limited fingerprinting, manual classification</td>
                <td>AI-powered fingerprinting, continuous visibility, 260,000+ device profiles</td>
                <td class="security-impact very-high">Very High</td>
              </tr>
              <tr>
                <td>Access Control Enforcement</td>
                <td>Static policies based on user/device</td>
                <td>Dynamic policies based on user, device, location, time, behavior, and risk</td>
                <td class="security-impact high">High</td>
              </tr>
              <tr>
                <td>Risk Assessment</td>
                <td>Point-in-time assessment during connection</td>
                <td>Continuous assessment throughout session with automated remediation</td>
                <td class="security-impact very-high">Very High</td>
              </tr>
              <tr>
                <td>Network Segmentation</td>
                <td>Static VLAN assignment</td>
                <td>Dynamic micro-segmentation based on identity and context</td>
                <td class="security-impact high">High</td>
              </tr>
              <tr>
                <td>Guest Network Security</td>
                <td>Basic captive portal</td>
                <td>Advanced guest access with self-registration, social login, and sponsor approval</td>
                <td class="security-impact medium">Medium</td>
              </tr>
              <tr>
                <td>Posture Assessment</td>
                <td>Limited OS and patch checks</td>
                <td>Comprehensive posture checks including endpoint security tools, encryption, and patch status</td>
                <td class="security-impact high">High</td>
              </tr>
              <tr>
                <td>Threat Detection</td>
                <td>Basic anomaly detection</td>
                <td>Advanced behavioral analytics and integration with threat intelligence</td>
                <td class="security-impact high">High</td>
              </tr>
              <tr>
                <td>Automated Response</td>
                <td>Manual remediation workflows</td>
                <td>Automated quarantine, remediation, and notification</td>
                <td class="security-impact very-high">Very High</td>
              </tr>
              <tr>
                <td>Vulnerability Management</td>
                <td>Limited integration with vulnerability scanners</td>
                <td>Continuous vulnerability monitoring with risk-based access policies</td>
                <td class="security-impact high">High</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="result-card">
        <h3>Zero Trust Implementation</h3>
        <div class="zero-trust-assessment">
          <p class="zero-trust-intro">Zero Trust is a security framework requiring all users and devices to be authenticated, authorized, and continuously validated before granting access to applications and data. Below is a comparison of how each solution supports Zero Trust principles.</p>
          
          <div class="zero-trust-grid">
            <div class="zero-trust-principle">
              <h4>Verify Explicitly</h4>
              <div class="principle-comparison">
                <div class="current-solution">
                  <h5>Current Solution</h5>
                  <p>Initial authentication at connection with limited ongoing verification</p>
                  <div class="implementation-level">
                    <div class="level-bar">
                      <div class="level-fill" style="width: 50%"></div>
                    </div>
                    <div class="level-text">Partial Implementation</div>
                  </div>
                </div>
                <div class="portnox-solution">
                  <h5>Portnox Cloud</h5>
                  <p>Continuous authentication and authorization with multiple factors</p>
                  <div class="implementation-level">
                    <div class="level-bar">
                      <div class="level-fill" style="width: 90%"></div>
                    </div>
                    <div class="level-text">Strong Implementation</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="zero-trust-principle">
              <h4>Least Privilege Access</h4>
              <div class="principle-comparison">
                <div class="current-solution">
                  <h5>Current Solution</h5>
                  <p>Role-based access with limited granularity</p>
                  <div class="implementation-level">
                    <div class="level-bar">
                      <div class="level-fill" style="width: 60%"></div>
                    </div>
                    <div class="level-text">Partial Implementation</div>
                  </div>
                </div>
                <div class="portnox-solution">
                  <h5>Portnox Cloud</h5>
                  <p>Granular, context-aware access controls with dynamic adaptation</p>
                  <div class="implementation-level">
                    <div class="level-bar">
                      <div class="level-fill" style="width: 95%"></div>
                    </div>
                    <div class="level-text">Strong Implementation</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="zero-trust-principle">
              <h4>Assume Breach</h4>
              <div class="principle-comparison">
                <div class="current-solution">
                  <h5>Current Solution</h5>
                  <p>Limited continuous monitoring and segmentation</p>
                  <div class="implementation-level">
                    <div class="level-bar">
                      <div class="level-fill" style="width: 40%"></div>
                    </div>
                    <div class="level-text">Basic Implementation</div>
                  </div>
                </div>
                <div class="portnox-solution">
                  <h5>Portnox Cloud</h5>
                  <p>Continuous monitoring, micro-segmentation, and automated response</p>
                  <div class="implementation-level">
                    <div class="level-bar">
                      <div class="level-fill" style="width: 85%"></div>
                    </div>
                    <div class="level-text">Strong Implementation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="result-card">
        <h3>Security Incident Response</h3>
        <div class="incident-response-comparison">
          <p class="incident-intro">Network security incidents require rapid detection and response to minimize impact. Below is a comparison of security incident response capabilities.</p>
          
          <div class="incident-timeline-container">
            <div class="incident-timeline">
              <div class="timeline-event detection">
                <div class="event-time">T+0</div>
                <div class="event-content">
                  <h4>Detection</h4>
                  <div class="event-comparison">
                    <div class="current-solution">
                      <h5>Current Solution</h5>
                      <p>Detection through periodic scans or manual reports</p>
                      <div class="event-time-metric">
                        <span class="metric-label">Avg. Time:</span>
                        <span class="metric-value">8-24 hours</span>
                      </div>
                    </div>
                    <div class="portnox-solution">
                      <h5>Portnox Cloud</h5>
                      <p>Real-time detection through continuous monitoring</p>
                      <div class="event-time-metric">
                        <span class="metric-label">Avg. Time:</span>
                        <span class="metric-value">Minutes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="timeline-event containment">
                <div class="event-time">T+1</div>
                <div class="event-content">
                  <h4>Containment</h4>
                  <div class="event-comparison">
                    <div class="current-solution">
                      <h5>Current Solution</h5>
                      <p>Manual quarantine actions after analysis</p>
                      <div class="event-time-metric">
                        <span class="metric-label">Avg. Time:</span>
                        <span class="metric-value">2-8 hours</span>
                      </div>
                    </div>
                    <div class="portnox-solution">
                      <h5>Portnox Cloud</h5>
                      <p>Automatic quarantine based on risk assessment</p>
                      <div class="event-time-metric">
                        <span class="metric-label">Avg. Time:</span>
                        <span class="metric-value">Seconds</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="timeline-event remediation">
                <div class="event-time">T+2</div>
                <div class="event-content">
                  <h4>Remediation</h4>
                  <div class="event-comparison">
                    <div class="current-solution">
                      <h5>Current Solution</h5>
                      <p>Manual remediation processes</p>
                      <div class="event-time-metric">
                        <span class="metric-label">Avg. Time:</span>
                        <span class="metric-value">4-24 hours</span>
                      </div>
                    </div>
                    <div class="portnox-solution">
                      <h5>Portnox Cloud</h5>
                      <p>Guided or automated remediation</p>
                      <div class="event-time-metric">
                        <span class="metric-label">Avg. Time:</span>
                        <span class="metric-value">30 min - 2 hours</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="timeline-event recovery">
                <div class="event-time">T+3</div>
                <div class="event-content">
                  <h4>Recovery</h4>
                  <div class="event-comparison">
                    <div class="current-solution">
                      <h5>Current Solution</h5>
                      <p>Manual verification and network restoration</p>
                      <div class="event-time-metric">
                        <span class="metric-label">Avg. Time:</span>
                        <span class="metric-value">2-8 hours</span>
                      </div>
                    </div>
                    <div class="portnox-solution">
                      <h5>Portnox Cloud</h5>
                      <p>Automated verification and access restoration</p>
                      <div class="event-time-metric">
                        <span class="metric-label">Avg. Time:</span>
                        <span class="metric-value">Minutes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="incident-summary">
              <div class="current-solution">
                <h5>Current Solution</h5>
                <div class="time-metric">
                  <span class="metric-label">Total Resolution Time:</span>
                  <span class="metric-value">16-64 hours</span>
                </div>
              </div>
              <div class="portnox-solution">
                <h5>Portnox Cloud</h5>
                <div class="time-metric">
                  <span class="metric-label">Total Resolution Time:</span>
                  <span class="metric-value">1-3 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Set the content
    tabPane.innerHTML = securityContent;
    
    // Initialize charts
    setTimeout(initializeSecurityCharts, 500);
  }
  
  // Initialize Security View charts
  function initializeSecurityCharts() {
    // Security capabilities chart
    const capabilitiesChartCanvas = document.getElementById('security-capabilities-chart');
    if (capabilitiesChartCanvas && typeof Chart !== 'undefined') {
      new Chart(capabilitiesChartCanvas, {
        type: 'radar',
        data: {
          labels: [
            'Authentication Strength',
            'Device Visibility',
            'Access Control',
            'Risk Assessment',
            'Network Segmentation',
            'Posture Assessment',
            'Threat Detection',
            'Automated Response',
            'Scalability'
          ],
          datasets: [
            {
              label: 'Current Solution',
              data: [70, 60, 75, 50, 65, 55, 60, 45, 50],
              backgroundColor: 'rgba(5, 84, 124, 0.2)',
              borderColor: '#05547C',
              pointBackgroundColor: '#05547C'
            },
            {
              label: 'Portnox Cloud',
              data: [90, 95, 85, 90, 80, 85, 80, 90, 95],
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
              min: 0,
              max: 100,
              ticks: {
                stepSize: 20
              },
              pointLabels: {
                font: {
                  size: 12
                }
              }
            }
          }
        }
      });
    }
    
    // Risk reduction chart
    const riskChartCanvas = document.getElementById('risk-reduction-chart');
    if (riskChartCanvas && typeof Chart !== 'undefined') {
      new Chart(riskChartCanvas, {
        type: 'bar',
        data: {
          labels: ['Unauthorized Access', 'Data Breaches', 'Malware/Ransomware', 'Insider Threats', 'Non-compliant Devices'],
          datasets: [
            {
              label: 'Risk Reduction (%)',
              data: [65, 55, 45, 40, 70],
              backgroundColor: '#65BD44'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return 'Risk Reduction: ' + context.raw + '%';
                }
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Risk Reduction (%)'
              }
            }
          }
        }
      });
    }
    
    // Threat protection chart
    const threatChartCanvas = document.getElementById('threat-protection-chart');
    if (threatChartCanvas && typeof Chart !== 'undefined') {
      new Chart(threatChartCanvas, {
        type: 'doughnut',
        data: {
          labels: ['Fully Protected', 'Partially Protected', 'Minimal Protection'],
          datasets: [
            {
              data: [65, 25, 10],
              backgroundColor: ['#65BD44', '#FFC107', '#DC3545']
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.label + ': ' + context.raw + '%';
                }
              }
            }
          }
        }
      });
    }
  }
  
  // Add CSS for Security View
  function addSecurityViewStyles() {
    // Check if styles already exist
    if (document.getElementById('security-view-styles')) return;
    
    // Create style element
    const style = document.createElement('style');
    style.id = 'security-view-styles';
    
    // Add CSS
    style.textContent = `
      /* Security impact indicators */
      .security-impact {
        font-weight: 600;
        padding: 4px 8px;
        border-radius: 4px;
        text-align: center;
      }
      
      .security-impact.very-high {
        background-color: #d4edda;
        color: #155724;
      }
      
      .security-impact.high {
        background-color: #d1ecf1;
        color: #0c5460;
      }
      
      .security-impact.medium {
        background-color: #fff3cd;
        color: #856404;
      }
      
      .security-impact.low {
        background-color: #f8d7da;
        color: #721c24;
      }
      
      /* Zero Trust Assessment */
      .zero-trust-intro {
        margin-top: 0;
        margin-bottom: 20px;
        color: #666;
      }
      
      .zero-trust-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }
      
      .zero-trust-principle {
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
      }
      
      .zero-trust-principle h4 {
        margin-top: 0;
        margin-bottom: 15px;
        color: #05547C;
        font-size: 1.1rem;
        text-align: center;
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
      }
      
      .principle-comparison {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
      }
      
      .current-solution, .portnox-solution {
        padding: 10px;
        border-radius: 4px;
      }
      
      .current-solution {
        background-color: rgba(5, 84, 124, 0.05);
      }
      
      .portnox-solution {
        background-color: rgba(101, 189, 68, 0.05);
      }
      
      .current-solution h5, .portnox-solution h5 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 1rem;
        text-align: center;
      }
      
      .current-solution p, .portnox-solution p {
        margin: 0 0 10px 0;
        font-size: 0.9rem;
        color: #666;
      }
      
      .implementation-level {
        margin-top: 10px;
      }
      
      .level-bar {
        height: 8px;
        background-color: #e0e0e0;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 5px;
      }
      
      .level-fill {
        height: 100%;
        background-color: #05547C;
        border-radius: 4px;
      }
      
      .portnox-solution .level-fill {
        background-color: #65BD44;
      }
      
      .level-text {
        font-size: 0.8rem;
        color: #666;
        text-align: center;
      }
      
      /* Incident Response */
      .incident-intro {
        margin-top: 0;
        margin-bottom: 20px;
        color: #666;
      }
      
      .incident-timeline-container {
        padding: 20px 0;
      }
      
      .incident-timeline {
        position: relative;
        margin-bottom: 30px;
      }
      
      .incident-timeline::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 60px;
        width: 2px;
        background-color: #ddd;
      }
      
      .timeline-event {
        display: flex;
        margin-bottom: 30px;
        position: relative;
      }
      
      .event-time {
        width: 60px;
        text-align: center;
        font-weight: 600;
        color: #05547C;
        margin-right: 20px;
      }
      
      .event-content {
        flex: 1;
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        position: relative;
      }
      
      .event-content::before {
        content: '';
        position: absolute;
        left: -8px;
        top: 15px;
        width: 16px;
        height: 16px;
        background-color: #05547C;
        border-radius: 50%;
      }
      
      .event-content h4 {
        margin-top: 0;
        margin-bottom: 15px;
        color: #05547C;
        font-size: 1.1rem;
      }
      
      .event-comparison {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
      }
      
      .event-time-metric {
        margin-top: 10px;
        font-size: 0.9rem;
      }
      
      .event-time-metric .metric-label {
        color: #666;
      }
      
      .event-time-metric .metric-value {
        font-weight: 600;
        color: #05547C;
      }
      
      .portnox-solution .event-time-metric .metric-value {
        color: #65BD44;
      }
      
      .incident-summary {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-top: 20px;
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
      }
      
      .time-metric {
        text-align: center;
      }
      
      .time-metric .metric-label {
        display: block;
        margin-bottom: 5px;
        color: #666;
      }
      
      .time-metric .metric-value {
        font-size: 1.2rem;
        font-weight: 600;
        color: #05547C;
      }
      
      .portnox-solution .time-metric .metric-value {
        color: #65BD44;
      }
      
      /* Responsive adjustments */
      @media (max-width: 992px) {
        .principle-comparison, .event-comparison, .incident-summary {
          grid-template-columns: 1fr;
        }
      }
    `;
    
    // Add to document
    document.head.appendChild(style);
  }
  
  // Add Security View styles
  addSecurityViewStyles();
})();
