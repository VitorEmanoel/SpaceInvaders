var Game = {
    start : function(){
        this.canvas = document.getElementById("Game");
    }
};

function Entity(height, width, image){

    this.image = new Image(width, height);
    this.image.src = image;
    this.image.style.position = "absolute";
    this.height = height;
    this.width = width;
    this.context = Game.canvas.getContext("2d");
    this.x = 0;
    this.y = 0;

}

function startGame() {
    Game.start();
}