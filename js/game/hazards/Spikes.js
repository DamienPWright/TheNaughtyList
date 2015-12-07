/**
 * @desc Construct a Spikes object.
 * @param {Number} X
 * @param {Number} Y
 * @param {String} orientation - Use DIR_EAST etc constants. 
 * @extends Hazard
 */

function Spikes(X, Y, orientation){
    Hazard.call(this, X, Y);
    this.orientation = DIR_NORTH;
    console.log(orientation);
    if(orientation){
        switch(orientation){
            case "n":
                this.orientation = DIR_NORTH;
                this.body.setSize(16,4,0,12);
                break;
            case "s":
                this.orientation = DIR_SOUTH;
                this.body.setSize(16,4,0,0);
                break;
            case "e":
                this.orientation = DIR_EAST;
                this.body.setSize(10,16,0,0);
                break;
            case "w":
                this.orientation = DIR_WEST;
                this.body.setSize(10,16,6,0);
                break;          
        }
    }else{
        this.orientation = DIR_NORTH;
        this.body.setSize(16,4,0,12);
    }
    
    switch(this.orientation){
        case DIR_NORTH:
            this.frame = 3;
            //set hitbox details
            break;
        case DIR_SOUTH:
            this.frame = 6;
            //set hitbox details
            break;
        case DIR_EAST:
            this.frame = 4;
            //set hitbox details
            break;
        case DIR_WEST:
            this.frame = 5;
            //set hitbox details
            break;
    }
}

Spikes.prototype = Object.create(Hazard.prototype);
Spikes.prototype.constructor = Spikes;

Spikes.prototype.onActorContact = function(actor){
    actor.takeDamage(255, true);
};