/*global Phaser*/
// https://ludumdare-finnp.c9.io/index.html

var game = new Phaser.Game(700, 700, Phaser.AUTO, 'game-div')

// mainState
var mainState = new Phaser.State()
mainState.preload = function preload() {
    game.load.image('player', 'assets/player.png')
    game.load.image('platform', 'assets/platform.png')
}

mainState.create = function create() {
  // create player
  this.player = new Player(game.add.sprite(350, 350, 'player'))
  game.physics.arcade.enable(this.player.gameObject)
  this.player.create()
  
  //create platforms
  this.platforms = game.add.physicsGroup()
  var platform = this.platforms.create(350, 500, 'platform')
  platform.width = 400
  platform.height = 40
  this.platforms.setAll('body.immovable', true)

  // add controls
  this.cursor = game.input.keyboard.createCursorKeys()
  
  // backgroundå
  game.stage.backgroundColor = '#3498db'
  
  // physics
  game.physics.startSystem(Phaser.Physics.ARCADE)
}

mainState.update= function update() {
  
  game.physics.arcade.collide(this.player.gameObject, this.platforms)
  
  this.player.gameObject.body.velocity.x = 0

  if (this.cursor.left.isDown) {
    this.player.gameObject.body.velocity.x = -220
  }
  if (this.cursor.right.isDown) {
    this.player.gameObject.body.velocity.x = 220
  }
  if (this.cursor.up.isDown && (this.player.gameObject.body.onFloor() || this.player.gameObject.body.touching.down)) {
    this.player.gameObject.body.velocity.y = -450
  }

}

game.state.add('main', mainState)
game.state.start('main')
  
  