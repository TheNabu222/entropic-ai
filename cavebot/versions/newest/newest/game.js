class AudioController {
    constructor() {
        this.bgm = null;
        this.currentTrack = null;
        this.sounds = {};
        this.enabled = false;
    }

    init() {
        this.enabled = true;
        // Preload sounds if needed, or just play on demand
    }

    playMusic(trackKey) {
        if (!this.enabled || !ASSETS.audio[trackKey]) return;
        
        // If already playing this track, do nothing
        if (this.currentTrack === trackKey) return;

        if (this.bgm) {
            this.bgm.pause();
            this.bgm = null;
        }

        const src = ASSETS.audio[trackKey];
        this.bgm = new Audio(src);
        this.bgm.loop = true;
        this.bgm.volume = 0.4;
        this.bgm.play().catch(e => console.warn("Audio play failed:", e));
        this.currentTrack = trackKey;
    }

    playSound(soundKey) {
        if (!this.enabled || !ASSETS.audio[soundKey]) return;
        const src = ASSETS.audio[soundKey];
        const snd = new Audio(src);
        snd.volume = 0.6;
        snd.play().catch(e => console.warn("SFX play failed:", e));
    }
}

class Typewriter {
    constructor(elementId, speed = 30) {
        this.element = document.getElementById(elementId);
        this.speed = speed;
        this.timer = null;
        this.fullText = "";
        this.isTyping = false;
        this.onComplete = null;
    }

    type(text, callback) {
        this.stop();
        this.fullText = text;
        this.element.innerHTML = "";
        this.isTyping = true;
        this.onComplete = callback;
        
        let i = 0;
        this.element.innerHTML = '<span class="cursor"></span>';
        
        const nextChar = () => {
            if (i < text.length) {
                // Remove cursor
                this.element.innerHTML = text.substring(0, i + 1) + '<span class="cursor"></span>';
                i++;
                this.timer = setTimeout(nextChar, this.speed);
            } else {
                this.isTyping = false;
                if (this.onComplete) this.onComplete();
            }
        };
        
        nextChar();
    }

    stop() {
        if (this.timer) clearTimeout(this.timer);
        this.isTyping = false;
        // Show full text immediately
        if (this.fullText) {
             this.element.innerHTML = this.fullText + '<span class="cursor"></span>';
        }
    }
}

class Game {
    constructor() {
        this.state = {
            currentNode: 'start',
            inventory: [],
            stats: {
                glitch: 0,
                hp: 10,
                connection: 2, // Social
                instinct: 3    // Combat/Physical
            },
            flags: {}
        };
        
        this.audio = new AudioController();
        this.typewriter = new Typewriter('dialogue-text');
        
        // Bind UI
        this.ui = {
            bg: document.getElementById('bg-layer'),
            spriteLayer: document.getElementById('sprite-layer'),
            dialogueText: document.getElementById('dialogue-text'),
            speaker: document.getElementById('speaker-tag'),
            choices: document.getElementById('choice-container'),
            log: document.getElementById('log-container'),
            glitchBar: document.getElementById('glitch-fill'),
            inventory: document.getElementById('inventory-grid'),
            diceContainer: document.getElementById('dice-container'),
            startOverlay: document.getElementById('start-overlay')
        };
        
        this.setupStart();
    }
    
    setupStart() {
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.audio.init();
                this.ui.startOverlay.classList.add('hidden');
                this.renderNode(this.state.currentNode);
            });
        } else {
            // Fallback for verification/headless
            this.renderNode(this.state.currentNode);
        }
    }

    renderNode(nodeId) {
        const node = NODES[nodeId];
        if (!node) {
            console.error(`Node ${nodeId} not found!`);
            return;
        }

        this.state.currentNode = nodeId;

        // 1. Update Background
        if (node.bg) {
            this.ui.bg.style.backgroundImage = `url('${node.bg}')`;
        }
        
        // 2. Update Sprites
        this.ui.spriteLayer.innerHTML = '';
        if (node.sprites) {
            node.sprites.forEach(s => {
                const img = document.createElement('img');
                img.src = ASSETS.sprites[s.key] || s.key; // Handle raw paths or keys
                img.className = 'sprite';
                img.style.left = s.x;
                if (s.scale) img.style.transform = `scale(${s.scale})`;
                this.ui.spriteLayer.appendChild(img);
            });
        }
        
        // 3. Audio Triggers
        if (node.music) this.audio.playMusic(node.music);
        if (node.sfx) this.audio.playSound(node.sfx);
        if (node.bgEffect === 'glitch') this.startGlitchEffect();

        // 4. Update Dialogue (Typewriter)
        this.ui.speaker.textContent = node.speaker || '???';
        this.ui.choices.innerHTML = ''; // Clear choices during typing
        
        // Execute onEnter logic
        if (node.onEnter) {
            node.onEnter(this);
        }
        
        // Start typing
        this.typewriter.type(node.text, () => {
            this.renderChoices(node);
        });
    }
    
    renderChoices(node) {
        this.ui.choices.innerHTML = '';
        
        if (!node.choices) return;
        
        node.choices.forEach(choice => {
            if (choice.condition && !choice.condition(this)) return;

            const btn = document.createElement('button');
            btn.textContent = choice.text;
            
            if (choice.type === 'check') {
                btn.classList.add('skill-check');
                btn.onclick = () => this.handleCheck(choice);
            } else {
                btn.onclick = () => {
                    if (choice.action === 'reset') {
                         location.reload(); 
                    } else if (choice.action.startsWith('goto:')) {
                        const nextId = choice.action.split(':')[1];
                        this.renderNode(nextId);
                    }
                };
            }
            this.ui.choices.appendChild(btn);
        });
    }

    handleCheck(choice) {
        // Simple d20 system
        const roll = Math.floor(Math.random() * 20) + 1;
        const statVal = this.state.stats[choice.stat] || 0;
        const total = roll + statVal;
        
        const success = total >= choice.difficulty;
        
        this.showDiceAnimation(roll, success);
        
        setTimeout(() => {
            this.addToLog(`Check [${choice.stat.toUpperCase()}]: Rolled ${roll} + ${statVal} = ${total} (DC ${choice.difficulty}) -> ${success ? 'SUCCESS' : 'FAIL'}`);
            this.renderNode(success ? choice.success : choice.fail);
        }, 1500);
    }
    
    showDiceAnimation(roll, success) {
        this.ui.diceContainer.innerHTML = '';
        const die = document.createElement('div');
        die.className = `die ${success ? 'success' : 'fail'}`;
        die.textContent = roll;
        this.ui.diceContainer.appendChild(die);
        
        setTimeout(() => {
            this.ui.diceContainer.innerHTML = '';
        }, 1500);
    }

    addToLog(msg) {
        const div = document.createElement('div');
        div.className = 'log-entry';
        div.textContent = `> ${msg}`;
        this.ui.log.prepend(div);
    }

    modifyStat(stat, amount) {
        if (this.state.stats[stat] !== undefined) {
            this.state.stats[stat] += amount;
            // Clamp 0-100
            if (this.state.stats[stat] > 100) this.state.stats[stat] = 100;
            if (this.state.stats[stat] < 0) this.state.stats[stat] = 0;
            
            this.updateUI();
        }
    }
    
    updateUI() {
        this.ui.glitchBar.style.width = `${this.state.stats.glitch}%`;
    }

    addItem(itemId, iconSrc) {
        if (this.hasItem(itemId)) return;
        this.state.inventory.push(itemId);
        
        const slot = document.createElement('div');
        slot.className = 'inv-slot';
        slot.title = itemId;
        const img = document.createElement('img');
        img.src = iconSrc;
        slot.appendChild(img);
        this.ui.inventory.appendChild(slot);
        
        this.addToLog(`Obtained: ${itemId.toUpperCase()}`);
    }

    hasItem(itemId) {
        return this.state.inventory.includes(itemId);
    }
    
    setFlag(key, val) {
        this.state.flags[key] = val;
    }
    
    startGlitchEffect() {
        document.body.classList.add('glitch-active');
        setTimeout(() => {
            document.body.classList.remove('glitch-active');
        }, 500);
    }
}

// Init Game
window.onload = () => {
    const game = new Game();
};
