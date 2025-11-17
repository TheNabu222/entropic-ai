// Personal Updates - Public Display
// Loads and displays published personal updates on the main page

class PersonalUpdates {
    constructor(containerId, options = {}) {
        this.supabaseUrl = 'https://aqxrogaltuwtlparwdkq.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxeHJvZ2FsdHV3dGxwYXJ3ZGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2MTcxNzgsImV4cCI6MjA0NzE5MzE3OH0.p7jFJp8MUzCx_-u1P6VkWs-h_dKSwQvLF0R5lOdpGVU';

        // Check if supabase is available
        if (typeof window.supabase === 'undefined') {
            console.error('Supabase library not loaded!');
            return;
        }

        this.supabase = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
        this.supabase = supabase.createClient(this.supabaseUrl, this.supabaseKey);

        this.containerId = containerId;
        this.options = {
            limit: options.limit || 10,
            category: options.category || null,
            showFeaturedOnly: options.showFeaturedOnly || false,
            showLoadMore: options.showLoadMore !== false,
            animateIn: options.animateIn !== false
        };

        this.updates = [];
        this.offset = 0;

        this.init();
    }

    async init() {
        await this.loadUpdates();
    }

    async loadUpdates(loadMore = false) {
        try {
            const container = document.getElementById(this.containerId);
            if (!container) {
                console.error('Container not found:', this.containerId);
                return;
            }

            if (!loadMore) {
                container.innerHTML = '<div class="loading-updates">✨ Loading cosmic updates...</div>';
            }

            // Build query
            let query = this.supabase
                .from('personal_updates')
                .select('*')
                .eq('published', true)
                .order('created_at', { ascending: false });

            // Apply filters
            if (this.options.category) {
                query = query.eq('category', this.options.category);
            }

            if (this.options.showFeaturedOnly) {
                query = query.eq('featured', true);
            }

            // Apply pagination
            if (loadMore) {
                query = query.range(this.offset, this.offset + this.options.limit - 1);
            } else {
                query = query.limit(this.options.limit);
                this.offset = 0;
            }

            const { data, error } = await query;

            if (error) throw error;

            if (loadMore) {
                this.updates = [...this.updates, ...(data || [])];
            } else {
                this.updates = data || [];
            }

            this.offset += (data || []).length;

            this.render();
        } catch (error) {
            console.error('Error loading updates:', error);
            const container = document.getElementById(this.containerId);
            if (container) {
                container.innerHTML = '<div class="error-updates">⚠️ Error loading updates</div>';
            }
        }
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        if (this.updates.length === 0) {
            container.innerHTML = '<div class="no-updates">No updates yet. Check back soon!</div>';
            return;
        }

        const updatesHtml = this.updates.map((update, index) => {
            const animationDelay = this.options.animateIn ? `style="animation-delay: ${index * 0.1}s;"` : '';
            return `
                <div class="personal-update-card ${this.options.animateIn ? 'fade-in' : ''}" ${animationDelay}>
                    ${update.featured ? '<div class="featured-badge">⭐ Featured ⭐</div>' : ''}

                    ${update.title ? `<h3 class="update-title">${this.escapeHtml(update.title)}</h3>` : ''}

                    <div class="update-meta">
                        <span class="update-category ${update.category}">${this.getCategoryIcon(update.category)} ${update.category}</span>
                        <span class="update-date">${this.formatDate(update.created_at)}</span>
                    </div>

                    <div class="update-body">
                        ${update.content}
                    </div>

                    ${this.renderMedia(update.media_type, update.media_url)}
                </div>
            `;
        }).join('');

        const loadMoreButton = this.options.showLoadMore ? `
            <div class="load-more-container">
                <button class="load-more-btn" onclick="personalUpdates.loadMore()">
                    ✨ Load More Updates ✨
                </button>
            </div>
        ` : '';

        container.innerHTML = updatesHtml + loadMoreButton;
    }

    renderMedia(mediaType, mediaUrl) {
        if (!mediaType || mediaType === 'none' || !mediaUrl) return '';

        switch (mediaType) {
            case 'youtube':
                return `
                    <div class="update-media">
                        <div class="video-container">
                            <iframe
                                src="https://www.youtube.com/embed/${mediaUrl}"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen>
                            </iframe>
                        </div>
                    </div>
                `;

            case 'soundcloud':
                return `
                    <div class="update-media">
                        <iframe width="100%" height="166" scrolling="no" frameborder="no"
                            src="https://w.soundcloud.com/player/?url=${encodeURIComponent(mediaUrl)}&color=%23f312af&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true">
                        </iframe>
                    </div>
                `;

            case 'gif':
            case 'image':
                return `
                    <div class="update-media">
                        <img src="${mediaUrl}" alt="Update media" loading="lazy">
                    </div>
                `;

            default:
                return '';
        }
    }

    getCategoryIcon(category) {
        const icons = {
            'artwork': '🎨',
            'poetry': '📝',
            'blog': '💭',
            'video': '🎥',
            'update': '✨',
            'announcement': '📢'
        };
        return icons[category] || '✨';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }
    }

    async loadMore() {
        await this.loadUpdates(true);
    }

    async refresh() {
        this.offset = 0;
        await this.loadUpdates(false);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Auto-initialize if container exists
let personalUpdates;
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('personalUpdatesContainer');
    if (container) {
        personalUpdates = new PersonalUpdates('personalUpdatesContainer', {
            limit: 5,
            showLoadMore: true,
            animateIn: true
        });
    }
});
