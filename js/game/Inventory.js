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

Inventory.prototype.addItemToInventory = function(item){
    this.items.push(item);
    item.onAddedToInventory();
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