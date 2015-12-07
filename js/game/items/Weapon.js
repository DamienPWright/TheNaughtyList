/**
 * 
 * @param {string} key - specify the sprite key to use
 * @returns {Weapon}
 * @property {Array} hitboxFrames - define them in order of occurance.
 */
function Weapon(key){
    Phaser.Sprite.call(this, game, 0, 0, 'wood_sword')
    this.is_attacking = false;
    this.DEF_ATK_TIME = 450;
    this.attack_counter = 0;
    this.DEF_ATK_COOLDOWN = 0;
    this.attack_cooldown_counter = 0;
    
    this.hitboxFrame = 0;
    this.hitboxFrames = [];
    this.hitboxFrameIndex = 0;
    this.hitboxes = [];
    this.effectFrames = [];
    this.effectFrameIndex = 0;
    this.effects = [];
    
    test = this;
    
    this.animations.add('atk', [0, 1, 2], 20, false);
    this.animations.add('idle', [2], 20, false);
}

Weapon.prototype = Object.create(Phaser.Sprite.prototype);
Weapon.prototype.constructor = Weapon;

/**
 * @abstract - included code is only an example
 */

Weapon.prototype.onAttack = function(){
    //weapon is now attacking, report attack complete at the appropriate time
    if((!this.is_attacking) && (this.attack_cooldown_counter <= 0)){
        this.is_attacking = true;
        this.animations.play('atk');
        this.attack_counter = this.DEF_ATK_TIME;
        this.attack_cooldown = this.DEF_ATK_COOLDOWN;
    }
    //console.log('atk');
}

Weapon.prototype.onEndAttack = function(){
    this.is_attacking = false;
}

/**
 * @abstract - included code is only an example
 */
Weapon.prototype.update = function(){
    if(this.is_attacking){
        //countdown
        this.attack_counter -= game.time.physicsElapsedMS;

        console.log(this.attack_counter);
        if(this.animations.currentAnim._frameIndex == this.hitboxFrame){
            //make a hitbox
        }
        if(this.hitboxFramesIndex < this.hitboxes.length){
            if(this.animations.currentAnim._frameIndex == this.hitboxFrames[this.hitboxFrameIndex]){
                //create hitbox
                var hbx = this.effects[this.effectFrameIndex];
                game.states.getCurrentState().createHitBox(hbx);
                this.effectFrameIndex++;
            }
        }
        if(this.effectFrameIndex < this.effects.length){
            if(this.animations.currentAnim._frameIndex == this.effectFrames[this.effectFrameIndex]){
                //create effect
                var eff = this.effects[this.effectFrameIndex];
                game.states.getCurrentState().createEffect(eff);
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