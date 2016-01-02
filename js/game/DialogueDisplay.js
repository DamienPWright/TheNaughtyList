function DialogueDisplay(){
    Phaser.Sprite.call(this, game, 100, 20, 'dialogue_box');
    this.current_avatar = new Phaser.Sprite(game, 0, 0, 'blanksprite');
    this.ekey_indicator = new Phaser.Sprite(game, 15, this.height - 24, 'ui_items');
    this.ekey_indicator.frame = 40;
    this.ekey_indicator.animations.add('a',[40,41],8,true);
    this.ekey_indicator.animations.play('a');
    this.spacekey_indicator = new Phaser.Sprite(game, 55, this.height - 24, 'ui_items');
    this.spacekey_indicator.frame = 42;
    this.addChild(this.current_avatar);
    this.addChild(this.ekey_indicator);
    this.addChild(this.spacekey_indicator);
    this.current_dialogue;
    this.current_dialogue_complete = false;
    this.current_line = "";
    this.current_line_length = 0;
    this.current_line_counter = 0;
    this.typewrite_counter = 0;
    this.display_text = "";
    this.textbox = new Phaser.Text(game, 15, 15, "",  { fill: 'white', align: 'left', wordWrap: true, wordWrapWidth: 450 })
    this.addChild(this.textbox);
    this.renderable = false;
    this.fixedToCamera = true;
    this.end_of_line = false;
}

DialogueDisplay.prototype = Object.create(Phaser.Sprite.prototype);
DialogueDisplay.prototype.constructor = DialogueDisplay;


DialogueDisplay.prototype.getDialogue = function(id){
    //look in the json or a loaded global array of dialogues
    //check if it has an avatar, if so set the avatar sprite to the given spritepath
    //reset all counters. 
    var dialoguedata = dialogues[id][0]
    this.current_dialogue_complete = false;
    this.renderable = false;
    this.current_line = "";
    this.current_line_length = 0;
    this.current_line_counter = 0;
    this.typewrite_counter = 0;
    this.display_text = "";
    
    if(dialoguedata.avatar !== "null"){
        
    }else{
        console.log("No avatar");
    }
    this.current_dialogue = new Dialogue(dialoguedata.lines, dialoguedata.avatar);
    this.getLine();
    this.renderable = true;
    if(this.current_dialogue){
        player.controls_locked = true;
    }
}

DialogueDisplay.prototype.getLine = function(){
    if(this.current_line_counter < this.current_dialogue.lines.length){
        this.current_line = this.current_dialogue.getLine(this.current_line_counter);
        this.current_line_length = this.current_line.length;
        this.typewrite_counter = 0;
        this.current_line_counter++;
        this.end_of_line = false;
        this.display_text = "";
    }else{
        this.current_dialogue.complete = true;
    }
}   

DialogueDisplay.prototype.onAdvanceButtonPress = function(){
    if(this.end_of_line){
        this.getLine();
    }else{
        this.display_text = this.current_line;
        this.typewrite_counter = this.current_line.length;
        this.end_of_line = true;
        console.log(this.display_text);
        //set skip button down to false to prevent accidental multi-skipping
    }
}

DialogueDisplay.prototype.skip = function(){
    this.current_dialogue.complete = true;
    this.end_of_line = true;
}


DialogueDisplay.prototype.typeWrite = function(){
    if(this.typewrite_counter < this.current_line_length){
        this.display_text += this.current_line[this.typewrite_counter];
            this.typewrite_counter++;
    }else{
        this.end_of_line = true;
    }
}

DialogueDisplay.prototype.update = function(){
    if(this.current_dialogue){
        if(this.current_dialogue.complete){
            this.renderable = false;
            this.current_line = "";
            this.current_line_length = 0;
            this.current_line_counter = 0;
            this.typewrite_counter = 0;
            this.display_text = "";
            this.textbox.setText(this.display_text);
            this.current_dialogue = undefined;
            player.controls_locked = false;
            this.current_dialogue_complete = true;
            //console.log("dialogue complete");
        }else{
            this.typeWrite();
            this.textbox.setText(this.display_text);
            //console.log(this.display_text);
            if(Ekey.isDown){
                Ekey.isDown = false;
                this.onAdvanceButtonPress();
            }
            if(SpaceKey.isDown){
                SpaceKey.isDown = false;
                this.skip();
            }
        }
    }
}