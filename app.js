const body = document.querySelector("body");
const gameSpace = document.querySelector("#gameSpace");
const gameWidth = gameSpace.offsetWidth - 40; //  - border 5px + 5px
const gameHeight = gameSpace.offsetHeight - 40; //  - border 5px + 5px
let score = 0;


//add events to start and restart buttons
const startBtn = document.querySelector("#startBtn");
const restartBtn = document.querySelector("#restartBtn");

startBtn.onclick = function () {
    gameStart();
    this.textContent = "FASTER!";
};

restartBtn.onclick = function () { gameRestart() };



//catch key press
body.onkeydown = function (e) { inputHandler(e) };
let direction = "up";
const step = 20;

//snake function constructor 
function BodyPart(x, y, lkpX, lkpY) {

    this.x = x;
    this.y = y;
    this.lkpX = lkpX;
    this.lkpY = lkpY;
};

//snake initial position
let snake = [
    new BodyPart(0, gameHeight - (step * 5)),
    new BodyPart(0, gameHeight - (step * 4)),
    new BodyPart(0, gameHeight - (step * 3)),
    new BodyPart(0, gameHeight - (step * 2)),
    new BodyPart(0, gameHeight - step)
];

const move = {
    up: true,
    right: true,
    down: false,
    left: true
};


const gameState = {
    running: true,
    over: false
};

//update divs position on the dom
function updatePose() {

    let divs = document.querySelectorAll("div");
    for (let index = 0; index < divs.length; index++) {

        divs[index].style.left = (snake[index].x) + "px";
        divs[index].style.top = (snake[index].y) + "px";

    };
};

updatePose();

//give every bodypart the Last Known Position
function lkpUpdate() {

    for (let index = 1; index < snake.length; index++) {
        const element = snake[index];

        element.lkpX = snake[index - 1].x;
        element.lkpY = snake[index - 1].y;
    };
};

lkpUpdate();

//handle user keypress input
function inputHandler(event) {

    //move up
    if ((event.keyCode == 38 || event == 38) && move.up) {

        direction = "up";

    };
    //move right
    if ((event.keyCode == 39 || event == 39) && move.right) {

        direction = "right";

    };
    //move left
    if ((event.keyCode == 37 || event == 37) && move.left) {

        direction = "left";

    };
    //move down
    if ((event.keyCode == 40 || event == 40) && move.down) {

        direction = "down";

    };

};

//move snake head one step to direction
function moveOn(direction) {

    switch (direction) {

        case "up":

            snake[0].y -= step;
            move.up = true;
            move.right = true;
            move.down = false;
            move.left = true;
            break;

        case "right":
            snake[0].x += step;
            move.up = true;
            move.right = true;
            move.down = true;
            move.left = false;
            break;

        case "left":
            snake[0].x -= step;
            move.up = true;
            move.right = false;
            move.down = true;
            move.left = true;
            break;

        case "down":
            snake[0].y += step;
            move.up = false;
            move.right = true;
            move.down = true;
            move.left = true;
            break;

    };
};

//move bodyparts to last known position
function lkpMove() {

    for (let index = 1; index < snake.length; index++) {
        const element = snake[index];

        element.x = element.lkpX;
        element.y = element.lkpY;
    };

};

//Game loop
function gameStart() {

    const gameloop = setInterval(() => {
        if (gameState.running) {
            moveOn(direction);
            detectCollision();
            lkpMove();
            appleEaten();
            updatePose();
            lkpUpdate();
        } else {
            clearInterval(gameloop);
        };
    }, 125)
};

//detect coliision with body and walls
function detectCollision() {
    const snakeHead = snake[0];
    const snakeHeadSize = document.querySelector("div").offsetWidth;

    for (let index = 1; index < snake.length; index++) {
        const bodyPart = snake[index];
        if (snakeHead.x == bodyPart.x &&
            snakeHead.y == bodyPart.y) {
            gameOver();


        };
    };

    if (snakeHead.y < 0 || snakeHead.y > gameHeight - snakeHeadSize ||
        snakeHead.x < 0 || snakeHead.x > gameWidth - snakeHeadSize) {

        gameOver();
    };
};

//stop game and show game over message
function gameOver() {
    gameoverSound.play();
    gameState.over = true;
    gameState.running = false


    let h1 = document.createElement("h1");
    h1.textContent = "GAME OVER!";
    gameSpace.appendChild(h1);
};

//create new apple
let appleX, appleY;
function createApple() {
    const snakeHeadSize = document.querySelector("div").offsetWidth;

    appleX = 3;
    appleY = 3;

    let apple = document.createElement("span");
    gameSpace.appendChild(apple);
    apple.classList.add("appleStyle");

    let arrX = [], arrY = [];
    for (let index = 0; index < snake.length; index++) {
        arrX[index] = snake[index].x;
        arrY[index] = snake[index].y;
    };



    while (
        (appleX % 20 != 0 || appleY % 20 != 0) ||
        (arrX.includes(appleX) && arrY.includes(appleY))
    ) {
        appleX = Math.floor(Math.random() * (gameWidth - snakeHeadSize));
        appleY = Math.floor(Math.random() * (gameHeight - snakeHeadSize));
    };


    apple.style.left = appleX + "px";
    apple.style.top = appleY + "px";
};
createApple();


//add new bodypart when apple was eaten
function appleEaten() {


    let snakeHead = snake[0];

    if (snakeHead.x == appleX && snakeHead.y == appleY) {

        eatSound.play();

        let newX = snake[snake.length - 1].lkpX;
        let newY = snake[snake.length - 1].lkpY;
        snake.push(new BodyPart(newX, newY));
        let newPart = document.createElement("div");

        gameSpace.appendChild(newPart);

        let apple = gameSpace.querySelector("span");
        addAndUpdateScore();
        apple.remove();
        createApple();
    };
};

//add 10 points and update score 
function addAndUpdateScore() {
    const scoreDisplay = document.querySelector("#scoreDisplay");
    score += 10;
    scoreDisplay.textContent = score;
};

//restart game
function gameRestart() {

    if (gameState.over) {

        let h1 = document.querySelector("h1");
        let divs = document.querySelectorAll("div");


        if (divs.length > 5) {
            for (let index = 5; index < divs.length; index++) {
                const element = divs[index];

                gameSpace.removeChild(element);

            };
        };

        h1.remove();
        direction = "up"
        let apple = gameSpace.querySelector("span");
        gameSpace.removeChild(apple);

        score = -10;
        addAndUpdateScore();


        snake = [
            new BodyPart(0, gameHeight - (step * 5)),
            new BodyPart(0, gameHeight - (step * 4)),
            new BodyPart(0, gameHeight - (step * 3)),
            new BodyPart(0, gameHeight - (step * 2)),
            new BodyPart(0, gameHeight - step)
        ];


        updatePose();
        createApple();
        lkpUpdate();

        gameState.over = false;
        gameState.running = true;
        gameStart();
    };

};

//--------------------------------------------------------------------
//AUDIO 
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}

const eatSound = new sound("sounds/appleEaten.wav");
const gameoverSound = new sound("sounds/gameover.wav");


