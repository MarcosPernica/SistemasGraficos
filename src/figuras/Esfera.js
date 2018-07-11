Esfera = function(webGL, cantidadFilas, cantidadColumnas, radio, informacionTextura, programaShader, funcionColor)
{
	var objeto3D = new Objeto3D(webGL, cantidadFilas, cantidadColumnas, funcionColor, programaShader);
	
	objeto3D.crearBufferVertices = function() 
	{
		var vertexBuffer = new Array();
		var teta;
		var phi;
		var Z;
		
		var pasoTeta = 360 / (cantidadColumnas - 1);
		var pasoPhi = 180 / (cantidadFilas - 1);
		
		var constanteRadianes = 2 * Math.PI / 360;
		
		vertexBuffer[VERTEXBUFFERPOSICION] = new Array();
		vertexBuffer[VERTEXBUFFERCOLOR] = new Array();	

		function calcularColor()
		{
			if(funcionColor)
				return funcionColor();
				
			return vec3.fromValues(Math.random(), Math.random(), Math.random());
		}
								
		for (var j = 0; j < cantidadColumnas; j++)
		{
			teta = j * pasoTeta;
			
			for(var i = 0; i < cantidadFilas; i++)
			{
				phi = i * pasoPhi;

				vertexBuffer[VERTEXBUFFERPOSICION].push(radio * Math.sin(constanteRadianes * phi) * Math.cos(constanteRadianes * teta));
				vertexBuffer[VERTEXBUFFERPOSICION].push(radio * Math.cos(constanteRadianes * phi));
				vertexBuffer[VERTEXBUFFERPOSICION].push(radio * Math.sin(constanteRadianes * phi) * Math.sin(constanteRadianes * teta));
				
				var color = calcularColor();
				
				vertexBuffer[VERTEXBUFFERCOLOR].push(color[0]);
				vertexBuffer[VERTEXBUFFERCOLOR].push(color[1]);
				vertexBuffer[VERTEXBUFFERCOLOR].push(color[2]);	
			}
		}
		return vertexBuffer;
	}
	
	objeto3D.crearTextura = function crearTextura()
	{		
		var posicionTexturas = new Array();
		var pasoAlto = informacionTextura.alto / (cantidadFilas - 1);
		var pasoAncho = informacionTextura.alto / (cantidadColumnas - 1);
		
		var factorEscalaVertical = informacionTextura.factorEscalaVertical || 1;
		
		for (var j = 0; j < cantidadColumnas; j++)
		{
			for(var i = 0; i < cantidadFilas; i++)
			{
				posicionTexturas.push(pasoAncho * j * informacionTextura.factorEscalaHorizontal);
				posicionTexturas.push(pasoAlto * i * factorEscalaVertical);
			}
		}
		
		ajustarCoordenadasTextura(posicionTexturas, informacionTextura.ancho, informacionTextura.alto);
		return posicionTexturas;
	}	
	
	objeto3D.construir();	
	
	if(informacionTextura)
		objeto3D.texturizar(informacionTextura.textura, informacionTextura.factorEscalaHorizontal, informacionTextura.factorEscalaVertical, informacionTextura.repetir);
	
	return objeto3D;
}





