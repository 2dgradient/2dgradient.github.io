var canvas;
var context;
var colors;

var config = {
    intVal: (query) => (parseInt(document.querySelector(query).value)),
    size: () => (config.intVal('#size')),
    points: () => (config.intVal('#points')),
    shapeSpeed: () => (config.intVal('#shapeSpeed')),
    colorSpeed: () => (config.intVal('#colorSpeed')),
    screenBounds: () => ([[0, canvas.width - 1], [0, canvas.height - 1]]),
    colorBounds: () => {
        const v = (query) => (config.intVal(query));
        return [[v('.min.red'), v('.max.red')], [v('.min.green'), v('.max.green')], [v('.min.blue'), v('.max.blue')]];
    }
};

window.addEventListener('load', () => {
    canvas = document.getElementById('canvas');
    window.addEventListener('resize', setCanvasSize);
    setCanvasSize();
    initColors();
    draw();
    window.setInterval(animate, 1000 / 30);
});

function setCanvasSize() {
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
    context = canvas.getContext('2d');
    if (colors) draw();
}

function initColors() {
    const array = (l, f) => (Array.from({length: l}, (_, i) => (f(i))));
    colors = array(config.points(), () => ({
        p: array(2, (i) => (randRange(config.screenBounds()[i]))),
        c: array(3, (i) => (randRange(config.colorBounds()[i]))),
        dp: array(2, () => (Math.random() - 0.5)),
        dc: array(3, () => (Math.random() - 0.5))
    }));
}

function animate() {
    const sign = (v, s) => ((v < 0 && s > 0) || (v > 0 && s < 0) ? v * -1 : v);
    const apply = (v, d, m, b, c) => {
        c[v] = c[v].map((x, i) => (x + c[d][i] * m));
        c[d] = c[d].map((x, i) => (c[v][i] < b[i][0] || c[v][i] > b[i][1] ? sign(x, b[i][0] - c[v][i]) : x));
        return c;
    };
    colors = colors.map((c) => (apply('c', 'dc', config.colorSpeed(), config.colorBounds(), apply('p', 'dp', config.shapeSpeed(), config.screenBounds(), c))));
    draw();
}

function draw() {
    const overflow = 2;
    const size = config.size();
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < canvas.height + size; y += size) {
        for (let x = 0; x < canvas.width + size; x += size) {
            let clr = gradientColor(x, y);
            let grd = context.createRadialGradient(x, y, 0, x, y, size * overflow);
            grd.addColorStop(0, rgba(clr, 1));
            grd.addColorStop(1, rgba(clr, 0));
            context.fillStyle = grd;
            context.fillRect(x - size * overflow, y - size * overflow, size * overflow * 2, size * overflow * 2);
        }
    }
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
            if (c1 == c2) continue;
            let a1 = angle(x, y, c1.p[0], c1.p[1], c2.p[0], c2.p[1]);
            let a2 = angle(x, y, c2.p[0], c2.p[1], c1.p[0], c1.p[1]);
            m = Math.min(m, a2 == 0 ? 1 : Math.pow(a1 / a2, 2));
        }
        clr = clr.map((x, i) => (x + c1.c[i] * m));
        scale += m;
    }
    return clr.map((x) => (x / scale));
}

function rgba(c, a) {
    c = c.map((x) => (Math.max(0, Math.min(255, x))));
    return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;
}

function randRange(bounds) {
    return Math.floor(Math.random() * (bounds[1] - bounds[0] + 1)) + bounds[0];
}
