/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Item(X, Y, iconid){
    Phaser.Sprite.call(this, game, X, Y, 'items');
    game.physics.arcade.enable(this);
    this.body.allowGravity = false;
    this.name = "Dammy";
    this.iconid = 0;
    this.x = X;
    this.y = Y;
    if(iconid){
       this.iconid = iconid 
    }
    this.buy_value = 0;
    this.sell_value = 0;
    this.usable = false;
    this.stacks = false;
    this.quantity = 0;
    this.frame = this.iconid;
}

Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;

Item.prototype.onAddItemToInventory = function(actor){
    //use to set flags for various things, like allowing the player to dash
    console.log("item " + this.name + " was added");
};

Item.prototype.update = function(actor){
    
};

Item.prototype.onRemoveItemFromInventory = function(actor){
    console.log("item " + this.name + " was removed");
};

Item.prototype.onUse = function(actor){
    
}

Item.prototype.onPickUp = function(actor){
    
}