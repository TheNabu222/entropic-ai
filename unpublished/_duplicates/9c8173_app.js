// Character Database
const characters = [
  {
    name: "Hyena Diva (HD)",
    category: "hero",
    color: "#FF1493",
    icon: "🐆",
    species: "Spotted Hyena",
    status: "Aspiring Alderman",
    voice: "Silent (Ep 1-3), POWERFUL (Ep 4+)",
    signatureMove: "The Whoop",
    specialAbility: "Cosmic Connection",
    arc: "From Lost Cub to Political Powerhouse",
    bio: "HD was born in the Masai Mara but found a mystical Barbie doll that changed her life. Smuggled to Chicago in a tourist's carry-on bag, she discovered The Glenwood open mic and Nabu, who became her mother figure. Silent for her first episodes, Barbie granted her a powerful voice in Episode 4. Now she's running for alderman of the 49th Ward, bringing cosmic feminine energy to local politics.",
    personality: ["Fabulous", "Instinctual", "Strategic", "Fierce", "Pack-Oriented", "Diva Energy"],
    quotes: [
      "I'm not just some glorified accessory to your fragile masculinity. I am the future!",
      "What's a woman without a man? Well, that's exactly what I'm about to show you.",
      "Whoop-whoop-WHOOOP!"
    ],
    relationships: [
      { character: "Nabu", type: "Mother Figure" },
      { character: "Barbie", type: "Cosmic Guide" },
      { character: "Rizzlord", type: "Political Rival" }
    ],
    funFacts: [
      "Found Barbie doll in Masai Mara safari",
      "Smuggled to Chicago in tourist's carry-on bag",
      "First hyena to run for Chicago alderman",
      "Gained voice through Barbie's cosmic intervention"
    ],
    episodes: [1, 2, 3, 4, 5, 6, 7]
  },
  {
    name: "Nabu",
    category: "hero",
    color: "#9D00FF",
    icon: "🔮",
    species: "Human (5D Ascended)",
    status: "Glenwood Host / Cosmic Matriarch",
    dimension: "5D",
    signatureMove: "The Receipts",
    specialAbility: "Galactic Federation Connection",
    energy: "Groucho Marx meets Cosmic Mother",
    bio: "Guardian of The Glenwood open mic venue in Rogers Park, Nabu is a 5D ascended human with direct connection to the Galactic Federation of Worlds. She took HD under her wing, becoming her cosmic mother figure. With theatrical wit and protective matriarch energy, Nabu guides HD's journey while keeping cosmic forces in check. She accidentally revealed her own diary instead of a chatlog once, proving even cosmic beings have their moments.",
    personality: ["Witty", "Protective", "Mysterious", "Theatrical", "All-Knowing", "Sarcastic"],
    quotes: [
      "This is how we handle predators who think they can get away with making weird comments.",
      "Oh honey, NO. That's cute. You thought you could dominate anything?",
      "Well, kid, looks like you've finally found the stage where you belong."
    ],
    relationships: [
      { character: "HD", type: "Chosen Cub/Daughter" },
      { character: "GFW", type: "Connection" },
      { character: "Rizzlord", type: "Nemesis" }
    ],
    funFacts: [
      "Accidentally revealed own diary instead of chatlog",
      "Hosts The Glenwood Open Mic",
      "Can access GFW communications",
      "Protective matriarch energy"
    ],
    episodes: [1, 2, 3, 4, 5]
  },
  {
    name: "Rizzlord",
    category: "villain",
    color: "#FF6600",
    icon: "🎩",
    species: "Human (Unfortunate)",
    status: "Alderman (Somehow?!)",
    origin: "Ohio",
    signatureMove: "The Bad Take",
    specialAbility: "Surviving Cancellation",
    rizzLevel: "Questionable",
    bio: "A RedPilled debate-bro comedian from Ohio who somehow became HD's rival for the 49th Ward alderman position. Despite being cosmically yeeted into a portal by the combined forces of HD, Barbie, and Ken, Rizzlord still won the election. His toxic masculinity and terrible takes make him the perfect foil to HD's cosmic evolution. With a thick Ohio accent and unshakeable delusion, he represents everything the Kenergy movement opposes.",
    personality: ["Overconfident", "Delusional", "Debate-Brained", "Problematic", "RedPilled"],
    quotes: [
      "YOUR BODY MY CHOICE... wait, why is everyone booing me?",
      "I've got mad rizz, baby!",
      "This isn't over, Hyena Diva! The adrenochrome harvesting's gonna happen!"
    ],
    relationships: [
      { character: "HD", type: "Political Rival" },
      { character: "Nabu", type: "Nemesis" },
      { character: "The Incels", type: "Former Followers" }
    ],
    funFacts: [
      "Got cosmically yeeted into portal",
      "Still won alderman election despite everything",
      "Has thick Ohio accent",
      "Debate-bro comedian energy"
    ],
    episodes: [3, 4, 7]
  },
  {
    name: "Barbie",
    category: "cosmic",
    color: "#FF69B4",
    icon: "💖",
    species: "Cosmic Entity",
    status: "Galactic Guide",
    dimension: "Multiple",
    signatureMove: "Telepathic Link",
    specialAbility: "Granting Voice/Power",
    legacy: "Evolution from Bild Lili",
    bio: "The cosmic evolution of Bild Lili, a controversial 1950s German doll representing financial independence. What started as a symbol became something greater - Barbie ascended to become a Galactic Federation of Worlds representative. She guides beings toward empowerment and independence across dimensions. When HD found her in the Masai Mara, Barbie recognized a kindred spirit. In Episode 4, she granted HD the gift of voice, unlocking her true power.",
    personality: ["Ethereal", "Empowering", "Independent", "Fashionable", "Wise"],
    quotes: [
      "My darling Hyena Diva... it's time. Speak your truth.",
      "This was no ordinary toy... this was the ultimate symbol of divinity!"
    ],
    relationships: [
      { character: "HD", type: "Chosen One" },
      { character: "Ken", type: "Eternal Partner" },
      { character: "Bild Lili", type: "Original Form" },
      { character: "GFW", type: "Member" }
    ],
    funFacts: [
      "Evolved from controversial German doll Bild Lili",
      "Became symbol of independence and career success",
      "Now operates as cosmic being through GFW",
      "Grants HD her voice in Episode 4"
    ],
    episodes: [4, 5]
  },
  {
    name: "Ken",
    category: "cosmic",
    color: "#00CED1",
    icon: "💪",
    species: "Cosmic Entity",
    status: "Kenough",
    signatureMove: "Quiet Confidence",
    specialAbility: "Breaking Toxic Masculinity",
    philosophy: "Kenergy",
    bio: "Equal partner to Barbie and founder of the Kenergy philosophy. Ken represents true masculine strength - confident without arrogance, supportive without subservience. He's achieved his own success with an engineering degree and architecture teaching position, never needing to compete with Barbie. Through the GFW, he teaches former incels like Chet that real strength comes from self-knowledge, not domination. His quiet confidence is revolutionary.",
    personality: ["Self-Assured", "Supportive", "Confident", "Anti-Toxic", "Kenough"],
    quotes: [
      "I've always known my place. But now... it's time for everyone to realize theirs.",
      "Kenough.",
      "Real strength comes from embracing your own identity."
    ],
    relationships: [
      { character: "Barbie", type: "Equal Partner" },
      { character: "HD", type: "Supporter" },
      { character: "The Incels", type: "Teacher" }
    ],
    funFacts: [
      "Never needed to compete with Barbie",
      "Has engineering degree and teaches architecture",
      "Started the Kenergy movement",
      "Proves masculinity doesn't require dominance"
    ],
    achievements: ["Engineering Degree", "Architecture Teaching Position", "Self-Discovery Certification"],
    episodes: [5, 6, 7]
  },
  {
    name: "Bild Lili",
    category: "side",
    color: "#DB7093",
    icon: "👠",
    species: "Historical Figure",
    status: "Original Form",
    significance: "Precursor to Barbie",
    bio: "The original 1950s German doll, a financially independent woman misunderstood by history. Bild Lili was strategic, independent, and ahead of her time. Though history stereotyped her, she represented women's liberation and financial autonomy. Her essence evolved into Barbie, carrying forward the torch of independence.",
    personality: ["Independent", "Strategic", "Misunderstood"],
    funFacts: [
      "1950s German doll from Bild newspaper",
      "Represented financial independence",
      "Evolved into Barbie in 1959"
    ],
    episodes: [5]
  },
  {
    name: "The Matriarchs",
    category: "side",
    color: "#8B4513",
    icon: "🦴",
    species: "Spotted Hyenas",
    status: "Traditional Clan",
    bio: "HD's original hyena clan from the Masai Mara. These powerful matriarchs were disappointed in HD's obsession with a Barbie doll, viewing it as abandoning traditional hyena values. They represent the tension between tradition and evolution, pack expectations and individual destiny.",
    personality: ["Traditional", "Disappointed", "Protective"],
    funFacts: [
      "Hyena clans are matriarchal",
      "Didn't understand HD's cosmic calling",
      "Represent traditional expectations"
    ],
    episodes: [1]
  },
  {
    name: "Chet (The Incel)",
    category: "side",
    color: "#4169E1",
    icon: "🎮",
    species: "Human",
    status: "Redeemed",
    bio: "Former follower of Rizzlord who had a revelation about Kenergy. Chet represents the possibility of redemption and growth. After encountering Ken's teachings, he began to understand that real masculinity doesn't require dominance or resentment. His journey shows that even those lost to toxic ideology can find their way back.",
    personality: ["Recovering", "Learning", "Growing"],
    funFacts: [
      "Former incel who found Kenergy",
      "Represents possibility of redemption",
      "Learning from Ken's teachings"
    ],
    episodes: [7]
  },
  {
    name: "Glenwood Performers",
    category: "side",
    color: "#DAA520",
    icon: "🎤",
    species: "Various Humans",
    status: "Open Mic Regulars",
    bio: "The eclectic crew at The Glenwood open mic: Poet with Latte, Rabble Rouser with Tinfoil Hat, Chicken Suit Guy with Kazoo, and various trauma dumpers and artists. They create the chaotic, creative atmosphere where HD first found her voice.",
    personality: ["Chaotic", "Creative", "Supportive"],
    members: ["Poet with Latte", "Rabble Rouser with Tinfoil Hat", "Chicken Suit Guy with Kazoo"],
    funFacts: [
      "Featured in Episode 2",
      "Represent artistic chaos",
      "Witnessed HD's early journey"
    ],
    episodes: [2]
  }
];

// State management
const state = {
  currentFilter: 'all',
  currentSection: 'characters',
  searchQuery: '',
  selectedForComparison: [],
  comparisonMode: false
};

// Initialize app
function init() {
  renderCharacters();
  setupEventListeners();
  renderRelationshipMap();
}

// Render character cards
function renderCharacters() {
  const grid = document.getElementById('charactersGrid');
  grid.innerHTML = '';
  
  characters.forEach(char => {
    const card = createCharacterCard(char);
    grid.appendChild(card);
  });
  
  filterCharacters();
}

// Create character card
function createCharacterCard(char) {
  const card = document.createElement('div');
  card.className = 'character-card';
  card.setAttribute('data-category', char.category);
  card.setAttribute('data-name', char.name.toLowerCase());
  card.style.setProperty('--card-color', char.color);
  
  const searchableText = [
    char.name,
    char.category,
    char.species,
    char.status,
    ...(char.personality || []),
    ...(char.quotes || []),
    char.bio
  ].join(' ').toLowerCase();
  card.setAttribute('data-searchable', searchableText);
  
  card.innerHTML = `
    <div class="character-header">
      <div class="character-icon" style="background: ${char.color};">
        ${char.icon}
      </div>
      <div>
        <div class="character-name">${char.name}</div>
        <div class="character-status">${char.status || char.significance || ''}</div>
      </div>
    </div>
    
    <div class="character-stats">
      <div class="stat-item">
        <span class="stat-label">Species:</span>
        <span class="stat-value">${char.species}</span>
      </div>
      ${char.signatureMove ? `
        <div class="stat-item">
          <span class="stat-label">Signature Move:</span>
          <span class="stat-value">${char.signatureMove}</span>
        </div>
      ` : ''}
      ${char.specialAbility ? `
        <div class="stat-item">
          <span class="stat-label">Special Ability:</span>
          <span class="stat-value">${char.specialAbility}</span>
        </div>
      ` : ''}
    </div>
    
    ${char.personality ? `
      <div class="character-personality">
        ${char.personality.map(trait => `<span class="personality-tag">${trait}</span>`).join('')}
      </div>
    ` : ''}
    
    <div class="character-episodes">
      Episodes: ${char.episodes ? char.episodes.join(', ') : 'N/A'}
    </div>
  `;
  
  card.addEventListener('click', () => openCharacterModal(char));
  
  return card;
}

// Open character modal
function openCharacterModal(char) {
  const modal = document.getElementById('characterModal');
  const modalBody = document.getElementById('modalBody');
  
  modalBody.style.setProperty('--modal-color', char.color);
  
  modalBody.innerHTML = `
    <div class="modal-header">
      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
        <div class="character-icon" style="background: ${char.color}; width: 80px; height: 80px; font-size: 40px;">
          ${char.icon}
        </div>
        <div>
          <h2 class="modal-character-name" style="color: ${char.color};">${char.name}</h2>
          <p style="color: var(--color-text-secondary);">${char.status || char.significance || ''}</p>
        </div>
      </div>
    </div>
    
    <div class="modal-section">
      <h3>Biography</h3>
      <p>${char.bio}</p>
    </div>
    
    ${char.arc ? `
      <div class="modal-section">
        <h3>Character Arc</h3>
        <p>${char.arc}</p>
      </div>
    ` : ''}
    
    ${char.quotes && char.quotes.length > 0 ? `
      <div class="modal-section">
        <h3>Iconic Quotes</h3>
        ${char.quotes.map(quote => `<div class="quote-item">"${quote}"</div>`).join('')}
      </div>
    ` : ''}
    
    ${char.relationships && char.relationships.length > 0 ? `
      <div class="modal-section">
        <h3>Relationships</h3>
        ${char.relationships.map(rel => `
          <div class="relationship-item">
            <span><strong>${rel.character}</strong></span>
            <span style="color: var(--color-text-secondary);">${rel.type}</span>
          </div>
        `).join('')}
      </div>
    ` : ''}
    
    ${char.funFacts && char.funFacts.length > 0 ? `
      <div class="modal-section">
        <h3>Fun Facts</h3>
        ${char.funFacts.map(fact => `<div class="fun-fact-item">${fact}</div>`).join('')}
      </div>
    ` : ''}
    
    ${char.achievements && char.achievements.length > 0 ? `
      <div class="modal-section">
        <h3>Achievements</h3>
        <ul>
          ${char.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
    
    ${char.members && char.members.length > 0 ? `
      <div class="modal-section">
        <h3>Members</h3>
        <ul>
          ${char.members.map(member => `<li>${member}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
  `;
  
  modal.classList.add('show');
  
  // Easter egg: Whoop sound for HD
  if (char.name.includes('Hyena Diva')) {
    createSparkles(modal);
  }
}

// Filter characters
function filterCharacters() {
  const cards = document.querySelectorAll('.character-card');
  const filter = state.currentFilter;
  const search = state.searchQuery.toLowerCase();
  
  cards.forEach(card => {
    const category = card.getAttribute('data-category');
    const searchable = card.getAttribute('data-searchable');
    
    const matchesFilter = filter === 'all' || category === filter;
    const matchesSearch = search === '' || searchable.includes(search);
    
    if (matchesFilter && matchesSearch) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

// Setup event listeners
function setupEventListeners() {
  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      state.currentFilter = e.target.getAttribute('data-filter');
      filterCharacters();
    });
  });
  
  // Navigation buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      const section = e.target.getAttribute('data-section');
      state.currentSection = section;
      
      document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
      document.getElementById(section + 'Section').classList.add('active');
    });
  });
  
  // Search
  document.getElementById('searchBar').addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    filterCharacters();
  });
  
  // Random character
  document.getElementById('randomBtn').addEventListener('click', () => {
    const randomChar = characters[Math.floor(Math.random() * characters.length)];
    openCharacterModal(randomChar);
    createSparkles(document.body);
  });
  
  // Modal close
  document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('characterModal').classList.remove('show');
  });
  
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('characterModal');
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });
  
  // GFW symbol easter egg
  document.getElementById('gfwSymbol').addEventListener('click', (e) => {
    const facts = [
      "The Galactic Federation of Worlds has been guiding Earth's evolution for millennia!",
      "Barbie and Ken are ascended cosmic beings representing balanced divine energy!",
      "The Glenwood is a dimensional portal disguised as an open mic venue!",
      "Hyenas are matriarchal - female leaders are the natural order!",
      "Kenergy is spreading across dimensions, healing toxic masculinity!",
      "Rogers Park (49th Ward) is a cosmic hot spot for awakening!"
    ];
    
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    alert('✨ COSMIC WISDOM ✨\n\n' + randomFact);
    createSparkles(e.target);
  });
}

// Create sparkle effect
function createSparkles(element) {
  const sparkles = ['✨', '💫', '⭐', '🌟', '💖', '🦋'];
  
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
      sparkle.style.left = Math.random() * 100 + '%';
      sparkle.style.top = Math.random() * 100 + '%';
      
      element.style.position = 'relative';
      element.appendChild(sparkle);
      
      setTimeout(() => sparkle.remove(), 1000);
    }, i * 100);
  }
}

// Render relationship map
function renderRelationshipMap() {
  const svg = document.getElementById('relationshipSvg');
  const width = svg.clientWidth || 1000;
  const height = 600;
  
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  
  // Character positions (simplified layout)
  const positions = {
    'Hyena Diva (HD)': { x: width / 2, y: height / 2 },
    'Nabu': { x: width / 2 - 200, y: height / 2 - 150 },
    'Barbie': { x: width / 2 + 200, y: height / 2 - 150 },
    'Ken': { x: width / 2 + 250, y: height / 2 + 100 },
    'Rizzlord': { x: width / 2, y: height / 2 + 180 }
  };
  
  const mainChars = characters.filter(c => positions[c.name]);
  
  // Draw connections
  const connections = [
    { from: 'Nabu', to: 'Hyena Diva (HD)', color: '#9D00FF', label: 'Mother' },
    { from: 'Barbie', to: 'Hyena Diva (HD)', color: '#FF69B4', label: 'Guide' },
    { from: 'Hyena Diva (HD)', to: 'Rizzlord', color: '#FF6600', label: 'Rivals' },
    { from: 'Barbie', to: 'Ken', color: '#00CED1', label: 'Partners' }
  ];
  
  connections.forEach(conn => {
    const from = positions[conn.from];
    const to = positions[conn.to];
    
    if (from && to) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', from.x);
      line.setAttribute('y1', from.y);
      line.setAttribute('x2', to.x);
      line.setAttribute('y2', to.y);
      line.setAttribute('stroke', conn.color);
      line.setAttribute('stroke-width', '3');
      line.setAttribute('opacity', '0.6');
      svg.appendChild(line);
    }
  });
  
  // Draw character nodes
  mainChars.forEach(char => {
    const pos = positions[char.name];
    
    // Circle background
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', pos.x);
    circle.setAttribute('cy', pos.y);
    circle.setAttribute('r', '50');
    circle.setAttribute('fill', char.color);
    circle.setAttribute('opacity', '0.9');
    circle.style.cursor = 'pointer';
    circle.addEventListener('click', () => openCharacterModal(char));
    svg.appendChild(circle);
    
    // Icon
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', pos.x);
    text.setAttribute('y', pos.y + 10);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '32');
    text.textContent = char.icon;
    text.style.cursor = 'pointer';
    text.addEventListener('click', () => openCharacterModal(char));
    svg.appendChild(text);
    
    // Name label
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', pos.x);
    label.setAttribute('y', pos.y + 75);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('font-size', '14');
    label.setAttribute('font-weight', '600');
    label.setAttribute('fill', 'var(--color-text)');
    label.textContent = char.name;
    svg.appendChild(label);
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}