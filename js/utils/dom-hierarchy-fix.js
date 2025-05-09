/**
 * DOM Hierarchy Fix
 *
 * This script fixes circular references in the DOM by preventing
 * elements from being added to themselves or their ancestors.
 */

(function() {
  console.log('Applying DOM hierarchy fixes...');

  // Override appendChild to prevent circular references
  const originalAppendChild = Node.prototype.appendChild;
  Node.prototype.appendChild = function(child) {
    // Check if child is an ancestor of this node
    let node = this;
    while (node) {
      if (node === child) {
        console.error('Prevented circular DOM reference in appendChild');
        return child; // Return child without appending
      }
      node = node.parentNode;
    }

    // Call original method
    return originalAppendChild.call(this, child);
  };

  // Override prepend to prevent circular references
  const originalPrepend = Element.prototype.prepend;
  Element.prototype.prepend = function(...nodes) {
    // Filter nodes to prevent circular references
    const filteredNodes = Array.from(nodes).filter(node => {
      if (typeof node !== 'object' || !node) return true;

      // Check if node is an ancestor of this element
      let parent = this;
      while (parent) {
        if (parent === node) {
          console.error('Prevented circular DOM reference in prepend');
          return false;
        }
        parent = parent.parentNode;
      }

      return true;
    });

    // Call original method with filtered nodes
    return originalPrepend.apply(this, filteredNodes);
  };

  console.log('DOM hierarchy fixes applied');
})();
