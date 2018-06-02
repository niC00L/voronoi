let vw = $(window).width() - 300;
let vh = $(window).height();
let voronoi = d3.voronoi();

function preload() {
    img = loadImage('./sample-image.jpg');
}

function setup() {
    createCanvas(vw, vh);
    noLoop();
}

function draw() {
    // image(img, 0, 0);

    let points = gridPoints(img.width, img.height, 40, 30);
    voronoi.extent([[0, 0], [vw, vh]]);
    let vp = voronoi(points).polygons();
    alert("vypocitane");

    for (let i = 0; i < vp.length; i++) {
        let plg = vp[i];
        let p = points[i];
        if (plg) {
            push();
            fill(img.get(p[0], p[1]));
            polygon(plg);
            pop();
        }
    }
    alert("vykreslene");
    // vp.forEach(function (p) {
    //     push();
    //     fill(img.get[p]);
    //     polygon(p);
    // });
}

function randomPoints(start, end, count) {
    let points = [];
    for (let i = 0; i <= count; i++) {
        points.push([random(start[0], end[0]), random(start[1], end[1])]);
    }
    return points;
}

function gridPoints(width, height, xCount, yCount) {
    let xdist = width / xCount;
    let ydist = height / yCount;
    let points = [];
    for (let i = 0; i < xCount; i++) {
        for (let j = 0; j < yCount; j++) {
            let x = i*xdist;
            let y = j*ydist;
            points.push([x + random(-10,10), y + random(-10,10)]);
            // points.push([x, y]);
        }
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