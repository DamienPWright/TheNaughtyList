/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function Warp(X, Y, triggertext, destination_index){
    Phaser.Sprite.call(this, X, Y, "warp_pad");
    this.triggerText = (triggertext != undefined) ? triggertext : "Null Destination";
    this.triggerTextBox = new Phaser.Text(game, 15, 15, this.triggerText,  { fill: 'white', align: 'left', wordWrap: true, wordWrapWidth: 450 })
    this.destination_index = destination_index;
    
    this.triggerx = 0;
    this.triggery = 0;
    this.triggerwidth = 0;
    this.triggerheight = 0;
    this.trigger_active = false;
    this.trigger = new TriggerBox(this.triggerx, this.triggery, this.triggerwidth, this.triggerheight, this.onTriggerEnter, this.onTriggerExit, this)
}

Warp.prototype.update = function(){
    if(this.trigger_active && Ekey.isDown && !this.warp_active){
        this.onActivateWarp();
    }
}

Warp.prototype.onTriggerEnter = function(ctx){
    ctx.triggerTextBox.renderable = true;
    ctx.trigger_active = false;
}

Warp.prototype.onTriggerExit = function(ctx){
    ctx.triggerTextBox.renderable = false;
    ctx.warp_active = false;
    ctx.trigger_active = false;
}

Warp.prototype.onActivateWarp = function(){
    if(!this.warp_active){
        this.warp_active = true;
        current_level = this.destination_index;
        game.state.start('tmxlevel');
    }
}