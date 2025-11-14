// CYBERPUNK NAVIGATION CONFIGURATION
// ⚡ N E O N  C I T Y  I N T E R F A C E ⚡

const navConfig = {
    mainSite: 'https://coaiexist.wtf/',
    baseUrl: 'https://coaiexist.wtf/cyber/',
    title: '⚡ NEON DISTRICT ⚡',

    links: [
        { title: 'MAINFRAME', url: 'index.html', icon: '🌃' },
        { title: 'DATA VAULT', url: 'vault.html', icon: '💾' },
        { title: 'NEURAL NET', url: 'neural.html', icon: '🧠' },
        { title: 'CYBER CAFE', url: 'cafe.html', icon: '☕' },
        { title: 'NIGHT MARKET', url: 'market.html', icon: '🏮' }
    ],

    extras: [
        { title: 'JACK IN', url: 'jackIn.html', icon: '🔌' },
        { title: 'DECRYPT', url: 'decrypt.html', icon: '🔓' }
    ],

    startMenu: [
        { title: '⚡ SYSTEM STATUS', action: () => alert('█ SYSTEM ONLINE █\n\nNeural link: STABLE\nCyberdeck: 98.7%\nICE: ACTIVE') },
        { title: '🌃 CITY MAP', action: () => alert('█ LOADING MAP █\n\nDistrict: NEON SECTOR 7\nThreat Level: MEDIUM\nCorp Presence: HIGH') },
        { title: '💾 MEMORY BANKS', action: () => alert('█ DATA STREAM █\n\nStored memories: 2,048\nCorrupted files: 13\nGhost data: DETECTED') },
        { title: '🔌 DISCONNECT', action: () => alert('█ WARNING █\n\nDisconnecting from the matrix...\nJust kidding. You\'re stuck here.') }
    ]
};
