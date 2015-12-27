/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function EnBunny(X, Y){
    Enemy.call(this, X, Y, "en_bunny");
    this.maxHP = 2;
    this.curHP = 2;
    this.contact_damage = 1;
    
    this.body.collideWorldBounds = true;
    this.body.setSize(22, 16, 4, 16);
    this.dir = DIR_NORTH;
    this.dealsContactDamage = true;
    this.DEF_MAXVELOCITY = 60;
    this.abs_maxvelocity = this.DEF_MAXVELOCITY;
    
    this.DEF_GRAV_Y = 1000;
    this.DEF_GRAV_MAX_Y = 650;
    this.body.gravity.y = this.DEF_GRAV_Y;
    this.body.maxVelocity.y = this.DEF_GRAV_MAX_Y;
    this.body.maxVelocity.x = this.DEF_MAXVELOCITY;
    
    this.detector_platform_left;
    this.detector_platform_right;

    this.persue_count = 0;
    this.PERSUE_TIME = 8000; //milliseconds
    this.persue_speed = 200;
    
    this.preattack_count = 0;
    this.PREATTACK_TIME = 2000; //milliseconds
    
    this.takeaim_count = 0;
    this.TAKEAIM_TIME = 500; //milliseconds
    
    this.attacking_count = 0;
    this.ATTACKING_TIME = 1500; //milliseconds
    
    this.wait_count = 0;
    this.WAIT_TIME = 240;
    
    this.walk_count = 0;
    this.WALK_TIME = 2400;
    
    this.pathfind_pollrate = 15;
    
    this.seekBoxWidth = 64;
    this.seekBoxLength = 128;
    this.seekBoxSize = {w: this.seekBoxWidth , h: this.seekBoxLength};
    this.attackBoxWidth = 32;
    this.attackBoxLength = 512;
    this.attackBoxSize = {w: this.attackBoxWidth , h: this.attackBoxLength};
    this.seekBox = game.state.getCurrentState().createHitBox(this.x, this.y, this.seekBoxSize.w, this.seekBoxSize.h, false, 0, true);
    
    this.animations.add("idle_right", [0], 10, true);
    this.animations.add("idle_left", [15], 10, true);
    this.animations.add("walk_right", [1,2,0], 6, true);
    this.animations.add("walk_left", [14,13,15], 6, true);
    this.animations.add("go_crazy_right", [3,4,5], 3, false);
    this.animations.add("go_crazy_left", [12,11,10], 3, false);
    this.animations.add("run_right", [5, 6], 16, false);
    this.animations.add("run_left", [10, 9], 16, false);
    this.animations.add("attack_right", [7], 10, false);
    this.animations.add("attack_left", [8], 10, false);
    
    //this.attackBox = game.state.getCurrentState().createHitBox(this.x, this.y, this.attackBoxSize.w, this.attackBoxSize.h, false, 0, true);

    //=====
    //States
    //=====
    //Idle state
    this.state_Idle = new ActorState(this);
    this.state_Idle.onEnter = function(){
       this.actor.wait_count = this.actor.WAIT_TIME;
    };
    
    this.state_Idle.onExit = function(){
       
    };
    this.state_Idle.update = function(){
       if(this.actor.wait_count > 0){
           this.actor.wait_count -= game.time.physicsElapsedMS;
       }else{
           this.actor.fsm.changeState(this.actor.state_Patrol);
       }
       if(this.actor.checkSeekBox(this.actor.dir, player, this.actor.seekBox, this.actor.seekBoxWidth, this.actor.seekBoxLength)){
           this.actor.fsm.changeState(this.actor.state_goCrazy);
       };
       if(this.actor.dir == 0){
           this.actor.animations.play("idle_left");
       }else{
           this.actor.animations.play("idle_right");
       }
    };
    
    //Patrol state
    this.state_Patrol = new ActorState(this);
    this.state_Patrol.onEnter = function(){
       if(this.actor.dir == 0){
           this.actor.dir = 1;
       }else{
           this.actor.dir = 0;
       }
       this.actor.walk_count = this.actor.WALK_TIME;
    };
    
    this.state_Patrol.onExit = function(){
        this.actor.body.velocity.x = 0;
    };
    
    this.state_Patrol.update = function(){
        if(this.actor.dir == 0){
            if(!this.actor.detector_platform_left || this.actor.body.blocked.left){
                this.actor.body.velocity.x = 0;
                this.actor.animations.play("idle_left");
            }else{
                this.actor.body.velocity.x = -this.actor.abs_maxvelocity;
                this.actor.animations.play("walk_left");
            }
        }else{
            if(!this.actor.detector_platform_right || this.actor.body.blocked.right){
                this.actor.body.velocity.x = 0;
                this.actor.animations.play("idle_right");
            }else{
                this.actor.body.velocity.x = this.actor.abs_maxvelocity;
                this.actor.animations.play("walk_right");
            }
        }
        if(this.actor.walk_count > 0){
            this.actor.walk_count -= game.time.physicsElapsedMS;
        }else{
            this.actor.fsm.changeState(this.actor.state_Idle);
        }
        if(this.actor.checkSeekBox(this.actor.dir, player, this.actor.seekBox, this.actor.seekBoxWidth, this.actor.seekBoxLength)){
           this.actor.fsm.changeState(this.actor.state_goCrazy);
        }
    };
    
    //goCrazy state
    this.state_goCrazy = new ActorState(this);
    this.state_goCrazy.onEnter = function(){
       if(this.actor.dir == 0){
           this.actor.animations.play("go_crazy_left");
       }else{
           this.actor.animations.play("go_crazy_right");
       }
       this.actor.preattack_count = this.actor.PREATTACK_TIME;
        
    };
    
    this.state_goCrazy.onExit = function(){
        //
    };
    this.state_goCrazy.update = function(){
        if(this.actor.preattack_count > 0){
            this.actor.preattack_count -= game.time.physicsElapsedMS;
        }else{
            this.actor.fsm.changeState(this.actor.state_leapAttack);
        }
    };
    
    //leap attack
    this.state_leapAttack = new ActorState(this);
    this.state_leapAttack.onEnter = function(){
       this.actor.attacking_count = this.actor.ATTACKING_TIME;
       this.actor.abs_maxvelocity = this.actor.persue_speed;
       this.actor.body.maxVelocity.x = this.actor.persue_speed;
    };
    
    this.state_leapAttack.onExit = function(){
        this.actor.abs_maxvelocity = this.actor.DEF_MAXVELOCITY;
        this.actor.body.maxVelocity.x = this.actor.DEF_MAXVELOCITY;
        
    };
    this.state_leapAttack.update = function(){
        this.actor.attacking_count -= game.time.physicsElapsedMS;
        
        if(this.actor.body.blocked.down){
            if(player.x > this.actor.x){
                this.actor.dir = 1;
            }else{
                this.actor.dir = 0;
            }
        }
        var anim = "";
        var pitdetector = false;
        
        if(this.actor.dir == 0){
            this.actor.body.velocity.x = -this.actor.abs_maxvelocity;
            if(!this.actor.detector_platform_left){
                pitdetector = true;
            }
        }else{
            this.actor.body.velocity.x = this.actor.abs_maxvelocity;
            if(!this.actor.detector_platform_right){
                pitdetector = true;
            }
        }

        if(this.actor.body.blocked.down){
            if((this.actor.attacking_count <= 0)){
                this.actor.attacking_count = this.actor.ATTACKING_TIME;
                this.actor.jump();
            }else if(pitdetector){
                console.log(this.detector_platform_left + ' ' + this.detector_platform_right);
                this.actor.attacking_count = this.actor.ATTACKING_TIME;
                this.actor.jump();
            }else if((this.actor.dir == 0 && this.actor.body.blocked.left) || (this.actor.dir == 1 && this.actor.body.blocked.right)){
                this.actor.attacking_count = this.actor.ATTACKING_TIME;
                this.actor.jump();
            }
            
            if(this.actor.dir == 0){
                anim = "run_left";
            }else{
                anim = "run_right";
            }
        }else{
            if(this.actor.dir == 0){
                anim = "attack_left";
            }else{
                anim = "attack_right";
            }
        }
        
        this.actor.animations.play(anim);
        //console.log(this.actor.attacking_count <= 0)
       // console.log("pltform " + pitdetector)
    };
    
    this.fsm.changeState(this.state_Idle);
}

EnBunny.prototype = Object.create(Enemy.prototype);
EnBunny.prototype.constructor = EnBunny;

EnBunny.prototype.takeDamage = function(damage, blink){
    if(!this.blinking){
        if(blink){this.blinking = true};
        this.curHP -= damage;
        if(this.curHP <= 0){
            this.onDeath();
        }
    }
};

EnBunny.prototype.onDeath = function(){
    game.state.getCurrentState().bloodExplosion(this.x + (this.width / 2), this.y + (this.height/2));
    game.state.start('gameover');
    this.destroy();
}

EnBunny.prototype.updateDetectors = function(){
    this.detector_platform_left = game.state.getCurrentState().map.getTile(Math.floor((this.x - 4)/32), Math.floor((this.y + 64)/32), tmxtest.wall_layer);
    this.detector_platform_right = game.state.getCurrentState().map.getTile(Math.floor((this.x + 16)/32), Math.floor((this.y + 64)/32), tmxtest.wall_layer);
    //this.detector_wall_left = game.state.getCurrentState().map.getTile(Math.floor((this.x - 18)/32), Math.floor((this.y + 16)/32), tmxtest.wall_layer);
    //this.detector_wall_right = game.state.getCurrentState().map.getTile(Math.floor((this.x + 18)/32), Math.floor((this.y + 16)/32), tmxtest.wall_layer);
    
}

EnBunny.prototype.jump = function(){
    this.body.velocity.y = -800;
}