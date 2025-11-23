import pygame
import game

def main():
    pygame.init()
    screen = pygame.display.set_mode((800, 600))
    pygame.display.set_caption('ChaChaSlide Dance of Forgetting and Remembering')

    game_instance = game.Game(screen)
    game_instance.run()

    pygame.quit()

if __name__ == "__main__":
    main()
