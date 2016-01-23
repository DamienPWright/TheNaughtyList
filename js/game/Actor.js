function Actor(X, Y, key, HP){
    Phaser.Sprite.call(this, game, X, Y, key);
    
    this.z_axis = 0;
    this.zlimit = 0;
    
    this.maxHP = 3;
    if(HP){
        this.maxHP = HP;
    }
    this.curHP = this.maxHP;
    this.status_effects = [];
    this.blinkTimer = 30;
    this.blinkCount = 0;
    this.blinking = false;
    this.interruptTime = 10;
    this.interruptCounter = 0;
    this.interrupted = false;
    this.knocked_back = true;
    this.knocked_back_timer = 0;
    
    this.spring_lock = false;
    this.spring_velocity_on = false;
    this.spring_lock_timer = 0;
    this.spring_velocity_timer = 0;
    
    this.weaken_soft_velocity_limiter = false; //use this to reduce soft velocity cap's influence on current velocity, allows for dashing etc.
    
    this.movement_input_locked = false; // Use controls_locked for cutscene stuff, this is more for reaction to crowd control skills
    this.attack_input_locked = false; //Use this to prevent new attacks from being made?
    
    this.DEF_MAXVELOCITY = 0;
    this.abs_maxvelocity = this.DEF_MAXVELOCITY;
    this.movespeed_mod = 1.0;

    
    this.movedir = DIR_NORTH;
    
    this.pathfind_pollrate = 30;
    this.pathfind_poll_counter = 0;
    
    this.fsm = new FiniteStateMachine();
    
    this.seekBoxSize = {w: 1, h: 1};
    this.seekBoxWidth = 0;
    this.seekBoxLength = 0;
    //this.seekBox = game.state.getCurrentState().createHitBox(this.x, this.y, this.seekBoxSize.w, this.seekBoxSize.h, false, 0, true);
    this.attackBoxSize = {w: 32, h: 20}; // A seek box used to trigger the attack state
    //this.attackBox = game.state.getCurrentState().createHitBox(this.x, this.y, this.attackBoxSize.w, this.attackBoxSize.h, false, 0, true);
    this.los_detector = new Phaser.Line();
}

Actor.prototype = Object.create(Phaser.Sprite.prototype);
Actor.prototype.constructor = Actor;

Actor.prototype.updateActor = function(){
    if(this.blinking){
        this.blink();
    }
    
    if(this.knocked_back){
        this.knocked_back_timer -= game.time.physicsElapsedMS;
        if(this.knocked_back_timer <= 0){
            this.knocked_back = false;
        }
   };
   
   if(this.spring_velocity_on){
       this.spring_velocity_timer -= game.time.physicsElapsedMS;
       if(this.spring_velocity_timer <= 0){
           this.spring_velocity_on = false;
       }
   }

   if(this.spring_lock){
       //this.body.allowGravity = false;
       //this.body.checkCollision.up = false;
       //this.body.checkCollision.down = false;
       //this.body.checkCollision.left = false;
       //this.body.checkCollision.right = false;
       this.spring_lock_timer -= game.time.physicsElapsedMS;
       if(this.spring_lock_timer <= 0){
           this.spring_lock = false;
           //this.body.checkCollision.up = true;
           //this.body.checkCollision.down = true;
           //this.body.checkCollision.left = true;
           //this.body.checkCollision.right = true;
           //this.body.allowGravity = true;
       }
   }
   
   if(this.knocked_back || this.spring_velocity_on){
       this.weaken_soft_velocity_limiter = true;
   }else{
       this.weaken_soft_velocity_limiter = false;
   }
   
   if(this.knocked_back || this.spring_lock){
       this.movement_input_locked = true;
   }else{
       this.movement_input_locked = false;
   }
    this.updateStatusEffects();
};

Actor.prototype.blink = function(){
    this.blinkCount++;
    if(this.blinkCount % 3 != 2){
        this.renderable = false;
    }else{
        this.renderable = true;
    }
    if(this.blinkCount >= this.blinkTimer){
        this.blinkCount = 0;
        this.renderable = true;
        this.blinking = false;
    }
};

Actor.prototype.takeDamage = function(damage, blink){
    if(!this.blinking){
        if(blink){this.blinking = true};
        this.curHP -= damage;
        if(this.curHP <= 0){
            this.onDeath();
        }
    }
};

Actor.prototype.heal = function(amount){
    this.curHP += amount;
    if(this.curHP > this.maxHP){
        this.curHP = this.maxHP;
    }
}

Actor.prototype.onDeath = function(){
    this.destroy();
};

Actor.prototype.updateAnimation = function(){
    //override this for animations
};

Actor.prototype.checkSeekBox = function(posKey, target, seekbox, width, height){
    var detected = false;
    //console.log(width + " " + height);
    switch(posKey){
        case 0:
            seekbox.width = height;
            seekbox.height = width;
            seekbox.x = this.body.x - seekbox.body.width;
            seekbox.y = this.body.y - (seekbox.height / 2) + (this.body.height/2);
            break;
        case 1:
            seekbox.width = height;
            seekbox.height = width;
            seekbox.x = this.body.x + this.body.width;
            seekbox.y = this.body.y - (seekbox.height / 2) + (this.body.height/2);
            break;
        case 'centered':
            seekbox.x = this.x + (this.width / 2) + (seekbox.body.width / 2);
            seekbox.y = this.y;
            break;
    }
    if(seekbox.overlap(target)){
        detected = true;
    }
    //Now check line of sight
    if(detected){
        this.los_detector.start.set(this.body.x + (this.body.width / 2), this.body.y + (this.body.height / 2));
        this.los_detector.end.set(target.body.x + (target.body.width / 2), target.body.y + (target.body.height / 2));
        var tileHits = game.state.getCurrentState().wall_layer.getRayCastTiles(this.los_detector, 4, true, false);
        if(tileHits.length > 0){
            detected = false;
        }
    }
    return detected;
};

Actor.prototype.pickRandomDir4D = function(){
    var r = Math.round(Math.random() * 3);
    switch(r){
        case 0:
            this.movedir = DIR_NORTH;
            break;
        case 1:
            this.movedir = DIR_SOUTH;
            break;
        case 2:
            this.movedir = DIR_EAST;
            break;
        case 3:
            this.movedir = DIR_WEST;
            break;
    }
};

Actor.prototype.pickRandomDir2D = function(){
    var r = Math.round(Math.random());
    switch(r){
        case 0:
            this.movedir = DIR_EAST;
            break;
        case 1:
            this.movedir = DIR_WEST;
            break;
    }
};

Actor.prototype.updateStatusEffects = function(){
    this.normaliseStats();
    for(var i in this.status_effects){
        this.status_effects[i].update();
        if(this.status_effects[i].dead){
            this.status_effects.splice(i, 1);
        }
    }
};

/**
 * @desc - Called before running through status effects. This sets the values back to their standard
 */
Actor.prototype.normaliseStats = function(){
   this.movespeed_mod = 1.0; 
};

/**
 * @param {StatusEffect} se
 */
Actor.prototype.inflictStatusEffect = function(se){
    if(se){
        //may want to include a check that refreshes an se if it already exists
        if(this.status_effects.length === 0){
            this.status_effects.push(se);
            return;
        }
        for(var i in this.status_effects){
            //console.log(this.status_effects[i].statuseffect_id  + " " + se.statuseffect_id)
            if(this.status_effects[i].statuseffect_id === se.statuseffect_id){
                //check stacking behaviour
                if(se.stacks){
                    this.status_effects.push(se);
                    return;
                }
                if(se.re_applicable){
                    this.status_effects[i].duration = se.duration;
                    //console.log("reapplied")
                    return;
                }else{
                    return;
                }
            }
        }
    }
};

Actor.prototype.knockback = function(XSPD, YSPD, dur){
    this.knocked_back = true;
    this.body.velocity.x = XSPD;
    this.body.velocity.y = YSPD;
    this.knocked_back_timer = dur;
}

Actor.prototype.spring = function(XSPD, YSPD){

    
    
    var cxvel = this.body.velocity.x;
    var cyvel = this.body.velocity.y;

    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    
    this.body.velocity.x = XSPD;
    this.body.velocity.y = YSPD;

    this.body.acceleration.x = XSPD;
    this.body.acceleration.y = YSPD;
    /*
    if(XSPD != undefined || XSPD === 0){
        this.body.velocity.x = cxvel;  
    }
    if(YSPD != undefined || YSPD === 0){
        this.body.velocity.y = cyvel;
    }
    */
    console.log(this.body.velocity.x  + " " + this.body.velocity.y)
    var timer = (Math.abs(XSPD) > Math.abs(YSPD)) ? Math.abs(XSPD) : Math.abs(YSPD); 
    this.spring_velocity_timer = timer * 0.8;
    this.spring_velocity_on = true;
    this.spring_lock = true;
    this.spring_lock_timer = 50;
}

/**
 * Attempts to find the Y position of the closest solid wall tile. 
 * @param {type} target - must be an object with an x and y coordinate.
 * @returns {Number} - the worldY of the first tile found or -1 if none were found.
 */

Actor.prototype.getFloorYFromTarget = function(target){
    var line = new Phaser.Line()
    line.start.set(target.x, target.y);
    line.end.set(target.x + 1, target.y + 1000);
    var tiles = game.state.getCurrentState().wall_layer.getRayCastTiles(line, 4, true, false);
    if(tiles.length > 0){
        return tiles[0].worldY;
    }
    return -1;
}