// Elements
const canvas = document.getElementById('rangoli-canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.querySelector('.color-picker');
const clearBtn = document.getElementById('clear-btn');
const undoBtn = document.getElementById('undo-btn');
const symmetryBtn = document.getElementById('symmetry-btn');
const saveBtn = document.getElementById('save-btn');
const sexyMsg = document.getElementById('sexy-msg');
const nextBtn = document.getElementById('next-btn');
const brushRange = document.getElementById('brush-size');
const brushValue = document.getElementById('brush-value');

// State
const colors = ['#b33939','#e67e22','#ffd966','#ff7979','#6a89cc','#38ada9','#f8b195','#c06c84'];
let currentColor = colors[0];
let isDrawing = false;
let symmetry = true;
let lastX = 0, lastY = 0;
let history = [];

// Initialize canvas (fill white) and save initial state
function initCanvas() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  pushHistory();
}
initCanvas();

// Build color picker
colors.forEach((c, i) => {
  const d = document.createElement('div');
  d.className = 'color-option';
  d.style.background = c;
  if (i === 0) d.classList.add('active');
  d.addEventListener('click', () => {
    document.querySelectorAll('.color-option').forEach(x=>x.classList.remove('active'));
    d.classList.add('active');
    currentColor = c;
  });
  colorPicker.appendChild(d);
});

// Brush size control
brushRange.addEventListener('input', () => {
  brushValue.textContent = brushRange.value;
});
brushValue.textContent = brushRange.value;

// Drawing helpers
function drawLine(x1,y1,x2,y2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.stroke();
}
function drawSymmetryLines(x1,y1,x2,y2, color, width) {
  const w = canvas.width, h = canvas.height;
  // main
  drawLine(x1,y1,x2,y2,color,width);
  // vertical mirror
  drawLine(w - x1, y1, w - x2, y2, color, width);
  // horizontal mirror
  drawLine(x1, h - y1, x2, h - y2, color, width);
  // both axes (rotated 180)
  drawLine(w - x1, h - y1, w - x2, h - y2, color, width);
}

// Mouse events
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  // Use offsetX/Y for mouse relative to canvas
  lastX = e.offsetX;
  lastY = e.offsetY;
});
canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;
  const x = e.offsetX, y = e.offsetY;
  const width = parseInt(brushRange.value,10) || 3;
  if (symmetry) {
    drawSymmetryLines(lastX, lastY, x, y, currentColor, width);
  } else {
    drawLine(lastX, lastY, x, y, currentColor, width);
  }
  lastX = x; lastY = y;
});
function stopDrawingAndSave() {
  if (!isDrawing) return;
  isDrawing = false;
  pushHistory();
}
canvas.addEventListener('mouseup', stopDrawingAndSave);
canvas.addEventListener('mouseout', stopDrawingAndSave);

// Touch support (basic)
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const t = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  lastX = t.clientX - rect.left;
  lastY = t.clientY - rect.top;
  isDrawing = true;
});
canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  if (!isDrawing) return;
  const t = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = t.clientX - rect.left;
  const y = t.clientY - rect.top;
  const width = parseInt(brushRange.value,10) || 3;
  if (symmetry) drawSymmetryLines(lastX, lastY, x, y, currentColor, width);
  else drawLine(lastX, lastY, x, y, currentColor, width);
  lastX = x; lastY = y;
});
canvas.addEventListener('touchend', (e) => { stopDrawingAndSave(); });

// History (Undo) helpers
function pushHistory() {
  // keep history max 25 states to avoid memory bloat
  try {
    history.push(canvas.toDataURL());
    if (history.length > 25) history.shift();
  } catch (err) {
    console.warn('Unable to push history', err);
  }
}
function undo() {
  if (history.length <= 1) {
    // clear to white if only initial state or none
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    history = [canvas.toDataURL()];
    return;
  }
  // remove current state
  history.pop();
  const last = history[history.length - 1];
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img,0,0);
  };
  img.src = last;
}

// Buttons
clearBtn.addEventListener('click', () => {
  ctx.fillStyle = 'white';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  history = [canvas.toDataURL()];
});

undoBtn.addEventListener('click', () => undo());

symmetryBtn.addEventListener('click', (e) => {
  symmetry = !symmetry;
  symmetryBtn.textContent = `Symmetry: ${symmetry ? 'ON' : 'OFF'}`;
});

// Save button — download and reveal sexy message + next
saveBtn.addEventListener('click', () => {
  try {
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'rangoli.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (err) {
    console.error('save failed', err);
  }

  sexyMsg.style.display = 'block';
  nextBtn.style.display = 'inline-block';
});

// initialize: ensure a starting state in history
if (!history.length) pushHistory();
