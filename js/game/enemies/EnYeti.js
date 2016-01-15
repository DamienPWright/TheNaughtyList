function EnYeti(X, Y){
    Enemy.call(this, X, Y, "en_yeti");
    this.maxHP = 2;
    this.curHP = 2;
    this.contact_damage = 1;
    
    this.body.collideWorldBounds = true;
    this.body.setSize(22, 24, 4, 8);
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
           //this.actor.fsm.changeState(this.actor.state_Patrol);
       }
       if(this.actor.checkSeekBox(this.actor.dir, player, this.actor.seekBox, this.actor.seekBoxWidth, this.actor.seekBoxLength)){
           //this.actor.fsm.changeState(this.actor.state_goCrazy);
       };
       if(this.actor.dir == 0){
           this.actor.animations.play("idle_left");
       }else{
           this.actor.animations.play("idle_right");
       }
    }; 
    this.fsm.changeState(this.state_Idle);
}

EnYeti.prototype = Object.create(Enemy.prototype);
EnYeti.prototype.constructor = EnYeti;