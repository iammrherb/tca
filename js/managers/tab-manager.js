/**
 * Enhanced tab management system with better event handling and accessibility
 */
class TabManager {
  constructor() {
    this.activeTab = null;
    this.activeSubTab = null;
    this.tabHistory = [];
    this.eventListeners = {};
    this.initEventListeners();
  }
  
  initEventListeners() {
    // Main tabs
    document.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = button.getAttribute('data-tab');
        this.setActiveTab(tabId);
      });
      
      // Make tabs keyboard accessible
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const tabId = button.getAttribute('data-tab');
          this.setActiveTab(tabId);
        }
        
        // Keyboard navigation with arrow keys
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          
          const tabs = Array.from(document.querySelectorAll('.tab-button'));
          const currentIndex = tabs.indexOf(button);
          let newIndex;
          
          if (e.key === 'ArrowRight') {
            newIndex = (currentIndex + 1) % tabs.length;
          } else {
            newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
          }
          
          tabs[newIndex].focus();
        }
      });
    });
    
    // Sub tabs
    document.querySelectorAll('.sub-tab-button').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const subtabId = button.getAttribute('data-subtab');
        this.setActiveSubTab(subtabId);
      });
      
      // Make sub-tabs keyboard accessible
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const subtabId = button.getAttribute('data-subtab');
          this.setActiveSubTab(subtabId);
        }
        
        // Keyboard navigation with arrow keys
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          
          const subtabs = Array.from(document.querySelectorAll('.sub-tab-button'));
          const currentIndex = subtabs.indexOf(button);
          let newIndex;
          
          if (e.key === 'ArrowRight') {
            newIndex = (currentIndex + 1) % subtabs.length;
          } else {
            newIndex = (currentIndex - 1 + subtabs.length) % subtabs.length;
          }
          
          subtabs[newIndex].focus();
        }
      });
    });
    
    // Set initial active tabs from URL hash if present
    this.handleUrlHash();
    
    // Update URL hash when tabs change
    window.addEventListener('hashchange', () => this.handleUrlHash());
  }
  
  handleUrlHash() {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const [mainTab, subTab] = hash.split('-');
      if (mainTab) {
        this.setActiveTab(mainTab, false); // Don't update URL again
        if (subTab) {
          this.setActiveSubTab(subTab, false); // Don't update URL again
        }
      }
    } else {
      // Set default tabs
      const defaultTab = document.querySelector('.tab-button')?.getAttribute('data-tab');
      if (defaultTab) {
        this.setActiveTab(defaultTab, false);
      }
    }
  }
  
  setActiveTab(tabId, updateUrl = true) {
    if (this.activeTab === tabId) return;
    
    // Store previous tab for history
    if (this.activeTab) {
      this.tabHistory.push(this.activeTab);
      // Limit history to 10 items
      if (this.tabHistory.length > 10) {
        this.tabHistory.shift();
      }
    }
    
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
      const isActive = button.getAttribute('data-tab') === tabId;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-selected', isActive.toString());
      button.setAttribute('tabindex', isActive ? '0' : '-1');
    });
    
    // Update tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
      const isActive = pane.id === tabId;
      pane.classList.toggle('active', isActive);
      pane.setAttribute('aria-hidden', (!isActive).toString());
    });
    
    this.activeTab = tabId;
    
    // Update URL hash
    if (updateUrl) {
      if (this.activeSubTab) {
        window.history.pushState(null, '', `#${tabId}-${this.activeSubTab}`);
      } else {
        window.history.pushState(null, '', `#${tabId}`);
      }
    }
    
    // Trigger event for other components
    this.triggerEvent('tabChanged', { tabId, type: 'main' });
  }
  
  setActiveSubTab(subtabId, updateUrl = true) {
    if (this.activeSubTab === subtabId) return;
    
    // Update sub-tab buttons
    document.querySelectorAll('.sub-tab-button').forEach(button => {
      const isActive = button.getAttribute('data-subtab') === subtabId;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-selected', isActive.toString());
      button.setAttribute('tabindex', isActive ? '0' : '-1');
    });
    
    // Update sub-tab panes
    document.querySelectorAll('.sub-tab-pane').forEach(pane => {
      const isActive = pane.id === subtabId;
      pane.classList.toggle('active', isActive);
      pane.setAttribute('aria-hidden', (!isActive).toString());
    });
    
    this.activeSubTab = subtabId;
    
    // Update URL hash
    if (updateUrl && this.activeTab) {
      window.history.pushState(null, '', `#${this.activeTab}-${subtabId}`);
    }
    
    // Trigger event for other components
    this.triggerEvent('tabChanged', { tabId: subtabId, type: 'sub' });
  }
  
  on(eventName, callback) {
    if (!this.eventListeners[eventName]) {
      this.eventListeners[eventName] = [];
    }
    
    this.eventListeners[eventName].push(callback);
  }
  
  off(eventName, callback) {
    if (!this.eventListeners[eventName]) return;
    
    this.eventListeners[eventName] = this.eventListeners[eventName]
      .filter(listener => listener !== callback);
  }
  
  triggerEvent(eventName, data) {
    if (!this.eventListeners[eventName]) return;
    
    this.eventListeners[eventName].forEach(callback => {
      callback(data);
    });
  }
  
  goBack() {
    if (this.tabHistory.length > 0) {
      const previousTab = this.tabHistory.pop();
      this.setActiveTab(previousTab);
    }
  }
}
