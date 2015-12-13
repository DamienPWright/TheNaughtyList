/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function ItemHealthPickup(){
    Item.call(this, 0, 0);
    this.name = "Heart";
    this.stacks = true;
    this.hp_recovery = 2;
}

ItemHealthPickup.prototype = Object.create(Item.prototype);
ItemHealthPickup.prototype.constructor = ItemHealthPickup;

ItemHealthPickup.prototype.onAddItemToInventory = function(actor){
    if(actor.curHP < actor.maxHP){
        //use item immediately
        actor.heal(this.hp_recovery);
        actor.inventory.removeItemByName(this.name);
    }
};

ItemHealthPickup.prototype.update = function(actor){
    
};

ItemHealthPickup.prototype.onRemoveItemFromInventory = function(actor){
    console.log(this.name + " removed from inventory");
};

ItemHealthPickup.prototype.onPickUp = function(actor){
    
}

ItemHealthPickup.prototype.onUse = function(actor){
    if(actor.curHP < actor.maxHP){
        actor.heal(this.hp_recovery);
    }
    actor.inventory.removeItemByName(this.name);
}
