const decoratedDiya = localStorage.getItem('decoratedDiya');
if(decoratedDiya) document.getElementById('decorated-diya').src = decoratedDiya;

const sweetSpot = document.querySelector('.sweet-spot');
const cursor = document.querySelector('.cursor');
const flame = document.querySelector('.flame');
const wind = document.querySelector('.wind');
const nextButton = document.getElementById('next-btn');
const sexyMessage = document.getElementById('sexy-message');
const stopBtn = document.getElementById('stop-btn');

const barWidth = 300;
const sweetWidth = 20; // small sweet spot
let cursorPos = 0;
let direction = 1;
let speed = 5; // slightly slower
let isLit = false;
let isStopped = false;

// Randomly position sweet spot
function positionSweetSpot(){
    const position = Math.random() * (barWidth - sweetWidth);
    sweetSpot.style.left = `${position}px`;
}
positionSweetSpot();

// Animate cursor
function animateCursor(){
    if(isLit || isStopped) return;

    cursorPos += speed * direction;
    if(cursorPos <= 0 || cursorPos >= (barWidth - 5)) direction *= -1;

    // Random bursts of speed
    if(Math.random() < 0.02) speed = 4 + Math.random() * 4;

    cursor.style.left = `${cursorPos}px`;
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Handle click to light diya
document.addEventListener('click', () => {
    if(isLit) return;

    const cursorLeft = cursor.offsetLeft;
    const sweetLeft = sweetSpot.offsetLeft;

    if(cursorLeft >= sweetLeft && cursorLeft <= (sweetLeft + sweetWidth)){
        // Success
        flame.style.opacity = '1';
        isLit = true;
        nextButton.style.display = 'inline-block';
        sexyMessage.innerText = "🔥 It's time for our own private Diwali. Let's turn off the main lights and use the sparks between us to illuminate the room. I'm ready for a power outage where we generate all the heat. 🔥";
    } else {
        // Failed attempt
        wind.style.display = 'block';
        setTimeout(() => { wind.style.display = 'none'; }, 800);
        positionSweetSpot();
    }
});

// Stop button
stopBtn.addEventListener('click', () => {
    isStopped = !isStopped;
    stopBtn.innerText = isStopped ? "Resume" : "Stop";
    if(!isStopped) animateCursor();
});
