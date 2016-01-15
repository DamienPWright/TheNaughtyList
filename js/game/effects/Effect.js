function Effect(X, Y, key, lifespan, xscale){
    Phaser.Sprite.call(this, game, X, Y, key);
    this.lifespan = lifespan;
    this.scale.setTo(xscale, 1);
}

Effect.prototype = Object.create(Phaser.Sprite.prototype);
Effect.prototype.constructor = Effect;

Effect.prototype.onContactEffect = function(){
    
}