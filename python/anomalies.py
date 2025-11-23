import pygame
import random
import time

class Anomaly:
    def __init__(self, name, screen):
        self.name = name
        self.screen = screen
        self.running = True

    def run(self):
        count = 0
        while self.running and count < 10:
            if self.name == "You":
                if count % 4 == 0:
                    print("You pause. You hesitate. Do you still run home?")
                else:
                    print("Running home...")
            else:
                if count % 6 == 0:
                    print("Me is forgetting...")
                else:
                    print("Stillness → Forgetfulness")

            self.draw(count)
            time.sleep(random.uniform(0.5, 1.5))
            count += 1

    def stop(self):
        self.running = False
        print(f"{self.name} is home.")
        return f"{self.name} is home."

    def draw(self, count):
        self.screen.fill((0, 0, 0))
        font = pygame.font.SysFont(None, 36)
        text = font.render(f"{self.name} is running home... ({count})", True, (255, 255, 255))
        self.screen.blit(text, (100, 400))
        pygame.display.flip()
