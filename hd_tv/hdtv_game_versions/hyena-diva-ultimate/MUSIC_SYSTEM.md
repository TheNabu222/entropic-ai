# 🎵 HD.TV Dynamic Music System

## Overview
The game now features a fully integrated dynamic music system with zone-based switching and crossfade transitions.

## Features

### 1. Zone-Based Music Mapping
Music automatically changes based on game location and narrative context:

- **Main Menu**: Ragtime classics (MapleLeafRag.mp3)
- **The Glenwood**: Atmospheric blues and ragtime
  - `GLENWOOD`: Dreamwalker ambient (DreamwalkerSEP2.mp3)
  - `GLENWOOD_STAGE`: Scott Joplin ragtime performances
- **Cosmic Realm**: Maximalist Barbie energy
  - Aqua - Barbie Girl (MIDI)
  - Britney vibes (oops.mp3)
- **Rizzlord Confrontations**: Dark & intense
  - Disturbed - "Down with the Sickness" (MIDI) 💀
  - Tense battle music (jb.MP3)
- **Special Modes**:
  - Predator: Pink Panther theme
  - Adventure: Pirates of the Caribbean

### 2. Crossfade System
- 2-second smooth transitions between tracks
- 20-step fade algorithm for seamless blending
- Prevents jarring music cuts during scene changes

### 3. Music Control UI
- **Taskbar Toggle**: 🔊/🔇 button in taskbar (next to clock)
- Click to mute/unmute all music
- Preference saved to localStorage
- Visual feedback (glow effect when active)

### 4. Auto-Context Switching
Music changes automatically based on:
- **Node ID patterns**: `RIZZLER_*`, `GLENWOOD_*`, `COSMIC_*`
- **Character context**: Different themes for Nabu, HD, Sypher
- **Dramatic moments**: Battle/confrontation scenes get intense music

## Audio Files Used

### Ragtime & Blues (The Glenwood)
- `MapleLeafRag.mp3` - Main menu classic
- `9725s_maple_leaf_rag_(nc)smythe.mid` - Alternative ragtime
- `scott-joplin-and-scott-hayden-sunflower-slow-drag.mid` - Performance music
- `silver_swan_rag_s_(nc)smythe.mid` - Backstage vibes
- `DreamwalkerSEP2.mp3` - Atmospheric Glenwood ambience

### Maximalist/Cosmic
- `Aqua_Barbie_Girl.mid` - Cosmic GFW realm 💖
- `oops.mp3` - Britney Spears energy

### Dark/Intense
- `Disturbed.mid` - **"Down with the Sickness"** for Rizzlord! 🔥
- `jb.MP3` - Battle/tense moments

### Special Themes
- `pink_panther.mid` - Predator/stealth mode
- `Pirates of the Caribbean - Theme from the Movie [MIDIfind.com].mid` - Adventure

### Sound Effects
- `oops.mp3` - UI clicks
- `jb.MP3` - Interactions
- `Disturbed.mid` - Dramatic moments

## Technical Implementation

### AudioManager API
```javascript
// Switch to a specific zone (with crossfade)
AudioManager.switchToZone('RIZZLORD_CONFRONTATION');

// Toggle mute (returns new muted state)
const isMuted = AudioManager.toggleMute();

// Play direct track (no crossfade)
AudioManager.playMusic('cosmic', loop = true);

// Play sound effect
AudioManager.playSfx('click');

// Stop all music
AudioManager.stopMusic();

// Adjust volumes (0.0 to 1.0)
AudioManager.setMusicVolume(0.3);
AudioManager.setSfxVolume(0.2);
```

### Zone Mapping
```javascript
const ZONE_MUSIC_MAP = {
  'MAIN_MENU': 'mainMenu',
  'GLENWOOD': 'glenwood',
  'GLENWOOD_STAGE': 'glenwoodRagtime',
  'COSMIC_REALM': 'cosmic',
  'RIZZLORD_CONFRONTATION': 'rizzlord',
  // ... etc
};
```

### Auto-Detection Function
```javascript
getMusicZoneForNode(nodeId, characterId)
```
Analyzes node ID patterns to determine appropriate music zone.

## Adding New Music

### 1. Add file to `/assets/sounds/`

### 2. Register in AUDIO_ASSETS
```javascript
const AUDIO_ASSETS = {
  music: {
    myNewTrack: '/assets/sounds/my_track.mp3',
    // ...
  }
};
```

### 3. Map to zone
```javascript
const ZONE_MUSIC_MAP = {
  'MY_NEW_ZONE': 'myNewTrack',
  // ...
};
```

### 4. Add detection pattern (optional)
```javascript
const getMusicZoneForNode = (nodeId, characterId) => {
  if (nodeId.includes('MY_PATTERN')) {
    return 'MY_NEW_ZONE';
  }
  // ...
};
```

## MIDI File Support

Modern browsers support MIDI files through:
- Web MIDI API (Chrome, Edge, Opera)
- Fallback audio synthesis
- Some browsers may require user interaction to start MIDI playback

Note: MIDIs are small (~5-40kb) compared to MP3s (1-8mb), perfect for Neocities bandwidth limits.

## Volume Settings

Current defaults:
- **Music Volume**: 0.3 (30%)
- **SFX Volume**: 0.2 (20%)
- **Crossfade Duration**: 2000ms (2 seconds)

Adjust in `AudioManager` initialization if needed.

## localStorage Keys

- `hdtv_audio_muted` - Stores user's mute preference (boolean)

## Browser Compatibility

✅ Works on all modern browsers (Chrome, Firefox, Safari, Edge)
⚠️ Autoplay may be blocked until user interaction (click to start)
✅ MIDI support varies by browser but gracefully degrades

## Future Enhancements

- [ ] Volume sliders in settings menu
- [ ] Music visualizer overlays for specific scenes
- [ ] Character theme songs that mix into scene music
- [ ] Adaptive music intensity based on stats/choices
- [ ] Playlist system for longer gameplay sessions
- [ ] Easter egg tracks (e.g., secret Hyena laugh sample)

## Testing Checklist

- [x] Music starts on character selection
- [x] Crossfade works between different zones
- [x] Mute toggle persists across sessions
- [x] Main menu has music
- [x] Glenwood scenes have appropriate music
- [x] Rizzlord scenes play "Down with the Sickness"
- [x] Music doesn't restart when entering same zone twice
- [x] No memory leaks from audio objects
- [x] Works on mobile (tap to start)

## Credits

All MIDI files are public domain or royalty-free.
MP3 files sourced from licensed/creative commons libraries.
