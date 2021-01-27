var canvas;
var ctx;
var colors = [];

const size = 25;
const overflow = 2;
const points = 10;

window.addEventListener('resize', setCanvasSize);
window.addEventListener('load', () => {
    canvas = document.getElementById('background');
    setCanvasSize();
    //window.setInterval(animate, 1000 / 25);
});

function setCanvasSize() {
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
    ctx = canvas.getContext('2d');
    if (colors.length == 0) initColors();
    for (let i = 0; i < 100; ++i) draw();
}

function initColors() {
    function randomColor() {
        let color = [];
        for (let i = 0; i < 3; ++i)
            color.push(Math.floor(Math.random() * 256));
        return color;
    }

    function randomCoord(length) {
        return Math.floor(Math.random() * (length - size * 2)) + size;
    }

    colors = [];
    for (let i = 0; i < points; ++i)
        colors.push({'x': randomCoord(canvas.width), 'y': randomCoord(canvas.height), 'c': randomColor()});
}

function drawColors() {
    for (const c of colors) {
        ctx.fillStyle = rgba(c.c, 1);
        ctx.beginPath();
        ctx.arc(c.x, c.y, 5, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }
}

function animate() {
    
    //draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < canvas.height + size * overflow; y += size) {
        for (let x = 0; x < canvas.width + size * overflow; x += size) {
            let grd = ctx.createRadialGradient(x, y, 0, x, y, size * overflow);
            let clr = gradientColor(x, y);
            grd.addColorStop(0, rgba(clr, 1));
            grd.addColorStop(1, rgba(clr, 0));
            ctx.fillStyle = grd;
            ctx.fillRect(x - size * overflow, y - size * overflow, canvas.width - x + size * overflow, canvas.height - y + size * overflow);
        }
    }
}

function drawFull() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let img = ctx.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < img.data.length; i += 4) {
        let clr = gradientColor((i / 4) % canvas.width, Math.floor((i / 4) / canvas.width));
        for (let j = 0; j < 3; ++j)
            img.data[i + j] = clr[j];
        img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
}

function gradientColor(x, y) {
    function angle(x1, y1, x2, y2, x3, y3) {
        let dot = ((x2 - x1) * (x2 - x3) + (y2 - y1) * (y2 - y3));
        let cross = ((x2 - x1) * (y2 - y3) - (y2 - y1) * (x2 - x3));
        return Math.abs(Math.atan2(cross, dot));
    }

    let scale = 0;
    let clr = [0, 0, 0];
    for (const c1 of colors) {
        let m = 1;
        for (const c2 of colors) {
            if (c1.x == c2.x && c1.y == c2.y) continue;
            let a1 = angle(x, y, c1.x, c1.y, c2.x, c2.y);
            let a2 = angle(x, y, c2.x, c2.y, c1.x, c1.y);
            let a = a2 == 0 ? 1 : Math.pow(a1 / a2, 2);
            m = Math.min(m, a);
        }
        scale += m;
        for (let i = 0; i < clr.length; ++i)
            clr[i] += c1.c[i] * m;
    }
    return clr.map((x) => (x /= scale));
}

function rgba(c, a) {
    return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;
}
