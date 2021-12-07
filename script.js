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
  width: 32,
  jumping: true,
  x: 20,
  xVelocity: 0,
  y: 0,
  yVelocity: 0
};


function detectCollisions(){
  let obj1;
  let obj2;

  // Reset collision state of all objects
  for (let i = 0; i < gameObjects.length; i++) {
      gameObjects[i].isColliding = false;
  }

  // Start checking for collisions
  for (let i = 0; i < gameObjects.length; i++)
  {
    obj1 = gameObjects[i];
    for (let j = i + 1; j < gameObjects.length; j++)
    {
      obj2 = gameObjects[j];

      // Compare object1 with object2
      if (rectIntersect(obj1.x, obj1.y, obj1.width, obj1.height, obj2.x, obj2.y, obj2.width, obj2.height)){
          obj1.isColliding = true;
           obj2.isColliding = true;
      }
    }
  }
}

// Create the obstacles for each frame
const nextFrame = () => {
  // Increase the frame / "level" count
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

  hero.yVelocity += 1; // Gravity
  hero.x += hero.xVelocity;
  hero.y += hero.yVelocity;
  hero.xVelocity *= 0.9; // Friction
  hero.yVelocity *= 0.9; // Friction

  // If hero is falling below floor line
  if (hero.y > 386 - 16 - 32) {

    hero.jumping = false;
    hero.y = 386 - 16 - 32;
    hero.yVelocity = 0
  }

  // If hero is going off the left of the screen
  if (hero.x < -40) {
    hero.x = 1220;
  } else if (hero.x > 1220) { // If hero goes past right boundary

    hero.x = -20;
    nextFrame();
  }
  // Creates the backdrop for each frame
  context.fillStyle = "#1a1a1a";
  context.fillRect(0, 0, 1220, 400); // x, y, width, height


  // Creates and fills the hero for each frame
  context.fillStyle = "#d3d600"; // hex for hero color
  context.beginPath();
  context.rect(hero.x, hero.y, hero.width, hero.height);
  context.fill();


  // Create the obstacles for each frame
  // Set the standard obstacle height
  const height = 200 * Math.cos(Math.PI / 6);

  context.fillStyle = "red";
  obXCoors.forEach((obXCoor) => {
    context.beginPath();
    context.moveTo(obXCoor, 385); 
    context.lineTo(obXCoor + 20, 385); 
    context.lineTo(obXCoor + 10, 510 - height);   
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

  // Call update when the browser is ready to draw again
  window.requestAnimationFrame(loop);
};

window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);