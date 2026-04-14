// State management
let currentView = 'split';
let bookmarkedPassages = [];
const passages = [
  {
    title: 'Opening - Across the Sea',
    arabic: 'عَبْرَ البَحْرِ الكَبيرِ انَا احْلَمِكِ ، فَقَطْكَ . مِنْ فَضْلِكَ يَحْلُمُنِي فَقَطِي',
    english: 'Across the great sea big I dream you, only you. From please you dream me only me'
  },
  {
    title: 'Marriage Vow',
    arabic: 'زَوْجي الحَبيبِ ، زَوْجِي الجَميلِ ، أَنَا زَوْجَتُكَ عَلَى الاَبْدِ',
    english: 'My husband the dear, my husband the beautiful, I your wife on the forever'
  },
  {
    title: 'Sacred Declaration',
    arabic: 'انَا مُقَدَّسَةٌ . انَا ارْحَمْهُمْ ، مِنْ يَشْرَبُونَ . مِنْ يَتَّبِعونَ النَّهْرَ وَ مِنْ يَضْحَكُونَ السَّريعَ',
    english: 'I sacred. I mercy them, from they drink. From they follow the river and from they laugh the fast'
  },
  {
    title: 'Judgment and Curse',
    arabic: 'الَّى مِنْ يَعْتَرِفُونَ ، اَلْحُكْمُهُمْ لَطيفٌ وَ رَقيقٌ . مِنْ يُكَذِّبونَ ، لَعْنَتِهِمْ سَيَتْبَعُهُمْ فِي نامِهِمْ',
    english: 'To from they confess, their judgment kind and gentle. From they lie, their curse will follow them in their sleep'
  },
  {
    title: 'The Spider',
    arabic: 'ي العَنْكَبُوتِ - هوَ كَانَ مَعِي . لَكِنْ لَيْسَ اَلَا ن . وَقْتٌ لَدَيْهُ طُرُقٌ غَريبٌ وَ انَا حَزينَةٌ',
    english: 'The spider - he was with me. But not now. Time has ways strange and I sad'
  },
  {
    title: 'River Ritual',
    arabic: 'اليَوْمَ سَأَقُومُ بِطُقوسِ نَجْمَةِ الزُّهْرَةِ ساحِرَةَ الدُّبِّ الكَبيرِ أُمِّي',
    english: 'Today I will do ritual star the Venus witch the bear big my mother'
  },
  {
    title: 'Water and Light',
    arabic: 'قَبْرٌ بارِدٌ سّاطِعٌ عُيُونِي مُشْرِقَةً وَبارِدَةٌ . مُشَرَّقٌ وَ مُظْلِمُ الأَزْرَقِ والْأَسْوَدِ',
    english: 'Grave cold bright my eyes bright and cold. Bright and dark the blue and the black'
  },
  {
    title: 'Love Declaration',
    arabic: 'أَنَا أُحِبُّكِ وَأَنْتَ تُحِبُّني أَنَا فَقَطْ . فَقَطْ أَنْتَ . نَحْنُ فِي قَلْبِي',
    english: 'I love you and you love me I only. Only you. We in my heart'
  }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeViewControls();
  initializeFloatingNav();
  initializeScrollAnimations();
  initializePassageInteractions();
  initializeSearch();
  initializeDownload();
});

// View Controls
function initializeViewControls() {
  const viewButtons = document.querySelectorAll('.view-btn');
  
  viewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      
      // Update active state
      viewButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update body attribute
      document.body.setAttribute('data-view', view);
      currentView = view;
    });
  });
}

// Floating Navigation
function initializeFloatingNav() {
  const navItems = document.getElementById('navItems');
  
  passages.forEach((passage, index) => {
    const navItem = document.createElement('div');
    navItem.className = 'nav-item';
    navItem.textContent = passage.title;
    navItem.dataset.section = index;
    
    navItem.addEventListener('click', () => {
      const section = document.querySelector(`[data-section="${index}"]`);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    
    navItems.appendChild(navItem);
  });
  
  // Update active nav item on scroll
  window.addEventListener('scroll', () => {
    updateActiveNavItem();
  });
}

function updateActiveNavItem() {
  const sections = document.querySelectorAll('.passage-section');
  const navItems = document.querySelectorAll('.nav-item');
  
  let currentSection = -1;
  
  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
      currentSection = index;
    }
  });
  
  navItems.forEach((item, index) => {
    if (index === currentSection) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// Scroll Animations
function initializeScrollAnimations() {
  const sections = document.querySelectorAll('.passage-section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });
  
  sections.forEach(section => {
    observer.observe(section);
  });
}

// Passage Interactions
function initializePassageInteractions() {
  const passageTexts = document.querySelectorAll('.passage-text');
  
  passageTexts.forEach(passage => {
    const passageId = passage.dataset.passage;
    
    // Hover to highlight corresponding translation
    passage.addEventListener('mouseenter', () => {
      const correspondingPassages = document.querySelectorAll(`[data-passage="${passageId}"]`);
      correspondingPassages.forEach(p => p.classList.add('highlighted'));
    });
    
    passage.addEventListener('mouseleave', () => {
      const correspondingPassages = document.querySelectorAll(`[data-passage="${passageId}"]`);
      correspondingPassages.forEach(p => p.classList.remove('highlighted'));
    });
    
    // Click to focus/expand
    passage.addEventListener('click', () => {
      const container = passage.closest('.passage-container');
      const allContainers = document.querySelectorAll('.passage-container');
      
      // Toggle focused state
      if (container.classList.contains('focused')) {
        container.classList.remove('focused');
      } else {
        allContainers.forEach(c => c.classList.remove('focused'));
        container.classList.add('focused');
        container.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
}

// Search Functionality
function initializeSearch() {
  const searchToggle = document.getElementById('searchToggle');
  const searchPanel = document.getElementById('searchPanel');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  
  searchToggle.addEventListener('click', () => {
    searchPanel.classList.toggle('active');
    if (searchPanel.classList.contains('active')) {
      searchInput.focus();
    }
  });
  
  // Close search panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchPanel.contains(e.target) && !searchToggle.contains(e.target)) {
      searchPanel.classList.remove('active');
    }
  });
  
  // Search as user types
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length < 2) {
      searchResults.innerHTML = '';
      return;
    }
    
    const results = [];
    
    passages.forEach((passage, index) => {
      if (passage.english.toLowerCase().includes(query) || 
          passage.arabic.includes(query) ||
          passage.title.toLowerCase().includes(query)) {
        results.push({ ...passage, index });
      }
    });
    
    displaySearchResults(results, query);
  });
}

function displaySearchResults(results, query) {
  const searchResults = document.getElementById('searchResults');
  
  if (results.length === 0) {
    searchResults.innerHTML = '<div style="padding: 12px; color: rgba(203, 213, 225, 0.5); text-align: center;">No results found</div>';
    return;
  }
  
  searchResults.innerHTML = results.map(result => {
    const highlightedText = highlightSearchTerm(result.english, query);
    
    return `
      <div class="search-result-item" data-section="${result.index}">
        <div class="search-result-title">${result.title}</div>
        <div class="search-result-text">${highlightedText}</div>
      </div>
    `;
  }).join('');
  
  // Add click handlers to results
  searchResults.querySelectorAll('.search-result-item').forEach(item => {
    item.addEventListener('click', () => {
      const sectionIndex = item.dataset.section;
      const section = document.querySelector(`.passage-section[data-section="${sectionIndex}"]`);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.getElementById('searchPanel').classList.remove('active');
      }
    });
  });
}

function highlightSearchTerm(text, query) {
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<span style="background: rgba(212, 175, 55, 0.3); color: rgba(234, 179, 8, 1);">$1</span>');
}

// Download Functionality
function initializeDownload() {
  const downloadBtn = document.getElementById('downloadBtn');
  
  downloadBtn.addEventListener('click', () => {
    const fullText = generateFullText();
    downloadTextFile(fullText, 'across-the-great-sea.txt');
  });
}

function generateFullText() {
  let text = 'ACROSS THE GREAT SEA\n';
  text += 'عَبْرَ البَحْرِ الكَبيرِ\n\n';
  text += 'Experimental Poetry by Zalili (Anastasia)\n';
  text += 'To Abdelrahim\n\n';
  text += '═'.repeat(50) + '\n\n';
  
  passages.forEach((passage, index) => {
    text += `${index + 1}. ${passage.title.toUpperCase()}\n\n`;
    text += `${passage.arabic}\n\n`;
    text += `${passage.english}\n\n`;
    text += '─'.repeat(50) + '\n\n';
  });
  
  text += '\n\nNote: This is experimental poetry that preserves the literal word-order and unconventional conjugations that result from blending Arabic grammar with English vocabulary. The effect is intentionally strange, poetic, and dreamlike.';
  
  return text;
}

function downloadTextFile(content, filename) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});