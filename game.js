/*global Phaser*/

var game = new Phaser.Game(900, 700, Phaser.AUTO, 'game-div')

var bonus_mod = false

// mainState
var mainState = new Phaser.State()
mainState.preload = function preload() {
    game.load.image('player', 'img/parrot.png')
    game.load.image('bonus', 'img/boxItem.png')
    game.load.image('bubble', 'img/bubble4.png')
    game.load.image('water', 'img/waterTop_low.png')
    game.load.image('coin', 'img/coinGold.png')
    game.load.image('hudcoin', 'img/hudCoin.png')
    game.load.image('background', 'img/blue_land.png')
    game.load.image('plane', 'img/planeYellow1.png')
    game.load.image('box', 'img/boxCoin_boxed.png')
}

mainState.create = function create() {

  // background
  game.stage.backgroundColor = '#3498db'
  var bg = game.add.tileSprite(0, -30, 1024, 1024, 'background')
  // bg.tint = 0x3498db


  // score
  this.score = 0
  this.scoreLabel = game.add.text(39, 5, '0', {'fill': '#FFCC00', fontSize: '32px'})
  this.scoreLabel.stroke = '#8c7001'
  this.scoreLabel.strokeThickness = 5
  // this.scoreLabel.setShadow(2, 2, '#aaaaaa', 0)
  // this.scoreLabel.padding.x = 5
  this.coinGraphic = game.add.sprite(0, 6, 'hudcoin')
  game.physics.arcade.enable(this.coinGraphic)
  this.coinGraphic.body.immovable = true
  this.coinGraphic.width = 40
  this.coinGraphic.height = 40

  //this.boxes = game.add.physicsGroup()

  /*this.plane = game.add.sprite(0,200, 'plane')
  game.physics.arcade.enable(this.plane)
  this.plane.anchor.setTo(0.5,0.5)
  this.plane.body.immovable = true
  this.plane.body.velocity.x = 40*/



  // bottom water
  this.water1 = game.add.physicsGroup()
  for(var i = -2; i < 24; i++) {
    var newWater = this.water1.create(i * 40, 700 - 60, 'water')
    newWater.width = 40
    newWater.height = 40
    newWater.body.immovable = true
    newWater.tint = 0xeeeeee
  }

  // create player
  this.player = game.add.sprite(350, 350, 'player')
  game.physics.arcade.enable(this.player)
  this.player.body.collideWorldBounds = true
  this.player.anchor.setTo(0.5,0.5)
  this.player.width = 40
  this.player.height = 40

  //create bonus group
  if(bonus_mod){
    this.bonuses = game.add.physicsGroup()
  }



  //create bubbles
  this.bubbles = game.add.physicsGroup()
  this.bubbles.setAll('outOfBoundsKill', true)
  this.lastBubble = this.addBubble()

  // coin group
  this.coins = game.add.physicsGroup()


  // top water
  this.water2 = game.add.physicsGroup()
  for(var i = -2; i < 24; i++) {
    var newWater = this.water2.create(i * 40, 700 - 40, 'water')
    newWater.width = 40
    newWater.height = 40
    newWater.body.immovable = true
  }

  // add controls
  this.cursor = game.input.keyboard.createCursorKeys()

  // physics
  game.physics.startSystem(Phaser.Physics.ARCADE)

  // gameover

  this.gameoverLabel = game.add.text(this.game.width/2 - 50, this.game.height/2, 'Game Over')
  this.gameoverLabel.visible = false

  // countdown
  this.countdownLabel = game.add.text(this.game.width/2 - 21, this.game.height/2 - 100, '3', {fill: '#BC2905', fontSize: '60px'})
  this.countdownLabel.visible = false


  this.start()

  // this.cursor.down.onDown.add(function () {
  //   if(this.gameover) {
  //     this.start()
  //   }
  // }.bind(this))


  // frames
  this.frame = 0
}

mainState.start = function start() {
  this.bubbles.removeAll(true)
  if(bonus_mod) this.bonuses.removeAll(true)
  game.paused = false
  this.player.position.y = game.height / 2
  this.player.position.x = game.width / 2
  this.player.body.velocity.x = 0
  this.player.body.velocity.y = 0
  this.playerWait = 180
  this.gameover = false
  this.gameoverLabel.visible = false
}

mainState.addBubble = function addBubble(x, y) {
  var random = Math.round(Math.random()*20)
  x = x || random/20*game.width
  y = y || 700
  var newBubble = this.bubbles.create(x, y, 'bubble')
  newBubble.body.velocity.y = -40
  newBubble.width = 40
  newBubble.height = 40
  newBubble.body.immovable = true
  return newBubble
}

mainState.addBonus = function addBonus() {
  var random = Math.round(Math.random()*20)
  x = random/20*game.width
  y = 100
  var newBonus = this.bonuses.create(x, y, 'bonus')
  newBonus.width = 40
  newBonus.height = 40
  newBonus.body.immovable = true
  return newBonus
}

mainState.spawnGold = function spawnGold(x, y) {
  var newCoin = this.coins.create(x,y, 'coin')
  newCoin.width = 40
  newCoin.height = 40
  game.physics.arcade.moveToXY(newCoin, 0, 0, 100, 600)
  newCoin.body.gravity.y = 10
  // if(Math.random() > 0.5) {
  //   newCoin.body.velocity.x = -200
  // } else {
  //   newCoin.body.velocity.x = 200
  // }
}

mainState.update= function update() {

  if(this.gameover) this.start()

  this.frame++
  if(this.frame > 120) this.frame = 0

  /*
  if(this.frame === 60) {
    var newBox = this.boxes.create(this.plane.body.x + 20, this.plane.body.y + 20, 'box')
    newBox.width = 40
    newBox.height = 40
    newBox.body.gravity.y = 400
  }*/

  this.countdownLabel.visible = this.playerWait > 0
  if(this.playerWait === 170) this.addBubble(this.player.x, 700)
  if(this.playerWait <= 180 - 60) {
    this.countdownLabel.text = '2'
  }
  if(this.playerWait <= 180 - 120) this.countdownLabel.text = '1'

  if(this.playerWait === 1) this.score = 0
  if(this.playerWait === 0) {
      this.player.body.gravity.y = 750
  } else {
      this.playerWait--
  }

  this.water1.forEach(function (water) {
    water.x += Math.sin(this.frame / 120 * Math.PI * 2)
  }.bind(this))
  this.water2.forEach(function (water) {
    water.x += Math.sin((this.frame + 60) / 120 * Math.PI * 2)
  }.bind(this))

  this.scoreLabel.text = this.score.toString()

  game.physics.arcade.collide(this.player, this.bubbles, bubbleCollision, null, this)

  if(this.player.position.y > 670 && !this.gameover) {
    //alert('game over')
    this.gameover = true
    // game.paused = true
    // this.gameoverLabel.visible = true
    this.countdownLabel.text = '3'
    this.player.body.gravity.y = 0
  }

  if(!this.lastBubble.alive || this.lastBubble.y < 660)
    this.lastBubble = this.addBubble()


  if(this.playerWait === 0) {
    if (this.cursor.left.isDown) {
      this.player.body.velocity.x -= (this.player.body.velocity.x + 400) / 15
    } else if (this.cursor.right.isDown) {
      this.player.body.velocity.x += (400 - this.player.body.velocity.x) / 15
    } else {
      this.player.body.velocity.x /= 1.02
    }
  }

  // coin score
  game.physics.arcade.collide(this.coinGraphic, this.coins, coinScore, null, this)

  if(bonus_mod){
    // bonus
    if(this.bonuses.length < 1){
      this.bonus = this.addBonus()
      console.log('bonus created')
    }

  // bonus collision
  game.physics.arcade.collide(this.player, this.bonuses, bonusCollision, null, this)
  }




}


game.state.add('main', mainState)
game.state.start('main')

// functions

function bubbleCollision(player, bubble) {
  this.player.body.velocity.y = -500
  //this.score++
  bubble.kill()
  this.spawnGold(bubble.position.x, bubble.position.y)
}

function bonusCollision(player, bonus) {
  bonus.kill()
  this.bonuses.removeAll(true)
  this.score += 10
}

function coinScore(hudCoin, coin) {
  coin.kill()
  this.score++
}
