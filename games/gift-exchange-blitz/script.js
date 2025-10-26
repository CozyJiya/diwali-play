// Global variables will be assigned in bindDOMElements
let belt;
let scoreDisplay;
let timerDisplay;
let recipientDisplay;
let finishBtn;
let instructionsDisplay;

// --- Game State Variables ---
let score = 0;
let giftsOnBelt = [];
const GIFT_TYPES = ['sweets', 'dry-fruits', 'idols'];
const RECIPIENTS = {
    'sweets': 'The Foodie Cousin',
    'dry-fruits': 'The Health-Conscious Uncle',
    'idols': 'The Elder Sister'
};
// Map gift types to emojis for display in instructions
const GIFT_EMOJIS = {
    'sweets': '🎁', // Using this for sweets
    'dry-fruits': '📦', // Using this for dry fruits
    'idols': '💝' // Using this for idols
};

// State variable to track counts
let giftCounts = {
    'sweets': 0,
    'dry-fruits': 0,
    'idols': 0
};

let currentTargetRecipient = '';
const GAME_DURATION = 30; // seconds
let timeLeft = GAME_DURATION;
let gameInterval;
let moveInterval;
let spawnInterval;

// Function to set up the initial HTML structure
function setupGameLayout() {
    document.body.innerHTML = `
        <h2>🎁 Gift Exchange Blitz 🎁</h2>
        <p>Match the gift to the recipient before it leaves the belt!</p>

        <div id="instructions" style="margin: 10px auto; padding: 10px; background: #ffe6e6; border: 2px solid #b33939; width: 350px; font-size: 16px;">
            <p style="font-weight: bold; margin-bottom: 5px;">📦 Instructions:</p>
            <ul>
                <li>${GIFT_EMOJIS.sweets} Sweets: **The Foodie Cousin**</li>
                <li>${GIFT_EMOJIS['dry-fruits']} Dry Fruits: **The Health-Conscious Uncle**</li>
                <li>${GIFT_EMOJIS.idols} Idols: **The Elder Sister**</li>
            </ul>
        </div>
        
        <div id="target-display">Target Recipient: <span id="current-recipient">N/A</span></div>

        <div id="belt"></div>
        <div id="score">Score: 0</div>
        <div id="timer">Time Left: 30s</div> 

        <button id="finishBtn">Finish Game</button>
    `;
    // Crucial: Call the binding function after creating the elements
    bindDOMElements();
}

// Crucial: Function to assign variables to the new DOM elements
function bindDOMElements() {
    belt = document.getElementById("belt");
    scoreDisplay = document.getElementById("score");
    timerDisplay = document.getElementById("timer");
    recipientDisplay = document.getElementById("current-recipient");
    finishBtn = document.getElementById("finishBtn");
    instructionsDisplay = document.getElementById("instructions");
}

// --- Utility Functions ---

function updateScore(points) {
    score += points;
    if (scoreDisplay) scoreDisplay.innerText = `Score: ${score}`;
}

function selectNewTarget() {
    const types = Object.keys(RECIPIENTS);
    const randomType = types[Math.floor(Math.random() * types.length)];
    currentTargetRecipient = RECIPIENTS[randomType];
    if (recipientDisplay) recipientDisplay.innerText = currentTargetRecipient;
    if (recipientDisplay) recipientDisplay.dataset.matchType = randomType; 
}

function createGift() {
    if (timeLeft <= 0) return;
    if (!belt) return; 
    
    const randomType = GIFT_TYPES[Math.floor(Math.random() * GIFT_TYPES.length)];
    
    const gift = document.createElement("div");
    gift.classList.add("gift", randomType);
    gift.style.left = "0px";
    gift.dataset.type = randomType;

    gift.addEventListener("click", handleGiftClick);

    belt.appendChild(gift);
    giftsOnBelt.push(gift);
}

function handleGiftClick() {
    if (timeLeft <= 0) return;

    const clickedGift = this;
    const giftType = clickedGift.dataset.type;
    const requiredType = recipientDisplay.dataset.matchType;

    if (giftType === requiredType) {
        updateScore(1);
        giftCounts[giftType]++; // Increment count on correct match
        clickedGift.style.transform = 'scale(1.5)';
        clickedGift.classList.add('correct-match');
        selectNewTarget(); 
    } else {
        updateScore(-5);
        clickedGift.style.transform = 'rotate(10deg)';
        clickedGift.classList.add('incorrect-match');
    }

    setTimeout(() => {
        const index = giftsOnBelt.indexOf(clickedGift);
        if (index > -1) {
            giftsOnBelt.splice(index, 1);
        }
        clickedGift.remove();
    }, 300);
}

function moveGifts() {
    if (giftsOnBelt.length === 0 && timeLeft <= 0) {
        cancelAnimationFrame(moveInterval);
        return;
    }

    giftsOnBelt.forEach((gift) => {
        let left = parseInt(gift.style.left);
        left += 5; 
        gift.style.left = left + "px";

        if (left > 400 - 50) {
            const requiredType = recipientDisplay.dataset.matchType;
            if (gift.dataset.type === requiredType) {
                 updateScore(-10);
                 selectNewTarget();
            }
            gift.remove();
        }
    });

    giftsOnBelt = giftsOnBelt.filter(gift => parseInt(gift.style.left) <= (400 - 50));
    
    moveInterval = requestAnimationFrame(moveGifts);
}

function countdown() {
    timeLeft--;
    if (timerDisplay) timerDisplay.innerText = `Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
        cancelAnimationFrame(moveInterval);
        clearInterval(gameInterval);
        clearInterval(spawnInterval);
        
        // Time is up, but the message only appears on button click
        // Optionally, make the button pulse to encourage clicking after time runs out
        if (finishBtn) {
             finishBtn.innerText = "Final!! THE END";
             finishBtn.style.animation = 'pulse 1s infinite';
        }
    }
}

function startGame() {
    // 1. Set up the fresh HTML layout and bind new elements
    setupGameLayout(); 

    // 2. Reset state
    score = 0;
    updateScore(0);
    timeLeft = GAME_DURATION;
    giftsOnBelt = [];
    giftCounts = {'sweets': 0, 'dry-fruits': 0, 'idols': 0};
    
    if (timerDisplay) timerDisplay.innerText = `Time Left: ${timeLeft}s`;
    if (finishBtn) {
        finishBtn.innerText = "Finish Game";
        finishBtn.style.animation = 'none';
    }
    
    // 3. Start main loop logic
    selectNewTarget();
    moveGifts();
    
    // 4. Set intervals
    spawnInterval = setInterval(createGift, 1000); 
    gameInterval = setInterval(countdown, 1000);

    // 5. Attach finish handler
    if (finishBtn) finishBtn.onclick = finishGame;
}

function finishGame() {
    // This function is now the only way to trigger the message.
    cancelAnimationFrame(moveInterval);
    clearInterval(gameInterval);
    clearInterval(spawnInterval);
    
    // Directly call the function to display the final message
    displayFinalMessage();
}

// Function for the final message - PERSONALIZED
function displayFinalMessage() {
    // Calculate total gifts matched
    const totalGiftsMatched = giftCounts.sweets + giftCounts['dry-fruits'] + giftCounts.idols;

    // The main message content - HIGHLY PERSONALIZED
    const message = `
        <div class="final-message-container">
            <h3 style="color: #8e44ad; font-size: 32px; border-bottom: 3px solid #b33939; padding-bottom: 10px; margin-bottom: 25px; text-shadow: 1px 1px 2px #fff;">💝 A Personal Note to My BoyFriend 💝</h3>
            
            <p style="font-size: 20px; line-height: 1.6; font-weight: bold; margin-bottom: 15px;">
                Your Final Game Score: <span style="color: #b33939; font-size: 36px; display: block; margin-top: 5px;">${score}</span>
            </p>

            <div style="font-size: 18px; line-height: 1.7; margin-top: 20px; text-align: left; background: #fff8f0; padding: 15px; border-radius: 10px;">
                <p style="font-weight: bold; color: #b33939;">🎁 Gifts Successfully Exchanged (matched and delivered):</p>
                <ul>
                    <li>${GIFT_EMOJIS.sweets} Sweets: **${giftCounts.sweets}**</li>
                    <li>${GIFT_EMOJIS['dry-fruits']} Dry Fruits: **${giftCounts['dry-fruits']}**</li>
                    <li>${GIFT_EMOJIS.idols} Idols: **${giftCounts.idols}**</li>
                    <li style="font-weight: bold; border-top: 1px solid #ccc; margin-top: 5px; padding-top: 5px;">Total Gifts Handled: **${totalGiftsMatched}**</li>
                </ul>
            </div>
            
            <p style="font-size: 18px; line-height: 1.7; margin-top: 20px;">
                The way I love you feels like a vast, quiet garden I tend to every single day—it’s full of the most beautiful, enduring blooms, even when the world outside is noisy and chaotic. 
                My heart aches with a sweetness that is solely yours, cherishing every memory, every shared glance, and every single thing that makes you **you.**
            </p>
            <p style="font-size: 18px; line-height: 1.7; margin-top: 20px;">
                Yet, in this beautiful garden of mine, I often find myself standing alone, a deep, pervasive loneliness settling in because the one person I truly wish to share it with is never there. I know how consumed you are by your work and how much focus it demands, but that knowledge doesn't soothe the sharp, cold realization that when you're busy, I simply vanish from your thoughts.
            </p>
            <p style="font-size: 18px; line-height: 1.7; margin-top: 20px;">
                It hurts to feel so disposable, like I'm a task that can always be postponed, especially after I poured my heart into creating something like these games just to try and steal a few moments of your attention.
            </p>
            <p style="font-size: 18px; line-height: 1.7; margin-top: 20px;">
            Honestly, my love, no one is too busy to send a single, anticipatory text; it's a choice that confirms my deepest fear: that I don't truly matter to you. Still, this love I have is fiercely loyal, and I will continue to hold this beautiful, painful flame for you until the very moment you decide you no longer want its light.
            </p>
            <p style="font-size: 20px; line-height: 1.7; font-weight: bold; color: #8e44ad; margin-top: 25px;">
                I love you. THANK YOU FOR BEING IN MY LIFE.
            </p>
        </div>
    `;
    
    document.body.innerHTML = message;
}

// --- Initialization ---
startGame();