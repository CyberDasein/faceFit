
let outputWidth;
let outputHeight;

let faceTracker; // Face Tracking
let videoInput;


let selected = -1; // Default no filter

/*
 * **p5.js** library automatically executes the `preload()` function. Basically, it is used to load external files. In our case, we'll use it to load the images for our filters and assign them to separate variables for later use.
*/
function preload() {

  img5 = loadImage("./img/glasses_PNG2.png");
  img2 = loadImage("./img/glasses_PNG3.png");
  img3 = loadImage("./img/glasses_PNG4.png");
  img4 = loadImage("./img/glasses_PNG5.png");
  img1 = loadImage("./img/glasses_PNG6.png");
}

/**
 * In p5.js, `setup()` function is executed at the beginning of our program, but after the `preload()` function.
*/
function setup() {
  const maxWidth = Math.min(windowWidth, windowHeight);


  pixelDensity(1);
  outputWidth = maxWidth;
  outputHeight = maxWidth * 0.75;  // 4:3

  createCanvas(outputWidth, outputHeight);

  // webcam capture
  videoInput = createCapture(VIDEO);
  videoInput.size(outputWidth, outputHeight);
  videoInput.hide();

  // select filter
  const sel = createSelect();
  const selectList = ['1', '2', '3', '4', '5']; // list of filters
  sel.option('Выберите из списка', -1); // Default no filter

  for (let i = 0; i < selectList.length; i++) {
    sel.option("Модель " + selectList[i], i);
    $('.select').append(`<div><span>${i + 1}</span><img width="100" src="./img/glasses_PNG${i + 2}.png" alt=""></div>`);
  }
  sel.changed(applyFilter);

  // tracker
  faceTracker = new clm.tracker();
  faceTracker.init();
  faceTracker.start(videoInput.elt);
}

// callback function
function applyFilter() {
  selected = this.selected(); // change filter type
}

/*
 * In p5.js, draw() function is executed after setup(). This function runs inside a loop until the program is stopped.
*/
function draw() {
  image(videoInput, 0, 0, outputWidth, outputHeight); // render video from webcam

  // apply filter based on choice

  switch (selected) {
    case '-1': break;
    case '0': drawGlasses(img1); break;
    case '1': drawGlasses(img2); break;
    case '2': drawGlasses(img3); break;
    case '3': drawGlasses(img4); break;
    case '4': drawGlasses(img5); break;
  }
}

// Mask Filter
function drawGlasses(img) {
  const positions = faceTracker.getCurrentPosition();
  let pn = faceTracker.getConvergence()

  if (positions !== false && 0.4 < pn < 10) {
    push();
    let wx = Math.abs(positions[14][0] - positions[1][0]) * 1.1;
    let wy = 155;
    translate(-wx / 2, -wy / 2);

    if (230 < wy || wy < 110) {
      wy = 110
    }

    image(img, positions[41][0], positions[23][1], wx, wy);


    pop();
  }
}

function windowResized() {
  const maxWidth = Math.min(windowWidth, windowHeight);

  reset()
  pixelDensity(1);
  outputWidth = maxWidth;
  outputHeight = maxWidth; // 4:3
  resizeCanvas(outputWidth, outputHeight);
}