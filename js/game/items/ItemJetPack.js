/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function ItemJetPack(X, Y){
    Item.call(this, X, Y);
    this.name = "Jetpack";
    this.iconid = 10;
    
    this.maxFuel = 2000;
    this.fuel = this.maxFuel;
}

ItemJetPack.prototype = Object.create(Item.prototype);
ItemJetPack.prototype.constructor = ItemJetPack;

ItemJetPack.prototype.onAddItemToInventory = function(actor){
    
};

ItemJetPack.prototype.update = function(actor){
    if(actor.jump_held && this.fuel > 0){
        actor.body.acceleration.y = -1400;
        actor.body.gravity.y = 0;
        actor.body.allowGravity = false;
        actor.body.maxVelocity.y = 350;
        this.fuel -= game.time.physicsElapsedMS;
    }else{
        actor.body.gravity.y = actor.DEF_GRAV_Y;
        actor.body.allowGravity = true;
        actor.body.maxVelocity.y = actor.DEF_GRAV_MAX_Y;
    }
    if(actor.body.blocked.down){
        this.fuel = this.maxFuel;
    }
};

ItemJetPack.prototype.onRemoveItemFromInventory = function(actor){
    console.log(this.name + " removed from inventory");
};
