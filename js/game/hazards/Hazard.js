function Hazard(X, Y){
    Phaser.Sprite.call(this, game, X, Y, 'hazards');
    game.physics.arcade.enable(this);
    this.body.allowGravity = false;
    this.body.immovable = true;
}

Hazard.prototype = Object.create(Phaser.Sprite.prototype);
Hazard.prototype.constructor = Hazard;

Hazard.prototype.onActorContact = function(actor){
    
}