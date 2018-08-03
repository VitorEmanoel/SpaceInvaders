var invaders = new Array(6);
var ship;
var projectile;
var projectileInterval;
function startGame() {
    Game.start();
}

document.addEventListener('keydown', function(event){
    var key = event.keyCode;
    if(key == 39 && Game.playing){
        ship.direita();
    }else if(key == 37 && Game.playing){
        ship.esquerda();
    }else if(key == 38 && Game.playing){
        ship.shoot();
    }
});

var Game = {
    canvas : document.createElement('canvas'),
    playing : true,
    shipSpeed : 10,
    projectileSpeed : 1,
    start : function(){
        this.canvas.width = 810;
        this.canvas.height = 600;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        ship = new Ship(60, 32, "./assets/images/Ship.png");
        ship.move(this.canvas.width/2 -  ship.width/2, this.canvas.height - ship.height);
        
        for(var i = 0; i < 6; i++){
            invaders[i] = new Array(13);
            for(var j = 0; j < 13; j++){
                invaders[i][j] = new Invader(48, 32, "./assets/images/Invader" +Math.floor((Math.random() * 6) + 1) + ".png", i, j);
                invaders[i][j].move(30 * j - 1 + invaders[i][j].width * j + 10, invaders[i][j].height * i + 5);
            }
        }
    },
    clear : function(){
        this.context.clearRect(0, 0, 810, 600);
    },
};

class Entity{

    constructor(height, width, src){
        const self = this;
        this.height = height;
        this.width = width;
        this.x = 0;
        this.y = 0;
        this.image = new Image();
        this.image.src = src;
        this.image.addEventListener('load', function(){
            Game.context.drawImage(self.image, self.x, self.y);
        });
    }

    move(x, y){
        Game.context.clearRect(this.x, this.y, this.x + this.width, this.y + this.height);
        this.y = y;
        this.x = x;
        Game.context.drawImage(this.image, this.x, this.y);
    }

    clear(){
        Game.context.clearRect(this.x, this.y, this.x + this.width, this.y + this.height);
    }
}

class Invader extends Entity{

    constructor(height, width, src, column, row){
        super(height, width, src);
        this.row = row;
        this.column = column;
    }
}

class Ship extends Entity{

    constructor(height, width, src){
        super(height, width, src);
    }

    esquerda(){
        var total = this.x - Game.shipSpeed;
        if(total > 9)
            this.move(total, this.y);

    }

    direita(){
        var total = this.x + Game.shipSpeed;
        if(total < 749)
            this.move(total, this.y);
    }

    shoot(){
        if(projectile == undefined){
            projectile = new Projectile(6, 17, "./assets/images/Bullet.png", this.x, this.y);
            projectileInterval = setInterval(projectile.shootMove(projectile), 30);
        }
    }

}

class Projectile extends Entity{

    constructor(width, height, src, x, y){
        super(height, width, src);
        this.x = x;
        this.y = y;
    }

    overlaps(){
        for(var i = 0; i < 6; i++){
            for(var j = 0; j < 13; j++){
                var invader = invaders[i][j];
                if((invader.x >= this.x || invader.x <= this.x + this.width) && this.y == invader.y && invader != undefined){
                    return invader;
                }
            }
        }
        return undefined;
    }

    shootMove(self){
        var total = this.y - Game.projectileSpeed;
        if(total == 0){
            clearInterval(projectileInterval);
            projectile.clear();
            projectile = undefined;
            return;
        }
        var overlap = self.overlaps();
        if(overlap != undefined){
            clearInterval(Game.projectileInterval);
            projectile.clear();
            projectile = undefined;
            invaders[overlap.column][overlap.row] = undefined;
            return;
        }
        super.move(this.x, total);

    }

}