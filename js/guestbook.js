// Enhanced Guestbook Widget for coaiexist.wtf
// Now with Supabase backend, replies, and reactions!

class Guestbook {
  constructor(containerId = 'guestbook-container') {
    this.containerId = containerId;
    this.maxNameLength = 50;
    this.maxMessageLength = 500;

    // Supabase configuration
    this.supabaseUrl = 'https://aqxrogaltuwtlparwdkq.supabase.co';
    this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxeHJvZ2FsdHV3dGxwYXJ3ZGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxMDY0NzAsImV4cCI6MjA3NzY4MjQ3MH0.qvkQaoQa7MaN7drGHKGxU3c1KnTQOdTH022MynR6fzI';

    // User identifier for reactions
    this.userIdentifier = this.getUserIdentifier();

    // Reaction types with emojis
    this.reactionTypes = {
      heart: '💜',
      star: '⭐',
      fire: '🔥',
      laugh: '😂',
      mind_blown: '🤯',
      sparkles: '✨'
    };
  }

  // Get or create a unique user identifier
  getUserIdentifier() {
    let identifier = localStorage.getItem('guestbook_user_id');
    if (!identifier) {
      identifier = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('guestbook_user_id', identifier);
    }
    return identifier;
  }

  // Initialize and render the guestbook
  async init() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error('Guestbook container not found:', this.containerId);
      return;
    }

    // Show loading state
    container.innerHTML = '<div class="loading">Loading guestbook...</div>';

    // Load entries
    const entries = await this.loadEntries();

    // Render UI
    container.innerHTML = this.renderUI(entries);

    // Attach event listeners
    this.attachEventListeners();
  }

  // Load guestbook entries from Supabase
  async loadEntries() {
    try {
      const response = await fetch(
        `${this.supabaseUrl}/rest/v1/guestbook_entry_stats?order=created_at.desc`,
        {
          headers: {
            'apikey': this.supabaseKey,
            'Authorization': `Bearer ${this.supabaseKey}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load entries');
      }

      const entries = await response.json();

      // Organize entries into threads (parent entries with their replies)
      return this.organizeThreads(entries);
    } catch (error) {
      console.error('Error loading guestbook entries:', error);
      return [];
    }
  }

  // Organize entries into parent entries and their replies
  organizeThreads(entries) {
    const parents = entries.filter(e => !e.parent_id);
    const replies = entries.filter(e => e.parent_id);

    // Attach replies to their parents
    parents.forEach(parent => {
      parent.replies = replies.filter(r => r.parent_id === parent.id)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    });

    return parents;
  }

  // Render the complete guestbook UI
  renderUI(entries) {
    return `
      <div class="guestbook-widget">
        ${this.renderForm()}
        ${this.renderStats(entries)}
        ${this.renderEntries(entries)}
      </div>
    `;
  }

  // Render the sign form
  renderForm(parentId = null, parentName = null) {
    const isReply = parentId !== null;
    const title = isReply ? `Reply to ${parentName}` : 'Sign the Guestbook';
    const placeholder = isReply ? `Reply to ${parentName}...` : 'Leave your mark on the digital cosmos...';
    const buttonText = isReply ? 'Post Reply' : 'Sign Guestbook';
    const formId = isReply ? `reply-form-${parentId}` : 'guestbook-sign-form';
    const cancelButton = isReply ? '<button type="button" class="cancel-button" onclick="window.guestbookInstance.cancelReply()">Cancel</button>' : '';

    return `
      <div class="guestbook-form ${isReply ? 'reply-form' : ''}" id="${formId}-container">
        <h3>${title}</h3>
        <form id="${formId}" data-parent-id="${parentId || ''}">
          <div class="form-group">
            <label for="${formId}-name">Name:</label>
            <input
              type="text"
              id="${formId}-name"
              name="name"
              maxlength="${this.maxNameLength}"
              required
              placeholder="Your name or handle"
            />
          </div>
          <div class="form-group">
            <label for="${formId}-message">Message:</label>
            <textarea
              id="${formId}-message"
              name="message"
              maxlength="${this.maxMessageLength}"
              rows="4"
              required
              placeholder="${placeholder}"
            ></textarea>
            <div class="char-counter">
              <span class="char-count">0</span>/${this.maxMessageLength}
            </div>
          </div>
          ${!isReply ? `
          <div class="form-group">
            <label for="${formId}-website">Website (optional):</label>
            <input
              type="url"
              id="${formId}-website"
              name="website"
              placeholder="https://your-site.com"
            />
          </div>` : ''}
          <div class="form-buttons">
            <button type="submit" class="sign-button">${buttonText}</button>
            ${cancelButton}
          </div>
          <div class="form-status"></div>
        </form>
      </div>
    `;
  }

  // Render stats
  renderStats(entries) {
    const totalReplies = entries.reduce((sum, e) => sum + (e.reply_count || 0), 0);
    const totalReactions = entries.reduce((sum, e) => sum + (e.total_reactions || 0), 0);

    return `
      <div class="guestbook-stats">
        <span class="stat-item">📝 ${entries.length} Signatures</span>
        <span class="stat-item">💬 ${totalReplies} Replies</span>
        <span class="stat-item">✨ ${totalReactions} Reactions</span>
      </div>
    `;
  }

  // Render entries list
  renderEntries(entries) {
    if (entries.length === 0) {
      return `
        <div class="guestbook-entries">
          <p class="no-entries">No entries yet. Be the first to sign!</p>
        </div>
      `;
    }

    const entriesHtml = entries.map(entry => this.renderEntry(entry)).join('');

    return `
      <div class="guestbook-entries">
        <h3>Signatures</h3>
        ${entriesHtml}
      </div>
    `;
  }

  // Render single entry with replies
  renderEntry(entry, isReply = false) {
    const date = new Date(entry.created_at);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const websiteLink = entry.website
      ? `<a href="${this.escapeHtml(entry.website)}" target="_blank" rel="noopener noreferrer" class="entry-website">🔗</a>`
      : '';

    const replyButton = !isReply ? `<button class="reply-button" onclick="window.guestbookInstance.showReplyForm('${entry.id}', '${this.escapeHtml(entry.name).replace(/'/g, "\\'")}')">Reply</button>` : '';

    const repliesHtml = !isReply && entry.replies && entry.replies.length > 0
      ? `<div class="replies">
          ${entry.replies.map(reply => this.renderEntry(reply, true)).join('')}
        </div>`
      : '';

    const replyIndicator = !isReply && entry.reply_count > 0 ? `<span class="reply-count">${entry.reply_count} ${entry.reply_count === 1 ? 'reply' : 'replies'}</span>` : '';

    return `
      <div class="guestbook-entry ${isReply ? 'reply-entry' : ''}">
        <div class="entry-header">
          <span class="entry-name">${this.escapeHtml(entry.name)}</span>
          ${websiteLink}
          <span class="entry-date">${formattedDate}</span>
          ${replyIndicator}
        </div>
        <div class="entry-message">${this.escapeHtml(entry.message)}</div>
        <div class="entry-actions">
          ${this.renderReactions(entry)}
          ${replyButton}
        </div>
        <div id="reply-form-container-${entry.id}"></div>
        ${repliesHtml}
      </div>
    `;
  }

  // Render reactions for an entry
  renderReactions(entry) {
    const reactionsHtml = Object.entries(this.reactionTypes).map(([type, emoji]) => {
      const count = entry[`${type}_count`] || 0;
      const hasReacted = this.hasUserReacted(entry.id, type);
      const activeClass = hasReacted ? 'active' : '';

      return `
        <button
          class="reaction-button ${activeClass}"
          data-entry-id="${entry.id}"
          data-reaction="${type}"
          onclick="window.guestbookInstance.toggleReaction('${entry.id}', '${type}')"
          title="${type.replace('_', ' ')}"
        >
          ${emoji} ${count > 0 ? count : ''}
        </button>
      `;
    }).join('');

    return `<div class="reactions">${reactionsHtml}</div>`;
  }

  // Check if user has already reacted
  hasUserReacted(entryId, reactionType) {
    const key = `reaction_${entryId}_${reactionType}`;
    return localStorage.getItem(key) === 'true';
  }

  // Show reply form for an entry
  showReplyForm(parentId, parentName) {
    const container = document.getElementById(`reply-form-container-${parentId}`);
    if (container) {
      container.innerHTML = this.renderForm(parentId, parentName);
      this.attachFormListeners(`reply-form-${parentId}`);
      // Scroll to form
      container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // Cancel reply
  cancelReply() {
    const replyContainers = document.querySelectorAll('[id^="reply-form-container-"]');
    replyContainers.forEach(container => {
      container.innerHTML = '';
    });
  }

  // Toggle reaction on an entry
  async toggleReaction(entryId, reactionType) {
    const key = `reaction_${entryId}_${reactionType}`;
    const hasReacted = this.hasUserReacted(entryId, reactionType);

    try {
      if (hasReacted) {
        // Remove reaction
        await this.removeReaction(entryId, reactionType);
        localStorage.removeItem(key);
      } else {
        // Add reaction
        await this.addReaction(entryId, reactionType);
        localStorage.setItem(key, 'true');
      }

      // Refresh to show updated counts
      await this.init();
    } catch (error) {
      console.error('Error toggling reaction:', error);
    }
  }

  // Add a reaction to Supabase
  async addReaction(entryId, reactionType) {
    const response = await fetch(
      `${this.supabaseUrl}/rest/v1/guestbook_reactions`,
      {
        method: 'POST',
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          entry_id: entryId,
          reaction_type: reactionType,
          user_identifier: this.userIdentifier
        })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to add reaction');
    }
  }

  // Remove a reaction from Supabase
  async removeReaction(entryId, reactionType) {
    const response = await fetch(
      `${this.supabaseUrl}/rest/v1/guestbook_reactions?entry_id=eq.${entryId}&reaction_type=eq.${reactionType}&user_identifier=eq.${this.userIdentifier}`,
      {
        method: 'DELETE',
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to remove reaction');
    }
  }

  // Attach event listeners
  attachEventListeners() {
    this.attachFormListeners('guestbook-sign-form');
  }

  // Attach listeners to a specific form
  attachFormListeners(formId) {
    const form = document.getElementById(formId);
    const messageInput = document.getElementById(`${formId}-message`);
    const charCount = form?.querySelector('.char-count');

    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    if (messageInput && charCount) {
      messageInput.addEventListener('input', (e) => {
        charCount.textContent = e.target.value.length;
      });
    }
  }

  // Handle form submission
  async handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formId = form.id;
    const statusEl = form.querySelector('.form-status');
    const submitButton = form.querySelector('button[type="submit"]');
    const parentId = form.dataset.parentId || null;

    // Get form data
    const name = form.querySelector('[name="name"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();
    const websiteInput = form.querySelector('[name="website"]');
    const website = websiteInput ? websiteInput.value.trim() : null;

    // Validate
    if (!name || !message) {
      this.showStatus(statusEl, 'Please fill in all required fields.', 'error');
      return;
    }

    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = parentId ? 'Posting...' : 'Signing...';

    try {
      // Create entry object
      const entry = {
        name: name,
        message: message,
        website: website || null,
        approved: false, // Requires admin approval
        parent_id: parentId ? parseInt(parentId) : null
      };

      // Submit to Supabase
      const response = await fetch(
        `${this.supabaseUrl}/rest/v1/guestbook_entries`,
        {
          method: 'POST',
          headers: {
            'apikey': this.supabaseKey,
            'Authorization': `Bearer ${this.supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(entry)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit entry');
      }

      // Show success message
      const successMsg = parentId
        ? 'Reply posted! It will appear after approval.'
        : 'Thanks for signing! Your entry will appear after approval.';
      this.showStatus(statusEl, successMsg, 'success');

      // Reset form
      form.reset();
      const charCount = form.querySelector('.char-count');
      if (charCount) charCount.textContent = '0';

      // If this was a reply, hide the form after a moment
      if (parentId) {
        setTimeout(() => {
          const container = document.getElementById(`reply-form-container-${parentId}`);
          if (container) container.innerHTML = '';
        }, 2000);
      }

      // Reload entries
      setTimeout(() => this.init(), 2000);

    } catch (error) {
      console.error('Error submitting guestbook entry:', error);
      this.showStatus(statusEl, 'Error submitting entry. Please try again.', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = parentId ? 'Post Reply' : 'Sign Guestbook';
    }
  }

  // Show status message
  showStatus(statusEl, message, type = 'info') {
    if (statusEl) {
      statusEl.textContent = message;
      statusEl.className = `form-status ${type}`;
      statusEl.style.display = 'block';

      setTimeout(() => {
        statusEl.style.display = 'none';
      }, 5000);
    }
  }

  // Escape HTML to prevent XSS
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Auto-initialize on page load
if (typeof window !== 'undefined') {
  window.Guestbook = Guestbook;

  const initGuestbook = () => {
    if (document.getElementById('guestbook-container')) {
      const guestbook = new Guestbook();
      window.guestbookInstance = guestbook; // Make it globally accessible
      guestbook.init();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGuestbook);
  } else {
    initGuestbook();
  }
}
