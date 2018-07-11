var SuperficieCurva = function(webGL, curvaForma, funcionColor, informacionTextura, programaShader, invertirNormales)
{
	var puntosRecorrido;
	var verticesSuperficie;
	var puntosForma;
	
	var maximoX;
	var minimoX;
	var maximoY;
	var minimoY;
	
	var objeto3D;	
	
	var tangentes;
	var normales;
	
	function calcularNormales()
	{
		normales = new Array();
		
		var normal = vec3.fromValues(0, 0, 1);
		if(invertirNormales)
			normal[2] *= -1;
		
		for (var i = 0; i <= puntosForma.length; i++)
			normales.push(normal);
	}
	
	function calcularTangentes()
	{
		tangentes = new Array();
		
		for (var i = 0; i <= puntosForma.length; i++)
			tangentes.push(vec3.fromValues(1, 0, 0));
	}
	
	function funcionColorDefault()
	{
		return new Array(Math.random(), Math.random(), Math.random());
	}
	
	function crearBufferIndice()
	{
		var indexBuffer = new Array();
		
		for (var i = 1; i < puntosForma.length + 1; i++)
		{
			indexBuffer.push(i);
			indexBuffer.push(0);
		}
		return indexBuffer;
	}
	
	function crearBufferVertices()
	{
		var vertexBuffer = new Array();
		
		vertexBuffer[VERTEXBUFFERPOSICION] = new Array();
		vertexBuffer[VERTEXBUFFERCOLOR] = new Array();

		vertexBuffer[VERTEXBUFFERPOSICION].push(0);
		vertexBuffer[VERTEXBUFFERPOSICION].push(0);
		vertexBuffer[VERTEXBUFFERPOSICION].push(0);			
		
		vertexBuffer[VERTEXBUFFERCOLOR].push(1);
		vertexBuffer[VERTEXBUFFERCOLOR].push(1);
		vertexBuffer[VERTEXBUFFERCOLOR].push(1);
								
		for (var i = 0; i < puntosForma.length; i++)
		{
			vertexBuffer[VERTEXBUFFERPOSICION].push(puntosForma[i][0]);
			vertexBuffer[VERTEXBUFFERPOSICION].push(puntosForma[i][1]);
			vertexBuffer[VERTEXBUFFERPOSICION].push(puntosForma[i][2]);	

			if(maximoX < puntosForma[i][0])
				maximoX = puntosForma[i][0];
			else if(minimoX > puntosForma[i][0])
				minimoX = puntosForma[i][0];			
				
			if(maximoY < puntosForma[i][1])
				maximoY = puntosForma[i][1];
			else if(minimoY > puntosForma[i][1])
				minimoY = puntosForma[i][1];
				
			vertexBuffer[VERTEXBUFFERCOLOR].push(1);
			vertexBuffer[VERTEXBUFFERCOLOR].push(1);
			vertexBuffer[VERTEXBUFFERCOLOR].push(1);
		}
		return vertexBuffer;
	}
	
	function inicializar()
	{		
		if(!funcionColor)
			funcionColor = funcionColorDefault;
			
		verticesSuperficie = new Array();
		
		puntosForma = curvaForma.obtenerVertices();
		
		calcularNormales();
		calcularTangentes();
		
		maximoX = puntosForma[0][0];
		minimoX = puntosForma[0][0];
		maximoY = puntosForma[0][1];
		minimoY = puntosForma[0][1];

		objeto3D = new Objeto3D(webGL, puntosForma.length, 1, null, programaShader);
		objeto3D.crearBufferVertices = crearBufferVertices;
		objeto3D.crearBufferIndice = crearBufferIndice;
		objeto3D.construir();
	}
	inicializar();	
	
	objeto3D.crearTextura = function crearTextura()
	{		
		var posicionTexturas = new Array();
		
		maximoX -= minimoX;
		maximoY -= minimoY;
		
		var factorEscalaY = (1 / maximoY) * informacionTextura.factorEscalaVertical;
		var factorEscalaX = (1 / maximoX) * informacionTextura.factorEscalaHorizontal;

		posicionTexturas.push(-minimoX * factorEscalaX);
		posicionTexturas.push(-minimoY * factorEscalaY);
		
		for (var i = 0; i < puntosForma.length; i++)
		{
			posicionTexturas.push((puntosForma[i][0] - minimoX) * factorEscalaX);
			posicionTexturas.push((puntosForma[i][1] - minimoY) * factorEscalaY);
		}
		
		return posicionTexturas;
	}	
	
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
		
	return objeto3D;	
}