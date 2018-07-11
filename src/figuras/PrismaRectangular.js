PrismaRectangular = function(webGL, ancho, alto, largo, informacionTextura, funcionColor, programaShader)
{
	var objeto3D;
	var medioAncho;
	var medioAlto;
	
	var tangentes;
	var normales;
	
	function calcularNormales()
	{
		normales = new Array();
		
		normales.push(vec3.fromValues(0, 0, -1));
		normales.push(vec3.fromValues(0, 0, -1));
		normales.push(vec3.fromValues(0, 0, -1));
		normales.push(vec3.fromValues(0, 0, -1));
		
		normales.push(vec3.fromValues(0, 1, 0));
		normales.push(vec3.fromValues(0, 1, 0));
		normales.push(vec3.fromValues(0, 1, 0));
		normales.push(vec3.fromValues(0, 1, 0));
		
		normales.push(vec3.fromValues(-1, 0, 0));
		normales.push(vec3.fromValues(-1, 0, 0));
		normales.push(vec3.fromValues(-1, 0, 0));
		normales.push(vec3.fromValues(-1, 0, 0));
		
		normales.push(vec3.fromValues(0, -1, 0));
		normales.push(vec3.fromValues(0, -1, 0));
		normales.push(vec3.fromValues(0, -1, 0));
		normales.push(vec3.fromValues(0, -1, 0));
		
		normales.push(vec3.fromValues(1, 0, 0));
		normales.push(vec3.fromValues(1, 0, 0));
		normales.push(vec3.fromValues(1, 0, 0));
		normales.push(vec3.fromValues(1, 0, 0));
		
		normales.push(vec3.fromValues(0, 0, 1));
		normales.push(vec3.fromValues(0, 0, 1));
		normales.push(vec3.fromValues(0, 0, 1));
		normales.push(vec3.fromValues(0, 0, 1));
	}
	
	function calcularTangentes()
	{
		tangentes = new Array();
		
		tangentes.push(vec3.fromValues(1, 0, 0));
		tangentes.push(vec3.fromValues(1, 0, 0));
		tangentes.push(vec3.fromValues(1, 0, 0));
		tangentes.push(vec3.fromValues(1, 0, 0));
		
		tangentes.push(vec3.fromValues(1, 0, 0));
		tangentes.push(vec3.fromValues(1, 0, 0));
		tangentes.push(vec3.fromValues(1, 0, 0));
		tangentes.push(vec3.fromValues(1, 0, 0));
		
		tangentes.push(vec3.fromValues(0, 0, -1));
		tangentes.push(vec3.fromValues(0, 0, -1));
		tangentes.push(vec3.fromValues(0, 0, -1));
		tangentes.push(vec3.fromValues(0, 0, -1));
		
		tangentes.push(vec3.fromValues(-1, 0, 0));
		tangentes.push(vec3.fromValues(-1, 0, 0));
		tangentes.push(vec3.fromValues(-1, 0, 0));
		tangentes.push(vec3.fromValues(-1, 0, 0));
		
		tangentes.push(vec3.fromValues(0, 0, 1));
		tangentes.push(vec3.fromValues(0, 0, 1));
		tangentes.push(vec3.fromValues(0, 0, 1));
		tangentes.push(vec3.fromValues(0, 0, 1));
		
		tangentes.push(vec3.fromValues(-1, 0, 0));
		tangentes.push(vec3.fromValues(-1, 0, 0));
		tangentes.push(vec3.fromValues(-1, 0, 0));
		tangentes.push(vec3.fromValues(-1, 0, 0));
	}
	
	function inicializar()
	{
		objeto3D = new Objeto3D(webGL, 5, 4, null, programaShader);
		
		if(!funcionColor)
		{
			console.log()
			funcionColor = objeto3D.funcionColorDefault;
		}

		medioAncho = ancho / 2;
		medioAlto = alto / 2;
		
		calcularNormales();
		calcularTangentes();
	}
	inicializar();
	
	function colorearVertices(vertexBuffer, cantidad)
	{
		var color;
		
		for(var i = 0; i < cantidad; i++)
		{
			color = funcionColor();
			
			vertexBuffer[VERTEXBUFFERCOLOR].push(color[0]);
			vertexBuffer[VERTEXBUFFERCOLOR].push(color[1]);
			vertexBuffer[VERTEXBUFFERCOLOR].push(color[2]);	
		}
	}
	
	objeto3D.crearBufferVertices = function() 
	{
		var vertexBuffer = new Array();
		
		vertexBuffer[VERTEXBUFFERPOSICION] = new Array();
		vertexBuffer[VERTEXBUFFERCOLOR] = new Array();	   
					
		vertexBuffer[VERTEXBUFFERPOSICION].push(-medioAncho, -medioAlto, 0);
		vertexBuffer[VERTEXBUFFERPOSICION].push(-medioAncho, medioAlto, 0);
		vertexBuffer[VERTEXBUFFERPOSICION].push(medioAncho, medioAlto, 0);
		vertexBuffer[VERTEXBUFFERPOSICION].push(medioAncho, -medioAlto, 0);		
		
		vertexBuffer[VERTEXBUFFERPOSICION].push(-medioAncho, medioAlto, 0);
		vertexBuffer[VERTEXBUFFERPOSICION].push(medioAncho, medioAlto, 0);
		vertexBuffer[VERTEXBUFFERPOSICION].push(medioAncho, medioAlto, largo);
		vertexBuffer[VERTEXBUFFERPOSICION].push(-medioAncho, medioAlto, largo);		
		
		vertexBuffer[VERTEXBUFFERPOSICION].push(-medioAncho, medioAlto, largo);
		vertexBuffer[VERTEXBUFFERPOSICION].push(-medioAncho, -medioAlto, largo);
		vertexBuffer[VERTEXBUFFERPOSICION].push(-medioAncho, medioAlto, 0);
		vertexBuffer[VERTEXBUFFERPOSICION].push(-medioAncho, -medioAlto, 0);		
		
		vertexBuffer[VERTEXBUFFERPOSICION].push(-medioAncho, -medioAlto, 0);
		vertexBuffer[VERTEXBUFFERPOSICION].push(medioAncho, -medioAlto, 0);		
		vertexBuffer[VERTEXBUFFERPOSICION].push(-medioAncho, -medioAlto, largo);
		vertexBuffer[VERTEXBUFFERPOSICION].push(medioAncho, -medioAlto, largo);		
		
		vertexBuffer[VERTEXBUFFERPOSICION].push(medioAncho, -medioAlto, largo);
		vertexBuffer[VERTEXBUFFERPOSICION].push(medioAncho, medioAlto, largo);		
		vertexBuffer[VERTEXBUFFERPOSICION].push(medioAncho, medioAlto, 0);
		vertexBuffer[VERTEXBUFFERPOSICION].push(medioAncho, -medioAlto, 0);		
		
		vertexBuffer[VERTEXBUFFERPOSICION].push(medioAncho, medioAlto, largo);
		vertexBuffer[VERTEXBUFFERPOSICION].push(medioAncho, -medioAlto, largo);		
		vertexBuffer[VERTEXBUFFERPOSICION].push(-medioAncho, -medioAlto, largo);
		vertexBuffer[VERTEXBUFFERPOSICION].push(-medioAncho, medioAlto, largo);
		
		colorearVertices(vertexBuffer, vertexBuffer[VERTEXBUFFERPOSICION].length / 3);

		return vertexBuffer;
	}
	
	objeto3D.crearBufferIndice = function() 
	{
		var indexBuffer = new Array();
		
		indexBuffer.push(0);
		indexBuffer.push(1);
		indexBuffer.push(3);
		indexBuffer.push(2);		
		
		indexBuffer.push(5);
		indexBuffer.push(6);
		indexBuffer.push(4);
		indexBuffer.push(7);		
		
		indexBuffer.push(8);
		indexBuffer.push(10);
		indexBuffer.push(9);
		indexBuffer.push(11);			
		
		indexBuffer.push(12);
		indexBuffer.push(14);
		indexBuffer.push(13);
		indexBuffer.push(15);				
		
		indexBuffer.push(19);
		indexBuffer.push(18);
		indexBuffer.push(16);
		indexBuffer.push(17);			
		
		indexBuffer.push(20);
		indexBuffer.push(21);
		indexBuffer.push(23);
		indexBuffer.push(22);		
		
		
		return indexBuffer;
	}
	
	objeto3D.construir();	
	
	objeto3D.obtenerNormales = function()
	{
		return normales;
	}
	
	objeto3D.obtenerTangentes = function()
	{
		return tangentes;
	}


	objeto3D.crearTextura = function crearTextura()
	{		
		var posicionTexturas = new Array();
		
		posicionTexturas.push(informacionTextura.ancho);
		posicionTexturas.push(0);
		
		posicionTexturas.push(informacionTextura.ancho);
		posicionTexturas.push(informacionTextura.alto);
		
		posicionTexturas.push(0);
		posicionTexturas.push(informacionTextura.alto);
		
		posicionTexturas.push(0);
		posicionTexturas.push(0);
				
					
		posicionTexturas.push(informacionTextura.ancho * informacionTextura.factorEscalaHorizontal);
		posicionTexturas.push(0);
		
		posicionTexturas.push(informacionTextura.ancho * informacionTextura.factorEscalaHorizontal);
		posicionTexturas.push(informacionTextura.alto * informacionTextura.factorEscalaVertical);
		
		posicionTexturas.push(0);
		posicionTexturas.push(informacionTextura.alto * informacionTextura.factorEscalaVertical);
		
		posicionTexturas.push(0);
		posicionTexturas.push(0);
		
		
		
		posicionTexturas.push(informacionTextura.ancho * informacionTextura.factorEscalaHorizontal);
		posicionTexturas.push(informacionTextura.alto * informacionTextura.factorEscalaVertical);
		
		posicionTexturas.push(informacionTextura.ancho * informacionTextura.factorEscalaHorizontal);
		posicionTexturas.push(0);
		
		posicionTexturas.push(0);
		posicionTexturas.push(informacionTextura.alto * informacionTextura.factorEscalaVertical);
		
		posicionTexturas.push(0);
		posicionTexturas.push(0);
		
		
		
		posicionTexturas.push(0);
		posicionTexturas.push(0);
		
		posicionTexturas.push(0);
		posicionTexturas.push(informacionTextura.alto * informacionTextura.factorEscalaVertical);		
		
		posicionTexturas.push(informacionTextura.ancho * informacionTextura.factorEscalaHorizontal);
		posicionTexturas.push(0);
		
		posicionTexturas.push(informacionTextura.ancho * informacionTextura.factorEscalaHorizontal);
		posicionTexturas.push(informacionTextura.alto * informacionTextura.factorEscalaVertical);
		

		
		
		
		posicionTexturas.push(0);
		posicionTexturas.push(0);
		
		posicionTexturas.push(0);
		posicionTexturas.push(informacionTextura.alto * informacionTextura.factorEscalaVertical);		
		
		posicionTexturas.push(informacionTextura.ancho * informacionTextura.factorEscalaHorizontal);
		posicionTexturas.push(informacionTextura.alto * informacionTextura.factorEscalaVertical);
		
		posicionTexturas.push(informacionTextura.ancho * informacionTextura.factorEscalaHorizontal);
		posicionTexturas.push(0);

		
		
		
		posicionTexturas.push(informacionTextura.ancho * informacionTextura.factorEscalaHorizontal);
		posicionTexturas.push(0);
		
		posicionTexturas.push(informacionTextura.ancho * informacionTextura.factorEscalaHorizontal);
		posicionTexturas.push(informacionTextura.alto * informacionTextura.factorEscalaVertical);
		
		posicionTexturas.push(0);
		posicionTexturas.push(informacionTextura.alto * informacionTextura.factorEscalaVertical);
		
		posicionTexturas.push(0);
		posicionTexturas.push(0);
		
		ajustarCoordenadasTextura(posicionTexturas, informacionTextura.ancho, informacionTextura.alto);
	
		return posicionTexturas;
	}	
	
	if(informacionTextura)
		objeto3D.texturizar(informacionTextura.textura, informacionTextura.factorEscalaHorizontal, informacionTextura.factorEscalaVertical, informacionTextura.repetir);
		
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





