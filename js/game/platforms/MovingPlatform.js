/**
 * 
 * @param {Number} X
 * @param {Number} Y
 * @param {Number} direction - use the DIR_NORTH etc constants.
 * @param {Boolean} dt_switch - Set to true to use distance, false to use time.
 * @param {Number} dt_amount - The variable this sets depends on the dt_switch flag. Use pixels for distance and milliseconds for time
 * @returns {MovingPlatform}
 */

function MovingPlatform(X, Y, direction, dt_switch, dt_amount, movespeed){
    Phaser.Sprite.call(this, game, X, Y, 'platformA');
    game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.body.allowGravity = false;
    this.body.checkCollision.down = false
    this.body.checkCollision.left = false
    this.body.checkCollision.right = false
    this.dt_switch = false;
    if(dt_switch){
        if(dt_switch == "true"){
            dt_switch = true;
        }else{
            dt_switch = false;
        }
    }
    
    this.movetime = (this.dt_switch && dt_amount) ? Number(dt_amount) : 2000;
    this.move_counter = this.movetime;
    
    this.movedistance = (!this.dt_switch && dt_amount) ? Number(dt_amount) : 50;
    
    this.startX = Number(X);
    this.startY = Number(Y);
    this.direction = Number(direction);
    this.movespeed = (movespeed) ? Number(movespeed) : 100;
    this.body.maxVelocity.x = this.movespeed;
    this.body.maxVelocity.y = this.movespeed;
    
    this.direction = Number(direction);
    if(this.direction == DIR_SOUTH || this.direction == DIR_EAST){
        this.flipped = 0;
    }else{
        this.flipped = 1;
    }
    //console.log(this.movespeed);
}

MovingPlatform.prototype = Object.create(Phaser.Sprite.prototype);
MovingPlatform.prototype.constructor = MovingPlatform;

MovingPlatform.prototype.update = function(){
    if(this.dt_switch){
        this.move_counter -= game.time.physicsElapsedMS;
        if(this.move_counter <= 0){
            if(this.flipped == 1){
                this.flipped = 0
            }else{
                this.flipped = 1
            }
            this.move_counter = this.movetime;
        }
    }else{
        if(this.flipped == 0){
            if(this.x > this.startX + this.movedistance){
                this.flipped = 1;
            }
            if(this.y > this.startY + this.movedistance){
                this.flipped = 1;
            }
        }else if(this.flipped == 1){
            if(this.x < this.startX){
                this.flipped = 0;
            }
            if(this.y < this.startY){
                this.flipped = 0;
            }
        }
    }
    //console.log(this.flipped);
    var accel;
    
    if(this.flipped == 0){
        accel = this.movespeed * 4;
    }else{
        accel = -this.movespeed * 4;
    }
    //console.log(this.direction);
    switch(this.direction){
        case DIR_NORTH:
        case DIR_SOUTH:
            this.body.acceleration.y = accel;
            break;
        case DIR_EAST:
        case DIR_WEST:
            this.body.acceleration.x = accel;
            break;
    }
    console.log(this.body.friction);
}