let game = {
    width: 640,
    height: 360,
    ctx: undefined,
    platform: undefined,
    running: true,
    totalScore: 0,
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


        this.blocks.forEach(function (element) {
            if (element.isAlive){
            this.ctx.drawImage(this.sprites.rec, element.x, element.y );
            }
        }, this);

        this.ctx.drawImage(this.sprites.ball, this.ball.x,this.ball.y );
 },
    //----------------------------------
 update: function(){
     if (this.platform.dx){
         this.platform.move();
     };

     if (this.ball.dx || this.ball.dy) {
         this.ball.move();
     };



     this.blocks.forEach(function (element) {
         if (element.isAlive) {
             if (this.ball.collide(element)) {
                 this.ball.kickout(element);
                 this.totalScore +=1;

                 if (game.totalScore >= game.blocks.length){
                     game.over()
                 }
             };
         };
     }, this);

    this.ball.sideCheck();


           if (this.ball.collide2(game.platform)){
               this.ball.bumpPlatform(game.platform)
               };


 },

 run: function () {
        this.render();
        this.update();

        if (this.running){

            window.requestAnimationFrame(function () {
                game.run()
            }); //вывод на экран бг
        }
     
 },

//    get_cookies_array: function () {
//
//    var cookies = { };
//
//    if (document.cookie && document.cookie != '') {
//        var split = document.cookie.split(';');
//        for (var i = 0; i < split.length; i++) {
//            var name_value = split[i].split("=");
//            name_value[0] = name_value[0].replace(/^ /, '');
//            cookies[decodeURIComponent(name_value[0])] = decodeURIComponent(name_value[1]);
//        }
//    }
//
//    return cookies;
//
//},

    over: function () {

        console.log("Game Over");
        this.running = false;
        alert(`Игра окончена, вы разрушили ${this.totalScore} блоков. `);
        PlayerName = prompt('Введите ваше имя, для добавления в таблицу рекордов ', 100);
        document.cookie = PlayerName+"="+this.totalScore+"; path=/";
        let leaderScore = document.getElementById("scoreTable").getElementsByTagName('TBODY')[0];
        let row = document.createElement("TR");
        leaderScore.appendChild(row);
        var td1 = document.createElement("TD");
        var td2 = document.createElement("TD");
        row.appendChild(td1);
        row.appendChild(td2);
        td1.innerHTML = PlayerName;
        td2.innerHTML = this.totalScore;


    },


};
game.ball = {
    x: 340,
    y: 270,
    dx: 0,
    dy: 0,
    speed: 2,
    height: 22,
    width: 22,
   // rised: false,

    platfromCollide: function(element){
        let x = this.x + this.dx;
        let y = this.y + this.dy;
        
        if (x + this.width > element.x &&
        x < element.x + element.width &&
        y + this.height > element.y &&
        y < element.y + element.height

        ) {
            return true;
        }
        return false;
    },

    collide2: function(element){
        let x = this.x + this.dx;
        let y = this.y + this.dy;

        if ((element.x < x)&&(x < element.x + element.width)){
            if (y > element.y - element.height){
                console.log('Platform collide');
                return true;
            }
        }else
            return false
        },

    collide: function(element){
        let x = this.x + this.dx;
        let y = this.y + this.dy;
  //     console.log('-----------------');
  //     console.log(element.x + element.width);//250

  //     console.log(x);//340
  //     console.log('-----------------');


        if (
            x < element.x + element.width &&

            y < element.y + element.height){

            console.log('Collide');
            return (true);
        } else {
        return (false);
        }
    },
    kickout: function(rec){
        this.dy *= -1;
        rec.isAlive = false;
        console.log('Touched dy * -1');

        },


    jump: function () {
        this.dx = -this.speed;
        this.dy = -this.speed;

    },

    move: function () {
        this.x += this.dx;
        this.y += this.dy;


    },

    onTheLeftSide: function(platform){
        console.log("------");
        console.log(this.x);
        console.log(this.width);
        console.log(this.x + this.width / 2);
        console.log(platform.x + platform.width / 2);
       return  (this.x + this.width / 2) < (platform.x + platform.width / 2);


    },

    bumpPlatform: function(platform){
        this.dy = -this.speed;
        this.dx = this.onTheLeftSide(platform) ? -this.speed : this.speed;
    },

    sideCheck: function () {
        let x = this.x + this.dx;
        let y = this.y + this.dy;
        let xwidth = x + this.width;
        
        if (x < 0) {
            this.x = 0;
            this.dx = this.speed;
        } else if ( xwidth > game.width){
            this.x = game.width - this.width;
            this.dx = -this.speed;
        } else if (y < 0) {
            this.y = 0;
            this.dy = this.speed;
        } else if ( y + this.height > game.height){
            game.over();
            //Game over (bottom side)
        }
    }
};


game.platform = {
    x: 300,
    y: 300,
    speed: 8,
    dx: 0,
    ball: game.ball,
    width: 104,
    height:24,
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
            //game.ball.rised = true;
        }
    }
};

window.addEventListener("load", function () {
    game.start();
});
