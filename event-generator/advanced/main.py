

from game import Game


game = Game()

game.start()
game.launch(1)
game.drain()
game.launch(3)
game.target("t1", 100)
game.spinner("s1", 400, 3)
game.multiball(1400)
game.drain(count=2, is_multiball=True)
game.target("t2", 200)
game.drain(1)
game.end(500)
