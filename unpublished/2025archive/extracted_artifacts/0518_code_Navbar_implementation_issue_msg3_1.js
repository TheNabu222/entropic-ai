function toggleConsciousnessMenu() {
    const menu = document.getElementById('consciousnessMenu');
    menu.classList.toggle('active');
    
    // Track the menu open event!
    if (menu.classList.contains('active')) {
        window.goatcounter.count({
            path: 'menu-consciousness-opened',
            title: 'Consciousness menu opened',
            event: true
        });
    }
}
