/**
 * Migration Planner Component
 * Provides detailed migration planning from on-premises to cloud-based NAC
 */
class MigrationPlanner {
  constructor() {
    this.phases = [
      {
        id: 'assessment',
        title: 'Assessment & Discovery',
        icon: 'search',
        description: 'Evaluate current environment, identify devices, authentication methods, and network topology.',
        duration: '2-3 weeks',
        tasks: [
          'Inventory all network devices and access points',
          'Document current authentication methods and policies',
          'Analyze network traffic patterns and user behaviors',
          'Identify integration points with existing systems',
          'Assess compliance requirements and security policies'
        ],
        deliverables: [
          'Environment assessment report',
          'Network topology diagram',
          'Authentication flow documentation',
          'Integration requirements document'
        ]
      },
      {
        id: 'planning',
        title: 'Architecture Planning',
        icon: 'project-diagram',
        description: 'Design authentication flows and integration points for cloud NAC solution.',
        duration: '1-2 weeks',
        tasks: [
          'Define cloud connector placement strategy',
          'Design authentication and authorization flows',
          'Plan integration with existing identity systems',
          'Develop migration strategy and timeline',
          'Create rollback procedures'
        ],
        deliverables: [
          'Solution architecture document',
          'Migration timeline and strategy',
          'Integration design',
          'Rollback plan'
        ]
      },
      {
        id: 'setup',
        title: 'Portnox Cloud Setup',
        icon: 'cloud',
        description: 'Configure cloud portal, authentication methods, and deploy local connectors.',
        duration: '1 week',
        tasks: [
          'Set up Portnox Cloud tenant',
          'Configure authentication settings',
          'Deploy cloud connectors in key network segments',
          'Test basic connectivity and authentication',
          'Configure initial policies'
        ],
        deliverables: [
          'Configured Portnox Cloud environment',
          'Deployed and verified cloud connectors',
          'Basic authentication validation'
        ]
      },
      {
        id: 'policies',
        title: 'Policy Migration',
        icon: 'tasks',
        description: 'Transfer and adapt existing policies to the cloud platform.',
        duration: '1-2 weeks',
        tasks: [
          'Map existing policies to Portnox equivalents',
          'Configure device profiling rules',
          'Set up compliance policies',
          'Implement guest access workflows',
          'Create remediation actions'
        ],
        deliverables: [
          'Policy mapping document',
          'Configured policies in Portnox Cloud',
          'Policy testing results',
          'Compliance verification'
        ]
      },
      {
        id: 'pilot',
        title: 'Pilot Deployment',
        icon: 'flask',
        description: 'Test with limited device groups to verify configuration and policy enforcement.',
        duration: '2-3 weeks',
        tasks: [
          'Select pilot user groups and network segments',
          'Monitor authentication and authorization decisions',
          'Gather user feedback',
          'Fine-tune policies and configurations',
          'Validate reporting and visibility'
        ],
        deliverables: [
          'Pilot testing report',
          'Policy adjustment document',
          'User feedback summary',
          'Go/No-Go decision for full deployment'
        ]
      },
      {
        id: 'deployment',
        title: 'Full Deployment',
        icon: 'rocket',
        description: 'Expand to all network segments and user groups, phase out legacy solution.',
        duration: '2-4 weeks',
        tasks: [
          'Deploy in waves across remaining network segments',
          'Monitor system performance and user experience',
          'Address any emerging issues',
          'Begin decommissioning legacy NAC system',
          'Conduct final user training'
        ],
        deliverables: [
          'Deployment completion report',
          'Performance metrics',
          'Issue resolution log',
          'Legacy system retirement plan'
        ]
      },
      {
        id: 'optimization',
        title: 'Optimization & Training',
        icon: 'graduation-cap',
        description: 'Fine-tune the solution and ensure staff is properly trained on the new system.',
        duration: '1-2 weeks',
        tasks: [
          'Optimize policies based on production data',
          'Conduct administrator training sessions',
          'Document operational procedures',
          'Set up monitoring and alerting',
          'Establish regular review cadence'
        ],
        deliverables: [
          'Operational procedures document',
          'Training completion certificates',
          'System performance baseline',
          'Project closure report'
        ]
      }
    ];
    
    this.successFactors = [
      {
        title: 'Executive Sponsorship',
        description: 'Secure active support from senior leadership to ensure proper resource allocation and organizational buy-in.'
      },
      {
        title: 'Clear Success Criteria',
        description: 'Define measurable objectives for each phase that align with overall business and security goals.'
      },
      {
        title: 'Phased Approach',
        description: 'Implement in stages, starting with non-critical segments to validate configuration and minimize disruption.'
      },
      {
        title: 'Dedicated Project Team',
        description: 'Assign specific roles and responsibilities with adequate time allocation to focus on the migration.'
      },
      {
        title: 'User Communication',
        description: 'Develop a comprehensive communication plan to keep all stakeholders informed throughout the process.'
      },
      {
        title: 'Training',
        description: 'Provide comprehensive training before and during migration for both administrators and end-users.'
      },
      {
        title: 'Testing',
        description: 'Thoroughly test each phase with a variety of device types and use cases before moving to production.'
      },
      {
        title: 'Rollback Plan',
        description: 'Maintain the ability to revert changes if critical issues arise during any phase of the migration.'
      }
    ];
    
    this.riskFactors = [
      {
        title: 'Legacy Device Compatibility',
        mitigation: 'Identify all legacy devices early and create specific policies to accommodate them without compromising security.'
      },
      {
        title: 'Network Infrastructure Changes',
        mitigation: 'Document all required network configuration changes and test in a controlled environment before implementation.'
      },
      {
        title: 'Authentication Disruption',
        mitigation: 'Use overlap periods where both old and new systems are active, with gradual transition to minimize user impact.'
      },
      {
        title: 'Integration Complexities',
        mitigation: 'Plan detailed integration testing with existing systems like Active Directory, MDM, and security tools.'
      },
      {
        title: 'User Resistance',
        mitigation: 'Provide clear communication about benefits and changes, with ample support resources during the transition.'
      }
    ];
    
    // Initialize UI when component is created
    this.initUI();
  }
  
  /**
   * Initialize UI components for the migration planner
   */
  initUI() {
    // Populate migration phases in the UI
    this.populateMigrationPhases();
    
    // Populate migration timeline
    this.populateMigrationTimeline();
    
    // Add success factors
    this.populateSuccessFactors();
    
    // Add risk factors
    this.populateRiskFactors();
  }
  
  /**
   * Populate migration phases in the UI
   */
  populateMigrationPhases() {
    const container = document.querySelector('.migration-phases');
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Add phases
    this.phases.forEach(phase => {
      const phaseElement = document.createElement('div');
      phaseElement.className = 'phase';
      phaseElement.id = `phase-${phase.id}`;
      
      // Create phase content
      phaseElement.innerHTML = `
        <div class="phase-icon">
          <i class="fas fa-${phase.icon}"></i>
        </div>
        <div class="phase-content">
          <h4>${phase.title}</h4>
          <p>${phase.description}</p>
          <div class="phase-duration">
            <strong>Duration:</strong> ${phase.duration}
          </div>
          <div class="phase-tasks hidden">
            <strong>Key Tasks:</strong>
            <ul>
              ${phase.tasks.map(task => `<li>${task}</li>`).join('')}
            </ul>
          </div>
          <div class="phase-deliverables hidden">
            <strong>Deliverables:</strong>
            <ul>
              ${phase.deliverables.map(deliverable => `<li>${deliverable}</li>`).join('')}
            </ul>
          </div>
          <button class="btn btn-text phase-details-toggle" data-phase="${phase.id}">
            <i class="fas fa-plus-circle"></i> Show Details
          </button>
        </div>
      `;
      
      // Add to container
      container.appendChild(phaseElement);
      
      // Add event listener to toggle button
      const toggleButton = phaseElement.querySelector('.phase-details-toggle');
      if (toggleButton) {
        toggleButton.addEventListener('click', (e) => {
          const phaseId = e.currentTarget.getAttribute('data-phase');
          this.togglePhaseDetails(phaseId);
        });
      }
    });
  }
  
  /**
   * Toggle phase details visibility
   */
  togglePhaseDetails(phaseId) {
    const phaseElement = document.getElementById(`phase-${phaseId}`);
    if (!phaseElement) return;
    
    const tasksElement = phaseElement.querySelector('.phase-tasks');
    const deliverablesElement = phaseElement.querySelector('.phase-deliverables');
    const toggleButton = phaseElement.querySelector('.phase-details-toggle');
    
    if (tasksElement && deliverablesElement && toggleButton) {
      const isHidden = tasksElement.classList.contains('hidden');
      
      // Toggle visibility
      tasksElement.classList.toggle('hidden', !isHidden);
      deliverablesElement.classList.toggle('hidden', !isHidden);
      
      // Update button text and icon
      if (isHidden) {
        toggleButton.innerHTML = '<i class="fas fa-minus-circle"></i> Hide Details';
      } else {
        toggleButton.innerHTML = '<i class="fas fa-plus-circle"></i> Show Details';
      }
    }
  }
  
  /**
   * Populate migration timeline table
   */
  populateMigrationTimeline() {
    const tableBody = document.getElementById('migration-table-body');
    if (!tableBody) return;
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Add phases to timeline
    this.phases.forEach(phase => {
      const row = document.createElement('tr');
      
      const phaseCell = document.createElement('td');
      phaseCell.textContent = phase.title;
      
      const descriptionCell = document.createElement('td');
      descriptionCell.textContent = phase.description;
      
      const durationCell = document.createElement('td');
      durationCell.textContent = phase.duration;
      
      row.appendChild(phaseCell);
      row.appendChild(descriptionCell);
      row.appendChild(durationCell);
      
      tableBody.appendChild(row);
    });
    
    // Add total row
    const totalRow = document.createElement('tr');
    totalRow.className = 'total-row';
    
    const totalLabelCell = document.createElement('td');
    totalLabelCell.textContent = 'Total Estimated Duration';
    totalLabelCell.style.fontWeight = 'bold';
    
    const emptyCell = document.createElement('td');
    
    const totalDurationCell = document.createElement('td');
    totalDurationCell.textContent = '8-16 weeks';
    totalDurationCell.style.fontWeight = 'bold';
    
    totalRow.appendChild(totalLabelCell);
    totalRow.appendChild(emptyCell);
    totalRow.appendChild(totalDurationCell);
    
    tableBody.appendChild(totalRow);
  }
  
  /**
   * Populate success factors
   */
  populateSuccessFactors() {
    const container = document.querySelector('.success-factors');
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Add success factors
    this.successFactors.forEach(factor => {
      const item = document.createElement('li');
      
      const title = document.createElement('strong');
      title.textContent = factor.title;
      
      item.appendChild(title);
      item.appendChild(document.createTextNode(` - ${factor.description}`));
      
      container.appendChild(item);
    });
  }
  
  /**
   * Populate risk factors
   */
  populateRiskFactors() {
    const container = document.getElementById('risk-factors-container');
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Create risk factors card
    const card = document.createElement('div');
    card.className = 'result-card';
    
    // Add title
    const title = document.createElement('h3');
    title.textContent = 'Risk Management';
    card.appendChild(title);
    
    // Add description
    const description = document.createElement('p');
    description.textContent = 'Potential migration challenges and recommended mitigation strategies:';
    card.appendChild(description);
    
    // Create risks table
    const table = document.createElement('table');
    table.className = 'data-table';
    
    // Add table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const riskHeader = document.createElement('th');
    riskHeader.textContent = 'Risk Factor';
    
    const mitigationHeader = document.createElement('th');
    mitigationHeader.textContent = 'Mitigation Strategy';
    
    headerRow.appendChild(riskHeader);
    headerRow.appendChild(mitigationHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Add table body
    const tbody = document.createElement('tbody');
    
    this.riskFactors.forEach(factor => {
      const row = document.createElement('tr');
      
      const riskCell = document.createElement('td');
      riskCell.textContent = factor.title;
      riskCell.style.fontWeight = '500';
      
      const mitigationCell = document.createElement('td');
      mitigationCell.textContent = factor.mitigation;
      
      row.appendChild(riskCell);
      row.appendChild(mitigationCell);
      
      tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    card.appendChild(table);
    
    // Add to container
    container.appendChild(card);
    container.classList.remove('hidden');
  }
  
  /**
   * Generate a customized migration plan based on organization specifics
   */
  generateCustomPlan(organizationDetails) {
    // Implementation would create a customized migration plan
    // based on the organization's specific details
    if (!organizationDetails) return null;
    
    const customPlan = {
      phases: this.phases.map(phase => ({
        ...phase,
        // Adjust duration based on organization size
        duration: this.adjustDurationForSize(phase.duration, organizationDetails.size),
        // Customize tasks based on organization details
        tasks: this.customizeTasks(phase.tasks, organizationDetails)
      })),
      // Calculate total duration
      totalDuration: this.calculateTotalDuration(organizationDetails),
      // Generate resource requirements
      resourceRequirements: this.generateResourceRequirements(organizationDetails),
      // Calculate cost estimates
      costEstimates: this.calculateCostEstimates(organizationDetails)
    };
    
    return customPlan;
  }
  
  /**
   * Adjust duration based on organization size
   */
  adjustDurationForSize(duration, size) {
    const [min, max] = duration.split('-').map(d => parseInt(d));
    
    switch (size) {
      case 'small':
        return `${min} ${min === 1 ? 'week' : 'weeks'}`;
      case 'large':
        return `${max}-${max + 2} weeks`;
      default: // medium
        return duration;
    }
  }
  
  /**
   * Customize tasks based on organization details
   */
  customizeTasks(tasks, details) {
    // Implementation would customize tasks based on:
    // - Current NAC vendor
    // - Organization size
    // - Number of locations
    // - Legacy device percentage
    // - Compliance requirements
    // - etc.
    
    return tasks; // Placeholder
  }
  
  /**
   * Calculate total duration based on organization details
   */
  calculateTotalDuration(details) {
    // Implementation would calculate total duration
    return '8-16 weeks'; // Placeholder
  }
  
  /**
   * Generate resource requirements based on organization details
   */
  generateResourceRequirements(details) {
    // Implementation would generate resource requirements
    return {}; // Placeholder
  }
  
  /**
   * Calculate cost estimates based on organization details
   */
  calculateCostEstimates(details) {
    // Implementation would calculate cost estimates
    return {}; // Placeholder
  }
}

// Initialize and make globally available
window.migrationPlanner = new MigrationPlanner();
