function TmxLevel(){
    this._tilemap = 1 
    this._tileimage = 1
}

TmxLevel.prototype.preload = function(){ 
    game.load.tilemap('tilemap', levels[current_level].levelpath, null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tileset', tilesets[levels[current_level].tileset])
}

TmxLevel.prototype.create = function(){
    
   game.physics.startSystem(Phaser.Physics.ARCADE);
   game.physics.arcade.gravity.y = 750; 
   game.stage.backgroundColor = "#000000";
   
   this.hazards = game.add.group();
   this.blood = game.add.group();
   this.enemies = game.add.group();
   this.items = game.add.group();
   this.platforms = game.add.group();
   
   this.hitboxes_seek = game.add.group();
   this.hitboxes_friendly = game.add.group();
   this.hitboxes_unfriendly = game.add.group();

   playerchar = new Player(0,0);
   player = game.add.existing(playerchar)
   
   
   //hazards = this.hazards;
   
   if(this._tilemap != null && this._tileimage != null){
       this.map = game.add.tilemap('tilemap'); 
       this.map.addTilesetImage( this.map.tilesets[0].name, 'tileset');
       
       //layers
       //this.bkg_layer = this.map.createLayer('bkg');
       this.wall_layer = this.map.createLayer('wall');
       
       //tile collisions
       this.map.setCollisionByExclusion([-1], true, this.wall_layer);
       
       //set world to map size
       this.wall_layer.resizeWorld();
       //init pathfinding
       //pathfindhelper.setMap();
       this.createObjectsFromMap();
       console.log("Map Loaded");
   }else{
       console.log("Tilemap or tileset image not set");
   }
   
   
   
   game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);
   tmxtest = this;
   this.hud = new HUD();
}

TmxLevel.prototype.update = function(){
    game.physics.arcade.overlap(player, this.hazards, function(actor, hzd){if(actor.hitbox.overlap(hzd)){hzd.onActorContact(actor)}});
    game.physics.arcade.overlap(player, this.enemies, function(actor, enemy){if(actor.hitbox.overlap(enemy)){enemy.onPlayerContact(actor)}});
    game.physics.arcade.overlap(player, this.items, function(actor, item){player.inventory.addItemToInventory(item)});
    game.physics.arcade.collide(player, this.wall_layer);
    game.physics.arcade.collide(player, this.platforms);
    game.physics.arcade.collide(this.enemies, this.wall_layer);
    
    game.physics.arcade.collide(this.blood, this.wall_layer);
    game.physics.arcade.overlap(this.hitboxes_friendly, this.enemies, function(hitbox, enemy){test = hitbox; hitbox.onContactWithActor(enemy)})
    this.hud.update();
}


TmxLevel.prototype.createObjectsFromMap = function(){
    console.log("loading objects?")
    var objs = this.map.objects.objects;
    //maptest = this.map;
    for(var i in objs){
        console.log(objs[i].name)
        //console.log(objs[i].x);
        switch(objs[i].name){
            case 'player':
                //player already exists so just set its position
                player.x = objs[i].x;
                player.y = objs[i].y - player.height;
                break;
            case 'hazard':
                this.createHazardsFromMap(objs[i]);
                break;
            case 'enemy':
                this.createEnemiesFromMap(objs[i]);
                break;
            case 'platform':
                this.createPlatformsFromMap(objs[i]);
                break;
            case 'item':
                this.createItemsFromMap(objs[i]);
                break;
        }
    }
}

TmxLevel.prototype.createEnemiesFromMap = function(en){
    var newenemy;
    
    switch(en.properties.type){
        case "bunny":
            newenemy = new EnBunny(en.x, en.y - 32);
            break;
    }
    
    if(newenemy){
        this.enemies.add(newenemy);
        if(newenemy.dealsContactDamage){
            console.log("contact damage enemy created");
            //this.enemies_contactdamage.add(newenemy);
        }
    }else{
        console.log("Invalid enemy: " + en.properties.type)
    }
}

TmxLevel.prototype.createItemsFromMap = function(itm){
    var newitem;
    
    switch(itm.properties.type){
        case "heart":
            newitem = new ItemHealthPickup(itm.x, itm.y - 32);
            break;
    }
    
    if(newitem){
        this.items.add(newitem);
    }else{
        console.log("invalid item: " + itm.gid)
    }
}

TmxLevel.prototype.createHazardsFromMap = function(hzd){
    var newhazard;
    
    switch(hzd.properties.type){
        case "spikes":
            newhazard = new Spikes(hzd.x, hzd.y - 32, hzd.properties.orientation);
        break;
    }
    
    if(newhazard){
        this.hazards.add(newhazard);
    }else{
        console.log("invalid hazard: " + hzd.gid)
    }
}

TmxLevel.prototype.createPlatformsFromMap = function(plt){
    var newplatform;
    
    switch(plt.properties.type){
        case "moving":
            newplatform = new MovingPlatform(plt.x, plt.y - 32, plt.properties.direction, plt.properties.dt_switch, plt.properties.dt_amount);
        break;
    }
    
    if(newplatform){
        this.platforms.add(newplatform);
    }else{
        console.log("invalid platform " + plt.gid)
    }
}

/**
 * Use this to create bullets rather than using external code
 */
 
TmxLevel.prototype.createBullet = function(X, Y, type, friendly, dir){
    var newbullet;
    switch(type){

    }
    if(newbullet){
        this.bullets.add(newbullet);
    }
};

/**
 * Use this to create effects rather than using external code
 */

TmxLevel.prototype.createEffect = function(X, Y, type, friendly, dir){
    var neweffect;
    switch(type){
        case "spiderweb":
            neweffect = new EffSpiderWeb(X, Y);
            break;
    }
    //if(newbullet){
        this.effects.add(neweffect);
    //}
};

TmxLevel.prototype.createHitBox = function(X, Y, W, H, friendly, lifespan, seek, origin){
    var spr = new HitBox(game, X, Y, W, H, 'blanksprite', friendly, lifespan, origin);
    //spr.body.setSize(W, H, 0, 0);
    spr.renderable = true;
    //spr.visible = false;
    if(seek){
        this.hitboxes_seek.add(spr);
        return spr;
    }
    if(friendly){
        this.hitboxes_friendly.add(spr);
        //console.log("added?")
    }else{
        this.hitboxes_unfriendly.add(spr);
    }
    return spr;
};

TmxLevel.prototype.bloodExplosion = function(X, Y){
    for(var i = 0; i < 32; i++){
        var newblood = new Blood(X, Y);
        this.blood.add(newblood);
    }
};