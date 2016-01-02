/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

TriggerBox = function(X, Y, W, H, onEnterCallback, onExitCallback, callbackcontext){
    Phaser.Sprite.call(this, game, X, Y, "blanksprite");
    this.x = X;
    this.y = Y;
    this.width = W;
    this.height = H;
    this.trigger_activated = false;
    this.trigger_active = false;
    this.overlaps_player = false;
    game.physics.arcade.enable(this);
    this.body.allowGravity = false;
    this.onEnterCallback = onEnterCallback;
    this.onExitCallback = onExitCallback;
    this.callbackContext = callbackcontext;
    
    this.renderable = false;
}

TriggerBox.prototype = Object.create(Phaser.Sprite.prototype);
TriggerBox.prototype.constructor = TriggerBox;

TriggerBox.prototype.onEnterTriggerBox = function(){
    console.log("Entered Trigger");
    if(this.onEnterCallback){
        if(this.callbackContext){
            this.onEnterCallback(this.callbackContext);
        }else{
            this.onEnterCallback();
        }
    }
}

TriggerBox.prototype.update = function(){
    this.overlaps_player = this.overlap(player);
    if(this.overlaps_player && !this.trigger_activated){
        this.trigger_activated = true;
        this.onEnterTriggerBox();
    }
    if(!this.overlaps_player && this.trigger_activated){
        this.trigger_activated = false;
        this.onExitTriggerBox();
    }
}

TriggerBox.prototype.onExitTriggerBox = function(){
   console.log("Exited Trigger");
   if(this.onExitCallback){
        if(this.callbackContext){
            this.onExitCallback(this.callbackContext);
        }else{
            this.onExitCallback();
        }
    }
}

