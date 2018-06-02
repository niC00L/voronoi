let vw = $(window).width();
let vh = $(window).height();

function setup() {
    createCanvas(vw, vh);
    console.log(vw, vh);
    noLoop();
}

function draw() {
    points = getPoints(10);
    noStroke();
    let d = pixelDensity();
    let i;
    let j;
    for (i = 1; i <= vw * d; i++) {
        for (j = 1; j <= vh * d; j++) {
            c = closestPoint({x: i, y: j}, points).color;
            set(i, j, c);
        }
    }
    updatePixels();
}

function getPoints(count) {
    let points = [];
    let i;
    for (i = 0; i <= count; i++) {
        points.push({x: random(0, vw), y: random(0, vh), color: color(random(0, 255), random(0, 255), random(0, 255))});
    }
    return points;
}

function distance(point1, point2) {
    a = abs(point1.x - point2.x);
    b = abs(point1.y - point2.y);
    return Math.sqrt(a * a + b * b);
}

function closestPoint(point, points) {
    let closest = points[0];
    let d = distance(point, closest);
    points.forEach(function (p) {
        var newD = distance(point, p);
        if (newD < d) {
            closest = p;
            d = newD;
        }
    });
    return closest;
}