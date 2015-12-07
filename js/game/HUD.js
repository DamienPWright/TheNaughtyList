function HUD(){
    this.heartsX = 0;
    this.heartsY = 0;
    this.num_hearts = 32;
    this.hearts = [];
    
    
    
    this.heart_xmod = 32;
    this.heart_ymod = 32;
    this.hearts_per_row = 8;
    
    for(var i = 0; i < this.num_hearts; i++){
        var heart = game.add.sprite(0, 0, 'ui_items');
        heart.frame = 2;
        ;
        this.hearts.push(heart);
        
        var row = Math.floor(i / this.hearts_per_row);
        heart.x = this.heartsX + (i * this.heart_xmod) - (row * (this.heart_xmod * this.hearts_per_row));
        //console.log(this.heartsX + " + (" + i + ' * ' + this.heart_xmod + ') - (' + row + ' * (' + this.heart_xmod + ' * ' + this.hearts_per_row);
        heart.y = this.heartsY + (row * this.heart_ymod);
        heart.fixedToCamera = true;
    }

    this.timeIconX = 10;
    this.timeIconY = 138;
    this.timeTextX = this.timeIconX + 12;
    this.timeTextY = this.timeIconY - 1;
    this.timeElapsedInMs = 0;
    this.timeElapsedInCs = 0;
    this.timeElapsedInS = 0;
    this.timeElapsedInM = 0;
    
    this.timeText = game.add.text(this.timeTextX, this.timeTextY, "0:00'00",  {font: '10px Verdana', fill: '#FFF'});
    
    this.timeText.fixedToCamera = true;
}

HUD.prototype.update = function(){
    this.updateTimer();
    this.updateHearts();
};

HUD.prototype.updateScore = function(newpoints){
    game.points += newpoints;
    //console.log(game);
    this.scoreText.text = game.points.toString();
    this.updateHearts();
};

HUD.prototype.updateTimer = function(){
    this.timeElapsedInMs += game.time.elapsedMS;
    this.timeElapsedInCs = Math.floor(this.timeElapsedInMs / 10) % 100;
    this.timeElapsedInS = Math.floor(this.timeElapsedInMs / 1000) % 60;
    this.timeElapsedInM = Math.floor(this.timeElapsedInMs / 1000 / 60);
    this.timeText.text = this.timeElapsedInM.toString() + ":" + this.timeElapsedInS + "'" + this.timeElapsedInCs;
};

HUD.prototype.updateLifeBar = function(){
    this.lifeBar.width = (player.curHP / player.maxHP) * this.lifeBar.initialWidth;
}

HUD.prototype.updateHearts = function(){
    var lifepoints = Math.ceil(player.curHP / 2);
    var maxlifepts = Math.ceil(player.maxHP / 2);
    
    if(maxlifepts >= this.hearts.length){
        return;
    }
    
    for(var i = 0; i < this.hearts.length; i++){
        //mark hearts renderable as long as its below maxlifepts
        if(i < maxlifepts){
            this.hearts[i].renderable = true;
        }else{
            this.hearts[i].renderable = false;
        }
        //change sprite frame depending on HP
        if(i < lifepoints){
            this.hearts[i].frame = 0;
        }else{
            this.hearts[i].frame = 2;
        }
        if(i == lifepoints - 1){
            if(player.curHP % 2 == 0){
                this.hearts[i].frame = 0;
            }else{
                this.hearts[i].frame = 1;
            }
        }
    }
}