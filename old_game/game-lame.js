/*global Phaser*/
// https://ludumdare-finnp.c9.io/index.html

var game = new Phaser.Game(700, 700, Phaser.AUTO, 'game-div')

// mainState
var mainState = new Phaser.State()
mainState.preload = function preload() {
    game.load.image('player', 'assets/player.png')
    game.load.image('platform', 'assets/platform.png')
    game.load.image('enemy', 'assets/enemy.png')
}

mainState.create = function create() {
  // create player
  this.player = new Player(game.add.sprite(350, 350, 'player'))
  game.physics.arcade.enable(this.player.gameObject)
  this.player.create()
  
  // create enemies
  this.enemies = game.add.physicsGroup()
  this.enemies.enableBody = true
  this.enemies.create(350, 600, 'enemy')
  this.enemies.create(200, 600, 'enemy')
  this.enemies.create(100, 600, 'enemy')
  this.enemies.create(600, 600, 'enemy')
  this.enemies.setAll('body.gravity.y', 400)
  this.enemies.setAll('body.collideWorldBounds', true)
  
  //create platforms
  this.platforms = game.add.physicsGroup()
  this.platforms.create(350, 500, 'platform')
  this.platforms.create(500, 350, 'platform')
  this.platforms.forEach(function(platform) {
    platform.anchor.setTo(0.5,0.5)
  })
  this.platforms.setAll('body.immovable', true)
  this.platforms.setAll('width', 400)
  this.platforms.setAll('height', 40)

  // add controls
  this.cursor = game.input.keyboard.createCursorKeys()
  
  // background
  game.stage.backgroundColor = '#3498db'
  
  // physics
  game.physics.startSystem(Phaser.Physics.ARCADE)
  
  this.rotateCount = 0
  this.cursor.down.onDown.add(function() {
    // rotate once
    if(this.rotateCount === 0) {
      this.rotateCount = 45
      this.player.freeze()
    }
  }.bind(this))
}

mainState.update= function update() {
  
  game.physics.arcade.collide(this.player.gameObject, this.platforms)
  game.physics.arcade.collide(this.enemies, this.platforms)
  game.physics.arcade.collide(this.player.gameObject, this.enemies, enemyCollision, null, this)
  
  if(this.rotateCount > 0) {
    var angle = (Math.PI / 2) / 45
     rotate(this.player.gameObject, angle, game.world.centerX, game.world.centerY)
     rotate(this.player.gameObject.body.velocity, angle)
      this.platforms.forEach(function (platform) {
        rotate(platform, angle, game.world.centerX, game.world.centerY)
        platform.rotation += angle
      })
      this.enemies.forEach(function (enemy) {
        rotate(enemy, angle, game.world.centerX, game.world.centerY)
        enemy.rotation += angle
      })
    this.rotateCount--
  } else {
    this.player.unfreeze()
  }

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
  
// functions

// rotates an object with .x and .y attributes
function rotate(obj, r, centerx, centery) {
  centerx = centerx || 0
  centery = centery || 0
  var x = obj.x - centerx
  var y = obj.y - centery

  var cos = Math.cos(r)
  var sin = Math.sin(r)

  obj.x = (cos * x - sin * y) + centerx
  obj.y = (sin * x + cos * y) + centery
  
}

function enemyCollision(player) {
  alert('n00b')
  this.player.gameObject.kill()
}