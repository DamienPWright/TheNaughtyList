/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function ItemSickPumps(X, Y){
    Item.call(this, X, Y);
    this.name = "Sick Pumps";
    this.iconid = 10;
}

ItemSickPumps.prototype = Object.create(Item.prototype);
ItemSickPumps.prototype.constructor = ItemSickPumps;

ItemSickPumps.prototype.onAddItemToInventory = function(actor){
    actor.max_jumps = 2;
};

ItemSickPumps.prototype.update = function(actor){
    
};

ItemSickPumps.prototype.onRemoveItemFromInventory = function(actor){
    console.log(this.name + " removed from inventory");
    actor.max_jumps = 1;
};
