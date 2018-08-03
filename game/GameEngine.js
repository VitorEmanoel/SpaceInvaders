var Ship;
var Invaders = new Array(3);

var Game = {
    canvas : document.createElement('canvas'),
    start : function(){
        this.canvas.width = 810;
        this.canvas.height = 600;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        Ship = new Entity(60, 32, "./assets/images/Ship.png");
        Ship.move(this.canvas.width/2 -  Ship.width/2, this.canvas.height - Ship.height);
        
        for(var i = 0; i < 13; i++){
            Invaders[i] = new Array(10);
            for(var j = 0; j < 6; j++){
                Invaders[i][j] = new Entity(48, 32, "./assets/images/Invader" +Math.floor((Math.random() * 6) + 1) + ".png");
                Invaders[i][j].move(30 * i - 1 + Invaders[i][j].width * i + 10, Invaders[i][j].height * j + 5);
            }
        }
    }
};

function Entity(height, width, src){

    const self = this;
    this.height = height;
    this.width = width;
    this.x = 0;
    this.y = 0;
    this.image = new Image();
    this.image.src = src;
    this.image.style.padding = '10px';
    this.image.addEventListener('load', function(){
        Game.context.drawImage(self.image, self.x, self.y);
    });

    this.move = function(x, y){
        self.y = y;
        self.x = x;
        Game.context.clearRect(self.x, self.y, self.x + self.width, self.y + self.height);
        Game.context.drawImage(self.image, self.x, self.y);
    }
}

function startGame() {
    Game.start();
}