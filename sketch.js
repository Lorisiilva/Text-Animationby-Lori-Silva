let textPoints = []; 
let sliders = {}; 
let overlayActive = true; // Controls the blurry overlay visibility
let isPlaying = false; // Toggle between preview and play modes
let helpButton;
let helpOverlayActive = false;

// Almacenar sliders 
let params = {
  text: "Write Something",
  textSize: 100,
  pointDensity: 0.2,
  speed: 5,
  interactionRadius: 150,
  returnSpeed: 50,
  particleColor: "#FFFFFF",
  particleSize: 4,
  initialDirection: "random", // Opciones: "up", "down", "left", "right", "random"
  backgroundColor: "#000000",
  interactionMode: "Repel", // "Attract", "Repel", "Orbit"
  randomAppearance: false, // Enable random colors and sizes
};

function preload() { 
  font = loadFont("AvenirNextLTPro-Demi.otf"); 
}

function setup() { 
  createCanvas(windowWidth, windowHeight); // Set canvas to full-screen size
  textFont(font); // Configurar puntos iniciales y crear menú
  setupTextPoints();
  createMenu();

  // Create the help button
  helpButton = createButton('Help');
  helpButton.position(width - 100, 20); // Position in the upper right corner
  helpButton.style('padding', '10px 20px');
  helpButton.style('background-color', '#444');
  helpButton.style('color', 'white');
  helpButton.style('border', 'none');
  helpButton.style('font-size', '14px');
  helpButton.mousePressed(toggleHelpOverlay); // Toggle overlay on click
  helpButton.hide(); // Hide the help button initially
}

function windowResized() { 
  resizeCanvas(windowWidth, windowHeight); // Resize the canvas to full screen
  setupTextPoints(); // Reconfigure points if needed 
}

function draw() { 
  // Ensure background color is valid
  let bgColor = color(params.backgroundColor);
  background(bgColor); // Set background color

  // Draw particles
  for (let point of textPoints) {
    point.update();
    point.show();
    point.behaviors();
  }

  if (overlayActive) {
    drawOverlay();
  }

  if (helpOverlayActive) {
    drawHelpOverlay();
  }
}

function drawOverlay() {
  push();
  fill(0, 0, 0, 60); // Semi-transparent black overlay
  rect(0, 0, width, height);
  filter(BLUR, 15); // Apply stronger blur effect
  pop();

  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Click anywhere to Start", width / 2, height / 2); // Centered text
}

function drawHelpOverlay() {
  push();
  fill(0, 0, 0, 200); // Semi-transparent black overlay
  rect(0, 0, width, height);
  pop();

  // Draw a rectangle behind the help text
  let rectWidth = width * 0.7;
  let rectHeight = height * 0.3;
  let rectX = (width - rectWidth) / 2;
  let rectY = (height - rectHeight) / 2;

  push();
  fill(50); // Dark background for the text
  rect(rectX, rectY, rectWidth, rectHeight, 5); // Rounded corners
  pop();

  fill(255);
  textSize(18);
  textAlign(CENTER, CENTER);
  text("This is an interactive particle-based text animation.\nYou can customize the text, colors, and behavior using the controls at the bottom.", width / 2, height / 2);
}

function toggleHelpOverlay() {
  helpOverlayActive = !helpOverlayActive; // Toggle the overlay visibility
}

function mousePressed() {
  if (overlayActive) {
    overlayActive = false; // Remove overlay on click
    helpButton.show(); // Show the help button after the overlay is removed
  }
}

function createMenu() {
  let menu = createDiv();
  menu.style("display", "flex");
  menu.style("flex-wrap", "wrap");
  menu.style("justify-content", "center");
  menu.style("align-items", "center");
  menu.style("position", "fixed");
  menu.style("bottom", "0px"); // Position the menu at the bottom of the screen
  menu.style("width", "100%"); // Make sure it spans the full width of the screen
  menu.style("z-index", "1000"); // Keep it above the canvas
  menu.style("background-color", "rgba(0, 0, 0, 0.7)"); // Optional: make the background semi-transparent
  // Set padding and margin to make sure it's not hidden
  menu.style("padding", "10px 0");
  menu.style("box-sizing", "border-box"); // Create the actual menu content (input fields, sliders, etc.)
  createTextInput(menu, "Custom Text:", "text", params.text, setupTextPoints);
  createSliderWithLabel(menu, "Text Size", "textSize", 50, 300, params.textSize, setupTextPoints);
  createSliderWithLabel(menu, "Point Density", "pointDensity", 0.1, 1, params.pointDensity, setupTextPoints, 0.1);
  createSliderWithLabel(menu, "Speed", "speed", 1, 20, params.speed);
  createSliderWithLabel(menu, "Interaction Radius", "interactionRadius", 50, 500, params.interactionRadius);
  createSliderWithLabel(menu, "Return Speed", "returnSpeed", 10, 200, params.returnSpeed);
  createColorInput(menu, "Particle Color:", "particleColor", params.particleColor);
  createColorInput(menu, "Background Color:", "backgroundColor", params.backgroundColor);
  createDropdown(menu, "Initial Direction:", "initialDirection", ["up", "down", "left", "right", "random"], params.initialDirection, setupTextPoints);
  createSliderWithLabel(menu, "Particle Size", "particleSize", 1, 10, params.particleSize);
  createDropdown(menu, "Interaction Mode:", "interactionMode", ["Attract", "Repel", "Orbit"], params.interactionMode);
  createCheckboxWithLabel(menu, "Randomize Appearance", "randomAppearance", params.randomAppearance);
  createResetButton(menu); // Add the save button to the menu
  createSaveButton(menu); 
}

// Crear un campo de texto para ingresar texto personalizado
function createTextInput(parent, label, key, value, callback) { 
  let container = createDiv(); 
  container.style("margin", "10px 15px"); 
  container.style("text-align", "center"); 
  let labelEl = createP(label); 
  labelEl.style("margin", "0 0 5px"); 
  labelEl.style("color", "white"); 
  labelEl.style("font-size", "14px"); 
  let input = createInput(value); 
  input.style("width", "150px"); 
  input.style("text-align", "center"); 
  input.input(() => { 
    params[key] = input.value(); 
    if (callback) callback(); 
  }); 
  container.child(labelEl); 
  container.child(input); 
  parent.child(container); 
}

// Crear un slider con etiqueta
function createSliderWithLabel(parent, label, key, min, max, value, callback, step = 1) { 
  let container = createDiv(); 
  container.style("margin", "10px 15px"); 
  container.style("text-align", "center"); 
  let labelEl = createP(label); 
  labelEl.style("margin", "0 0 5px"); 
  labelEl.style("color", "white"); 
  labelEl.style("font-size", "14px"); 
  let slider = createSlider(min, max, value, step); 
  slider.style("width", "150px"); 
  slider.input(() => { 
    params[key] = slider.value(); 
    if (callback) callback(); 
  }); 
  container.child(labelEl); 
  container.child(slider); 
  parent.child(container); 
}

function createColorInput(parent, label, key, value) { 
  let container = createDiv(); 
  container.style("margin", "10px 15px"); 
  container.style("text-align", "center"); 
  let labelEl = createP(label); 
  labelEl.style("margin", "0 0 5px"); 
  labelEl.style("color", "white"); 
  labelEl.style("font-size", "14px"); 
  let colorPicker = createColorPicker(value); 
  colorPicker.input(() => { 
    params[key] = colorPicker.value(); // Always a valid color string 
    // Update particle color for all existing particles 
    updateParticleColors(); 
  }); 
  container.child(labelEl); 
  container.child(colorPicker); 
  parent.child(container); 
}

// Crear un selector desplegable
function createDropdown(parent, label, key, options, value, callback) { 
  let container = createDiv(); 
  container.style("margin", "10px 15px"); 
  container.style("text-align", "center"); 
  let labelEl = createP(label); 
  labelEl.style("margin", "0 0 5px"); 
  labelEl.style("color", "white"); 
  labelEl.style("font-size", "14px"); 
  let dropdown = createSelect(); 
  for (let option of options) { 
    dropdown.option(option); 
  } 
  dropdown.value(value); 
  dropdown.changed(() => { 
    params[key] = dropdown.value(); 
    if (callback) callback(); 
  }); 
  container.child(labelEl); 
  container.child(dropdown); 
  parent.child(container); 
}

// Crear un checkbox
function createCheckboxWithLabel(parent, label, key, value) { 
  let container = createDiv(); 
  container.style("margin", "10px 15px"); 
  container.style("text-align", "center"); 
  let labelEl = createP(label); 
  labelEl.style("margin", "0 0 5px"); 
  labelEl.style("color", "white"); 
  labelEl.style("font-size", "14px"); 
  let checkbox = createCheckbox("", value); 
  checkbox.changed(() => { 
    params[key] = checkbox.checked(); 
  }); 
  container.child(labelEl); 
  container.child(checkbox); 
  parent.child(container); 
}

// Botón para resetear parámetros
function createResetButton(parent) { 
  let button = createButton("Reset"); 
  button.style("margin", "10px 15px"); 
  button.style("padding", "10px 20px"); 
  button.style("background-color", "#444"); 
  button.style("color", "white"); 
  button.style("border", "none"); 
  button.style("font-size", "14px"); 
  button.mousePressed(() => { 
    Object.assign(params, { 
      text: "Write Something", 
      textSize: 100, 
      pointDensity: 0.2, 
      speed: 5, 
      interactionRadius: 150, 
      returnSpeed: 50, 
      particleColor: "#FFFFFF", 
      particleSize: 4, 
      initialDirection: "random", 
      backgroundColor: "#000000", 
      interactionMode: "Repel", 
      randomAppearance: false, 
    }); 
    setupTextPoints(); 
  }); 
  parent.child(button); 
}

// Crear un botón para guardar los parámetros en un archivo JSON
function createSaveButton(parent) { 
  let button = createButton("Save Settings"); 
  button.style("margin", "10px 15px"); 
  button.style("padding", "10px 20px"); 
  button.style("background-color", "#444"); 
  button.style("color", "white"); 
  button.style("border", "none"); 
  button.style("font-size", "14px"); 
  button.mousePressed(() => { 
    // Convert the parameters to a JSON object
    let jsonData = JSON.stringify(params, null, 2); // Format with 2 spaces for readability
    // Save the JSON file
    save(jsonData, 'settings.json'); // Use p5.js save function
  }); 
  parent.child(button); 
}

// Configurar puntos de texto
function setupTextPoints() {
  textPoints = [];
  let bounds = font.textBounds(params.text, 0, 0, params.textSize);
  let tposX = (width - bounds.w) / 2 - bounds.x;
  let tposY = (height - bounds.h) / 2 - bounds.y;
  let points = font.textToPoints(params.text, tposX, tposY, params.textSize, {
    sampleFactor: params.pointDensity,
  });

  for (let pt of points) {
    let vel;
    switch (params.initialDirection) {
      case "up":
        vel = createVector(0, -random(1, 2));
        break;
      case "down":
        vel = createVector(0, random(1, 2));
        break;
      case "left":
        vel = createVector(-random(1, 2), 0);
        break;
      case "right":
        vel = createVector(random(1, 2), 0);
        break;
      default:
        vel = createVector(random(-1, 1), random(-1, 1));
    }

    let randomColor = params.randomAppearance ? color(random(255), random(255), random(255)) : color(params.particleColor);
    let randomSize = params.randomAppearance ? random(1, 10) : params.particleSize;
    let textPoint = new Interact(pt.x, pt.y, params.speed, params.interactionRadius, params.returnSpeed, vel, randomColor, randomSize);
    textPoints.push(textPoint);
  }
}

// Update the particle colors dynamically
function updateParticleColors() {
  for (let point of textPoints) {
    point.color = params.randomAppearance ? color(random(255), random(255), random(255)) : color(params.particleColor);
  }
}

// Interact class updated with dynamic particle size handling
class Interact {
  constructor(x, y, speed, radius, returnSpeed, vel, color, size) {
    this.home = createVector(x, y);
    this.pos = this.home.copy();
    this.vel = vel || createVector(random(-1, 1), random(-1, 1));
    this.acc = createVector();
    this.maxSpeed = speed;
    this.maxForce = 1;
    this.radius = radius;
    this.returnSpeed = returnSpeed;
    this.size = size;
    this.color = color;
  }

  // Update particle size dynamically based on params.particleSize
  updateSize() {
    if (!params.randomAppearance) {
      this.size = params.particleSize;
    }
  }

  behaviors() {
    let arriveForce = this.arrive(this.home);
    let mouse = createVector(mouseX, mouseY);
    let mode = params.interactionMode;
    let interactionForce;

    if (mode === "Repel") {
      interactionForce = this.flee(mouse);
    } else if (mode === "Attract") {
      interactionForce = this.attract(mouse);
    } else if (mode === "Orbit") {
      interactionForce = this.orbit(mouse);
    }

    this.applyForce(arriveForce);
    if (interactionForce) {
      this.applyForce(interactionForce);
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  arrive(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();
    let speed = this.maxSpeed;
    if (d < this.returnSpeed) {
      speed = map(d, 0, this.returnSpeed, 0, this.maxSpeed);
    }
    desired.setMag(speed);
    let steer = p5.Vector.sub(desired, this.vel).limit(this.maxForce);
    return steer;
  }

  flee(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();
    if (d < this.radius) {
      desired.setMag(this.maxSpeed).mult(-1);
      let steer = p5.Vector.sub(desired, this.vel).limit(this.maxForce);
      return steer;
    }
    return createVector(0, 0);
  }

  attract(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();
    if (d < this.radius) {
      desired.setMag(this.maxSpeed);
      let steer = p5.Vector.sub(desired, this.vel).limit(this.maxForce);
      return steer;
    }
    return createVector(0, 0);
  }

  orbit(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();
    let angle = atan2(desired.y, desired.x);
    angle += radians(1);
    let radius = this.radius;
    desired = createVector(cos(angle) * radius, sin(angle) * radius);
    let steer = p5.Vector.sub(desired, this.vel).limit(this.maxForce);
    return steer;
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);

    // Update the particle size every frame based on params.particleSize
    this.updateSize();
  }

  show() {
    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
}