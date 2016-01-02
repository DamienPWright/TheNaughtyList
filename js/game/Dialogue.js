/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function Dialogue(lines, avatar_path){
    this.lines = lines;
    this.complete = false;
    this.avatar_path = avatar_path;
}

Dialogue.prototype.getLine = function(index){
    if(index < this.lines.length){
        return this.lines[index];
    }else if(index == this.lines.length){
        this.complete = true;
    }else{
        console.log("Invalid index supplied to dialogue")
    }
    return "... ";
}