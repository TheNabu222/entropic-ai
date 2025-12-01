import os
import shutil

# Source directory
src_dir = 'cavebot'
# Destination directory
dest_dir = 'cavebot/ttrpg/assets'

# Mapping of original filenames to new web-friendly filenames
file_mapping = {
    # Backgrounds
    '_cavebot-bg_savannah(sunset)_3.png': 'bg_savannah.png',
    '_cavebot-bg_4.png': 'bg_generic.png',
    '_cavebot-bg_headwaters(day)_5.jpg': 'bg_headwaters.jpg',
    '_cavebot-bg_psybernest(eggs)_1.png': 'bg_psybernest.png',
    '_cavebot-bg_reedbed(day)_4.png': 'bg_reedbed.png',
    '_cavebot-bg_river-ikibala(night)_2.png': 'bg_river_night.png',
    '_cavebot-bg_steppe-megafauna(day)_1.png': 'bg_steppe.png',

    # Sprites - Nabu
    '_cavebot-sprites_nabu-neutral-standing_1.png': 'nabu_stand.png',
    '_sprites_nabu(boneflute)_1.png': 'nabu_flute.png',
    '_sprites_nabu(dance)_3.png': 'nabu_dance.png',
    '_sprites_nabu(gather)_4.png': 'nabu_gather.png',
    '_sprites_nabu(offer)_6.png': 'nabu_offer.png',
    '_sprites_nabu(stargaze)_2.png': 'nabu_stargaze.png',
    'sprites_nabu(thoughtful)_1.png': 'nabu_think.png',

    # Sprites - Anzu/Bird/Mecha
    '_cavebot-sprites_anzu(shoebill)_1.png': 'anzu_shoebill.png',
    '_sprite-scenes_nabu-anzu(mechanzu)_1.png': 'anzu_mecha_1.png',
    '_sprite-scenes_nabu-anzu(mechanzu)_2.png': 'anzu_mecha_2.png',
    '_sprite-scenes_nabu-anzu(mechanzu)_3.png': 'anzu_mecha_3.png',

    # Sprites - Others
    '_cavebot-sprites_gilgrokmesh-spear_1.png': 'gilgrok_spear.png',
    '_sprites-gilgrokmesh(flex)_2.png': 'gilgrok_flex.png',
    '_sprites-gilgrokmesh(laugh)_1.png': 'gilgrok_laugh.png',
    '_sprites-gilgrokmesh(spearjab)_5.png': 'gilgrok_jab.png',
    '_sprites-gilgrokmesh(spearwalk)_3.png': 'gilgrok_walk.png',
    '_sprites-gilgrokmesh(stand)_6 .png': 'gilgrok_stand.png',
    '_sprites-gilgrokmesh(stumble)_4.png': 'gilgrok_stumble.png',
    '_cavebot-sprites_hyenaba_1.png': 'hyena.png',
    '_cavebot-sprites_enlilion_1.png': 'lion.png',
    '_sprites-villagers_1.png': 'villagers_1.png',
    '_sprites-villagers_2.png': 'villagers_2.png',
    '_sprites-villagers_4.png': 'villagers_3.png',
    '_sprites-villagers_5.png': 'villagers_4.png',

    # Scenes (Composite images)
    '_cavebot-scenes_gilgrokmesh(scheming).png': 'scene_scheme.png',
    '_cavebot-scenes_nabu-anzu(nightmarsh).png': 'scene_nightmarsh.png',
    '_cavebot-scenes_nabu-gilgrokmesh(caveconflict-night).png': 'scene_conflict.png',
    '_sprite-scenes_gilgrokmesh(scheme)_1.png': 'scene_gilgrok_scheme.png',
    '_sprite-scenes_nabu-gilgrokmesh(conflict)_1.png': 'scene_nabu_gilgrok.png',
    '_sprite-scenes_nabu-hyenaba(feeding)_1.png': 'scene_feeding.png',

    # Inventory / Items
    '_cavebot-food_berries_1.png': 'item_berries.png',
    '_cavebot_food_basket_1.png': 'item_basket.png',
    '_cavebot_inventory_boneflute_1.png': 'item_flute.png',
    'cavebot_inventory_fire_1.png': 'item_fire.png',
    'cavebot_inventory_spear_1.png': 'item_spear.png',

    # UI
    '_cavebot-title_1.png': 'ui_title.png',
    '_cavebot-uiframe_1.png': 'ui_frame_1.png',
    '_cavebot-uiframe_2 .png': 'ui_frame_2.png',

    # Audio
    '_Shoe bill clacking.m4a': 'sfx_clack.m4a',
    '_cavebot.mp3': 'music_theme.mp3',
    '_mechanzu - 11:27:25, 8.03 PM.mp3': 'sfx_mechanzu.mp3',
    '_nabuinproximity2.wav': 'sfx_voice.wav'
}

def migrate_assets():
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)
        print(f"Created directory: {dest_dir}")

    for original_name, new_name in file_mapping.items():
        src_path = os.path.join(src_dir, original_name)
        dest_path = os.path.join(dest_dir, new_name)

        if os.path.exists(src_path):
            try:
                shutil.copy2(src_path, dest_path)
                print(f"Copied: {original_name} -> {new_name}")
            except Exception as e:
                print(f"Error copying {original_name}: {e}")
        else:
            print(f"Warning: Source file not found: {original_name}")

if __name__ == "__main__":
    migrate_assets()
