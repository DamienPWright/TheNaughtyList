/* TODO 
 * Consider making a bullet factory, make sure the class can handle any functionality.
 * This is to allow
 */

function Bullet(X, Y, key){
    Actor.call(this, X, Y, key);
    game.physics.arcade.enable(this);
    this.anchor.setTo(0.5, 0.5);
    this.friendly = false;
    this.lifespan = 0;
    //if(friendly){this.friendly = friendly};
    //if(collidesWithWall){this.collidesWithWall = collidesWithWall};
   // if(lifespan){this.lifespan = lifespan};
    //if(speed){this.abs_velocity = speed};
    //if(dir)(this.movedir = dir);
    
    this.collideWithTiles = false;
    //this.collideWithWalls = false
    //this.collideWithFloor = false;
    this.collideWithActor = false;
    
    this.deadOnImpactTiles = false;
    this.deadOnImpactWallOnly = false;
    this.deadOnImpactFloorOnly = false;
    this.deadOnImpactActor = false;
    
    this.impactTiles = false;
    this.impactWallOnly = false;
    this.impactFloorOnly = false;
    this.impactActor = false;
    
    this.impactLimit = 0;
    
    //this.ignoreActors = false;
    //this.ignoreWalls = false;
    
    this.penetrateActor = false;
    this.penetrateActorDepth = 0;
    
    this.bounceFactor = 0;
    
    this.speed = 0;
    this.movedir = DIR_EAST;
    
    this.spriteRotates = false;
    
    this.impactEffect;
    this.impactHitBox;
    this.effectsArray = [
        
    ]
    this.effectsArrayIndex = 0;
    this.effectsArrayLoops = false;
    this.hitBoxArray = [
        
    ]
    this.hitBoxArrayLoops = false;
    
    this.dir_angle = (this.movedir / 2) * Math.PI;
    
    switch(this.movedir){
        case DIR_EAST:
            this.angle = 0;
            break;
        case DIR_SOUTH:
            this.angle = 90;
            break;
        case DIR_WEST:
            this.angle = 180;
            break;
        case DIR_NORTH:
            this.angle = 270;
            break;
    }
}

Bullet.prototype = Object.create(Actor.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function(){
    if(!this.alive){
        return;
    }
    if(this.collideWithTiles){
       this.checkCollideWithTiles();
    }
    if(this.collideWithActor){
        this.checkCollideWithActor();
    }
    //this.moveStrategy();
    //this.updateEffects();
    //this.updateHitboxes();
}

Bullet.prototype.checkCollideWithTiles = function(){
    if(game.physics.arcade.collide(this, game.state.getCurrentState().wall_layer, this.onCollideWithTiles, null, this)){
        console.log("collided with a tile");
        return;
    }
    
    var tiles = game.state.getCurrentState().wall_layer.getTiles(this.x, this.y, 1, 1, true);
    if(tiles.length > 0){
        this.onCollide();
    }
}

Bullet.prototype.onCollideWithTiles = function(){
    if(this.impactWallOnly){
        if(this.body.blocked.left || this.body.blocked.right){
            this.bulletImpact;
            if(this.deadOnImpactWallOnly){
                this.kill();
            }
            return;
        }
    }
    if(this.impactFloorOnly){
        if(this.body.blocked.down){
            this.bulletImpact();
            if(this.deadOnImpactFloorOnly){
                this.kill();
            }
            return;
        }
    }
    if(this.impactTiles){
        this.bulletImpact();
        if(this.deadOnImpactTiles){
            this.kill();
        }
        return;
    }
}

Bullet.prototype.checkCollideWithActor = function(){
    if(this.friendly){
        var enemies = game.state.getCurrentState().enemies;
        game.physics.arcade.collide(this, enemies, this.onCollideActor, null, this)
    }else{
        game.physics.arcade.collide(this, enemies, this.onCollideActor, null, this)
    }
}

Bullet.prototype.onCollideActor = function(){
    if(this.impactActor){
        this.bulletImpact();
    }
    if(this.deadOnImpactActor){
        this.kill();
    }
    //if(this.body.touching.left || this.body.touching.right){
    //    console.log("touched side")
    //    this.body.velocity.x = -this.body.velocity.x * this.body.bounce.x;
   //}
    //if(this.body.touching.up || this.body.touching.down){
    //    this.body.velocity.y = -this.body.velocity.y * this.body.bounce.y;
   // }
    //this.body.bounce.set(this.bounceFactor); //This likely wants to be done in the factory
}

Bullet.prototype.onCollide = function(){
    //console.log(this);
    this.bulletImpact();
    //this.kill();
}



Bullet.prototype.bulletImpact = function(){
    //spawn impact effect at impact site
    if(this.impactEffect){
        //generate impact effect
    }
    if(this.impactHitbox){
        //generate impact hitbox
    }
    if(this.impactLimit > 0){
        this.impactLimit--;
    }
    if(this.impactLimit == 0){
        this.kill();
    }
}

Bullet.prototype.moveStrategy = function(){
    
}

Bullet.prototype.setMotion = function (str){
    switch(str){
        case "linear":
            this.setMoveStrategy(this.linearMotion);
            break;
        default:
            console.log("movetype " + str + " not recognized");
            this.setMoveStrategy(this.linearMotion);
    }
}

Bullet.prototype.setMoveStrategy = function(func){
    this.moveStrategy = func;
}

Bullet.prototype.linearMotion = function(){
    this.body.velocity.x = this.speed * Math.cos(this.dir_angle);
    this.body.velocity.y = this.speed * Math.sin(this.dir_angle);
}
