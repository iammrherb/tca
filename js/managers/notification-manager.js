/**
 * Enhanced notification system for user feedback with accessibility improvements
 */
class NotificationManager {
  constructor() {
    this.container = null;
    this.notificationQueue = [];
    this.isProcessingQueue = false;
    this.animationDuration = 300; // ms
    this.displayDuration = 5000; // ms for success/info, doubled for errors
    this.maxNotifications = 5; // Maximum number of notifications to show at once
    this.notificationCount = 0; // Current number of notifications shown
    this.isMobile = window.innerWidth < 768;
    
    this.createContainer();
    
    // Listen for window resize to update mobile state
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });
  }
  
  createContainer() {
    // Check if container already exists
    if (document.getElementById('notification-container')) {
      this.container = document.getElementById('notification-container');
      return;
    }
    
    // Create container
    this.container = document.createElement('div');
    this.container.id = 'notification-container';
    this.container.className = 'notification-container';
    this.container.setAttribute('role', 'region');
    this.container.setAttribute('aria-live', 'polite');
    this.container.setAttribute('aria-relevant', 'additions');
    
    // Add to document
    document.body.appendChild(this.container);
  }
  
  // Show a notification message
  show(message, type = 'info', duration = null) {
    if (!message) return;
    
    // Add to queue
    this.notificationQueue.push({
      message,
      type,
      duration: duration || (type === 'error' ? this.displayDuration * 2 : this.displayDuration)
    });
    
    // Process queue if not already processing
    if (!this.isProcessingQueue) {
      this.processQueue();
    }
  }
  
  // Process notification queue
  processQueue() {
    if (this.notificationQueue.length === 0) {
      this.isProcessingQueue = false;
      return;
    }
    
    this.isProcessingQueue = true;
    
    // If we've reached max notifications, wait for some to disappear
    if (this.notificationCount >= this.maxNotifications) {
      setTimeout(() => {
        this.processQueue();
      }, 500);
      return;
    }
    
    const notification = this.notificationQueue.shift();
    this.displayNotification(notification);
  }
  
  // Display a notification
  displayNotification(notification) {
    this.notificationCount++;
    
    // Create notification element
    const element = document.createElement('div');
    element.className = `notification notification-${notification.type}`;
    element.setAttribute('role', 'alert');
    
    // Add an icon based on type
    const iconElement = document.createElement('div');
    iconElement.className = 'notification-icon';
    
    switch (notification.type) {
      case 'success':
        iconElement.innerHTML = '<i class="fas fa-check-circle"></i>';
        break;
      case 'error':
        iconElement.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
        break;
      case 'warning':
        iconElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        break;
      default: 
        iconElement.innerHTML = '<i class="fas fa-info-circle"></i>';
    }
    
    // Create message text
    const messageText = document.createElement('div');
    messageText.className = 'notification-message';
    messageText.textContent = notification.message;
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'notification-close';
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Close notification');
    closeButton.addEventListener('click', () => {
      this.hideNotification(element);
    });
    
    // Assemble notification
    element.appendChild(iconElement);
    element.appendChild(messageText);
    element.appendChild(closeButton);
    
    // Add to container
    this.container.appendChild(element);
    
    // Trigger animation
    setTimeout(() => {
      element.classList.add('show');
    }, 10);
    
    // Mobile notifications should stack on top of each other
    if (this.isMobile) {
      element.style.top = `${(this.notificationCount - 1) * 10}px`;
    }
    
    // Set timeout to hide
    const notificationTimeout = setTimeout(() => {
      this.hideNotification(element);
    }, notification.duration);
    
    // Store timeout reference in element for cancellation if needed
    element.dataset.timeoutId = notificationTimeout;
    
    // Add hover behavior to pause timer
    element.addEventListener('mouseenter', () => {
      clearTimeout(element.dataset.timeoutId);
    });
    
    element.addEventListener('mouseleave', () => {
      element.dataset.timeoutId = setTimeout(() => {
        this.hideNotification(element);
      }, notification.duration / 2); // Reduce time on resume
    });
  }
  
  // Hide a notification
  hideNotification(element) {
    // Check if element still exists
    if (!element || !element.parentNode) {
      this.processQueue();
      return;
    }
    
    // Clear any pending timeout
    if (element.dataset.timeoutId) {
      clearTimeout(element.dataset.timeoutId);
    }
    
    // Start hide animation
    element.classList.remove('show');
    
    // Remove after animation
    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
        this.notificationCount--;
      }
      this.processQueue();
    }, this.animationDuration);
  }
  
  // Clear all notifications
  clearAll() {
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach(notification => {
      this.hideNotification(notification);
    });
    
    // Clear the queue
    this.notificationQueue = [];
  }
  
  // Helper methods for common notification types
  success(message, duration) {
    this.show(message, 'success', duration);
  }
  
  error(message, duration) {
    this.show(message, 'error', duration);
  }
  
  warn(message, duration) {
    this.show(message, 'warning', duration);
  }
  
  info(message, duration) {
    this.show(message, 'info', duration);
  }
}
