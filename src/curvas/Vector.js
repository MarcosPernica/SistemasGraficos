Vector = function(webGL, puntoInicial, puntoFinal, programaShader)
{
	var colores = new Array(vec3.fromValues(1, 0, 0), vec3.fromValues(0, 1, 0), vec3.fromValues(0, 0, 1));
	
	function color()
	{
		return colores[Math.floor(Math.random() * 3) % 3];
	}
	
	return new InterpolacionLineal(webGL, new Array(puntoInicial, puntoFinal), color, programaShader);
}





