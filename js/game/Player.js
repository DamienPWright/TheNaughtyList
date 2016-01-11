function Player(X, Y){
    Actor.call(this, X, Y, 'player');
    game.physics.arcade.enable(this);
    //this.anchor.setTo(0.5, 0.5);
    this.body.bounce.y = 0;
    this.body.linearDamping = 1;
    this.body.collideWorldBounds = true;
    //this.body.drag = new Phaser.Point(200,200);
    //this.body.maxVelocity = new Phaser.Point(250, 250);
    this.movespeed_mod = 1.0;
    
    this.body.setSize(32, 32, 0, 0);
    this.anchor.setTo(0.5, 0);
    
    this.dir = 0; // 0 for left, 1 for right, 1.5 is up, 0.5 is down.
    this.attackdir = 0;
    this.abs_velocity = 0;
    this.DEF_MAXVELOCITY = 250;
    this.DEF_HARD_MAXVELOCITY = new Phaser.Point(1000,1000);
    this.DEF_SOFT_MAXVELOCITY = new Phaser.Point(250, 800);
    this.soft_maxvelocity = new Phaser.Point(this.DEF_SOFT_MAXVELOCITY.x, this.DEF_SOFT_MAXVELOCITY.y);
    this.abs_maxvelocity = this.DEF_HARD_MAXVELOCITY.x;
    this.base_acceleration = this.DEF_MAXVELOCITY * 3;
    this.air_acceleration = this.DEF_MAXVELOCITY;
    this.cur_acceleration = this.base_acceleration;
    
    this.accel_rate = 50;
    this.accel_rate_ground = 50;
    this.accel_rate_air = 15;
    
    this.onground = false
    this.controls_locked = false;
    
    this.decel_rate = 100;
    this.ground_decel_rate = 100;
    this.air_decel_rate = 10;
    this.DEF_JUMP_SPEED = 650;
    this.jump_speed = this.DEF_JUMP_SPEED;
    this.DEF_GRAV_Y = 1000;
    this.DEF_GRAV_MAX_Y = 650;
    this.body.gravity.y = this.DEF_GRAV_Y;
    this.body.maxVelocity.y = this.DEF_HARD_MAXVELOCITY.y;
    this.body.maxVelocity.x = this.DEF_HARD_MAXVELOCITY.x;
    //lifestats
    this.hp = 0;
    this.maxhp = 0;

    //Times in frames
    this.dash_cooldown_count = 0;
    this.DEF_DASH_CD = 30;
    this.dash_cooldown = this.DEF_DASH_CD;
    this.dash_time_count = 0;
    this.DEF_DASH_TIME = 15;
    this.dash_time = this.DEF_DASH_TIME;
    this.dash_invuln_count = 0;
    this.dash_invuln_time = 10;
    this.dash_invuln_start = 5;
    this.dash_invuln = false;
    this.dash_velocity = 750;
    this.movedir_lock = false;
    
    this.DEF_ATTACK_COOLDOWN = 0;
    this.attack_cooldown = this.DEF_ATTACK_COOLDOWN;
    this.attack_cooldown_count = 0;
    this.DEF_ATTACK_TIME = 20;
    this.attack_time = this.DEF_ATTACK_TIME;
    this.attack_time_count = 0;
    
    this.DEF_ATK_COMBO_TIME = 20;
    this.attack_combo_time = this.DEF_ATK_COMBO_TIME;
    this.attack_combo_count = 0;
    this.attack_combo = 0;
    this.DEF_ATK_COMBO_MAX = 3;
    this.attack_combo_max = this.DEF_ATK_COMBO_MAX;

    this.jump_held = false;
    this.jump_counter = 0;
    this.max_jumps = 1;
    
    this.gamestate = game.state.getCurrentState();
    
    this.attackTimer;
    
    game.input.keyboard.addKey(32).onDown.add(function(){if(!this.controls_locked){this.jumpKey = true; this.jump_held = true};}, this);
    game.input.keyboard.addKey(32).onUp.add(function(){if(!this.controls_locked){this.jumpKey = false; this.jump_held = false};}, this);
    
    //control setup - may migrate this to its own thing
    this.Wkey = game.input.keyboard.addKey(87);
    this.Akey = game.input.keyboard.addKey(65);
    this.Skey = game.input.keyboard.addKey(83);
    this.Dkey = game.input.keyboard.addKey(68);
    Ekey = game.input.keyboard.addKey(69);
    SpaceKey = game.input.keyboard.addKey(32);
    this.DashKey = game.input.keyboard.addKey(16);
    this.JumpKey = false;
    
    
    game.input.mouse.mouseDownCallback = this.onMouseDown;
    game.input.mouse.mouseUpCallback = this.onMouseUp;
    game.input.mouse.callbackContext = this;
    
    this.mouseLeft = false;
    this.mouseRight = false;
    this.playerToMousepointerDir = 0;
    this.playerToMouseDir = 0;
 
    //hitbox - what is this meant for anyway? Maybe remove it.
    this.hitbox = new HitBox(game,0,14,10,16,"idk");
    this.hitbox.anchor.setTo(0.5,0);
    this.addChild(this.hitbox);
    hbx = this.hitbox;
    
    this.detector_platform_left;
    this.detector_platform_right;
    
    //weapons and inventory
    this.inventory = new Inventory(this);
    this.inventory.addWeapon(new Weapon('wood_sword', this));
    
    //=====
    //States
    //=====
    //Idle state
    this.state_Idle = new ActorState(this);
    this.state_Idle.name = "Idle";
    this.state_Idle.onEnter = function(){
        //
    };
    this.state_Idle.onExit = function(){
    };
    this.state_Idle.update = function(){
        if(this.actor.DashKey.isDown && this.actor.dash_cooldown_count <= 0){
            this.fsm.changeState(this.actor.state_Dash);
        };
        
        /* 
        if(this.GuardKey.isDown && this.guard_cooldown_count <= 0){
            this.fsm.changeState(this.actor.state_Guard);
        }
        */
        if(this.actor.mouseLeft && this.actor.attack_cooldown_count <= 0){
            testweapon = this.actor.inventory.activeweapon
            this.actor.inventory.activeweapon.onAttack(true);
        }
        
        if(this.actor.mouseRight && this.actor.attack_cooldown_count <= 0){
            this.actor.inventory.activeweapon.onAttack(false);
        }
        
    };
    
    //Dash state
    this.state_Dash = new ActorState(this);
    this.state_Dash.name = "Dash";
    this.state_Dash.onEnter = function(){
        this.actor.movedir_lock = true;
        //this.actor.body.maxVelocity.x = this.actor.dash_velocity;
        //this.actor.dir_angle = this.actor.dir * Math.PI;
        //this.actor.abs_velocity = this.actor.abs_maxvelocity;
        this.actor.body.velocity.x = (this.actor.dir == 1) ? -this.actor.dash_velocity: this.actor.dash_velocity;
        //this.actor.body.velocity.y = this.actor.dash_velocity * Math.sin(this.actor.dir_angle) * this.actor.movespeed_mod;
    };
    this.state_Dash.onExit = function(){
       this.actor.dash_time_count = 0;
       this.actor.movedir_lock = false;
       //this.actor.body.maxVelocity.x = this.actor.DEF_MAXVELOCITY;
       //this.actor.dash_cooldown_count = this.actor.dash_cooldown;
       //this.actor.abs_velocity = 0;
       //this.actor.body.velocity.x = 0;
       //this.actor.body.velocity.y = 0;
    };
    this.state_Dash.update = function(){
        //this.fsm.changeState(this.actor.state_Persue);
        this.actor.dash_time_count++;
        if(this.actor.dash_time_count == this.actor.dash_invuln_start){
            this.actor.dash_invuln = true;
        }
        if(this.actor.dash_time_count == this.actor.dash_invuln_time + this.actor.dash_invuln_start){
            this.actor.dash_invuln = false;
        }
        if(this.actor.dash_time_count >= this.actor.dash_time){
            this.fsm.changeState(this.actor.state_Idle);
        }
    };
    
    //Guard state
    this.state_Guard = new ActorState(this);
    this.state_Guard.name = "Guard";
    this.state_Guard.onEnter = function(){
        //
    };
    this.state_Guard.onExit = function(){
    };
    this.state_Guard.update = function(){
        //this.fsm.changeState(this.actor.state_Persue);
    };
    
    //Attack state
    this.state_Attack = new ActorState(this);
    this.state_Attack.name = "Attack";
    this.state_Attack.onEnter = function(){
        this.actor.attack_combo_count = this.actor.attack_combo_time + this.actor.attack_time;
        this.actor.attack_combo++;
        if(this.actor.attack_combo > this.actor.attack_combo_max){
            this.actor.attack_combo = 1;
        }
        this.actor.attack_time_count = this.actor.attack_time;
        this.actor.movespeed_mod = 0.5;
    };
    this.state_Attack.onExit = function(){
        this.actor.movespeed_mod = 1.0;
        this.actor.attack_cooldown_count = this.actor.attack_cooldown;
        this.attack_time_count = 0;
    };
    this.state_Attack.update = function(){
        this.actor.attack_time_count--;
        if(this.actor.attack_time_count <= 0){
            this.fsm.changeState(this.actor.state_Idle);
        }
    };
    
    this.fsm.changeState(this.state_Idle);
}

Player.prototype = Object.create(Actor.prototype);
Player.prototype.constructor = Player;

Player.prototype.create = function(){
    
}

Player.prototype.update = function(){
    this.updateActor();
    
    this.processControls();
    this.fsm.update();
    this.manageCooldowns();
    this.animations.play(this.updateAnimation());
    //this.calculatePlayerToPointerAngle();
    
    this.inventory.updateItems();
    //console.log(this.body.acceleration.x)
};

Player.prototype.manageCooldowns = function(){
    if(this.dash_cooldown_count > 0){
        this.dash_cooldown_count--;
    }
    if(this.attack_cooldown_count > 0){
        console.log(this.attack_cooldown_count);
        this.attack_cooldown_count--;
    }
    if(this.attack_combo_count > 0){
        this.attack_combo_count--;
    }
    if(this.attack_combo_count <= 0){
        this.attack_combo = 0;
    }
}

Player.prototype.updateAnimation = function(){
    if(this.dir === 1){
        this.scale.setTo(-1,1);
    }else{
        this.scale.setTo(1,1);
    }
    var anim = 'idle_right';
    //if (this.body.onFloor())
    if(this.body.blocked.down){
        if(this.body.velocity.x != 0){
            
        }else{
            
        }
    }
    return anim;
};

Player.prototype.processControls = function(){
    this.body.acceleration.x = 0;
    this.body.acceleration.y = 0;
    if(!this.controls_locked){
        //accelleration stuff
        if(this.onground){
            this.cur_acceleration = this.base_acceleration;
            this.jump_counter = 0;
        }else{
            this.cur_acceleration = this.air_acceleration;
        }    

        if(!this.movedir_lock){
            if(this.Akey.isDown) {
                    this.dir = 1;
            }else if (this.Dkey.isDown) {
                    this.dir = 0;
            }
        }

         if(this.Akey.isDown && !this.movement_input_locked){
             if(this.body.velocity.x > 0){
                this.body.acceleration.x = -this.base_acceleration * 3;
             }else{
                this.body.acceleration.x = -this.base_acceleration;
             }
         }else if(this.Dkey.isDown && !this.movement_input_locked){
             if(this.body.velocity.x < 0){
                this.body.acceleration.x = this.base_acceleration * 3;
             }else{
                this.body.acceleration.x = this.base_acceleration;
             }
         }

        if(!this.Akey.isDown && !this.Dkey.isDown){
            if(this.onground){
                if(this.weaken_soft_velocity_limiter){
                   this.body.drag.x = this.cur_acceleration / 2; 
                }else{
                   this.body.drag.x = this.cur_acceleration * 8;
                }
            }else{
                if(this.weaken_soft_velocity_limiter){
                    this.body.drag.x = this.cur_acceleration / 8;
                }else{
                    this.body.drag.x = this.cur_acceleration * 2;
                }
            }
        }else{
            this.body.drag.x = 0;
        }

        if(this.Skey.isDown || this.Wkey.isDown){

            //this.body.drag.y = 0;
        }else{
            //this.body.drag.y = 1600;
        }

        //While this seems to work I think it looks horrible. May want to re-think this.
        if(this.jumpKey && !this.movement_input_locked){
            this.jump();
        }else if(!this.onground && !this.falling && !this.jumpKey){
            //this is to prevent a jump after walking off a ledge. Any bonus jumps should still fire
            this.falling = true;
            this.jump_counter++;
        }else if(this.onground){
            this.falling = false;
        }

        if(this.body.blocked.down || this.body.touching.down){
            this.onground = true;
        }else{
            this.onground = false;
        }
    }else{
        this.body.velocity.x = 0;
    }
    
    if((this.body.velocity.x < -this.soft_maxvelocity.x) || (this.body.velocity.x > this.soft_maxvelocity.x)){
        console.log("over tha limit!")
        this.body.acceleration.x = 0;
        if(this.weaken_soft_velocity_limiter){
            this.body.drag.x = this.cur_acceleration / 8;
        }else{
            this.body.drag.x = this.base_acceleration * 3;           
        }
    }
    
    if((this.body.velocity.y < -this.soft_maxvelocity.y) || (this.body.velocity.y < -this.soft_maxvelocity.y)){
        if(this.weaken_soft_velocity_limiter){
            this.body.drag.y = this.cur_acceleration / 8;
        }else{
            this.body.drag.y = this.base_acceleration * 3;           
        }
    }else{
        this.body.drag.y = 0;
    }

    
    
}

Player.prototype.jump = function(){
    if(this.body.blocked.down || (this.jump_counter < this.max_jumps)){
        this.jumpKey = false; //prevents doublejumps being counted instantly plus prevents a held jump key from "bouncing". 
        this.falling = true; //prevents a jump from being prematurely counted for double-jumping
        this.body.velocity.y = -this.jump_speed;
        this.jump_counter++;
        //console.log(this.jump_counter + ' ' + this.max_jumps);
    }
};


Player.prototype.attack = function(evt){
    
    switch(this.dir * 2){
        case DIR_EAST:
            game.state.getCurrentState().createBullet(this.x, this.y, "spider", true, DIR_EAST);
            break;
        case DIR_WEST:
            game.state.getCurrentState().createBullet(this.x, this.y, "spider", true, DIR_WEST);
            break;
        case DIR_NORTH:
            game.state.getCurrentState().createBullet(this.x, this.y, "spider", true, DIR_NORTH);
            break;
        case DIR_SOUTH:
            game.state.getCurrentState().createBullet(this.x, this.y, "spider", true, DIR_SOUTH);
            break;
    }
}

Player.prototype.onDeath = function(){
    game.state.getCurrentState().bloodExplosion(this.x + (this.width / 2), this.y + (this.height/2));
    game.state.start('gameover');
    this.destroy();
}

Player.prototype.onMouseDown = function(evt){
    switch(evt.button){
        case 0:
            this.mouseLeft = true;
            break;
        case 2:
            this.mouseRight = true;
            break;
        default:
            console.log("Not recognised: " + evt.button);
    }
}

Player.prototype.onMouseUp= function(evt){
    switch(evt.button){
        case 0:
            this.mouseLeft = false;
            break;
        case 2:
            this.mouseRight = false;
            break;
        default:
            console.log("Not recognised: " + evt.button);
    }
}

Player.prototype.calculatePlayerToPointerAngle = function(){
    var ms_x = game.input.mousePointer.x;
    var ms_y = game.input.mousePointer.y;
    var adir = 0;
    var ptrdir = 0;
    
    ptrdir = this.playerToMousepointerDir = Math.atan2(ms_y - this.y, ms_x - this.x) / Math.PI;
    
    if(ptrdir < 0.125 && ptrdir > -0.125){
        adir = 0;
    }else if(ptrdir >= 0.125 && ptrdir < 0.375){
        adir = 0.25;
    }else if(ptrdir >= 0.375 && ptrdir < 0.625){
        adir = 0.5;
    }else if(ptrdir >= 0.625 && ptrdir < 0.875){
        adir = 0.75;
    }else if((ptrdir >= 0.875 && ptrdir <= 1) || (ptrdir < -0.875 && ptrdir >= -1)){
        adir = 1.0;
    }else if(ptrdir <= -0.625 && ptrdir > -0.875){
        adir = 1.25;
    }else if(ptrdir <= -0.375 && ptrdir > -0.625){
        adir = 1.5;
    }else if(ptrdir <= -0.125 && ptrdir > -0.375){
        adir = 1.75;
    }
    
    this.playerToMouseDir = adir;
}

function testWeaponAnim(start, tween){
    testweapon.x = start.x;
    testweapon.y = start.y;
    testweapon.angle = start.angle;
    tween.start();
}

Player.prototype.render = function(){
    
}

