/*

    * SpaceInvaders criado por VitorEmanoel
    * Github: github.com/VitorEmanoel
    * Assets por DamirSvrtan
    * Github: github.com/DamirSvrtan

*/
var invaders = new Array(6);
var ship;
var projectile;

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
    invadersXMoveSpeed : 1,
    invadersYMoveSpeed : 32,
    next : false,
    start : function(){
        this.canvas.width = 810;
        this.canvas.height = 600;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        ship = new Ship(60, 32, "./assets/images/Ship.png");
        ship.move(this.canvas.width/2 -  ship.width/2, this.canvas.height - ship.height);
        this.projectileAudio = new Audio("./assets/sounds/ShipBullet.wav");
        this.InvaderDeadAudio = new Audio("./assets/sounds/InvaderHit.wav");

        for(var i = 0; i < 6; i++){
            invaders[i] = new Array(13);
            for(var j = 0; j < 6; j++){
                invaders[i][j] = new Invader(48, 32, "./assets/images/Invader" +Math.floor((Math.random() * 6) + 1) + ".png", i, j);
                invaders[i][j].move(80 * j - 1 + invaders[i][j].width * j + 60, 10 * i - 1 + invaders[i][j].height * i + 5);
            }
        }
        this.renderInterval = setInterval(this.render, 33.3333333333);
    },

    render : function(){
        if(!Game.playing){
            return;
        }
        Game.context.clearRect(0, 0, 810, 600);
        if(projectile != undefined){
            if(projectile.y <= 0){
                console.log("Chegou no alto");
                projectile.clear();
                projectile = undefined;
            }else{
                projectile.move(projectile.x, projectile.y - 15);
                Game.context.drawImage(projectile.image, projectile.x, projectile.y);
            }
        }
        var lastInvader = Game.getLastInvader();
        var firstInvader = Game.getFirstInvader();
        if(lastInvader.x + lastInvader.width >= 810){
            Game.invadersXMoveSpeed *= -1;
        }else if(firstInvader.x <= 0){
            Game.invadersXMoveSpeed *= -1;
            Game.next = true;
        }
        for(var i = 0; i < 6; i++){
            for(var j = 0; j < 6; j++){
                var invader = invaders[i][j];
                if(projectile != undefined){
                    if(invader.overlaps(projectile) && !invader.dead){
                        projectile.clear()
                        projectile = undefined;
                        invader.dead = true;
                        Game.invadersXMoveSpeed += 1;
                        Game.InvaderDeadAudio.play();
                    }
                }
                if(!invader.dead){
                    var moveX = invader.x + Game.invadersXMoveSpeed;
                    var moveY = invader.y;
                    if(Game.next){
                        moveY += Game.invadersYMoveSpeed;
                    }
                    invader.move(moveX, moveY);
                    Game.context.drawImage(invader.image, invader.x, invader.y);
                }
            }
        }
        Game.next = false;
        Game.context.drawImage(ship.image, ship.x, ship.y);
        lastInvader = Game.getLastInvader();
        if(lastInvader.y + lastInvader.height >= ship.y){
            Game.playing = false;
        }
    },
    getFirstInvader : function(){
        for(var i = 0; i < 6; i++){
            for(var j = 0; j < 6; j++){
                var invader = invaders[i][j];
                if(!invader.dead){
                    return invader;
                }
            }
        }
    },
    getLastInvader : function(){
        for(var i = 5; i >= 0; i--){
            for(var j = 5; j >= 0; j--){
                var invader = invaders[i][j];
                if(!invader.dead){
                    return invader;
                }

            }
        }
    }
};

class Entity{

    constructor(width, height, src){
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
        this.y = y;
        this.x = x;
    }

    clear(){
        Game.context.clearRect(this.x, this.y, this.x + this.width, this.y + this.height);
    }

    overlaps(outher){
        return (this.x < outher.x + outher.width && this.x + this.width > outher.x && this.y < outher.y + outher.height && this.height + this.y > outher.y);
    }
}

class Invader extends Entity{

    constructor(height, width, src, row, column){
        super(height, width, src);
        this.row = row;
        this.dead = false;
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
            console.log("saiu");
            projectile = new Projectile(6, 17, "./assets/images/Bullet.png", this.x + this.width/2 - 3, this.y);
            Game.projectileAudio.play();
        }
    }
}

class Projectile extends Entity{

    constructor(width, height, src, x, y){
        super(height, width, src);
        this.x = x;
        this.y = y;
    }
}
