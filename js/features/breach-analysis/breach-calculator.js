/**
 * NAC Breach Impact Calculator
 * Estimates potential financial impact of security breaches with and without NAC
 */
class BreachImpactCalculator {
  constructor() {
    // Cache for impact results
    this.impactCache = {};
    
    // Default analysis parameters
    this.defaultParams = {
      companySize: 'medium', // small, medium, large
      industry: 'general',
      dataRecords: 10000,
      annualProbability: 0.15,
      hasExistingNAC: false,
      includeReputation: true,
      includeRegulatory: true,
      yearsToProject: 3
    };
  }
  
  /**
   * Calculate potential breach impact
   * @param {object} params - Analysis parameters
   * @returns {object} Breach impact analysis
   */
  calculateBreachImpact(params = {}) {
    // Merge with default parameters
    const analysisParams = {...this.defaultParams, ...params};
    
    // Generate cache key
    const cacheKey = JSON.stringify(analysisParams);
    
    // Return cached results if available
    if (this.impactCache[cacheKey]) {
      return this.impactCache[cacheKey];
    }
    
    // Get industry-specific data
    const industryData = window.industryData[analysisParams.industry] || {
      breachCost: 4200000, // Default average breach cost
      fteMultiplier: 1.0,
      implementationMultiplier: 1.0,
      downtimeImpact: 1.0
    };
    
    // Calculate base impact metrics
    const baseImpact = this._calculateBaseImpact(analysisParams, industryData);
    
    // Calculate impact with and without NAC
    const withoutNAC = this._calculateWithoutNAC(baseImpact, analysisParams);
    const withNAC = this._calculateWithNAC(baseImpact, analysisParams);
    
    // Calculate potential savings
    const savings = {
      annualRiskReduction: withoutNAC.annualRisk - withNAC.annualRisk,
      threeYearSavings: withoutNAC.projectedCosts.threeYear - withNAC.projectedCosts.threeYear,
      fiveYearSavings: withoutNAC.projectedCosts.fiveYear - withNAC.projectedCosts.fiveYear,
      breachScopeDifference: withoutNAC.breachScope - withNAC.breachScope,
      responseTimeDifference: withoutNAC.responseTime - withNAC.responseTime
    };
    
    // Generate insights
    const insights = this._generateInsights(withoutNAC, withNAC, analysisParams, industryData);
    
    // Prepare result
    const result = {
      params: analysisParams,
      industryData: {
        name: industryData.name || analysisParams.industry,
        averageBreachCost: industryData.breachCost,
        specificChallenges: industryData.specificChallenges || []
      },
      baseImpact,
      withoutNAC,
      withNAC,
      savings,
      insights,
      recommendations: this._generateRecommendations(analysisParams, withoutNAC, withNAC)
    };
    
    // Cache results
    this.impactCache[cacheKey] = result;
    
    return result;
  }
  
  /**
   * Calculate base impact metrics
   * @param {object} params - Analysis parameters
   * @param {object} industryData - Industry-specific data
   * @returns {object} Base impact metrics
   */
  _calculateBaseImpact(params, industryData) {
    // Cost per record based on industry
    const perRecordCost = this._calculatePerRecordCost(industryData);
    
    // Base breach cost (before NAC considerations)
    let breachCost;
    if (params.dataRecords > 100000) {
      // For very large breaches, use industry average
      breachCost = industryData.breachCost;
    } else {
      // For smaller breaches, calculate based on records
      breachCost = params.dataRecords * perRecordCost;
    }
    
    // Adjust breach cost based on company size
    const sizeMultiplier = this._getSizeMultiplier(params.companySize);
    breachCost *= sizeMultiplier;
    
    // Calculate breach components
    const breachComponents = this._calculateBreachComponents(breachCost, params, industryData);
    
    return {
      perRecordCost,
      breachCost,
      breachComponents,
      annualProbability: params.annualProbability
    };
  }
  
  /**
   * Calculate per-record cost based on industry
   * @param {object} industryData - Industry-specific data
   * @returns {number} Cost per record
   */
  _calculatePerRecordCost(industryData) {
    // Base per-record cost
    const basePerRecordCost = 150;
    
    // Industry-specific adjustments
    const industryMultipliers = {
      healthcare: 1.8,
      financial: 1.6,
      retail: 1.2,
      manufacturing: 1.1,
      education: 0.9,
      government: 1.3
    };
    
    const industryKey = industryData.name ? industryData.name.toLowerCase() : 'general';
    const multiplier = industryMultipliers[industryKey] || 1.0;
    
    return basePerRecordCost * multiplier;
  }
  
  /**
   * Get company size multiplier
   * @param {string} size - Company size
   * @returns {number} Size multiplier
   */
  _getSizeMultiplier(size) {
    const sizeMultipliers = {
      small: 0.7,    // Smaller companies typically have smaller breach costs
      medium: 1.0,   // Baseline
      large: 1.5     // Larger companies face higher costs due to scale
    };
    
    return sizeMultipliers[size] || 1.0;
  }
  
  /**
   * Calculate breach cost components
   * @param {number} totalCost - Total breach cost
   * @param {object} params - Analysis parameters
   * @param {object} industryData - Industry-specific data
   * @returns {object} Breach cost components
   */
  _calculateBreachComponents(totalCost, params, industryData) {
    const components = {
      detection: totalCost * 0.15,
      response: totalCost * 0.20,
      notification: totalCost * 0.05,
      lostBusiness: totalCost * 0.32,
      regulatory: params.includeRegulatory ? totalCost * 0.13 : 0,
      reputation: params.includeReputation ? totalCost * 0.15 : 0
    };
    
    // Make industry-specific adjustments
    if (industryData.name) {
      switch (industryData.name.toLowerCase()) {
        case 'healthcare':
          components.regulatory *= 1.5;  // Higher regulatory impact
          break;
        case 'financial':
          components.lostBusiness *= 1.3;  // Higher business impact
          components.reputation *= 1.4;    // Higher reputation impact
          break;
        case 'retail':
          components.lostBusiness *= 1.5;  // Much higher business impact
          break;
        case 'government':
          components.regulatory *= 1.3;    // Higher regulatory impact
          components.reputation *= 0.8;    // Lower reputation impact
          break;
      }
    }
    
    return components;
  }
  
  /**
   * Calculate impact without NAC
   * @param {object} baseImpact - Base impact metrics
   * @param {object} params - Analysis parameters
   * @returns {object} Impact without NAC
   */
  _calculateWithoutNAC(baseImpact, params) {
    // Without NAC, use full breach impact
    const breachCost = baseImpact.breachCost;
    
    // Calculate annualized risk
    const annualRisk = breachCost * baseImpact.annualProbability;
    
    // Projected costs over time
    const projectedCosts = {
      oneYear: annualRisk,
      threeYear: annualRisk * 3,
      fiveYear: annualRisk * 5
    };
    
    // Additional metrics
    const breachScope = 1.0;  // 100% of potential breach scope
    const responseTime = 280; // Average detection+response time in hours without NAC
    
    return {
      breachCost,
      annualRisk,
      projectedCosts,
      breachScope,
      responseTime,
      risksAndVulnerabilities: this._identifyRisksWithoutNAC(params)
    };
  }
  
  /**
   * Calculate impact with NAC
   * @param {object} baseImpact - Base impact metrics
   * @param {object} params - Analysis parameters
   * @returns {object} Impact with NAC
   */
  _calculateWithNAC(baseImpact, params) {
    // NAC effectiveness factors
    const nacEffectiveness = {
      probabilityReduction: 0.35,  // NAC reduces breach probability by 35%
      impactReduction: 0.40,       // NAC reduces breach impact by 40%
      scopeReduction: 0.65,        // NAC reduces breach scope by 65%
      responseImprovement: 0.70    // NAC improves response time by 70%
    };
    
    // Apply NAC effectiveness to breach metrics
    const reducedProbability = baseImpact.annualProbability * (1 - nacEffectiveness.probabilityReduction);
    const reducedCost = baseImpact.breachCost * (1 - nacEffectiveness.impactReduction);
    
    // Calculate annualized risk with NAC
    const annualRisk = reducedCost * reducedProbability;
    
    // Projected costs over time
    const projectedCosts = {
      oneYear: annualRisk,
      threeYear: annualRisk * 3,
      fiveYear: annualRisk * 5
    };
    
    // Additional metrics
    const breachScope = 1.0 - nacEffectiveness.scopeReduction;  // Reduced breach scope
    const responseTime = 280 * (1 - nacEffectiveness.responseImprovement); // Improved response time
    
    return {
      breachCost: reducedCost,
      annualRisk,
      projectedCosts,
      breachScope,
      responseTime,
      mitigations: this._identifyNACMitigations(params)
    };
  }
  
  /**
   * Identify risks without NAC
   * @param {object} params - Analysis parameters
   * @returns {array} Identified risks
   */
  _identifyRisksWithoutNAC(params) {
    const risks = [
      {
        category: 'Access Control',
        risks: [
          'Unauthorized network access from rogue devices',
          'Excessive access privileges for users and devices',
          'Inability to enforce network segmentation effectively',
          'Lack of visibility into connected devices'
        ]
      },
      {
        category: 'Threat Detection',
        risks: [
          'Delayed detection of compromised endpoints',
          'Limited visibility into unusual network behavior',
          'Inability to correlate access events with threats',
          'Reduced capacity to identify policy violations'
        ]
      },
      {
        category: 'Incident Response',
        risks: [
          'Slower mean time to respond (MTTR) to security incidents',
          'Manual remediation processes for compromised devices',
          'Limited containment capabilities during active breaches',
          'Inability to automate security incident responses'
        ]
      },
      {
        category: 'Compliance',
        risks: [
          'Difficulty demonstrating compliance with access control requirements',
          'Limited audit trails for regulatory reporting',
          'Challenges implementing technical security controls',
          'Increased risk of compliance violations and penalties'
        ]
      }
    ];
    
    // Add industry-specific risks
    if (params.industry && window.industryData[params.industry]) {
      const industryRisks = {
        category: `${window.industryData[params.industry].name} Specific Risks`,
        risks: []
      };
      
      // Add specific risks based on industry
      switch (params.industry) {
        case 'healthcare':
          industryRisks.risks.push(
            'Unauthorized access to protected health information (PHI)',
            'Unsecured medical devices connecting to the network',
            'Limited visibility into clinical systems access',
            'Inability to enforce HIPAA technical safeguards'
          );
          break;
        case 'financial':
          industryRisks.risks.push(
            'Unauthorized access to financial systems',
            'Inability to enforce PCI DSS network segmentation',
            'Limited monitoring of privileged user activities',
            'Challenges implementing fraud detection controls'
          );
          break;
        case 'manufacturing':
          industryRisks.risks.push(
            'Unsecured operational technology (OT) connections',
            'Limited visibility into industrial control systems',
            'Inability to protect intellectual property effectively',
            'Challenges securing legacy manufacturing equipment'
          );
          break;
        case 'retail':
          industryRisks.risks.push(
            'Unsecured point-of-sale (POS) systems',
            'Inability to protect customer payment data',
            'Limited visibility into third-party vendor access',
            'Challenges securing diverse retail environments'
          );
          break;
      }
      
      // Add industry risks if any were defined
      if (industryRisks.risks.length > 0) {
        risks.push(industryRisks);
      }
    }
    
    return risks;
  }
  
  /**
   * Identify NAC mitigations
   * @param {object} params - Analysis parameters
   * @returns {array} NAC mitigations
   */
  _identifyNACMitigations(params) {
    const mitigations = [
      {
        category: 'Access Control',
        mitigations: [
          'Enforcement of network access policies for all devices',
          'Implementation of least privilege access principles',
          'Dynamic network segmentation based on device posture',
          'Comprehensive visibility of all connected devices'
        ]
      },
      {
        category: 'Threat Detection',
        mitigations: [
          'Real-time detection of unauthorized access attempts',
          'Continuous monitoring of device behavior and compliance',
          'Integration with security tools for enhanced threat visibility',
          'Automated policy enforcement for non-compliant devices'
        ]
      },
      {
        category: 'Incident Response',
        mitigations: [
          'Reduced mean time to respond (MTTR) to security incidents',
          'Automated containment of compromised devices',
          'Streamlined remediation processes for security events',
          'Enhanced incident forensics with detailed access logs'
        ]
      },
      {
        category: 'Compliance',
        mitigations: [
          'Demonstrable enforcement of access control requirements',
          'Comprehensive audit logs for regulatory reporting',
          'Simplified implementation of technical security controls',
          'Reduced risk of compliance violations and penalties'
        ]
      }
    ];
    
    // Add industry-specific mitigations
    if (params.industry && window.industryData[params.industry]) {
      const industryMitigations = {
        category: `${window.industryData[params.industry].name} Specific Mitigations`,
        mitigations: []
      };
      
      // Add specific mitigations based on industry
      switch (params.industry) {
        case 'healthcare':
          industryMitigations.mitigations.push(
            'Enforcement of access controls for systems with PHI',
            'Medical device security with specialized device profiles',
            'Enhanced visibility into clinical systems access',
            'Automated enforcement of HIPAA technical safeguards'
          );
          break;
        case 'financial':
          industryMitigations.mitigations.push(
            'Enhanced protection for financial systems access',
            'Enforcement of PCI DSS network segmentation requirements',
            'Comprehensive monitoring of privileged user activities',
            'Integration with fraud detection systems'
          );
          break;
        case 'manufacturing':
          industryMitigations.mitigations.push(
            'Secure IT/OT convergence with specialized policies',
            'Enhanced visibility into industrial control systems',
            'Protection of intellectual property through access controls',
            'Security for legacy manufacturing equipment'
          );
          break;
        case 'retail':
          industryMitigations.mitigations.push(
            'Enhanced point-of-sale (POS) system security',
            'Protection of customer payment data',
            'Controlled third-party vendor access',
            'Adaptable security for diverse retail environments'
          );
          break;
      }
      
      // Add industry mitigations if any were defined
      if (industryMitigations.mitigations.length > 0) {
        mitigations.push(industryMitigations);
      }
    }
    
    return mitigations;
  }
  
  /**
   * Generate insights from analysis
   * @param {object} withoutNAC - Impact without NAC
   * @param {object} withNAC - Impact with NAC
   * @param {object} params - Analysis parameters
   * @param {object} industryData - Industry-specific data
   * @returns {array} Insights
   */
  _generateInsights(withoutNAC, withNAC, params, industryData) {
    const insights = [];
    
    // Risk reduction
    const riskReductionPercent = ((withoutNAC.annualRisk - withNAC.annualRisk) / withoutNAC.annualRisk * 100).toFixed(1);
    insights.push({
      category: 'Risk Reduction',
      insight: `NAC implementation reduces annualized breach risk by ${riskReductionPercent}%, from $${this._formatNumber(withoutNAC.annualRisk)} to $${this._formatNumber(withNAC.annualRisk)} annually.`
    });
    
    // Scope containment
    const scopeReductionPercent = ((withoutNAC.breachScope - withNAC.breachScope) / withoutNAC.breachScope * 100).toFixed(1);
    insights.push({
      category: 'Breach Containment',
      insight: `NAC can contain security breaches by ${scopeReductionPercent}%, limiting lateral movement and data access during incidents.`
    });
    
    // Response improvement
    const responseImprovement = ((withoutNAC.responseTime - withNAC.responseTime) / withoutNAC.responseTime * 100).toFixed(1);
    const timeReduction = (withoutNAC.responseTime - withNAC.responseTime).toFixed(0);
    insights.push({
      category: 'Incident Response',
      insight: `NAC improves incident response and containment time by ${responseImprovement}% (${timeReduction} hours faster), reducing breach costs and business impact.`
    });
    
    // ROI insights
    const threeYearSavings = withoutNAC.projectedCosts.threeYear - withNAC.projectedCosts.threeYear;
    insights.push({
      category: 'Financial Impact',
      insight: `Over a 3-year period, NAC can provide approximately $${this._formatNumber(threeYearSavings)} in risk reduction value through combined breach prevention and impact reduction.`
    });
    
    // Add industry-specific insight if applicable
    if (industryData.name) {
      switch (industryData.name.toLowerCase()) {
        case 'healthcare':
          insights.push({
            category: 'Healthcare Compliance',
            insight: `NAC helps address HIPAA Security Rule requirements for access controls and device security, reducing the risk of OCR penalties and enforcement actions.`
          });
          break;
        case 'financial':
          insights.push({
            category: 'Financial Services Security',
            insight: `NAC supports PCI DSS compliance requirements for network segmentation and access controls, helping prevent costly cardholder data breaches.`
          });
          break;
        case 'manufacturing':
          insights.push({
            category: 'OT/IT Security',
            insight: `NAC provides critical protection for converged IT/OT environments, securing both information systems and operational technology from compromise.`
          });
          break;
        case 'retail':
          insights.push({
            category: 'Retail Data Protection',
            insight: `NAC enhances protection of payment systems and customer data, helping prevent the substantial business impact of retail breaches.`
          });
          break;
      }
    }
    
    return insights;
  }
  
  /**
   * Generate recommendations based on analysis
   * @param {object} params - Analysis parameters
   * @param {object} withoutNAC - Impact without NAC
   * @param {object} withNAC - Impact with NAC
   * @returns {array} Recommendations
   */
  _generateRecommendations(params, withoutNAC, withNAC) {
    const recommendations = [];
    
    // Add general recommendations
    recommendations.push({
      priority: 'High',
      title: 'Implement Network Access Control',
      description: 'Deploy a comprehensive NAC solution to enforce access policies, gain visibility into connected devices, and automate response to security incidents.',
      estimatedImpact: `Potential risk reduction of $${this._formatNumber(withoutNAC.annualRisk - withNAC.annualRisk)} annually.`
    });
    
    recommendations.push({
      priority: 'High',
      title: 'Enhance Network Segmentation',
      description: 'Implement granular network segmentation to limit lateral movement during security breaches and reduce the potential scope of compromise.',
      estimatedImpact: `Potential breach scope reduction of ${Math.round((withoutNAC.breachScope - withNAC.breachScope) * 100)}%.`
    });
    
    recommendations.push({
      priority: 'Medium',
      title: 'Automate Incident Response',
      description: 'Establish automated response workflows for security incidents to reduce detection and containment time for potential breaches.',
      estimatedImpact: `Potential response time improvement of ${Math.round((withoutNAC.responseTime - withNAC.responseTime))} hours.`
    });
    
    // Add industry-specific recommendations
    if (params.industry && window.industryData[params.industry]) {
      switch (params.industry) {
        case 'healthcare':
          recommendations.push({
            priority: 'High',
            title: 'Protect Medical Devices',
            description: 'Implement specialized profiles and policies for medical devices to ensure security without disrupting clinical operations.',
            estimatedImpact: 'Enhanced compliance with HIPAA Security Rule technical safeguards.'
          });
          break;
        case 'financial':
          recommendations.push({
            priority: 'High',
            title: 'Secure Cardholder Data Environment',
            description: 'Implement strict access controls and segmentation for systems that process, store, or transmit cardholder data.',
            estimatedImpact: 'Enhanced PCI DSS compliance and reduced risk of cardholder data breaches.'
          });
          break;
        case 'manufacturing':
          recommendations.push({
            priority: 'High',
            title: 'Secure IT/OT Convergence',
            description: 'Implement specialized controls for operational technology environments to protect manufacturing systems without disrupting production.',
            estimatedImpact: 'Reduced risk of production disruption and intellectual property theft.'
          });
          break;
        case 'retail':
          recommendations.push({
            priority: 'High',
            title: 'Secure Point-of-Sale Systems',
            description: 'Implement enhanced protection for POS systems and payment processing infrastructure.',
            estimatedImpact: 'Reduced risk of payment card data breaches and PCI DSS non-compliance.'
          });
          break;
      }
    }
    
    return recommendations;
  }
  
  /**
   * Format number with commas for readability
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  _formatNumber(num) {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

// Make the breach calculator available globally
window.breachImpactCalculator = new BreachImpactCalculator();
