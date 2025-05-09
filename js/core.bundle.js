// Core Bundle JS - Updated
console.log("NAC Designer core loaded - Updated");

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("NAC Designer initialized");
    
    // Dark mode toggle if it exists
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            // Update icon if it exists
            const icon = darkModeToggle.querySelector('i');
            if (icon) {
                if (document.body.classList.contains('dark-mode')) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            }
        });
    }
    
    // Check for any help buttons
    const helpBtn = document.getElementById('help-btn');
    if (helpBtn) {
        helpBtn.addEventListener('click', function() {
            alert('Help functionality is coming soon!');
        });
    }
});
