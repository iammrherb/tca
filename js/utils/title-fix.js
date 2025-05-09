/**
 * Title Fix
 * Changes "Portnox Total Cost Analysis" to "Total Cost Analysis"
 */
(function() {
  console.log('Installing title fix...');
  
  // Function to update all title occurrences
  function updateAllTitles() {
    // Update document title
    if (document.title.includes('Portnox Total Cost')) {
      document.title = document.title.replace('Portnox Total Cost', 'Total Cost');
    }
    
    // Update main heading
    document.querySelectorAll('.logo h1').forEach(heading => {
      if (heading.textContent.includes('Portnox Total Cost')) {
        heading.textContent = heading.textContent.replace('Portnox Total Cost', 'Total Cost');
      }
    });
    
    // Update all headings
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
      if (heading.textContent.includes('Portnox Total Cost')) {
        heading.textContent = heading.textContent.replace('Portnox Total Cost', 'Total Cost');
      }
    });
  }
  
  // Apply title updates when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateAllTitles);
  } else {
    updateAllTitles();
  }
  
  // Keep checking periodically
  setInterval(updateAllTitles, 2000);
  
  console.log('Title fix installed');
})();
