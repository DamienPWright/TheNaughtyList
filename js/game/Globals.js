//just to dump globals into really
HOR_RES = 800;
VER_RES = 600;

DIR_EAST = 0;
DIR_SOUTH = 1;
DIR_WEST = 2;
DIR_NORTH = 3;

current_level = 0;
levels = [
    {levelpath: "assets/maps/basementtest.json", tileset: 0},
    {levelpath: "assets/maps/hublevel.json", tileset: 1},
    {levelpath: "assets/maps/springtest.json", tileset: 1}
];

tilesets = [
    "assets/img/tilesets/basement.png",
    "assets/img/tilesets/hubtiles.png"
];

function getVelocityforTrajectory(ox, oy, tx, ty, a, g){
    var rx = tx - ox;
    var ry = ty - oy;
    var v = (Math.sqrt(g) * Math.sqrt(Math.abs(rx)) * Math.sqrt((Math.tan(a)*Math.tan(a)) + 1)) / Math.sqrt(Math.abs((2 * Math.tan(a)) - (2 * g * ry) / rx));
    return v;
}
