function Platform(gameObject){
  this.gameObject = gameObject
}

Platform.prototype.create = function() {
    this.gameObject.anchor.setTo(0.5, 0.5)
}