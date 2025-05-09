/**
 * Compliance Analyzer for Zero Trust NAC Architecture Designer Pro
 * Analyzes and visualizes compliance capabilities across vendors
 */

class ComplianceAnalyzer {
  constructor() {
    this.data = window.ComplianceData || {};
    this.activeIndustry = 'healthcare';
    this.activeFramework = 'hipaa';
  }
  
  // Get relevant compliance frameworks for an industry
  getIndustryFrameworks(industry) {
    if (!this.data.industries[industry]) {
      console.warn('Industry not found:', industry);
      return [];
    }
    
    return this.data.industries[industry].frameworks || [];
  }
  
  // Get framework details by ID
  getFramework(frameworkId) {
    return this.data.frameworks[frameworkId] || null;
  }
  
  // Get industry-specific requirements
  getIndustryRequirements(industry) {
    if (!this.data.industries[industry]) {
      console.warn('Industry not found:', industry);
      return [];
    }
    
    return this.data.industries[industry].requirements || [];
  }
  
  // Get vendor compliance scores for a framework
  getVendorComplianceScores(framework) {
    const scores = {};
    
    for (const vendor in this.data.vendorCompliance) {
      scores[vendor] = this.data.vendorCompliance[vendor][framework] || 0;
    }
    
    return scores;
  }
  
  // Get vendor requirement scores for an industry
  getVendorRequirementScores(industry) {
    if (!this.data.industries[industry]) {
      console.warn('Industry not found:', industry);
      return {};
    }
    
    const requirements = this.data.industries[industry].requirements || [];
    const scores = {};
    
    for (const vendor in this.data.vendorCompliance) {
      scores[vendor] = {};
      
      requirements.forEach(req => {
        scores[vendor][req.name] = req.vendorScores[vendor] || 0;
      });
    }
    
    return scores;
  }
  
  // Generate requirements scorecard for a framework
  generateFrameworkScorecard(framework, currentVendor = 'cisco') {
    const frameworkData = this.data.frameworks[framework];
    if (!frameworkData) {
      console.warn('Framework not found:', framework);
      return null;
    }
    
    const portnoxScores = this.data.vendorCompliance['portnox'] || {};
    const currentVendorScores = this.data.vendorCompliance[currentVendor] || {};
    
    const portnoxFrameworkScore = portnoxScores[framework] || 0;
    const currentFrameworkScore = currentVendorScores[framework] || 0;
    
    let html = `
      <div class="framework-scorecard">
        <div class="scorecard-header">
          <div class="framework-info">
            <h4>${frameworkData.name}</h4>
            <p>${frameworkData.description}</p>
          </div>
          <div class="framework-scores">
            <div class="score-comparison">
              <div class="score portnox">
                <div class="score-label">Portnox Cloud</div>
                <div class="score-value">${portnoxFrameworkScore}%</div>
              </div>
              <div class="score-vs">vs</div>
              <div class="score current">
                <div class="score-label">${window.vendorData && window.vendorData[currentVendor] ? window.vendorData[currentVendor].name : 'Current Solution'}</div>
                <div class="score-value">${currentFrameworkScore}%</div>
              </div>
            </div>
            <div class="score-improvement">
              <div class="improvement-value">+${portnoxFrameworkScore - currentFrameworkScore}%</div>
              <div class="improvement-label">Compliance Improvement</div>
            </div>
          </div>
        </div>
        
        <div class="categories-container">
    `;
    
    // Add categories
    frameworkData.categories.forEach(category => {
      html += `
        <div class="compliance-category">
          <h5>${category.name}</h5>
          <ul class="requirement-list">
      `;
      
      // Add requirements
      category.requirements.forEach(requirement => {
        // Random scores for illustration - in a real implementation, these would be actual scores
        const portnoxScore = Math.floor(Math.random() * 11) + 90; // 90-100
        const currentScore = Math.floor(Math.random() * 31) + 50; // 50-80
        
        html += `
          <li class="requirement-item">
            <div class="requirement-text">${requirement}</div>
            <div class="requirement-scores">
              <div class="vendor-comparison">
                <span class="vendor-score portnox">${portnoxScore}%</span>
                <span class="vs">vs</span>
                <span class="vendor-score current">${currentScore}%</span>
              </div>
            </div>
          </li>
        `;
      });
      
      html += `
          </ul>
        </div>
      `;
    });
    
    html += `
        </div>
        
        <div class="scorecard-footer">
          <div class="portnox-advantage">
            <h5>Portnox Advantage for ${frameworkData.name}</h5>
            <ul>
              <li>Cloud-native architecture ensures continuous compliance updates</li>
              <li>Built-in compliance reporting reduces audit preparation time by 75%</li>
              <li>Automated remediation ensures continuous compliance adherence</li>
              <li>Pre-configured compliance policies based on framework requirements</li>
            </ul>
          </div>
        </div>
      </div>
    `;
    
    return html;
  }
  
  // Generate regulatory requirements section for an industry
  generateRegulatoryRequirements(industry) {
    const industryData = this.data.industries[industry];
    if (!industryData) {
      console.warn('Industry not found:', industry);
      return '';
    }
    
    const frameworkIds = industryData.frameworks || [];
    let html = `<div class="regulatory-grid">`;
    
    frameworkIds.forEach(frameworkId => {
      const framework = this.data.frameworks[frameworkId];
      if (!framework) return;
      
      // Get vendor scores
      const vendorScores = this.getVendorComplianceScores(frameworkId);
      const portnoxScore = vendorScores['portnox'] || 0;
      const avgOtherScore = this.calculateAverageScore(vendorScores, 'portnox');
      
      html += `
        <div class="regulatory-card" data-framework="${frameworkId}">
          <h4>${framework.name}</h4>
          <p>${framework.description}</p>
          
          <div class="compliance-meter">
            <div class="compliance-value portnox" style="width: ${portnoxScore}%;"></div>
          </div>
          
          <div class="compliance-stats">
            <div class="compliance-score">
              <div class="score-label">Portnox Cloud</div>
              <div class="score-value">${portnoxScore}%</div>
            </div>
            
            <div class="compliance-score">
              <div class="score-label">Industry Average</div>
              <div class="score-value">${avgOtherScore}%</div>
            </div>
            
            <div class="compliance-improvement">
              <div class="improvement-value">+${portnoxScore - avgOtherScore}%</div>
            </div>
          </div>
          
          <button class="btn btn-outline btn-sm view-framework-btn" data-framework="${frameworkId}">
            View Details
          </button>
        </div>
      `;
    });
    
    html += '</div>';
    return html;
  }
  
  // Helper to calculate average score excluding a specific vendor
  calculateAverageScore(scores, excludeVendor) {
    let total = 0;
    let count = 0;
    
    for (const vendor in scores) {
      if (vendor !== excludeVendor) {
        total += scores[vendor];
        count++;
      }
    }
    
    return count > 0 ? Math.round(total / count) : 0;
  }
}

// Initialize compliance analyzer on window
window.complianceAnalyzer = new ComplianceAnalyzer();

console.log('Compliance Analyzer initialized and available as window.complianceAnalyzer');
