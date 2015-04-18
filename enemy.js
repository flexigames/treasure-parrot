function Enemy(gameObject) {
  this.gameObject = gameObject
}

Enemy.prototype.create = function() {
    this.gameObject.anchor.setTo(0.5, 0.5)
    this.gameObject.body.gravity.y = 500
}