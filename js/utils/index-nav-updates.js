// Find the navigation section or appropriate container
const navContainer = document.querySelector('.nav-tabs') || document.querySelector('.main-nav');

if (navContainer) {
  // Create new navigation items
  const execDashboardLink = document.createElement('a');
  execDashboardLink.href = 'executive-dashboard.html';
  execDashboardLink.className = 'nav-item';
  execDashboardLink.innerHTML = '<i class="fas fa-chart-line"></i> Executive Dashboard';
  
  const complianceLink = document.createElement('a');
  complianceLink.href = 'industry-compliance.html';
  complianceLink.className = 'nav-item';
  complianceLink.innerHTML = '<i class="fas fa-shield-alt"></i> Industry & Compliance';
  
  // Add the new items to the navigation
  navContainer.appendChild(execDashboardLink);
  navContainer.appendChild(complianceLink);
  
  console.log('Navigation links updated');
}
