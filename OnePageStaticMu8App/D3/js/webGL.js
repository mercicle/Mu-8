/*
Copyright (c) 2013, Johnathan Mercer, Balaji Pandian, Nicolas Bonneel, Alexander Lex, Hanspeter Pfister

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of Harvard University nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
var gl = null;
var sizeRT = 2048;

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl", {
            alpha: false
        });
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) { }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}


function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

var useCylinders = true;

var shaderProgram;
var shaderProgramQuad;
var shaderVariables = {
    'mMinValue': 0,
    'mMaxValue': 1
};

function initShaders() {
    var fragmentShader;
    var vertexShader;

    if (useCylinders) {
        fragmentShader = getShader(gl, "shaderCyl-fs");
        vertexShader = getShader(gl, "shaderCyl-vs");
    } else {
        fragmentShader = getShader(gl, "shader-fs");
        vertexShader = getShader(gl, "shader-vs");
    }


    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
	gl.useProgram(shaderProgram);    

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    if (useCylinders) {
        shaderProgram.normalsAttribute = gl.getAttribLocation(shaderProgram, "aNormals");
        gl.enableVertexAttribArray(shaderProgram.normalsAttribute);
    } else {
        shaderProgram.tangentAttribute = gl.getAttribLocation(shaderProgram, "aTangent");
        gl.enableVertexAttribArray(shaderProgram.tangentAttribute);
    }
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);


    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

    if (!useCylinders)
        shaderProgram.pixelOffset = gl.getUniformLocation(shaderProgram, "pixelOffset");

    shaderVariables.mMinValue = gl.getUniformLocation(shaderProgram, "valMin");
    shaderVariables.mMaxValue = gl.getUniformLocation(shaderProgram, "valMax");
    gl.uniform1i(shaderVariables.mMinValue, 0);
    gl.uniform1i(shaderVariables.mMaxValue, 15);	
	
	var fragmentShaderQuad = getShader(gl, "shaderQuad-fs");
	var vertexShaderQuad = getShader(gl, "shaderQuad-vs");
    shaderProgramQuad = gl.createProgram();
    gl.attachShader(shaderProgramQuad, vertexShaderQuad);
    gl.attachShader(shaderProgramQuad, fragmentShaderQuad);
    gl.linkProgram(shaderProgramQuad);
    if (!gl.getProgramParameter(shaderProgramQuad, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }	
	gl.useProgram(shaderProgramQuad);
	shaderProgramQuad.vertexPositionAttribute = gl.getAttribLocation(shaderProgramQuad, "aVertexPosition");
	shaderProgramQuad.samplerUniform = gl.getUniformLocation(shaderProgramQuad, "uSampler");
	shaderProgramQuad.texWUniform = gl.getUniformLocation(shaderProgramQuad, "texW");
	gl.uniform1f(shaderProgramQuad.texWUniform, sizeRT);
}


var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var rotValue = 0.0;

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function drawScene() {
	
	gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);
	
    gl.viewport(0, 0, sizeRT, sizeRT);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, 1., 0.5, 300., pMatrix);

	gl.useProgram(shaderProgram);    
	for (i=0; i<5; i++) {
		gl.disableVertexAttribArray(i);
	}	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, null);
    if (useCylinders) {
        gl.bindBuffer(gl.ARRAY_BUFFER, vtxCylBuffer);
		gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vtxCylBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, normalsCylBuffer);
		gl.enableVertexAttribArray(shaderProgram.normalsAttribute);
        gl.vertexAttribPointer(shaderProgram.normalsAttribute, normalsCylBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, colCylBuffer);
		gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, colCylBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triCylBuffer);
        setMatrixUniforms();
        gl.drawElements(gl.TRIANGLES, triCylBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    } else {
        gl.bindBuffer(gl.ARRAY_BUFFER, linesVertexPositionBuffer);
		gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, linesVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, linesTangentBuffer);
		gl.enableVertexAttribArray(shaderProgram.tangentAttribute);
        gl.vertexAttribPointer(shaderProgram.tangentAttribute, linesTangentBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, linesVertexColorBuffer);
		gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, linesVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
        setMatrixUniforms();
        gl.uniform1f(shaderProgram.pixelOffset, 0.);

        gl.drawArrays(gl.LINES, 0, linesVertexPositionBuffer.numItems);

        // thicker lines
        thickness = 5*(sizeRT/250); //should preferably be odd. 3 means 3 lines at -1, 0, +1
        for (k = 0; k < thickness; k++) {
            gl.uniform1f(shaderProgram.pixelOffset, (k - thickness / 2)/ sizeRT); // one pixel offset = 1./width=1./sizeRT
            gl.drawArrays(gl.LINES, 0, linesVertexPositionBuffer.numItems);
        }

    }
	
	

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);       
		gl.useProgram(shaderProgramQuad);
	for (i=0; i<5; i++) {
		gl.disableVertexAttribArray(i);
	}		
        gl.bindBuffer(gl.ARRAY_BUFFER, quadPosBuffer);
		gl.enableVertexAttribArray(shaderProgramQuad.vertexPositionAttribute);
		gl.vertexAttribPointer(shaderProgramQuad.vertexPositionAttribute, quadPosBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, rttTexture);
        gl.uniform1i(shaderProgramQuad.samplerUniform, 0);
		gl.drawArrays(gl.TRIANGLES , 0, quadPosBuffer.numItems);
}

var lastTime = 0;

function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        rotValue += (10 * elapsed) / 1000.0;
    }
    lastTime = timeNow;

    var checkRot = document.getElementById("checkRot");
    if (checkRot && checkRot.checked) {
        var newRotationMatrix = mat4.create();
        mat4.identity(newRotationMatrix);
        mat4.translate(newRotationMatrix, [tx, ty, tz]);
        if (elapsed > 0)
            mat4.rotate(newRotationMatrix, -3.14 / 180. * (elapsed / 100.), [0, 1, 0]);
        mat4.translate(newRotationMatrix, [-tx, -ty, -tz]);
        mat4.multiply(newRotationMatrix, mvMatrix, mvMatrix);
    }
}

function tick() {
    requestAnimFrame(tick);
    drawScene();
    animate();
}

var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;
var mb = 0;

var moonRotationMatrix = mat4.create();
mat4.identity(moonRotationMatrix);

function handleMouseDown(event) {
    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    if (event.button == 2) {
        mb = 2;
    }
    if (event.button == 1) {
        mb = 1;
    }
    event.preventDefault();
}

function handleMouseUp(event) {
    mouseDown = false;
    mb = 0;
}

function handleMouseMove(event) {
    event.preventDefault();
    if (!mouseDown) {
        return false;
    }
    var newX = event.clientX;
    var newY = event.clientY;

    var deltaX = newX - lastMouseX;
    var deltaY = newY - lastMouseY;

    deltaX *= -3.5;
    deltaY *= -3.5;

    var newRotationMatrix = mat4.create();
    mat4.identity(newRotationMatrix);

    if (mb == 0) {
        mat4.translate(newRotationMatrix, [-0, -0, -100]);
        mat4.rotate(newRotationMatrix, -3.14 / 180. * (deltaX / 10), [0, 1, 0]);
        mat4.rotate(newRotationMatrix, -3.14 / 180. * (deltaY / 10), [1, 0, 0]);
        mat4.translate(newRotationMatrix, [0, 0, 100]);
    } else {
        if (mb == 1) {
            mat4.translate(newRotationMatrix, [deltaX * 0.25, -deltaY * 0.25, 0]);
            tx += deltaX * 0.25;
            ty -= deltaY * 0.25;
        } else
            mat4.translate(newRotationMatrix, [0, 0, -deltaY * 0.25]);
        tz -= deltaY * 0.25;
    }

    mat4.multiply(newRotationMatrix, mvMatrix, mvMatrix);

    lastMouseX = newX
    lastMouseY = newY;

    return false;
}

function resetView() {
    tx = 0;
    ty = 0;
    tz = -100;
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [-00, -0.0, -100.0]);	
	mat4.translate(mvMatrix, [-73.5, -40.5, -51.6]);
}

var rttFramebuffer;
    function initTextureFramebuffer() {
        rttFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, rttFramebuffer);
        rttFramebuffer.width = sizeRT;
        rttFramebuffer.height = sizeRT;

        rttTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, rttTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );        

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, rttFramebuffer.width, rttFramebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);		

        var renderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, rttFramebuffer.width, rttFramebuffer.height);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rttTexture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
	
function webGLStart() {
    var canvas = document.getElementById("canvas3d");


    initGL(canvas);
	initTextureFramebuffer();
    initShaders();
    initBuffers();

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    //gl.disable(gl.DEPTH_TEST);

    //gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    //gl.blendFunc(gl.GL_ONE, gl.GL_ONE); 
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    resetView();

    canvas.onmousedown = handleMouseDown;
    canvas.onmouseup = handleMouseUp;
    canvas.onmousemove = handleMouseMove;
    canvas.draggable = false;
    canvas.oncontextmenu = function () {
        return false;
    }
    tick();
}