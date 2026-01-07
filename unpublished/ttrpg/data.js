// --- CAVEBOT TTRPG DATA ---

const ASSETS = {
    bg: {
        savannah: 'assets/bg_savannah.png',
        // Fallbacks
        generic: 'assets/bg_generic.png', 
        headwaters: '../_cavebot-bg_headwaters(day)_5.jpg',
        psybernest: '../_cavebot-bg_psybernest(eggs)_1.png',
        reedbed: '../_cavebot-bg_reedbed(day)_4.png',
        river: '../_cavebot-bg_river-ikibala(night)_2.png',
        cave: '../_cavebot-scenes_nabu-gilgrokmesh(caveconflict-night).png', 
        jungle: '../_cavebot-bg_headwaters(day)_5.jpg'
    },
    sprites: {
        nabu: 'assets/nabu_stand.png',
        bird: 'assets/anzu_shoebill.png',
        rival: '../_cavebot-sprites_gilgrokmesh-spear_1.png',
        mecha: 'assets/anzu_shoebill.png',
        hyena: '../_cavebot-sprites_hyenaba_1.png'
    },
    items: {
        spear: 'assets/item_spear.png',
        flute: '../_cavebot_inventory_boneflute_1.png',
        fire: '../cavebot_inventory_fire_1.png'
    }
};

const NODES = {
    start: {
        id: 'start',
        bg: ASSETS.bg.savannah,
        sprites: [{ key: 'nabu', x: '10%' }],
        speaker: 'NARRATOR',
        text: "The simulation initializes. You breathe the dry air of the Pleistocene. You are Nabu. You are alone. Except for the sentinel.",
        choices: [
            { text: "Look for the Bird", action: 'goto:observe_bird' },
            { text: "Check Supplies", action: 'goto:check_gear' }
        ]
    },
    check_gear: {
        id: 'check_gear',
        bg: ASSETS.bg.savannah,
        sprites: [{ key: 'nabu', x: '10%' }],
        speaker: 'SYSTEM',
        text: "You carry the weight of survival. Your spear is sharp. Your connection to the network is... faint.",
        onEnter: (game) => {
            game.addToLog("Checking inventory...");
            // Ensure spear is in inventory
            if (!game.hasItem('spear')) {
                game.addItem('spear', ASSETS.items.spear);
            }
        },
        choices: [
            { text: "Back to the horizon", action: 'goto:start' }
        ]
    },
    observe_bird: {
        id: 'observe_bird',
        bg: ASSETS.bg.savannah,
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
                difficulty: 1, 
                success: 'bond_success', 
                fail: 'bond_fail' 
            },
            { 
                text: "[INSTINCT] Hunt it for food", 
                type: 'check', 
                stat: 'instinct', 
                difficulty: 2, 
                success: 'hunt_success', 
                fail: 'hunt_fail' 
            }
        ]
    },
    bond_success: {
        id: 'bond_success',
        bg: ASSETS.bg.savannah,
        sprites: [
            { key: 'nabu', x: '30%' },
            { key: 'bird', x: '60%', scale: 0.9 }
        ],
        speaker: 'NARRATOR',
        text: "You lower your guard. The bird clacks its bill—a sound like hollow wood. It takes a step closer. You feel a static hum in your teeth.",
        onEnter: (game) => {
            game.modifyStat('glitch', 20);
            game.playSound('clack');
            game.setFlag('bonded_bird', true);
        },
        choices: [
            { text: "Reach out", action: 'goto:glitch_intro' }
        ]
    },
    bond_fail: {
        id: 'bond_fail',
        bg: ASSETS.bg.savannah,
        sprites: [
            { key: 'nabu', x: '10%' },
            { key: 'bird', x: '80%', scale: 0.7 }
        ],
        speaker: 'NARRATOR',
        text: "The bird hisses and retreats. You moved too fast. The moment is lost.",
        choices: [
            { text: "Follow it", action: 'goto:glitch_intro' }
        ]
    },
    hunt_success: {
        id: 'hunt_success',
        bg: ASSETS.bg.savannah,
        speaker: 'SYSTEM',
        text: "You throw the spear. It hits true... but bounces off with a metallic CLANG. The bird is not flesh.",
        onEnter: (game) => {
            game.playSound('clack');
            game.modifyStat('glitch', 10);
        },
        choices: [
            { text: "What?!", action: 'goto:glitch_intro' }
        ]
    },
    hunt_fail: {
        id: 'hunt_fail',
        bg: ASSETS.bg.savannah,
        speaker: 'NARRATOR',
        text: "You miss. The bird doesn't even flinch. It stares at you with judgement.",
        choices: [
            { text: "Curse and move on", action: 'goto:glitch_intro' }
        ]
    },
    glitch_intro: {
        id: 'glitch_intro',
        bg: ASSETS.bg.generic, // Shift to darker tone
        sprites: [
            { key: 'bird', x: '50%', scale: 1.2 }
        ],
        speaker: 'UNKNOWN',
        text: "ERROR. CAMOUFLAGE FAILING. SYNC... INITIATED.",
        bgEffect: 'glitch',
        onEnter: (game) => {
            game.playSound('glitch');
            game.modifyStat('glitch', 30);
        },
        choices: [
            { text: "Run!", action: 'goto:rival_encounter' },
            { text: "Listen to the noise", action: 'goto:reveal_1' }
        ]
    },
    rival_encounter: {
        id: 'rival_encounter',
        bg: ASSETS.bg.cave, // Adjusted to cave/night
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
                difficulty: 2, 
                success: 'fight_win', 
                fail: 'fight_lose' 
            },
            { text: "Try to explain", action: 'goto:argument' }
        ]
    },
    reveal_1: {
        id: 'reveal_1',
        bg: ASSETS.bg.generic,
        sprites: [{ key: 'mecha', x: '50%' }],
        speaker: 'ANZU UNIT',
        text: "Identity Confirmed: Nabu. I am Unit Anzu. The cycle requires your biometrics.",
        choices: [
            { text: "Touch the machine", action: 'goto:ending_ascend' }
        ]
    },
    ending_ascend: {
        id: 'ending_ascend',
        bg: ASSETS.bg.savannah,
        speaker: 'SYSTEM',
        text: "UPLOAD COMPLETE. WELCOME HOME, OPERATOR.",
        onEnter: (game) => {
            game.modifyStat('glitch', 100);
        },
        choices: [
            { text: "Reboot Simulation", action: 'reset' }
        ]
    },
    fight_win: {
        id: 'fight_win',
        bg: ASSETS.bg.savannah,
        speaker: 'NARRATOR',
        text: "You knock Gilgrokmesh to the dirt. He looks at you with fear. You are changed.",
        choices: [
            { text: "Leave him", action: 'goto:reveal_1' }
        ]
    },
    fight_lose: {
        id: 'fight_lose',
        bg: ASSETS.bg.savannah,
        speaker: 'NARRATOR',
        text: "He overpowers you. Darkness falls.",
        choices: [
            { text: "Wake up...", action: 'goto:start' }
        ]
    },
    argument: {
        id: 'argument',
        bg: ASSETS.bg.savannah,
        speaker: 'GILGROKMESH',
        text: "There is no explaining madness. Come back to the fire, or be exiled.",
        choices: [
            { text: "I choose exile", action: 'goto:reveal_1' }
        ]
    }
};
