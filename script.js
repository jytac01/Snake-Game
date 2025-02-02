const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 10;
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};

let score = 0;
let d;
let gamePaused = false;
let game;
let speed = 100;

document.addEventListener("keydown", direction);

function direction(event) {
    if (event.keyCode == 37 && d != "RIGHT") {
        d = "LEFT";
    } else if (event.keyCode == 38 && d != "DOWN") {
        d = "UP";
    } else if (event.keyCode == 39 && d != "LEFT") {
        d = "RIGHT";
    } else if (event.keyCode == 40 && d != "UP") {
        d = "DOWN";
    } else if (event.keyCode == 32) { // Space key
        togglePause();
    }
}

function togglePause() {
    if (gamePaused) {
        game = setInterval(draw, speed);
        gamePaused = false;
    } else {
        clearInterval(game);
        gamePaused = true;
    }
}

function endGame() {
    alert("Game Over!");
    setTimeout(function() {
        location.reload();
    }, 0); // Refresh the page 
}

// Modal functionality
window.onload = function() {
    let modal = document.getElementById("instructionModal");
    let span = document.getElementsByClassName("close")[0];

    modal.style.display = "block";

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "white" : "lightgrey";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "grey";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };

        // Increase speed every 10 points
        if (score % 10 === 0) {
            speed -= 10;
            clearInterval(game);
            game = setInterval(draw, speed);
        }
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        endGame();
    }

    snake.unshift(newHead);

    document.getElementById("score").innerHTML = "Score: " + score;
}

game = setInterval(draw, speed);