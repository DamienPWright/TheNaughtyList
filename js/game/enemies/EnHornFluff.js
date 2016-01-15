function EnHornFluff(X, Y){
    Enemy.call(this, X, Y, "en_hornfluff");
    this.maxHP = 8;
    this.curHP = 8;
    this.contact_damage = 1;
    
    this.body.collideWorldBounds = true;
    this.body.setSize(66, 50, 24, 12);
    //this.anchor.setTo(0.5, 0);
    this.dir = DIR_NORTH;
    this.dealsContactDamage = false;
    this.DEF_MAXVELOCITY = 500;
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
    this.PREATTACK_TIME = 1000; //milliseconds
    
    this.takeaim_count = 0;
    this.TAKEAIM_TIME = 500; //milliseconds
    
    this.chargeattack_count = 0;
    this.CHARGEATTACK_TIME = 3000; //milliseconds
    
    this.laserattack_count = 0;
    this.LASERATTACK_TIME = 1500; //milliseconds
    
    this.wait_count = 0;
    this.WAIT_TIME = 1000;
    
    this.walk_count = 0;
    this.WALK_TIME = 2400;
    this.walk_speed = 50;
    
    this.pathfind_pollrate = 15;
    
    this.seekBoxWidth = 64;
    this.seekBoxLength = 128;
    this.seekBoxSize = {w: this.seekBoxWidth , h: this.seekBoxLength};
    this.attackBoxWidth = 32;
    this.attackBoxLength = 512;
    this.attackBoxSize = {w: this.attackBoxWidth , h: this.attackBoxLength};
    this.seekBox = game.state.getCurrentState().createHitBox(this.x, this.y, this.seekBoxSize.w, this.seekBoxSize.h, false, 0, true);
    
    this.animations.add("idle_left", [0], 10, true);
    this.animations.add("idle_right", [14], 10, true);
    this.animations.add("walk_left", [1,0], 4, true);
    this.animations.add("walk_right", [14,13], 4, true);
    this.animations.add("prepare_charge_left", [3], 1, false);
    this.animations.add("prepare_charge_right", [12], 1, false);
    this.animations.add("charge_left", [3,4], 24, true);
    this.animations.add("charge_right", [11,10], 24, true);
    
    //this.attackBox = game.state.getCurrentState().createHitBox(this.x, this.y, this.attackBoxSize.w, this.attackBoxSize.h, false, 0, true);

    //=====
    //States
    //=====
    //Idle state
    this.state_Idle = new ActorState(this);
    this.state_Idle.onEnter = function(){
       this.actor.wait_count = this.actor.WAIT_TIME;
       this.actor.body.drag.x = 650;
       console.log("idle");
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
           this.actor.fsm.changeState(this.actor.state_selectAttack);
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
       this.actor.body.drag.x = 0;
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
            if(this.actor.body.blocked.left){
                 this.actor.fsm.changeState(this.actor.state_Idle);
            }else{
                this.actor.body.velocity.x = -this.actor.walk_speed;
                this.actor.animations.play("walk_left");
            }   
        }else{
            if(this.actor.body.blocked.right){
                 this.actor.fsm.changeState(this.actor.state_Idle);
            }else{
                this.actor.body.velocity.x = this.actor.walk_speed;
                this.actor.animations.play("walk_right");
            }
        }
        if(this.actor.walk_count > 0){
            this.actor.walk_count -= game.time.physicsElapsedMS;
        }else{
            this.actor.fsm.changeState(this.actor.state_Idle);
        }
        if(this.actor.checkSeekBox(this.actor.dir, player, this.actor.seekBox, this.actor.seekBoxWidth, this.actor.seekBoxLength)){
           this.actor.fsm.changeState(this.actor.state_selectAttack);
        }
    };
    
    //Select Attack
    this.state_selectAttack = new ActorState(this);
    this.state_selectAttack.onEnter = function(){
         var dist = Math.abs((this.actor.x + this.actor.width/2) - player.x);
         console.log("dist: " + dist)
         //if(dist > 200){
         //   this.actor.fsm.changeState(this.actor.state_laserAttack);
         //}else{
            this.actor.fsm.changeState(this.actor.state_prepareCharge);
         //}
    };
    
    //Prepare charge
    this.state_prepareCharge = new ActorState(this);
    this.state_prepareCharge.onEnter = function(){
        this.actor.preattack_count = this.actor.PREATTACK_TIME;
        
        console.log("charge " + this.actor.dir);
    };
    
    this.state_prepareCharge.update = function(){
        this.actor.preattack_count -= game.time.physicsElapsedMS;
        if(this.actor.dir == 0){
           this.actor.animations.play("prepare_charge_left");
        }else{
           this.actor.animations.play("prepare_charge_right");
        }
        if(this.actor.preattack_count <= 0){
           this.actor.fsm.changeState(this.actor.state_chargeAttack);            
        }
    }
    
    //charge attack
    this.state_chargeAttack = new ActorState(this);
    this.state_chargeAttack.onEnter = function(){
        this.actor.dealsContactDamage = true;
        this.actor.chargeattack_count = this.actor.CHARGEATTACK_TIME; 
        
        
    };
    
    this.state_chargeAttack.onExit = function(){
        this.actor.dealsContactDamage = false;
        this.actor.body.acceleration.x = 0;
    };
    
    this.state_chargeAttack.update = function(){
        this.actor.chargeattack_count -= game.time.physicsElapsedMS;
        if(this.actor.dir == 0){
            this.actor.body.acceleration.x = -this.actor.persue_speed * 3;
        }else{
            this.actor.body.acceleration.x = this.actor.persue_speed * 3;
        }
        if(this.actor.dir == 0){
           this.actor.animations.play("charge_left");
        }else{
           this.actor.animations.play("charge_right");
        }
        if(this.actor.body.acceleration.x > 0){
            if(this.actor.body.blocked.right){
                this.actor.knockback(-200, -200);
                this.actor.fsm.changeState(this.actor.state_Idle);
            }
        }else{
            if(this.actor.body.blocked.left){
                this.actor.knockback(200, -200);
                this.actor.fsm.changeState(this.actor.state_Idle);
            }
        }
        if(this.actor.chargeattack_count <= 0){
            this.actor.fsm.changeState(this.actor.state_Idle);
        }
    }
    
    //fire laserbeam
    this.state_laserAttack = new ActorState(this);
    this.state_laserAttack.onEnter = function(){
        console.log("laser attack");
    };
    
    this.fsm.changeState(this.state_Idle);
}

EnHornFluff.prototype = Object.create(Enemy.prototype);
EnHornFluff.prototype.constructor = EnHornFluff;

EnHornFluff.prototype.updateDetectors = function(){
    this.detector_platform_left = game.state.getCurrentState().map.getTile(Math.floor((this.x - 4)/32), Math.floor((this.y + this.height + 4)/32), tmxtest.wall_layer);
    this.detector_platform_right = game.state.getCurrentState().map.getTile(Math.floor((this.x + 16)/32), Math.floor((this.y + this.height + 4)/32), tmxtest.wall_layer);
    //this.detector_wall_left = game.state.getCurrentState().map.getTile(Math.floor((this.x - 18)/32), Math.floor((this.y + 16)/32), tmxtest.wall_layer);
    //this.detector_wall_right = game.state.getCurrentState().map.getTile(Math.floor((this.x + 18)/32), Math.floor((this.y + 16)/32), tmxtest.wall_layer);
}