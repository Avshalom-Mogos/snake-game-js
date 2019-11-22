let body = document.querySelector("body");
body.onkeyup = function (e) { inputHandler(e) };
let direction = "up";
let play = true;
const step = 20;

function BodyPart(x, y, lkpX, lkpY) {

    this.x = x;
    this.y = y;
    this.lkpX = lkpX;
    this.lkpY = lkpY;
};

let snake = [
    new BodyPart(0, 300),
    new BodyPart(0, 320),
    new BodyPart(0, 340),
    new BodyPart(0, 360),
    new BodyPart(0, 380)
];

const move = {
    up: true,
    right: true,
    down: false,
    left: true
};


function updatePose() {

    let divs = document.querySelectorAll("div");
    for (let index = 0; index < divs.length; index++) {

        divs[index].style.left = (snake[index].x) + "px";
        divs[index].style.top = (snake[index].y) + "px";


        // console.log(divs[index].innerText + "- x: " + divs[index].offsetLeft, "y: " + divs[index].offsetTop);
    }
}


updatePose();
//--------------------------------------------------------------------

function lkpUpdate() {

    for (let index = 1; index < snake.length; index++) {
        const element = snake[index];

        element.lkpX = snake[index - 1].x;
        element.lkpY = snake[index - 1].y;
    }
}

lkpUpdate();

function inputHandler(event) {

    //move up
    if (event.keyCode == 38 && move.up == true) {

        direction = "up";
        // console.log(direction + "key");

    }
    //move right
    if (event.keyCode == 39 && move.right == true) {

        direction = "right";
        // console.log(direction + "key");

    }
    //move left
    if (event.keyCode == 37 && move.left == true) {

        direction = "left";
        // console.log(direction + "key");

    }
    //move down
    if (event.keyCode == 40 && move.down == true) {
        direction = "down";
        // console.log(direction + "key");

    }

}

function moveOn(direction) {
    //console.log(direction + " func");
    if (direction == "up") {
        snake[0].y -= step;
        move.up = true;
        move.right = true;
        move.down = false;
        move.left = true;

    }
    if (direction == "right") {
        snake[0].x += step;
        move.up = true;
        move.right = true;
        move.down = true;
        move.left = false;
    }
    if (direction == "left") {
        snake[0].x -= step;
        move.up = true;
        move.right = false;
        move.down = true;
        move.left = true;
    }
    if (direction == "down") {
        snake[0].y += step;
        move.up = false;
        move.right = true;
        move.down = true;
        move.left = true;
    }

}

function lkpMove() {

    for (let index = 1; index < snake.length; index++) {
        const element = snake[index];

        element.x = element.lkpX;
        element.y = element.lkpY;
    }

}




function gameStart() {
    if (play) {
        // console.log(snake);
        moveOn(direction);
        wallsCollision();
        lkpMove();
        
        appleEaten();
        updatePose();

        lkpUpdate();
        //createApple();
    };
};

function wallsCollision() {
    const snakeHead = snake[0];
    if (snakeHead.y < 0 || snakeHead.y > 380 ||
        snakeHead.x < 0 || snakeHead.x > 380) {

        gameOver();
    };
};

function gameOver() {
    play = false;
    let abaSpan = document.querySelector("span");
    abaSpan.style.borderColor = "red";
    let h1 = document.createElement("h1");
    h1.style.color = "white";
    h1.textContent = "GAME OVER!";
    h1.style.textAlign = "center";
    abaSpan.style.backgroundColor = "rgba(0,0,0,0.5)";
    abaSpan.appendChild(h1);
    // console.log(snake);

}


let appleX = 3, appleY = 3;
function createApple() {
    appleX = 3;
     appleY = 3;
    let gameSpace = document.querySelector("#gameSpace");
    let apple = document.createElement("span");
    gameSpace.appendChild(apple);
    apple.classList.add("appleStyle");

    while (appleX % 20 != 0 || appleY % 20 != 0) {
        appleX = Math.floor(Math.random() * 380);
        appleY = Math.floor(Math.random() * 380);
    }

    apple.style.left = appleX + "px";
    apple.style.top = appleY + "px";

    console.log("x: " + appleX, "y: " + appleY)
}
createApple();

function appleEaten(){
    let snakeHead = snake[0];

    if(snakeHead.x == appleX && snakeHead.y == appleY){
        console.log("yam!");
        let newX = snake[snake.length-1].lkpX;
        let newY = snake[snake.length-1].lkpY;
        snake.push(new BodyPart(newX, newY));
        let gameSpace = document.querySelector("#gameSpace");
        let newPart = document.createElement("div");

        gameSpace.appendChild(newPart);

        let apple = gameSpace.querySelector("span");
        gameSpace.removeChild(apple);
        createApple();
    };

    

}
