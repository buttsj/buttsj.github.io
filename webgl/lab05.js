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
var teapot; // teapot
var wire; // wire (cylinder)
var roof; // top of claw machine
var bottom; // bottom of claw machine
var glass; // glass of claw machine
var mvMatrix1, mvMatrix2, mvMatrix3, mvMatrix4, mvMatrix5, mvMatrix6, mvMatrix7;
var camera = {pos:[0, 0, 100], focus:[0, 0, 0], up:[0, 1, 0]};
var persp = {aspect:1.0, fov:60, near:0.1, far:200};
var sphere = {latBands:20, longBands:20, radius:2};
var cylinder = {slices:20, heights:50, radius:2};
var light = {l_ambient:[0, 0, 0, 1], l_diffuse:[.8, .8, .8, 1], l_specular:[1, 1, 1, 1], l_pos:[0, 0, 0, 1]};
var material = {m_ambient:[0, 0, 0, 1], m_diffuse:[1, 1, 1, 1], m_specular:[.9, .9, .9, 1], m_shine:[90]};

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

////////////////    Initialize JSON geometry file ///////////

function initJSON()
{
  var request = new XMLHttpRequest();
  request.open("GET", "teapot.json");
  request.onreadystatechange = function ()
  {
    if (request.readyState == 4)
    {
      handleLoadedTeapot(JSON.parse(request.responseText));
    }
  }
  request.send();
}

function handleLoadedTeapot(teapotData)
{
  teapotVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(teapotData.vertexPositions),gl.STATIC_DRAW);

  teapotVertexTextureCoordBuffer=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexTextureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(teapotData.vertexTextureCoords), gl.STATIC_DRAW);
  teapotVertexTextureCoordBuffer.itemSize=2;
  teapotVertexTextureCoordBuffer.numItems=teapotData.vertexTextureCoords.length/2;

  teapotVertexNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(teapotData.vertexNormals), gl.STATIC_DRAW);

  teapotVertexIndexBuffer= gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotVertexIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(teapotData.indices), gl.STATIC_DRAW);
  drawScene();
}

///////////////////////////////////////////////////////////

var cubeVertexPositionBuffer;
var cubeVertexIndexBuffer;
var cubeVertexNormalBuffer;
var cubeVertexTextureCoordBuffer;

var sphereVertexPositionBuffer;
var sphereVertexIndexBuffer;
var sphereVertexNormalBuffer;
var sphereVertexTextureCoordBuffer;

var cylinderVertexPositionBuffer;
var cylinderVertexIndexBuffer;
var cylinderVertexNormalBuffer;
var cylinderVertexTextureCoordBuffer;

var teapotVertexPositionBuffer;
var teapotVertexIndexBuffer;
var teapotVertexNormalBuffer;
var teapotVertexTextureCoordBuffer;

///////////////////////////////////////////////////////////

function initTextures() {
  cubeTexture = gl.createTexture();
  cubeImage = new Image();
  cubeImage.onload = function() { handleTextureLoaded(cubeImage, cubeTexture); }
  cubeImage.src = "prize_tex.png";

  teapotTexture = gl.createTexture();
  teapotImage = new Image();
  teapotImage.onload = function() { handleTextureLoaded(teapotImage, teapotTexture); }
  teapotImage.src = "teapot_tex.png";

  sphereTexture = gl.createTexture();
  sphereImage = new Image();
  sphereImage.onload = function() { handleTextureLoaded(sphereImage, sphereTexture); }
  sphereImage.src = "red_tex.png";

  cylinderTexture = gl.createTexture();
  cylinderImage = new Image();
  cylinderImage.onload = function() { handleTextureLoaded(cylinderImage, cylinderTexture); }
  cylinderImage.src = "grey_tex.png";

  bottomTexture = gl.createTexture();
  bottomImage = new Image();
  bottomImage.onload = function() { handleTextureLoaded(bottomImage, bottomTexture); }
  bottomImage.src = "metal_tex.png";

  glassTexture = gl.createTexture();
  glassImage = new Image();
  glassImage.onload = function() { handleTextureLoaded(glassImage, glassTexture); }
  glassImage.src = "glass_tex.gif";
}

function handleTextureLoaded(image, texture) {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
}


////////////////  Initialize VBO  ////////////////////////


function initBuffers() {
  initSphereBuffer();
  initCubeBuffer();
  initCylinderBuffer();
  initJSON();
}

function initCubeBuffer() {
  var cubeVertices = [
    // front face
    -1.0, -1.0,  1.0,
    1.0, -1.0,  1.0,
    1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    // back face
    1.0,  1.0, -1.0,
    -1.0,  1.0, -1.0,
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    // top face
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, 1.0,  -1.0,
    1.0, 1.0,  -1.0,
    // bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,
    // right face
    1.0,  1.0,  1.0,
    1.0,  1.0, -1.0,
    1.0, -1.0, -1.0,
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

  var textureCoordinates = [
    // Front
    0.0,  1.0,
    1.0,  1.0,
    1.0,  0.0,
    0.0,  0.0,
    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Top
    0.0,  0.0,
    0.0,  0.0,
    0.0,  0.0,
    0.0,  0.0,
    // Bottom
    0.0,  0.0,
    0.0,  0.0,
    0.0,  0.0,
    0.0,  0.0,
    // Right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Left
    0.0,  1.0,
    1.0,  1.0,
    1.0,  0.0,
    0.0,  0.0
  ];
  cubeVertexTextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

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
}

function initSphereBuffer() {
  var sphereVertices = [];
  var sphereNormals = [];
  var sphereTexCoords = [];
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
      var u = 1 - (longNumber / sphere.longBands);
      var v = 1 - (latNumber / sphere.latBands);
      sphereVertices.push(sphere.radius * x);
      sphereVertices.push(sphere.radius * y);
      sphereVertices.push(sphere.radius * z);
      sphereNormals.push(x);
      sphereNormals.push(y);
      sphereNormals.push(z);
      sphereTexCoords.push(u);
      sphereTexCoords.push(v);
    }
  }

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

  sphereVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereVertices), gl.STATIC_DRAW);

  sphereVertexTextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereTexCoords), gl.STATIC_DRAW);

  sphereVertexNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereNormals), gl.STATIC_DRAW);

  sphereVertexIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphereIndices), gl.STATIC_DRAW);
}

function initCylinderBuffer() {
  var cylinderVertices = [];
  var cylinderNormals = [];
  var cylinderTexCoords = [];
  var Dangle = 2.0 * Math.PI / (cylinder.slices - 1);

  for (j = 0; j< cylinder.heights; j++) {
    for (i = 0; i< cylinder.slices; i++) {
      var angle = Dangle * i;
      var u = 1 - (i / cylinder.slices);
      var v = 1 - (j / cylinder.slices);
      cylinderVertices.push(cylinder.radius * Math.cos(angle));
      cylinderVertices.push(j * 3.0 / (cylinder.heights - 1) - 1.5);
      cylinderVertices.push(cylinder.radius * Math.sin(angle));
      cylinderNormals.push(Math.cos(angle));
      cylinderNormals.push(0.0);
      cylinderNormals.push(Math.sin(angle));
      cylinderTexCoords.push(u);
      cylinderTexCoords.push(v);
    }
  }

  var cylinderIndices = [];
  var nindices = (cylinder.heights - 1) * 6 * (cylinder.slices + 1);
  for (j = 0; j < cylinder.heights-1; j++) {
    for (i = 0; i <= cylinder.slices; i++) {
      var mi = i % cylinder.slices;
      var mi2 = (i + 1) % cylinder.slices;
      var idx = (j + 1) * cylinder.slices + mi;
      var idx2 = j * cylinder.slices + mi;
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

  cylinderVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylinderVertices), gl.STATIC_DRAW);

  cylinderVertexTextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexTextureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylinderTexCoords), gl.STATIC_DRAW);

  cylinderVertexNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cylinderNormals), gl.STATIC_DRAW);

  cylinderVertexIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderVertexIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cylinderIndices), gl.STATIC_DRAW);
}

///////////////////////////////////////////////

function setMatrixUniforms() {
  gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, mMatrix);
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
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexNormalBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexTextureCoordBuffer);
  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderVertexIndexBuffer);
  setMatrixUniforms();
  gl.drawElements(gl.TRIANGLES, 6174, gl.UNSIGNED_SHORT, 0);
}

function draw_sphere(matrix) {
  gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexTextureCoordBuffer);
  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
  setMatrixUniforms();
  gl.drawElements(gl.TRIANGLES, 2400, gl.UNSIGNED_SHORT, 0);
}

function draw_cube(matrix) {
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
  setMatrixUniforms();
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
}

function draw_teapot(matrix) {
  gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexNormalBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexTextureCoordBuffer);
  gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotVertexIndexBuffer);
  setMatrixUniforms();
  gl.drawElements(gl.TRIANGLES, 2976, gl.UNSIGNED_SHORT, 0);
}


function drawScene() {
  if (teapotVertexPositionBuffer == null || teapotVertexNormalBuffer == null || teapotVertexIndexBuffer == null || teapotVertexTextureCoordBuffer == null) {
    return;
  }
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);
  PushMatrix(mMatrix);
  mMatrix = mat4.multiply(mMatrix, roof);
  draw_cube(mMatrix);
  mMatrix = PopMatrix();

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, bottomTexture);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);
  PushMatrix(mMatrix);
  mMatrix = mat4.multiply(mMatrix, bottom);
  draw_cube(mMatrix);
  mMatrix = PopMatrix();

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, teapotTexture);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

  PushMatrix(mMatrix);
  mMatrix = mat4.multiply(mMatrix, teapot);
  draw_teapot(mMatrix);
  mMatrix = PopMatrix();

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, cylinderTexture);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

  mMatrix = mat4.multiply(mMatrix, wire);
  PushMatrix(mMatrix);
  mMatrix = mat4.translate(mMatrix, [0, 15, 0]);
  mMatrix = mat4.scale(mMatrix, [.2, 10, .2]);
  draw_cylinder(mMatrix);
  mMatrix = PopMatrix();

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, sphereTexture);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

  mMatrix = mat4.multiply(mMatrix, mvMatrix1);
  draw_sphere(mMatrix); // middle is a big Sphere
  PushMatrix(mMatrix);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, cylinderTexture);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

  /////////////// right side
  mMatrix = mat4.multiply(mMatrix, mvMatrix2);
  mMatrix = mat4.rotateZ(mMatrix, degToRad(-30));
  mMatrix = mat4.translate(mMatrix, [3.5, 0, 0]);

  PushMatrix(mMatrix); // right surround joint in a Push/Pop
  mMatrix = mat4.scale(mMatrix, [2, .5, .5]);
  draw_cube(mMatrix);
  mMatrix = PopMatrix(); // reset scaling

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, sphereTexture);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

  mMatrix = mat4.multiply(mMatrix, mvMatrix3); // smaller right sphere (joint) 1
  mMatrix = mat4.scale(mMatrix, [.5, .5, .5]);
  mMatrix = mat4.translate(mMatrix, [5, 0, 0]);
  draw_sphere(mMatrix);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, cylinderTexture);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

  mMatrix = mat4.multiply(mMatrix, mvMatrix6); // right arm 2
  mMatrix = mat4.rotateZ(mMatrix, degToRad(-90));
  mMatrix = mat4.scale(mMatrix, [4, 1, 1]);
  mMatrix = mat4.translate(mMatrix, [1.2, 0, 0]);
  draw_cube(mMatrix);

  //////////////////   left side
  mMatrix = PopMatrix(); // reset to middle big sphere
  PushMatrix(mMatrix);
  mMatrix = mat4.multiply(mMatrix, mvMatrix4); // left arm 1
  mMatrix = mat4.rotateZ(mMatrix, degToRad(30));
  mMatrix = mat4.translate(mMatrix, [-3.5, 0, 0]);

  PushMatrix(mMatrix); // surround left joint in a Push/Pop
  mMatrix = mat4.scale(mMatrix, [2, .5, .5]);
  draw_cube(mMatrix);
  mMatrix = PopMatrix(); // reset scaling

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, sphereTexture);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

  mMatrix = mat4.multiply(mMatrix, mvMatrix5); // smaller left sphere (joint) 2
  mMatrix = mat4.scale(mMatrix, [.5, .5, .5]);
  mMatrix = mat4.translate(mMatrix, [-5, 0, 0]);
  draw_sphere(mMatrix);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, cylinderTexture);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

  mMatrix = mat4.multiply(mMatrix, mvMatrix7); // left arm 2
  mMatrix = mat4.rotateZ(mMatrix, degToRad(90));
  mMatrix = mat4.scale(mMatrix, [4, 1, 1]);
  mMatrix = mat4.translate(mMatrix, [-1.2, 0, 0]);
  draw_cube(mMatrix);
  mMatrix = PopMatrix();

  ////////////////////////////////////////////////////////////////////
  // deal with glass textures here
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, glassTexture);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

  // blending
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.enable(gl.BLEND);
  gl.uniform1f(shaderProgram.alphaUniform, parseFloat(1));
  PushMatrix(mMatrix);
  mat4.identity(mMatrix);
  mat4.rotate(mMatrix, degToRad(X_angle), [0, 1, 0])
  mat4.rotate(mMatrix, degToRad(Y_angle), [1, 0, 0]);
  mMatrix = mat4.multiply(mMatrix, glass);
  draw_cube(mMatrix);
  mMatrix = PopMatrix();
  gl.disable(gl.BLEND);
  ////////////////////////////////////////////////////////////////////
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
    case 70:
    // f key
    camera.focus[2]--;
    camera.pos[2]--;
    break;
    case 66:
    // b key
    camera.focus[2]++;
    camera.pos[2]++;
    break;
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
  var canvas = document.getElementById("lab05-canvas");
  initGL(canvas);
  initShaders();
  initBuffers();
  initTextures();
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

  teapot = mat4.create();
  mat4.identity(teapot);
  teapot = mat4.translate(teapot, [.5, -15, 0]);
  teapot = mat4.scale(teapot, [.4, .4, .4]);

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

  bottom = mat4.create();
  mat4.identity(bottom);
  bottom = mat4.translate(bottom, [0, -23, 0]);
  bottom = mat4.scale(bottom, [15, 5, 15]);

  roof = mat4.create();
  mat4.identity(roof);
  roof = mat4.translate(roof, [0, 30, 0]);
  roof = mat4.scale(roof, [15, 10, 15]);

  glass = mat4.create();
  mat4.identity(glass);
  glass = mat4.translate(glass, [0, 1, 0]);
  glass = mat4.scale(glass, [15, 19, 15]);

  drawScene();
}

function redraw() {
  X_angle = 0;
  Y_angle = 0;
  mat4.identity(wire);
  mat4.identity(teapot);
  teapot = mat4.translate(teapot, [.5, -15, 0]);
  teapot = mat4.scale(teapot, [.4, .4, .4]);
  mat4.identity(bottom);
  bottom = mat4.translate(bottom, [0, -23, 0]);
  bottom = mat4.scale(bottom, [15, 5, 15]);
  mat4.identity(roof);
  roof = mat4.translate(roof, [0, 30, 0]);
  roof = mat4.scale(roof, [15, 10, 15]);
  mat4.identity(glass);
  glass = mat4.translate(glass, [0, 1, 0]);
  glass = mat4.scale(glass, [15, 19, 15]);
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
var moveDownId, rotateArmsId, moveUpId, shakeClawId, dropTeapotId;
// animation for the claw
function animated() {
  document.getElementById("anibutton").disabled = true;
  downDistance = 0;
  upDistance = 0;
  rotDistance = 0;
  shakeDistance = 0;
  dropDistance = 0;
  mat4.identity(wire);
  mat4.identity(teapot);
  teapot = mat4.translate(teapot, [.5, -15, 0]);
  teapot = mat4.scale(teapot, [.4, .4, .4]);
  mat4.identity(bottom);
  bottom = mat4.translate(bottom, [0, -23, 0]);
  bottom = mat4.scale(bottom, [15, 5, 15]);
  mat4.identity(roof);
  roof = mat4.translate(roof, [0, 30, 0]);
  roof = mat4.scale(roof, [15, 10, 15]);
  mat4.identity(glass);
  glass = mat4.translate(glass, [0, 1, 0]);
  glass = mat4.scale(glass, [15, 19, 15]);
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
  if (downDistance <= 55) {
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
    teapot = mat4.translate(teapot, [0.0, 0.25, 0]);
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
    if (shakeDistance % 2 == 0) {
      mvMatrix1 = mat4.rotate(mvMatrix1, degToRad(2.0), [0, 0, 1]);
    }
    else {
      mvMatrix1 = mat4.rotate(mvMatrix1, degToRad(-2.0), [0,0,1]);
    }
    shakeDistance++;
    drawScene();
  } else {
    clearInterval(shakeClawId);
    dropTeapotId = setInterval(dropTeapot, 5);
  }
}

// (5) automated function to drop the Teapot
function dropTeapot() {
  if (dropDistance <= 125) {
    teapot = mat4.translate(teapot, [0.0, -0.2, 0]);
    dropDistance++;
    drawScene();
  } else if (dropDistance <= 140 && dropDistance > 125) {
    teapot = mat4.translate(teapot, [0.0, 0.1, 0]);
    dropDistance++;
    drawScene();
  } else if (dropDistance <= 150 && dropDistance > 140) {
    teapot = mat4.translate(teapot, [0.0, -0.1, 0]);
    dropDistance++;
    drawScene();
  } else {
    clearInterval(dropTeapotId);
  }
}
