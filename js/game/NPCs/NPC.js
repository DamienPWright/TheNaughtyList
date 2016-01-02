function NPC(X, Y, key){
    this.spritekey = "NPCs";
    if(key){
        this.spritekey = key;
    }
    Actor.call(this, X, Y, this.spritekey);
    this.anchor.setTo(0.5,0);
    this.dialogueid = "test_text_002";
    this.playstate_ref = game.state.getCurrentState();
    this.interact_active = false;
    //create trigger field.
    this.triggerwidth = 128;
    this.triggerheight = 128;
    console.log(this.x)
    this.triggerx = this.x - this.triggerwidth/2;
    this.triggery = this.y - this.triggerheight/2;
    this.trigger = new TriggerBox(this.triggerx, this.triggery, this.triggerwidth, this.triggerheight, this.onTriggerEnter, this.onTriggerExit, this)
    this.trigger_active = false;
    game.add.existing(this.trigger);
    NPCtest = this;
}

NPC.prototype = Object.create(Actor.prototype)
NPC.prototype.constructor = NPC;

NPC.prototype.onInteract = function(){
    if(!this.interact_active){
        this.playstate_ref.dialoguebox.getDialogue(this.dialogueid);
        this.interact_active = true;
    }
}

NPC.prototype.update = function(){
    console.log(this.playstate_ref.dialoguebox.current_dialogue_complete);
    if(this.interact_active){
        if(this.playstate_ref.dialoguebox.current_dialogue_complete){
            this.interact_active = false;
            console.log("NPC interact false")
        }
    }
    if(this.trigger_active && Ekey.isDown && !this.interact_active){
        this.onInteract();
    }
    if(this.trigger_active){
        if(player.x > this.x){
            this.scale.setTo(1,1);
        }else{
            this.scale.setTo(-1,1);
        }
    }
}

NPC.prototype.onTriggerEnter = function(ctx){
    //console.log("Trigger enter called on " + this);
    ctx.trigger_active = true;
}

NPC.prototype.onTriggerExit = function(ctx){
    //console.log("Trigger exit called" + this);
    ctx.trigger_active = false;
}