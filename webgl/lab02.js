// JOHN (JACK) BUTTS
// CSE 5542

var gl;
var shaderProgram;
var draw_type=2;
var which_object = 1;

//////////// Init OpenGL Context etc. ///////////////

function initGL(canvas) {
  try {
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch (e) {
  }
  if (!gl) {
    alert("Could not initialise WebGL, sorry :-(");
  }
}


///////////////////////////////////////////////////////////

var squareVertexPositionBuffer;
var squareVertexColorBuffer;
var circleVertexPositionBuffer;
var circleVertexColorBuffer;

////////////////    Initialize VBO  ///////////////////////

function initBuffers() {
  var latitudeBands = 20;
  var longitudeBands = 20;
  var radius = 1;

  vertices = [
    1,  1,  0.0,
    -1,  1,  0.0,
    -1, -1,  0.0,
    1, -1,  0.0,
  ];

  c_vertices = [];
  c_colors = [];

  for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
    var theta = latNumber * Math.PI / latitudeBands;
    var sinTheta = Math.sin(theta);
    for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
      var phi = longNumber * 2 * Math.PI / longitudeBands;
      var sinPhi = Math.sin(phi);
      var cosPhi = Math.cos(phi);
      var x = cosPhi * sinTheta;
      var y = sinPhi * sinTheta;
      c_vertices.push(radius * x); //x
      c_vertices.push(radius * y); //y
      c_vertices.push(0); //z
      c_colors.push(0); //red color amount
      c_colors.push(0); //green color amount
      c_colors.push(0); //blue color amount
      c_colors.push(1); //alpha amount
    }
  }

  squareVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  squareVertexPositionBuffer.itemSize = 3;
  squareVertexPositionBuffer.numItems = 4;

  circleVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, circleVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(c_vertices), gl.STATIC_DRAW);
  circleVertexPositionBuffer.itemSize = 3;
  circleVertexPositionBuffer.numItems = 441;

  squareVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
  var colors = [
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  squareVertexColorBuffer.itemSize = 4;
  squareVertexColorBuffer.numItems = 4;

  circleVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, circleVertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(c_colors), gl.STATIC_DRAW);
  circleVertexColorBuffer.itemSize = 4;
  circleVertexColorBuffer.numItems = 441;
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////


var mvMatrix1, mvMatrix2, mvMatrix3, mvMatrix4, mvMatrix5, mvMatrix6, mvMatrix7;
var wire;
var boxModel;

var Xtranslate = 0.0, Ytranslate = 0.0;

function setMatrixUniforms(matrix) {
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, matrix);
}

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

///////////////////////////////////////////////////////

var mvMatrixStack = [];

function PushMatrix(matrix) {
  var copy = mat4.create();
  mat4.set(matrix, copy);
  mvMatrixStack.push(copy);
}

function PopMatrix() {
  if (mvMatrixStack.length == 0) {
    throw "Invalid popMatrix!";
  }
  var copy = mvMatrixStack.pop();
  return copy;
}

function draw_square(matrix) {
  setMatrixUniforms(matrix);
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,squareVertexColorBuffer.itemSize,gl.FLOAT,false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, squareVertexPositionBuffer.numItems);
}

function draw_circle(matrix) {
  setMatrixUniforms(matrix);
  gl.bindBuffer(gl.ARRAY_BUFFER, circleVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, circleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, circleVertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, circleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, circleVertexPositionBuffer.numItems);
}

///////////////////////////////////////////////////////////////////////

function drawScene() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  var Mstack = new Array();
  var model = mat4.create();
  mat4.identity(model);
  model = mat4.scale(model, [0.1, 0.1, 1]); // make the whole thing smaller
  ////////////////////
  draw_square(wire); // the wire

  ///////////////////
  model = mat4.multiply(model, mvMatrix1);
  draw_circle(model); // middle is a big Circle
  PushMatrix(model);

  ///////////////////   right side
  model = mat4.multiply(model, mvMatrix2); // right arm 1
  model = mat4.rotateZ(model, degToRad(-30));
  model = mat4.scale(model, [2, .3, 1]);
  model = mat4.translate(model, [1.5, 0, 0]);
  draw_square(model);
  model = mat4.multiply(model, mvMatrix3); // smaller right circle (joint) 1
  model = mat4.scale(model, [.15, 1, 1]);
  model = mat4.translate(model, [7.5, 0, 0]);
  draw_circle(model);

  model = mat4.multiply(model, mvMatrix6); // right arm 2
  model = mat4.rotateZ(model, degToRad(-90));
  model = mat4.scale(model, [2, .3, 1]);
  model = mat4.translate(model, [1.5, 0, 0]);
  draw_square(model);

  //////////////////

  //////////////////   left side
  model = PopMatrix();

  model = mat4.multiply(model, mvMatrix4); // left arm 1
  model = mat4.rotateZ(model, degToRad(30));
  model = mat4.scale(model, [2, .3, 1]);
  model = mat4.translate(model, [-1.5, 0, 0]);
  draw_square(model);

  model = mat4.multiply(model, mvMatrix5); // smaller left circle (joint) 2
  model = mat4.scale(model, [.15, 1, 1]);
  model = mat4.translate(model, [-7.5, 0, 0]);
  draw_circle(model);

  model = mat4.multiply(model, mvMatrix7); // left arm 2
  model = mat4.rotateZ(model, degToRad(90));
  model = mat4.scale(model, [2, .3, 1]);
  model = mat4.translate(model, [-1.5, 0, 0]);
  draw_square(model);

  draw_square(boxModel); // box decoration
}

///////////////////////////////////////////////////////////////

var lastMouseX = 0, lastMouseY = 0;

///////////////////////////////////////////////////////////////

function onDocumentMouseDown( event ) {
  event.preventDefault();
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'mouseup', onDocumentMouseUp, false );
  document.addEventListener( 'mouseout', onDocumentMouseOut, false );
  var mouseX = event.clientX;
  var mouseY = event.clientY;
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function onDocumentMouseMove( event ) {
  var mouseX = event.clientX;
  var mouseY = event.ClientY;

  var diffX = mouseX - lastMouseX;
  var diffY = mouseY - lastMouseY;

  console.log("rotate"+degToRad(diffX/5.0));
  if (which_object == 1)  {
    mvMatrix1 = mat4.rotate(mvMatrix1, degToRad(diffX/5.0), [0, 0, 1]);
  }
  if (which_object == 2)  {
    mvMatrix2 = mat4.rotate(mvMatrix2, degToRad(diffX/5.0), [0, 0, 1]);
    mvMatrix4 = mat4.rotate(mvMatrix4, degToRad(-1*diffX/5.0), [0, 0, 1]);
  }
  if (which_object == 3)  {
    mvMatrix6 = mat4.rotate(mvMatrix6, degToRad(diffX/5.0), [0, 0, 1]);
    mvMatrix7 = mat4.rotate(mvMatrix7, -1*degToRad(diffX/5.0), [0, 0, 1]);
  }
  lastMouseX = mouseX;
  lastMouseY = mouseY;
  drawScene();
}

function onDocumentMouseUp( event ) {
  document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
  document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
  document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

function onDocumentMouseOut( event ) {
  document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
  document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
  document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}


function onKeyDown(event) {
  console.log(event.keyCode);
  switch(event.keyCode)  {
    case 82:
    console.log('enter Right');
    if (which_object == 1) {
      mvMatrix1 = mat4.translate(mvMatrix1, [0.1, 0, 0]);
      wire = mat4.translate(wire, [1, 0, 0]);
    }
    if (which_object == 2) {
      mvMatrix2 = mat4.translate(mvMatrix2, [0.1, 0, 0]);
      mvMatrix4 = mat4.translate(mvMatrix4, [-0.1, 0, 0]);
    }
    if (which_object == 3) {
      mvMatrix6 = mat4.translate(mvMatrix6, [0.1, 0, 0]);
      mvMatrix7 = mat4.translate(mvMatrix7, [-0.1, 0, 0]);
    }
    break;
    case 76:
    console.log('enter Left');
    if (which_object == 1) {
      mvMatrix1 = mat4.translate(mvMatrix1, [-0.1, 0, 0]);
      wire = mat4.translate(wire, [-1, 0, 0]);
    }
    if (which_object == 2) {
      mvMatrix2 = mat4.translate(mvMatrix2, [-0.1, 0, 0]);
      mvMatrix4 = mat4.translate(mvMatrix4, [0.1, 0, 0]);
    }
    if (which_object == 3) {
      mvMatrix6 = mat4.translate(mvMatrix6, [-0.1, 0, 0]);
      mvMatrix7 = mat4.translate(mvMatrix7, [0.1, 0, 0]);
    }
    break;
    case 70:
    console.log('enter Up');
    if (which_object == 1) {
      mvMatrix1 = mat4.translate(mvMatrix1, [0.0, 0.1, 0]);
      wire = mat4.translate(wire, [0.0, 0.01, 0]);
    }
    if (which_object == 2) {
      mvMatrix2 = mat4.translate(mvMatrix2, [0.0, 0.1, 0]);
      mvMatrix4 = mat4.translate(mvMatrix4, [0.0, 0.1, 0]);
    }
    if (which_object == 3) {
      mvMatrix6 = mat4.translate(mvMatrix6, [0.0, 0.1, 0]);
      mvMatrix7 = mat4.translate(mvMatrix7, [0.0, 0.1, 0]);
    }
    break;
    case 66:
    console.log('enter Down');
    if (which_object == 1) {
      mvMatrix1 = mat4.translate(mvMatrix1, [0.0, -0.1, 0]);
      wire = mat4.translate(wire, [0.0, -0.01, 0]);
    }
    if (which_object == 2) {
      mvMatrix2 = mat4.translate(mvMatrix2, [0.0, -0.1, 0]);
      mvMatrix4 = mat4.translate(mvMatrix4, [0.0, -0.1, 0]);
    }
    if (which_object == 3) {
      mvMatrix6 = mat4.translate(mvMatrix6, [0.0, -0.1, 0]);
      mvMatrix7 = mat4.translate(mvMatrix7, [0.0, -0.1, 0]);
    }
    break;
    case 83:
    if (event.shiftKey) {
      console.log('enter S');
      if (which_object == 1)  {
        mvMatrix1 = mat4.scale(mvMatrix1, [1.05, 1.05, 1.05]);
      }
      if (which_object == 2) {
        mvMatrix2 = mat4.scale(mvMatrix2, [1.05, 1.05, 1.05]);
        mvMatrix4 = mat4.scale(mvMatrix4, [1.05, 1.05, 1.05]);
      }
      if (which_object == 3) {
        mvMatrix6 = mat4.scale(mvMatrix6, [1.05, 1.05, 1.05]);
        mvMatrix7 = mat4.scale(mvMatrix7, [1.05, 1.05, 1.05]);
      }
    }
    else {
      console.log('enter s');
      if (which_object == 1)
      mvMatrix1 = mat4.scale(mvMatrix1, [0.95, 0.95, 0.95]);
      if (which_object == 2) {
        mvMatrix2 = mat4.scale(mvMatrix2, [0.95, 0.95, 0.95]);
        mvMatrix4 = mat4.scale(mvMatrix4, [0.95, 0.95, 0.95]);
      }
      if (which_object == 3) {
        mvMatrix6 = mat4.scale(mvMatrix6, [0.95, 0.95, 0.95]);
        mvMatrix7 = mat4.scale(mvMatrix7, [0.95, 0.95, 0.95]);
      }
    }
    break;
  }
  drawScene();
}
///////////////////////////////////////////////////////////////

function webGLStart() {
  var canvas = document.getElementById("code04-canvas");
  initGL(canvas);
  initShaders();

  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  shaderProgram.whatever = 4;
  shaderProgram.whatever2 = 3;

  initBuffers();

  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  document.addEventListener('mousedown', onDocumentMouseDown,false);
  document.addEventListener('keydown', onKeyDown, false);
  window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  }, false);

  boxModel = mat4.create();
  mat4.identity(boxModel);
  boxModel = mat4.scale(boxModel, [0.1, 0.1, 1]);
  boxModel = mat4.translate(boxModel, [0, -8, 0]);

  wire = mat4.create();
  mat4.identity(wire);
  wire = mat4.scale(wire, [.01, 1, 1]);
  wire = mat4.translate(wire, [0, 1, 0]);

  mvMatrix1 = mat4.create();
  mat4.identity(mvMatrix1);

  mvMatrix2 = mat4.create();
  mat4.identity(mvMatrix2);

  mvMatrix3 = mat4.create();
  mat4.identity(mvMatrix3);

  mvMatrix4 = mat4.create();
  mat4.identity(mvMatrix4);

  mvMatrix5 = mat4.create();
  mat4.identity(mvMatrix5);

  mvMatrix6 = mat4.create();
  mat4.identity(mvMatrix6);

  mvMatrix7 = mat4.create();
  mat4.identity(mvMatrix7);

  drawScene();
}

// reset the scene
function redraw() {
  clearInterval(moveUpId);
  clearInterval(rotateArmsId);
  clearInterval(moveDownId);
  document.getElementById("button1").disabled = false;
  document.getElementById("button2").disabled = false;
  document.getElementById("button3").disabled = false;
  document.getElementById("anibutton").disabled = false;
  mat4.identity(wire);
  wire = mat4.scale(wire, [.01, 1, 1]);
  wire = mat4.translate(wire, [0, 1, 0]);
  mat4.identity(boxModel);
  boxModel = mat4.scale(boxModel, [0.1, 0.1, 1]);
  boxModel = mat4.translate(boxModel, [0, -8, 0]);
  mat4.identity(mvMatrix1);
  mat4.identity(mvMatrix2);
  mat4.identity(mvMatrix3);
  mat4.identity(mvMatrix4);
  mat4.identity(mvMatrix5);
  mat4.identity(mvMatrix6);
  mat4.identity(mvMatrix7);
  drawScene();
}

function obj(object_id) {
  which_object = object_id;
  drawScene();
}

var downDistance = 0;
var upDistance = 0;
var rotDistance = 0;
var shakeDistance = 0;
var dropDistance = 0;
var moveDownId, rotateArmsId, moveUpId, shakeClawId, dropBoxId;
// animation for the claw
function animated() {
  document.getElementById("button1").disabled = true;
  document.getElementById("button2").disabled = true;
  document.getElementById("button3").disabled = true;
  document.getElementById("anibutton").disabled = true;
  downDistance = 0;
  upDistance = 0;
  rotDistance = 0;
  shakeDistance = 0;
  dropDistance = 0;
  mat4.identity(wire);
  wire = mat4.scale(wire, [.01, 1, 1]);
  wire = mat4.translate(wire, [0, 1, 0]);
  mat4.identity(boxModel);
  boxModel = mat4.scale(boxModel, [0.1, 0.1, 1]);
  boxModel = mat4.translate(boxModel, [0, -8, 0]);
  mat4.identity(mvMatrix1);
  mat4.identity(mvMatrix2);
  mat4.identity(mvMatrix3);
  mat4.identity(mvMatrix4);
  mat4.identity(mvMatrix5);
  mat4.identity(mvMatrix6);
  mat4.identity(mvMatrix7);
  drawScene();
  moveDownId = setInterval(moveDown, 50);
}

// (1) automated function to move the claw down
function moveDown() {
  if (downDistance <= 37) {
    mvMatrix1 = mat4.translate(mvMatrix1, [0.0, -0.1, 0]);
    wire = mat4.translate(wire, [0.0, -0.01, 0]);
    downDistance++;
    drawScene();
  } else {
    clearInterval(moveDownId);
    rotateArmsId = setInterval(rotateArms, 50);
  }
}

// (2) automated function to rotate the inner claw
function rotateArms() {
  if (rotDistance <= 6) {
    mvMatrix2 = mat4.rotate(mvMatrix2, degToRad(-5.0), [0, 0, 1]);
    mvMatrix4 = mat4.rotate(mvMatrix4, degToRad(5.0), [0, 0, 1]);
    rotDistance++;
    drawScene();
  } else {
    clearInterval(rotateArmsId);
    moveUpId = setInterval(moveUp, 50);
  }
}

// (3) automated function to move the claw up
function moveUp() {
  if (upDistance <= 100) {
    mvMatrix1 = mat4.translate(mvMatrix1, [0.0, 0.1, 0]);
    wire = mat4.translate(wire, [0.0, 0.01, 0]);
    boxModel = mat4.translate(boxModel, [0.0, 0.1, 0]);
    upDistance++;
    drawScene();
  } else {
    clearInterval(moveUpId);
    shakeClawId = setInterval(shakeClaw, 50);
  }
}

// (4) automated function to shake claw
function shakeClaw() {
  if (shakeDistance <= 5) {
    if (shakeDistance % 2 == 0)
      mvMatrix1 = mat4.rotate(mvMatrix1, degToRad(2.0), [0, 0, 1]);
    else
      mvMatrix1 = mat4.rotate(mvMatrix1, degToRad(-2.0), [0,0,1]);
    shakeDistance++;
    drawScene();
  } else {
    clearInterval(shakeClawId);
    dropBoxId = setInterval(dropBox, 5);
  }
}

// (5) automated function to drop the box
function dropBox() {
  if (dropDistance <= 100) {
    boxModel = mat4.translate(boxModel, [0.0, -0.1, 0]);
    dropDistance++;
    drawScene();
  } else if (dropDistance <= 115 && dropDistance > 100) {
    boxModel = mat4.translate(boxModel, [0.0, 0.1, 0]);
    dropDistance++;
    drawScene();
  } else if (dropDistance <= 125 && dropDistance > 115) {
    boxModel = mat4.translate(boxModel, [0.0, -0.1, 0]);
    dropDistance++;
    drawScene();
  } else {
    clearInterval(dropBoxId);
  }
}
