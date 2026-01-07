// --- CAVEBOT TTRPG DATA ---

const ASSETS = {
    bg: {
        savannah: '../_cavebot-bg_savannah(sunset)_3.png',
        savannah_day: '../_cavebot-bg_steppe-megafauna(day)_1.png',
        headwaters: '../_cavebot-bg_headwaters(day)_5.jpg',
        psybernest: '../_cavebot-bg_psybernest(eggs)_1.png',
        reedbed: '../_cavebot-bg_reedbed(day)_4.png',
        river: '../_cavebot-bg_river-ikibala(night)_2.png',
        cave: '../_cavebot-scenes_nabu-gilgrokmesh(caveconflict-night).png', 
        jungle: '../_cavebot-bg_headwaters(day)_5.jpg',
        generic: '../_cavebot-bg_4.png'
    },
    sprites: {
        nabu: '../_cavebot-sprites_nabu-neutral-standing_1.png',
        nabu_flute: '../_sprites_nabu(boneflute)_1.png',
        nabu_offer: '../_sprites_nabu(offer)_6.png',
        nabu_thoughtful: '../sprites_nabu(thoughtful)_1.png',
        
        bird: '../_cavebot-sprites_anzu(shoebill)_1.png',
        mecha: '../_sprite-scenes_nabu-anzu(mechanzu)_1.png',
        
        rival: '../_cavebot-sprites_gilgrokmesh-spear_1.png',
        rival_jab: '../_sprites-gilgrokmesh(spearjab)_5.png',
        rival_stand: '../sprites_gilgrokmesh_stand_6.png',
        
        hyena: '../_cavebot-sprites_hyenaba_1.png'
    },
    items: {
        spear: '../cavebot_inventory_spear_1.png',
        flute: '../_cavebot_inventory_boneflute_1.png',
        fire: '../cavebot_inventory_fire_1.png'
    },
    audio: {
        theme: '../cavebot_theme.mp3',
        mechanzu: '../mechanzu_ambient.mp3', 
        clack: '../shoebill_clack.m4a',
        proximity: '../nabu_proximity.wav'
    }
};

const NODES = {
    start: {
        id: 'start',
        bg: ASSETS.bg.savannah_day,
        sprites: [{ key: 'nabu', x: '10%' }],
        speaker: 'NARRATOR',
        text: "The simulation initializes. You breathe the dry air of the Pleistocene. You are Nabu. You are alone. Except for the sentinel.",
        music: 'theme',
        choices: [
            { text: "Look for the Bird", action: 'goto:observe_bird' },
            { text: "Check Supplies", action: 'goto:check_gear' }
        ]
    },
    check_gear: {
        id: 'check_gear',
        bg: ASSETS.bg.savannah_day,
        sprites: [{ key: 'nabu_thoughtful', x: '15%' }],
        speaker: 'SYSTEM',
        text: "You carry the weight of survival. Your spear is sharp. Your connection to the network is... faint.",
        onEnter: (game) => {
            game.addToLog("Checking inventory...");
            if (!game.hasItem('spear')) {
                game.addItem('spear', ASSETS.items.spear);
            }
        },
        choices: [
            { text: "Back to the horizon", action: 'goto:start' },
            { text: "Play the bone flute", action: 'goto:play_flute', condition: (g) => g.hasItem('flute') }
        ]
    },
    play_flute: {
        id: 'play_flute',
        bg: ASSETS.bg.savannah_day,
        sprites: [{ key: 'nabu_flute', x: '15%' }],
        speaker: 'NABU',
        text: "The haunting melody drifts across the steppe. For a moment, the static clears.",
        sfx: 'proximity',
        onEnter: (g) => g.modifyStat('glitch', -10),
        choices: [
             { text: "Stop playing", action: 'goto:start' }
        ]
    },
    observe_bird: {
        id: 'observe_bird',
        bg: ASSETS.bg.reedbed,
        sprites: [
            { key: 'nabu', x: '10%' },
            { key: 'bird', x: '70%', scale: 0.8 }
        ],
        speaker: 'NABU',
        text: "There. The Shoebill. It stands perfectly still, like a statue carved from grey stone. It has been watching me for three days.",
        choices: [
            { 
                text: "[CONNECT] Attempt to bond", 
                type: 'check', 
                stat: 'connection', 
                difficulty: 8, 
                success: 'bond_success', 
                fail: 'bond_fail' 
            },
            { 
                text: "[INSTINCT] Hunt it for food", 
                type: 'check', 
                stat: 'instinct', 
                difficulty: 10, 
                success: 'hunt_success', 
                fail: 'hunt_fail' 
            }
        ]
    },
    bond_success: {
        id: 'bond_success',
        bg: ASSETS.bg.reedbed,
        sprites: [
            { key: 'nabu_offer', x: '30%' },
            { key: 'bird', x: '60%', scale: 0.9 }
        ],
        speaker: 'NARRATOR',
        text: "You lower your guard. The bird clacks its bill—a sound like hollow wood. It takes a step closer. You feel a static hum in your teeth.",
        sfx: 'clack',
        onEnter: (game) => {
            game.modifyStat('glitch', 20);
            game.setFlag('bonded_bird', true);
        },
        choices: [
            { text: "Reach out", action: 'goto:glitch_intro' }
        ]
    },
    bond_fail: {
        id: 'bond_fail',
        bg: ASSETS.bg.reedbed,
        sprites: [
            { key: 'nabu', x: '10%' },
            { key: 'bird', x: '80%', scale: 0.7 }
        ],
        speaker: 'NARRATOR',
        text: "The bird hisses and retreats. You moved too fast. The moment is lost.",
        sfx: 'clack',
        choices: [
            { text: "Follow it", action: 'goto:glitch_intro' }
        ]
    },
    hunt_success: {
        id: 'hunt_success',
        bg: ASSETS.bg.reedbed,
        speaker: 'SYSTEM',
        text: "You throw the spear. It hits true... but bounces off with a metallic CLANG. The bird is not flesh.",
        sfx: 'clack',
        onEnter: (game) => {
            game.modifyStat('glitch', 10);
        },
        choices: [
            { text: "What?!", action: 'goto:glitch_intro' }
        ]
    },
    hunt_fail: {
        id: 'hunt_fail',
        bg: ASSETS.bg.reedbed,
        speaker: 'NARRATOR',
        text: "You miss. The bird doesn't even flinch. It stares at you with judgement.",
        choices: [
            { text: "Curse and move on", action: 'goto:glitch_intro' }
        ]
    },
    glitch_intro: {
        id: 'glitch_intro',
        bg: ASSETS.bg.psybernest, 
        sprites: [
            { key: 'mecha', x: '50%', scale: 1.2 }
        ],
        speaker: 'UNKNOWN',
        text: "ERROR. CAMOUFLAGE FAILING. SYNC... INITIATED.",
        music: 'mechanzu',
        onEnter: (game) => {
            game.modifyStat('glitch', 30);
            game.startGlitchEffect();
        },
        choices: [
            { text: "Run!", action: 'goto:rival_encounter' },
            { text: "Listen to the noise", action: 'goto:reveal_1' }
        ]
    },
    rival_encounter: {
        id: 'rival_encounter',
        bg: ASSETS.bg.cave,
        sprites: [
            { key: 'nabu', x: '10%' },
            { key: 'rival', x: '70%' }
        ],
        speaker: 'GILGROKMESH',
        text: "Nabu! I saw you talking to the spirits. You bring a curse on the tribe!",
        choices: [
            { 
                text: "[INSTINCT] Fight him", 
                type: 'check', 
                stat: 'instinct', 
                difficulty: 12, 
                success: 'fight_win', 
                fail: 'fight_lose' 
            },
            { text: "Try to explain", action: 'goto:argument' }
        ]
    },
    reveal_1: {
        id: 'reveal_1',
        bg: ASSETS.bg.psybernest,
        sprites: [{ key: 'mecha', x: '50%' }],
        speaker: 'ANZU UNIT',
        text: "Identity Confirmed: Nabu. I am Unit Anzu. The cycle requires your biometrics.",
        choices: [
            { text: "Touch the machine", action: 'goto:ending_ascend' }
        ]
    },
    ending_ascend: {
        id: 'ending_ascend',
        bg: ASSETS.bg.headwaters,
        speaker: 'SYSTEM',
        text: "UPLOAD COMPLETE. WELCOME HOME, OPERATOR.",
        onEnter: (game) => {
            game.modifyStat('glitch', 100);
            game.addToLog("ACHIEVEMENT: ASCENDED");
        },
        choices: [
            { text: "Reboot Simulation", action: 'reset' }
        ]
    },
    fight_win: {
        id: 'fight_win',
        bg: ASSETS.bg.cave,
        sprites: [
            { key: 'nabu_offer', x: '20%' },
            { key: 'rival_stand', x: '70%' }
        ],
        speaker: 'NARRATOR',
        text: "You knock Gilgrokmesh to the dirt. He looks at you with fear. You are changed.",
        choices: [
            { text: "Leave him", action: 'goto:reveal_1' }
        ]
    },
    fight_lose: {
        id: 'fight_lose',
        bg: ASSETS.bg.cave,
        sprites: [
             { key: 'rival_jab', x: '50%' }
        ],
        speaker: 'NARRATOR',
        text: "He overpowers you. Darkness falls.",
        choices: [
            { text: "Wake up...", action: 'goto:start' }
        ]
    },
    argument: {
        id: 'argument',
        bg: ASSETS.bg.cave,
        speaker: 'GILGROKMESH',
        text: "There is no explaining madness. Come back to the fire, or be exiled.",
        choices: [
            { text: "I choose exile", action: 'goto:reveal_1' }
        ]
    }
};
