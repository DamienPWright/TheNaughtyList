/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Inventory(player){
    this.player = player;
    this.items = [];
    this.weapons = [];
    this.activeweapon = null;
}

Inventory.prototype.getItem = function(){
    
}

Inventory.prototype.addItemToInventory = function(item, stacks){
    if(stacks){
        //find item, then increment its amount
    }else{
        this.items.push(item);
    }
    
    item.onAddItemToInventory();
}

/**
 * 
 * @param {type} itemname - string
 * @returns {undefined}
 */
Inventory.prototype.hasItem = function(itemname){
    var hasitem = false;
    var result = this.items.filter(function( obj ) {
           return obj.name == itemname;
    });
    if(result.length > 0){
        hasitem = true;
    }
    return hasitem;
}

Inventory.prototype.addWeapon = function(weapon){
    this.weapons.push(weapon);
    if(!this.activeweapon){
        this.equipWeapon(this.weapons.length - 1);
        
    }
}

Inventory.prototype.equipWeapon = function(index){
    if(index < this.weapons.length){
        if(this.activeweapon){
            this.player.remove(activeweapon);
            this.player.addChild(this.weapons[index]);
        }else{
            this.player.addChild(this.weapons[index]);
        }
        this.activeweapon = this.weapons[index]; 
        this.activeweapon.y -= this.activeweapon.height / 2 - 4;
    }
}

Inventory.prototype.updateItems = function(actor){
    for(var i in this.items){
        this.items[i].update(actor);
    }
    for(var i in this.weapons){
        this.weapons[i].update();
    }
}

Inventory.prototype.postUpdate = function(){
    
};

Inventory.prototype.showInventory = function(){
    var inv = "";
    for(var i in this.items){
        inv = inv + this.items[i].name + ". "
    }
    console.log(inv);
}