import os
import shutil

src_dir = 'cavebot'
dest_dir = 'cavebot/ttrpg/assets'

if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)

mapping = {
    '_cavebot-bg_savannah(sunset)_3.png': 'bg_savannah.png',
    '_cavebot-bg_steppe-megafauna(day)_1.png': 'bg_savannah_day.png',
    '_cavebot-bg_headwaters(day)_5.jpg': 'bg_headwaters.jpg',
    '_cavebot-bg_psybernest(eggs)_1.png': 'bg_psybernest.png',
    '_cavebot-bg_reedbed(day)_4.png': 'bg_reedbed.png',
    '_cavebot-bg_river-ikibala(night)_2.png': 'bg_river.png',
    '_cavebot-scenes_nabu-gilgrokmesh(caveconflict-night).png': 'bg_cave.png',
    '_cavebot-bg_4.png': 'bg_generic.png',
    '_cavebot-sprites_nabu-neutral-standing_1.png': 'sprite_nabu.png',
    '_sprites_nabu(boneflute)_1.png': 'sprite_nabu_flute.png',
    '_sprites_nabu(offer)_6.png': 'sprite_nabu_offer.png',
    'sprites_nabu(thoughtful)_1.png': 'sprite_nabu_thoughtful.png',
    '_cavebot-sprites_anzu(shoebill)_1.png': 'sprite_bird.png',
    '_sprite-scenes_nabu-anzu(mechanzu)_1.png': 'sprite_mecha.png',
    '_cavebot-sprites_gilgrokmesh-spear_1.png': 'sprite_rival.png',
    '_sprites-gilgrokmesh(spearjab)_5.png': 'sprite_rival_jab.png',
    'sprites_gilgrokmesh_stand_6.png': 'sprite_rival_stand.png',
    '_cavebot-sprites_hyenaba_1.png': 'sprite_hyena.png',
    'cavebot_inventory_spear_1.png': 'item_spear.png',
    '_cavebot_inventory_boneflute_1.png': 'item_flute.png',
    'cavebot_inventory_fire_1.png': 'item_fire.png',
    '_cavebot.mp3': 'audio_theme.mp3',
    '_mechanzu - 11:27:25, 8.03 PM.mp3': 'audio_mechanzu.mp3',
    '_Shoe bill clacking.m4a': 'audio_clack.m4a',
    '_nabuinproximity2.wav': 'audio_proximity.wav'
}

for src_name, dest_name in mapping.items():
    src = os.path.join(src_dir, src_name)
    dst = os.path.join(dest_dir, dest_name)
    
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"Copied {src_name} -> {dest_name}")
    else:
        print(f"MISSING: {src_name}")
