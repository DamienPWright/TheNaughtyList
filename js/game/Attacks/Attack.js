/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Attack(weapon, actor){
    this.weapon = weapon;
    this.actor = actor;
    this.attack_active = false;
    this.attack_anim_name = "atk";
    this.DEF_ATK_TIME = 400;
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
    ];
    this.effectFrameIndex = 0;
    this.effects = [
    ];
    
    this.weapon.animations.add('atk', [0, 1, 2], 20, false);
    
    this.attackdamageMod = 1;
}

Attack.prototype.onAttack = function(){
    if((!this.is_attacking) && (this.attack_cooldown_counter <= 0)){
        this.is_attacking = true;
        console.log(this.attack_anim_name)
        this.weapon.animations.play(this.attack_anim_name );
        this.attack_counter = this.DEF_ATK_TIME;
        this.attack_cooldown = this.DEF_ATK_COOLDOWN;
    }
}

Attack.prototype.onEndAttack = function(){
    this.is_attacking = false;
    this.hitboxFrameIndex = 0;
    this.effectFrameIndex = 0;
    this.weapon.onEndAttack();
}

Attack.prototype.update = function(){
    if(this.is_attacking){
        //countdown
        this.attack_counter -= game.time.physicsElapsedMS;
        if(this.weapon.animations.currentAnim._frameIndex == this.hitboxFrame){
            //make a hitbox
        }
        if(this.hitboxFrameIndex < this.hitboxes.length){
            //console.log(' hitbox: ' + this.hitboxFrameIndex + ' frame: ' + this.animations.currentAnim._frameIndex);
            if(this.weapon.animations.currentAnim._frameIndex == this.hitboxFrames[this.hitboxFrameIndex].f){
                //create hitbox
                var hbx = this.hitboxes[this.hitboxFrames[this.hitboxFrameIndex].hb];
                var xpos = hbx.X;
                var hbxW = hbx.W;
                //console.log(hbx);
                if(this.actor.dir === 1){
                    xpos = -(xpos) - hbxW;
                }
                game.state.getCurrentState().createHitBox(this.actor.x + xpos, this.actor.y + hbx.Y, hbxW, hbx.H, hbx.friendly, hbx.lifespan, false, this);
                //console.log( this.world.x + " " + xpos);
                this.hitboxFrameIndex++;
            }
        }
        if(this.effectFrameIndex < this.effects.length){
            //console.log(' effect: ' + this.effectFrameIndex + ' frame: ' + this.animations.currentAnim._frameIndex);
            if(this.weapon.animations.currentAnim._frameIndex == this.effectFrames[this.effectFrameIndex].f){
                //create hitbox
                var eff = this.effects[this.effectFrames[this.effectFrameIndex].ef];
                var xpos = eff.X;
                var effW = eff.W;
                var xscale = 1;
                //console.log(hbx);
                if(this.actor.dir === 1){
                    xpos = -(xpos) - effW;
                    xscale = -1;
                }
                //console.log(eff);
                game.state.getCurrentState().createEffect(this.actor.x + eff.x, this.actor.y + eff.y, eff.type, xscale);
                this.effectFrameIndex++;
            }
        }
        if(this.attack_counter <= 0){
            this.onEndAttack();
            this.attack_cooldown_counter = this.DEF_ATK_COOLDOWN
        }
    }else{
        if(this.attack_cooldown_counter > 0){
            this.attack_cooldown_counter -= game.time.physicsElapsedMS;
        }
    }
}

Attack.prototype.onHitActor = function(actor){
       actor.takeDamage(Math.ceil(this.weapon.baseWeaponAttack * this.attackdamageMod), true);
       console.log(Math.ceil(this.weapon.baseWeaponAttack * this.attackdamageMod))
};