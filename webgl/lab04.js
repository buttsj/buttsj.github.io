/////////////////////////
//  JOHN (JACK) BUTTS  //
//      CSE 5542       //
/////////////////////////

var gl;
var shaderProgram;
var mMatrix = mat4.create(); // model matrix
var vMatrix = mat4.create(); // view matrix
var pMatrix = mat4.create(); // projection matrix
var nMatrix = mat4.create(); // normal matrix
var box; // static box
var wire; // wire (cylinder)
var mvMatrix1, mvMatrix2, mvMatrix3, mvMatrix4, mvMatrix5, mvMatrix6, mvMatrix7;
var camera = {pos:[0, 0, 30], focus:[0, 0, 0], up:[0, 1, 0]};
var persp = {aspect:1.0, fov:60, near:0.1, far:100};
var sphere = {latBands:20, longBands:20, radius:2};
var cylinder = {slices:20, heights:50, radius:2};

//////////////////////////////////////////////////////////////////////
//  Credit to Professor Shen for initial lighting code.             //
//  I disabled all shape colors for this Lab and just used ambient  //
//  light instead.                                                  //
//////////////////////////////////////////////////////////////////////

var light = {l_ambient:[0, 0, 0, 1], l_diffuse:[.8, .8, .8, 1], l_specular:[1, 1, 1, 1], l_pos:[0, 0, 0, 1]};
var material = {m_ambient:[0, 0, 0, 1], m_diffuse:[1, 0, 0, 1], m_specular:[.9, .9, .9, 1], m_shine:[50]};

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

//var cubeVertexColorBuffer; // disabled colors
//var colorfulCubeVertexColorBuffer; // disabled colors
var cubeVertexPositionBuffer;
var cubeVertexIndexBuffer;
var cubeVertexNormalBuffer; // added Normal Buffer


//var sphereVertexColorBuffer; // disabled colors
var sphereVertexPositionBuffer;
var sphereVertexIndexBuffer;
var sphereVertexNormalBuffer; // added Normal Buffer


//var cylinderVertexColorBuffer; // disabled colors
var cylinderVertexPositionBuffer;
var cylinderVertexIndexBuffer;
var cylinderVertexNormalBuffer; // added Normal Buffer

////////////////  Initialize VBO  ////////////////////////


function initBuffers() {
  initSphereBuffer();
  initCubeBuffer();
  initCylinderBuffer();
}

function initCubeBuffer() {
  var cubeVertices = [
    // front face
    -1.0, -1.0,  1.0,
    1.0, -1.0,  1.0,
    1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    // back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0, -1.0, -1.0,
    // top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
    1.0,  1.0,  1.0,
    1.0,  1.0, -1.0,
    // bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,
    // right face
    1.0, -1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0,  1.0,  1.0,
    1.0, -1.0,  1.0,
    // left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0
  ];
  cubeVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);
  cubeVertexPositionBuffer.itemSize = 3;
  cubeVertexPositionBuffer.numItems = cubeVertices.length / 3;

  var cubeNormals = [
    // front normals
    0.0,  0.0,  1.0,
    0.0,  0.0,  1.0,
    0.0,  0.0,  1.0,
    0.0,  0.0,  1.0,
    // back normals
    0.0,  0.0, -1.0,
    0.0,  0.0, -1.0,
    0.0,  0.0, -1.0,
    0.0,  0.0, -1.0,
    // top normals
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,
    0.0,  1.0,  0.0,
    // bottom normals
    0.0, -1.0,  0.0,
    0.0, -1.0,  0.0,
    0.0, -1.0,  0.0,
    0.0, -1.0,  0.0,
    // right normals
    1.0,  0.0,  0.0,
    1.0,  0.0,  0.0,
    1.0,  0.0,  0.0,
    1.0,  0.0,  0.0,
    // left normals
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0
  ];
  cubeVertexNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeNormals), gl.STATIC_DRAW);
  cubeVertexNormalBuffer.itemSize = 3;
  cubeVertexNormalBuffer.numItems = cubeNormals.length / 3;

  var cubeIndices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23    // left
  ];
  cubeVertexIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);
  cubeVertexIndexBuffer.itemsize = 1;
  cubeVertexIndexBuffer.numItems = cubeIndices.length;

  var cubeColors = [
    // front
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    // back
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    // top
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    // bottom
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    // right
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    // left
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0
  ];
  //cubeVertexColorBuffer = gl.createBuffer();
  //gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
  //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeColors), gl.STATIC_DRAW);
  //cubeVertexColorBuffer.itemSize = 4;
  //cubeVertexColorBuffer.numItems = cubeColors.length / 4;

  var colorfulColors = [
    // front
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    // back
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    // top
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    // bottom
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    // right
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    // left
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    1.0, 0.0, 0.0, 1.0
  ];
  //colorfulCubeVertexColorBuffer = gl.createBuffer();
  //gl.bindBuffer(gl.ARRAY_BUFFER, colorfulCubeVertexColorBuffer);
  //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorfulColors), gl.STATIC_DRAW);
  //colorfulCubeVertexColorBuffer.itemSize = 4;
  //colorfulCubeVertexColorBuffer.numItems = colorfulColors.length / 4;
}

function initSphereBuffer() {
  var sphereVertices = [];
  //var sphereColors = [];
  var sphereNormals = [];

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
      sphereNormals.push(x);
      sphereNormals.push(y);
      sphereNormals.push(z);
      //sphereColors.push(1);
      //sphereColors.push(0);
      //sphereColors.push(0);
      //sphereColors.push(1);
    }
  }

  sphereVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereVertices), gl.STATIC_DRAW);
  sphereVertexPositionBuffer.itemSize = 3;
  sphereVertexPositionBuffer.numItems = sphereVertices.length / 3;

  sphereVertexNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereNormals), gl.STATIC_DRAW);
  sphereVertexNormalBuffer.itemSize = 3;
  sphereVertexNormalBuffer.numItems = sphereNormals.length / 3;

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

  //sphereVertexColorBuffer = gl.createBuffer();
  //gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer);
  //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereColors), gl.STATIC_DRAW);
  //sphereVertexColorBuffer.itemSize = 4;
  //sphereVertexColorBuffer.numItems = sphereColors.length / 4;
}

function initCylinderBuffer() {
  var cylinderVertices = [];
  //var cylinderColors = [];
  var cylinderNormals = [];
  var Dangle = 2.0 * Math.PI / (cylinder.slices - 1);

  for (j = 0; j< cylinder.heights; j++) {
    for (i = 0; i< cylinder.slices; i++) {
      var angle = Dangle * i;
      cylinderVertices.push(cylinder.radius * Math.cos(angle));
      cylinderVertices.push(j * 3.0 / (cylinder.heights - 1) - 1.5);
      cylinderVertices.push(cylinder.radius * Math.sin(angle));
      cylinderNormals.push(Math.cos(angle));
      cylinderNormals.push(0.0);
      cylinderNormals.push(Math.sin(angle));
      //cylinderColors.push(Math.cos(angle));
      //cylinderColors.push(Math.sin(angle));
      //cylinderColors.push(j*1.0/(cylinder.heights-1));
      //cylinderColors.push(1.0);
    }
  }

  cylinderVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylinderVertices), gl.STATIC_DRAW);
  cylinderVertexPositionBuffer.itemSize = 3;
  cylinderVertexPositionBuffer.numItems = cylinderVertices.length / 3;

  cylinderVertexNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylinderNormals), gl.STATIC_DRAW);
  cylinderVertexNormalBuffer.itemSize = 3;
  cylinderVertexNormalBuffer.numItems = cylinderNormals.length / 3;

  var cylinderIndices = [];
  var nindices = (cylinder.heights - 1) * 6 * (cylinder.slices + 1);

  for (j = 0; j < cylinder.heights-1; j++) {
    for (i = 0; i <= cylinder.slices; i++) {
      var mi = i % cylinder.slices;
      var mi2 = (i + 1) % cylinder.slices;
      var idx = (j + 1) * cylinder.slices + mi;
      var idx2 = j * cylinder.slices + mi; // mesh[j][mi]
      var idx3 = (j) * cylinder.slices + mi2;
      var idx4 = (j + 1) * cylinder.slices + mi;
      var idx5 = (j) * cylinder.slices + mi2;
      var idx6 = (j + 1) * cylinder.slices + mi2;
      cylinderIndices.push(idx);
      cylinderIndices.push(idx2);
      cylinderIndices.push(idx3);
      cylinderIndices.push(idx4);
      cylinderIndices.push(idx5);
      cylinderIndices.push(idx6);
    }
  }

  cylinderVertexIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderVertexIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cylinderIndices), gl.STATIC_DRAW);
  cylinderVertexIndexBuffer.itemSize = 1;
  cylinderVertexIndexBuffer.numItems = cylinderIndices.length;

  //cylinderVertexColorBuffer = gl.createBuffer();
  //gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexColorBuffer);
  //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylinderColors), gl.STATIC_DRAW);
  //cylinderVertexColorBuffer.itemSize = 4;
  //cylinderVertexColorBuffer.numItems = cylinderColors.length / 4;
}

///////////////////////////////////////////////

function setMatrixUniforms(matrix) {
  gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, matrix);
  gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, vMatrix);
  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, nMatrix);
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
  gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexNormalBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cylinderVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
  //gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexColorBuffer);
  //gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cylinderVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderVertexIndexBuffer);
  setMatrixUniforms(matrix);
  gl.drawElements(gl.TRIANGLES, cylinderVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function draw_sphere(matrix) {
  gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sphereVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
  //gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer);
  //gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, sphereVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
  setMatrixUniforms(matrix);
  gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function draw_cube(matrix) {
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
  //gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
  //gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
  setMatrixUniforms(matrix);
  gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

function draw_colorful_cube(matrix) {
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
  //gl.bindBuffer(gl.ARRAY_BUFFER, colorfulCubeVertexColorBuffer);
  //gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, colorfulCubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
  setMatrixUniforms(matrix);
  gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}


function drawScene() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var Mstack = new Array();
  pMatrix = mat4.perspective(persp.fov, persp.aspect, persp.near, persp.far, pMatrix);  // set up the projection matrix
  vMatrix = mat4.lookAt(camera.pos, camera.focus, camera.up, vMatrix);	// set up the view matrix

  mat4.identity(mMatrix);
  mat4.rotate(mMatrix, degToRad(X_angle), [0, 1, 0])
  mat4.rotate(mMatrix, degToRad(Y_angle), [1, 0, 0]);

  mat4.identity(nMatrix);
  nMatrix = mat4.multiply(nMatrix, vMatrix);
  nMatrix = mat4.multiply(nMatrix, mMatrix);
  nMatrix = mat4.inverse(nMatrix);
  nMatrix = mat4.transpose(nMatrix);
  shaderProgram.light_posUniform = gl.getUniformLocation(shaderProgram, "light_pos");
  gl.uniform4f(shaderProgram.light_posUniform, light.l_pos[0], light.l_pos[1], light.l_pos[2], light.l_pos[3]);
  gl.uniform4f(shaderProgram.ambient_coefUniform, material.m_ambient[0], material.m_ambient[1], material.m_ambient[2], 1.0);
  gl.uniform4f(shaderProgram.diffuse_coefUniform, material.m_diffuse[0], material.m_diffuse[1], material.m_diffuse[2], 1.0);
  gl.uniform4f(shaderProgram.specular_coefUniform, material.m_specular[0], material.m_specular[1], material.m_specular[2],1.0);
  gl.uniform1f(shaderProgram.shininess_coefUniform, material.m_shine[0]);
  gl.uniform4f(shaderProgram.light_ambientUniform, light.l_ambient[0], light.l_ambient[1], light.l_ambient[2], 1.0);
  gl.uniform4f(shaderProgram.light_diffuseUniform, light.l_diffuse[0], light.l_diffuse[1], light.l_diffuse[2], 1.0);
  gl.uniform4f(shaderProgram.light_specularUniform, light.l_specular[0], light.l_specular[1], light.l_specular[2],1.0);
  PushMatrix(mMatrix);
  mMatrix = mat4.multiply(mMatrix, box);
  draw_colorful_cube(mMatrix);
  mMatrix = PopMatrix();

  mMatrix = mat4.multiply(mMatrix, wire);
  PushMatrix(mMatrix);
  mMatrix = mat4.translate(mMatrix, [0, 15, 0]);
  mMatrix = mat4.scale(mMatrix, [.2, 10, .2]);
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
  mMatrix = mat4.translate(mMatrix, [1.2, 0, 0]);
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
  mMatrix = mat4.translate(mMatrix, [-1.2, 0, 0]);
  draw_cube(mMatrix);

}

///////////////////////////////////////////////////////////////

var X_angle = 0.0;
var Y_angle = 0.0;
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
    camera.focus[1]--;
    camera.pos[1]--;
    break;
    case 38:
    // up arrow
    camera.focus[1]++;
    camera.pos[1]++;
    break;
    case 37:
    // left arrow
    camera.focus[0]--;
    camera.pos[0]--;
    break;
    case 39:
    // right arrow
    camera.focus[0]++;
    camera.pos[0]++;
    break;
  }
  drawScene();
}

///////////////////////////////////////////////////////////////

function webGLStart() {
  var canvas = document.getElementById("lab04-canvas");
  initGL(canvas);
  initShaders();
  initBuffers();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('keydown', onKeyDown, false);
  window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  }, false);

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

function redraw() {
  X_angle = 0;
  Y_angle = 0;
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

function lightup() {
  light.l_pos[1] = light.l_pos[1] + 5;
  drawScene();
}

function lightdown() {
  light.l_pos[1] = light.l_pos[1] - 5;
  drawScene();
}

function lightleft() {
  light.l_pos[0] = light.l_pos[0] - 5;
  drawScene();
}

function lightright() {
  light.l_pos[0] = light.l_pos[0] + 5;
  drawScene();
}

function lightforward() {
  light.l_pos[2] = light.l_pos[2] - 5;
  drawScene();
}

function lightbackward() {
  light.l_pos[2] = light.l_pos[2] + 5;
  drawScene();
}

function lightUpIntense() {
  light.l_diffuse[0] = light.l_diffuse[0] + .1;
  light.l_diffuse[1] = light.l_diffuse[1] + .1;
  light.l_diffuse[2] = light.l_diffuse[2] + .1;
  drawScene();
}

function lightLowIntense() {
  light.l_diffuse[0] = light.l_diffuse[0] - .1;
  light.l_diffuse[1] = light.l_diffuse[1] - .1;
  light.l_diffuse[2] = light.l_diffuse[2] - .1;
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
