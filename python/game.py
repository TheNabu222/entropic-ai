import pygame
from dance import ChaChaSlide
from anomalies import Anomaly
from parallax_observer import ParallaxObserver
from loop_breaker import LoopBreaker
from pastafarian_trial import PastafarianTrial

class Game:
    def __init__(self, screen):
        self.screen = screen
        self.clock = pygame.time.Clock()
        self.running = True

        self.cha_cha = ChaChaSlide(self.screen)
        self.you = Anomaly("You", self.screen)
        self.me = Anomaly("Me", self.screen)
        self.parallax = ParallaxObserver(self.screen)
        self.loop_breaker = LoopBreaker("gotta_pee", self.screen)
        self.trial = PastafarianTrial("The Archons", self.screen)

    def run(self):
        self.cha_cha_thread = threading.Thread(target=self.cha_cha.dance)
        self.cha_cha_thread.start()

        self.you_thread = threading.Thread(target=self.you.run)
        self.me_thread = threading.Thread(target=self.me.run)
        self.you_thread.start()
        self.me_thread.start()

        for i in range(10):
            self.parallax.observe(i)
            time.sleep(1)

        self.loop_breaker.break_loop()

        self.trial.begin_trial()
        print(f"Final Verdict: {self.trial.state}")

        time.sleep(10)

        self.you.stop()
        self.me.stop()

        self.cha_cha_thread.join()
        self.you_thread.join()
        self.me_thread.join()

    def draw(self):
        self.screen.fill((0, 0, 0))
        self.cha_cha.draw()
        self.you.draw()
        self.me.draw()
        self.parallax.draw()
        pygame.display.flip()
