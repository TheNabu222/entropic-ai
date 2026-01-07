class GameEngine {
    constructor() {
        this.state = {
            stats: {
                instinct: 3,
                connection: 2,
                glitch: 0
            },
            inventory: [],
            flags: {},
            currentNode: null
        };

        this.elements = {
            bg: document.getElementById('bg-layer'),
            spriteLayer: document.getElementById('sprite-layer'),
            dialogueText: document.getElementById('dialogue-text'),
            speakerTag: document.getElementById('speaker-tag'),
            choices: document.getElementById('choice-container'),
            log: document.getElementById('log-container'),
            diceContainer: document.getElementById('dice-container'),
            stats: {
                instinct: document.getElementById('val-instinct'),
                connection: document.getElementById('val-connection'),
                glitch: document.getElementById('val-glitch')
            },
            invSlots: document.querySelectorAll('.inv-slot')
        };

        this.audio = {
            theme: document.getElementById('bgm-theme'),
            clack: document.getElementById('sfx-clack'),
            glitch: document.getElementById('sfx-glitch')
        };
    }

    init() {
        // Start theme music interaction check
        document.body.addEventListener('click', () => {
            if (this.audio.theme.paused) {
                this.audio.theme.play().catch(e => console.log("Audio play failed:", e));
                this.audio.theme.volume = 0.3;
            }
        }, { once: true });

        this.renderInventory();
        this.loadNode('start');
    }

    // --- RENDER ENGINE ---

    loadNode(nodeId) {
        const node = NODES[nodeId];
        if (!node) {
            console.error(`Node ${nodeId} not found!`);
            return;
        }

        this.state.currentNode = node;

        // 1. Background
        if (node.bg) {
            this.elements.bg.style.backgroundImage = `url('${node.bg}')`;
        }

        // 2. Sprites
        this.elements.spriteLayer.innerHTML = '';
        if (node.sprites) {
            node.sprites.forEach(spriteDef => {
                const img = document.createElement('img');
                img.src = ASSETS.sprites[spriteDef.key] || ASSETS.sprites['nabu']; // fallback
                img.className = 'sprite';
                img.style.left = spriteDef.x || '50%';
                if (spriteDef.scale) {
                    img.style.transform = `scale(${spriteDef.scale})`;
                }

                // Glitch effect class
                if (node.bgEffect === 'glitch' || spriteDef.key === 'mecha') {
                    img.style.animation = 'glitch-skew 0.3s infinite';
                }

                this.elements.spriteLayer.appendChild(img);
            });
        }

        // 3. Text
        this.elements.speakerTag.innerText = node.speaker || '???';
        this.typeWriter(node.text);

        // 4. Run Logic
        if (node.onEnter) {
            node.onEnter(this);
        }

        // 5. Choices (Rendered after typing or immediately? Let's do immediately for now)
        this.renderChoices(node.choices);
    }

    typeWriter(text) {
        this.elements.dialogueText.innerText = text;
        // Could add actual typewriter effect here later
    }

    renderChoices(choices) {
        this.elements.choices.innerHTML = '';

        choices.forEach(choice => {
            const btn = document.createElement('button');

            if (choice.type === 'check') {
                btn.className = 'skill-check';
                btn.innerText = `${choice.text} [${choice.stat.toUpperCase()} DC ${choice.difficulty}]`;
                btn.onclick = () => this.performCheck(choice);
            } else {
                btn.innerText = choice.text;
                btn.onclick = () => {
                    if (choice.action === 'reset') {
                        location.reload();
                    } else if (choice.action.startsWith('goto:')) {
                        this.loadNode(choice.action.split(':')[1]);
                    }
                };
            }
            this.elements.choices.appendChild(btn);
        });
    }

    // --- MECHANICS ---

    performCheck(choice) {
        const statValue = this.state.stats[choice.stat];
        const result = this.rollDice(statValue);

        this.addToLog(`Rolling ${choice.stat.toUpperCase()} (${statValue}d6)...`);

        // Count successes (4, 5, 6)
        const successes = result.rolls.filter(r => r >= 4).length;
        const passed = successes >= choice.difficulty;

        // Visual feedback
        this.showDiceVisuals(result.rolls);

        setTimeout(() => {
            if (passed) {
                this.addToLog(`SUCCESS! (${successes} vs DC ${choice.difficulty})`);
                this.loadNode(choice.success);
            } else {
                this.addToLog(`FAILURE... (${successes} vs DC ${choice.difficulty})`);
                this.loadNode(choice.fail);
            }
        }, 1500); // Wait for animation
    }

    rollDice(poolSize) {
        const rolls = [];
        for (let i = 0; i < poolSize; i++) {
            rolls.push(Math.ceil(Math.random() * 6));
        }
        return { rolls };
    }

    showDiceVisuals(rolls) {
        this.elements.diceContainer.innerHTML = '';
        this.elements.diceContainer.classList.remove('hidden');

        rolls.forEach((val, index) => {
            const die = document.createElement('div');
            die.className = `die ${val >= 4 ? 'success' : 'fail'}`;
            die.innerText = val;
            die.style.animationDelay = `${index * 0.1}s`;
            this.elements.diceContainer.appendChild(die);
        });

        // Hide after a while
        setTimeout(() => {
            this.elements.diceContainer.innerHTML = '';
        }, 2000);
    }

    // --- STATE MANAGEMENT ---

    modifyStat(stat, amount) {
        if (stat === 'glitch') {
            this.state.stats.glitch += amount;
            if (this.state.stats.glitch > 100) this.state.stats.glitch = 100;
            this.elements.stats.glitch.style.width = `${this.state.stats.glitch}%`;
        } else {
            this.state.stats[stat] += amount;
            this.elements.stats[stat].innerText = this.state.stats[stat];
        }
    }

    addItem(id, imgPath) {
        this.state.inventory.push({ id, img: imgPath });
        this.renderInventory();
        this.addToLog(`Obtained: ${id.toUpperCase()}`);
    }

    hasItem(id) {
        return this.state.inventory.some(i => i.id === id);
    }

    renderInventory() {
        // Clear slots
        this.elements.invSlots.forEach(slot => slot.innerHTML = '');

        // Fill slots
        this.state.inventory.forEach((item, index) => {
            if (index < 4) {
                const img = document.createElement('img');
                img.src = item.img;
                img.title = item.id;
                this.elements.invSlots[index].appendChild(img);
            }
        });
    }

    setFlag(key, value) {
        this.state.flags[key] = value;
    }

    addToLog(msg) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerText = `> ${msg}`;
        this.elements.log.prepend(entry);
    }

    playSound(key) {
        if (this.audio[key]) {
            this.audio[key].currentTime = 0;
            this.audio[key].play().catch(() => {});
        }
    }
}

// Start Game
const game = new GameEngine();
window.onload = () => game.init();
