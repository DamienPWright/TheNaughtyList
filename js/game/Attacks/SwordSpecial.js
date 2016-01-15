function SwordSpecial(weapon, actor){
    Attack.call(this, weapon, actor)
    this.attack_anim_name = "s1"; //beware that this needs to be unique among attacks for a given weapon class.
    this.DEF_ATK_TIME = 600;
    this.attack_counter = 0;
    this.DEF_ATK_COOLDOWN = 1000;
    this.attack_cooldown_counter = 0;
    
    this.hitboxFrame = 0;
    this.hitboxFrames = [
            {f: 8, hb: 0}
        ];
    this.hitboxFrameIndex = 0;
    this.hitboxes = [
        {X: 0, Y: -96, W: 128, H: 128, friendly: true, lifespan: 50}
    ];
    
    this.bulletFrames = [
        
    ]
    this.bulletFrameIndex = 0;
    this.bullets = {
        
    }
    
    this.effectFrames = [
        {f: 8, ef: 0},
    ];
    this.effectFrameIndex = 0;
    this.effects = [
        {type: "eff_swordspecial01", x: 0, y: -96}
    ];
    
    this.weapon.animations.add('s1', [0, 0, 0, 0, 0, 0, 0, 0, 1, 2], 20, false);
    
    this.attackdamageMod = 2;
}

SwordSpecial.prototype = Object.create(Attack.prototype)
SwordSpecial.prototype.constructor = SwordSpecial;
