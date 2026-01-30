# 🐆 CoAIexist: The Hyena Diva Protocol - Ultimate Edition

## Vision
Lucas Arts × Humongous Games × Pokémon × Skyrim = Baby spotted hyena cub on a Barbie-fueled DMT trip through 4chan

## Game Architecture

### Core Systems
1. **Point-and-Click Adventure Engine**
   - Clickable hotspots on backgrounds
   - Verb system (Look, Use, Talk, Take)
   - Inventory management with interactive objects
   - Character sprites with dialogue trees

2. **CYOA/Rashomon Branching**
   - Multiple POV perspectives (Nabu, HD, Rizzler, Sypher)
   - Timeline manipulation
   - Memory system for tracking contradictions
   - Stat-influenced dialogue unlocks

3. **TTRPG Elements**
   - Stats: Intelligence, Charm, Empathy, Ego, Entropy
   - Skill checks with d20 mechanics
   - Character progression
   - Faction relationships

### Technical Foundation
- **Platform**: Neocities static hosting
- **Framework**: React 18.2.0 via CDN (esm.sh)
- **State Management**: LocalStorage for saves
- **Assets**: 1,287+ files (sprites, GIFs, backgrounds, audio)
- **Aesthetic**: Safari bling maximalist UI

## Current Assets

### Sprites
- `hd_sprite.png` - Hyena Diva main character
- `nabu_sprite.png` - Nabu the anthropologist
- `rizzler_sprite.png` - The Rizzlord
- `sypher_sprite.png` - Sypher character

### Backgrounds
- `gwood.png` - The Glenwood bar/stage
- `rizzlers_room.png` - Rizzlord's lair
- `hd_bg.png` - HD's space
- `hd_asset-1.png` through `hd_asset-7.png` - Various locations

### Animation Libraries
- `barbie_gifs/` - 265 cosmic/fabulous GIFs
- `hyena_gifs/` - 252 hyena-themed GIFs
- `dollz/dividers/` - Section break animations

### Audio
- `Disturbed.mid` - "Down with the Sickness" (Rizzlord theme)
- `Aqua_Barbie_Girl.mid` - Cosmic realm music
- `pink_panther.mid` - Predator mode
- `MapleLeafRag.mp3`, `EntertainerRag.mp3` - Glenwood ambience
- Various ragtime MIDIs

## Development Phases

### Phase 1: Foundation ✅
- [x] Merge safari bling aesthetic
- [x] Preserve all game logic
- [x] Create project structure

### Phase 2: Music System (CURRENT)
- [ ] Dynamic zone-based music switching
- [ ] Crossfade system
- [ ] Music mute toggle
- [ ] Scene-specific audio cues

### Phase 3: Visual Enhancement
- [ ] Replace emoji floaters with GIF animations
- [ ] Scene-specific visual effects
  - Glenwood: Stage lights, smoky atmosphere
  - Cosmic realm: Holographic pink, stars
  - Rizzlord's lair: Dark glitch effects
- [ ] Animated dividers between sections

### Phase 4: Point-and-Click Mechanics
- [ ] Clickable hotspot system
- [ ] Verb menu UI
- [ ] Enhanced inventory with item interactions
- [ ] Object examination text

### Phase 5: Scene Expansion
- [ ] Build complete Glenwood scene
- [ ] Rizzlord confrontation scene
- [ ] Cosmic GFW realm
- [ ] Additional locations from plot

## Story Locations

1. **The Glenwood** - Blues bar where HD performs
2. **Rizzler's Digital Lair** - Where the confrontation happens
3. **Cosmic Realm/GFW** - Hyena Great Female Within
4. **Rogers Park Streets** - Transitional areas
5. **Nabu's Apartment** - Investigation HQ

## Key Narrative Beats
- HD's journey from matriarchal expectations to cosmic self
- Rizzlord as shadow archetype
- Nabu as observer/player proxy
- Barbie/Inanna divine feminine parallels
- Rashomon truth mechanics

## CSS Theme System

### Current Variables
```css
--safari-gold: #e5cf8c
--hot-pink: #ff00ff
--lime-slime: #32CD32
--aqua-pop: #00FFFF
--olo-cyan: #00ffcc
--safari-spot: #422
```

### Scene-Specific Overrides (Planned)
- Glenwood: Warm stage lighting (#ffaa00, #ff6b35)
- Cosmic: Holographic shifts (pink/purple gradients)
- Rizzlord: Dark corruption (#1a001a, glitch effects)

## File Structure
```
hyena-diva-ultimate/
├── index.html          # Main game file
├── PROJECT.md          # This file
├── scenes/            # Individual scene modules (future)
├── assets/            # Symlink to main asset library
└── docs/              # Development notes
```

## Development Guidelines
- Keep Neocities compliant (no backend, pure static)
- Maintain save/load functionality
- Progressive enhancement (works without JavaScript for text)
- Mobile-responsive (touch-friendly hotspots)
- Performance: Lazy load GIFs, preload critical assets

## Next Steps
1. Build dynamic music manager
2. Integrate GIF animations
3. Enhance first playable scene (The Glenwood)
4. Add clickable hotspot prototype
5. Expand dialogue trees with new content
