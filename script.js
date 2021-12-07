const context = document.querySelector("canvas").getContext("2d");

//Render canvas
context.canvas.height = 400;
context.canvas.width = 1220;

// Start the frame count at 1
let frameCount = 1;
// Set the number of obstacles to match the current "level"
let obCount = frameCount;
// Create a collection to hold the generated x coordinates
const obXCoors = [];


//Render hero
const hero = {
  height: 32,
  jumping: true,
  width: 32,
  x: 20,
  xVelocity: 0,
  y: 0,
  yVelocity: 0
};

// Create the obstacles for each frame
const nextFrame = () => {
  // increase the frame / "level" count
  frameCount++;
  
  for (let i = 0; i < obCount; i++) {
    // Randomly generate the x coordinate for the top corner start of the triangles
    obXCoor = Math.floor(Math.random() * (1165 - 140 + 1) + 140);
    obXCoors.push(obXCoor);
  }

}

const controller = {

  left: false,
  right: false,
  up: false,
  keyListener: function (event) {

    var key_state = (event.type == "keydown") ? true : false;

    switch (event.keyCode) {

      case 37:// left key
        controller.left = key_state;
        break;
      case 38:// up key
        controller.up = key_state;
        break;
      case 39:// right key
        controller.right = key_state;
        break;

    }

  }

};

const loop = function () {

  if (controller.up && hero.jumping == false) {

    hero.yVelocity -= 30;
    hero.jumping = true;
  }

  if (controller.left) {

    hero.xVelocity -= 0.5;
  }

  if (controller.right) {

    hero.xVelocity += 0.5;
  }

  hero.yVelocity += 1;// gravity
  hero.x += hero.xVelocity;
  hero.y += hero.yVelocity;
  hero.xVelocity *= 0.9;// friction
  hero.yVelocity *= 0.9;// friction

  // if square is falling below floor line
  if (hero.y > 386 - 16 - 32) {

    hero.jumping = false;
    hero.y = 386 - 16 - 32;
    hero.yVelocity = 0
  }

  // if square is going off the left of the screen
  if (hero.x < -20) {
    hero.x = 1220;
  } else if (hero.x > 1220) {// if square goes past right boundary

    hero.x = -20;
    nextFrame();

  }
  // Creates the backdrop for each frame
  context.fillStyle = "#1a1a1a";
  context.fillRect(0, 0, 1220, 400); // x, y, width, height


  // Creates and fills the cube for each frame
  context.fillStyle = "#d3d600"; // hex for cube color
  context.beginPath();
  context.rect(hero.x, hero.y, hero.width, hero.height);
  context.fill();


  // Create the obstacles for each frame
  // Set the standard obstacle height
  const height = 200 * Math.cos(Math.PI / 6);

  context.fillStyle = "red"; // hex for triangle color
  obXCoors.forEach((obXCoor) => {
    context.beginPath();

    context.moveTo(obXCoor, 385); // x = random, y = coor. on "ground"
    context.lineTo(obXCoor + 20, 385); // x = ^random + 20, y = coor. on "ground"
    context.lineTo(obXCoor + 10, 510 - height); // x = ^random + 10, y = peak of triangle
  
    context.closePath();
    context.fill();
  })


  // Creates the "ground" for each frame
  context.strokeStyle = "#202020";
  context.lineWidth = 30;
  context.beginPath();
  context.moveTo(0, 385);
  context.lineTo(1220, 385);
  context.stroke();

  // call update when the browser is ready to draw again
  window.requestAnimationFrame(loop);

};

window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);