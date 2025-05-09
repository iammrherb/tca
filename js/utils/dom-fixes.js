/**
 * NAC Architecture Designer Pro - DOM Fixes
 */
(function() {
    console.log("Installing DOM fixes");

    // Fix 1: Prevent circular DOM references
    const originalAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function(child) {
        if (!child) {
            console.warn("Prevented appendChild with null child");
            return child;
        }
        
        if (this === child) {
            console.warn("Prevented circular DOM reference (self-append)");
            return child;
        }
        
        if (child.contains && typeof child.contains === 'function' && child.contains(this)) {
            console.warn("Prevented circular DOM reference (child contains parent)");
            return child;
        }
        
        return originalAppendChild.call(this, child);
    };
    
    // Also fix insertBefore
    const originalInsertBefore = Element.prototype.insertBefore;
    Element.prototype.insertBefore = function(child, reference) {
        if (!child) {
            console.warn("Prevented insertBefore with null child");
            return child;
        }
        
        if (this === child) {
            console.warn("Prevented circular DOM reference in insertBefore (self-insert)");
            return child;
        }
        
        if (child.contains && typeof child.contains === 'function' && child.contains(this)) {
            console.warn("Prevented circular DOM reference in insertBefore (child contains parent)");
            return child;
        }
        
        return originalInsertBefore.call(this, child, reference);
    };

    // Fix 2: Fix duplicate IDs by adding suffix to duplicates
    function fixDuplicateIds() {
        console.log("Fixing duplicate element IDs");
        const seen = {};
        document.querySelectorAll('[id]').forEach(function(element) {
            const id = element.id;
            if (seen[id]) {
                const newId = id + '_dup_' + Math.random().toString(36).substring(2, 5);
                console.warn("Renaming duplicate ID from '" + id + "' to '" + newId + "'");
                element.id = newId;
            } else {
                seen[id] = true;
            }
        });
    }

    // Run duplicate ID fix when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixDuplicateIds);
    } else {
        fixDuplicateIds();
    }
    
    // Schedule additional check after all scripts load
    window.addEventListener('load', fixDuplicateIds);

    console.log("DOM fixes installed");
})();
