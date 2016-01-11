/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function SwordAttack(weapon, actor){
    Attack.call(this, weapon, actor)
    this.attack_anim_name = "atk"; //beware that this needs to be unique among attacks for a given weapon class.
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
}

SwordAttack.prototype = Object.create(Attack.prototype)
SwordAttack.prototype.constructor = SwordAttack;