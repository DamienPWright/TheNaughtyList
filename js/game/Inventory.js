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
    if(item.stacks){
        //find item, then increment its amount
        var itemindex = this.getIndexOfItem(item.name);
        if(itemindex != -1){
            this.items[itemindex].quantity += 1;
        }else{
            this.items.push(item);
            item.quantity = 1;
        }
    }else{
        this.items.push(item);
    }
    item.x = 0;
    item.y = -9000;
    item.onAddItemToInventory(this.player);
}

Inventory.prototype.removeItemByName = function(itemname){
    if(!this.hasItem(itemname)){
        console.log("Cannot remove an item that isn't in inventory: " + itemname);
        return;
    }
    var itmindex = this.getIndexOfItem(itemname);
    
    if(itmindex != -1){
        this.items[itmindex].onRemoveItemFromInventory(this.player);
        if(this.items[itmindex].stacks){
            if(this.items[itmindex].quantity > 1){
                this.items[itmindex].quantity -= 1;
            }else{
                this.items.splice(itmindex, 1);
            }
        }else{
            this.items.splice(itmindex, 1);
        }
        
    }else{
        console.log("Item index not found");
        return
    }
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

Inventory.prototype.getIndexOfItem = function(itemname){
    var index = -1;
    for(var i in this.items){
        if(this.items[i].name === itemname){
            index = i;
            break;
        }
    }
    return index;
}

Inventory.prototype.useItemByIndex = function(index){
    if(index < this.items.length && index > -1){
        this.items[index].onUse(this.player);
    }else{
        console.log("useITemByIndex: Invalid index entry supplies");
    }
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