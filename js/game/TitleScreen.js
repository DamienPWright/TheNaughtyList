function TitleScreen(game){
    this.game = game;
    this.cursors;
    this.enterKey;
    this.selector;
    this.selectorPos = 0;
    this.num_menu_objects = 4;
    this.selPosX = 50;
    this.selPosY = 50;
    this.selPosYmod = 20;
    this.selectorHoldTime = 10;
    this.selectorHoldCounter = 0
}

TitleScreen.prototype.preload = function(){
    game.load.image('title_select', 'assets/img/ui/titleselector.png');
    
    game.load.spritesheet('player', 'assets/img/sprites/player.png', 32, 32);
    
    game.load.spritesheet('NPCs', 'assets/img/sprites/NPC.png', 32, 64);
    
    game.load.spritesheet('en_bunny', 'assets/img/sprites/ene_bunny.png', 32, 32);
    
    game.load.spritesheet('hazards', 'assets/img/sprites/hazards.png', 32, 32);
    
    game.load.spritesheet('platformA', 'assets/img/sprites/platformA.png', 96, 32);
    
    game.load.spritesheet('blood', 'assets/img/sprites/blood.png', 4, 4);
    
    game.load.spritesheet('ui_items', 'assets/img/ui/hud_elements.png', 32, 32);
    game.load.spritesheet('items', 'assets/img/tilesets/itemiconlist.png', 32, 32);
    game.load.image('dialogue_box', 'assets/img/ui/textbox.png')
    
    game.load.spritesheet('wood_sword', 'assets/img/sprites/woodsword_swipe.png', 64, 64);
    
    game.load.json('dialogues', 'js/game/data/Dialogues.json');
}

TitleScreen.prototype.create = function(){
     init();
    scoreText = game.add.text(16, 16, '', {fontSize: '32px', fill: '#FFF'});
    dialogues = game.cache.getJSON('dialogues');
    
    this.selector = game.add.sprite(0,0,'title_select');
    this.selector.canMove = true;
    this.cursors = game.input.keyboard.createCursorKeys();
    this.enterKey =  game.input.keyboard.addKey(13);
    
    game.add.text(16, 16, 'Combat Test', {font: '16px Arial', fill: '#FFF'});
    game.add.text(this.selPosX, this.selPosY, 'Test Map', {font: '10px Arial', fill: '#FFF'});
    game.add.text(this.selPosX, this.selPosY + this.selPosYmod, 'Combat Test', {font: '10px Arial', fill: '#FFF'});
    game.add.text(this.selPosX, this.selPosY + this.selPosYmod * 2, 'Nothing', {font: '10px Arial', fill: '#FFF'});
    game.add.text(this.selPosX, this.selPosY + this.selPosYmod * 3, 'Nothing', {font: '10px Arial', fill: '#FFF'});
    
    this.selector.y = (this.selPosY + (this.selPosYmod * this.selectorPos)) + this.selector.height - 6;
    this.selector.x = this.selPosX - (this.selector.width * 2);
     //cursors
    cursors = game.input.keyboard.createCursorKeys();
}

TitleScreen.prototype.update = function() {
    if(this.enterKey.isDown){
        switch(this.selectorPos){
            case 0:
                current_level = 0;
                game.state.start('tmxlevel');
                break;
            case 1:
                current_level = 1;
                game.state.start('tmxlevel');
                break;
            case 2:
                break;
            case 3:
                break;
            default:
                //do nothing
        }
    }

    if(cursors.up.isDown && this.selector.canMove){
        this.selectorPos -= 1;
        this.selector.canMove = false;
        if(this.selectorPos < 0){
            this.selectorPos = this.num_menu_objects - 1;
        }
        this.setSelectorPos(this.selectorPos);
    }else if(cursors.down.isDown && this.selector.canMove){
        this.selector.canMove = false;
        this.selectorPos += 1;
        if(this.selectorPos >= this.num_menu_objects){
            this.selectorPos = 0;
        }
        this.setSelectorPos(this.selectorPos);
    }
    
    if(!this.selector.canMove){
        this.selectorHoldCounter += 1;
        if(this.selectorHoldCounter > this.selectorHoldTime){
            this.selectorHoldCounter = 0;
            this.selector.canMove = true;
        }
    }
}

TitleScreen.prototype.setSelectorPos = function(newPos){
    if(newPos < this.num_menu_objects){
        this.selector.y = (this.selPosY + (this.selPosYmod * this.selectorPos)) + this.selector.height - 6;
    }
}

TitleScreen.prototype.render = function(){
    //debug - due to the scaling it has to be done before pixel.context.drawImage or else it will be drawn underneath!
   // pixel.context.drawImage(game.canvas, 0, 0, game.width, game.height, 0, 0, pixel.width, pixel.height);
};