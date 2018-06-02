let vw = window.innerWidth;
let vh = window.innerHeight;

function setup() {
  createCanvas(vw, vh);
}

function draw() {
    if (mouseIsPressed) {
    fill(0);
  } else {
    fill(255);
  }
  ellipse(mouseX, mouseY, 80, 80);
}

