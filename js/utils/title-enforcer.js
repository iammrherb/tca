/**
 * Title Enforcer
 * Ensures all instances of "Portnox Total Cost Analysis" are changed to "Total Cost Analysis"
 */
(function() {
  console.log('Installing title enforcer...');
  
  // Function to update all title occurrences
  function enforceCorrectTitle() {
    console.log('Enforcing correct title...');
    
    // Update document title
    if (document.title.includes('Portnox Total Cost')) {
      document.title = document.title.replace(/Portnox Total Cost/g, 'Total Cost');
    }
    
    // Update main heading
    document.querySelectorAll('.logo h1, h1, h2, h3').forEach(heading => {
      if (heading.textContent.includes('Portnox Total Cost')) {
        heading.textContent = heading.textContent.replace(/Portnox Total Cost/g, 'Total Cost');
      }
    });
    
    // Update all text nodes throughout the document
    function updateTextNodes(node) {
      if (node.nodeType === 3) { // Text node
        if (node.nodeValue && node.nodeValue.includes('Portnox Total Cost')) {
          node.nodeValue = node.nodeValue.replace(/Portnox Total Cost/g, 'Total Cost');
        }
      } else if (node.nodeType === 1) { // Element node
        // Skip script and style elements
        if (node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
          for (let i = 0; i < node.childNodes.length; i++) {
            updateTextNodes(node.childNodes[i]);
          }
        }
      }
    }
    
    // Start from the body
    if (document.body) {
      updateTextNodes(document.body);
    }
  }
  
  // Apply title enforcement immediately if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enforceCorrectTitle);
  } else {
    enforceCorrectTitle();
  }
  
  // Continue enforcing periodically for dynamically loaded content
  setInterval(enforceCorrectTitle, 1000);
  
  // Intercept any attempt to modify document.title
  const originalTitleDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'title');
  Object.defineProperty(document, 'title', {
    get: originalTitleDescriptor.get,
    set: function(value) {
      // Check if the new title contains "Portnox Total Cost"
      if (typeof value === 'string' && value.includes('Portnox Total Cost')) {
        // Replace it with "Total Cost"
        originalTitleDescriptor.set.call(this, value.replace(/Portnox Total Cost/g, 'Total Cost'));
      } else {
        originalTitleDescriptor.set.call(this, value);
      }
    }
  });
  
  console.log('Title enforcer installed');
})();
