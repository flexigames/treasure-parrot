function Player(gameObject) {
  this.gameObject = gameObject
}

Player.prototype.create = function() {
    this.gameObject.anchor.setTo(0.5, 0.5)
    this.gameObject.body.collideWorldBounds = true
    this.gameObject.body.gravity.y = 900
}