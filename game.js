let game = {
    width: 640,
    height: 360,
    ctx: undefined,
    platform: undefined,
    rows: 4,
    cols: 8,
    blocks: [],
    sprites:{
        background: undefined,
        platform: undefined,
        ball: undefined,
        rec: undefined, //blocks - rectangle
    },
   //----------------------------------
init: function(){
    let canvas = document.getElementById("gameCanvas");
    this.ctx = canvas.getContext("2d");
    
    window.addEventListener("keydown", function (e) {
        if (e.keyCode == 37) {
            game.platform.dx = -game.platform.speed
        } else if (e.keyCode == 39) {
            game.platform.dx = game.platform.speed
        } else if (e.keyCode == 32){
            game.platform.pushBall();
        }
        
    });
    window.addEventListener("keyup", function (e) {
            game.platform.stop();
    });
},

load: function(){
        for (let SpriteName in this.sprites){
            this.sprites[SpriteName] = new Image();
            this.sprites[SpriteName].src = `images/${SpriteName}.png`;
        }
        

},
create: function(){
        for (let row =0; row < this.rows; row++){
            for (let col = 0; col < this.cols; col++){
                this.blocks.push({
                    x: 68 * col + 50,
                    y: 38 * row + 32,
                    width: 64,
                    height: 32,
                    isAlive: true,
                });
            }
        }
},

 start: function () {
        this.init();
        this.load();
        this.create();
        this.run();
 },
    //----------------------------------
 render: function () {
        this.ctx.clearRect(0,0,this.width, this.height);
        this.ctx.drawImage(this.sprites.background, 0, 0); //Отрисовка бг по коорд. 0,0
        this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
        this.ctx.drawImage(this.sprites.ball, this.ball.x,this.ball.y );

        this.blocks.forEach(function (element) {
            if (element.isAlive){
            this.ctx.drawImage(this.sprites.rec, element.x, element.y );
            }
        }, this);

 },
    //----------------------------------
 update: function(){
     if (this.platform.dx){
         this.platform.move();
     }
     
     if (this.ball.dx || this.ball.dy) {
         this.ball.move();
     }

     this.blocks.forEach(function (element) {
         if (element.isAlive) {
             if (this.ball.collide(element)) {
                 this.ball.kickout(element);
             };
         };
     }, this);
     
 },

 run: function () {
        this.render();
        this.update();
         window.requestAnimationFrame(function () {
            game.run()
     }); //вывод на экран бг
     
 },

};
game.ball = {
    x: 340,
    y: 275,
    dx: 0,
    dy: 0,
    speed: 4,

    collide: function(element){
        let x = this.x + this.dx;
        let y = this.y + this.dy;
        if (x + this.width > element.x &&
            x < element.x + element.width &&
            y + this.height > element.y &&
            y< element.y + element.height){
            return true;
        }
        return false;
    },
    kickout: function(rec){
    this.dy += -1;
    rec.isAlive = false;
    },


    jump: function () {
        this.dx = -this.speed;
        this.dy = -this.speed;

    },

    move: function () {
        this.x += this.dx;
        this.y += this.dy;

    }
};


game.platform = {
    x: 300,
    y: 300,
    speed: 6,
    dx: 0,
    ball: game.ball,
    move: function () {
        this.x += this.dx;

        if (this.ball){
            this.ball.x += this.dx;
        }

    },

    stop: function () {
        this.dx = 0;

        if (this.ball){
            this.ball.dx = 0;
        }

    },

    pushBall: function () {
        if(this.ball){
            this.ball.jump();
            this.ball = false;
        }
    }
};

window.addEventListener("load", function () {
    game.start();
});
