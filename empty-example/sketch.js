let vw = $(window).width() - 300;
let vh = $(window).height() - 200;
let voronoi = d3.voronoi();
let img;
let points;
let initSeed;
let seed;
let imgData;

function setup() {
    createCanvas(vw, vh, SVG);

    createUI();

    newSeed();
    makePoints();
    noLoop();
}

function draw() {
    background(bgColor.value());
    let fillColor = fgColor.value();
    if (img) {
        image(img, 0, 0, vw, vh);
        fgColor.hide();
        fillColor = null;
    } else {
        fgColor.show();
        fillColor = fgColor.value();
    }
    voronoi.extent([[0, 0], [vw, vh]]);
    let vp = voronoi(points).polygons();

    drawPolygons(vp, points, fillColor, outColor.value(), strokeSlider.value());
}

function newSeed() {
    initSeed = Math.random();
}

function randomize() {
    newSeed();
    makePoints();
}

function makePoints() {
    seed = initSeed;
    let grid = gridSize(vw, vh, countSlider.value());

    if (gridType.value() === "Grid") {
        noiseSlider.show();
        points = gridPoints(vw, vh, grid[0], grid[1], Math.floor(vw / grid[0] / 2));
    } else if (gridType.value() === "Random") {
        noiseSlider.hide();
        points = randomPoints([0, 0], [vw, vh], countSlider.value());
    }
    draw();
}

function gridSize(width, height, count) {
    let imgP = width * height;
    let squareP = imgP / count;
    let squareS = Math.sqrt(squareP);
    let xCount = Math.ceil(width / squareS);
    let yCount = Math.ceil(height / squareS);
    return [xCount, yCount];
}

function gridPoints(width, height, xCount, yCount, offset) {
    let side = width / xCount;
    let points = [];
    let noise = noiseSlider.value() * 100 / (xCount * yCount);
    for (let i = 0; i < xCount; i++) {
        for (let j = 0; j < yCount; j++) {
            let x = Math.floor(i * side + offset);
            let y = Math.floor(j * side + offset);
            points.push([x + seededRandom(-noise, noise), y + seededRandom(-noise, noise)]);
        }
    }
    return points;
}

function randomPoints(start, end, count) {
    let points = [];
    for (let i = 0; i <= count; i++) {
        points.push([seededRandom(start[0], end[0]), seededRandom(start[1], end[1])]);
    }
    return points;
}

function polygon(points) {
    beginShape();
    points.forEach(function (p) {
        vertex(p[0], p[1]);
        // bezierVertex(p[0], p[1]);

    });
    endShape(CLOSE);
}

function drawPolygons(vp, points, color, outline, stWeight) {
    for (let i = 0; i < vp.length; i++) {
        let plg = vp[i];
        let p = points[i];
        if (plg) {
            push();
            if (color) {
                fill(color);
            } else {
                fill(img.get(p[0], p[1]));
            }
            if (outline) {
                stroke(outline);
                strokeWeight(stWeight);
                strokeJoin(ROUND);
                strokeCap(ROUND);
            } else {
                noStroke();
            }
            smooth();
            polygon(plg);
            pop();
        }
    }
}