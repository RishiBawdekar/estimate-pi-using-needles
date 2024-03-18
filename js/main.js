const lineSpacing = 30;
const canvasWidth = 400;
const canvasHeight = 480;
const noOfLines = canvasHeight / lineSpacing;
const minAngleD = 1; // in degrees
const maxAngleD = 359; // in degrees
const minAngle = minAngleD * (Math.PI / 180); // in radians
const maxAngle = maxAngleD * (Math.PI / 180); // in radians
const needleLength = 25;
const startX = needleLength;
const startY = needleLength;
const endX = canvasWidth - needleLength;
const endY = canvasHeight - needleLength;
const stopSimAt = 0.5;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
// Flip the canvas vertically to match standard Cartesian coordinates
ctx.translate(0, canvas.height);
ctx.scale(1, -1);
// Set canvas dimensions to resemble paper
canvas.width = canvasWidth;
canvas.height = canvasHeight;

let needleCounter = 0;
let hits = 0;
let intervalId;
let misses = 0;

function throwNeedle() {

    document.querySelectorAll(".pi").values = "";

    // 1. Randomly generate Y coordinate between startY and endY
    let y = Math.floor(Math.random() * (endY - startY + 1)) + startY;
    // 2. Randomly generate angle
    let theta = Math.random() * (maxAngle - minAngle) + minAngle;
    // 3. Randomly generate X coordinate between startX and endX
    let x = Math.floor(Math.random() * (endX - startX + 1)) + startX;
    // 4. Calculate x1 and y1
    let x1 = Math.floor(x + needleLength * Math.cos(theta));
    let y1 = Math.floor(y + needleLength * Math.sin(theta));

    if (isThrow(x1, y1)) {
        needleCounter += 1;
        document.querySelector('#noOfPins').value = needleCounter;
        if (isHit(y, y1)) {
            hits += 1;
            document.querySelector('#noOfHits').value = hits;
            document.querySelector('#hitRatio').value = hits / needleCounter;
            let calPi = 2 * (needleLength / lineSpacing) * (needleCounter / hits);
            document.querySelector('#calPi').value = calPi;
            document.querySelector('#refPi').value = Math.PI;
            let error = ((Math.abs(Math.PI - calPi) / Math.PI) * 100).toFixed(2);
            document.querySelector("#perError").value = error;
            if (error <= stopSimAt) {
                clearInterval(intervalId);
            }
        }
        drawNeedle(x, y, x1, y1, 'red');
        // drawNeedle(x, y, theta, yMulipler);
    } else {
        // stop
    }
}

function isThrow(x, y) {
    if (x >= 0 && y >= 0) {
        return 1
    } else {
        return 0
    }

}

function isHit(y, y1) {
    const yDiv = Math.floor(y / lineSpacing);
    const y1Div = Math.floor(y1 / lineSpacing);
    const diff = Math.abs(yDiv - y1Div);
    if (diff == 1) {
        return 1
    } else {
        return 0
    }
}

function drawNeedle(x, y, x1, y1, color) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1)
    ctx.stroke();
}

// Function to draw horizontal lines
function drawLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    for (let y = 0; y < canvas.height; y += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function stopSimulation() {
    clearInterval(intervalId);
    drawLines();
    needleCounter = 0;
    hits = 0;
}

window.onload = function () {

    drawLines();

    // Event listener for window resize
    window.addEventListener('resize', function () {
        // resizeCanvas();
        drawLines();
    });
};

document.querySelector('.throw').addEventListener('click', (e) => {
    intervalId = setInterval(throwNeedle, 10);
});

document.querySelector('.clear').addEventListener('click', (e) => {
    stopSimulation();
});
