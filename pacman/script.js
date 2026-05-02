const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const tileSize = 20;
const rows = canvas.height / tileSize;
const cols = canvas.width / tileSize;

// Simple maze: 0 = empty, 1 = wall, 2 = dot
const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,1,1,2,1,1,2,1,1,1,2,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,2,1,1,1,1,1,1,2,1,2,1,1,2,1],
    [1,2,2,2,2,1,2,2,2,1,1,2,2,2,1,2,2,2,2,1],
    [1,1,1,1,2,1,1,1,2,1,1,2,1,1,1,2,1,1,1,1],
    [0,0,0,1,2,1,2,2,2,2,2,2,2,2,1,2,1,0,0,0],
    [1,1,1,1,2,1,2,1,1,0,0,1,1,2,1,2,1,1,1,1],
    [2,2,2,2,2,2,2,1,0,0,0,0,1,2,2,2,2,2,2,2],
    [1,1,1,1,2,1,2,1,1,0,0,1,1,2,1,2,1,1,1,1],
    [0,0,0,1,2,1,2,2,2,2,2,2,2,2,1,2,1,0,0,0],
    [1,1,1,1,2,1,1,1,2,1,1,2,1,1,1,2,1,1,1,1],
    [1,2,2,2,2,1,2,2,2,1,1,2,2,2,1,2,2,2,2,1],
    [1,2,1,1,2,1,2,1,1,1,1,1,1,2,1,2,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,1,1,2,1,1,2,1,1,1,2,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

let pacman = { x: 1, y: 1, dir: 'right' };
let ghost = { x: 18, y: 17 };
let score = 0;
let gameRunning = true;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw maze
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (maze[y][x] === 1) {
                ctx.fillStyle = '#0000ff';
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            } else if (maze[y][x] === 2) {
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(x * tileSize + tileSize/2, y * tileSize + tileSize/2, 3, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }
    
    // Draw Pacman
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(pacman.x * tileSize + tileSize/2, pacman.y * tileSize + tileSize/2, tileSize/2 - 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw Ghost
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(ghost.x * tileSize + tileSize/2, ghost.y * tileSize + tileSize/2, tileSize/2 - 2, 0, 2 * Math.PI);
    ctx.fill();
}

function movePacman() {
    let newX = pacman.x;
    let newY = pacman.y;
    
    if (pacman.dir === 'up') newY--;
    else if (pacman.dir === 'down') newY++;
    else if (pacman.dir === 'left') newX--;
    else if (pacman.dir === 'right') newX++;
    
    if (newX >= 0 && newX < cols && newY >= 0 && newY < rows && maze[newY][newX] !== 1) {
        pacman.x = newX;
        pacman.y = newY;
        if (maze[newY][newX] === 2) {
            maze[newY][newX] = 0;
            score += 10;
            scoreElement.textContent = score;
        }
    }
}

function moveGhost() {
    const directions = ['up', 'down', 'left', 'right'];
    const dir = directions[Math.floor(Math.random() * directions.length)];
    let newX = ghost.x;
    let newY = ghost.y;
    
    if (dir === 'up') newY--;
    else if (dir === 'down') newY++;
    else if (dir === 'left') newX--;
    else if (dir === 'right') newX++;
    
    if (newX >= 0 && newX < cols && newY >= 0 && newY < rows && maze[newY][newX] !== 1) {
        ghost.x = newX;
        ghost.y = newY;
    }
}

function checkCollision() {
    if (pacman.x === ghost.x && pacman.y === ghost.y) {
        gameRunning = false;
        alert('Game Over! Score: ' + score);
    }
}

function gameLoop() {
    if (gameRunning) {
        movePacman();
        moveGhost();
        checkCollision();
        draw();
        setTimeout(gameLoop, 200);
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') pacman.dir = 'up';
    else if (e.key === 'ArrowDown') pacman.dir = 'down';
    else if (e.key === 'ArrowLeft') pacman.dir = 'left';
    else if (e.key === 'ArrowRight') pacman.dir = 'right';
});

draw();
gameLoop();