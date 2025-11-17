// Personal Updates Admin JavaScript
// Manages the admin interface for creating and managing personal updates

class PersonalUpdatesAdmin {
    constructor() {
        this.supabaseUrl = 'https://aqxrogaltuwtlparwdkq.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxeHJvZ2FsdHV3dGxwYXJ3ZGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2MTcxNzgsImV4cCI6MjA0NzE5MzE3OH0.p7jFJp8MUzCx_-u1P6VkWs-h_dKSwQvLF0R5lOdpGVU';
        this.supabase = supabase.createClient(this.supabaseUrl, this.supabaseKey);

        this.quill = null;
        this.editingId = null;
        this.gifList = [];

        this.init();
    }

    async init() {
        // Initialize Quill editor
        this.quill = new Quill('#editor', {
            theme: 'snow',
            placeholder: 'Share your thoughts, art, poetry, or updates with the void...',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'color': [] }, { 'background': [] }],
                    ['link'],
                    ['clean']
                ]
            }
        });

        // Set up event listeners
        this.setupEventListeners();

        // Load GIF list
        await this.loadGifList();

        // Load existing updates
        await this.loadUpdates();

        // Update stats
        await this.updateStats();
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');

        // Form submission
        const form = document.getElementById('updateForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Form submitted');
                this.handleSubmit();
            });
            console.log('Form submit listener added');
        } else {
            console.error('Update form not found!');
        }
        // Form submission
        document.getElementById('updateForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Media type selector
        document.getElementById('mediaType').addEventListener('change', (e) => {
            this.handleMediaTypeChange(e.target.value);
        });

        // GIF search
        document.getElementById('gifSearch').addEventListener('input', (e) => {
            this.filterGifs(e.target.value);
        });

        // Preview button
        const previewBtn = document.getElementById('previewBtn');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => {
                console.log('Preview button clicked');
                this.showPreview();
            });
        }

        // Clear button
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                console.log('Clear button clicked');
                this.clearForm();
            });
        }

        // Close preview
        const closePreview = document.getElementById('closePreview');
        if (closePreview) {
            closePreview.addEventListener('click', () => {
                console.log('Close preview clicked');
                document.getElementById('previewModal').classList.remove('active');
            });
        }

        console.log('All event listeners set up successfully');
        document.getElementById('previewBtn').addEventListener('click', () => {
            this.showPreview();
        });

        // Clear button
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearForm();
        });

        // Close preview
        document.getElementById('closePreview').addEventListener('click', () => {
            document.getElementById('previewModal').classList.remove('active');
        });
    }

    handleMediaTypeChange(type) {
        // Hide all media inputs
        document.querySelectorAll('.media-inputs').forEach(el => {
            el.classList.remove('active');
        });

        // Show selected media input
        const mediaInputs = {
            'youtube': 'youtubeInput',
            'soundcloud': 'soundcloudInput',
            'gif': 'gifInput',
            'image': 'imageInput'
        };

        if (mediaInputs[type]) {
            document.getElementById(mediaInputs[type]).classList.add('active');
        }
    }

    async loadGifList() {
        // In a real implementation, you'd fetch this from a server
        // For now, we'll use a predefined list of popular GIFs from the assets
        this.gifList = [
            '/assets/misc_gif/rainbow.gif',
            '/assets/misc_gif/wat.gif',
            '/assets/misc_gif/hero.gif',
            '/assets/misc_gif/bartxxx.gif',
            '/assets/classic_gifs/1(11).gif',
            '/assets/classic_gifs/1(10).gif',
            // Add more GIFs here or fetch from server
        ];

        this.renderGifGrid(this.gifList);
    }

    renderGifGrid(gifs) {
        const grid = document.getElementById('gifGrid');
        grid.innerHTML = gifs.map(gifUrl => `
            <div class="gif-option" data-gif="${gifUrl}">
                <img src="${gifUrl}" alt="GIF" loading="lazy">
            </div>
        `).join('');

        // Add click handlers
        grid.querySelectorAll('.gif-option').forEach(el => {
            el.addEventListener('click', () => {
                // Remove previous selection
                grid.querySelectorAll('.gif-option').forEach(opt => {
                    opt.classList.remove('selected');
                });

                // Select this one
                el.classList.add('selected');
                document.getElementById('selectedGif').value = el.dataset.gif;
            });
        });
    }

    filterGifs(searchTerm) {
        const filtered = this.gifList.filter(gif =>
            gif.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderGifGrid(filtered);
    }

    async handleSubmit() {
        console.log('handleSubmit called');
        try {
            // Get form values
            const title = document.getElementById('title').value.trim();
            const category = document.getElementById('category').value;
            const content = this.quill.root.innerHTML;
            const mediaType = document.getElementById('mediaType').value;
            const published = document.getElementById('published').checked;
            const featured = document.getElementById('featured').checked;

            console.log('Form data:', { title, category, mediaType, published, featured });

            // Validate
            if (!category) {
                this.showStatus('Please select a category', 'error');
                return;
            }

            if (this.quill.getText().trim().length === 0) {
                this.showStatus('Please enter some content', 'error');
                return;
            }

            // Get media URL based on type
            let mediaUrl = null;
            if (mediaType === 'youtube') {
                mediaUrl = this.processYouTubeUrl(document.getElementById('youtubeUrl').value);
            } else if (mediaType === 'soundcloud') {
                mediaUrl = document.getElementById('soundcloudUrl').value;
            } else if (mediaType === 'gif') {
                mediaUrl = document.getElementById('selectedGif').value;
            } else if (mediaType === 'image') {
                mediaUrl = document.getElementById('imageUrl').value;
            }

            // Prepare data
            const updateData = {
                title: title || null,
                content,
                category,
                media_type: mediaType,
                media_url: mediaUrl,
                published,
                featured
            };

            // Insert or update
            let result;
            if (this.editingId) {
                result = await this.supabase
                    .from('personal_updates')
                    .update(updateData)
                    .eq('id', this.editingId);

                this.editingId = null;
            } else {
                result = await this.supabase
                    .from('personal_updates')
                    .insert([updateData]);
            }

            if (result.error) throw result.error;

            // Show success
            this.showStatus(
                this.editingId ? 'Update saved successfully!' : 'Update posted successfully!',
                'success'
            );

            // Clear form
            this.clearForm();

            // Reload updates
            await this.loadUpdates();
            await this.updateStats();

        } catch (error) {
            console.error('Error submitting update:', error);
            this.showStatus('Error submitting update: ' + error.message, 'error');
        }
    }

    processYouTubeUrl(url) {
        // Extract video ID from various YouTube URL formats
        if (!url) return null;

        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
            /^([a-zA-Z0-9_-]{11})$/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }

        return url;
    }

    async loadUpdates() {
        try {
            const { data, error } = await this.supabase
                .from('personal_updates')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            this.renderUpdates(data || []);
        } catch (error) {
            console.error('Error loading updates:', error);
            document.getElementById('updatesContainer').innerHTML =
                '<p style="color: #ff4444; text-align: center;">Error loading updates</p>';
        }
    }

    renderUpdates(updates) {
        const container = document.getElementById('updatesContainer');

        if (updates.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--cyan);">No updates yet. Create your first one!</p>';
            return;
        }

        container.innerHTML = updates.map(update => `
            <div class="update-card" data-id="${update.id}">
                <div class="update-header">
                    <div>
                        ${update.title ? `<div class="update-title">${this.escapeHtml(update.title)}</div>` : ''}
                        <div class="update-meta">
                            <span class="update-badge badge-category">${update.category}</span>
                            <span class="update-badge badge-status">${update.published ? 'Published' : 'Draft'}</span>
                            ${update.featured ? '<span class="update-badge badge-featured">Featured</span>' : ''}
                            <span>${new Date(update.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div class="update-content">
                    ${update.content}
                </div>

                ${this.renderMedia(update.media_type, update.media_url)}

                <div class="update-actions">
                    <button class="btn-secondary" onclick="admin.editUpdate('${update.id}')">
                        ✏️ Edit
                    </button>
                    <button class="btn-secondary" onclick="admin.togglePublish('${update.id}', ${!update.published})">
                        ${update.published ? '📝 Unpublish' : '✅ Publish'}
                    </button>
                    <button class="btn-secondary" onclick="admin.toggleFeatured('${update.id}', ${!update.featured})">
                        ${update.featured ? '⭐ Unfeature' : '⭐ Feature'}
                    </button>
                    <button class="btn-danger" onclick="admin.deleteUpdate('${update.id}')">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderMedia(mediaType, mediaUrl) {
        if (!mediaType || mediaType === 'none' || !mediaUrl) return '';

        switch (mediaType) {
            case 'youtube':
                return `
                    <div class="update-media">
                        <iframe width="100%" height="315"
                            src="https://www.youtube.com/embed/${mediaUrl}"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen>
                        </iframe>
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
                        <img src="${mediaUrl}" alt="Media">
                    </div>
                `;

            default:
                return '';
        }
    }

    async editUpdate(id) {
        try {
            const { data, error } = await this.supabase
                .from('personal_updates')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            // Fill form with update data
            document.getElementById('title').value = data.title || '';
            document.getElementById('category').value = data.category;
            this.quill.root.innerHTML = data.content;
            document.getElementById('mediaType').value = data.media_type || 'none';
            document.getElementById('published').checked = data.published;
            document.getElementById('featured').checked = data.featured;

            // Handle media URL
            this.handleMediaTypeChange(data.media_type);
            if (data.media_type === 'youtube') {
                document.getElementById('youtubeUrl').value = data.media_url || '';
            } else if (data.media_type === 'soundcloud') {
                document.getElementById('soundcloudUrl').value = data.media_url || '';
            } else if (data.media_type === 'gif') {
                document.getElementById('selectedGif').value = data.media_url || '';
            } else if (data.media_type === 'image') {
                document.getElementById('imageUrl').value = data.media_url || '';
            }

            this.editingId = id;

            // Scroll to form
            window.scrollTo({ top: 0, behavior: 'smooth' });

            this.showStatus('Editing update - make changes and submit', 'success');
        } catch (error) {
            console.error('Error loading update:', error);
            this.showStatus('Error loading update: ' + error.message, 'error');
        }
    }

    async togglePublish(id, publish) {
        try {
            const { error } = await this.supabase
                .from('personal_updates')
                .update({ published: publish })
                .eq('id', id);

            if (error) throw error;

            await this.loadUpdates();
            await this.updateStats();
            this.showStatus(`Update ${publish ? 'published' : 'unpublished'} successfully!`, 'success');
        } catch (error) {
            console.error('Error toggling publish:', error);
            this.showStatus('Error updating status: ' + error.message, 'error');
        }
    }

    async toggleFeatured(id, featured) {
        try {
            const { error } = await this.supabase
                .from('personal_updates')
                .update({ featured: featured })
                .eq('id', id);

            if (error) throw error;

            await this.loadUpdates();
            await this.updateStats();
            this.showStatus(`Update ${featured ? 'featured' : 'unfeatured'} successfully!`, 'success');
        } catch (error) {
            console.error('Error toggling featured:', error);
            this.showStatus('Error updating status: ' + error.message, 'error');
        }
    }

    async deleteUpdate(id) {
        if (!confirm('Are you sure you want to delete this update? This cannot be undone.')) {
            return;
        }

        try {
            const { error } = await this.supabase
                .from('personal_updates')
                .delete()
                .eq('id', id);

            if (error) throw error;

            await this.loadUpdates();
            await this.updateStats();
            this.showStatus('Update deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting update:', error);
            this.showStatus('Error deleting update: ' + error.message, 'error');
        }
    }

    async updateStats() {
        try {
            const { data, error } = await this.supabase
                .from('personal_updates')
                .select('published, featured');

            if (error) throw error;

            const total = data.length;
            const published = data.filter(u => u.published).length;
            const drafts = total - published;
            const featured = data.filter(u => u.featured).length;

            document.getElementById('totalCount').textContent = total;
            document.getElementById('publishedCount').textContent = published;
            document.getElementById('draftCount').textContent = drafts;
            document.getElementById('featuredCount').textContent = featured;
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }

    showPreview() {
        const title = document.getElementById('title').value.trim();
        const content = this.quill.root.innerHTML;
        const category = document.getElementById('category').value;
        const mediaType = document.getElementById('mediaType').value;

        let mediaUrl = null;
        if (mediaType === 'youtube') {
            mediaUrl = this.processYouTubeUrl(document.getElementById('youtubeUrl').value);
        } else if (mediaType === 'soundcloud') {
            mediaUrl = document.getElementById('soundcloudUrl').value;
        } else if (mediaType === 'gif') {
            mediaUrl = document.getElementById('selectedGif').value;
        } else if (mediaType === 'image') {
            mediaUrl = document.getElementById('imageUrl').value;
        }

        const previewHtml = `
            <h2 style="color: var(--magenta); font-size: 2.5em; margin-bottom: 20px;">
                Preview
            </h2>
            ${title ? `<h3 style="color: var(--cyan); font-size: 2em; margin-bottom: 15px;">${this.escapeHtml(title)}</h3>` : ''}
            <div style="color: var(--purple); margin-bottom: 20px;">
                <span class="update-badge badge-category">${category || 'No category'}</span>
            </div>
            <div style="color: var(--cyan); font-size: 1.2em; line-height: 1.6; margin-bottom: 20px;">
                ${content}
            </div>
            ${this.renderMedia(mediaType, mediaUrl)}
        `;

        document.getElementById('previewContent').innerHTML = previewHtml;
        document.getElementById('previewModal').classList.add('active');
    }

    clearForm() {
        document.getElementById('title').value = '';
        document.getElementById('category').value = '';
        this.quill.setText('');
        document.getElementById('mediaType').value = 'none';
        document.getElementById('youtubeUrl').value = '';
        document.getElementById('soundcloudUrl').value = '';
        document.getElementById('imageUrl').value = '';
        document.getElementById('selectedGif').value = '';
        document.getElementById('published').checked = true;
        document.getElementById('featured').checked = false;
        this.handleMediaTypeChange('none');
        this.editingId = null;

        // Deselect GIFs
        document.querySelectorAll('.gif-option').forEach(el => {
            el.classList.remove('selected');
        });
    }

    showStatus(message, type) {
        const statusEl = document.getElementById('statusMessage');
        statusEl.textContent = message;
        statusEl.className = `status-message ${type}`;
        statusEl.style.display = 'block';

        setTimeout(() => {
            statusEl.style.display = 'none';
        }, 5000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize admin interface
let admin;
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing admin...');
    try {
        admin = new PersonalUpdatesAdmin();
        console.log('Admin instance created');
    } catch (error) {
        console.error('Error creating admin instance:', error);
        alert('Error initializing admin interface: ' + error.message);
    }
    admin = new PersonalUpdatesAdmin();
});
