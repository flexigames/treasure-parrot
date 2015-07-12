function Player(gameObject) {
  this.gameObject = gameObject
}

Player.prototype.create = function() {
    this.gameObject.anchor.setTo(0.5, 0.5)
    this.gameObject.body.collideWorldBounds = true
    this.gameObject.body.gravity.y = 900
}

Player.prototype.freeze = function() {
  this.gameObject.body.gravity.y = 0
  this.gameObject.body.collideWorldBounds = false
}

Player.prototype.unfreeze = function() {
  this.gameObject.body.gravity.y = 900
  this.gameObject.body.collideWorldBounds = true
}