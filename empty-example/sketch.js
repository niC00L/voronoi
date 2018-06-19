let w = $(window).width() - 300;
let h = $(window).height() - 200;
let voronoi = d3.voronoi();
let countSlider;
let noiseSlider;
let gridType;
let file;
let img;
let bgColor;
let fgColor;
let outColor;

function setup() {
    createCanvas(vw, vh);
    noLoop();
    countSlider = createSlider(1, 100, 30);
    noiseSlider = createSlider(0, 50, 0);
    countSlider.input(draw);
    noiseSlider.input(draw);
    gridType = createRadio();
    gridType.option("Grid");
    gridType.option("Random");
    gridType.input(draw);
    file = createFileInput(handleFile);
    file.input(draw);
}

function handleFile(file) {
    if (file.type === "image") {
        img = createImg(file.data).hide();
        resizeCanvas(img.width, img.height);
    }
}

function draw() {
    if (img) {
        w = img.width;
        h = img.height;
        image(img, 0, 0, w, h);
    } else {}
    let grid = gridSize(w, h, countSlider.value());
    let points;

    if (gridType.value() === "Grid") {
        noiseSlider.show();
        points = gridPoints(w, h, grid[0], grid[1], Math.floor(w / grid[0] / 2));
    } else if (gridType.value() === "Random") {
        noiseSlider.hide();
        points = randomPoints([0, 0], [w, h], countSlider.value());
    }
    // } else {
    //     points = triangleGrid(gridPoints(img.width, img.height, grid[0], grid[1], 0), grid[1]);
    // }
    voronoi.extent([[0, 0], [vw, vh]]);
    let vp = voronoi(points).polygons();

    for (let i = 0; i < vp.length; i++) {
        let plg = vp[i];
        let p = points[i];
        if (plg) {
            push();
            fill(get(p[0], p[1]));
            polygon(plg);
            pop();
        }
    }
}

function randomPoints(start, end, count) {
    let points = [];
    for (let i = 0; i <= count; i++) {
        points.push([random(start[0], end[0]), random(start[1], end[1])]);
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
            points.push([x + random(-noise, noise), y + random(-noise, noise)]);
            // points.push([x, y]);
        }
    }
    return points;
}

function triangleGrid(grid, yCount) {
    let side = Math.floor(img.height / yCount);
    let p = 2;
    for (let i = 0; i < grid.length; i++) {
        if (i % 2 === 0) {
            // grid[i][1] += (side);
            grid[i][0] += (side / 2);
        }
    }
    //     if (p % 2 === 0) {
    //         console.log(i);
    //         console.log(grid[i]);
    //         // grid[i][0] += (side);
    //         grid[i][1] += (side/2);
    //         // grid[i][0] += (side/2);
    //         // console.log(2, grid[i]);
    //     }
    //     if ((i+1) % Math.floor(xCount) === 0) {
    //         p += 1;
    //     }
    // }
    return grid;
}

function polygon(points) {
    beginShape();
    points.forEach(function (p) {
        vertex(p[0], p[1]);
    });
    endShape(CLOSE);
}