let vw = $(window).width() - 300;
let vh = $(window).height();
let voronoi = d3.voronoi();

function setup() {
    createCanvas(vw, vh);
    noLoop();
}

function draw() {
    let points = getPoints(random(10, 50));
    voronoi.extent([[0, 0], [vw, vh]]);
    let vp = voronoi(points).polygons();
    vp.forEach(function (p) {
        push();
        fill(random(255), random(255), random(255));
        polygon(p);
        pop();
    });
}

function getPoints(count) {
    let points = [];
    let i;
    for (i = 0; i <= count; i++) {
        points.push([random(0, vw), random(0, vh)]);
    }
    return points;
}

function polygon(points) {
    beginShape();
    points.forEach(function (p) {
        vertex(p[0], p[1]);
    });
    endShape(CLOSE);
}