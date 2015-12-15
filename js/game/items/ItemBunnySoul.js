/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function ItemBunnySoul(X, Y){
    Item.call(this, X, Y);
    this.name = "Bunny Soul";
    this.iconid = 10;
}

ItemBunnySoul.prototype = Object.create(Item.prototype);
ItemBunnySoul.prototype.constructor = ItemBunnySoul;

ItemBunnySoul.prototype.onAddItemToInventory = function(actor){
    actor.jump_speed = 800;
    actor.body.maxVelocity.y = 800;
};

ItemBunnySoul.prototype.update = function(actor){
    
};

ItemBunnySoul.prototype.onRemoveItemFromInventory = function(actor){
    console.log(this.name + " removed from inventory");
    actor.jump_speed = actor.DEF_JUMP_SPEED;
    actor.body.maxVelocity.y = actor.DEF_GRAV_MAX_Y;
};
