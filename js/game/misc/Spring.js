function Spring(X, Y, dir, strength, key){
    Phaser.Sprite.call(this, game, X, Y, key);
}

Spring.prototype = Object.create(Phaser.Sprite.prototype);
Spring.prototype.constructor = Spring;

Spring.onOverlap = function(actor){
    switch(this.dir){
        case 0:
            actor.body.velocity.x = this.strength;
            break;
        case 0.5:
            actor.body.velocity.y = this.strength;
            break;
        case 1:
            actor.body.velocity.x = -this.strength;
            break;
        case 1.5:
            actor.body.velocity.y = -this.strength;
            break;
        case 0.25:
        case 0.75:
        case 1.25:
        case 1.75:
            actor.body.velocity.x = Math.cos(this.dir * Math.PI) * this.strength;
            actor.body.velocity.y = Math.sin(this.dir * Math.PI) * this.strength;
            break;
    }
}