var canvas;
var ctx;

window.addEventListener('load', () => {
    canvas = document.getElementById('foreground');
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
    ctx = canvas.getContext('2d');
});

window.setInterval(draw, 1000 / 60);

function draw() {
    
}
