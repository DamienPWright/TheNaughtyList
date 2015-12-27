function Enemy(X, Y, key){
    Actor.call(this, X, Y, key);
    this.dealsContactDamage = false;
    this.contact_damage = 1;
    this.blinkTimer = 6;
    game.physics.arcade.enable(this);
    this.seekboxes = [
        
    ];
    this.detectors = [
        
    ]
    //=====
    //States
    //=====
    //Idle state
    this.state_Idle = new ActorState(this);
    this.state_Idle.onEnter = function(){
       //
    };
    this.state_Idle.onExit = function(){
    };
    this.state_Idle.update = function(){
        //
    };
    this.fsm.changeState(this.state_Idle);
}

Enemy.prototype = Object.create(Actor.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(){
    this.updateActor();
    this.fsm.update();
    this.updateAnimation();
    this.updateDetectors();
};

Enemy.prototype.checkAttackBox = function (target){
    var detected = false;
    return detected;
};

Enemy.prototype.onPlayerContact = function (actor){
    if(this.dealsContactDamage){
        actor.takeDamage(this.contact_damage, true);
    }
}

Enemy.prototype.updateDetectors = function (){
    
}