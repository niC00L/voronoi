let vw = $(window).width() - 300;
let vh = $(window).height() - 200;
let voronoi = d3.voronoi();
let countSlider;
let noiseSlider;
let strokeSlider;
let gridType;
let fileInput;
let img;
let bgColor;
let fgColor;
let outColor;
let points;
let initSeed;
let seed;
let saveConfigButton;
let loadConfigButton;
let imgData;
let saveButton;
let clearImgButton;

function loadConfig(config) {
    initSeed = config.initSeed;
    countSlider.value(config.count);
    noiseSlider.value(config.noise);
    strokeSlider.value(config.stroke);
    gridType.value(config.gridType);
    bgColor.value(config.bgColor);
    fgColor.value(config.fgColor);
    outColor.value(config.outColor);
    handleFile(config.img);
    makePoints();
    draw();
}

function saveConfig() {
    let config = {
        "initSeed": initSeed,
        "count": countSlider.value(),
        "noise": noiseSlider.value(),
        "stroke": strokeSlider.value(),
        "gridType": gridType.value(),
        "bgColor": bgColor.value(),
        "fgColor": fgColor.value(),
        "outColor": outColor.value(),
        "img": {
            "data": imgData,
            "type": "image",
            "width": vw,
            "height": vh
        }
    };
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config));
    let dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "config.json");
    dlAnchorElem.click();
}

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
    createCanvas(vw, vh, SVG);

    countSlider = createSlider(1, 100, 30);
    noiseSlider = createSlider(0, 50, 0);
    strokeSlider = createSlider(0, 100, 2);
    strokeSlider.input(draw);
    countSlider.input(makePoints);
    noiseSlider.input(makePoints);

    gridType = createRadio();
    gridType.option("Grid");
    gridType.option("Random");
    gridType.value("Random");
    gridType.changed(makePoints);

    fileInput = createFileInput(handleFile);
    // fileInput.input(makePoints);

    bgColor = createInput('#ffffff', 'color');
    fgColor = createInput('#ffffff', 'color');
    outColor = createInput('#000000', 'color');
    bgColor.input(draw);
    fgColor.input(draw);
    outColor.input(draw);

    saveConfigButton = createButton("Save config");
    saveConfigButton.mousePressed(saveConfig);

    loadConfigButton = createFileInput(handleFile);

    saveButton = createButton("Save SVG");
    saveButton.mousePressed(saveImg);

    clearImgButton = createButton("Clear image");
    clearImgButton.mousePressed(clearImg);

    newSeed();
    makePoints();
    noLoop();
}

function clearImg() {
    imgData = null;
    img = null;
    draw();
}

function saveImg() {
    save();
}

function handleFile(file) {
    if (file.type === "image") {
        imgData = file.data;
        img = loadImage(file.data, function () {
            vw = img.width;
            vh = img.height;
            resizeCanvas(vw, vh);
            makePoints();
        });
    } else if (file.subtype === "json") {
        loadConfig(JSON.parse(Get(file.data)));
    }
}

function Get(yourUrl) {
    let Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET", yourUrl, false);
    Httpreq.send(null);
    return Httpreq.responseText;
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

function randomPoints(start, end, count) {
    let points = [];
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
        // bezierVertex(p[0], p[1]);

    });
    endShape(CLOSE);
}