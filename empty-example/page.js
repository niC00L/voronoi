let countSlider;
let noiseSlider;
let strokeSlider;
let gridType;
let fileInput;
let bgColor;
let fgColor;
let outColor;
let saveConfigButton;
let loadConfigButton;
let saveButton;
let clearImgButton;
let randomizeButton;

$(function () {
    let sidebar = document.getElementById("sidebar");
    strokeSlider.parent(document.getElementById("uiStroke"));
    countSlider.parent(document.getElementById("uiCount"));
    noiseSlider.parent(document.getElementById("uiRandom"));

    gridType.parent(document.getElementById("uiGrid"));

    bgColor.parent(sidebar);
    fgColor.parent(document.getElementById("uiFgColor"));
    outColor.parent(document.getElementById("uiOutColor"));

    clearImgButton.parent(document.getElementById("uiFiles"));
    fileInput.parent(document.getElementById("uiFiles"));
    saveConfigButton.parent(document.getElementById("uiFiles"));
    loadConfigButton.parent(document.getElementById("uiFiles"));
    saveButton.parent(document.getElementById("uiFiles"));
    randomizeButton.parent(document.getElementById("uiRandom"));

    // $("#defaultradio0-0, [for=defaultradio0-0]").wrapAll("<div class='w' />");
    // $("#defaultradio0-1, [for=defaultradio0-1]").wrapAll("<div class='w' />");
    // $("#defaultradio0-0, [for=defaultradio0-0]").wrapAll("<div class='custom-control custom-radio' />");
    // $("#defaultradio0-1, [for=defaultradio0-1]").wrapAll("<div class='custom-control custom-radio' />");
    // $(".radios label").addClass("custom-control-label");
    $(".radios label").after("<br />");
    // $(".radios input").addClass("custom-control-input");
});

function createUI() {
    countSlider = createSlider(1, 150, 30);
    noiseSlider = createSlider(0, 80, 10);
    strokeSlider = createSlider(0, 100, 2);
    strokeSlider.input(draw);
    countSlider.input(makePoints);
    noiseSlider.input(makePoints);
    strokeSlider.class("slider");
    noiseSlider.class("slider");
    countSlider.class("slider");

    gridType = createRadio();
    gridType.option("Grid");
    gridType.option("Random");
    gridType.option("Custom");
    gridType.value("Random");
    gridType.changed(makePoints);

    fileInput = createFileInput(handleFile);

    bgColor = createInput('#ffffff', 'color');
    fgColor = createInput('#ffffff', 'color');
    outColor = createInput('#000000', 'color');
    bgColor.input(draw);
    bgColor.hide();
    fgColor.input(draw);
    outColor.input(draw);

    saveConfigButton = createButton("Save config");
    saveConfigButton.mousePressed(saveConfig);
    saveConfigButton.class("btn btn-primary btn-block");

    loadConfigButton = createFileInput(handleFile);
    loadConfigButton.class("btn btn-primary btn-block");
    loadConfigButton.hide();

    saveButton = createButton("Save SVG");
    saveButton.mousePressed(saveImg);
    saveButton.class("btn btn-primary btn-block");

    clearImgButton = createButton("Clear image");
    clearImgButton.mousePressed(clearImg);
    clearImgButton.class("btn btn-primary btn-block");
    clearImgButton.hide();

    randomizeButton = createButton("Randomize");
    randomizeButton.mousePressed(randomize);
    randomizeButton.class("btn btn-primary btn-block");
}

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

function clearImg() {
    imgData = null;
    img = null;
    vw = iw;
    vh = ih;
    resizeCanvas(iw, ih);
    makePoints();
    console.log(iw, ih);
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
    } else {
        alert("Invalid file");
    }
}

function Get(yourUrl) {
    let Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET", yourUrl, false);
    Httpreq.send(null);
    return Httpreq.responseText;
}

function seededRandom(max, min) {
    max = max || 1;
    min = min || 0;

    seed = (seed * 9301 + 49297) % 233280;
    let rnd = seed / 233280;
    return min + rnd * (max - min);
}