const room = document.getElementById("room");
const itemsCollectedElement = document.getElementById("items-collected");
const timeLeftElement = document.getElementById("time-left");
const booksCountElement = document.getElementById("books-count");
const clothesCountElement = document.getElementById("clothes-count");
const miscCountElement = document.getElementById("misc-count");
const gameStatusElement = document.getElementById("game-status");
const nextButton = document.getElementById("nextBtn");

let itemsCollected = 0;
const TOTAL_ITEMS = 15;
let timeLeft = 60; // Increased time for more items
let gameActive = true;

const itemData = [
    // Books (📙, 📕, 📗, 📘)
    { emoji: '📙', type: 'book', isSmall: false },
    { emoji: '📕', type: 'book', isSmall: true },
    { emoji: '📗', type: 'book', isSmall: false },
    { emoji: '📘', type: 'book', isSmall: true },
    { emoji: '📙', type: 'book', isSmall: false },

    // Clothes (🧦, 👖, 👕, 👟)
    { emoji: '🧦', type: 'clothes', isSmall: false },
    { emoji: '👖', type: 'clothes', isSmall: false },
    { emoji: '👕', type: 'clothes', isSmall: true },
    { emoji: '👟', type: 'clothes', isSmall: false },
    { emoji: '🧦', type: 'clothes', isSmall: false },

    // Misc (🎒, 🖋️)
    { emoji: '🎒', type: 'misc', isSmall: false },
    { emoji: '🖋️', type: 'misc', isSmall: true },
    { emoji: '🎒', type: 'misc', isSmall: false },
    { emoji: '🖋️', type: 'misc', isSmall: false },
    { emoji: '🖋️', type: 'misc', isSmall: true },
];

let categoryCounts = {
    book: 0,
    clothes: 0,
    misc: 0
};

// --- Item Setup ---
function setupItems() {
    itemData.forEach(data => {
        const item = document.createElement('div');
        item.className = `item ${data.isSmall ? 'item-small' : ''}`;
        item.dataset.type = data.type;
        item.innerHTML = data.emoji;

        // Random position within the room boundaries
        const roomRect = room.getBoundingClientRect();
        // Use a padding of 50px so small items aren't completely hidden on the border
        item.style.top = Math.floor(Math.random() * (roomRect.height - 50)) + "px";
        item.style.left = Math.floor(Math.random() * (roomRect.width - 50)) + "px";

        room.appendChild(item);

        item.addEventListener("click", handleItemClick);
    });
}

function handleItemClick(event) {
    if (!gameActive) return;

    const item = event.currentTarget;
    const type = item.dataset.type;

    item.remove();
    itemsCollected++;
    categoryCounts[type]++;
    updateScoreBoard();

    if (itemsCollected === TOTAL_ITEMS) {
        endGame(true);
    }
}

function updateScoreBoard() {
    itemsCollectedElement.textContent = `${itemsCollected} / ${TOTAL_ITEMS}`;
    booksCountElement.textContent = `Books: ${categoryCounts.book}`;
    clothesCountElement.textContent = `Clothes: ${categoryCounts.clothes}`;
    miscCountElement.textContent = `Misc: ${categoryCounts.misc}`;
}

// --- Game Timer and End ---
const timerInterval = setInterval(countdown, 1000);

function countdown() {
    if (!gameActive) return;

    timeLeft--;
    timeLeftElement.textContent = `${timeLeft}s`;

    if (timeLeft <= 0) {
        endGame(false);
    }
}

function endGame(won) {
    clearInterval(timerInterval);
    gameActive = false;
    
    if (won) {
        // Sexy Success Message and UI Update
        gameStatusElement.innerHTML = `
            <span class="success-message">
                ✨ I'm ready to get down on my knees and scrub every inch of the house... but first, let's clear the clutter from the bed and make sure we both end up feeling incredibly polished and satisfied. ✨
            </span>`;
        room.classList.add('clean'); // Change background image
        nextButton.style.display = 'block';
    } else {
        gameStatusElement.innerHTML = `<span class="success-message" style="color: #b33939;">⏰ Time's up! Try again to clean the house before Dhanteras!</span>`;
        nextButton.textContent = 'Try Again →';
        nextButton.style.display = 'block';
        nextButton.onclick = () => location.reload(); // Reload to try again
    }
}

// Start the game
setupItems();
updateScoreBoard();

nextButton.onclick = () => {
  window.location.href = "../sweet-chef/index.html"; // Assuming the next page is game9.html like in your inspiration
};