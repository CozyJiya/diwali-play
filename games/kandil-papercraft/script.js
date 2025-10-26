const canvas = document.getElementById('cutCanvas');
const ctx = canvas.getContext('2d');

let drawing = false;
let paths = [];
let currentPath = [];

// DOM Elements for State Management
const drawingState = document.getElementById('drawingState');
const unfoldedState = document.getElementById('unfoldedState');
const unfoldBtn = document.getElementById('unfoldBtn');
const lightBtn = document.getElementById('lightBtn');
const tasselsBtn = document.getElementById('tasselsBtn');
const saveBtn = document.getElementById('saveBtn');
const sexyMessage = document.getElementById('sexyMessage');
const nextBtn = document.getElementById('nextBtn');


// Draw upside-down triangle for folded paper
function drawFoldedTriangle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#b33939";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 280); // Bottom point (Apex)
    ctx.lineTo(280, 20); // Top right (Base)
    ctx.lineTo(20, 20); // Top left (Base)
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

drawFoldedTriangle(); // Initial draw

// --- Canvas Drawing Logic (Unchanged) ---
canvas.addEventListener('mousedown', e => {
    drawing = true;
    currentPath.push({ x: e.offsetX, y: e.offsetY });
    ctx.strokeStyle = "#b33939";
    ctx.lineWidth = 2;
});

canvas.addEventListener('mousemove', e => {
    if (!drawing) return;
    const point = { x: e.offsetX, y: e.offsetY };
    currentPath.push(point);
    ctx.beginPath();
    ctx.moveTo(currentPath[currentPath.length - 2].x, currentPath[currentPath.length - 2].y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
});

canvas.addEventListener('mouseup', e => {
    drawing = false;
    if (currentPath.length > 0) {
        paths.push([...currentPath]);
    }
    currentPath = [];
});

canvas.addEventListener('mouseout', e => {
    drawing = false;
});

// Undo & Clear
document.getElementById('undoBtn').onclick = () => {
    paths.pop();
    redraw();
};

document.getElementById('clearBtn').onclick = () => {
    paths = [];
    redraw();
};

// Redraw function
function redraw() {
    drawFoldedTriangle();
    ctx.strokeStyle = "#b33939";
    ctx.lineWidth = 2;
    paths.forEach(path => {
        ctx.beginPath();
        if (path.length > 1) {
            ctx.moveTo(path[0].x, path[0].y);
            for (let i = 1; i < path.length; i++) {
                ctx.lineTo(path[i].x, path[i].y);
            }
        } else if (path.length === 1) {
            ctx.arc(path[0].x, path[0].y, 1, 0, Math.PI * 2);
        }
        ctx.stroke();
    });
}
// ------------------------------------------

// Unfold triangle to radial pattern
unfoldBtn.onclick = () => {
    drawingState.classList.add('hidden');
    unfoldedState.classList.remove('hidden');

    const unfolded = document.getElementById('unfoldedKandil');
    unfolded.innerHTML = ''; 

    const width = 300;
    const height = 300;
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("viewBox", "0 0 300 300");

    // Define Glow Filter
    const defs = document.createElementNS(svgNS, "defs");
    const filter = document.createElementNS(svgNS, "filter");
    filter.setAttribute("id", "glow");
    filter.innerHTML = `<feGaussianBlur stdDeviation="5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>`;
    defs.appendChild(filter);
    svg.appendChild(defs);

    for (let i = 0; i < 6; i++) {
        const g = document.createElementNS(svgNS, "g");
        g.setAttribute("transform", `rotate(${i * 60}, 150, 150)`);

        paths.forEach(path => {
            const polyline = document.createElementNS(svgNS, "polyline");
            let transformedPoints = path.map(p => {
                return `${p.x},${p.y}`;
            }).join(" ");

            polyline.setAttribute("points", transformedPoints);
            polyline.setAttribute("fill", "none");
            polyline.setAttribute("stroke", "#b33939");
            polyline.setAttribute("stroke-width", "2");
            polyline.setAttribute("stroke-linejoin", "round");
            polyline.setAttribute("stroke-linecap", "round");
            g.appendChild(polyline);
        });
        svg.appendChild(g);
    }
    unfolded.appendChild(svg);
};

// Add light - only applies glow to the SVG paths
lightBtn.onclick = () => {
    const svgElement = document.querySelector('#unfoldedKandil svg');
    if (svgElement) {
        const pathsInSVG = svgElement.querySelectorAll('polyline');
        pathsInSVG.forEach(path => {
            path.setAttribute('filter', 'url(#glow)');
            path.setAttribute('stroke', '#FFD700'); // Golden color for light
        });
        // Removed box-shadow and background-color from wrapper
        // The glow now emanates purely from the SVG paths.
    }
};

// Add tassels
tasselsBtn.onclick = () => {
    const tasselContainer = document.getElementById('tasselContainer');
    tasselContainer.innerHTML = ''; 

    for (let i = 0; i < 5; i++) {
        const tassel = document.createElement('div');
        tassel.className = 'tassel';

        for(let j = 0; j < 5; j++) {
            const fringe = document.createElement('div');
            tassel.appendChild(fringe);
        }
        tasselContainer.appendChild(tassel);
    }
};

// Save - Only show the 'Next' button after saving
saveBtn.onclick = () => {
    // Capture the entire game container, allowing the transparent background for the kandil
    html2canvas(document.querySelector('.game-container'), {
        backgroundColor: '#ffecc7', // Use the game-container's background color
        useCORS: true, 
        allowTaint: true,
        scale: 2 
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'kandil.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        sexyMessage.classList.remove('hidden');
        nextBtn.classList.remove('hidden');
    });
};