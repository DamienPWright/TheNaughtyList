/**
 * 
 * @param {string} key - specify the sprite key to use
 * @returns {Weapon}
 * @property {Array} hitboxFrames - define them in order of occurance.
 */
function Weapon(key, actor){
    Phaser.Sprite.call(this, game, 0, 0, 'wood_sword')
    if(actor){
        this.actor = actor
    }else{
        console.log("No actor supplied to weapon!");
    }
    this.anchor.setTo(0.5,0);
    this.is_attacking = false;
    this.DEF_ATK_TIME = 450;
    this.attack_counter = 0;
    this.DEF_ATK_COOLDOWN = 0;
    this.attack_cooldown_counter = 0;
    
    this.hitboxFrame = 0;
    this.hitboxFrames = [
            {f: 1, hb: 0}
        ];
    this.hitboxFrameIndex = 0;
    this.hitboxes = [
        {X: 0, Y: -20, W: 64, H: 58, friendly: true, lifespan: 50}
    ];
    
    this.bulletFrames = [
        
    ]
    this.bulletFrameIndex = 0;
    this.bullets = {
        
    }
    
    this.effectFrames = [
        {f: 0, ef: 0},
        {f: 1, ef: 1},
        {f: 2, ef: 0}
    ];
    this.effectFrameIndex = 0;
    this.effects = ["eff1", "eff2", "eff3"];
    
    this.x = 16;
    
    this.animations.add('atk', [0, 1, 2], 20, false);
    this.animations.add('idle', [2], 20, false);
}

Weapon.prototype = Object.create(Phaser.Sprite.prototype);
Weapon.prototype.constructor = Weapon;

Weapon.prototype.onAttack = function(){
    if((!this.is_attacking) && (this.attack_cooldown_counter <= 0)){
        this.is_attacking = true;
        this.animations.play('atk');
        this.attack_counter = this.DEF_ATK_TIME;
        this.attack_cooldown = this.DEF_ATK_COOLDOWN;
    }
}

Weapon.prototype.onEndAttack = function(){
    this.is_attacking = false;
    this.hitboxFrameIndex = 0;
    this.effectFrameIndex = 0;
}

Weapon.prototype.update = function(){
    if(this.is_attacking){
        //countdown
        this.attack_counter -= game.time.physicsElapsedMS;
        if(this.animations.currentAnim._frameIndex == this.hitboxFrame){
            //make a hitbox
        }
        if(this.hitboxFrameIndex < this.hitboxes.length){
            //console.log(' hitbox: ' + this.hitboxFrameIndex + ' frame: ' + this.animations.currentAnim._frameIndex);
            if(this.animations.currentAnim._frameIndex == this.hitboxFrames[this.hitboxFrameIndex].f){
                //create hitbox
                var hbx = this.hitboxes[this.hitboxFrames[this.hitboxFrameIndex].hb];
                var xpos = hbx.X;
                var hbxW = hbx.W;
                //console.log(hbx);
                if(this.actor.dir === 1){
                    xpos = -(xpos) - hbxW;
                }
                game.state.getCurrentState().createHitBox(this.actor.x + xpos, this.actor.y + hbx.Y, hbxW, hbx.H, hbx.friendly, hbx.lifespan, false, this);
                console.log( this.world.x + " " + xpos);
                this.hitboxFrameIndex++;
            }
        }
        if(this.effectFrameIndex < this.effects.length){
            //console.log(' effect: ' + this.effectFrameIndex + ' frame: ' + this.animations.currentAnim._frameIndex);
            if(this.animations.currentAnim._frameIndex == this.effectFrames[this.effectFrameIndex].f){
                //create hitbox
                var eff = this.effects[this.effectFrames[this.effectFrameIndex].ef];
                //console.log(eff);
                //game.states.getCurrentState().createHitBox(hbx);
                this.effectFrameIndex++;
            }
        }
        if(this.attack_counter <= 0){
            this.onEndAttack();
        }
    }else{
        if(this.attack_cooldown_counter > 0){
            this.attack_cooldown_counter -= game.time.physicsElapsedMS;
        }
    }
}

Weapon.prototype.onHitActor = function(actor){
       actor.takeDamage(3, true);
};