// Page View Counter for coaiexist.wtf
// Uses GitHub repo as backend storage

class PageCounter {
  constructor() {
    this.dataUrl = '/data/pageviews.json';
    this.currentPage = window.location.pathname || '/';
    this.storageKey = 'coaiexist_viewed_pages';
  }

  // Load and display page view count
  async display(elementId = 'page-counter') {
    try {
      // Fetch current counts
      const response = await fetch(this.dataUrl + '?t=' + Date.now());
      const data = await response.json();

      // Get count for current page
      let count = data[this.currentPage] || 0;

      // Check if this page has been viewed in this session
      const hasViewed = this.hasViewedThisSession();

      if (!hasViewed) {
        // Increment locally for immediate feedback
        count++;
        this.markAsViewed();

        // Send view event (will be processed by GitHub Action)
        this.recordView();
      }

      // Display the count
      const element = document.getElementById(elementId);
      if (element) {
        element.innerHTML = `
          <div class="view-counter">
            <span class="counter-icon">👁️</span>
            <span class="counter-text">Views: </span>
            <span class="counter-number">${count.toLocaleString()}</span>
          </div>
        `;
      }

      return count;
    } catch (error) {
      console.error('Error loading page views:', error);
      return 0;
    }
  }

  // Check if user has viewed this page in current session
  hasViewedThisSession() {
    try {
      const viewed = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
      const lastView = viewed[this.currentPage];

      // Consider it a new view if more than 30 minutes have passed
      if (!lastView) return false;
      const thirtyMinutes = 30 * 60 * 1000;
      return (Date.now() - lastView) < thirtyMinutes;
    } catch (e) {
      return false;
    }
  }

  // Mark page as viewed in this session
  markAsViewed() {
    try {
      const viewed = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
      viewed[this.currentPage] = Date.now();
      localStorage.setItem(this.storageKey, JSON.stringify(viewed));
    } catch (e) {
      console.error('Could not save view to localStorage:', e);
    }
  }

  // Record view by storing in localStorage queue
  recordView() {
    try {
      // Store pending views in localStorage
      const queueKey = 'coaiexist_pending_views';
      const queue = JSON.parse(localStorage.getItem(queueKey) || '[]');

      queue.push({
        page: this.currentPage,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });

      localStorage.setItem(queueKey, JSON.stringify(queue));

      // Note: In a future iteration, this could trigger a GitHub Action
      // via repository_dispatch webhook or similar mechanism
    } catch (e) {
      console.error('Could not record view:', e);
    }
  }

  // Get all pending views (for admin/debugging)
  static getPendingViews() {
    try {
      return JSON.parse(localStorage.getItem('coaiexist_pending_views') || '[]');
    } catch (e) {
      return [];
    }
  }

  // Clear pending views (after they've been synced)
  static clearPendingViews() {
    localStorage.removeItem('coaiexist_pending_views');
  }
}

// Auto-initialize on page load
if (typeof window !== 'undefined') {
  window.pageCounter = new PageCounter();

  // Auto-display if element exists
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (document.getElementById('page-counter')) {
        window.pageCounter.display();
      }
    });
  } else {
    if (document.getElementById('page-counter')) {
      window.pageCounter.display();
    }
  }
}
