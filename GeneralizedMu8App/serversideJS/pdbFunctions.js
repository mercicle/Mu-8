
var $ = require('jquery');

function Atom(type, atomnum, type2, aminotype, type4, aminonum, x, y, z)
{
	this.type = type;
	this.atomnum = atomnum;
	this.type2 = type2;
	this.aminotype= aminotype;
	this.type4 = type4;
	this.aminonum = aminonum;
	this.x = x;
	this.y = y;
	this.z = z;
}

function pdbToAtomFile(rawPDBFile)
{
	var pdbLines = rawPDBFile.toString().split("\n");
	
	var atomLines = new Array();
	var lineCounter = 0;
	for(var i = 0; i < pdbLines.length; i++)
	{
		if (pdbLines[i].substring(0, 5) == "ATOM ")
		{
			atomLines[lineCounter++] = pdbLines[i];
		}
	}
	
	return atomLines.join("\n");
}

function pdbToXYZFile(rawPDBFile)
{
	var pdbLines = rawPDBFile.toString().split("\n");
	
	var xyzLines = new Array();
	var lineCounter = 0;
	for(var i = 0; i < pdbLines.length; i++)
	{
		if ((pdbLines[i].substring(0, 5) == "ATOM ") && (pdbLines[i].substring(13, 16) == "CA ") && (pdbLines[i].substring(21,22) == "A"))
		{
			xyzLines[lineCounter++] = String(parseFloat(pdbLines[i].substring(30,38))) +"," + String(parseFloat(pdbLines[i].substring(38,46)))+","+String(parseFloat(pdbLines[i].substring(46,54)));
		}
	}
	
	// Duplicate first residue (methionine)
	xyzLines.splice(0, 0, xyzLines[0]);
	
	// Add "x,y,z" atop file
	xyzLines.splice(0, 0, "x,y,z");
	
	// Add last blank element to get a new line at the end
	xyzLines.push("");
	
	return xyzLines.join("\n");
}

function generateLinesFile(nicolasPDBFile){
	var minx = 999999.0;
	var miny = 999999.0;
	var minz = 999999.0;
	
	var maxx =-999999.0;
	var maxy =-999999.0;
	var maxz =-999999.0;
	
	var linesJS = "";
	
	var pdbLines = nicolasPDBFile.split("\n");
	var atomArray = new Array();
	
	for(var i = 0; i < pdbLines.length; i++)
	{
		var atom = new Atom(pdbLines[i].substring(0,4), pdbLines[i].substring(7, 11).trim(), pdbLines[i].substring(13,16).trim(), pdbLines[i].substring(17,20), pdbLines[i].substring(21,22), pdbLines[i].substring(22,26).trim(), pdbLines[i].substring(30,38).trim(), pdbLines[i].substring(38,46).trim(), pdbLines[i].substring(46,54).trim());
		
		atomArray.push(atom)
		maxx = Math.max(maxx, parseFloat(atom.x));
		maxy = Math.max(maxy, parseFloat(atom.y));
		maxz = Math.max(maxz, parseFloat(atom.z));
		minx = Math.min(minx, parseFloat(atom.x));
		miny = Math.min(miny, parseFloat(atom.y));
		minz = Math.min(minz, parseFloat(atom.z));
	} 
	
	linesJS += "var linesVertexPositionBuffer;\n";
	linesJS += "var linesVertexColorBuffer;\n";
	linesJS += "var quadPosBuffer;\n";
	
	linesJS += "function initBuffers() {\n";
	linesJS += "    linesVertexPositionBuffer = gl.createBuffer();\n";
	linesJS += "    gl.bindBuffer(gl.ARRAY_BUFFER, linesVertexPositionBuffer);\n";
	
	linesJS += "var vertices = [\n";

	var indices = new Array();
	var nseg = 0;
	
	for(var i = 0; i < pdbLines.length; i++)
	{
		var atom = atomArray[i];
		
		if (atom.type2 == "N") // peptidic links
		{
			for (var j = 1; j < 20; j++)
			{
				if (i-j < 0) continue;
				if (atom.aminonum == atomArray[i-j].aminonum) continue;
				if (atom.type4[0] != atomArray[i-j].type4[0]) break;
				if (atomArray[i-j].type2 == "C") {
					indices.push([i, i-j]);
					nseg++;
					break;
				}
			}
		}
		
		if (atom.type2 == "O") // C-O
		{
			for (var j = 1; j < 20; j++)
			{
				if (i-j < 0) continue;
				if (atom.aminonum != atomArray[i-j].aminonum) continue;
				if (atom.type4[0] != atomArray[i-j].type4[0]) break;
				if (atomArray[i-j].type2 == "C")
				{
					indices.push([i, i-j]);
					nseg++;
					break;
				}
			}
			continue;
		}
		
		if (atom.type2[1]=='A') {  // C-CA  and CA-N
			for (var j=1; j<20; j++) {
				if (i+j>=pdbLines.length) continue;
				if (atom.aminonum != atomArray[i+j].aminonum) continue;
				if (atomArray[i+j].type2 == "C") {
				    indices.push([i, i+j]);
					nseg++;
					break;
				}
			}
			for (var j=1; j<20; j++) {
				if (i-j<0) continue;
				if (atom.aminonum != atomArray[i-j].aminonum) continue;
				if (atomArray[i-j].type2 == "N") {
				    indices.push([i, i-j]);
					nseg++;
					break;
				}
			}
			continue;
		}
		
		
		
		
		//HERE 
		
		
		if (atom.type2[1]=='B') {  // CA-CB
			for (var j=1; j<20; j++) {
				if (i-j<0) continue;
				if (atom.aminonum != atomArray[i-j].aminonum) continue;
				if (atomArray[i-j].type2[1]=='A') {
				    indices.push([i, i-j]);
					nseg++;
					break;
				}
			}
			continue;
		}

		if (atom.type2[1]=='G') {  // CB-CG or CB-CG1 or CB-CG2
			for (var j=1; j<20; j++) {
				if (i-j<0) continue;
				if (atom.aminonum != atomArray[i-j].aminonum) continue;
				if (atomArray[i-j].type2[1]=='B') {
				    indices.push([i, i-j]);
					nseg++;
					break;
				}
			}
			continue;
		}

		if (atom.type2[1]=='D') {  // CD - CG or CD1-CG or CD2-CG or CD1-CG1 or CD2-CG2
			for (var j=1; j<20; j++) {
				if (i-j<0) continue;
				if (atom.aminonum != atomArray[i-j].aminonum) continue;
				if ((atomArray[i-j].type2[1]=='G') && (atomArray[i-j].type2[2]==atom.type2[2])) {
				    indices.push([i, i-j]);
					nseg++;
					//break;
				}
				if (atomArray[i-j].type2 == "CG") {
				    indices.push([i, i-j]);
					nseg++;
					//break;
				}
				if (atomArray[i-j].type2 == "OG") {
				    indices.push([i, i-j]);
					nseg++;
					//break;
				}
				if ((atomArray[i-j].type2 == "N")  && (atom.type2 == "CD") && (atom.aminotype == "PRO")) { // special cycle for PRO
				    indices.push([i, i-j]);
					nseg++;
					//break;
				}
			}
			continue;
		}

		if (atom.type2[1]=='E') {  // CD - CE or CD-CE1 or CD-CE2 or CD1-CE1 or CD2-CE2 or CD2-CE3
			for (var j=1; j<20; j++) {
				if (i-j<0) continue;
				if (atom.aminonum != atomArray[i-j].aminonum) continue;
				if (atomArray[i-j].type2[1]=='D' && atomArray[i-j].type2[2]==atom.type2[2]) {
				    indices.push([i, i-j]);
					nseg++;
					//break;
				}
				if (atomArray[i-j].type2[1]=='D' && atomArray[i-j].type2[2]=='2' && atom.type2[2]=='3') {
				    indices.push([i, i-j]);
					nseg++;
					//break;
				}
				if (atomArray[i-j].type2 == "CD") {
				    indices.push([i, i-j]);
					nseg++;
					//break;
				}
				if ((atomArray[i-j].type2 == "NE1") && (atom.type2 == "CE2")) { // special for TRP
				    indices.push([i, i-j]);
					nseg++;
					//break;
				}
				if ((atom.type2 == "NE2") && (atomArray[i-j].type2 == "CE1")) { // special for HIS
				    indices.push([i, i-j]);
					nseg++;
					//break;
				}
			}
			continue;
		}


		if (atom.type2[1]=='Z') {  // CE - CZ or CE-CZ1 or CE-CZ2 or CE1-CZ1 or CE2-CZ2 or CE3-CZ3 or CZ3-CH2
			for (var j=1; j<20; j++) {
				if (i-j<0) continue;
				if (atom.aminonum != atomArray[i-j].aminonum) continue;
				if (atomArray[i-j].type2[1]=='E' && atomArray[i-j].type2[2]==atom.type2[2]) {
				    indices.push([i, i-j]);
					nseg++;
					//break;
				}
				if (atomArray[i-j].type2 == "CE") {
				    indices.push([i, i-j]);
					nseg++;
					//break;
				}
				if (atomArray[i-j].type2 == "NE") {
				    indices.push([i, i-j]);
					nseg++;
					//break;
				}
				if ((atomArray[i-j].type2 == "CE1") && (atom.type2 == "CZ")) { // PHE and TYR
				    indices.push([i, i-j]);
					nseg++;
					//break;
				}
				if ((atomArray[i-j].type2 == "CE2") && (atom.type2 == "CZ")) { // PHE and TYR
				    indices.push([i, i-j]);
					nseg++;
					//break;
				}
			}
			continue;
		}

		if (atom.type2[1]=='H') {  // CZ - CH or CZ-CH1 or CZ-CH2 or CZ1-CH1 or CZ2-CH2 or CZ3-CH3
			for (var j=1; j<20; j++) {
				if (i-j<0) continue;
				if (atom.aminonum != atomArray[i-j].aminonum) continue;
				if (atomArray[i-j].type2[1]=='Z' && atomArray[i-j].type2[2]==atom.type2[2]) {
				    indices.push([i, i-j]);
					nseg++;
					//break;
				}
				if (atomArray[i-j].type2 == "CZ") {				
				    indices.push([i, i-j]);
					nseg++;
					//break;
				}
				if (atomArray[i-j].type2 == "NZ") {					
				    indices.push([i, i-j]);
					nseg++;
					//break;
				}
				if ((atom.type2 == "CH2") && (atomArray[i-j].type2 == "CZ3")){ // special for TRP
				    indices.push([i, i-j]);
					nseg++;
					//break;
				}
			}
			continue;
		}
	}

	
	for (var i=0; i<nseg; i++) {
		at0 = atomArray[indices[i][0]];
		at1 = atomArray[indices[i][1]];
		
		linesJS += String(at0.x) + ", " + String(at0.y) + ", " + String(at0.z) + ", " + String(at1.x) + ", " + String(at1.y) + ", " + String(at1.z) + ",\n";
	}
	
	linesJS += "0];\n";
	
	linesJS += "    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);\n";
	linesJS += "	linesVertexPositionBuffer.numItems = " + String(nseg*2) + " ;\n";
	linesJS += "    linesVertexPositionBuffer.itemSize = 3;\n";
	
	linesJS += "linesVertexColorBuffer = gl.createBuffer();\n";
	linesJS += "gl.bindBuffer(gl.ARRAY_BUFFER, linesVertexColorBuffer);\n";
	linesJS += "var colors = [\n";
	
	color_codes = {};
	color_codes["ALA"] = 0x77dd88;
	color_codes["GLY"] = 0x77dd88; 	 
	color_codes["CYS"] = 0x99ee66; 	 
	color_codes["ASP"] = 0x55bb33; 	 
	color_codes["GLU"] = 0x55bb33; 	 
	color_codes["ASN"] = 0x55bb33; 	 
	color_codes["GLN"] = 0x55bb33; 	 
	color_codes["ILE"] = 0x66bbff; 	 
	color_codes["LEU"] = 0x66bbff; 	 
	color_codes["MET"] = 0x66bbff; 	 
	color_codes["VAL"] = 0x66bbff; 	 
	color_codes["PHE"] = 0x9999ff; 	 
	color_codes["TRP"] = 0x99ee66; 	 
	color_codes["TYR"] = 0x99ee66; 	 
	color_codes["HIS"] = 0x5555ff; 	 
	color_codes["LYS"] = 0xffcc77; 	 
	color_codes["ARG"] = 0xffcc77; 	 
	color_codes["PRO"] = 0xeeaaaa; 	 
	color_codes["SER"] = 0xff4455; 	 
	color_codes["THR"] = 0xff4455; 	 
	
	for (var i=0; i < nseg; i++)
	{
		var a0 = color_codes[String(atomArray[indices[i][0]].aminotype)];
		var a1 = color_codes[String(atomArray[indices[i][1]].aminotype)];
		
		var r0 = (a0/(255*255))/255.0;
		var r1 = (a1/(255*255))/255.0;
		var g0 = ((a0 & 0xff00)/255)/255.0;
		var g1 = ((a1 & 0xff00)/255)/255.0;
		var b0 = ((a0&0xff))/255.0;
		var b1 = ((a1&0xff))/255.0;
		
		linesJS += String(r0) + ", " + String(g0) + ", " + String(b0) + ", " + String(atomArray[indices[i][0]].aminonum) + ", " + String(r1) + ", " + String(g1) + ", " + String(b1) + ", " + String(atomArray[indices[i][1]].aminonum)+ ", \n";
		
	}
	
	linesJS += "0];\n";
	linesJS += "gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);\n";
	linesJS += "linesVertexColorBuffer.itemSize = 4;\n";
	linesJS += "linesVertexColorBuffer.numItems = " + String(nseg*2) + ";\n";
	
	
	
	linesJS += "linesTangentBuffer = gl.createBuffer();\n";
	linesJS += "gl.bindBuffer(gl.ARRAY_BUFFER, linesTangentBuffer);\n";
	linesJS += "var tangents = new Array();\n";
	linesJS += "for (i=0; i<linesVertexColorBuffer.numItems; i++) {\n";
	linesJS += "    for (j=0; j<6; j++) {\n";
	linesJS += "        tangents[i*6+j] = vertices[i*6+j%3]-vertices[i*6+j%3+3];\n";
	linesJS += "    }\n";
	linesJS += "    var n1 = Math.sqrt(tangents[i*6+0]*tangents[i*6+0]+tangents[i*6+1]*tangents[i*6+1]+tangents[i*6+2]*tangents[i*6+2]);\n";
	linesJS += "    var n2 = Math.sqrt(tangents[i*6+3]*tangents[i*6+3]+tangents[i*6+4]*tangents[i*6+4]+tangents[i*6+5]*tangents[i*6+5]);\n";
	linesJS += "    tangents[i*6+0]/=n1; tangents[i*6+1]/=n1; tangents[i*6+2]/=n1;\n";
	linesJS += "    tangents[i*6+3]/=n2; tangents[i*6+4]/=n2; tangents[i*6+5]/=n2;\n";
	linesJS += "}\n";
	linesJS += "gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tangents), gl.STATIC_DRAW);\n";
	linesJS += "linesTangentBuffer.numItems = " + String(nseg*2) + " ;\n";
	linesJS += "linesTangentBuffer.itemSize = 3;\n";
	linesJS += "\n";
	linesJS += "\n";
	linesJS += "// generate cylinders instead of lines\n";
	linesJS += "\n";
	linesJS += "var Ncyl = 6;\n";
	linesJS += "var R = 0.3;\n";
	linesJS += "var vtxCyl = new Array();\n";
	linesJS += "var normalsCyl = new Array();\n";
	linesJS += "var colorsCyl = new Array();\n";
	linesJS += "var trianglesCyl = new Array();\n";
	linesJS += "for (i=0; i<" + String(nseg) + "; i++) {\n";
	linesJS += "    for (j=0; j<Ncyl; j++) {\n";
	linesJS += "        colorsCyl[i*Ncyl*2*4+j*4+0] = colors[i*8+0];\n";
	linesJS += "        colorsCyl[i*Ncyl*2*4+j*4+1] = colors[i*8+1];\n";
	linesJS += "        colorsCyl[i*Ncyl*2*4+j*4+2] = colors[i*8+2];\n";
	linesJS += "        colorsCyl[i*Ncyl*2*4+j*4+3] = colors[i*8+3];\n";
	linesJS += "        colorsCyl[i*Ncyl*2*4+j*4+0+Ncyl*4] = colors[i*8+4];\n";
	linesJS += "        colorsCyl[i*Ncyl*2*4+j*4+1+Ncyl*4] = colors[i*8+5];\n";
	linesJS += "        colorsCyl[i*Ncyl*2*4+j*4+2+Ncyl*4] = colors[i*8+6];\n";
	linesJS += "        colorsCyl[i*Ncyl*2*4+j*4+3+Ncyl*4] = colors[i*8+7];\n";
	linesJS += "\n";
	linesJS += "        var oX = 0.;\n";
	linesJS += "        var oY = tangents[i*6+2];\n";
	linesJS += "        var oZ = -tangents[i*6+1]; //orthogonal vector   \n";
	linesJS += "        var n = Math.sqrt(oX*oX+oY*oY+oZ*oZ);\n";
	linesJS += "        oX/=n;\n";
	linesJS += "        oY/=n;\n";
	linesJS += "        oZ/=n;\n";
	linesJS += "        var bX = tangents[i*6+1]*oZ-tangents[i*6+2]*oY; //binormal vector\n";
	linesJS += "        var bY = tangents[i*6+2]*oX-tangents[i*6+0]*oZ;\n";
	linesJS += "        var bZ = tangents[i*6+0]*oY-tangents[i*6+1]*oX;   \n";
	linesJS += "        var theta = j*3.1416*2./Ncyl;\n";
	linesJS += "        var ctheta = Math.cos(theta)*R;\n";
	linesJS += "        var stheta = Math.sin(theta)*R;\n";
	linesJS += "        vtxCyl[i*Ncyl*6+j*3+0] = vertices[i*6+0] + oX*ctheta + bX*stheta;\n";
	linesJS += "        vtxCyl[i*Ncyl*6+j*3+1] = vertices[i*6+1] + oY*ctheta + bY*stheta; \n";
	linesJS += "        vtxCyl[i*Ncyl*6+j*3+2] = vertices[i*6+2] + oZ*ctheta + bZ*stheta;\n";
	linesJS += "        normalsCyl[i*Ncyl*6+j*3+0] = oX*ctheta + bX*stheta;\n";
	linesJS += "        normalsCyl[i*Ncyl*6+j*3+1] = oY*ctheta + bY*stheta;\n";
	linesJS += "        normalsCyl[i*Ncyl*6+j*3+2] = oZ*ctheta + bZ*stheta;\n";
	linesJS += "\n";
	linesJS += "        vtxCyl[i*Ncyl*6+j*3+0+Ncyl*3] = vertices[i*6+3] + oX*ctheta + bX*stheta;\n";
	linesJS += "        vtxCyl[i*Ncyl*6+j*3+1+Ncyl*3] = vertices[i*6+4] + oY*ctheta + bY*stheta;\n";
	linesJS += "        vtxCyl[i*Ncyl*6+j*3+2+Ncyl*3] = vertices[i*6+5] + oZ*ctheta + bZ*stheta; \n";
	linesJS += "        normalsCyl[i*Ncyl*6+j*3+0+Ncyl*3] = oX*ctheta + bX*stheta;\n";
	linesJS += "        normalsCyl[i*Ncyl*6+j*3+1+Ncyl*3] = oY*ctheta + bY*stheta;\n";
	linesJS += "        normalsCyl[i*Ncyl*6+j*3+2+Ncyl*3] = oZ*ctheta + bZ*stheta;   \n";
	linesJS += "\n";
	linesJS += "        trianglesCyl[i*Ncyl*6+j*6+0] = i*Ncyl*2+j;\n";
	linesJS += "        trianglesCyl[i*Ncyl*6+j*6+1] = i*Ncyl*2+(j+1)%Ncyl;\n";
	linesJS += "        trianglesCyl[i*Ncyl*6+j*6+2] = i*Ncyl*2+j+Ncyl;\n";
	linesJS += "\n";
	linesJS += "        trianglesCyl[i*Ncyl*6+j*6+3] = i*Ncyl*2+(j+1)%Ncyl;\n";
	linesJS += "        trianglesCyl[i*Ncyl*6+j*6+4] = i*Ncyl*2+j+Ncyl;\n";
	linesJS += "        trianglesCyl[i*Ncyl*6+j*6+5] = i*Ncyl*2+(j+1)%Ncyl+Ncyl;   \n";
	linesJS += "    }\n";
	linesJS += "}\n";
	linesJS += "\n";
	linesJS += "vtxCylBuffer = gl.createBuffer();\n";
	linesJS += "gl.bindBuffer(gl.ARRAY_BUFFER, vtxCylBuffer);\n";
	linesJS += "gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vtxCyl), gl.STATIC_DRAW);\n";
	linesJS += "vtxCylBuffer.numItems = " + String(nseg*2) + "*Ncyl;\n";
	linesJS += "vtxCylBuffer.itemSize = 3;\n";
	linesJS += "\n";
	linesJS += "normalsCylBuffer = gl.createBuffer();\n";
	linesJS += "gl.bindBuffer(gl.ARRAY_BUFFER, normalsCylBuffer);\n";
	linesJS += "gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalsCyl), gl.STATIC_DRAW);\n";
	linesJS += "normalsCylBuffer.numItems = " + String(nseg*2) + "*Ncyl;\n";
	linesJS += "normalsCylBuffer.itemSize = 3;	\n";
	linesJS += "\n";
	linesJS += "colCylBuffer = gl.createBuffer();\n";
	linesJS += "gl.bindBuffer(gl.ARRAY_BUFFER, colCylBuffer);\n";
	linesJS += "gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorsCyl), gl.STATIC_DRAW);\n";
	linesJS += "colCylBuffer.numItems = " + String(nseg*2) + "*Ncyl;\n";
	linesJS += "colCylBuffer.itemSize = 4;\n";
	linesJS += "\n";
	linesJS += "triCylBuffer = gl.createBuffer();\n";
	linesJS += "gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triCylBuffer);\n";
	linesJS += "gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(trianglesCyl), gl.STATIC_DRAW);\n";
	linesJS += "triCylBuffer.numItems = " + String(nseg*2) + "*Ncyl*3;\n";
	linesJS += "triCylBuffer.itemSize = 3;\n";
	linesJS += "\n";
	linesJS += "\n";
	linesJS += "var vtxQuad = new Array();\n";
	linesJS += "vtxQuad[0]=-1.;\n";
	linesJS += "vtxQuad[1]=-1.;\n";
	linesJS += "vtxQuad[2]=0.;\n";
	linesJS += "vtxQuad[3]=-1.;\n";
	linesJS += "vtxQuad[4]=1.;\n";
	linesJS += "vtxQuad[5]=0.;\n";
	linesJS += "vtxQuad[6]=1.;\n";
	linesJS += "vtxQuad[7]=1.;\n";
	linesJS += "vtxQuad[8]=0.;\n";
	linesJS += "vtxQuad[9]=-1.;\n";
	linesJS += "vtxQuad[10]=-1.;\n";
	linesJS += "vtxQuad[11]=0.;\n";
	linesJS += "vtxQuad[12]=1.;\n";
	linesJS += "vtxQuad[13]=1.;\n";
	linesJS += "vtxQuad[14]=0.;\n";
	linesJS += "vtxQuad[15]=1.;\n";
	linesJS += "vtxQuad[16]=-1.;\n";
	linesJS += "vtxQuad[17]=0.;\n";
	linesJS += "\n";
	linesJS += "\n";
	linesJS += "quadPosBuffer = gl.createBuffer();\n";
	linesJS += "gl.bindBuffer(gl.ARRAY_BUFFER, quadPosBuffer);\n";
	linesJS += "gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vtxQuad), gl.STATIC_DRAW);\n";
	linesJS += "quadPosBuffer.numItems = 6;\n";
	linesJS += "quadPosBuffer.itemSize = 3;	\n";
	linesJS += "\n";
	linesJS += "}\n";
	
	return linesJS;
	
}


module.exports = {    
    Atom: Atom,
    pdbToAtomFile : pdbToAtomFile,
    pdbToXYZFile : pdbToXYZFile,
    generateLinesFile : generateLinesFile
}
 
