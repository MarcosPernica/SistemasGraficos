function crearShader(webGL, idScriptShader, tipoShader)
{
	var handler = null;
	var codigo = '';
	var elemento = document.getElementById(idScriptShader);
			
	if(!elemento)
		return null;
		
	codigo = elemento.text;
	
	handler = webGL.createShader(tipoShader);
	webGL.shaderSource(handler, codigo);
	webGL.compileShader(handler);
	
	if(!webGL.getShaderParameter(handler, webGL.COMPILE_STATUS))
	{
		alert('No se pudo compilar el shader: ' + webGL.getShaderInfoLog(handler));
		webGL.deleteShader(handler);
		return null;
	}			
	return handler;
}