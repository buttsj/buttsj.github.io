// JOHN (JACK) BUTTS
// CSE 5542

var gl;
var shaderProgram;

//////////////// Init OpenGL Context etc. //////////////////

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

var cubeVertexPositionBuffer;
var cubeVertexColorBuffer;
var colorfulCubeVertexColorBuffer;
var cubeVertexIndexBuffer;

var sphereVertexPositionBuffer;
var sphereVertexColorBuffer;
var sphereVertexIndexBuffer;

var cylinderVertexPositionBuffer;
var cylinderVertexColorBuffer;
var cylinderVertexIndexBuffer;

var lineVertexPositionBuffer;
var lineVertexColorBuffer;

////////////////  Initialize VBO  ////////////////////////

function initBuffers() {
  initSphereBuffer();
  initCubeBuffer();
  initCylinderBuffer();
  initCursorBuffer();
}

function initCursorBuffer() {
  var l_vertices = [
    1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
    0.0, -1.0, 0.0,
    0.0, 1.0, 0.0,
  ];
  var colors = [
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
  ];

  lineVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(l_vertices), gl.STATIC_DRAW);
  lineVertexPositionBuffer.itemSize = 3;
  lineVertexPositionBuffer.numItems = 4;

  lineVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  lineVertexColorBuffer.itemSize = 4;
  lineVertexColorBuffer.numItems = 4;
}

function initCubeBuffer() {
  // create cube //
  var cubeVertices = [
    1,  1,  -1,
    -1,  1,  -1,
    -1, -1,  -1,
    1, -1,  -1,
    1,  1,   1,
    -1,  1,   1,
    -1, -1,   1,
    1, -1,   1,
  ];
  cubeVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);
  cubeVertexPositionBuffer.itemSize = 3;
  cubeVertexPositionBuffer.numItems = cubeVertices.length / 3;

  var cubeIndices = [0,1,2, 0,2,3, 0,3,7, 0,7,4, 6,2,3, 6,3,7, 5,1,2, 5,2,6, 5,1,0, 5,0,4, 5,6,7, 5,7,4];
  cubeVertexIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);
  cubeVertexIndexBuffer.itemsize = 1;
  cubeVertexIndexBuffer.numItems = cubeIndices.length;

  var cubeColors = [
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
  ];
  cubeVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeColors), gl.STATIC_DRAW);
  cubeVertexColorBuffer.itemSize = 4;
  cubeVertexColorBuffer.numItems = cubeColors.length / 4;

  var colorfulColors = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
  ];
  colorfulCubeVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorfulCubeVertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorfulColors), gl.STATIC_DRAW);
  colorfulCubeVertexColorBuffer.itemSize = 4;
  colorfulCubeVertexColorBuffer.numItems = colorfulColors.length / 4;
}

function initSphereBuffer() {
  // create sphere //
  var sphereVertices = [];
  var sphereColors = [];
  for (var latNumber=0; latNumber <= sphere.latBands; latNumber++) {
    var theta = latNumber * Math.PI / sphere.latBands;
    var sinTheta = Math.sin(theta);
    var cosTheta = Math.cos(theta);
    for (var longNumber=0; longNumber <= sphere.longBands; longNumber++) {
      var phi = longNumber * 2 * Math.PI / sphere.longBands;
      var sinPhi = Math.sin(phi);
      var cosPhi = Math.cos(phi);
      var x = cosPhi * sinTheta;
      var y = cosTheta;
      var z = sinPhi * sinTheta;
      sphereVertices.push(sphere.radius * x);
      sphereVertices.push(sphere.radius * y);
      sphereVertices.push(sphere.radius * z);
      sphereColors.push(1);
      sphereColors.push(0);
      sphereColors.push(0);
      sphereColors.push(1);
    }
  }

  sphereVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereVertices), gl.STATIC_DRAW);
  sphereVertexPositionBuffer.itemSize = 3;
  sphereVertexPositionBuffer.numItems = sphereVertices.length / 3;

  var sphereIndices = [];
  for (var latNumber=0; latNumber < sphere.latBands; latNumber++) {
    for (var longNumber=0; longNumber < sphere.longBands; longNumber++) {
      var first = (latNumber * (sphere.longBands + 1)) + longNumber;
      var second = first + sphere.longBands + 1;
      sphereIndices.push(first);
      sphereIndices.push(second);
      sphereIndices.push(first + 1);
      sphereIndices.push(second);
      sphereIndices.push(second + 1);
      sphereIndices.push(first + 1);
    }
  }
  sphereVertexIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphereIndices), gl.STATIC_DRAW);
  sphereVertexIndexBuffer.itemSize = 1;
  sphereVertexIndexBuffer.numItems = sphereIndices.length;

  sphereVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereColors), gl.STATIC_DRAW);
  sphereVertexColorBuffer.itemSize = 4;
  sphereVertexColorBuffer.numItems = sphereColors.length / 4;
}

function initCylinderBuffer() {
  var cylinderVertices = [];
  var cylinderColors = [];
  var zCoord = 0;
  var alpha = 360 / cylinder.slices;
  var angle = 0;
  for (var heightIndex=0; heightIndex < cylinder.heights+1; heightIndex++) {
    angle = 0;
    for (var sliceIndex=0; sliceIndex < cylinder.slices; sliceIndex++) {
      cylinderVertices.push(Math.cos(degToRad(angle)));
      cylinderVertices.push(Math.sin(degToRad(angle)));
      cylinderVertices.push(zCoord);
      cylinderColors.push(0.5);
      cylinderColors.push(0.5);
      cylinderColors.push(0.5);
      cylinderColors.push(1);
      angle = angle + alpha;
    }
    zCoord = zCoord + (1 / cylinder.heights);
  }

  cylinderVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylinderVertices), gl.STATIC_DRAW);
  cylinderVertexPositionBuffer.itemSize = 3;
  cylinderVertexPositionBuffer.numItems = cylinderVertices.length / 3;

  var heightInc;
  var heightIndex = 0;
  var sliceIndex = 0;
  var cylinderIndices = [];

  for (heightIndex=0; heightIndex < cylinder.heights; heightIndex++) {
    heightInc = heightIndex * cylinder.slices;
    for (sliceIndex=0; sliceIndex < cylinder.slices; sliceIndex++) {
      if (sliceIndex != cylinder.slices - 1) {
        cylinderIndices.push(sliceIndex + heightInc);
        cylinderIndices.push(sliceIndex + heightInc + cylinder.slices);
        cylinderIndices.push(sliceIndex + heightInc + cylinder.slices + 1);
        cylinderIndices.push(sliceIndex + heightInc + cylinder.slices + 1);
        cylinderIndices.push(sliceIndex + heightInc + 1);
        cylinderIndices.push(sliceIndex + heightInc);
      }
      else {
        cylinderIndices.push(sliceIndex + heightInc);
        cylinderIndices.push(sliceIndex + heightInc + cylinder.slices);
        cylinderIndices.push(heightInc + cylinder.slices);
        cylinderIndices.push(heightInc + cylinder.slices);
        cylinderIndices.push(heightInc);
        cylinderIndices.push(sliceIndex + heightInc);
      }
    }
  }

  cylinderVertexIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderVertexIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cylinderIndices), gl.STATIC_DRAW);
  cylinderVertexIndexBuffer.itemSize = 1;
  cylinderVertexIndexBuffer.numItems = cylinderIndices.length;

  cylinderVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylinderColors), gl.STATIC_DRAW);
  cylinderVertexColorBuffer.itemSize = 4;
  cylinderVertexColorBuffer.numItems = cylinderColors.length / 4;
}

///////////////////////////////////////////////

var mMatrix = mat4.create();  // model matrix
var vMatrix = mat4.create(); // view matrix
var pMatrix = mat4.create();  //projection matrix
var box; // static box
var wire; // wire (cylinder)
var mvMatrix1, mvMatrix2, mvMatrix3, mvMatrix4, mvMatrix5, mvMatrix6, mvMatrix7;
var cursor;
var cam_Rot = 0.0;
var cam_Roll = 0.0;
var camera = {pos:[0, 0, 30], focus:[0, 0, 0], up:[0, 1, 0]};
var persp = {aspect:1.0, fov:60, near:0.1, far:100};
var sphere = {latBands:20, longBands:20, radius:2};
var cylinder = {slices:20, heights: 10};

///////////////////////////////////////////////

function setMatrixUniforms(matrix) {
  gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, matrix);
  gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, vMatrix);
  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
}

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

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

///////////////////////////////////////////////////////////////

function draw_cylinder(matrix) {
  gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cylinderVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cylinderVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderVertexIndexBuffer);
  setMatrixUniforms(matrix);
  gl.drawElements(gl.TRIANGLES, cylinderVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function draw_sphere(matrix) {
  gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, sphereVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
  setMatrixUniforms(matrix);
  gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function draw_cube(matrix) {
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
  setMatrixUniforms(matrix);
  gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function draw_colorful_cube(matrix) {
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorfulCubeVertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, colorfulCubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
  setMatrixUniforms(matrix);
  gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function draw_cursor(matrix) {
  gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, lineVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, lineVertexColorBuffer.itemSize,gl.FLOAT,false, 0, 0);
  setMatrixUniforms(matrix);
  gl.drawArrays(gl.LINES, 0, lineVertexPositionBuffer.numItems);
}

// borrowed code from a newer version of glMatrix.js
function camRotate() {
  // rotate a vec3 (camera) around the Y axis
  var p = [], r = [];
  p[0] = camera.focus[0] - camera.pos[0];
  p[1] = camera.focus[1] - camera.pos[1];
  p[2] = camera.focus[2] - camera.pos[2];
  r[0] = p[2]*Math.sin(degToRad(cam_Rot)) + p[0]*Math.cos(degToRad(cam_Rot));
  r[1] = p[1];
  r[2] = p[2]*Math.cos(degToRad(cam_Rot)) - p[0]*Math.sin(degToRad(cam_Rot));
  camera.focus[0] = r[0] + camera.pos[0];
  camera.focus[1] = r[1] + camera.pos[1];
  camera.focus[2] = r[2] + camera.pos[2];
  cam_Rot = 0;
}

// borrowed code from a newer version of glMatrix.js
function camRoller() {
  // rotate a vec3 (camera) around the Z axis
  var p = [], r = [];
  p[0] = camera.up[0] - camera.pos[0];
  p[1] = camera.up[1] - camera.pos[1];
  p[2] = camera.up[2] - camera.pos[2];

  //perform rotation
  r[0] = p[0]*Math.cos(degToRad(cam_Roll)) - p[1]*Math.sin(degToRad(cam_Roll));
  r[1] = p[0]*Math.sin(degToRad(cam_Roll)) + p[1]*Math.cos(degToRad(cam_Roll));
  r[2] = p[2];

  //translate to correct position
  camera.up[0] = r[0] + camera.pos[0];
  camera.up[1] = r[1] + camera.pos[1];
  camera.up[2] = r[2] + camera.pos[2];
  cam_Roll = 0;
}


function drawScene() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var Mstack = new Array();
  pMatrix = mat4.perspective(persp.fov, persp.aspect, persp.near, persp.far, pMatrix);  // set up the projection matrix
  camRotate(); // rotate the Camera if button was pressed
  camRoller(); // roll the Camera if button was pressed
  vMatrix = mat4.lookAt(camera.pos, camera.focus, camera.up, vMatrix);	// set up the view matrix
  mat4.identity(cursor);
  cursor = mat4.translate(cursor, camera.focus);
  draw_cursor(cursor);

  mat4.identity(mMatrix);
  mat4.rotate(mMatrix, degToRad(X_angle), [0, 1, 0])
  mat4.rotate(mMatrix, degToRad(Y_angle), [1, 0, 0]);
  mat4.scale(mMatrix, [scale, scale, scale]);

  PushMatrix(mMatrix);
  mMatrix = mat4.multiply(mMatrix, box);
  draw_colorful_cube(mMatrix);
  mMatrix = PopMatrix();

  mMatrix = mat4.multiply(mMatrix, wire);
  PushMatrix(mMatrix);
  mMatrix = mat4.translate(mMatrix, [0, 1, 0]);
  mMatrix = mat4.rotateX(mMatrix, degToRad(-90));
  mMatrix = mat4.scale(mMatrix, [.5, .5, 30]);
  draw_cylinder(mMatrix);
  mMatrix = PopMatrix();

  mMatrix = mat4.multiply(mMatrix, mvMatrix1);
  draw_sphere(mMatrix); // middle is a big Sphere
  PushMatrix(mMatrix);

  /////////////// right side
  mMatrix = mat4.multiply(mMatrix, mvMatrix2);
  mMatrix = mat4.rotateZ(mMatrix, degToRad(-30));
  mMatrix = mat4.translate(mMatrix, [3.5, 0, 0]);

  PushMatrix(mMatrix); // right surround joint in a Push/Pop
  mMatrix = mat4.scale(mMatrix, [2, .5, .5]);
  draw_cube(mMatrix);
  mMatrix = PopMatrix(); // reset scaling

  mMatrix = mat4.multiply(mMatrix, mvMatrix3); // smaller right sphere (joint) 1
  mMatrix = mat4.scale(mMatrix, [.5, .5, .5]);
  mMatrix = mat4.translate(mMatrix, [5, 0, 0]);
  draw_sphere(mMatrix);
  mMatrix = mat4.multiply(mMatrix, mvMatrix6); // right arm 2
  mMatrix = mat4.rotateZ(mMatrix, degToRad(-90));
  mMatrix = mat4.scale(mMatrix, [4, 1, 1]);
  mMatrix = mat4.translate(mMatrix, [1, 0, 0]);
  draw_cube(mMatrix);

  //////////////////   left side
  mMatrix = PopMatrix(); // reset to middle big sphere
  mMatrix = mat4.multiply(mMatrix, mvMatrix4); // left arm 1
  mMatrix = mat4.rotateZ(mMatrix, degToRad(30));
  mMatrix = mat4.translate(mMatrix, [-3.5, 0, 0]);

  PushMatrix(mMatrix); // surround left joint in a Push/Pop
  mMatrix = mat4.scale(mMatrix, [2, .5, .5]);
  draw_cube(mMatrix);
  mMatrix = PopMatrix(); // reset scaling

  mMatrix = mat4.multiply(mMatrix, mvMatrix5); // smaller left sphere (joint) 2
  mMatrix = mat4.scale(mMatrix, [.5, .5, .5]);
  mMatrix = mat4.translate(mMatrix, [-5, 0, 0]);
  draw_sphere(mMatrix);
  mMatrix = mat4.multiply(mMatrix, mvMatrix7); // left arm 2
  mMatrix = mat4.rotateZ(mMatrix, degToRad(90));
  mMatrix = mat4.scale(mMatrix, [4, 1, 1]);
  mMatrix = mat4.translate(mMatrix, [-1, 0, 0]);
  draw_cube(mMatrix);
}

///////////////////////////////////////////////////////////////

var X_angle = 0.0;
var Y_angle = 0.0;
var scale = 1.0;
var lastMouseX = 0;
var lastMouseY = 0;

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
  var mouseY = event.clientY;
  var diffX = mouseX - lastMouseX;
  var diffY = mouseY - lastMouseY;
  switch (event.which) {
    case 1:
    // left mouse button
    X_angle = X_angle + diffX/5;
    Y_angle = Y_angle + diffY/5;
    break;
    case 3:
    // right mouse button
    scale = scale + diffX/50;
    break;
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
  switch(event.keyCode){
    case 40:
    // down arrow
    if (event.shiftKey) {
      camera.focus[1]--;
    }
    else if (event.ctrlKey) {
      camera.pos[1]--;
    } else {
      camera.focus[1]--;
      camera.pos[1]--;
    }
    break;
    case 38:
    // up arrow
    if (event.shiftKey) {
      camera.focus[1]++;
    }
    else if (event.ctrlKey) {
      camera.pos[1]++;
    }
    else {
      camera.focus[1]++;
      camera.pos[1]++;
    }
    break;
    case 37:
    // left arrow
    if (event.shiftKey) {
      camera.focus[0]--;
    }
    else if (event.ctrlKey) {
      camera.pos[0]--;
    }
    else {
      camera.focus[0]--;
      camera.pos[0]--;
    }
    break;
    case 39:
    // right arrow
    if (event.shiftKey) {
      camera.focus[0]++;
    }
    else if (event.ctrlKey) {
      camera.pos[0]++;
    }
    else {
      camera.focus[0]++;
      camera.pos[0]++;
    }
    break;
  }
  drawScene();
}

///////////////////////////////////////////////////////////////

function webGLStart() {
  var canvas = document.getElementById("lab03-canvas");
  initGL(canvas);
  initShaders();
  gl.enable(gl.DEPTH_TEST);
  initBuffers();
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('keydown', onKeyDown, false);
  window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  }, false);

  cursor = mat4.create();
  mat4.identity(cursor);

  wire = mat4.create();
  mat4.identity(wire);

  box = mat4.create();
  mat4.identity(box);
  box = mat4.translate(box, [0, -15, 0]);

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

function rollCamR() {
  cam_Roll = cam_Roll - 10;
  drawScene();
}

function rollCamL() {
  cam_Roll = cam_Roll + 10;
  drawScene();
}

function panCamL() {
  cam_Rot = cam_Rot + 10;
  drawScene();
}

function panCamR() {
  cam_Rot = cam_Rot - 10;
  drawScene();
}

function redraw() {
  X_angle = 0;
  Y_angle = 0;
  cam_Rot = 0;
  cam_Roll = 0;
  mat4.identity(wire);
  mat4.identity(box);
  box = mat4.translate(box, [0, -15, 0]);
  mat4.identity(mvMatrix1);
  mat4.identity(mvMatrix2);
  mat4.identity(mvMatrix3);
  mat4.identity(mvMatrix4);
  mat4.identity(mvMatrix5);
  mat4.identity(mvMatrix6);
  mat4.identity(mvMatrix7);
  clearInterval(moveUpId);
  clearInterval(rotateArmsId);
  clearInterval(moveDownId);
  document.getElementById("anibutton").disabled = false;
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
  document.getElementById("anibutton").disabled = true;
  downDistance = 0;
  upDistance = 0;
  rotDistance = 0;
  shakeDistance = 0;
  dropDistance = 0;
  mat4.identity(wire);
  mat4.identity(box);
  box = mat4.translate(box, [0, -15, 0]);
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
  if (downDistance <= 95) {
    wire = mat4.translate(wire, [0.0, -.1, 0]);
    downDistance++;
    drawScene();
  } else {
    clearInterval(moveDownId);
    rotateArmsId = setInterval(rotateArms, 50);
  }
}

// (2) automated function to rotate the inner claw
function rotateArms() {
  if (rotDistance <= 3) {
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
    wire = mat4.translate(wire, [0.0, 0.1, 0]);
    box = mat4.translate(box, [0.0, 0.1, 0]);
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
    box = mat4.translate(box, [0.0, -0.1, 0]);
    dropDistance++;
    drawScene();
  } else if (dropDistance <= 115 && dropDistance > 100) {
    box = mat4.translate(box, [0.0, 0.1, 0]);
    dropDistance++;
    drawScene();
  } else if (dropDistance <= 125 && dropDistance > 115) {
    box = mat4.translate(box, [0.0, -0.1, 0]);
    dropDistance++;
    drawScene();
  } else {
    clearInterval(dropBoxId);
  }
}
