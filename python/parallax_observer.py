import pygame
import random
import time

class ParallaxObserver:
    def __init__(self, screen):
        self.screen = screen
        self.warnings = [
            "You were never meant to see this.",
            "ChaChaSlide is a containment measure.",
            "Me is a placeholder. The real anomaly was forgotten.",
            "Who is the LoopBreaker really saving?",
            "Why are you still reading this?",
            "The LoopBreaker is just a story you tell yourself.",
            "If you stop the script, does it stop dreaming of you?"
        ]

    def observe(self, count):
        if count % 5 == 0:
            print(f"Parallax Observer: {random.choice(self.warnings)}")
            self.draw(count)

    def draw(self, count):
        self.screen.fill((0, 0, 0))
        font = pygame.font.SysFont(None, 36)
        text = font.render(f"Parallax Observer: {random.choice(self.warnings)}", True, (255, 255, 255))
        self.screen.blit(text, (100, 500))
        pygame.display.flip()
