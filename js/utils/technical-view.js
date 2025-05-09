/**
 * Technical View
 * Provides detailed technical comparison and architecture information
 */
(function() {
  console.log("Initializing Technical View");
  
  // Execute when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Wait for the tabs to be available
    waitForElement('.tabs', addTechnicalView);
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
  
  // Add Technical View tab
  function addTechnicalView() {
    console.log("Adding Technical View");
    
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
    if (document.getElementById('tab-technical')) {
      console.log("Technical View tab already exists");
      return;
    }
    
    // Add Technical tab button
    const technicalTabButton = document.createElement('button');
    technicalTabButton.id = 'tab-technical';
    technicalTabButton.className = 'tab-button';
    technicalTabButton.setAttribute('data-tab', 'technical-tab');
    technicalTabButton.setAttribute('role', 'tab');
    technicalTabButton.setAttribute('aria-selected', 'false');
    technicalTabButton.textContent = 'Technical Analysis';
    
    // Insert after Security tab if exists, otherwise after Comparison tab
    const securityTab = document.getElementById('tab-security');
    const comparisonTab = document.getElementById('tab-comparison');
    if (securityTab) {
      tabsContainer.insertBefore(technicalTabButton, securityTab.nextSibling);
    } else if (comparisonTab) {
      tabsContainer.insertBefore(technicalTabButton, comparisonTab.nextSibling);
    } else {
      tabsContainer.appendChild(technicalTabButton);
    }
    
    // Create Technical tab pane
    const technicalTabPane = document.createElement('div');
    technicalTabPane.id = 'technical-tab';
    technicalTabPane.className = 'tab-pane';
    technicalTabPane.setAttribute('role', 'tabpanel');
    technicalTabPane.setAttribute('aria-labelledby', 'tab-technical');
    tabContent.appendChild(technicalTabPane);
    
    // Add Technical View content
    populateTechnicalView(technicalTabPane);
    
    // Add tab click event
    technicalTabButton.addEventListener('click', function() {
      // Update button states
      tabsContainer.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      technicalTabButton.classList.add('active');
      technicalTabButton.setAttribute('aria-selected', 'true');
      
      // Update tab pane visibility
      tabContent.querySelectorAll('.tab-pane').forEach(pane => {
        if (pane.id === 'technical-tab') {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
    
    console.log("Technical View tab added");
  }
  
  // Populate Technical View with content
  function populateTechnicalView(tabPane) {
    console.log("Populating Technical View");
    
    // Technical content
    const technicalContent = `
      <div class="result-card">
        <h3>Architecture Comparison</h3>
        <div class="architecture-comparison">
          <div class="architecture-item">
            <h4>Traditional On-Premises NAC</h4>
            <div class="architecture-diagram">
              <img src="img/traditional-nac-architecture.svg" alt="Traditional NAC Architecture Diagram" onerror="this.onerror=null; this.src='data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20width%3D%22500%22%20height%3D%22300%22%20fill%3D%22%23f8f9fa%22%3E%3Crect%20width%3D%22500%22%20height%3D%22300%22%2F%3E%3Ctext%20x%3D%22250%22%20y%3D%22150%22%20font-family%3D%22Arial%22%20font-size%3D%2220%22%20text-anchor%3D%22middle%22%20fill%3D%22%23333%22%3ETraditional%20NAC%20Architecture%3C%2Ftext%3E%3C%2Fsvg%3E'">
            </div>
            <div class="architecture-description">
              <p>Traditional on-premises NAC solutions require dedicated hardware appliances or virtual machines deployed within the organization's data center. These solutions typically require additional infrastructure components such as load balancers, database servers, and high-availability pairs.</p>
              
              <h5>Key Components:</h5>
              <ul>
                <li>Policy servers (primary and secondary)</li>
                <li>Dedicated database servers</li>
                <li>Load balancers for high availability</li>
                <li>Remote enforcement nodes for distributed environments</li>
                <li>Separate management consoles</li>
              </ul>
              
              <h5>Technical Challenges:</h5>
              <ul>
                <li>Complex sizing and capacity planning</li>
                <li>Regular hardware/VM maintenance and updates</li>
                <li>Multi-location deployment complexity</li>
                <li>High availability configuration</li>
                <li>Database management and scaling</li>
              </ul>
            </div>
          </div>
          
          <div class="architecture-item">
            <h4>Portnox Cloud Architecture</h4>
            <div class="architecture-diagram">
              <img src="img/cloud-nac-architecture.svg" alt="Cloud NAC Architecture Diagram" onerror="this.onerror=null; this.src='data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20width%3D%22500%22%20height%3D%22300%22%20fill%3D%22%23f8f9fa%22%3E%3Crect%20width%3D%22500%22%20height%3D%22300%22%2F%3E%3Ctext%20x%3D%22250%22%20y%3D%22150%22%20font-family%3D%22Arial%22%20font-size%3D%2220%22%20text-anchor%3D%22middle%22%20fill%3D%22%23333%22%3ECloud%20NAC%20Architecture%3C%2Ftext%3E%3C%2Fsvg%3E'">
            </div>
            <div class="architecture-description">
              <p>Portnox Cloud is a true cloud-native SaaS solution built from the ground up for cloud delivery. The architecture eliminates on-premises appliances and leverages cloud-native principles for scalability, reliability, and security.</p>
              
              <h5>Key Components:</h5>
              <ul>
                <li>Cloud-based policy and authentication services</li>
                <li>Optional lightweight local RADIUS proxy for offline authentication</li>
                <li>API-driven integration architecture</li>
                <li>Multi-tenant microservices</li>
                <li>Centralized management console</li>
              </ul>
              
              <h5>Technical Advantages:</h5>
              <ul>
                <li>No hardware sizing or capacity planning required</li>
                <li>Automatic scaling based on demand</li>
                <li>Zero maintenance for core components</li>
                <li>Built-in high availability and redundancy</li>
                <li>Global distribution with regional data residency options</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div class="result-card">
        <h3>Integration Capabilities</h3>
        <div class="integrations-grid">
          <div class="integration-category">
            <h4>Identity Providers</h4>
            <div class="integration-comparison">
              <div class="current-solution">
                <h5>Current Solution</h5>
                <ul class="integration-list">
                  <li>Active Directory</li>
                  <li>LDAP</li>
                  <li>Limited SAML support</li>
                  <li>Basic RADIUS server support</li>
                </ul>
              </div>
              <div class="portnox-solution">
                <h5>Portnox Cloud</h5>
                <ul class="integration-list">
                  <li>Active Directory</li>
                  <li>Azure AD / Entra ID</li>
                  <li>Okta</li>
                  <li>Google Workspace</li>
                  <li>SAML 2.0</li>
                  <li>SCIM</li>
                  <li>RADIUS-as-a-Service</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="integration-category">
            <h4>Endpoint Security</h4>
            <div class="integration-comparison">
              <div class="current-solution">
                <h5>Current Solution</h5>
                <ul class="integration-list">
                  <li>Limited MDM integration</li>
                  <li>Basic antivirus checks</li>
                  <li>Custom posture assessment</li>
                </ul>
              </div>
              <div class="portnox-solution">
                <h5>Portnox Cloud</h5>
                <ul class="integration-list">
                  <li>Microsoft Intune</li>
                  <li>VMware Workspace ONE</li>
                  <li>MobileIron</li>
                  <li>Jamf</li>
                  <li>CrowdStrike</li>
                  <li>Carbon Black</li>
                  <li>SentinelOne</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="integration-category">
            <h4>SIEM & Security Analytics</h4>
            <div class="integration-comparison">
              <div class="current-solution">
                <h5>Current Solution</h5>
                <ul class="integration-list">
                  <li>Syslog export</li>
                  <li>SNMP traps</li>
                  <li>Basic API access</li>
                </ul>
              </div>
              <div class="portnox-solution">
                <h5>Portnox Cloud</h5>
                <ul class="integration-list">
                  <li>Splunk</li>
                  <li>Microsoft Sentinel</li>
                  <li>Elastic</li>
                  <li>QRadar</li>
                  <li>LogRhythm</li>
                  <li>Cloud-native logging</li>
                  <li>Comprehensive REST API</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="integration-category">
            <h4>Network Infrastructure</h4>
            <div class="integration-comparison">
              <div class="current-solution">
                <h5>Current Solution</h5>
                <ul class="integration-list">
                  <li>Cisco</li>
                  <li>Aruba</li>
                  <li>Limited multi-vendor</li>
                  <li>Custom integrations</li>
                </ul>
              </div>
              <div class="portnox-solution">
                <h5>Portnox Cloud</h5>
                <ul class="integration-list">
                  <li>Cisco</li>
                  <li>Aruba/HPE</li>
                  <li>Juniper</li>
                  <li>Extreme</li>
                  <li>Ruckus</li>
                  <li>Meraki</li>
                  <li>FortiNet</li>
                  <li>All 802.1X-compatible switches</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="result-card">
        <h3>Technical Specifications</h3>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Specification</th>
                <th>Current Solution</th>
                <th>Portnox Cloud</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Authentication Protocols</td>
                <td>EAP-TLS, PEAP, EAP-TTLS, EAP-FAST</td>
                <td>EAP-TLS, PEAP, EAP-TTLS, EAP-FAST, EAP-PWD</td>
              </tr>
              <tr>
                <td>Authorization Methods</td>
                <td>RADIUS, TACACS+</td>
                <td>RADIUS, TACACS+, OAuth 2.0, SAML 2.0</td>
              </tr>
              <tr>
                <td>Directory Integration</td>
                <td>AD, LDAP</td>
                <td>AD, LDAP, Azure AD, Okta, Google, SCIM</td>
              </tr>
              <tr>
                <td>High Availability</td>
                <td>Active-Passive with manual failover</td>
                <td>Multi-region active-active with automatic failover</td>
              </tr>
              <tr>
                <td>Scalability</td>
                <td>Vertical scaling with hardware upgrades</td>
                <td>Automatic horizontal and vertical scaling</td>
              </tr>
              <tr>
                <td>API Support</td>
                <td>Basic REST API with limited functionality</td>
                <td>Comprehensive REST API with full feature coverage</td>
              </tr>
              <tr>
                <td>Certificate Management</td>
                <td>Basic CA functionality with manual processes</td>
                <td>Built-in cloud CA with automated certificate lifecycle</td>
              </tr>
              <tr>
                <td>Device Profiling</td>
                <td>Rule-based with manual updates</td>
                <td>AI-powered with 260,000+ device profiles and automatic updates</td>
              </tr>
              <tr>
                <td>Network Requirements</td>
                <td>Dedicated VLANs, specialized routing,firewall adjustments</td>
                <td>Standard network configuration, no special requirements</td>
              </tr>
              <tr>
                <td>Offline Support</td>
                <td>Full functionality when disconnected</td>
                <td>Optional local RADIUS proxy for authentication during outages</td>
              </tr>
              <tr>
                <td>Deployment Time</td>
                <td>4-12 weeks typical</td>
                <td>1-2 weeks typical</td>
              </tr>
              <tr>
                <td>Upgrade Process</td>
                <td>Scheduled maintenance windows with downtime</td>
                <td>Automatic updates with zero downtime</td>
              </tr>
              <tr>
                <td>Multi-tenant Support</td>
                <td>Limited, requires separate instances</td>
                <td>Built-in multi-tenant architecture</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="results-grid">
        <div class="result-card">
          <h3>Authentication Performance</h3>
          <div class="chart-container">
            <canvas id="auth-performance-chart"></canvas>
          </div>
        </div>
        
        <div class="result-card">
          <h3>Management Efficiency</h3>
          <div class="chart-container">
            <canvas id="management-efficiency-chart"></canvas>
          </div>
        </div>
      </div>
      
      <div class="result-card">
        <h3>Migration Methodology</h3>
        <div class="migration-methodology">
          <p class="migration-intro">Moving from a traditional NAC to Portnox Cloud can be accomplished with minimal disruption through a phased approach. The methodology outlined below has been successfully used across hundreds of deployments.</p>
          
          <div class="migration-phases">
            <div class="migration-phase">
              <div class="phase-header">
                <div class="phase-number">1</div>
                <h4>Discovery & Assessment</h4>
              </div>
              <div class="phase-content">
                <div class="phase-steps">
                  <div class="phase-step">
                    <div class="step-marker"></div>
                    <div class="step-content">
                      <h5>Network Infrastructure Survey</h5>
                      <p>Document all switch models, versions, and authentication configurations</p>
                    </div>
                  </div>
                  <div class="phase-step">
                    <div class="step-marker"></div>
                    <div class="step-content">
                      <h5>Policy Analysis</h5>
                      <p>Map existing authentication and authorization policies</p>
                    </div>
                  </div>
                  <div class="phase-step">
                    <div class="step-marker"></div>
                    <div class="step-content">
                      <h5>Directory Integration Assessment</h5>
                      <p>Analyze directory structure and integration requirements</p>
                    </div>
                  </div>
                </div>
                <div class="phase-timeline">
                  <div class="timeline-marker">1-3 days</div>
                </div>
              </div>
            </div>
            
            <div class="migration-phase">
              <div class="phase-header">
                <div class="phase-number">2</div>
                <h4>Parallel Deployment</h4>
              </div>
              <div class="phase-content">
                <div class="phase-steps">
                  <div class="phase-step">
                    <div class="step-marker"></div>
                    <div class="step-content">
                      <h5>Portnox Cloud Tenant Provisioning</h5>
                      <p>Establish cloud tenant with initial configuration</p>
                    </div>
                  </div>
                  <div class="phase-step">
                    <div class="step-marker"></div>
                    <div class="step-content">
                      <h5>Directory Connection</h5>
                      <p>Connect to identity providers and synchronize users/groups</p>
                    </div>
                  </div>
                  <div class="phase-step">
                    <div class="step-marker"></div>
                    <div class="step-content">
                      <h5>Policy Migration</h5>
                      <p>Configure equivalent policies in Portnox Cloud</p>
                    </div>
                  </div>
                </div>
                <div class="phase-timeline">
                  <div class="timeline-marker">2-5 days</div>
                </div>
              </div>
            </div>
            
            <div class="migration-phase">
              <div class="phase-header">
                <div class="phase-number">3</div>
                <h4>Pilot Deployment</h4>
              </div>
              <div class="phase-content">
                <div class="phase-steps">
                  <div class="phase-step">
                    <div class="step-marker"></div>
                    <div class="step-content">
                      <h5>Test Environment Setup</h5>
                      <p>Configure limited production devices to authenticate with Portnox Cloud</p>
                    </div>
                  </div>
                  <div class="phase-step">
                    <div class="step-marker"></div>
                    <div class="step-content">
                      <h5>Administrator Training</h5>
                      <p>Train IT staff on Portnox Cloud management and operations</p>
                    </div>
                  </div>
                  <div class="phase-step">
                    <div class="step-marker"></div>
                    <div class="step-content">
                      <h5>Validation & Refinement</h5>
                      <p>Validate functionality and refine policies based on feedback</p>
                    </div>
                  </div>
                </div>
                <div class="phase-timeline">
                  <div class="timeline-marker">1-2 weeks</div>
                </div>
              </div>
            </div>
            
            <div class="migration-phase">
              <div class="phase-header">
                <div class="phase-number">4</div>
                <h4>Phased Migration</h4>
              </div>
              <div class="phase-content">
                <div class="phase-steps">
                  <div class="phase-step">
                    <div class="step-marker"></div>
                    <div class="step-content">
                      <h5>Gradual RADIUS Server Migration</h5>
                      <p>Gradually transition network devices to use Portnox Cloud RADIUS</p>
                    </div>
                  </div>
                  <div class="phase-step">
                    <div class="step-marker"></div>
                    <div class="step-content">
                      <h5>Parallel Operation Period</h5>
                      <p>Operate both solutions in parallel with monitoring</p>
                    </div>
                  </div>
                  <div class="phase-step">
                    <div class="step-marker"></div>
                    <div class="step-content">
                      <h5>Progressive Transition</h5>
                      <p>Location-by-location or network segment migration</p>
                    </div>
                  </div>
                </div>
                <div class="phase-timeline">
                  <div class="timeline-marker">2-3 weeks</div>
                </div>
              </div>
            </div>
            
            <div class="migration-phase">
              <div class="phase-header">
                <div class="phase-number">5</div>
                <h4>Optimization & Decommissioning</h4>
              </div>
              <div class="phase-content">
                <div class="phase-steps">
                  <div class="phase-step">
                    <div class="step-marker"></div>
                    <div class="step-content">
                      <h5>Enhanced Feature Enablement</h5>
                      <p>Activate advanced cloud features not available in legacy solution</p>
                    </div>
                  </div>
                  <div class="phase-step">
                    <div class="step-marker"></div>
                    <div class="step-content">
                      <h5>Integration with Cloud Security Stack</h5>
                      <p>Connect to additional cloud security services</p>
                    </div>
                  </div>
                  <div class="phase-step">
                    <div class="step-marker"></div>
                    <div class="step-content">
                      <h5>Legacy System Decommissioning</h5>
                      <p>Safely retire on-premises appliances and licenses</p>
                    </div>
                  </div>
                </div>
                <div class="phase-timeline">
                  <div class="timeline-marker">1-2 weeks</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="result-card">
        <h3>Technical Resources</h3>
        <div class="technical-resources">
          <div class="resources-grid">
            <div class="resource-item">
              <div class="resource-icon"><i class="fas fa-book"></i></div>
              <div class="resource-content">
                <h4>Documentation</h4>
                <p>Comprehensive deployment guides, API reference, and best practices</p>
                <a href="#" class="resource-link">View Documentation</a>
              </div>
            </div>
            
            <div class="resource-item">
              <div class="resource-icon"><i class="fas fa-graduation-cap"></i></div>
              <div class="resource-content">
                <h4>Training</h4>
                <p>Administrator certification program and technical training modules</p>
                <a href="#" class="resource-link">Access Training</a>
              </div>
            </div>
            
            <div class="resource-item">
              <div class="resource-icon"><i class="fas fa-headset"></i></div>
              <div class="resource-content">
                <h4>Support</h4>
                <p>24/7 technical support and dedicated implementation assistance</p>
                <a href="#" class="resource-link">Contact Support</a>
              </div>
            </div>
            
            <div class="resource-item">
              <div class="resource-icon"><i class="fas fa-tools"></i></div>
              <div class="resource-content">
                <h4>Migration Tools</h4>
                <p>Configuration migration utilities and network discovery tools</p>
                <a href="#" class="resource-link">Download Tools</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Set the content
    tabPane.innerHTML = technicalContent;
    
    // Initialize charts
    setTimeout(initializeTechnicalCharts, 500);
  }
  
  // Initialize Technical View charts
  function initializeTechnicalCharts() {
    // Authentication performance chart
    const authChartCanvas = document.getElementById('auth-performance-chart');
    if (authChartCanvas && typeof Chart !== 'undefined') {
      new Chart(authChartCanvas, {
        type: 'bar',
        data: {
          labels: ['Authentication Latency', 'Transactions/Second', 'Concurrent Sessions'],
          datasets: [
            {
              label: 'Current Solution',
              data: [100, 70, 60],
              backgroundColor: '#05547C'
            },
            {
              label: 'Portnox Cloud',
              data: [30, 95, 90],
              backgroundColor: '#65BD44'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          scales: {
            x: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Performance Score (higher is better)'
              }
            }
          }
        }
      });
    }
    
    // Management efficiency chart
    const efficiencyChartCanvas = document.getElementById('management-efficiency-chart');
    if (efficiencyChartCanvas && typeof Chart !== 'undefined') {
      new Chart(efficiencyChartCanvas, {
        type: 'radar',
        data: {
          labels: [
            'Deployment Speed',
            'Configuration Complexity',
            'Upgrade Effort',
            'Policy Management',
            'Monitoring & Troubleshooting',
            'Reporting & Auditing'
          ],
          datasets: [
            {
              label: 'Current Solution',
              data: [30, 35, 40, 55, 50, 45],
              backgroundColor: 'rgba(5, 84, 124, 0.2)',
              borderColor: '#05547C',
              pointBackgroundColor: '#05547C'
            },
            {
              label: 'Portnox Cloud',
              data: [90, 85, 95, 80, 85, 90],
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
  
  // Add CSS for Technical View
  function addTechnicalViewStyles() {
    // Check if styles already exist
    if (document.getElementById('technical-view-styles')) return;
    
    // Create style element
    const style = document.createElement('style');
    style.id = 'technical-view-styles';
    
    // Add CSS
    style.textContent = `
      /* Architecture comparison */
      .architecture-comparison {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 20px;
      }
      
      .architecture-item {
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
      }
      
      .architecture-item h4 {
        margin-top: 0;
        margin-bottom: 15px;
        color: #05547C;
        font-size: 1.1rem;
        text-align: center;
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
      }
      
      .architecture-diagram {
        margin-bottom: 15px;
        text-align: center;
      }
      
      .architecture-diagram img {
        max-width: 100%;
        height: auto;
        border-radius: 4px;
      }
      
      .architecture-description {
        color: #666;
        font-size: 0.95rem;
      }
      
      .architecture-description h5 {
        color: #05547C;
        margin: 15px 0 8px 0;
        font-size: 1rem;
      }
      
      .architecture-description ul {
        margin: 0 0 15px 0;
        padding-left: 20px;
      }
      
      .architecture-description li {
        margin-bottom: 5px;
      }
      
      /* Integration capabilities */
      .integrations-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }
      
      .integration-category {
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
      }
      
      .integration-category h4 {
        margin-top: 0;
        margin-bottom: 15px;
        color: #05547C;
        font-size: 1.1rem;
        text-align: center;
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
      }
      
      .integration-comparison {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
      }
      
      .integration-comparison h5 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 1rem;
        text-align: center;
      }
      
      .integration-list {
        margin: 0;
        padding-left: 20px;
        font-size: 0.9rem;
        color: #666;
      }
      
      .integration-list li {
        margin-bottom: 5px;
      }
      
      /* Migration methodology */
      .migration-intro {
        margin-top: 0;
        margin-bottom: 20px;
        color: #666;
      }
      
      .migration-phases {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      
      .migration-phase {
        background-color: #f8f9fa;
        border-radius: 8px;
        overflow: hidden;
      }
      
      .phase-header {
        display: flex;
        align-items: center;
        background-color: #05547C;
        color: white;
        padding: 10px 15px;
      }
      
      .phase-number {
        width: 30px;
        height: 30px;
        background-color: white;
        color: #05547C;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        margin-right: 15px;
      }
      
      .phase-header h4 {
        margin: 0;
        font-size: 1.1rem;
      }
      
      .phase-content {
        padding: 15px;
      }
      
      .phase-steps {
        margin-bottom: 15px;
      }
      
      .phase-step {
        display: flex;
        margin-bottom: 12px;
      }
      
      .step-marker {
        width: 12px;
        height: 12px;
        background-color: #65BD44;
        border-radius: 50%;
        margin-right: 15px;
        margin-top: 6px;
        flex-shrink: 0;
      }
      
      .step-content {
        flex: 1;
      }
      
      .step-content h5 {
        margin: 0 0 5px 0;
        font-size: 1rem;
        color: #05547C;
      }
      
      .step-content p {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
      }
      
      .phase-timeline {
        display: flex;
        justify-content: flex-end;
      }
      
      .timeline-marker {
        display: inline-block;
        padding: 5px 10px;
        background-color: #65BD44;
        color: white;
        border-radius: 4px;
        font-size: 0.9rem;
        font-weight: 500;
      }
      
      /* Technical resources */
      .technical-resources {
        padding: 10px;
      }
      
      .resources-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
      }
      
      .resource-item {
        display: flex;
        gap: 15px;
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
      }
      
      .resource-icon {
        color: #05547C;
        font-size: 1.5rem;
        flex-shrink: 0;
      }
      
      .resource-content {
        flex: 1;
      }
      
      .resource-content h4 {
        margin-top: 0;
        margin-bottom: 8px;
        color: #05547C;
        font-size: 1.1rem;
      }
      
      .resource-content p {
        margin: 0 0 10px 0;
        color: #666;
        font-size: 0.9rem;
      }
      
      .resource-link {
        display: inline-block;
        color: #65BD44;
        font-weight: 500;
        text-decoration: none;
        font-size: 0.9rem;
      }
      
      .resource-link:hover {
        text-decoration: underline;
      }
      
      /* Responsive adjustments */
      @media (max-width: 992px) {
        .architecture-comparison {
          grid-template-columns: 1fr;
        }
        
        .integration-comparison {
          grid-template-columns: 1fr;
        }
      }
    `;
    
    // Add to document
    document.head.appendChild(style);
  }
  
  // Add Technical View styles
  addTechnicalViewStyles();
})();
