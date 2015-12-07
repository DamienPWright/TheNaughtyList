/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Item(){
    this.iconid = 0;
    this.buy_value = 0;
    this.sell_value = 0;
}

Item.prototype.onAddItemToInventory = function(actor){
    //use to set flags for various things, like allowing the player to dash
};

Item.prototype.update = function(actor){
    
};

Item.prototype.onRemoveItemFromInventory = function(actor){
 
};