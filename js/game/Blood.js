function Blood(X, Y){
    Phaser.Sprite.call(this, game, X, Y, 'blood');
    game.physics.arcade.enable(this);
    //pick random direction and sprite
    var randomFrame = Math.round(Math.random()* 7);
    var randomDir = 0 - Math.random() * 2;
    var speed = 500;
    var randomX = Math.random() * 8;
    var randomY = Math.random() * 8;
    this.x += 4 - randomX;
    this.y += 4 - randomY;
    this.body.bounce.set(0.8);
    this.body.drag.setTo(50, 50);
    this.frame = randomFrame;
    console.log(speed + " " + randomDir);
    this.body.velocity.x = speed * Math.cos(randomDir * Math.PI);
    this.body.velocity.y = speed * Math.sin(randomDir * Math.PI);
}

Blood.prototype = Object.create(Phaser.Sprite.prototype);
Blood.prototype.constructor = Blood;