/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function EffSwordSpecial01(X, Y, scaleX){
    Effect.call(this, X, Y, "eff_swordspecial01", 1000, scaleX);
    
    this.animations.add('a', [0,1,2,3], 24, false);
    this.animations.play('a');
}

EffSwordSpecial01.prototype = Object.create(Effect.prototype);
EffSwordSpecial01.prototype.constructor = EffSwordSpecial01;