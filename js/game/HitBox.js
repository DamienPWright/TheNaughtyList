function HitBox(game, X, Y, W, H, key, friendly, lifespan, origin){
    Phaser.Sprite.call(this, game, X, Y, key);
    //this.x = X;
    //this.y = Y;
    this.origin = undefined;
    game.physics.arcade.enable(this);
    this.body.allowGravity = false;
    this.width = W;
    this.height = H;
    this.friendly = friendly;
    this.lifespan = lifespan;
    //some hitboxes may have circles for more precise collision checking
    if(origin){
        this.origin = origin;
    }
    //debug
    this.draw = false;
    
    if(this.draw){
        var g = game.add.graphics(this.x, this.y);
        // draw a rectangle
        g.beginFill(0x0000FF, 0.4);
        g.drawRect(this.x, this.y, this.width , this.height);
        g.endFill();
        if(this.circle){
            g.beginFill(0xff0000, 0.3);
            g.drawCircle(this.circle.x, this.circle.y, this.circle.radius);
            g.endFill();
        }
        this.addChild(g)
    }
}

//  Here is a custom game object
HitBox.prototype = Object.create(Phaser.Sprite.prototype);
HitBox.prototype.constructor = HitBox;


HitBox.prototype.update = function(){
    //use this for any hitbox unique functionality
};

/**
 * 
 * @param {type} origin - The source of the hitbox. Normally it'll be an attack
 * @param {type} actor - The target actor it's being applied to.
 * @desc - if the origin lacks an onHitActor method, this function will do nothing.
 */
HitBox.prototype.onContactWithActor = function(actor){
    if(this.origin){
        if(this.origin.onHitActor){
            this.origin.onHitActor(actor);
        }else{
            console.log("No method found on this hitboxes' origin.")
        }
    }
}

function getCircle(){
    if(this.hasCircle){
        return this.radius;
    }
    return false;
}