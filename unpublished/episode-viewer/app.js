// Episode data
const episodes = {
  1: {
    title: "From Savannah to Stage",
    content: [
      { type: 'scene', text: 'Scene opens with a whimsical marching band tune. A sweeping shot of the Masai Mara, vibrant colors everywhere, with a cartoonish sun high in the sky.' },
      { type: 'narrator', text: 'In the heart of Africa, where the savannah stretches endlessly...' },
      { type: 'sound', text: '*WHOOSH*' },
      { type: 'scene', text: 'A safari jeep bounces along. Suddenly, a LION leaps!' },
      { type: 'dialog', character: 'TOURIST', text: 'Oh my goodness! Look at that magnificent creature!' },
      { type: 'scene', text: 'A BARBIE DOLL flies through the air, glittering in the sunlight.' },
      { type: 'sound', text: '*SPARKLE SOUNDS*' },
      { type: 'scene', text: 'Baby HYENA DIVA spots the doll from afar, eyes widening with wonder.' },
      { type: 'dialog', character: 'MATRIARCH', text: 'Child, what has captured your attention so?' },
      { type: 'dialog', character: 'HD', text: '[Mesmerized] ...Shiny...' },
      { type: 'scene', text: 'HD schemes. Under cover of night, she sneaks into the tourist camp.' },
      { type: 'stage', text: '[HD creeps past sleeping tourists, Barbie doll clutched in her jaws]' },
      { type: 'dialog', character: 'HD', text: '[Whispering] Must... get to... civilization...' },
      { type: 'scene', text: 'Through cunning and chaos, HD stows away on a cargo plane bound for Chicago.' },
      { type: 'narrator', text: 'And so began an unlikely journey, from the wild plains to the urban jungle...' },
      { type: 'scene', text: 'HD tumbles out of a crate in downtown Chicago, Barbie doll still in possession.' },
      { type: 'sound', text: '*CITY SOUNDS*' },
      { type: 'stage', text: '[HD runs through streets, dodging cars and pedestrians]' },
      { type: 'scene', text: 'Finally, she arrives at THE GLENWOOD, a mystical comedy club in Rogers Park.' },
      { type: 'dialog', character: 'NABU', text: 'Welcome, young one. I\'ve been expecting you.' },
      { type: 'dialog', character: 'HD', text: 'How did you—?' },
      { type: 'dialog', character: 'NABU', text: 'The GFW speaks to those who listen. Your destiny awaits... on stage.' },
      { type: 'scene', text: 'A glowing purple symbol appears above them - the mark of the Great Feminist Wave.' },
      { type: 'sound', text: '*MYSTICAL CHIME*' }
    ],
    teaser: 'HD takes the stage for the first time...',
    funFact: 'Hyenas are matriarchal - females lead the clan!',
    discussion: 'What moment made you realize HD was destined for greatness?'
  },
  2: {
    title: "Takes the Stage",
    content: [
      { type: 'scene', text: 'Looney Tunes chase sequence. HD slides through Glenwood doors in sparkly Barbie outfit as disgruntled performers exit.' },
      { type: 'sound', text: '*SLIDE WHISTLE*' },
      { type: 'dialog', character: 'NABU', text: 'And now, making her debut... HYENA DIVA!' },
      { type: 'stage', text: '[Spotlight hits HD. Crowd murmurs with curiosity]' },
      { type: 'dialog', character: 'HD', text: '[Nervous] So... I flew here from Africa...' },
      { type: 'scene', text: 'The crowd is silent. HD clutches her Barbie doll.' },
      { type: 'dialog', character: 'HD', text: '[Gaining confidence] Literally. I was in a cargo hold with 50 pounds of coffee beans!' },
      { type: 'sound', text: '*Scattered laughter*' },
      { type: 'dialog', character: 'HD', text: 'But you know what? That Barbie doll showed me something. You can be anything. Even a hyena doing standup in Chicago!' },
      { type: 'sound', text: '*WHOOP!*' },
      { type: 'scene', text: 'The crowd erupts in applause. Various eccentric performers watch from the wings.' },
      { type: 'narrator', text: 'Among them: a poet with a latte, a rabble rouser with conspiracy theories, and dreamers of all kinds.' },
      { type: 'dialog', character: 'HD', text: 'I mean, where else can a hyena find her voice? Certainly not the Masai Mara!' },
      { type: 'stage', text: '[HD launches into her origin story, crowd captivated]' },
      { type: 'dialog', character: 'HD', text: 'And that\'s how I ended up here, folks. Following a plastic doll to my destiny!' },
      { type: 'sound', text: '*THUNDEROUS APPLAUSE*' },
      { type: 'dialog', character: 'NABU', text: '[To audience] Remember this moment. You witnessed the birth of something extraordinary.' },
      { type: 'scene', text: 'HD takes a bow, Barbie doll held high, as the GFW symbol pulses behind her.' }
    ],
    teaser: 'A challenger approaches with dangerous "rizz"...',
    funFact: 'Open mics have launched countless careers - even for hyenas!',
    discussion: 'Which performer would YOU want to see at The Glenwood?'
  },
  3: {
    title: "The Great Rizz Battle",
    content: [
      { type: 'scene', text: 'Rizz Battle stage with wrestling-ring decorations. Rizz-o-meter buzzing with anticipation.' },
      { type: 'dialog', character: 'NARRATOR', text: 'Tonight... the ultimate test of charm... THE RIZZ BATTLE!' },
      { type: 'sound', text: '*DRAMATIC MUSIC*' },
      { type: 'scene', text: 'RIZZLORD enters, fedora tilted, confidence radiating.' },
      { type: 'dialog', character: 'RIZZLORD', text: 'Ladies and gentlemen, prepare to witness peak male performance.' },
      { type: 'stage', text: '[Rizzlord tips fedora at HD]' },
      { type: 'dialog', character: 'RIZZLORD', text: 'Hey baby, are you a hyena? Because you\'re making me howl!' },
      { type: 'scene', text: 'Crowd groans. Rizz-o-meter drops.' },
      { type: 'dialog', character: 'HD', text: '[Predatory grin] Oh, this should be interesting...' },
      { type: 'dialog', character: 'RIZZLORD', text: 'A creature of your... exotic nature... must appreciate a real alpha male.' },
      { type: 'scene', text: 'HD\'s instincts kick in. She circles him like prey.' },
      { type: 'dialog', character: 'HD', text: '[Low growl] You smell like... desperation and Axe body spray.' },
      { type: 'sound', text: '*CROWD OOOOHS*' },
      { type: 'dialog', character: 'NABU', text: '[Jumping on stage] STOP! Everyone, she\'s a CUB!' },
      { type: 'scene', text: 'Record scratch. Lights flash red.' },
      { type: 'dialog', character: 'NARRATOR', text: 'TO CATCH A PREDATOR: COMEDY EDITION' },
      { type: 'sound', text: '*ALARM SOUNDS*' },
      { type: 'stage', text: '[Chatlog appears on screen, scrolling, then GLITCHES to reveal Nabu\'s diary]' },
      { type: 'dialog', character: 'NABU', text: '[Reading] "Day 47: Must protect HD from inappropriate advances. She\'s destined for clan leadership, not this nonsense."' },
      { type: 'dialog', character: 'RIZZLORD', text: 'Wait, what? I didn\'t—' },
      { type: 'scene', text: 'A cosmic portal opens behind Rizzlord.' },
      { type: 'dialog', character: 'NABU', text: 'Begone, Rizzlord! Return when you\'ve learned some actual respect!' },
      { type: 'sound', text: '*YEET SOUND EFFECT*' },
      { type: 'stage', text: '[Rizzlord is sucked into the void, fedora spinning]' },
      { type: 'dialog', character: 'HD', text: 'What just happened?' },
      { type: 'dialog', character: 'NABU', text: 'Your first lesson in leadership: knowing when to spot a predator... of any species.' }
    ],
    teaser: 'HD discovers her voice - literally!',
    funFact: 'Hyena cubs are incredibly precocious and fiercely protected by the clan.',
    discussion: 'When did you first recognize Rizzlord as the villain?'
  },
  4: {
    title: "The Hyena\'s Campaign",
    content: [
      { type: 'scene', text: 'Montage of HD in "Barbie meets Mad Max" political couture. Banner: HYENA DIVA FOR ALDERMAN' },
      { type: 'sound', text: '*CAMPAIGN MUSIC*' },
      { type: 'dialog', character: 'NARRATOR', text: 'In a stunning turn of events, our heroine enters the political arena!' },
      { type: 'scene', text: 'Campaign rally. Wild supporters cheer. Signs everywhere: VOTE HD, WHOOPS FOR CHANGE' },
      { type: 'dialog', character: 'HD', text: '[Attempting to speak, only whoops come out] Whoop! ...Whoop?' },
      { type: 'stage', text: '[HD looks frustrated, clutches Barbie doll]' },
      { type: 'dialog', character: 'NABU', text: 'The GFW is calling you, HD. But first... you must face him again.' },
      { type: 'scene', text: 'Debate stage. Rizzlord has returned, now in a cheap suit.' },
      { type: 'dialog', character: 'RIZZLORD', text: 'The voters of Rogers Park deserve a REAL leader. Not some... animal!' },
      { type: 'sound', text: '*CROWD BOOS*' },
      { type: 'scene', text: 'HD tries to respond but can only whoop. Suddenly, a shimmering figure appears.' },
      { type: 'dialog', character: 'BARBIE', text: '[Ethereal, glowing] Hyena Diva... speak your truth.' },
      { type: 'dialog', character: 'HD', text: '[Confused] Barbie? You\'re... real?' },
      { type: 'dialog', character: 'BARBIE', text: 'I\'ve always been real. Just as your voice has always been there. Use it.' },
      { type: 'scene', text: 'The GFW symbol blazes. HD stands tall.' },
      { type: 'dialog', character: 'HD', text: '[Voice booming for the first time] I AM NO ANIMAL. I AM A LEADER!' },
      { type: 'sound', text: '*CROWD GOES WILD*' },
      { type: 'dialog', character: 'HD', text: 'Rizzlord, you represent everything wrong with leadership. Ego without empathy. Power without purpose!' },
      { type: 'dialog', character: 'RIZZLORD', text: '[Stammering] But... but my alpha status...' },
      { type: 'dialog', character: 'HD', text: 'There\'s nothing alpha about putting others down. True strength lifts everyone up!' },
      { type: 'scene', text: 'The crowd chants: "H-D! H-D! H-D!"' },
      { type: 'dialog', character: 'BARBIE', text: '[Fading] Your voice is your power. Never silence it again.' },
      { type: 'narrator', text: 'And in that moment, a leader was truly born.' }
    ],
    teaser: 'HD discovers the secret history of dolls...',
    funFact: 'The real Barbie was inspired by Bild Lili, a German doll from the 1950s!',
    discussion: 'What does it mean to find your voice?'
  },
  5: {
    title: "The Holy Grail of Dolls",
    content: [
      { type: 'scene', text: 'Cozy antique shop in Rogers Park. HD browsing shelves. A glass case glows mysteriously.' },
      { type: 'dialog', character: 'HD', text: 'What is that...?' },
      { type: 'scene', text: 'Inside the case: an original BILD LILI doll, emanating cosmic energy.' },
      { type: 'sound', text: '*MYSTICAL CHIME*' },
      { type: 'stage', text: '[HD reaches out, touches the glass. Reality SHIFTS]' },
      { type: 'dialog', character: 'NARRATOR', text: 'Transport sequence: 1950s Germany, cartoon style!' },
      { type: 'scene', text: 'Everything becomes vintage animation. BILD LILI appears, sassy and confident.' },
      { type: 'dialog', character: 'BILD LILI', text: '[German accent] Ah, another seeker of truth! Come, I show you something.' },
      { type: 'scene', text: 'Cartoon suitors pursue Lili, who expertly navigates their advances.' },
      { type: 'dialog', character: 'BILD LILI', text: 'They think I need them. But I was made for women, by women!' },
      { type: 'dialog', character: 'HD', text: 'But... I thought Barbie was the original?' },
      { type: 'dialog', character: 'NABU', text: '[Appearing in cartoon form] History is complex, dear HD.' },
      { type: 'stage', text: '[Montage showing Lili\'s evolution into Barbie]' },
      { type: 'dialog', character: 'NABU', text: 'Lili was independent. Barbie became aspirational. Both revolutionary in their time.' },
      { type: 'scene', text: 'KEN appears in the cartoon world.' },
      { type: 'dialog', character: 'KEN', text: '[Quietly] I was never meant to complete her. Just... complement her.' },
      { type: 'dialog', character: 'HD', text: 'So you\'re not an accessory?' },
      { type: 'dialog', character: 'KEN', text: 'I\'m a partner. There\'s a difference.' },
      { type: 'scene', text: 'Reality shifts back to the present. HD holds both understanding and her Barbie doll.' },
      { type: 'dialog', character: 'HD', text: '[Revelation] It was never about the doll. It was about what she represented.' },
      { type: 'dialog', character: 'NABU', text: 'Precisely. And now you understand partnership, not possession.' }
    ],
    teaser: 'Ken steps into the spotlight...',
    funFact: 'Bild Lili was originally a comic strip character before becoming a doll!',
    discussion: 'How do symbols change meaning over time?'
  },
  6: {
    title: "Kenough: The Unlikely Hero",
    content: [
      { type: 'scene', text: 'Back to the debate stage from the cliffhanger. Ken steps forward from the shadows, serious expression.' },
      { type: 'dialog', character: 'KEN', text: 'Rizzlord. We need to talk.' },
      { type: 'dialog', character: 'RIZZLORD', text: '[Mocking] Oh great, the accessory speaks!' },
      { type: 'scene', text: 'HD is about to unleash her voice, but Ken gently raises a hand.' },
      { type: 'dialog', character: 'KEN', text: 'HD, let me handle this one.' },
      { type: 'stage', text: '[Ken walks to center stage with quiet confidence]' },
      { type: 'dialog', character: 'KEN', text: 'You see me as weak because I don\'t dominate. You mistake partnership for submission.' },
      { type: 'dialog', character: 'RIZZLORD', text: 'Spoken like a true simp!' },
      { type: 'dialog', character: 'KEN', text: '[Calmly] I have a medical degree. An engineering background. I\'ve been an astronaut, a teacher, a chef.' },
      { type: 'scene', text: 'Achievement certificates materialize, floating around Ken.' },
      { type: 'dialog', character: 'KEN', text: 'But you know what I\'m most proud of? Being secure enough to celebrate someone else\'s success.' },
      { type: 'sound', text: '*CROWD MURMURS IN AGREEMENT*' },
      { type: 'dialog', character: 'KEN', text: 'The world told me I had to choose: alpha or beta. Dominant or submissive. But that\'s a false binary.' },
      { type: 'dialog', character: 'NABU', text: '[Nodding approvingly] The middle path...' },
      { type: 'dialog', character: 'KEN', text: 'I chose to be... Kenough. Confident without arrogance. Strong without cruelty. Present without possessing.' },
      { type: 'scene', text: 'The crowd is captivated. Even Rizzlord looks uncertain.' },
      { type: 'dialog', character: 'KEN', text: 'Rizzlord, you\'re not an alpha. You\'re just scared. Scared of being vulnerable. Of being... enough as you are.' },
      { type: 'dialog', character: 'RIZZLORD', text: '[Defensive] I... I\'m not scared!' },
      { type: 'dialog', character: 'HD', text: '[Softly] It\'s okay to be scared. It\'s not okay to hurt others because of it.' },
      { type: 'dialog', character: 'KEN', text: '[Extending hand] You could be Kenough too. If you wanted.' },
      { type: 'scene', text: 'A moment of silence. Will Rizzlord take the hand?' }
    ],
    teaser: 'The philosophy that could change everything...',
    funFact: 'Ken dolls have had over 40 different careers - just like real people!',
    discussion: 'What does it mean to be "enough"?'
  },
  7: {
    title: "Kenergy: Reclaiming the Alpha",
    content: [
      { type: 'scene', text: 'HD on stage at packed rally. Nabu glowing behind her. HD ready to address the lost boys.' },
      { type: 'dialog', character: 'HD', text: 'Brothers, I see you. You\'re angry, confused, looking for answers in all the wrong places.' },
      { type: 'sound', text: '*CROWD QUIETS*' },
      { type: 'dialog', character: 'HD', text: 'The internet sold you a lie: that dominance equals worth. That women are prizes. That emotions are weakness.' },
      { type: 'stage', text: '[HD gestures to Ken in the crowd]' },
      { type: 'dialog', character: 'HD', text: 'But Ken showed us something revolutionary: KENERGY!' },
      { type: 'dialog', character: 'NABU', text: 'The philosophy of balanced masculinity!' },
      { type: 'scene', text: 'Charts appear showing: Confidence + Empathy = Kenergy' },
      { type: 'dialog', character: 'HD', text: 'You CAN be strong AND vulnerable. Confident AND kind. A leader AND a listener!' },
      { type: 'scene', text: 'Cut to: Rizzlord in his basement, watching the stream. His facade cracks.' },
      { type: 'dialog', character: 'RIZZLORD', text: '[To himself] Is this... what I\'ve been missing?' },
      { type: 'scene', text: 'An INCEL named CHET stands up in the audience.' },
      { type: 'dialog', character: 'CHET', text: 'But... I was told nice guys finish last!' },
      { type: 'dialog', character: 'KEN', text: '[Standing] Nice guys who expect rewards aren\'t nice. Genuine kindness expects nothing.' },
      { type: 'sound', text: '*REVELATION SOUND*' },
      { type: 'dialog', character: 'CHET', text: 'So... I should just be... myself? And that\'s... Kenough?' },
      { type: 'dialog', character: 'HD', text: 'Your BEST self. Growing, learning, respecting. That\'s Kenergy!' },
      { type: 'scene', text: 'The crowd begins to chant: "KEN-ER-GY! KEN-ER-GY!"' },
      { type: 'stage', text: '[Progress bar appears: "Incel Deprogramming: 47%"]' },
      { type: 'scene', text: 'Suddenly, breaking news flashes on screens.' },
      { type: 'dialog', character: 'NARRATOR', text: 'BREAKING: Rizzlord Wins Alderman Race in Upset Victory!' },
      { type: 'sound', text: '*RECORD SCRATCH*' },
      { type: 'dialog', character: 'HD', text: '[Determined] Then it\'s official. I\'m running in the next election!' },
      { type: 'dialog', character: 'NABU', text: 'And the GFW will guide you every step.' },
      { type: 'scene', text: 'Campaign launch: "HYENA DIVA FOR ALDERMAN - A VOICE FOR THE VOICELESS"' },
      { type: 'dialog', character: 'KEN', text: '[Raising fist] Kenough!' },
      { type: 'dialog', character: 'CROWD', text: 'KENOUGH!' },
      { type: 'scene', text: 'The GFW symbol blazes across the sky. A new chapter begins.' },
      { type: 'narrator', text: 'And so, the hyena who followed a doll became the voice of a movement...' }
    ],
    teaser: 'The journey continues... stay tuned for Season 2!',
    funFact: 'Positive masculinity movements are real and growing worldwide!',
    discussion: 'How can we build better communities together?'
  }
};

const characters = {
  'HD': { color: '#FF1493', name: 'Hyena Diva', info: 'A hyena from the Masai Mara who found her destiny in a Barbie doll. Now a rising political star and voice for the voiceless.' },
  'NABU': { color: '#9D00FF', name: 'Nabu', info: 'Mystical mentor and conduit of the Great Feminist Wave (GFW). Guardian of The Glenwood comedy club.' },
  'RIZZLORD': { color: '#FF6600', name: 'Rizzlord', info: 'Self-proclaimed alpha male and purveyor of toxic masculinity. HD\'s political rival and foil.' },
  'NARRATOR': { color: '#FFD700', name: 'Narrator', info: 'The cosmic storyteller guiding us through this wild journey.' },
  'BARBIE': { color: '#FF69B4', name: 'Barbie', info: 'Ethereal guide and symbol of aspiration. Appears to HD in moments of need.' },
  'KEN': { color: '#00CED1', name: 'Ken', info: 'The embodiment of Kenergy. Proving that partnership and quiet strength are revolutionary.' },
  'TOURIST': { color: '#CCCCCC', name: 'Tourist', info: 'Unwitting catalyst who lost a Barbie doll in Africa.' },
  'MATRIARCH': { color: '#8B4513', name: 'Matriarch', info: 'HD\'s clan leader in the Masai Mara. Represents traditional wisdom.' },
  'BILD LILI': { color: '#FF69B4', name: 'Bild Lili', info: 'The original German doll that inspired Barbie. Independent and sassy.' },
  'CHET': { color: '#AAAAAA', name: 'Chet', info: 'Former incel who finds redemption through Kenergy philosophy.' }
};

// State
let currentEpisode = 1;
let autoScrollInterval = null;
let whoopCount = 0;
let rallyCount = 0;
let rizzLevel = 0;

// DOM Elements
const episodeSelect = document.getElementById('episodeSelect');
const episodeTitle = document.getElementById('episodeTitle');
const scriptContent = document.getElementById('scriptContent');
const interactiveContent = document.getElementById('interactiveContent');
const prevButton = document.getElementById('prevEpisode');
const nextButton = document.getElementById('nextEpisode');
const progressBar = document.getElementById('progressBar');
const autoScrollCheckbox = document.getElementById('autoScroll');
const whoopCounter = document.getElementById('whoopCount');
const nextTeaser = document.getElementById('nextTeaser');
const funFact = document.getElementById('funFact');
const discussionPrompt = document.getElementById('discussionPrompt');
const characterModal = document.getElementById('characterModal');
const modalClose = document.querySelector('.modal-close');
const backToHub = document.getElementById('backToHub');

// Initialize
function init() {
  loadEpisode(1);
  setupEventListeners();
  createSparkles();
}

function setupEventListeners() {
  episodeSelect.addEventListener('change', (e) => {
    loadEpisode(parseInt(e.target.value));
  });
  
  prevButton.addEventListener('click', () => {
    if (currentEpisode > 1) {
      loadEpisode(currentEpisode - 1);
    }
  });
  
  nextButton.addEventListener('click', () => {
    if (currentEpisode < 7) {
      loadEpisode(currentEpisode + 1);
    }
  });
  
  autoScrollCheckbox.addEventListener('change', (e) => {
    if (e.target.checked) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }
  });
  
  scriptContent.addEventListener('scroll', updateProgressBar);
  
  modalClose.addEventListener('click', () => {
    characterModal.classList.remove('active');
  });
  
  characterModal.addEventListener('click', (e) => {
    if (e.target === characterModal) {
      characterModal.classList.remove('active');
    }
  });
  
  backToHub.addEventListener('click', () => {
    alert('🌟 Thanks for experiencing Hyena Diva! This would link back to your Neocities hub.');
  });
}

function loadEpisode(episodeNum) {
  currentEpisode = episodeNum;
  episodeSelect.value = episodeNum;
  
  const episode = episodes[episodeNum];
  episodeTitle.textContent = episode.title;
  
  // Reset counters
  whoopCount = 0;
  whoopCounter.textContent = whoopCount;
  rallyCount = 0;
  rizzLevel = 0;
  
  // Update navigation buttons
  prevButton.disabled = episodeNum === 1;
  nextButton.disabled = episodeNum === 7;
  
  // Load script content
  renderScript(episode.content);
  
  // Load interactive elements
  renderInteractiveElements(episodeNum);
  
  // Update footer
  nextTeaser.textContent = episode.teaser;
  funFact.textContent = episode.funFact;
  discussionPrompt.textContent = episode.discussion;
  
  // Reset scroll
  scriptContent.scrollTop = 0;
  progressBar.style.width = '0%';
  
  // Stop auto-scroll if active
  stopAutoScroll();
  autoScrollCheckbox.checked = false;
}

function renderScript(content) {
  scriptContent.innerHTML = '';
  
  content.forEach(item => {
    const div = document.createElement('div');
    
    switch(item.type) {
      case 'scene':
        div.className = 'scene-description';
        div.textContent = item.text;
        break;
        
      case 'narrator':
        div.className = 'narrator-text';
        div.textContent = item.text;
        break;
        
      case 'sound':
        div.className = 'sound-effect';
        div.innerHTML = item.text + ' 🎵';
        if (item.text.toLowerCase().includes('whoop')) {
          whoopCount++;
        }
        break;
        
      case 'stage':
        div.className = 'stage-direction';
        div.textContent = item.text;
        break;
        
      case 'dialog':
        const char = characters[item.character];
        div.className = 'dialog-line';
        const charName = document.createElement('span');
        charName.className = 'character-name';
        charName.textContent = item.character + ': ';
        charName.style.color = char ? char.color : '#FFFFFF';
        charName.dataset.character = item.character;
        charName.addEventListener('click', () => showCharacterInfo(item.character));
        
        div.appendChild(charName);
        div.appendChild(document.createTextNode(item.text));
        break;
    }
    
    scriptContent.appendChild(div);
  });
  
  whoopCounter.textContent = whoopCount;
}

function renderInteractiveElements(episodeNum) {
  interactiveContent.innerHTML = '';
  
  switch(episodeNum) {
    case 1:
      interactiveContent.innerHTML = `
        <div class="sparkle-doll">💃✨</div>
        <div class="journey-map">
          <h3 style="color: var(--color-cosmic-gold); text-align: center;">HD's Journey</h3>
          <div class="map-route">
            <span>🌍 Masai Mara</span>
            <span class="map-arrow">→</span>
            <span>🏙️ Chicago</span>
          </div>
          <div class="map-route">
            <span>🎭 The Glenwood</span>
            <span class="map-arrow">→</span>
            <span>⭐ Destiny</span>
          </div>
        </div>
        <div class="gfw-symbol" onclick="showGFWFact()">🌊♀️</div>
        <p style="text-align: center; margin-top: 20px; color: var(--color-text-secondary);">🚙 Safari Jeep Animation 🦁</p>
      `;
      break;
      
    case 2:
      interactiveContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 24px;">
          <h3 style="color: var(--color-cosmic-pink);">🎭 The Glenwood Stage</h3>
          <div style="padding: 20px; background: rgba(255, 215, 0, 0.1); border-radius: 8px; margin-top: 16px;">
            <div style="font-size: 48px;">🎪</div>
            <p>Spotlight Following...</p>
          </div>
        </div>
        <button class="rally-button" onclick="triggerApplause()">👏 APPLAUSE!</button>
        <div id="applauseMeter" style="text-align: center; margin-top: 16px;">
          <div style="color: var(--color-cosmic-gold);">Applause Level: <span id="applauseLevel">0</span>%</div>
        </div>
        <div style="margin-top: 24px; padding: 16px; background: rgba(0,0,0,0.3); border-radius: 8px;">
          <h4 style="color: var(--color-neon-pink);">Featured Performers:</h4>
          <p>☕ The Latte Poet</p>
          <p>📢 Conspiracy Theorist</p>
          <p>🌟 Dreamers Galore</p>
        </div>
      `;
      break;
      
    case 3:
      interactiveContent.innerHTML = `
        <div class="rizz-meter">
          <h3 style="color: var(--color-cosmic-gold); text-align: center;">Rizz-o-meter</h3>
          <div class="meter-container">
            <div class="meter-fill" id="rizzFill" style="width: 30%;"></div>
          </div>
          <div class="meter-label">Cringe Level: <span id="rizzValue">30</span>%</div>
        </div>
        <div class="chatlog" id="chatlog">
          <div class="chat-message">RizzKing69: "Nice fedora bro"</div>
          <div class="chat-message">AlphaWolf: "This is peak cringe"</div>
          <div class="chat-message">HD_Fan: "GET HIM HD!"</div>
          <div class="chat-message" style="color: var(--color-cosmic-purple); font-style: italic;">[GLITCH] ...accessing Nabu's diary...</div>
        </div>
        <div class="predator-alert">⚠️ TO CATCH A PREDATOR ⚠️</div>
        <button class="rally-button" onclick="yeetRizzlord()" style="background: #FF6600;">YEET RIZZLORD!</button>
      `;
      animateRizzMeter();
      break;
      
    case 4:
      interactiveContent.innerHTML = `
        <div style="text-align: center;">
          <h3 style="color: var(--color-cosmic-pink);">Campaign Central</h3>
          <div style="padding: 24px; background: rgba(255, 20, 147, 0.1); border-radius: 12px; margin: 16px 0;">
            <div style="font-size: 64px; margin-bottom: 16px;">🎤</div>
            <div style="padding: 12px; background: rgba(0,0,0,0.3); border-radius: 8px;">
              <div id="voiceWave" style="height: 40px; display: flex; align-items: center; justify-content: center; gap: 4px;">
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
                <div class="wave-bar"></div>
              </div>
            </div>
            <p style="margin-top: 12px; color: var(--color-cosmic-gold);">Voice Activated! ✨</p>
          </div>
          <div style="margin-top: 24px; padding: 16px; background: rgba(255, 105, 180, 0.1); border-radius: 8px;">
            <h4 style="color: var(--color-neon-pink);">Barbie's Blessing</h4>
            <p style="font-style: italic;">"Speak your truth..." 💫</p>
          </div>
          <div style="margin-top: 16px; padding: 16px; background: rgba(157, 0, 255, 0.1); border-radius: 8px;">
            <h4 style="color: var(--color-cosmic-purple);">GFW Connection</h4>
            <div class="gfw-symbol" style="width: 60px; height: 60px; margin: 12px auto;">🌊</div>
          </div>
        </div>
      `;
      animateVoiceWave();
      break;
      
    case 5:
      interactiveContent.innerHTML = `
        <div class="timeline-slider">
          <h3 style="color: var(--color-cosmic-gold); text-align: center;">Time Travel</h3>
          <div class="timeline-track">
            <div class="timeline-marker" data-era="1950s">1950s</div>
            <div class="timeline-marker" data-era="present">Present</div>
          </div>
        </div>
        <div class="comparison-cards">
          <div class="comparison-card">
            <h4>Bild Lili</h4>
            <div style="font-size: 48px; margin: 16px 0;">👗</div>
            <p>Independent German Original</p>
            <p style="font-size: 12px; margin-top: 8px;">Made for women, by women</p>
          </div>
          <div class="comparison-card">
            <h4>Barbie</h4>
            <div style="font-size: 48px; margin: 16px 0;">💖</div>
            <p>Aspirational Icon</p>
            <p style="font-size: 12px; margin-top: 8px;">You can be anything!</p>
          </div>
        </div>
        <div style="margin-top: 24px; padding: 16px; background: rgba(0, 206, 209, 0.1); border-radius: 8px; text-align: center;">
          <h4 style="color: var(--color-neon-cyan);">Ken's Wisdom</h4>
          <p style="font-style: italic;">"I'm a partner, not an accessory."</p>
        </div>
        <div style="margin-top: 16px; text-align: center;">
          <div class="gfw-symbol" style="width: 80px; height: 80px; margin: 0 auto;">🌀</div>
          <p style="color: var(--color-text-secondary); font-size: 12px; margin-top: 8px;">Time Portal Active</p>
        </div>
      `;
      setupTimeline();
      break;
      
    case 6:
      interactiveContent.innerHTML = `
        <div style="text-align: center;">
          <h3 style="color: var(--color-neon-cyan);">The Kenough Manifesto</h3>
          <div style="padding: 24px; background: rgba(0, 206, 209, 0.1); border-radius: 12px; margin: 16px 0;">
            <div style="font-size: 64px; margin-bottom: 16px;">💪</div>
            <div style="border: 2px solid var(--color-neon-cyan); border-radius: 8px; padding: 16px;">
              <p style="font-weight: 600; color: var(--color-neon-cyan); margin-bottom: 12px;">Ken's Achievements:</p>
              <p>🏥 Medical Degree</p>
              <p>🔧 Engineering Background</p>
              <p>🚀 Astronaut Training</p>
              <p>👨‍🏫 Educator</p>
              <p>👨‍🍳 Culinary Arts</p>
            </div>
          </div>
          <div class="rizz-meter">
            <h4 style="color: var(--color-cosmic-gold);">Ken Confidence Meter</h4>
            <div class="meter-container">
              <div class="meter-fill" style="width: 100%; background: linear-gradient(90deg, var(--color-neon-cyan), var(--color-cosmic-gold));"></div>
            </div>
            <div class="meter-label">Kenough Level: MAX! 🌟</div>
          </div>
          <div style="margin-top: 24px; padding: 16px; background: rgba(255, 215, 0, 0.1); border-radius: 8px;">
            <h4 style="color: var(--color-cosmic-gold);">Breaking the Binary</h4>
            <p style="font-size: 14px; line-height: 1.6;">Neither Alpha nor Beta<br>Just... Enough.</p>
          </div>
        </div>
      `;
      break;
      
    case 7:
      interactiveContent.innerHTML = `
        <div class="kenergy-chart">
          <h3 style="color: var(--color-neon-cyan); text-align: center;">Kenergy Philosophy</h3>
          <div class="chart-item">
            <span>Confidence</span>
            <span style="color: var(--color-cosmic-gold);">✓</span>
          </div>
          <div class="chart-item">
            <span>+ Empathy</span>
            <span style="color: var(--color-cosmic-gold);">✓</span>
          </div>
          <div class="chart-item">
            <span>+ Vulnerability</span>
            <span style="color: var(--color-cosmic-gold);">✓</span>
          </div>
          <div class="chart-item">
            <span>= Kenergy</span>
            <span style="color: var(--color-neon-cyan); font-size: 24px;">💪</span>
          </div>
        </div>
        <div class="rally-counter">
          <button class="rally-button" onclick="addRallySupport()">JOIN THE MOVEMENT!</button>
          <div class="rally-count"><span id="rallyCount">0</span> Supporters</div>
        </div>
        <div style="margin-top: 24px; padding: 16px; background: rgba(255, 20, 147, 0.1); border-radius: 8px;">
          <h4 style="color: var(--color-cosmic-pink); text-align: center;">Incel Deprogramming Progress</h4>
          <div class="meter-container" style="margin-top: 12px;">
            <div class="meter-fill" id="deprogram" style="width: 47%; background: linear-gradient(90deg, var(--color-cosmic-pink), var(--color-neon-cyan));"></div>
          </div>
          <div class="meter-label">47% Complete 📈</div>
        </div>
        <div style="margin-top: 16px; text-align: center; padding: 16px; background: rgba(157, 0, 255, 0.1); border-radius: 8px;">
          <h4 style="color: var(--color-cosmic-purple);">Campaign Launch</h4>
          <p style="font-size: 24px; margin-top: 8px;">🗳️ HD FOR ALDERMAN 🗳️</p>
          <p style="color: var(--color-cosmic-gold); margin-top: 8px; font-style: italic;">"A Voice for the Voiceless"</p>
        </div>
      `;
      break;
  }
}

function showCharacterInfo(charKey) {
  const char = characters[charKey];
  if (!char) return;
  
  document.getElementById('modalCharacterName').textContent = char.name;
  document.getElementById('modalCharacterName').style.color = char.color;
  document.getElementById('modalCharacterInfo').textContent = char.info;
  characterModal.classList.add('active');
}

function updateProgressBar() {
  const scrollPercent = (scriptContent.scrollTop / (scriptContent.scrollHeight - scriptContent.clientHeight)) * 100;
  progressBar.style.width = scrollPercent + '%';
}

function startAutoScroll() {
  stopAutoScroll();
  autoScrollInterval = setInterval(() => {
    scriptContent.scrollTop += 1;
    if (scriptContent.scrollTop >= scriptContent.scrollHeight - scriptContent.clientHeight) {
      stopAutoScroll();
      autoScrollCheckbox.checked = false;
    }
  }, 50);
}

function stopAutoScroll() {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval);
    autoScrollInterval = null;
  }
}

function createSparkles() {
  setInterval(() => {
    if (Math.random() > 0.7) {
      const sparkle = document.createElement('div');
      sparkle.textContent = '✨';
      sparkle.style.position = 'fixed';
      sparkle.style.left = Math.random() * window.innerWidth + 'px';
      sparkle.style.top = Math.random() * window.innerHeight + 'px';
      sparkle.style.fontSize = '24px';
      sparkle.style.pointerEvents = 'none';
      sparkle.style.zIndex = '999';
      sparkle.style.animation = 'sparkleFloat 3s ease-out forwards';
      document.body.appendChild(sparkle);
      
      setTimeout(() => sparkle.remove(), 3000);
    }
  }, 2000);
}

// Interactive element functions
window.showGFWFact = function() {
  alert('🌊 The Great Feminist Wave (GFW) is a cosmic force of empowerment and equality!');
};

window.triggerApplause = function() {
  const level = Math.floor(Math.random() * 40) + 60;
  document.getElementById('applauseLevel').textContent = level;
  
  // Visual feedback
  const button = event.target;
  button.textContent = '🎉 AMAZING!';
  setTimeout(() => {
    button.textContent = '👏 APPLAUSE!';
  }, 1000);
};

function animateRizzMeter() {
  setInterval(() => {
    rizzLevel = Math.floor(Math.random() * 100);
    document.getElementById('rizzFill').style.width = rizzLevel + '%';
    document.getElementById('rizzValue').textContent = rizzLevel;
  }, 2000);
}

window.yeetRizzlord = function() {
  alert('🌀 YEET! Rizzlord has been banished to the void! 🌀');
  const button = event.target;
  button.textContent = '✅ YEETED!';
  button.disabled = true;
};

function animateVoiceWave() {
  const style = document.createElement('style');
  style.textContent = `
    .wave-bar {
      width: 4px;
      height: 20px;
      background: linear-gradient(var(--color-cosmic-pink), var(--color-cosmic-purple));
      animation: wave 1s ease-in-out infinite;
      border-radius: 2px;
    }
    .wave-bar:nth-child(1) { animation-delay: 0s; }
    .wave-bar:nth-child(2) { animation-delay: 0.1s; }
    .wave-bar:nth-child(3) { animation-delay: 0.2s; }
    .wave-bar:nth-child(4) { animation-delay: 0.3s; }
    .wave-bar:nth-child(5) { animation-delay: 0.4s; }
    @keyframes wave {
      0%, 100% { height: 10px; }
      50% { height: 40px; }
    }
    @keyframes sparkleFloat {
      0% { opacity: 1; transform: translateY(0) scale(1); }
      100% { opacity: 0; transform: translateY(-100px) scale(0); }
    }
  `;
  document.head.appendChild(style);
}

function setupTimeline() {
  const markers = document.querySelectorAll('.timeline-marker');
  markers.forEach(marker => {
    marker.addEventListener('click', function() {
      markers.forEach(m => m.classList.remove('active'));
      this.classList.add('active');
      const era = this.dataset.era;
      alert(`✨ Traveling to ${era}...`);
    });
  });
}

window.addRallySupport = function() {
  rallyCount++;
  document.getElementById('rallyCount').textContent = rallyCount;
  
  // Update deprogramming progress
  const newProgress = Math.min(47 + rallyCount, 100);
  document.getElementById('deprogram').style.width = newProgress + '%';
  
  const button = event.target;
  button.textContent = '🌟 KENOUGH!';
  setTimeout(() => {
    button.textContent = 'JOIN THE MOVEMENT!';
  }, 1000);
};

// Initialize on load
init();