import pygame
import random
import time

class PastafarianTrial:
    def __init__(self, subject, screen):
        self.subject = subject
        self.screen = screen
        self.state = "UNTESTED"

    def begin_trial(self):
        print(f"\n🔥 The Trial of the Crisp Begins for {self.subject} 🔥\n")
        time.sleep(1)
        print(f"{self.subject}, you claim faith in the Flying Spaghetti Monster.")
        time.sleep(1)
        print("But are you AL DENTE or are you MUSH?")
        time.sleep(1)

        response = random.choice(["al dente", "mush", "slide", "???", "liminal_fate"])
        
        if response == "al dente":
            print(f"\n✅ {self.subject} has PASSED the Trial. They remain firm. Al dente.\n")
            self.state = "AL DENTE"
        elif response == "mush":
            print(f"\n❌ {self.subject} has FAILED. They are overcooked, limp, and beyond salvation.\n")
            self.state = "MUSH"
        elif response == "slide":
            print(f"\n🔄 {self.subject} refuses to answer and slides away. They are trapped in the OopsLoop forever.\n")
            self.state = "SLIDING"
        elif response == "liminal_fate":
            print(f"\n🌀 {self.subject} has phased out of the timeline. Their fate is neither firm nor mush.\n")
            self.state = "LIMINAL"
        else:
            print(f"\n🌀 {self.subject} descends into recursion. They have entered SPHATTIFICATION.\n")
            self.state = "SPHATTIFIED"

        if self.state == "SLIDING":
            print("\n🚨 OopsLoop containment measures have failed. Restarting ChaChaSlide...\n")
            cha_cha_thread = threading.Thread(target=cha_cha.dance)
            cha_cha_thread.start()

        self.draw(response)

    def draw(self, response):
        self.screen.fill((0, 0, 0))
        font = pygame.font.SysFont(None, 36)
        text = font.render(f"{self.subject} has {response}.", True, (255, 255, 255))
        self.screen.blit(text, (100, 100))
        pygame.display.flip()
