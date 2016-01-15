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
    
    this.left_attack = new SwordAttack(this, this.actor);
    this.right_attack = new SwordSpecial(this, this.actor);
    
    this.animations.add('idle', [2], 20, false);
    
    this.animations.play('idle');
    
    this.x = 16;
    this.baseWeaponAttack = 3;
    this.attackdamageMod = 0;
}

Weapon.prototype = Object.create(Phaser.Sprite.prototype);
Weapon.prototype.constructor = Weapon;

Weapon.prototype.onAttack = function(left){
    if(!this.is_attacking){
        if(left){
            this.left_attack.onAttack();
            this.attackdamageMod = this.left_attack.attackdamageMod;
        }else{
            this.right_attack.onAttack();
            this.attackdamageMod = this.left_attack.attackdamageMod;
        }
    }
}

Weapon.prototype.onEndAttack = function(){
    this.animations.play('idle');
}

Weapon.prototype.update = function(){
    if(this.left_attack.is_attacking || this.right_attack.is_attacking){
        this.is_attacking = true;
    }else{
        this.is_attacking = false;
    }
    this.left_attack.update();
    this.right_attack.update();
}

Weapon.prototype.onHitActor = function(actor){
       actor.takeDamage(Math.ceil(this.baseWeaponAttack * this.attackdamageMod), true);
       console.log("inflicted " + Math.ceil(this.baseWeaponAttack * this.attackdamageMod) + " damage.")
};