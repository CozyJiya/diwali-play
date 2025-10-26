const player = document.getElementById("player");
const gameArea = document.getElementById("gameArea");
const coinCountElement = document.getElementById("coin-count");
const diyaCountElement = document.getElementById("diya-count");
const message = document.getElementById("message");
const nextBtn = document.getElementById("nextBtn");
const replayBtn = document.getElementById("replayBtn");

// Define the ground level (60px ground + a little padding for the character)
const GROUND_LEVEL = 65; 
const JUMP_VELOCITY = 20; // Initial upward velocity for the jump
const GRAVITY = 1;        // Rate of deceleration (gravity effect)

let coinCount = 0;
let diyaCount = 0;
let isJumping = false;
let gameActive = true;
let jumpVelocity = 0; // Current velocity for smooth animation
let itemIntervals = []; // To store and clear all item spawn intervals

// Player jump logic using requestAnimationFrame for smoothness
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !isJumping && gameActive) {
    jump();
  }
});

function jump() {
  if (isJumping) return;

  isJumping = true;
  jumpVelocity = JUMP_VELOCITY; // Set initial upward velocity

  // Recursive function for the animation loop
  function animateJump() {
    if (!gameActive) {
        isJumping = false;
        return;
    }

    // 1. Calculate new position
    let currentBottom = parseInt(player.style.bottom || GROUND_LEVEL);
    currentBottom += jumpVelocity;
    
    // 2. Apply Gravity (deceleration/acceleration)
    jumpVelocity -= GRAVITY;

    // 3. Check for Landing
    if (currentBottom <= GROUND_LEVEL) {
      currentBottom = GROUND_LEVEL; // Snap to ground
      isJumping = false;
      jumpVelocity = 0;
    }

    // 4. Update element position
    player.style.bottom = currentBottom + "px";

    // 5. Continue animation if still jumping
    if (isJumping) {
      requestAnimationFrame(animateJump);
    }
  }

  // Start the animation loop
  requestAnimationFrame(animateJump);
}


// Spawn items
function spawnItem(type) {
  if (!gameActive) return;

  const item = document.createElement("div");
  item.classList.add("item", type);

  if (type === "coin") {
    item.innerText = "🪙";
    // Coins appear mid-air for jumping (120px to 220px)
    item.style.bottom = (Math.random() * 100 + 120) + "px"; 
  } else if (type === "diya") {
    item.innerText = "🪔";
    // Diyas on the ground
    item.style.bottom = GROUND_LEVEL + "px"; 
  } else if (type === "obstacle") {
    item.innerText = "🗻";
    // Obstacles on the ground, fixed
    item.style.bottom = GROUND_LEVEL + "px"; 
  }

  item.style.right = "-50px";
  gameArea.appendChild(item);

  // Function to move the item across the screen
  function move() {
    if (!gameActive) {
      item.remove();
      return;
    }
    let pos = parseInt(item.style.right);
    pos += 5; 
    item.style.right = pos + "px";

    // Collision Check
    const pRect = player.getBoundingClientRect();
    const iRect = item.getBoundingClientRect();

    if (iRect.left < pRect.right && iRect.right > pRect.left &&
        iRect.top < pRect.bottom && iRect.bottom > pRect.top) {
      if (type === "coin") {
        coinCount++;
        coinCountElement.innerText = coinCount;
      } else if (type === "diya") {
        diyaCount++;
        diyaCountElement.innerText = diyaCount;
      } else if (type === "obstacle") {
        endGame(false); // Hit obstacle - Game Over
        return; 
      }
      item.remove();
    } else if (pos > 550) { // Item goes off screen
      item.remove();
    } else {
      requestAnimationFrame(move);
    }
  }
  requestAnimationFrame(move); // Start moving the item

  // Set the next spawn interval and store it
  if (gameActive) {
    let interval = (type === "coin" ? 1800 : type === "diya" ? 3500 : 2200);
    let timeoutId = setTimeout(() => spawnItem(type), interval);
    itemIntervals.push(timeoutId);
  }
}

// Clear all running item spawn intervals
function clearItemIntervals() {
    itemIntervals.forEach(clearTimeout);
    itemIntervals = [];
}

// End game
function endGame(won) {
  gameActive = false;
  clearItemIntervals(); // Stop spawning new items
  
  // Remove all existing items from the game area
  document.querySelectorAll('.item').forEach(i => i.remove());

  if (won) {
    message.innerHTML = `Forget gold coins, I'm going to follow the trail of your clothes right into the bedroom. I hear the Goddess of Wealth likes a little worship... and I'm prepared to give you all my devotion. <br> 🪙 Coins: ${coinCount} | 🪔 Diyas: ${diyaCount}`;
    message.classList.remove("hidden");
    nextBtn.classList.remove("hidden");
  } else {
    message.innerHTML = `Oh no! 🗻 Hit an obstacle. <br> 🪙 Coins: ${coinCount} | 🪔 Diyas: ${diyaCount}`;
    message.classList.remove("hidden");
    replayBtn.classList.remove("hidden");
  }
}

// Spawn House after enough diyas
function spawnHouse() {
  // Check condition: Must have 10 or more diyas, and the game must still be active (i.e., not already hit an obstacle)
  if (diyaCount >= 10 && gameActive) {
    // Stop spawning more items once the house is on the way
    gameActive = false; 
    clearItemIntervals();

    const house = document.createElement("div");
    house.classList.add("item", "house");
    house.innerText = "🏡";
    // CSS sets the size, this bottom ensures it is on the ground
    house.style.bottom = "40px"; 
    house.style.right = "-50px";
    gameArea.appendChild(house);

    function moveHouse() {
      let pos = parseInt(house.style.right);
      pos += 4;
      house.style.right = pos + "px";

      const pRect = player.getBoundingClientRect();
      const hRect = house.getBoundingClientRect();

      // Check for collision/overlap with the player (Laxmi reaches the house)
      if (hRect.left < pRect.right && hRect.right > pRect.left && hRect.top < pRect.bottom) {
        endGame(true);
      } else if (pos > 550) { 
        house.remove();
      } else {
        requestAnimationFrame(moveHouse);
      }
    }
    requestAnimationFrame(moveHouse);
  }
}

// Start game setup
function startGame(){
    // Set player to the correct initial ground height
    player.style.bottom = GROUND_LEVEL + "px"; 
    // Start spawning items
    spawnItem("coin");
    spawnItem("diya");
    spawnItem("obstacle");
}

startGame();

// Check for house condition every second
setInterval(spawnHouse, 1000);

// Next button: CORRECTED to navigate directly without the popup
nextBtn.onclick = () => { 
    window.location.href = "../gift-exchange-blitz/index.html"; 
}

// Replay button

replayBtn.onclick = () => { location.reload(); }
