import pygame
import time

class LoopBreaker:
    def __init__(self, reason, screen):
        self.reason = reason
        self.screen = screen

    def break_loop(self):
        if self.reason == "gotta_pee":
            print("Madness paused. Loop broken.")
            self.draw("Madness paused. Loop broken.")
            return "kinetic_trust"
        elif self.reason == "wait_a_minute":
            print("Too late. The loop is now permanent.")
            self.draw("Too late. The loop is now permanent.")
            return "causal_lock"

    def draw(self, message):
        self.screen.fill((0, 0, 0))
        font = pygame.font.SysFont(None, 36)
        text = font.render(message, True, (255, 255, 255))
        self.screen.blit(text, (100, 200))
        pygame.display.flip()
