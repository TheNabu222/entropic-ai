# Nabu Sprite Audit

## Cleanup Performed

- Removed `dialogue-portraits/new-nabu_3 copy 2.png`.
- It was byte-for-byte and pixel-for-pixel identical to `dialogue-portraits/new-nabu_3 copy.png`.
- No game or editor reference to the removed filename was found.

## Why the Other Similar Files Remain

Several files look nearly identical at contact-sheet size but contain real differences in faces, costume details, poses, rendering, or resolution. Some are also listed in `assets/hudbot.html`.

The strongest near-duplicate groups are:

### Blue full-sheet sequence

- `special-ocassion/new-nabu_8.png`
- `special-ocassion/new-nabu_9 2.png`
- `special-ocassion/new-nabu_10.png`
- `special-ocassion/new-nabu_11.png`
- `special-ocassion/new-nabu_12.png`

### Generated sheet pairs

- `untitled folder/Gemini_Generated_Image_ (1).png`
- `untitled folder/2.png`
- `untitled folder/Gemini_Generated_Image_.png`
- `untitled folder/3.png`
- `untitled folder/Gemini_Generated_Image_iwo0eriwo0eriwo0.png`
- `untitled folder/4.png`

These should be reviewed visually before deletion because the higher-resolution file is not always merely an upscale.

## Current Clusters

1. Cohesive dark-cloak sprite sheets: `nabu_tru-*`
2. Blue outfit sprite-sheet experiments: `nabu-blu_*`
3. Individual blue outfit poses
4. Near-duplicate blue full-sheet iterations
5. Coherent pixel dialogue portraits: `nabu_dialouge-*`
6. Newer dialogue portrait experiments
7. Brown legacy Nabu: `misc-sprites/old-nabu/`
8. Miscellaneous generated poses

Open `NABU_SPRITE_REVIEW.html` to review these visually. Decisions are stored locally in the browser and can be exported as JSON.

## Initial Recommendation

- Strongest field-sprite candidate: the `nabu_tru-*` family.
- Strongest ready-to-use dialogue family: `nabu_dialouge-*`.
- Best detailed-model reference: blue outfit individual poses and sheets.
- Preserve brown Nabu as an alternate-costume or legacy family rather than mixing it into the canonical sprite set.
