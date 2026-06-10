# Cavebot Asset Archaeology

This document describes the project implied by the assets and game notes. It is intentionally preservation-first: it does not rename, move, or delete anything.

## The Project Hiding Inside the Folder

Cavebot is a social point-and-click RPG presented as a homemade late-1990s/early-2000s game artifact.

The first act appears to be a Paleolithic village comedy and relationship simulator. Nabu explores the settlement, talks to villagers, gathers resources, develops skills, manages needs and reputation, and courts a mysterious shoebill. The world gradually reveals impossible historical objects, visual discontinuities, recursive symbols, and timeline contamination. When the shoebill becomes MechAnzu, the apparent prehistoric world opens into the containment/backrooms plot.

The deliberately clashing art is part of the premise:

- pixel-art characters and landscapes
- photobashed and AI-generated scenes
- animated GIFs and 3D objects
- skeuomorphic/Y2K interface frames
- Lisa Frank, Frutiger Aero, CD-ROM, Flash-game, and cursed-web aesthetics
- anachronistic objects that begin as jokes and become evidence

The asset problem is therefore not “too many styles.” The actual problem is that production assets, prototypes, source material, references, alternate generations, and future-act material are stored at the same level.

## The Demo Spine

The notes and repeated scene prototypes point to a clear first-act sequence.

### 1. Nabu's Shelter

Nabu wakes from a dream after hearing an unfamiliar shoebill clack. Her first response establishes an initial disposition or skill tendency. Gilgrokmesh interrupts to show off his badly made “Alpha Spear,” leaves it behind, and introduces the game's dialogue tone.

Relevant assets:

- `backdrops/scenes/_nabus-hearth_cavebot-scenes_1.png`
- `backdrops/scenes/_cavebot-scenes_9.png`
- Nabu sprites and dialogue portraits
- Gilgrokmesh standing, flexing, laughing, walking, and spear sprites
- shelter and domestic backgrounds
- fire, breath, movement, cartoon, and interface sounds

### 2. Village Orientation

The player leaves the shelter and learns navigation, clicking, dialogue, inventory, reputation, needs, and skill systems. The village should feel populated before the main mystery advances.

Relevant assets:

- `maps/`
- `backdrops/domestic-bg_/`
- `sprites/npcs/`
- villager sprite sheets in `sprites/misc/`
- food, inventory, vegetable, fruit, mushroom, and general item icons
- `emote-speech/`

### 3. En and Nin's Anniversary

En loves Nin but dislikes being tickled and cannot express the boundary. Nabu overhears En receiving absurdly stoic advice from Abasen. The quest teaches social interpretation, advice, relationship reputation, and nonviolent problem solving.

Relevant assets:

- `sprites/npcs/nin-and-en/`
- `sprites/npcs/abbasen.png`
- village, town hall, or domestic backgrounds
- dialogue portraits and centered/left/right speech animations

### 4. Farmer–Fisher Telephone Game

A chain of misunderstood messages causes the farmer and fisher to switch jobs. Both are out of their depth. This quest teaches talking to multiple NPCs, comparing accounts, journal updates, and possibly gathering or trade mechanics.

Relevant assets:

- `sprites/npcs/farmer.png`
- food, fish, plant, tool, and inventory icons
- river, wetland, village, and market backgrounds
- maps and journal/card UI

The fisher does not yet appear to have a clearly named production sprite set.

### 5. Gilgrokmesh and the Children

Nin asks Nabu to check whether Gilgrokmesh is distributing snacks fairly. Gil is performing an “alpha” mythology for the children, based partly on an actual encounter with the Panopticon. Clicking each child reveals a different reaction to his influence.

This is one of the most developed sequences in the folder.

Relevant assets:

- `backdrops/scenes/gilandkids.pdf`
- `backdrops/scenes/Screenshot 2026-04-25 at 11.00.06 AM.png`
- `backdrops/scenes/Screenshot 2026-04-20 at 3.23.45 AM.png`
- Gilgrokmesh's large animation set
- child sprites for Biluda, Dagrim, Didila, Garza, Gizzal, Henbur, Namluh, Penzer, and Simrush

The eight-page `gilandkids.pdf` demonstrates an important interaction model: one scene remains visible while clicking individual children changes Nabu's observation text. This is closer to a point-and-click inspection scene than a conventional cutscene.

### 6. Lunamkita and the Broken Bone Flute

Lunamkita gives Nabu an apparently useless flute because she “never mistakes useless for worthless.” This introduces trade, curios, inventory, dialogue reputation, and the transformation artifact.

Relevant assets:

- `sprites/npcs/lunamkita/`
- bone-flute recordings at the asset root
- inventory and curio icons
- market/trader environments

The flute is both an early comic inventory object and the end-of-demo transformation key.

### 7. Village Perimeter and Hyenaba

Nabu follows the clacking beyond the settlement. Hyenaba introduces the relationship between Nabu's reputation and the clan's tolerance of local hyenas. Wilderness screens teach foraging, hunting, ambient clicking, and low-stakes discovery.

Relevant assets:

- `sprites/hyenaba/`
- `sprites/animals/`
- `backdrops/landscape/`
- `backdrops/empty/`
- `icons/food/`, `icons/veg-fruit/`, and `icons/MushroomAssetPack/`
- nature ambience and animal/cartoon effects

### 8. First Shoebill Encounter

After several exploration screens, Nabu meets the shoebill. She can compliment him, offer caveberries, offer Gil's shoddy spear, ask to scritch him, or leave. The bird loves the berries and the bad spear but initially refuses touch.

Relevant assets:

- `sprites/Anzu /`
- `backdrops/scenes/Screenshot 2026-04-25 at 7.42.25 AM.pdf`
- `backdrops/scenes/Screenshot 2026-05-01 at 5.23.21 AM.png`
- `_cavebot-scenes_4-anzu&nabu-duskyriver.png`
- `_cavebot-scenes_5-nabu&anzu.png`
- `_sprite-scenes_6-nabu&anzu.png`
- shoebill courtship portraits and poses

This scene establishes that affection is earned through repeated attention, offerings, and consent rather than through a single puzzle.

### 9. Repeatable Days and Slow Contamination

The player can continue village life without immediately finishing the plot. Daily routines, NPC interactions, needs, skills, gathering, and courtship continue while tiny anachronisms accumulate.

The world should initially treat these anomalies as normal:

- impossible animals
- hidden mermaids and decorative GIFs
- technology-like artifacts
- a volcano and ziggurat that may be the same object
- inconsistent furniture, scenery, or architecture
- the spherical Panopticon or “Bugatti in the Sky”

This is where the mixed visual library becomes narrative machinery.

### 10. Flute Song and MechAnzu

Once the shoebill relationship is high enough and the flute has been repaired or understood, Nabu can attempt a melody. The song triggers the Anzu/MechAnzu revelation and ends the demo by exposing the larger containment story.

Relevant assets:

- MechAnzu transformation and action sprites
- Anzu dialogue portraits
- `sprites/scene sprites/`
- `backdrops/scenes/_cavebot-scenes_1-nabu&mechanzu.png`
- deck cards such as `anzu calling`, `containment chic`, `false archive`, `error is the prayer`, and `the recursive knot`
- glitch, backrooms, experimental, 3D, and recursive-symbol material

## Core Folder Interpretation

### `sprites/`

This is the strongest production-ready folder.

#### Nabu

Nabu has the deepest set: movement/pose variants, multiple visual generations, eleven emotional dialogue portraits, special-occasion images, and older brown-clothing variants.

The three major versions appear to be:

- `nabu_tru-*`: a compact, consistent sprite-sheet family
- `nabu-blu_*`: a blue-clothing family
- `misc-sprites/old-nabu/nabu-brwn_*`: an older brown-clothing family

These should not be mixed casually. One family should become the demo's canonical field sprite, while the others remain costume, prototype, special-scene, or archive sets.

#### Gilgrokmesh

Gil has a compact but unusually complete action language: standing, walking, flexing, laughing, stumbling, attacking, spear-jabbing, scheming, screaming, displeased, menacing, haughty, smiling, and arm-crossed.

This supports his role as comic antagonist, quest NPC, visual performer, and later antihero. Gil is much closer to implementation-ready than most NPCs.

#### Anzu

Anzu's folder contains three different states:

- ordinary shoebill
- expressive/courtship shoebill
- MechAnzu and transformation material

These are narratively distinct and should eventually be separated without erasing their relationship.

#### NPCs

The NPC folder proves the village was intended as the game's true center rather than background decoration.

Substantial sets exist for:

- Lunamkita
- Nin and En
- Nintabira the butcher
- the herbalist
- Didila
- Namluh
- Penzer
- the larger children group

Single or limited images exist for Abasen, Amaedina, the farmer, and several unnamed villagers.

Likely missing or underdeveloped production sets:

- fisher
- baker
- town scribe
- clan shaman/oracle as a finalized character
- smith
- trainer
- teacher
- possibly a named general-goods trader distinct from Lunamkita

### `backdrops/scenes/`

This is not a backdrop folder in the conventional sense. It is a prototype and composition history.

It contains:

- gameplay mockups
- scene composites
- screenshots of builds
- dialogue-layout experiments
- title images
- map concepts
- cutscene illustrations
- finished-looking encounter screens
- alternate frames and aspect ratios

The dated screenshots reveal iteration:

1. unframed collage scenes
2. dialogue overlays
3. decorative thematic frames
4. side inventory/navigation rails
5. CRT/window-like containers
6. more coherent point-and-click compositions

The recurring compositions identify the important locations:

- Nabu's shelter/hearth
- village family/children area
- savanna or settlement outskirts
- river/wetland shoebill habitat
- forest path
- coast at dusk
- mountain wilderness
- anomalous or backrooms interiors

### `backdrops/domestic-bg_/`

This appears to be the village/interior location library. It should eventually be grouped by playable location rather than retained as one numbered sequence.

Likely future groups:

- Nabu's shelter
- town hall
- market
- family shelters
- school/children area
- butcher
- herbalist
- workshop/crafting
- communal meal area

### `backdrops/landscape/` and `_current-palette/`

These are partly environment candidates and partly visual research.

`_current-palette/` is especially revealing: forests, coasts, mountains, deserts, snow, caves, stylized side-scrolling layers, and painterly references all share saturated twilight colors and strong silhouettes.

This folder is best understood as an art-direction board, not a production folder. Its job is to answer:

- What does Cavebot wilderness feel like?
- How saturated should nature be?
- What times of day recur?
- What shapes and horizons read well behind sprites?

### `backdrops/empty/`

These appear to be clean or relatively clean staging environments intended to receive characters, props, GIFs, and interface layers.

This is a valuable production concept. The clean base should remain separate from:

- composited scene
- interactive-object overlay
- UI frame
- dialogue state

### `backdrops/experimental/`

This is likely where future-act, anomaly, 3D, and style-test material belongs. It should not be used as a default dumping ground, but the category itself is legitimate because experimentation is part of Cavebot's visual identity.

### `ui-ux/`

The UI folder is an interface-frame laboratory.

The strongest repeated direction combines:

- a large central stage
- ornate pseudo-ancient framing
- neon cyan/pink interference
- a side rail for inventory, stats, or relationships
- a bottom dialogue layer
- occasional CRT or translucent OS-window framing

The UI is not merely decoration. It can communicate the plot:

- “prehistoric” ornamentation is the initial fiction
- Y2K/CRT elements leak through as the timeline destabilizes
- glitch and containment styling increase near MechAnzu's reveal

### `deck/`

The card deck is almost entirely later-game symbolic language.

The cards reference:

- Anzu calling
- containment
- false archives
- recursive knots
- feedback loops
- syntax and prayer
- glitches
- AI tenderness
- authorship
- forbidden directories
- decay of offerings

These are excellent thematic assets, but most should be withheld from the early demo. One or two could appear as unexplained anomalies; the full system belongs after the transformation reveal.

### `maps/`

The maps divide into three visual families:

- river/settlement maps
- island or regional world maps
- dense neon/glitch maps

For the demo, only a small local map is needed:

- Nabu's shelter
- town square/town hall
- market and trades
- children/family area
- village perimeter
- foraging zone
- river/wetland shoebill zone

The regional and glitch maps can remain future-act material.

### `icons/`

The icon library strongly supports gathering, food, recipes, trade, crafting, and inventory.

Useful existing groups:

- food
- vegetables and fruit
- mushrooms
- inventory
- transparent objects
- a large “goblin” set that appears to function as a broad fantasy-item library

The icon problem is abundance rather than absence. The demo needs a curated item registry, not more item art.

### `audio/`

The audio library supports four distinct layers:

- environmental ambience
- character exertion and vocal reaction
- cartoon interaction feedback
- score and reference music

The Hanna-Barbera collection fits the clickable-toy comedy. Nature loops support long ambient exploration. The very large voice-effects collections are probably source libraries rather than assets that should ship wholesale.

The root-level flute recordings directly support the main artifact and should be promoted into a clearly labeled flute/Anzu story collection.

### `emote-speech/`

The left, center, and right variants suggest an early reusable conversation-position system. This is a small but coherent production system and should be preserved.

### `gifs/`

The GIF library is not disposable visual noise. Small animated surprises are part of the Humongous Entertainment-style interaction promise.

The useful distinction is:

- functional HUD GIFs
- environmental ambient GIFs
- clickable gag GIFs
- anomaly/time-slip GIFs
- future/backrooms GIFs

### `3ds/`

Despite the name, this folder mostly contains rendered image references rather than 3D source files. Actual FBX files are mixed into the backdrop hierarchy.

The conceptual category is valid—3D objects are part of the intentional visual clash—but source models, renders, and gameplay-ready animated objects need separate labels.

### `_unsorted-cavebot/`

This is the largest unresolved visual inbox. It contains too many assets to reason about through filenames.

It should not be mass-renamed or automatically distributed based only on image similarity. It needs a visual review with broad tags:

- character
- animal
- environment
- prop
- item icon
- interface
- effect
- symbol
- anomaly
- future act
- reference
- reject/archive

### `misc/`

The numbered `misc` folders are actually several imported asset packs:

- `misc1`: generic numbered sprite/icon set
- `misc2`: `Icon*.png`
- `misc3`: alchemy icons
- `misc4`: 534 `item*.png` assets
- `misc5`: 163 `.large.png` assets
- `misc6`: trees, flowers, and bushes

These are source libraries. They should be cataloged as packs and curated into the game rather than copied wholesale into production folders.

## Systems Already Supported by Assets

The folder contains enough material to implement:

- dialogue trees
- relationship/affection
- clan reputation
- day/night repetition
- needs
- inventory
- foraging
- recipes and food
- trade/barter
- skill progression
- journal/quest log
- clickable ambient gags
- character observations
- local map navigation
- simple hunting encounters
- visual anomaly escalation
- transformation cutscene

## Systems That Need Design More Than Art

The following are described in notes but do not yet have a clear implementation contract:

- how initial dream choices modify skills
- exact reputation groups and thresholds
- daily action/energy economy
- hunger and rest timing
- how connection, spiritual, novelty, and community needs differ mechanically
- how skills unlock dialogue or interactions
- how flute repair progresses
- precise Anzu affection thresholds
- which quests are required to finish the demo
- how many days anomalies need before escalating
- whether hunting is a menu, hotspot sequence, or minigame
- whether trade uses currency, barter values, favors, or reputation

## Visual Rules Worth Protecting

1. The collage should feel authored, not cleanly homogenized.
2. Early scenes need enough consistency that later glitches register as changes.
3. Nabu, Gil, and Anzu need stable canonical field sprites.
4. Interface framing can evolve with the containment reveal.
5. Anachronisms should begin deniable and become undeniable.
6. Clickable jokes should reward curiosity without creating quest clutter.
7. The village should feel socially dense even when the main plot is paused.
8. Future-act symbolic material should be rationed in the demo.

## Recommended Asset Status Labels

Every asset should eventually receive one status:

- `production`: intended for the current playable demo
- `candidate`: plausible, awaiting selection or cleanup
- `prototype`: used to communicate layout, scene, or mechanic
- `source`: unedited asset-pack or generated material
- `reference`: art direction or inspiration
- `future`: intended for post-demo acts
- `archive`: superseded but worth retaining
- `reject`: safe to remove after human review

## Preservation-First Reorganization

Do not immediately rename or move the current tree. Existing HTML exports contain exact asset URLs.

The safe sequence is:

1. create a machine-readable manifest of every asset
2. assign category, status, character/location, act, and notes
3. identify which files are referenced by existing builds
4. select canonical sprites and scene bases
5. create a new organized production tree using copies or generated aliases
6. update game references through a script
7. verify every scene
8. archive old paths only after the new build works

## Immediate Demo Asset Collections

The first implementation pass should curate only these collections:

1. Nabu canonical field sprites and portraits
2. Gilgrokmesh canonical field sprites and portraits
3. ordinary Anzu sprites and courtship portraits
4. Hyenaba sprites
5. Nin, En, Abasen, Lunamkita, Nintabira, farmer, fisher, and child sprites
6. Nabu's shelter
7. town hall/town square
8. market
9. children area
10. village perimeter
11. three wilderness/foraging screens
12. shoebill meeting screen
13. one canonical UI frame
14. starter inventory icons
15. quest-specific icons: spear, berries, flute, snacks, fish, farm goods
16. ambient nature, shoebill clack, cartoon click, inventory, dialogue, and flute sounds

Everything else can remain visible in the archive without competing for implementation attention.
