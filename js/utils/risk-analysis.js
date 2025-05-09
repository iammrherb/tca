/**
 * Risk Analysis and Breach Impact Module
 * Provides advanced visualizations for security risk assessment
 */

const RiskAnalysis = (function() {
  // Risk impact levels
  const impactLevels = ['Low', 'Medium', 'High', 'Critical'];
  
  // Risk likelihood levels
  const likelihoodLevels = ['Unlikely', 'Possible', 'Likely', 'Very Likely', 'Almost Certain'];
  
  // Risk scores by impact and likelihood
  const riskMatrix = {
    'Low': {
      'Unlikely': { score: 1, level: 'minimal' },
      'Possible': { score: 2, level: 'minimal' },
      'Likely': { score: 3, level: 'low' },
      'Very Likely': { score: 4, level: 'low' },
      'Almost Certain': { score: 5, level: 'medium' }
    },
    'Medium': {
      'Unlikely': { score: 2, level: 'minimal' },
      'Possible': { score: 4, level: 'low' },
      'Likely': { score: 6, level: 'medium' },
      'Very Likely': { score: 8, level: 'medium' },
      'Almost Certain': { score: 10, level: 'high' }
    },
    'High': {
      'Unlikely': { score: 3, level: 'low' },
      'Possible': { score: 6, level: 'medium' },
      'Likely': { score: 9, level: 'high' },
      'Very Likely': { score: 12, level: 'high' },
      'Almost Certain': { score: 15, level: 'critical' }
    },
    'Critical': {
      'Unlikely': { score: 4, level: 'low' },
      'Possible': { score: 8, level: 'medium' },
      'Likely': { score: 12, level: 'high' },
      'Very Likely': { score: 16, level: 'critical' },
      'Almost Certain': { score: 20, level: 'critical' }
    }
  };
  
  // Common NAC security risks
  const commonRisks = [
    {
      id: 'unauthorized-access',
      name: 'Unauthorized Network Access',
      description: 'Malicious actors gaining access to the network through compromised credentials or unmanaged devices',
      impact: 'Critical',
      likelihood: {
        'no-nac': 'Almost Certain',
        'traditional-nac': 'Possible',
        'cloud-nac': 'Unlikely'
      },
      mitigations: [
        'Strong authentication enforcement',
        'Real-time device monitoring',
        'Zero-trust network architecture',
        'Continuous revalidation of access'
      ]
    },
    {
      id: 'byod-risks',
      name: 'BYOD Security Risks',
      description: 'Personal devices introducing malware, vulnerabilities or data leakage risks to corporate networks',
      impact: 'High',
      likelihood: {
        'no-nac': 'Very Likely',
        'traditional-nac': 'Likely',
        'cloud-nac': 'Possible'
      },
      mitigations: [
        'Device posture assessment',
        'Automated onboarding workflows',
        'Segmentation of personal devices',
        'Continuous monitoring for abnormal behavior'
      ]
    },
    {
      id: 'iot-vulnerabilities',
      name: 'IoT Device Vulnerabilities',
      description: 'Insecure IoT devices being compromised or used as attack vectors',
      impact: 'High',
      likelihood: {
        'no-nac': 'Almost Certain',
        'traditional-nac': 'Likely',
        'cloud-nac': 'Possible'
      },
      mitigations: [
        'IoT device fingerprinting',
        'Network microsegmentation',
        'Automated quarantine of suspicious devices',
        'Continuous vulnerability monitoring'
      ]
    },
    {
      id: 'compliance-violations',
      name: 'Compliance Violations',
      description: 'Failure to meet regulatory requirements resulting in penalties and reputation damage',
      impact: 'High',
      likelihood: {
        'no-nac': 'Very Likely',
        'traditional-nac': 'Possible',
        'cloud-nac': 'Unlikely'
      },
      mitigations: [
        'Automated compliance reporting',
        'Real-time compliance monitoring',
        'Audit-ready access logs',
        'Continuous validation of security controls'
      ]
    },
    {
      id: 'lateral-movement',
      name: 'Lateral Movement After Breach',
      description: 'Attackers moving through the network after initial compromise',
      impact: 'Critical',
      likelihood: {
        'no-nac': 'Almost Certain',
        'traditional-nac': 'Likely',
        'cloud-nac': 'Possible'
      },
      mitigations: [
        'Zero-trust architecture',
        'Network microsegmentation',
        'Continuous authentication',
        'Abnormal behavior detection'
      ]
    },
    {
      id: 'insider-threats',
      name: 'Insider Threats',
      description: 'Malicious or negligent actions by authorized users causing damage or data breaches',
      impact: 'High',
      likelihood: {
        'no-nac': 'Likely',
        'traditional-nac': 'Possible',
        'cloud-nac': 'Possible'
      },
      mitigations: [
        'Principle of least privilege',
        'Behavior anomaly detection',
        'Privileged access management',
        'Real-time activity monitoring'
      ]
    },
    {
      id: 'outdated-security',
      name: 'Outdated Security Controls',
      description: 'Using obsolete security measures that are ineffective against modern threats',
      impact: 'High',
      likelihood: {
        'no-nac': 'Almost Certain',
        'traditional-nac': 'Likely',
        'cloud-nac': 'Unlikely'
      },
      mitigations: [
        'Automatic security updates',
        'Continuous threat intelligence',
        'Cloud-based adaptive security',
        'AI-powered threat detection'
      ]
    },
    {
      id: 'complex-management',
      name: 'Complex Management Causing Errors',
      description: 'Security gaps due to misconfiguration or management complexity',
      impact: 'Medium',
      likelihood: {
        'no-nac': 'Likely',
        'traditional-nac': 'Very Likely',
        'cloud-nac': 'Unlikely'
      },
      mitigations: [
        'Simplified management interface',
        'Configuration validation',
        'Automated policy deployment',
        'Error prevention safeguards'
      ]
    },
    {
      id: 'lack-visibility',
      name: 'Lack of Network Visibility',
      description: 'Inability to detect unknown or shadow IT devices on the network',
      impact: 'High',
      likelihood: {
        'no-nac': 'Almost Certain',
        'traditional-nac': 'Possible',
        'cloud-nac': 'Unlikely'
      },
      mitigations: [
        'Continuous device discovery',
        'AI-powered device fingerprinting',
        'Automated asset inventory',
        'Real-time network monitoring'
      ]
    },
    {
      id: 'slow-response',
      name: 'Slow Incident Response',
      description: 'Delayed detection and remediation of security incidents',
      impact: 'High',
      likelihood: {
        'no-nac': 'Almost Certain',
        'traditional-nac': 'Likely',
        'cloud-nac': 'Possible'
      },
      mitigations: [
        'Automated threat response',
        'Real-time alerting',
        'Integration with SIEM systems',
        'Predefined remediation workflows'
      ]
    }
  ];
  
  // Breach impact metrics
  const breachImpactMetrics = {
    'no-nac': {
      dataBreachCost: 4200000,
      networkDowntime: 72,
      recoveryTimeHours: 160,
      reputationImpact: 'Severe',
      regulatoryPenalties: 950000,
      customerChurn: 6.8
    },
    'traditional-nac': {
      dataBreachCost: 2100000,
      networkDowntime: 24,
      recoveryTimeHours: 80,
      reputationImpact: 'Moderate',
      regulatoryPenalties: 325000,
      customerChurn: 3.2
    },
    'cloud-nac': {
      dataBreachCost: 750000,
      networkDowntime: 8,
      recoveryTimeHours: 24,
      reputationImpact: 'Minor',
      regulatoryPenalties: 125000,
      customerChurn: 1.5
    }
  };
  
  // Calculate risk score and level based on impact and likelihood
  function calculateRisk(impact, likelihood) {
    if (riskMatrix[impact] && riskMatrix[impact][likelihood]) {
      return riskMatrix[impact][likelihood];
    }
    return { score: 0, level: 'unknown' };
  }
  
  // Create risk heatmap data
  function createRiskHeatmapData(nacType = 'no-nac') {
    const data = [];
    
    // Generate data for all impact and likelihood combinations
    impactLevels.forEach(impact => {
      likelihoodLevels.forEach(likelihood => {
        const risk = calculateRisk(impact, likelihood);
        data.push({
          impact: impact,
          likelihood: likelihood,
          score: risk.score,
          level: risk.level
        });
      });
    });
    
    return data;
  }
  
  // Get risk data for a specific NAC type
  function getRiskDataForNACType(nacType = 'cloud-nac') {
    return commonRisks.map(risk => {
      const likelihood = risk.likelihood[nacType] || 'Possible';
      const calculated = calculateRisk(risk.impact, likelihood);
      
      return {
        ...risk,
        currentLikelihood: likelihood,
        score: calculated.score,
        level: calculated.level
      };
    }).sort((a, b) => b.score - a.score); // Sort by risk score descending
  }
  
  // Calculate risk reduction percentage between NAC types
  function calculateRiskReduction(fromType, toType) {
    const fromRisks = getRiskDataForNACType(fromType);
    const toRisks = getRiskDataForNACType(toType);
    
    // Calculate total risk scores
    const fromTotal = fromRisks.reduce((sum, risk) => sum + risk.score, 0);
    const toTotal = toRisks.reduce((sum, risk) => sum + risk.score, 0);
    
    // Calculate percentage reduction
    const reduction = ((fromTotal - toTotal) / fromTotal) * 100;
    return Math.round(reduction);
  }
  
  // Create a risk analysis table
  function createRiskTable(selector, nacType = 'cloud-nac') {
    const container = document.querySelector(selector);
    if (!container) return;
    
    const risks = getRiskDataForNACType(nacType);
    
    // Create table
    const table = document.createElement('table');
    table.className = 'risk-table';
    
    // Create header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    ['Risk', 'Impact', 'Likelihood', 'Risk Score', 'Level', 'Mitigations'].forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create body
    const tbody = document.createElement('tbody');
    
    risks.forEach((risk, index) => {
      const row = document.createElement('tr');
      row.className = 'stagger-item fade-in';
      row.style.animationDelay = `${index * 100}ms`;
      
      // Risk name
      const nameCell = document.createElement('td');
      nameCell.innerHTML = `
        <div class="font-medium">${risk.name}</div>
        <div class="text-sm text-gray-500">${risk.description}</div>
      `;
      row.appendChild(nameCell);
      
      // Impact
      const impactCell = document.createElement('td');
      impactCell.textContent = risk.impact;
      row.appendChild(impactCell);
      
      // Likelihood
      const likelihoodCell = document.createElement('td');
      likelihoodCell.textContent = risk.currentLikelihood;
      row.appendChild(likelihoodCell);
      
      // Risk score
      const scoreCell = document.createElement('td');
      scoreCell.textContent = risk.score;
      row.appendChild(scoreCell);
      
      // Risk level
      const levelCell = document.createElement('td');
      const badge = document.createElement('span');
      badge.className = `risk-badge ${risk.level}`;
      badge.textContent = risk.level.charAt(0).toUpperCase() + risk.level.slice(1);
      levelCell.appendChild(badge);
      row.appendChild(levelCell);
      
      // Mitigations
      const mitigationsCell = document.createElement('td');
      const mitigationsList = document.createElement('ul');
      mitigationsList.className = 'mitigations-list text-sm';
      
      risk.mitigations.forEach(mitigation => {
        const item = document.createElement('li');
        item.textContent = mitigation;
        mitigationsList.appendChild(item);
      });
      
      mitigationsCell.appendChild(mitigationsList);
      row.appendChild(mitigationsCell);
      
      tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    
    // Add to container
    container.innerHTML = '';
    container.appendChild(table);
    
    return table;
  }
  
  // Create breach impact visualization
  function createBreachImpactVisualization(selector, compareTypes = ['no-nac', 'cloud-nac']) {
    const container = document.querySelector(selector);
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Create breach impact grid
    const grid = document.createElement('div');
    grid.className = 'breach-impact';
    
    // Create cards for each metric
    const metrics = [
      { 
        id: 'data-breach-cost', 
        name: 'Data Breach Cost', 
        icon: 'fa-dollar-sign',
        format: value => `$${(value / 1000000).toFixed(2)}M`,
        reduction: (from, to) => (((from - to) / from) * 100).toFixed(0) + '%'
      },
      { 
        id: 'network-downtime', 
        name: 'Network Downtime', 
        icon: 'fa-network-wired',
        format: value => `${value} hours`,
        reduction: (from, to) => (((from - to) / from) * 100).toFixed(0) + '%'
      },
      { 
        id: 'recovery-time', 
        name: 'Recovery Time', 
        icon: 'fa-clock',
        format: value => `${value} hours`,
        reduction: (from, to) => (((from - to) / from) * 100).toFixed(0) + '%'
      },
      { 
        id: 'regulatory-penalties', 
        name: 'Regulatory Penalties', 
        icon: 'fa-gavel',
        format: value => `$${(value / 1000).toFixed(0)}K`,
        reduction: (from, to) => (((from - to) / from) * 100).toFixed(0) + '%'
      },
      { 
        id: 'customer-churn', 
        name: 'Customer Churn', 
        icon: 'fa-users-slash',
        format: value => `${value}%`,
        reduction: (from, to) => (((from - to) / from) * 100).toFixed(0) + '%'
      },
      { 
        id: 'total-impact-reduction', 
        name: 'Overall Impact Reduction', 
        icon: 'fa-shield-alt',
        special: true
      }
    ];
    
    // Get data for comparison
    const fromData = breachImpactMetrics[compareTypes[0]];
    const toData = breachImpactMetrics[compareTypes[1]];
    
    // Calculate overall impact reduction
    const fromTotal = fromData.dataBreachCost + (fromData.networkDowntime * 10000) + (fromData.recoveryTimeHours * 5000) + fromData.regulatoryPenalties;
    const toTotal = toData.dataBreachCost + (toData.networkDowntime * 10000) + (toData.recoveryTimeHours * 5000) + toData.regulatoryPenalties;
    const overallReduction = (((fromTotal - toTotal) / fromTotal) * 100).toFixed(0);
    
    // Create cards
    metrics.forEach((metric, index) => {
      const card = document.createElement('div');
      card.className = 'breach-impact-card stagger-item fade-in';
      card.style.animationDelay = `${index * 100}ms`;
      
      // Special handling for overall impact
      if (metric.special) {
        card.innerHTML = `
          <div class="breach-impact-icon">
            <i class="fas ${metric.icon}"></i>
          </div>
          <div class="breach-impact-title">${metric.name}</div>
          <div class="breach-impact-value">${overallReduction}%</div>
          <div class="breach-impact-reduction">
            <i class="fas fa-arrow-down breach-impact-reduction-icon"></i>
            Comprehensive risk reduction with ${compareTypes[1] === 'cloud-nac' ? 'Portnox Cloud' : 'Traditional NAC'}
          </div>
        `;
      } else {
        // Get values for metric
        let fromValue, toValue;
        
        if (metric.id === 'data-breach-cost') {
          fromValue = fromData.dataBreachCost;
          toValue = toData.dataBreachCost;
        } else if (metric.id === 'network-downtime') {
          fromValue = fromData.networkDowntime;
          toValue = toData.networkDowntime;
        } else if (metric.id === 'recovery-time') {
          fromValue = fromData.recoveryTimeHours;
          toValue = toData.recoveryTimeHours;
        } else if (metric.id === 'regulatory-penalties') {
          fromValue = fromData.regulatoryPenalties;
          toValue = toData.regulatoryPenalties;
        } else if (metric.id === 'customer-churn') {
          fromValue = fromData.customerChurn;
          toValue = toData.customerChurn;
        }
        
        const reductionValue = metric.reduction(fromValue, toValue);
        
        card.innerHTML = `
          <div class="breach-impact-icon">
            <i class="fas ${metric.icon}"></i>
          </div>
          <div class="breach-impact-title">${metric.name}</div>
          <div class="breach-impact-value">${reductionValue}</div>
          <div class="breach-impact-text">
            <div>From: ${metric.format(fromValue)}</div>
            <div>To: ${metric.format(toValue)}</div>
          </div>
          <div class="breach-impact-reduction">
            <i class="fas fa-arrow-down breach-impact-reduction-icon"></i>
            Reduction with ${compareTypes[1] === 'cloud-nac' ? 'Portnox Cloud' : 'Traditional NAC'}
          </div>
        `;
      }
      
      grid.appendChild(card);
    });
    
    container.appendChild(grid);
  }
  
  // Create risk summary visualization
  function createRiskSummary(selector, nacType = 'cloud-nac') {
    const container = document.querySelector(selector);
    if (!container) return;
    
    const risks = getRiskDataForNACType(nacType);
    
    // Count risks by level
    const riskCounts = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      minimal: 0
    };
    
    risks.forEach(risk => {
      riskCounts[risk.level]++;
    });
    
    // Calculate reduction from no NAC
    const reductionPercent = calculateRiskReduction('no-nac', nacType);
    
    // Create summary card
    const card = document.createElement('div');
    card.className = 'risk-summary-card p-6 bg-white shadow-md rounded-lg';
    
    card.innerHTML = `
      <div class="flex items-center mb-4">
        <div class="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 mr-4">
          <i class="fas fa-shield-alt text-xl"></i>
        </div>
        <div>
          <h3 class="text-lg font-semibold">Risk Summary with ${nacType === 'cloud-nac' ? 'Portnox Cloud' : (nacType === 'traditional-nac' ? 'Traditional NAC' : 'No NAC')}</h3>
          <p class="text-gray-600">Analysis of top network security risks</p>
        </div>
      </div>
      
      <div class="grid grid-cols-5 gap-2 mb-6">
        <div class="text-center">
          <div class="text-xs text-gray-500 mb-1">Critical</div>
          <div class="text-xl font-bold text-red-600">${riskCounts.critical}</div>
        </div>
        <div class="text-center">
          <div class="text-xs text-gray-500 mb-1">High</div>
          <div class="text-xl font-bold text-orange-500">${riskCounts.high}</div>
        </div>
        <div class="text-center">
          <div class="text-xs text-gray-500 mb-1">Medium</div>
          <div class="text-xl font-bold text-yellow-500">${riskCounts.medium}</div>
        </div>
        <div class="text-center">
          <div class="text-xs text-gray-500 mb-1">Low</div>
          <div class="text-xl font-bold text-green-500">${riskCounts.low}</div>
        </div>
        <div class="text-center">
          <div class="text-xs text-gray-500 mb-1">Minimal</div>
          <div class="text-xl font-bold text-blue-500">${riskCounts.minimal}</div>
        </div>
      </div>
      
      <div class="border-t border-gray-200 pt-4">
        <div class="flex items-center justify-between mb-2">
          <div class="text-sm text-gray-600">Overall Risk Reduction</div>
          <div class="text-lg font-semibold text-green-600">${reductionPercent}%</div>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div class="h-full bg-green-500 rounded-full" style="width: ${reductionPercent}%"></div>
        </div>
      </div>
    `;
    
    // Add to container
    container.innerHTML = '';
    container.appendChild(card);
  }
  
  // Return public API
  return {
    getRiskData: getRiskDataForNACType,
    calculateRiskReduction: calculateRiskReduction,
    createRiskHeatmapData: createRiskHeatmapData,
    createRiskTable: createRiskTable,
    createBreachImpactVisualization: createBreachImpactVisualization,
    createRiskSummary: createRiskSummary,
    breachImpactMetrics: breachImpactMetrics
  };
})();
