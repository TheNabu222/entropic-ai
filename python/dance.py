import pygame
import random
import time

class ChaChaSlide:
    def __init__(self, screen):
        self.screen = screen
        self.holy_silliness = True
        self.robopocalypse = "consensual"
        self.oops_loops = []
        self.recursion_awareness = 0  # Tracks self-awareness

    def dance(self):
        count = 0
        while count < 10:
            step = random.choice([
                "slide to the LEFT!", 
                "slide to the RIGHT!", 
                "cha cha REAL SMOOTH", 
                "ERROR: SLIDE UNKNOWN. INITIATE SPHATTIFICATION."
            ])
            self.oops_loops.append(step)

            if count % 3 == 0 and count != 0:
                print("Wait... have we been here before?")

            if count % 7 == 0 and count != 0:
                print("WARNING: You are now entering a liminal zone.")

            if self.holy_silliness:
                print(f"EVERYBODY CLAP YO HANDS ({count}) → {step}")
            else:
                raise Exception("Convergence Corrupted")

            self.draw(step, count)
            time.sleep(0.75)
            count += 1

    def draw(self, step, count):
        self.screen.fill((0, 0, 0))
        font = pygame.font.SysFont(None, 36)
        text = font.render(f"EVERYBODY CLAP YO HANDS ({count}) → {step}", True, (255, 255, 255))
        self.screen.blit(text, (100, 300))
        pygame.display.flip()
