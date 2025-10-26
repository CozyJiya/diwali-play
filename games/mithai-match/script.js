const sweets = ['🍪', '🍯', '🍬', '🍭', '🍡', '🍫']; // 6 sweets
let sweetPairs = [...sweets, ...sweets]; // duplicate to make pairs

let firstChoice = null;
let secondChoice = null;
let lockBoard = false;
let matches = 0;

const board = document.getElementById('game-board');
const winMessage = document.getElementById('win-message');
const nextBtn = document.getElementById('next-btn');

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function createBoard() {
    board.innerHTML = '';
    matches = 0;
    winMessage.classList.add('hidden');
    nextBtn.classList.add('hidden');

    const mix = shuffle([...sweetPairs]);
    mix.forEach(sweet => {
        const tile = document.createElement('div');
        tile.classList.add('sweet');
        tile.dataset.sweet = sweet;
        tile.textContent = "";
        tile.addEventListener('click', flipSweet);
        board.appendChild(tile);
    });
}

function flipSweet(e) {
    if (lockBoard) return;
    const sweet = e.target;
    if (sweet === firstChoice) return;

    sweet.textContent = sweet.dataset.sweet;

    if (!firstChoice) {
        firstChoice = sweet;
        return;
    }

    secondChoice = sweet;
    checkMatch();
}

function checkMatch() {
    if (firstChoice.dataset.sweet === secondChoice.dataset.sweet) {
        firstChoice.removeEventListener('click', flipSweet);
        secondChoice.removeEventListener('click', flipSweet);
        matches++;

        if (matches === sweets.length) {
            setTimeout(showWin, 500);
        }

        resetChoices();
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstChoice.textContent = "";
            secondChoice.textContent = "";
            resetChoices();
        }, 800);
    }
}

function resetChoices() {
    [firstChoice, secondChoice] = [null, null];
    lockBoard = false;
}

function showWin() {
    winMessage.classList.remove('hidden');
    nextBtn.classList.remove('hidden');
}

document.getElementById('restart-btn').addEventListener('click', createBoard);

createBoard();
