let vw = $(window).width() - 300;
let vh = $(window).height() - 200;
let voronoi = d3.voronoi();
let countSlider;
let noiseSlider;
let strokeSlider;
let gridType;
let file;
let img;
let bgColor;
let fgColor;
let outColor;
let points;
let initSeed;
let seed;

function seededRandom(max, min) {
    max = max || 1;
    min = min || 0;

    seed = (seed * 9301 + 49297) % 233280;
    let rnd = seed / 233280;
    return min + rnd * (max - min);
}

function newSeed() {
    initSeed = Math.random();
}

function setup() {
    createCanvas(vw, vh);
    newSeed();
    noLoop();
    countSlider = createSlider(1, 100, 30);
    noiseSlider = createSlider(0, 50, 0);
    strokeSlider = createSlider(0, 100, 1);
    strokeSlider.input(draw);
    countSlider.input(makePoints);
    noiseSlider.input(makePoints);

    gridType = createRadio();
    gridType.option("Grid");
    gridType.option("Random");
    gridType.input(makePoints);

    file = createFileInput(handleFile);
    file.input(makePoints);

    bgColor = createInput('#ffffff', 'color');
    fgColor = createInput('#ffffff', 'color');
    outColor = createInput('#000000', 'color');
    bgColor.input(draw);
    fgColor.input(draw);
    outColor.input(draw);
}

function handleFile(file) {
    if (file.type === "image") {
        img = createImg(file.data).hide();
        resizeCanvas(img.width, img.height);
    }
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

function draw() {
    background(bgColor.value());
    let fillColor = fgColor.value();
    if (img) {
        vw = img.width;
        vh = img.height;
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

function drawPolygons(vp, points, color, outline, stWeight) {
    for (let i = 0; i < vp.length; i++) {
        let plg = vp[i];
        let p = points[i];
        if (plg) {
            push();
            if (color) {
                fill(color);
            } else {
                fill(get(p[0], p[1]));
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

function randomPoints(start, end, count) {
    let points = [];
    console.log(seed);
    for (let i = 0; i <= count; i++) {
        points.push([seededRandom(start[0], end[0]), seededRandom(start[1], end[1])]);
    }
    return points;
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

function polygon(points) {
    beginShape();
    points.forEach(function (p) {
        vertex(p[0], p[1]);
    });
    endShape(CLOSE);
}