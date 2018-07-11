Plano = function(webGL, cantidadFilas, cantidadColumnas, programaShader)
{
	var tangentes;
	var normales;
	
	var objeto3D = new Objeto3D(webGL, cantidadFilas, cantidadColumnas, null, programaShader);
	objeto3D.construir();
	
	function calcularNormales()
	{
		normales = new Array();
		
		var normal = vec3.fromValues(0, 0, -1);
		
		for(var i = 0; i < cantidadFilas * cantidadColumnas; i++)
			normales.push(normal);
	}	
	calcularNormales();
	
	function calcularTangentes()
	{
		tangentes = new Array();
		
		var tangente = vec3.fromValues(1, 0, 0);
		
		for(var i = 0; i < cantidadFilas * cantidadColumnas; i++)
			tangentes.push(tangente);
	}
	calcularTangentes();
	
	objeto3D.obtenerNormales = function()
	{
		return normales;
	}
	
	objeto3D.obtenerTangentes = function()
	{
		return tangentes;
	}
	
	objeto3D.aplicarTransformacionAdicional = function(matriz)
	{
		var transformacion = mat3.create();
		mat3.normalFromMat4(transformacion, matriz); 
		
		for(var i = 0; i < tangentes.length; i++)
		{
			vec3.transformMat3(tangentes[i], tangentes[i], transformacion);
			vec3.transformMat3(normales[i], normales[i], transformacion);
		}
	}
	
	return objeto3D;
}





