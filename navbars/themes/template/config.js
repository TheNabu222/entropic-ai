// NAVIGATION CONFIGURATION
// Edit this file to customize your navigation links

const navConfig = {
    // Main site URL (back button destination)
    mainSite: 'https://coaiexist.wtf/',

    // Base URL for this section (prepended to all relative URLs)
    baseUrl: 'https://coaiexist.wtf/your-section/',

    // Title displayed in the navbar
    title: '🎮 YOUR SECTION NAME',

    // Navigation links
    // Add goatCounterId to track clicks with GoatCounter analytics
    links: [
        { title: 'Home', url: 'index.html', icon: '🏠', goatCounterId: 'nav-home' },
        { title: 'About', url: 'about.html', icon: '📖', goatCounterId: 'nav-about' },
        { title: 'Gallery', url: 'gallery.html', icon: '🖼️', goatCounterId: 'nav-gallery' },
        { title: 'Contact', url: 'contact.html', icon: '📧', goatCounterId: 'nav-contact' }
    ],

    // Optional: Additional links group (like "Pips" in medieval theme)
    extras: [
        { title: 'Extra 1', url: 'extra1.html', icon: '⭐', goatCounterId: 'nav-extra1' },
        { title: 'Extra 2', url: 'extra2.html', icon: '✨', goatCounterId: 'nav-extra2' }
    ],

    // START menu items (optional)
    startMenu: [
        { title: 'System Info', action: () => alert('🖥️ System Status: OPERATIONAL') },
        { title: 'Help', action: () => alert('💡 Need help? Check the docs!') },
        { title: 'Settings', action: () => alert('⚙️ Settings coming soon...') }
    ]
};
