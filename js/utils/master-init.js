/**
 * Master Initialization Script
 *
 * This script coordinates the initialization of all components and
 * ensures they are loaded in the correct order to prevent conflicts.
 */

(function() {
  console.log('Starting master initialization...');

  // Fix scripts to load
  const fixScripts = [
    'js/fixes/dom-hierarchy-fix.js',
    'js/fixes/chart-init-fix.js',
    'js/fixes/resource-fallbacks.js'
  ];

  // Load scripts sequentially
  let scriptIndex = 0;

  function loadNextScript() {
    if (scriptIndex >= fixScripts.length) {
      console.log('All fix scripts loaded, running final initialization');
      finalizeInitialization();
      return;
    }

    const script = document.createElement('script');
    script.src = fixScripts[scriptIndex];
    script.onload = function() {
      console.log(`Loaded fix script: ${fixScripts[scriptIndex]}`);
      scriptIndex++;
      loadNextScript();
    };
    script.onerror = function() {
      console.error(`Failed to load fix script: ${fixScripts[scriptIndex]}`);
      scriptIndex++;
      loadNextScript();
    };
    document.head.appendChild(script);
  }

  // Final initialization steps
  function finalizeInitialization() {
    console.log('Performing final initialization steps');

    // Force correct layout
    if (typeof forceCorrectLayout === 'function') {
      forceCorrectLayout();
    }

    // Clean up DOM
    if (typeof cleanupDOM === 'function') {
      cleanupDOM();
    }

    // Initialize charts
    if (typeof initializeCharts === 'function') {
      initializeCharts();
    }

    // Remove duplicate elements
    removeDuplicateElements();

    console.log('Master initialization complete');
  }

  // Remove elements with duplicate IDs
  function removeDuplicateElements() {
    const ids = {};
    const elements = document.querySelectorAll('[id]');

    elements.forEach(el => {
      if (ids[el.id]) {
        console.log(`Removing duplicate element with id: ${el.id}`);
        el.parentNode.removeChild(el);
      } else {
        ids[el.id] = true;
      }
    });
  }

  // Start loading scripts
  loadNextScript();
})();
