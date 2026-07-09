"use strict";

/* ==========================================
   CANVAS
========================================== */

const canvas =
document.getElementById(
    "gameCanvas"
);

const ctx =
canvas.getContext("2d");

/* ==========================================
   DOM
========================================== */

const startScreen =
document.getElementById(
    "startScreen"
);

const gameContainer =
document.getElementById(
    "gameContainer"
);

const pauseMenu =
document.getElementById(
    "pauseMenu"
);

const gameOverScreen =
document.getElementById(
    "gameOverScreen"
);

const startBtn =
document.getElementById(
    "startBtn"
);

const fullscreenBtn =
document.getElementById(
    "fullscreenBtn"
);

const pauseBtn =
document.getElementById(
    "pauseBtn"
);

const resumeBtn =
document.getElementById(
    "resumeBtn"
);

const restartBtnPause =
document.getElementById(
    "restartBtnPause"
);

const playAgainBtn =
document.getElementById(
    "playAgainBtn"
);

const mainMenuBtn =
document.getElementById(
    "mainMenuBtn"
);

const jumpBtn =
document.getElementById(
    "jumpBtn"
);

const duckBtn =
document.getElementById(
    "duckBtn"
);

const scoreEl =
document.getElementById(
    "score"
);

const highScoreEl =
document.getElementById(
    "highScore"
);

const distanceEl =
document.getElementById(
    "distance"
);

const speedLevelEl =
document.getElementById(
    "speedLevel"
);

const finalScoreEl =
document.getElementById(
    "finalScore"
);

const finalHighScoreEl =
document.getElementById(
    "finalHighScore"
);

const finalDistanceEl =
document.getElementById(
    "finalDistance"
);

const menuHighScore =
document.getElementById(
    "menuHighScore"
);

const achievementToast =
document.getElementById(
    "achievementToast"
);

/* ==========================================
   CANVAS RESIZE
========================================== */

let WIDTH =
window.innerWidth;

let HEIGHT =
window.innerHeight;

function resizeCanvas(){

    WIDTH =
    window.innerWidth;

    HEIGHT =
    window.innerHeight;

    canvas.width =
    WIDTH;

    canvas.height =
    HEIGHT;
}

window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();

/* ==========================================
   DYNAMIC FAVICON
========================================== */

function createFavicon(){

    const c =
    document.createElement(
        "canvas"
    );

    c.width = 64;
    c.height = 64;

    const x =
    c.getContext("2d");

    x.fillStyle =
    "#22c55e";

    x.beginPath();

    x.arc(
        32,
        32,
        30,
        0,
        Math.PI*2
    );

    x.fill();

    x.font =
    "36px serif";

    x.textAlign =
    "center";

    x.textBaseline =
    "middle";

    x.fillText(
        "🦖",
        32,
        35
    );

    document
        .getElementById(
            "favicon"
        )
        .href =
        c.toDataURL();
}

createFavicon();

/* ==========================================
   STORAGE
========================================== */

let highScore =
parseInt(
    localStorage.getItem(
        "dinoNightHighScore"
    )
) || 0;

menuHighScore.textContent =
highScore;

/* ==========================================
   GAME STATE
========================================== */

const game = {

    running:false,

    paused:false,

    over:false,

    score:0,

    distance:0,

    speed:8,

    gravity:.85,

    frame:0,

    coins:0,

    achievements:[],

    groundY:0
};

/* ==========================================
   HELPERS
========================================== */

function random(min,max){

    return Math.random() *
    (max-min) + min;
}

function randomInt(min,max){

    return Math.floor(
        random(min,max)
    );
}

function clamp(
    value,
    min,
    max
){

    return Math.max(
        min,
        Math.min(
            max,
            value
        )
    );
}

function rectCollision(a,b){

    return (

        a.x <
        b.x+b.width &&

        a.x+a.width >
        b.x &&

        a.y <
        b.y+b.height &&

        a.y+a.height >
        b.y
    );
}

/* ==========================================
   ACHIEVEMENTS
========================================== */

const achievementData = {

    firstJump:
    "First Jump",

    score100:
    "Score 100",

    score500:
    "Score 500",

    score1000:
    "Score 1000",

    collector:
    "Collector",

    survivor:
    "Survivor",

    speedMaster:
    "Speed Master"
};

function unlockAchievement(id){

    if(
        game.achievements
        .includes(id)
    ) return;

    game.achievements.push(
        id
    );

    achievementToast.textContent =
    achievementData[id];

    achievementToast.classList.add(
        "show"
    );

    setTimeout(()=>{

        achievementToast.classList.remove(
            "show"
        );

    },2500);
}

/* ==========================================
   PARTICLES
========================================== */

const particles = [];

class Particle{

    constructor(
        x,
        y,
        color
    ){

        this.x=x;
        this.y=y;

        this.vx=
        random(-3,3);

        this.vy=
        random(-5,-1);

        this.life=1;

        this.size=
        random(2,5);

        this.color=color;
    }

    update(){

        this.x+=this.vx;

        this.y+=this.vy;

        this.vy+=0.15;

        this.life-=0.02;
    }

    draw(){

        ctx.globalAlpha=
        this.life;

        ctx.fillStyle=
        this.color;

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI*2
        );

        ctx.fill();

        ctx.globalAlpha=1;
    }
}

function createDust(x,y){

    for(
        let i=0;
        i<10;
        i++
    ){

        particles.push(

            new Particle(
                x,
                y,
                "#c4b5fd"
            )
        );
    }
}

/* ==========================================
   DINO
========================================== */

class Dino{

    constructor(){

        this.width=70;

        this.height=75;

        this.x=120;

        this.y=0;

        this.vy=0;

        this.grounded=true;

        this.ducking=false;

        this.runFrame=0;

        this.jumpCount=0;
    }

    reset(){

        this.y=
        game.groundY-
        this.height;

        this.vy=0;

        this.grounded=true;

        this.ducking=false;
    }

    jump(){

        if(
            !this.grounded
        ) return;

        this.vy=-17;

        this.grounded=false;

        createDust(
            this.x,
            this.y+
            this.height
        );

        this.jumpCount++;

        if(
            this.jumpCount===1
        ){

            unlockAchievement(
                "firstJump"
            );
        }
    }

    duck(active){

        this.ducking=
        active;

        if(active){

            this.height=45;

        }else{

            this.height=75;
        }
    }

    update(){

        this.vy +=
        game.gravity;

        this.y +=
        this.vy;

        const floor =
        game.groundY -
        this.height;

        if(
            this.y >= floor
        ){

            this.y=floor;

            this.vy=0;

            this.grounded=true;
        }

        this.runFrame+=0.25;
    }

    draw(){

        const legMove =
        Math.sin(
            this.runFrame
        )*6;

        ctx.save();

        ctx.translate(
            this.x,
            this.y
        );

        ctx.shadowColor=
        "#22c55e";

        ctx.shadowBlur=18;

        ctx.fillStyle=
        "#22c55e";

        /* Tail */

        ctx.beginPath();

        ctx.moveTo(5,40);
        ctx.lineTo(-25,20);
        ctx.lineTo(0,55);

        ctx.fill();

        /* Body */

        ctx.beginPath();

        ctx.roundRect(
            0,
            15,
            65,
            45,
            20
        );

        ctx.fill();

        /* Neck */

        ctx.fillRect(
            45,
            0,
            18,
            25
        );

        /* Head */

        ctx.beginPath();

        ctx.roundRect(
            35,
            -5,
            40,
            28,
            12
        );

        ctx.fill();

        /* Eye */

        ctx.fillStyle="#111";

        ctx.beginPath();

        ctx.arc(
            60,
            8,
            3,
            0,
            Math.PI*2
        );

        ctx.fill();

        /* Legs */

        ctx.fillStyle=
        "#16a34a";

        ctx.fillRect(
            12,
            55,
            10,
            20+legMove
        );

        ctx.fillRect(
            42,
            55,
            10,
            20-legMove
        );

        ctx.restore();
    }

    get hitbox(){

        return {

            x:this.x+5,

            y:this.y+5,

            width:
            this.width-10,

            height:
            this.height-8
        };
    }
}

const dino =
new Dino();

/* ==========================================
   GROUND
========================================== */

function updateGround(){

    game.groundY =
    HEIGHT - 120;
}

updateGround();

dino.reset();

/* ==========================================
   OBSTACLES
========================================== */

const obstacles = [];

class Obstacle{

    constructor(type){

        this.type = type;

        this.x = WIDTH + 100;

        this.passed = false;

        switch(type){

            case "smallCactus":

                this.width = 35;
                this.height = 60;

                this.y =
                game.groundY -
                this.height;

            break;

            case "largeCactus":

                this.width = 55;
                this.height = 95;

                this.y =
                game.groundY -
                this.height;

            break;

            case "rock":

                this.width = 50;
                this.height = 40;

                this.y =
                game.groundY -
                this.height;

            break;

            case "crate":

                this.width = 55;
                this.height = 55;

                this.y =
                game.groundY -
                this.height;

            break;

            case "log":

                this.width = 90;
                this.height = 35;

                this.y =
                game.groundY -
                this.height;

            break;

            case "bird":

                this.width = 60;
                this.height = 30;

                this.y =
                game.groundY -
                randomInt(140,230);

            break;
        }
    }

    update(){

        this.x -= game.speed;
    }

    draw(){

        ctx.save();

        /* Cactus */

        if(
            this.type==="smallCactus" ||
            this.type==="largeCactus"
        ){

            ctx.fillStyle="#22c55e";

            ctx.beginPath();

            ctx.roundRect(
                this.x,
                this.y,
                this.width,
                this.height,
                10
            );

            ctx.fill();

            ctx.fillRect(
                this.x-8,
                this.y+20,
                12,
                12
            );

            ctx.fillRect(
                this.x+
                this.width-4,
                this.y+30,
                12,
                12
            );
        }

        /* Rock */

        else if(
            this.type==="rock"
        ){

            ctx.fillStyle="#71717a";

            ctx.beginPath();

            ctx.ellipse(
                this.x+25,
                this.y+18,
                25,
                18,
                0,
                0,
                Math.PI*2
            );

            ctx.fill();

            ctx.fillStyle="#a1a1aa";

            ctx.beginPath();

            ctx.arc(
                this.x+15,
                this.y+12,
                5,
                0,
                Math.PI*2
            );

            ctx.fill();
        }

        /* Crate */

        else if(
            this.type==="crate"
        ){

            ctx.fillStyle="#a16207";

            ctx.fillRect(
                this.x,
                this.y,
                this.width,
                this.height
            );

            ctx.strokeStyle="#78350f";

            ctx.lineWidth=3;

            ctx.strokeRect(
                this.x,
                this.y,
                this.width,
                this.height
            );

            ctx.beginPath();

            ctx.moveTo(
                this.x,
                this.y
            );

            ctx.lineTo(
                this.x+this.width,
                this.y+this.height
            );

            ctx.stroke();

            ctx.beginPath();

            ctx.moveTo(
                this.x+this.width,
                this.y
            );

            ctx.lineTo(
                this.x,
                this.y+this.height
            );

            ctx.stroke();
        }

        /* Log */

        else if(
            this.type==="log"
        ){

            ctx.fillStyle="#92400e";

            ctx.beginPath();

            ctx.roundRect(
                this.x,
                this.y,
                this.width,
                this.height,
                20
            );

            ctx.fill();

            ctx.strokeStyle="#78350f";

            ctx.beginPath();

            ctx.arc(
                this.x+10,
                this.y+
                this.height/2,
                8,
                0,
                Math.PI*2
            );

            ctx.stroke();
        }

        /* Bird */

        else if(
            this.type==="bird"
        ){

            const flap =
            Math.sin(
                game.frame*0.4
            )*8;

            ctx.fillStyle="#facc15";

            ctx.beginPath();

            ctx.ellipse(
                this.x,
                this.y,
                18,
                12,
                0,
                0,
                Math.PI*2
            );

            ctx.fill();

            ctx.strokeStyle="#fde047";

            ctx.lineWidth=4;

            ctx.beginPath();

            ctx.moveTo(
                this.x-15,
                this.y
            );

            ctx.lineTo(
                this.x-30,
                this.y-flap
            );

            ctx.moveTo(
                this.x+15,
                this.y
            );

            ctx.lineTo(
                this.x+30,
                this.y-flap
            );

            ctx.stroke();
        }

        ctx.restore();
    }

    get hitbox(){

        return{

            x:this.x,
            y:this.y,

            width:this.width,
            height:this.height
        };
    }
}

/* ==========================================
   OBSTACLE SPAWNING
========================================== */

const obstacleTypes = [

    "smallCactus",
    "largeCactus",
    "rock",
    "crate",
    "log",
    "bird"
];

let obstacleTimer = 0;

function spawnObstacle(){

    const type =
    obstacleTypes[
        randomInt(
            0,
            obstacleTypes.length
        )
    ];

    obstacles.push(
        new Obstacle(type)
    );
}

function updateObstacles(){

    obstacleTimer--;

    const gap =
    clamp(
        140 -
        game.speed*4,
        60,
        140
    );

    if(
        obstacleTimer <= 0
    ){

        spawnObstacle();

        obstacleTimer =
        randomInt(
            gap,
            gap+80
        );
    }

    for(
        let i=
        obstacles.length-1;
        i>=0;
        i--
    ){

        const obstacle =
        obstacles[i];

        obstacle.update();

        if(

            rectCollision(
                dino.hitbox,
                obstacle.hitbox
            )

        ){

            gameOver();

            return;
        }

        if(
            !obstacle.passed &&
            obstacle.x < dino.x
        ){

            obstacle.passed = true;

            addScore(10);
        }

        if(
            obstacle.x +
            obstacle.width < -100
        ){

            obstacles.splice(i,1);
        }
    }
}

/* ==========================================
   COINS
========================================== */

const coins = [];

class Coin{

    constructor(){

        this.x =
        WIDTH + 100;

        this.y =
        randomInt(
            game.groundY - 260,
            game.groundY - 90
        );

        this.angle = 0;
    }

    update(){

        this.x -= game.speed;

        this.angle += .15;
    }

    draw(){

        ctx.save();

        ctx.translate(
            this.x,
            this.y
        );

        ctx.rotate(
            this.angle
        );

        ctx.shadowColor=
        "#facc15";

        ctx.shadowBlur=15;

        ctx.fillStyle=
        "#facc15";

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            12,
            0,
            Math.PI*2
        );

        ctx.fill();

        ctx.fillStyle="#fff";

        ctx.font=
        "bold 12px Arial";

        ctx.fillText(
            "$",
            -4,
            4
        );

        ctx.restore();
    }

    get hitbox(){

        return{

            x:this.x-12,
            y:this.y-12,
            width:24,
            height:24
        };
    }
}

let coinTimer = 120;

function updateCoins(){

    coinTimer--;

    if(
        coinTimer <= 0
    ){

        coins.push(
            new Coin()
        );

        coinTimer =
        randomInt(
            120,
            220
        );
    }

    for(
        let i=
        coins.length-1;
        i>=0;
        i--
    ){

        const coin =
        coins[i];

        coin.update();

        if(

            rectCollision(
                dino.hitbox,
                coin.hitbox
            )

        ){

            game.coins++;

            addScore(5);

            createDust(
                coin.x,
                coin.y
            );

            coins.splice(i,1);

            if(
                game.coins>=50
            ){

                unlockAchievement(
                    "collector"
                );
            }

            continue;
        }

        if(
            coin.x < -50
        ){

            coins.splice(i,1);
        }
    }
}

/* ==========================================
   SCORE
========================================== */

function addScore(value){

    game.score += value;

    if(
        game.score>=100
    ){

        unlockAchievement(
            "score100"
        );
    }

    if(
        game.score>=500
    ){

        unlockAchievement(
            "score500"
        );
    }

    if(
        game.score>=1000
    ){

        unlockAchievement(
            "score1000"
        );
    }
}

/* ==========================================
   HUD
========================================== */

function updateHUD(){

    scoreEl.textContent =
    Math.floor(
        game.score
    );

    distanceEl.textContent =
    Math.floor(
        game.distance
    )+"m";

    speedLevelEl.textContent =
    Math.floor(
        game.speed
    );

    highScoreEl.textContent =
    highScore;
}

/* ==========================================
   DIFFICULTY
========================================== */

function updateDifficulty(){

    game.speed +=
    0.0008;

    if(
        game.speed >= 15
    ){

        unlockAchievement(
            "speedMaster"
        );
    }

    if(
        game.distance >= 5000
    ){

        unlockAchievement(
            "survivor"
        );
    }
}

/* ==========================================
   GROUND
========================================== */

let groundOffset = 0;

function drawGround(){

    groundOffset -= game.speed;

    if(
        groundOffset <= -60
    ){
        groundOffset = 0;
    }

    ctx.fillStyle =
    "#0f172a";

    ctx.fillRect(
        0,
        game.groundY,
        WIDTH,
        HEIGHT
    );

    ctx.fillStyle =
    "#22c55e";

    ctx.fillRect(
        0,
        game.groundY,
        WIDTH,
        5
    );

    ctx.strokeStyle =
    "rgba(34,197,94,.4)";

    for(
        let x = groundOffset;
        x < WIDTH;
        x += 60
    ){

        ctx.beginPath();

        ctx.moveTo(
            x,
            game.groundY+12
        );

        ctx.lineTo(
            x+25,
            game.groundY+12
        );

        ctx.stroke();
    }
}

/* ==========================================
   FIREFLIES
========================================== */

function drawFireflies(){

    for(
        let i=0;
        i<20;
        i++
    ){

        ctx.fillStyle =
        "rgba(255,255,180,.6)";

        ctx.beginPath();

        ctx.arc(

            (
                i*180 +
                game.frame*2
            ) % WIDTH,

            100 +
            Math.sin(
                i +
                game.frame*0.03
            )*40,

            2,

            0,
            Math.PI*2
        );

        ctx.fill();
    }
}

/* ==========================================
   WORLD DRAW
========================================== */

function drawWorld(){

    ctx.clearRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );

    drawFireflies();

    drawGround();

    for(
        const coin of coins
    ){
        coin.draw();
    }

    for(
        const obstacle
        of obstacles
    ){
        obstacle.draw();
    }

    dino.draw();

    for(
        const particle
        of particles
    ){
        particle.draw();
    }
}

/* ==========================================
   UPDATE
========================================== */

function updateParticles(){

    for(
        let i=
        particles.length-1;
        i>=0;
        i--
    ){

        particles[i]
        .update();

        if(
            particles[i]
            .life <= 0
        ){

            particles.splice(
                i,
                1
            );
        }
    }
}

function updateGame(){

    game.frame++;

    game.distance +=
    game.speed * .1;

    game.score += .08;

    dino.update();

    updateDifficulty();

    updateObstacles();

    updateCoins();

    updateParticles();

    updateHUD();
}

/* ==========================================
   GAME OVER
========================================== */

function gameOver(){

    if(
        game.over
    ) return;

    game.over = true;

    game.running = false;

    if(
        game.score >
        highScore
    ){

        highScore =
        Math.floor(
            game.score
        );

        localStorage.setItem(

            "dinoNightHighScore",

            highScore
        );
    }

    finalScoreEl.textContent =
    Math.floor(
        game.score
    );

    finalHighScoreEl.textContent =
    highScore;

    finalDistanceEl.textContent =
    Math.floor(
        game.distance
    ) + "m";

    document
    .getElementById(
        "finalCoins"
    )
    .textContent =
    game.coins;

    gameOverScreen
    .classList
    .add("active");
}

/* ==========================================
   RESET
========================================== */

function resetGame(){

    obstacles.length = 0;

    coins.length = 0;

    particles.length = 0;

    game.score = 0;

    game.distance = 0;

    game.speed = 8;

    game.frame = 0;

    game.coins = 0;

    game.over = false;

    game.paused = false;

    game.running = true;

    game.achievements = [];

    dino.reset();

    updateHUD();
}

/* ==========================================
   START
========================================== */

function startGame(){

    startScreen
    .classList
    .remove(
        "active"
    );

    gameOverScreen
    .classList
    .remove(
        "active"
    );

    pauseMenu
    .classList
    .remove(
        "active"
    );

    gameContainer
    .style.display =
    "block";

    resetGame();
}

/* ==========================================
   PAUSE
========================================== */

function pauseGame(){

    if(
        !game.running
    ) return;

    game.paused = true;

    pauseMenu
    .classList
    .add(
        "active"
    );
}

function resumeGame(){

    game.paused = false;

    pauseMenu
    .classList
    .remove(
        "active"
    );
}

/* ==========================================
   LOOP
========================================== */

function gameLoop(){

    requestAnimationFrame(
        gameLoop
    );

    if(
        !game.running
    ) return;

    if(
        game.paused
    ) return;

    updateGame();

    drawWorld();
}

gameLoop();

/* ==========================================
   CONTROLS
========================================== */

window.addEventListener(

    "keydown",

    e=>{

        if(
            e.code==="ArrowUp" ||
            e.code==="Space"
        ){

            dino.jump();
        }

        if(
            e.code==="ArrowDown"
        ){

            dino.duck(
                true
            );
        }

        if(
            e.key==="p" ||
            e.key==="P"
        ){

            if(
                game.paused
            ){

                resumeGame();

            }else{

                pauseGame();
            }
        }
    }
);

window.addEventListener(

    "keyup",

    e=>{

        if(
            e.code==="ArrowDown"
        ){

            dino.duck(
                false
            );
        }
    }
);

/* ==========================================
   MOBILE & TOUCH CONTROLS
========================================== */

function handleJump(e){

    e.preventDefault();

    if(
        game.running &&
        !game.paused &&
        !game.over
    ){
        dino.jump();
    }
}

function handleDuckStart(e){

    e.preventDefault();

    if(
        game.running &&
        !game.paused &&
        !game.over
    ){
        dino.duck(true);
    }
}

function handleDuckEnd(e){

    e.preventDefault();

    dino.duck(false);
}

/* Jump Button */

jumpBtn.addEventListener(
    "pointerdown",
    handleJump
);

jumpBtn.addEventListener(
    "touchstart",
    handleJump,
    { passive:false }
);

jumpBtn.addEventListener(
    "mousedown",
    handleJump
);

/* Duck Button */

duckBtn.addEventListener(
    "pointerdown",
    handleDuckStart
);

duckBtn.addEventListener(
    "pointerup",
    handleDuckEnd
);

duckBtn.addEventListener(
    "pointercancel",
    handleDuckEnd
);

duckBtn.addEventListener(
    "touchstart",
    handleDuckStart,
    { passive:false }
);

duckBtn.addEventListener(
    "touchend",
    handleDuckEnd,
    { passive:false }
);

duckBtn.addEventListener(
    "mousedown",
    handleDuckStart
);

duckBtn.addEventListener(
    "mouseup",
    handleDuckEnd
);

duckBtn.addEventListener(
    "mouseleave",
    handleDuckEnd
);

/* Tap anywhere on the game canvas to Jump */

canvas.addEventListener(
    "pointerdown",
    handleJump
);

canvas.addEventListener(
    "touchstart",
    handleJump,
    { passive:false }
);

/* ==========================================
   BUTTONS
========================================== */

startBtn.addEventListener(

    "click",

    startGame
);

playAgainBtn
.addEventListener(

    "click",

    startGame
);

resumeBtn
.addEventListener(

    "click",

    resumeGame
);

restartBtnPause
.addEventListener(

    "click",

    startGame
);

mainMenuBtn
.addEventListener(

    "click",

    ()=>{

        game.running =
        false;

        gameContainer
        .style.display =
        "none";

        gameOverScreen
        .classList
        .remove(
            "active"
        );

        startScreen
        .classList
        .add(
            "active"
        );

        menuHighScore
        .textContent =
        highScore;
    }
);

pauseBtn
.addEventListener(

    "click",

    ()=>{

        if(
            game.paused
        ){

            resumeGame();

        }else{

            pauseGame();
        }
    }
);

/* ==========================================
   FULLSCREEN
========================================== */

fullscreenBtn
.addEventListener(

    "click",

    ()=>{

        if(
            !document
            .fullscreenElement
        ){

            document
            .documentElement
            .requestFullscreen();

        }else{

            document
            .exitFullscreen();
        }
    }
);

/* ==========================================
   INIT
========================================== */

highScoreEl.textContent =
highScore;

menuHighScore.textContent =
highScore;

updateHUD();

console.log(
    "Dino Night Runner Loaded"
);
