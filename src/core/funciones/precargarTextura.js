var cache = new Array();

function precargarTextura(webGL, textura, repetir)
{
	if(cache[textura.src])
		return cache[textura.src];
		
	var texturaWebGL = webGL.createTexture();
	webGL.bindTexture(webGL.TEXTURE_2D, texturaWebGL);

	webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_MIN_FILTER, webGL.LINEAR);
	webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_MAG_FILTER, webGL.LINEAR);
	
	if(repetir == undefined)
		repetir = true;
		
	if(!repetir)
	{
		webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_WRAP_S, webGL.CLAMP_TO_EDGE);
		webGL.texParameteri(webGL.TEXTURE_2D, webGL.TEXTURE_WRAP_T, webGL.CLAMP_TO_EDGE);
	}		
		
	webGL.texImage2D(webGL.TEXTURE_2D, 0, webGL.RGBA, webGL.RGBA, webGL.UNSIGNED_BYTE, textura);
	
	cache[textura.src] = texturaWebGL;
	
	return texturaWebGL;
}

function precargarTexturaCubo(webGL, cara1, cara2, cara3, cara4, cara5, cara6, repetir)
{		
	var indice = cara1.src+cara2.src+cara3.src+cara4.src+cara5.src+cara6.src;
	if(cache[indice])
		return cache[indice];
	
	var texturaCuboWebGL = webGL.createTexture();
	webGL.bindTexture(webGL.TEXTURE_CUBE_MAP, texturaCuboWebGL);
	
	webGL.texParameteri(webGL.TEXTURE_CUBE_MAP, webGL.TEXTURE_MIN_FILTER, webGL.LINEAR);
	webGL.texParameteri(webGL.TEXTURE_CUBE_MAP, webGL.TEXTURE_MAG_FILTER, webGL.LINEAR);
	
	if(repetir == undefined)
		repetir = true;
		
	if(!repetir)
	{
		webGL.texParameteri(webGL.TEXTURE_CUBE_MAP, webGL.TEXTURE_WRAP_S, webGL.CLAMP_TO_EDGE);
		webGL.texParameteri(webGL.TEXTURE_CUBE_MAP, webGL.TEXTURE_WRAP_T, webGL.CLAMP_TO_EDGE);
	}		

	webGL.texImage2D(webGL.TEXTURE_CUBE_MAP_POSITIVE_X, 0, webGL.RGBA, webGL.RGBA, webGL.UNSIGNED_BYTE, cara1);
	webGL.texImage2D(webGL.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, webGL.RGBA, webGL.RGBA, webGL.UNSIGNED_BYTE, cara2);
	webGL.texImage2D(webGL.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, webGL.RGBA, webGL.RGBA, webGL.UNSIGNED_BYTE, cara3);
	webGL.texImage2D(webGL.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, webGL.RGBA, webGL.RGBA, webGL.UNSIGNED_BYTE, cara4);
	webGL.texImage2D(webGL.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, webGL.RGBA, webGL.RGBA, webGL.UNSIGNED_BYTE, cara5);
	webGL.texImage2D(webGL.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, webGL.RGBA, webGL.RGBA, webGL.UNSIGNED_BYTE, cara6);
	
	cache[indice] = texturaCuboWebGL;
	
	return texturaCuboWebGL;
}