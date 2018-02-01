const TIME_BETWEEN_BONUS_CREATION = 10000

var game = new Phaser.Game(900, 700, Phaser.AUTO, 'game-div')

var mainState = new Phaser.State()
mainState.preload = function preload () {
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

mainState.create = function create () {
  createBackground()

  this.score = 0
  this.scoreLabel = createScoreLabel()
  this.scoreIcon = createScoreIcon()

  this.frontWaves = createWaves(60, 0xeeeeee)

  this.player = createPlayer()

  this.bonuses = game.add.physicsGroup()

  this.bubbles = createBubbles()
  this.lastBubble = this.addBubble()

  this.coins = game.add.physicsGroup()

  this.backWaves = createWaves(40)

  this.cursor = game.input.keyboard.createCursorKeys()

  game.physics.startSystem(Phaser.Physics.ARCADE)

  this.gameoverLabel = game.add.text(this.game.width / 2 - 50, this.game.height / 2, 'Game Over')
  this.gameoverLabel.visible = false

  this.countdownLabel = game.add.text(this.game.width / 2 - 21, this.game.height / 2 - 100, '3', {fill: '#BC2905', fontSize: '60px'})
  this.countdownLabel.visible = false

  this.start()

  this.frame = 0

  this.lastBonusCollectionTime = 0

  function createWaves (bottomOffset, tint) {
    const tileWidth = 40
    const waterGroup = game.add.physicsGroup()
    const numberOfTiles = Math.ceil(game.width / tileWidth) + 1
    for (var i = -2; i < numberOfTiles; i++) {
      var waveTile = waterGroup.create(i * tileWidth, 700 - bottomOffset, 'water')
      waveTile.width = tileWidth
      waveTile.height = 40
      waveTile.body.immovable = true
      if (tint) waveTile.tint = tint
    }
    return waterGroup
  }

  function createScoreLabel () {
    const scoreLabel = game.add.text(39, 5, '0', {'fill': '#FFCC00', fontSize: '32px'})
    scoreLabel.stroke = '#8c7001'
    scoreLabel.strokeThickness = 5
    return scoreLabel
  }

  function createScoreIcon () {
    const scoreIcon = game.add.sprite(0, 6, 'hudcoin')
    game.physics.arcade.enable(scoreIcon)
    scoreIcon.body.immovable = true
    scoreIcon.width = 40
    scoreIcon.height = 40
    return scoreIcon
  }

  function createPlayer () {
    const player = game.add.sprite(350, 350, 'player')
    game.physics.arcade.enable(player)
    player.body.collideWorldBounds = true
    player.anchor.setTo(0.5, 0.5)
    player.width = 40
    player.height = 40
    return player
  }

  function createBackground () {
    game.stage.backgroundColor = '#3498db'
    game.add.tileSprite(0, -30, 1024, 1024, 'background')
  }

  function createBubbles () {
    const bubbles = game.add.physicsGroup()
    bubbles.setAll('outOfBoundsKill', true)
    return bubbles
  }
}

mainState.start = function start () {
  this.bubbles.removeAll(true)
  this.bonuses.removeAll(true)
  game.paused = false
  this.player.position.y = game.height / 2
  this.player.position.x = game.width / 2
  this.player.body.velocity.x = 0
  this.player.body.velocity.y = 0
  this.playerWait = 180
  this.gameover = false
  this.gameoverLabel.visible = false
}

mainState.addBubble = function addBubble (x, y) {
  var random = Math.round(Math.random() * 20)
  x = x || random / 20 * game.width
  y = y || 700
  var newBubble = this.bubbles.create(x, y, 'bubble')
  newBubble.body.velocity.y = -40
  newBubble.width = 40
  newBubble.height = 40
  newBubble.body.immovable = true
  return newBubble
}

mainState.addBonus = function addBonus () {
  var random = Math.round(Math.random() * 20)
  var x = random / 20 * game.width
  var y = 100
  var newBonus = this.bonuses.create(x, y, 'bonus')
  newBonus.width = 40
  newBonus.height = 40
  newBonus.body.immovable = true
  return newBonus
}

mainState.spawnGold = function spawnGold (x, y) {
  var newCoin = this.coins.create(x, y, 'coin')
  newCoin.width = 40
  newCoin.height = 40
  game.physics.arcade.moveToXY(newCoin, 0, 0, 100, 600)
  newCoin.body.gravity.y = 10
}

mainState.update = function update () {
  if (this.gameover) this.start()

  this.frame++
  if (this.frame > 120) this.frame = 0

  this.countdownLabel.visible = this.playerWait > 0
  if (this.playerWait === 170) this.addBubble(this.player.x, 700)
  if (this.playerWait <= 180 - 60) {
    this.countdownLabel.text = '2'
  }
  if (this.playerWait <= 180 - 120) this.countdownLabel.text = '1'

  if (this.playerWait === 1) this.score = 0
  if (this.playerWait === 0) {
    this.player.body.gravity.y = 750
  } else {
    this.playerWait--
  }

  moveWater(this.frontWaves, this.frame, 0)
  moveWater(this.backWaves, this.frame, 60)

  this.scoreLabel.text = this.score.toString()

  game.physics.arcade.collide(this.player, this.bubbles, bubbleCollision, null, this)

  if (this.player.position.y > 670 && !this.gameover) {
    this.gameover = true
    this.countdownLabel.text = '3'
    this.player.body.gravity.y = 0
  }

  if (!this.lastBubble.alive || this.lastBubble.y < 660) { this.lastBubble = this.addBubble() }

  if (this.playerWait === 0) {
    if (this.cursor.left.isDown) {
      this.player.body.velocity.x -= (this.player.body.velocity.x + 400) / 15
    } else if (this.cursor.right.isDown) {
      this.player.body.velocity.x += (400 - this.player.body.velocity.x) / 15
    } else {
      this.player.body.velocity.x /= 1.02
    }
  }

  game.physics.arcade.collide(this.scoreIcon, this.coins, coinScore, null, this)

  if (this.bonuses.length < 1 && bonusCreationTimeOutPassed(this.time.time, this.lastBonusCollectionTime)) {
    this.bonus = this.addBonus()
  }

  game.physics.arcade.collide(this.player, this.bonuses, bonusCollision, null, this)

  function bonusCreationTimeOutPassed(currentTime, lastCreationTime) {
    return currentTime - lastCreationTime > TIME_BETWEEN_BONUS_CREATION
  }

  function moveWater (water, frame, phase) {
    water.forEach(function (wave) {
      wave.x += Math.sin((frame + phase) / 120 * Math.PI * 2)
    })
  }
}

game.state.add('main', mainState)
game.state.start('main')

function bubbleCollision (player, bubble) {
  this.player.body.velocity.y = -500
  bubble.kill()
  this.spawnGold(bubble.position.x, bubble.position.y)
}

function bonusCollision (player, bonus) {
  bonus.kill()
  this.bonuses.removeAll(true)
  this.score += 10
  this.lastBonusCollectionTime = this.time.time
}

function coinScore (hudCoin, coin) {
  coin.kill()
  this.score++
}
