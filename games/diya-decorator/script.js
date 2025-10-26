const canvas = document.getElementById('diya-canvas');
const ctx = canvas.getContext('2d');
let currentColor = '#FF4B2B';
let currentTool = 'paint';
let isDrawing = false;

// Draw initial diya shape
function drawDiyaShape() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 - 30; // moved up by 70px from previous

    // Bowl gradient
    const bowlGradient = ctx.createRadialGradient(centerX, centerY, 30, centerX, centerY, 150);
    bowlGradient.addColorStop(0, '#f4d4a4'); // lighter inside
    bowlGradient.addColorStop(1, '#deaa7f'); // darker edges
    ctx.fillStyle = bowlGradient;

    // Bowl of the diya
    ctx.beginPath();
    ctx.moveTo(centerX - 150, centerY);
    ctx.quadraticCurveTo(centerX, centerY - 100, centerX + 150, centerY); // top curve
    ctx.quadraticCurveTo(centerX, centerY + 80, centerX - 150, centerY); // bottom curve
    ctx.closePath();
    ctx.fill();

    // Bowl outline
    ctx.strokeStyle = '#b36b36';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Decorative base
    ctx.beginPath();
    ctx.moveTo(centerX - 130, centerY);
    ctx.quadraticCurveTo(centerX, centerY + 60, centerX + 130, centerY);
    ctx.strokeStyle = '#b36b36';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Wick
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(centerX - 5, centerY - 80, 10, 25);

    // Flame placeholder
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 80);
    ctx.quadraticCurveTo(centerX + 10, centerY - 110, centerX + 5, centerY - 80);
    ctx.quadraticCurveTo(centerX, centerY - 95, centerX, centerY - 80);
    ctx.fillStyle = 'orange';
    ctx.fill();
}

drawDiyaShape();

// Tool buttons
document.getElementById('paint-btn').addEventListener('click', () => selectTool('paint', 'paint-btn'));
document.getElementById('glitter-btn').addEventListener('click', () => selectTool('glitter', 'glitter-btn'));
document.getElementById('bead-btn').addEventListener('click', () => selectTool('bead', 'bead-btn'));
document.getElementById('clear-btn').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDiyaShape();
});

function selectTool(tool, btnId) {
    currentTool = tool;
    document.querySelectorAll('.tools button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(btnId).classList.add('active');
}

// Color picker
document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', (e) => {
        document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
        e.target.classList.add('active');
        currentColor = getComputedStyle(e.target).backgroundColor;
    });
});

// Drawing functionality
canvas.addEventListener('mousedown', () => isDrawing = true);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);

function draw(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if(currentTool === 'paint') drawCircle(x, y, 5, currentColor);
    else if(currentTool === 'glitter') drawGlitter(x, y);
    else if(currentTool === 'bead') drawBead(x, y);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawGlitter(x, y) {
    const colors = ['#FFD700','#FFF8DC','#FFFACD'];
    for(let i=0;i<5;i++){
        const px = x + (Math.random()-0.5)*15;
        const py = y + (Math.random()-0.5)*15;
        const size = Math.random()*2+1;
        ctx.fillStyle = colors[Math.floor(Math.random()*colors.length)];
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI*2);
        ctx.fill();
    }
}

function drawBead(x, y){
    const gradient = ctx.createRadialGradient(x-1,y-1,1,x,y,4);
    gradient.addColorStop(0,'#fff');
    gradient.addColorStop(0.5,currentColor);
    gradient.addColorStop(1,'#000');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x,y,4,0,Math.PI*2);
    ctx.fill();
}

// Save Rangoli
document.getElementById('save-btn').addEventListener('click', () => {
    const dataUrl = canvas.toDataURL();
    localStorage.setItem('decoratedDiya', dataUrl);

    const msg = document.getElementById('save-message');
    msg.innerText = "💖 Forget the clay, I want to decorate you... I've got a special kind of glow I want to light up all over your body. Let's make this a hands-on project. 🔥";
    msg.style.display = 'block';

    document.getElementById('next-btn').style.display = 'inline-block';
});
