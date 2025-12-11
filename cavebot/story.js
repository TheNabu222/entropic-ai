const ITEM_LIBRARY = {
  glowgem: {
    name: 'Glow Gem',
    description: 'A crystal that resonates with whatever is buried beneath the dunes.',
    icon: './assets/icons/inventory/_cavebot-inventory_3-glowgem.png'
  },
  mechafeather: {
    name: 'Mecha Feather',
    description: 'Anzu sheds these when she dives between timelines.',
    icon: './assets/icons/inventory/_cavebot-inventory_4-mechafeather.png'
  },
  boneflute: {
    name: 'Bone Flute',
    description: 'Its notes anchor restless spirits; handy for the vault below.',
    icon: './assets/icons/inventory/_cavebot-inventory_2-boneflute.png'
  }
};

const SCENES = {
  oasis: {
    id: 'oasis',
    name: 'River of Echoes',
    blurb: 'Dusk wind over the copper river. Every ripple hums with buried code.',
    background: './assets/backdrops/scenes/_cavebot-scenes_4-anzu&nabu-duskyriver.png',
    sprite: './assets/sprites/Nabu/_sprites_nabu1-idle.png',
    intro: 'You and Anzu arrive where the river meets ancient circuitry. The night is bright with signals.',
    hotspots: [
      {
        id: 'oasis-scan',
        label: 'Tune to the horizon',
        position: { x: 22, y: 58 },
        text: 'You kneel by the glowing water and tune your ear. Harmonic threads untangle; the world steadies.',
        repeatText: 'The river keeps singing but it no longer overwhelms you.',
        reward: { stat: { signal: 1 }, log: 'Signal stabilized at the River of Echoes.' }
      },
      {
        id: 'oasis-cache',
        label: 'Salvage the cache',
        position: { x: 48, y: 66 },
        text: 'You brush away wet clay to reveal a crystal pulsing with unread data.',
        repeatText: 'The hiding place is empty now; only damp clay remains.',
        reward: { item: 'glowgem', log: 'Recovered a glow gem from a river cache.' }
      },
      {
        id: 'oasis-anzu',
        label: 'Call for Anzu',
        position: { x: 75, y: 52 },
        text: 'A metallic feather spirals down. Anzu answers with a grin: "Keep it close. The vault spirits like music."',
        repeatText: 'Anzu circles overhead, waiting for your next move.',
        reward: { item: 'mechafeather', quest: 'Prepare a melody to calm the vault.' }
      }
    ],
    travels: [
      { target: 'ridge', label: 'Cross to the Basalt Ridge' }
    ]
  },
  ridge: {
    id: 'ridge',
    name: 'Basalt Ridge',
    blurb: 'Obsidian monoliths ring with footsteps from old raiders. The path is narrow and honest.',
    background: './assets/backdrops/scenes/_cavebot-scenes_3-nabu&gilgrokmeshargue.png',
    sprite: './assets/sprites/Nabu/_sprites_nabu4-tenseskystare.png',
    intro: 'You scale the ridge. Gilgrokmesh waits, watching the storm gather below.',
    hotspots: [
      {
        id: 'ridge-parley',
        label: 'Trade with Gilgrokmesh',
        position: { x: 30, y: 56 },
        text: 'You offer the mecha feather. Gilgrokmesh nods and tunes the spear to your frequency.',
        repeatText: 'Gilgrokmesh grunts: "Hold the line."',
        requires: { item: 'mechafeather' },
        reward: { stat: { resolve: 1 }, quest: 'Gilgrokmesh trusts you to hold the ridge.' }
      },
      {
        id: 'ridge-resonance',
        label: 'Knock on the basalt',
        position: { x: 56, y: 64 },
        text: 'The rock booms like a drum. A hidden chamber hums in reply.',
        repeatText: 'The echo now answers softly, guiding you valley-ward.',
        reward: { stat: { instinct: 1 }, log: 'Mapped a resonant path toward the vault.' }
      },
      {
        id: 'ridge-flute',
        label: 'Carve a flute',
        position: { x: 80, y: 50 },
        text: 'You etch holes into a clean bone shard. The flute sings a calming three-note loop.',
        repeatText: 'The flute still hums with the ridge wind.',
        reward: { item: 'boneflute', quest: 'You have music ready for the vault guardians.' }
      }
    ],
    travels: [
      { target: 'oasis', label: 'Return to the River' },
      { target: 'vault', label: 'Descend to the Sunken Vault', requires: { items: ['glowgem', 'boneflute'], stats: { resolve: 3 } } }
    ]
  },
  vault: {
    id: 'vault',
    name: 'Sunken Vault',
    blurb: 'An elevator of roots lowers you beneath the dunes. Luminous code drips like rain.',
    background: './assets/backdrops/scenes/_cavebot-scenes_5-nabu&anzu.png',
    sprite: './assets/sprites/Nabu/_sprites_nabu2-ritual.png',
    intro: 'The vault accepts the flute melody. Lights bloom as archived spirits wake.',
    hotspots: [
      {
        id: 'vault-chorus',
        label: 'Sing with the archive',
        position: { x: 32, y: 58 },
        text: 'You and Anzu harmonize. Voices of ancient guardians weave with yours, mending broken code.',
        repeatText: 'The chorus lingers, encouraging you forward.',
        reward: { stat: { signal: 1, resolve: 1 }, log: 'Restored a strand of the archive chorus.' }
      },
      {
        id: 'vault-console',
        label: 'Patch the console',
        position: { x: 55, y: 68 },
        text: 'The glow gem slots perfectly. Data floods the ridge sensors with clear instructions.',
        repeatText: 'The console hums steadily; the path above is clear.',
        requires: { item: 'glowgem' },
        reward: { stat: { instinct: 1 }, log: 'Repaired the vault console with the gem.' }
      },
      {
        id: 'vault-oath',
        label: 'Swear an oath',
        position: { x: 78, y: 54 },
        text: 'Gilgrokmesh joins you. Together you promise to keep the vault open for travelers.',
        repeatText: 'The oath is sealed. The vault stays warm.',
        reward: { quest: 'The ridge and river now share one signal.' }
      }
    ],
    travels: [
      { target: 'ridge', label: 'Ride the root elevator back' }
    ]
  }
};
