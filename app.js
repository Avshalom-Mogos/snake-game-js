const body = document.querySelector('body');
const gameSpace = document.querySelector('#gameSpace');
const gameWidth = gameSpace.clientWidth;
const gameHeight = gameSpace.clientWidth;
const step = 20;
const speed = 125;
let score, direction, snake, appleX, appleY;



//add click events to start and restart buttons
const startBtn = document.querySelector('#startBtn');
const restartBtn = document.querySelector('#restartBtn');

startBtn.onclick = function () {
    gameStart();
    this.textContent = 'FASTER!';
};

restartBtn.onclick = function () { gameRestart() };


//add click events to arrow buttons
const [
    upArrow,
    leftArrow,
    rightArrow,
    downArrow
] = document.querySelectorAll('#btnContainer button');

upArrow.onclick = function () { inputHandler(38) };
leftArrow.onclick = function () { inputHandler(37) };
rightArrow.onclick = function () { inputHandler(39) };
downArrow.onclick = function () { inputHandler(40) };




//catch key press
body.onkeydown = function (e) { inputHandler(e.keyCode) };


const gameState = {
    current: 1,
    over: 0,
    running: 1
};

//update divs position on the dom
function updatePosition() {

    const divs = document.querySelectorAll('div');
    for (let i = 0; i < divs.length; i++) {

        divs[i].style.left = (snake[i].x) + 'px';
        divs[i].style.top = (snake[i].y) + 'px';
    };
};


//give every bodypart the Last Known Position of it's former
function lkpUpdate() {

    for (let i = 1; i < snake.length; i++) {
        const element = snake[i];

        element.lkpX = snake[i - 1].x;
        element.lkpY = snake[i - 1].y;
    };
};


//handle user keypress input
function inputHandler(keyCode) {

    //move up
    if (keyCode === 38 && direction !== 'down') {

        direction = 'up';
    }
    //move right
    else if (keyCode === 39 && direction !== 'left') {

        direction = 'right';
    }
    //move left
    else if (keyCode === 37 && direction !== 'right') {

        direction = 'left';
    }
    //move down
    else if (keyCode === 40 && direction !== 'up') {

        direction = 'down';
    };
};

//move snake head one step to direction
function moveOn() {

    const snakeHead = snake[0];

    switch (direction) {

        case 'up':
            snakeHead.y -= step;
            break;

        case 'right':
            snakeHead.x += step;
            break;

        case 'left':
            snakeHead.x -= step;
            break;

        case 'down':
            snakeHead.y += step;
            break;
    };
};

//move bodyparts to last known position
function lkpMove() {

    for (let i = 1; i < snake.length; i++) {
        const element = snake[i];

        element.x = element.lkpX;
        element.y = element.lkpY;
    };
};

gameInit();

//Game loop
function gameStart() {

    const gameLoop = setInterval(() => {
        if (gameState.current === gameState.running) {
            moveOn();
            detectCollision();
            lkpMove();
            appleEaten();
            updatePosition();
            lkpUpdate();
        } else {
            clearInterval(gameLoop);
        };
    }, speed)
};

//detect coliision with body and walls
function detectCollision() {
    const snakeHead = snake[0];
    const snakeHeadSize = document.querySelector('div').offsetWidth;

    //coliision with body
    for (let i = 1; i < snake.length; i++) {
        const bodyPart = snake[i];

        if (snakeHead.x === bodyPart.x &&
            snakeHead.y === bodyPart.y) {

            gameOver();
        };
    };

    //coliision with walls
    if (snakeHead.y < 0 || snakeHead.y > gameHeight - snakeHeadSize ||
        snakeHead.x < 0 || snakeHead.x > gameWidth - snakeHeadSize) {

        gameOver();
    };
};

//stop game and show game over message
function gameOver() {
    gameoverSound.play();
    gameState.current = gameState.over;


    const h1 = document.createElement('h1');
    h1.textContent = 'GAME OVER!';
    gameSpace.appendChild(h1);


    const h4Container = document.createElement('span');
    h4Container.classList.add('h4Container');

    const h4 = document.createElement('h4');
    h4.textContent = '- Game created by Avshalom Mogos 2019 -';
    h4Container.appendChild(h4);

    gameSpace.appendChild(h4Container);
};

//create new apple
function createApple() {
    const snakeHeadSize = document.querySelector('div').offsetWidth;

    const apple = document.createElement('span');
    apple.id = 'apple';
    gameSpace.appendChild(apple);


    const arrX = [], arrY = [];
    for (let i = 0; i < snake.length; i++) {
        arrX[i] = snake[i].x;
        arrY[i] = snake[i].y;
    };

    appleX = Math.floor(Math.random() * (gameWidth - snakeHeadSize) / 20) * 20;
    appleY = Math.floor(Math.random() * (gameHeight - snakeHeadSize) / 20) * 20;


    while (arrX.includes(appleX) && arrY.includes(appleY)) {

        appleX = Math.floor(Math.random() * (gameWidth - snakeHeadSize) / 20) * 20;
        appleY = Math.floor(Math.random() * (gameHeight - snakeHeadSize) / 20) * 20;
    };

    apple.style.left = appleX + 'px';
    apple.style.top = appleY + 'px';
};


//extend snake when apple was eaten
function appleEaten() {

    const snakeHead = snake[0];

    if (snakeHead.x === appleX && snakeHead.y === appleY) {

        eatSound.play();
        score += 10;
        updateScoreDisplay();

        //add body part to the snake
        const newX = snake[snake.length - 1].lkpX;
        const newY = snake[snake.length - 1].lkpY;
        snake.push({ x: newX, y: newY });

        const newPart = document.createElement('div');
        gameSpace.appendChild(newPart);

        //remove old apple
        const apple = gameSpace.querySelector('#apple');
        apple.remove();

        createApple();
    };
};

//update score on the dom 
function updateScoreDisplay() {
    const scoreDisplay = document.querySelector('#scoreDisplay');
    scoreDisplay.textContent = score;
};

function gameInit() {
    direction = 'up';
    score = 0;
    updateScoreDisplay();
    snake = [
        { x: 0, y: gameHeight - (step * 5) },
        { x: 0, y: gameHeight - (step * 4) },
        { x: 0, y: gameHeight - (step * 3) },
        { x: 0, y: gameHeight - (step * 2) },
        { x: 0, y: gameHeight - step }
    ];
    updatePosition();
    createApple();
    lkpUpdate();
};

//restart game
function gameRestart() {

    if (gameState.current === gameState.over) {

        const snakeBody = document.querySelectorAll('div');

        //remove all divs over the initial 5
        if (snakeBody.length > 5) {
            for (let i = 5; i < snakeBody.length; i++) {
                const element = snakeBody[i];

                gameSpace.removeChild(element);

            };
        };

        //remove game over message
        document.querySelector('h1').remove();
        document.querySelector('.h4Container').remove();

        //set initial direction and remove the apple

        const apple = gameSpace.querySelector('span');
        gameSpace.removeChild(apple);

        //set initial values
        gameInit();

        //change game state to running
        gameState.current = gameState.running;

        gameStart();
    };

};

//--------------------------------------------------------------------
//AUDIO 
function sound(src) {

    this.sound = document.createElement('audio');
    this.sound.src = src;
    this.sound.setAttribute('preload', 'auto');
    this.sound.setAttribute('controls', 'none');
    this.sound.style.display = 'none';

    document.body.appendChild(this.sound);

    this.play = function () {
        this.sound.play();
    };

    this.stop = function () {
        this.sound.pause();
    };
};

const soundUrl = 'https://raw.githubusercontent.com/avshalom-mogos/snake-game-js/master/assets/audio';
const eatSound = new sound(`${soundUrl}/appleEaten.wav`);
const gameoverSound = new sound(`${soundUrl}/gameover.wav`);