import os

import google.generativeai as genai

from PIL import Image



# 1. SETUP: Put your API Key here (Use a fresh one if possible!)

GOOGLE_API_KEY = "AIzaSyC2ln7RYVS8nTF2qDw2YU_es-yo8DYxjos"

genai.configure(api_key=GOOGLE_API_KEY)



model = genai.GenerativeModel('gemini-1.5-flash')



# 2. CONFIG: Your specific path

IMAGE_FOLDER = "/Users/anastaziamartinez/Documents/GitHub/entropic-ai/cavebot/assets/image/" 

OUTPUT_FILE = "asset_manifest.txt"



def analyze_images():

    print(f"⚡️ Bolt Asset Scanner initializing in: {IMAGE_FOLDER}")

    

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:

        # os.walk() is the magic function that goes into subdirectories

        for root, dirs, files in os.walk(IMAGE_FOLDER):

            for filename in files:

                if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):

                    # We have to build the path differently now

                    image_path = os.path.join(root, filename)

                    

                    try:

                        img = Image.open(image_path)

                        

                        response = model.generate_content([

                            "Describe this pixel art game asset in 6 words or less. Be specific (e.g., 'Giant stone hammer icon').",

                            img

                        ])

                        

                        description = response.text.strip()

                        

                        # Get the relative path so we know which subfolder it's in

                        # e.g., "sprites/Nabu/nabu_idle.png"

                        rel_path = os.path.relpath(image_path, IMAGE_FOLDER)

                        

                        line = f"{rel_path} || {description}"

                        print(f"Scanned: {line}")

                        f.write(line + "\n")

                        

                    except Exception as e:

                        print(f"❌ Error scanning {filename}: {e}")



    print(f"\n✅ Scan complete! Manifest saved to: {OUTPUT_FILE}")



if __name__ == "__main__":

    analyze_images()