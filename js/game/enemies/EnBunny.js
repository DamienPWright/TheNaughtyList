/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function EnBunny(X, Y){
    Enemy.call(this, X, Y, "en_bunny");
    this.maxHP = 9;
    this.curHP = 9;
    this.contact_damage = 1;
    
    this.body.collideWorldBounds = true;
    this.body.setSize(22, 16, 4, 16);
    this.dir = DIR_NORTH;
    this.dealsContactDamage = true;
    this.DEF_MAXVELOCITY = 60;
    this.abs_maxvelocity = this.DEF_MAXVELOCITY;
    //=====
    //States
    //=====
    //Idle state
    this.state_Idle = new ActorState(this);
    this.state_Idle.onEnter = function(){
       //
    };
    
    this.state_Idle.onExit = function(){
        //
    };
    this.state_Idle.update = function(){
        //
    };
    
    //Patrol state
    this.state_Patrol = new ActorState(this);
    this.state_Patrol.onEnter = function(){
       //
    };
    
    this.state_Patrol.onExit = function(){
        //
    };
    this.state_Patrol.update = function(){
        //
    };
    
    //goCrazy state
    this.state_goCrazy = new ActorState(this);
    this.state_goCrazy.onEnter = function(){
       //
    };
    
    this.state_goCrazy.onExit = function(){
        //
    };
    this.state_goCrazy.update = function(){
        //
    };
    
    //leap attack
    this.state_leapAttack = new ActorState(this);
    this.state_leapAttack.onEnter = function(){
       //
    };
    
    this.state_leapAttack.onExit = function(){
        //
    };
    this.state_leapAttack.update = function(){
        //
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
