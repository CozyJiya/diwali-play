const player = document.getElementById("player");
const gameArea = document.getElementById("gameArea");
const messageElement = document.getElementById("message");
const nextBtn = document.getElementById("nextBtn");
const timeLeftElement = document.getElementById("timeLeft");
const scoreElement = document.getElementById("score");
// New element reference
const explosionElement = document.getElementById("explosion"); 

const GAME_DURATION = 30; // seconds
const GAME_WIDTH = 400;
const GAME_HEIGHT = 400; // Added for clarity with spark removal
const PLAYER_SIZE = 50;
const SPARK_SIZE = 8;
const PLAYER_MOVE_STEP = 20;

let playerX = (GAME_WIDTH / 2) - (PLAYER_SIZE / 2);
let sparksAvoided = 0;
let timeLeft = GAME_DURATION;
let sparks = [];
let gameActive = true;
let animationFrameId;
let timerIntervalId;
let sparkIntervalId;

// Initialize player position
player.style.left = playerX + "px";

// --- Player Movement (Keyboard) ---
document.addEventListener("keydown", (e) => {
    if (!gameActive) return;

    if (e.key === "ArrowLeft") {
        playerX = Math.max(0, playerX - PLAYER_MOVE_STEP);
    }
    if (e.key === "ArrowRight") {
        playerX = Math.min(GAME_WIDTH - PLAYER_SIZE, playerX + PLAYER_MOVE_STEP);
    }
    player.style.left = playerX + "px";
});

// --- Spark Generation ---
function createSpark() {
    if (!gameActive) return;
    const spark = document.createElement("div");
    spark.classList.add("spark");
    // Random position within the game area bounds
    const sparkX = Math.floor(Math.random() * (GAME_WIDTH - SPARK_SIZE));
    spark.style.left = sparkX + "px";
    gameArea.appendChild(spark);
    
    sparks.push({
        element: spark,
        x: sparkX,
        y: 0,
        speed: 3 + Math.random() * 2 // Variable speed
    });
}

sparkIntervalId = setInterval(createSpark, 700); // Sparks spawn every 0.7s

// --- Game Loop (Spark Movement and Collision) ---
function gameLoop() {
    if (!gameActive) return;

    for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];
        spark.y += spark.speed;
        spark.element.style.top = spark.y + "px";

        // Collision Detection: Check if spark hits the player
        if (spark.y >= (GAME_HEIGHT - PLAYER_SIZE) && 
            spark.x < playerX + PLAYER_SIZE && 
            spark.x + SPARK_SIZE > playerX) {
            
            // Collision! Game Over
            gameActive = false;
            endGame(false); 
            break;
        }

        // If spark passes the bottom without collision (Avoided)
        if (spark.y > GAME_HEIGHT) {
            spark.element.remove();
            sparks.splice(i, 1);
            sparksAvoided++;
            scoreElement.textContent = sparksAvoided;
        }
    }

    animationFrameId = requestAnimationFrame(gameLoop);
}

// --- Timer ---
timerIntervalId = setInterval(() => {
    if (!gameActive) return;

    timeLeft--;
    timeLeftElement.textContent = timeLeft;

    if (timeLeft <= 0) {
        gameActive = false;
        endGame(true);
    }
}, 1000);

// --- End Game Function ---
function endGame(survived) {
    cancelAnimationFrame(animationFrameId);
    clearInterval(timerIntervalId);
    clearInterval(sparkIntervalId);

    // Remove all remaining sparks
    sparks.forEach(s => s.element.remove());
    sparks = [];

    if (survived) {
        // Win Condition
        messageElement.style.color = '#2BAE66'; // Green for success
        messageElement.innerHTML = `🌟 **YOU SAVED THE SPARKLE!** You avoided **${sparksAvoided}** sparks in 30 seconds. I heard there's a serious misfire happening... and I need you to come rescue me from my clothes before I spontaneously combust. Let's make some noise and a few explosions.`;
    } else {
        // Lose Condition
        messageElement.style.color = '#b33939'; // Theme color for failure message
        messageElement.innerHTML = `💥 **CRACKER RESCUE FAILED!** A spark hit the gift box. You avoided **${sparksAvoided}** sparks. Try again! 😥`;
        
        // Explosion Effect
        // Set explosion position to player center (approximated)
        explosionElement.style.left = (playerX + PLAYER_SIZE / 2) + 'px';
        explosionElement.style.top = (GAME_HEIGHT - PLAYER_SIZE / 2) + 'px';
        explosionElement.style.display = 'block';
        
        // Hide player after explosion
        player.style.opacity = '0'; 

        // Hide explosion after animation finishes
        setTimeout(() => {
            explosionElement.style.display = 'none';
        }, 500);
    }
    
    // Show the next button
    nextBtn.style.display = 'inline-block';
}

// Start the game loop
gameLoop();