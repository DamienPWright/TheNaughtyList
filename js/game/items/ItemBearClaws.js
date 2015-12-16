/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function ItemBearClaws(X, Y){
    Item.call(this, X, Y);
    this.name = "Bear Claws";
    this.iconid = 10;
    this.jumpKey = false
}

ItemBearClaws.prototype = Object.create(Item.prototype);
ItemBearClaws.prototype.constructor = ItemBearClaws;

ItemBearClaws.prototype.onAddItemToInventory = function(actor){
    
};

ItemBearClaws.prototype.update = function(actor){
    if(actor.body.velocity.y > 0){
        if((actor.Akey.isDown && actor.body.blocked.left) || (actor.Dkey.isDown && actor.body.blocked.right)){
            actor.body.maxVelocity.y = 20;
            actor.jump_counter = 1;
        }else{
            actor.body.maxVelocity.y = actor.DEF_GRAV_MAX_Y
        }
    }
};

ItemBearClaws.prototype.onRemoveItemFromInventory = function(actor){
    console.log(this.name + " removed from inventory");
};