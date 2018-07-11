Cilindro = function(webGL, pasoDiscretizacion, radio, alto, informacionTextura, programaShader)
{
	var objeto3D;
	var pasoAngulo;
	var constanteRadianes;
	
	var tangentes;
	var normales;
	
	function calcularNormales()
	{
		normales = new Array();
		
		var normal = vec3.fromValues(0, 0, 1);
		
		normales.push(normal);
		
		for(var i = 0; i < pasoDiscretizacion; i++)
			normales.push(normal);
			
		for(var i = 0; i < pasoDiscretizacion; i++)
		{
			var angulo = i * pasoAngulo;
			
			normales.push(vec3.fromValues(	1 * radio * Math.cos(constanteRadianes * angulo),
											1 * radio * Math.sin(constanteRadianes * angulo),
											0));
		}		
		
		for(var i = 0; i < pasoDiscretizacion; i++)
		{
			var angulo = i * pasoAngulo;
			
			normales.push(vec3.fromValues(	1 * radio * Math.cos(constanteRadianes * angulo),
											1 * radio * Math.sin(constanteRadianes * angulo),
											0));
		}
		
		for(var i = 0; i < pasoDiscretizacion; i++)
			normales.push(normal);
		
		normales.push(normal);
	}	
	
	function calcularTangentes()
	{
		tangentes = new Array();
		
		var tangente = vec3.fromValues(1, 0, 0);
		
		tangentes.push(tangente);
		
		for(var i = 0; i < pasoDiscretizacion; i++)
			tangentes.push(tangente);
			
		for(var i = 0; i < pasoDiscretizacion; i++)
		{
			var angulo = i * pasoAngulo;
			
			tangentes.push(vec3.fromValues(	-1 * radio * Math.sin(constanteRadianes * angulo),
											radio * Math.cos(constanteRadianes * angulo),
											0));

		}		
		
		for(var i = 0; i < pasoDiscretizacion; i++)
		{
			var angulo = i * pasoAngulo;
			
			tangentes.push(vec3.fromValues(	-1 * radio * Math.sin(constanteRadianes * angulo),
											radio * Math.cos(constanteRadianes * angulo),
											0));
		}
		
		for(var i = 0; i < pasoDiscretizacion; i++)
			tangentes.push(tangente);
		
		tangentes.push(tangente);
	}
	
	function inicializar()
	{
		objeto3D = new Objeto3D(webGL, 1, 1, null, programaShader);
		pasoAngulo = 360 / (pasoDiscretizacion - 1);
		constanteRadianes = 2 * Math.PI / 360;
		
		calcularNormales();
		calcularTangentes();
	}
	inicializar();
	
	function crearTapa(vertexBuffer, altura)
	{
		for(var i = 0; i < pasoDiscretizacion; i++)
		{
			var angulo = i * pasoAngulo;

			vertexBuffer[VERTEXBUFFERPOSICION].push(radio * Math.cos(constanteRadianes * angulo));
			vertexBuffer[VERTEXBUFFERPOSICION].push(radio * Math.sin(constanteRadianes * angulo));
			vertexBuffer[VERTEXBUFFERPOSICION].push(altura);

			
			vertexBuffer[VERTEXBUFFERCOLOR].push(Math.random());
			vertexBuffer[VERTEXBUFFERCOLOR].push(Math.random());
			vertexBuffer[VERTEXBUFFERCOLOR].push(Math.random());	
		}
	}
	
	objeto3D.crearBufferVertices = function() 
	{
		var vertexBuffer = new Array();
		
		vertexBuffer[VERTEXBUFFERPOSICION] = new Array();
		vertexBuffer[VERTEXBUFFERCOLOR] = new Array();
				
		vertexBuffer[VERTEXBUFFERPOSICION].push(0);
		vertexBuffer[VERTEXBUFFERPOSICION].push(0);
		vertexBuffer[VERTEXBUFFERPOSICION].push(-alto / 2);

		
		vertexBuffer[VERTEXBUFFERCOLOR].push(Math.random());
		vertexBuffer[VERTEXBUFFERCOLOR].push(Math.random());
		vertexBuffer[VERTEXBUFFERCOLOR].push(Math.random());	
			
		crearTapa(vertexBuffer, -alto / 2);
		crearTapa(vertexBuffer, -alto / 2);
		
		crearTapa(vertexBuffer, alto / 2);
		crearTapa(vertexBuffer, alto / 2);
		
		vertexBuffer[VERTEXBUFFERPOSICION].push(0);
		vertexBuffer[VERTEXBUFFERPOSICION].push(0);
		vertexBuffer[VERTEXBUFFERPOSICION].push(alto / 2);

		
		vertexBuffer[VERTEXBUFFERCOLOR].push(Math.random());
		vertexBuffer[VERTEXBUFFERCOLOR].push(Math.random());
		vertexBuffer[VERTEXBUFFERCOLOR].push(Math.random());
		
		return vertexBuffer;
	}
	
	objeto3D.crearBufferIndice = function() 
	{
		var indiceUltimoVertice = 4 * pasoDiscretizacion + 1;
		var indexBuffer = new Array();
		var i;
		
		for(i = 1; i <= pasoDiscretizacion; i++)
		{	
			indexBuffer.push(i);
			indexBuffer.push(0);
		}
		
		indexBuffer.push(1);
		indexBuffer.push(i);
		
		for(i = pasoDiscretizacion + 1; i < 2 * pasoDiscretizacion + 1; i++)
		{
			indexBuffer.push(i);
			indexBuffer.push(i + pasoDiscretizacion);
		}
		
		indexBuffer.push(pasoDiscretizacion + 1);
		indexBuffer.push(2 * pasoDiscretizacion + 1);
		indexBuffer.push(2 * pasoDiscretizacion + 1);

		for(i = 3 * pasoDiscretizacion + 1; i < 4 * pasoDiscretizacion +1; i++)
		{	
			indexBuffer.push(i);
			indexBuffer.push(indiceUltimoVertice);
		}
		
		indexBuffer.push(3 * pasoDiscretizacion + 1);
		
		return indexBuffer;
	}
	
	objeto3D.crearTextura = function crearTextura()
	{		
		var posicionTexturas = new Array();
		var angulo;
		
		posicionTexturas.push(informacionTextura.centroTapa[0]);
		posicionTexturas.push(informacionTextura.centroTapa[1]);
			
		for(var i = 0; i < pasoDiscretizacion; i++)
		{
			angulo = i * pasoAngulo;

			posicionTexturas.push(informacionTextura.radioTapa * Math.cos(constanteRadianes * angulo) + informacionTextura.centroTapa[0]);
			posicionTexturas.push(informacionTextura.radioTapa * Math.sin(constanteRadianes * angulo) + informacionTextura.centroTapa[1]);
		}
		
		var lado1 = informacionTextura.bordeSuperiorRectangulo[0];
		var lado2 = informacionTextura.bordeSuperiorRectangulo[1];
		
		var pasoVertices = (informacionTextura.bordeInferiorRectangulo[0][1] - lado1[1]) / (pasoDiscretizacion - 1) + informacionTextura.factorEscalaHorizontal * informacionTextura.alto;
		
		for(var i = 0; i < pasoDiscretizacion; i++)
		{
			posicionTexturas.push(lado1[0]);
			posicionTexturas.push(lado1[1] + i * pasoVertices);			
		}		
		
		for(var i = 0; i < pasoDiscretizacion; i++)
		{
			posicionTexturas.push(lado2[0]);
			posicionTexturas.push(lado1[1] + i * pasoVertices);		
		}
		
		for(var i = 0; i < pasoDiscretizacion; i++)
		{
			angulo = i * pasoAngulo;

			posicionTexturas.push(informacionTextura.radioTapa * Math.cos(constanteRadianes * angulo) + informacionTextura.centroTapa[0]);
			posicionTexturas.push(informacionTextura.radioTapa * Math.sin(constanteRadianes * angulo) + informacionTextura.centroTapa[1]);
		}
		
		
		posicionTexturas.push(informacionTextura.centroTapa[0]);
		posicionTexturas.push(informacionTextura.centroTapa[1]);		
		
		ajustarCoordenadasTextura(posicionTexturas, informacionTextura.ancho, informacionTextura.alto);
		return posicionTexturas;
	}	
	
	objeto3D.construir();

	if(informacionTextura)
		objeto3D.texturizar(informacionTextura.textura, informacionTextura.factorEscalaHorizontal, informacionTextura.factorEscalaVertical, informacionTextura.repetir);
		
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





