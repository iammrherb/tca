// Components Bundle JS - Updated
console.log("NAC Designer components loaded - Updated");

// Initialize components on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize modals
    const modalTriggers = document.querySelectorAll('[data-modal]');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('hidden');
            }
        });
    });
    
    // Modal close buttons
    const closeButtons = document.querySelectorAll('.close-button, [data-close-modal]');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.add('hidden');
            }
        });
    });
    
    // Initialize tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabGroup = this.closest('.tabs');
            const tabId = this.getAttribute('data-tab');
            
            // Deactivate all tabs in this group
            if (tabGroup) {
                tabGroup.querySelectorAll('.tab-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Find related content container
                const tabContent = document.querySelectorAll('.tab-pane');
                tabContent.forEach(content => {
                    content.classList.remove('active');
                });
            }
            
            // Activate the selected tab
            this.classList.add('active');
            const tabPane = document.getElementById(tabId);
            if (tabPane) {
                tabPane.classList.add('active');
            }
        });
    });
});
