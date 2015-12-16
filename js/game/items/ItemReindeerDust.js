/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function ItemReindeerDust(X, Y){
    Item.call(this, X, Y);
    this.name = "Reindeer Dust";
    this.iconid = 10;
    this.jumpKey = false
}

ItemReindeerDust.prototype = Object.create(Item.prototype);
ItemReindeerDust.prototype.constructor = ItemReindeerDust;

ItemReindeerDust.prototype.onAddItemToInventory = function(actor){
    
};

ItemReindeerDust.prototype.update = function(actor){
    if(actor.jump_held && actor.body.velocity.y > 0){
        actor.body.maxVelocity.y = 50;
    }else{
        actor.body.maxVelocity.y = actor.DEF_GRAV_MAX_Y;
    }
};

ItemReindeerDust.prototype.onRemoveItemFromInventory = function(actor){
    console.log(this.name + " removed from inventory");
    
};
