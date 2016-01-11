function Spring(X, Y, dir, strength, frame){
    Phaser.Sprite.call(this, game, X, Y, "levelobjects");
    this.dir = (dir != undefined) ? dir: 1.5;
    this.frame = (frame) ? frame : 10;
    game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.body.allowGravity = false;
    this.strength = strength;
}

Spring.prototype = Object.create(Phaser.Sprite.prototype);
Spring.prototype.constructor = Spring;

Spring.prototype.onOverlap = function(actor){
    actor.y -= 5;
    
    actor.body.acceleration.x = 0;
    actor.body.acceleration.y = 0;
    
    switch(this.dir){
        case 0:
            actor.spring(this.strength, 0);
            break;
        case 0.5:
            actor.spring(0, this.strength);
            break;
        case 1:
            actor.spring(-this.strength, 0);
            break;
        case 1.5:
            actor.spring(0, -this.strength);
            break;
        case 0.25:
            actor.spring(this.strength, this.strength);
            break;
        case 0.75:
            actor.spring(-this.strength, this.strength);
            break;
        case 1.25:
            actor.spring(-this.strength, -this.strength);
            break;
        case 1.75:
            actor.spring(this.strength, -this.strength);
            break;
            //actor.body.velocity.x = Math.cos(this.dir * Math.PI) * this.strength;
            //actor.body.velocity.y = Math.sin(this.dir * Math.PI) * this.strength;
            //break;
    }
}