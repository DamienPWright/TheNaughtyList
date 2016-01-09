/**
 * 
 * @param {type} X
 * @param {type} Y
 * @param {type} key
 * @param {type} numlinks - number of links. Does not include the end piece.
 * @param {type} pendulum - set to false if you want the chain to swing around
 * @param {type} tincspeed - this is the incrementation of t per frame, used to calculate the link positions 
 * @returns {PendulumPlatform}
 */
function PendulumPlatform(X, Y, key, numlinks, pendulum, tincspeed){
    Phaser.Sprite.call(this, game, X, Y, 'pendplatchain');
    this.numlinks = numlinks;
    this.segments = [];
    this.t = 0;
    this.tmin = -1;
    this.tmax = 1;
    this.tdir = 0;
    this.tinc = 0.005;
    if(tincspeed != undefined){
        this.tinc = tincspeed;
    }
    
    this.t_ease = 0;
    this.platform_segment = 0;
    this.plat_newx = 0;
    this.plat_newy = 0;
    this.plat_prevx = 0;
    this.plat_prevy = 0;
    
    if(pendulum != undefined){
        this.easing = pendulum;
    }else{
        this.easing = true;
    }
    
    //use length, where length is the number of links in the chain
    for(var i = 0; i < this.numlinks; i++){
        var segment = new Phaser.Sprite(game, 0, 0, 'pendplatchain');
        this.addChild(segment);
        game.physics.enable(segment, Phaser.Physics.ARCADE);
        segment.body.allowGravity = false;
        segment.body.immovable = true;
        this.segments.push(segment);
        console.log("what")
    }
    
    this.platform_segment = new Phaser.Sprite(game, 0, 0, 'pendplatchain');
    game.physics.enable(this.platform_segment, Phaser.Physics.ARCADE);
    game.add.existing(this.platform_segment);
    this.plat_prevx = this.platform_segment.x;
    this.plat_prevy = this.platform_segment.y;
    this.platform_segment.body.allowGravity = false;
    this.platform_segment.body.immovable = true;
    platforms.add(this.platform_segment);
    
    game.add.existing(this);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.allowGravity = false;
}

PendulumPlatform.prototype = Object.create(Phaser.Sprite.prototype);
PendulumPlatform.prototype.constructor = PendulumPlatform;

PendulumPlatform.create = function(){
    
}

PendulumPlatform.prototype.update = function(){
    //move segments along parametric plot
    this.t += this.tinc;
    /*
    if(this.t > 1 && this.tdir == 0){
        this.tdir = 1;
    }else if(this.t < 0 && this.tdir == 1){
        this.tdir = 0;
    }
    
    if(this.tdir == 0){
        this.t += this.tinc;
    }else{
        this.t -= this.tinc;
    }
    */
    /*
    if(this.t > this.tmax){
        this.t = this.t - this.tmax * 2;
    }
    if(this.t < this.tmin){
        this.t = this.t + this.max * 2;
    }
    */
    
    if(this.easing){
        //quadratic feels good for regular pendulums. Use quartic for longer ones. 
        this.t_ease = Phaser.Easing.Quadratic.InOut(this.t) * Math.PI;
        //this.t_ease2 = Phaser.Easing.Quadratic.InOut(this.t + this.tinc) * Math.PI;
    }else{
        this.t_ease = this.t * Math.PI;
        //this.t_ease2 = (this.t + this.tinc) * Math.PI;
    }
    var tcos = Math.cos(this.t_ease);
    var tsin = Math.sin(this.t_ease);
    //var tcos2 = Math.cos(this.t_ease2);
    //var tsin2 = Math.sin(this.t_ease2);
    
    for(var i in this.segments){
        this.segments[i].body.velocity.x = -tsin * i;
        if(tsin >= 0){
            this.segments[i].body.velocity.y = -tcos * i;
        }else{
            this.segments[i].body.velocity.y = tcos * i;
        }
        
    }
    
    
    for(var i in this.segments){
        this.segments[i].x = tcos * i * this.width;
        this.segments[i].y = (tsin) * i * this.height;
        //Rose Experiment - Disable limiter for this.
        //this.segments[i].x = this.x + (Math.cos(10 * this.t) * Math.cos(this.t)) * i * this.width;
        //this.segments[i].y = this.y + (Math.cos(10 * this.t) * Math.sin(this.t)) * i * this.height;
    }
    
    //this.platform_segment.x = this.x + tcos * this.numlinks * this.width;
    //this.platform_segment.y = this.y + Math.abs(tsin) * this.numlinks * this.height;
    
    this.plat_newx = this.x + tcos * this.numlinks * this.width;
    this.plat_newy = this.y + (tsin) * this.numlinks * this.height;
    console.log(this.t);
    
    this.platform_segment.body.velocity.x = ((this.plat_newx - this.plat_prevx)/(game.time.physicsElapsedMS * .001))
    this.platform_segment.body.velocity.y = ((this.plat_newy - this.plat_prevy)/(game.time.physicsElapsedMS * .001))
    
    this.platform_segment.x = this.plat_prevx;
    this.platform_segment.y = this.plat_prevy;
    
    this.plat_prevx = this.plat_newx;
    this.plat_prevy = this.plat_newy;
    
}