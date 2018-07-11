BezierCompuesta = function(webGL, puntosControl, cantidadPuntos, programaShader, procesamientoNormal)
{
	var objeto3D = new Objeto3D(webGL, 0, 0, programaShader);	
	var beziers;
	var puntos;
	
	var tangentes = null;
	var normales = null;
	var binormales = null;
	
	var cantidadBeziers;	
	var puntosPorBezier;
	
	function crearBeziers()
	{
		var puntosControlBezier
		var puntosBezierActual;
		
		beziers = new Array();

		for(var i = 0; i < cantidadBeziers; i++)
		{
			puntosControlBezier = crearPuntos3D(puntosControl[3 * i], 
												puntosControl[3 * i + 1],
												puntosControl[3 * i + 2],
												puntosControl[3 * i + 3]);
												
			puntosBezierActual = (i != cantidadBeziers - 1) ? puntosPorBezier : (cantidadPuntos - puntosPorBezier * i);

			beziers.push(new BezierCubica(webGL, puntosControlBezier, puntosBezierActual, programaShader, procesamientoNormal));
		}
	}
	
	function calcularMarcosReferencia()
	{
		tangentes = new Array();			
		normales = new Array();			
		binormales = new Array();	
		
		var tangentePonderada = vec3.create();
		var binormalPonderada = vec3.create();
		var normalPonderada = vec3.create();
		
		for(var i = 0; i < beziers.length; i++)
		{
			tangentes = tangentes.concat(beziers[i].obtenerTangentes());
			normales = normales.concat(beziers[i].obtenerNormales());
			binormales = binormales.concat(beziers[i].obtenerBinormales());
		
			
			if(i > 0)
			{
				vec3.add(tangentePonderada, tangentes[i * puntosPorBezier], tangentes[i * puntosPorBezier - 1]);
				vec3.scale(tangentePonderada, tangentePonderada, 2);
				tangentes[i * puntosPorBezier] = tangentePonderada;
				tangentes[i * puntosPorBezier - 1] = tangentePonderada;
				
				vec3.add(normalPonderada, normales[i * puntosPorBezier], normales[i * puntosPorBezier - 1]);
				vec3.scale(normalPonderada, normalPonderada, 2);
				normales[i * puntosPorBezier] = normalPonderada;
				normales[i * puntosPorBezier - 1] = normalPonderada;
				
				vec3.add(binormalPonderada, binormales[i * puntosPorBezier], binormales[i * puntosPorBezier - 1]);
				vec3.scale(binormalPonderada, binormalPonderada, 2);		
				binormales[i * puntosPorBezier] = binormalPonderada;
				binormales[i * puntosPorBezier - 1] = binormalPonderada;
			}
		}
	}
	
	function inicializar()
	{
		if(puntosControl.length < 4)
			throw "No hay suficientes puntos de control para trazar la curva.";
					
		cantidadBeziers = 1 + Math.floor((puntosControl.length - 4) / 3);
		puntosPorBezier = Math.floor(cantidadPuntos / cantidadBeziers);
		
		crearBeziers();
		calcularMarcosReferencia();
	}
	inicializar();
	
	objeto3D.crearBufferVertices = function() 
	{	
		var vertexBuffer = new Array();
		
		vertexBuffer[VERTEXBUFFERPOSICION] = new Array();
		vertexBuffer[VERTEXBUFFERCOLOR] = new Array();	   
		
		for(var  i = 0; i < beziers.length; i++)
		{
			var puntos = beziers[i].obtenerPuntosCurva();
			
			for (var j = 0; j < puntos.length; j++)
			{
				vertexBuffer[VERTEXBUFFERPOSICION].push(puntos[j][0]);
				vertexBuffer[VERTEXBUFFERPOSICION].push(puntos[j][1]);
				vertexBuffer[VERTEXBUFFERPOSICION].push(puntos[j][2]);			
				
				vertexBuffer[VERTEXBUFFERCOLOR].push(1);
				vertexBuffer[VERTEXBUFFERCOLOR].push(1);
				vertexBuffer[VERTEXBUFFERCOLOR].push(1);
			}
		}

		return vertexBuffer;
	}
	
	objeto3D.crearBufferIndice = function() 
	{	
		var indexBuffer = new Array();
								
		for (var i = 0; i < cantidadPuntos; i++)
			indexBuffer.push(i);
		return indexBuffer;
	}
	
	objeto3D.obtenerPuntosCurva = function()
	{
		if(puntos)
			return puntos;
			
		puntos = new Array();
		
		for(var  i = 0; i < beziers.length; i++)
			puntos = puntos.concat(beziers[i].obtenerPuntosCurva());
			
		return puntos;
	}
	
	objeto3D.obtenerTangentes = function()
	{
		return tangentes;
	}
	
	objeto3D.obtenerNormales = function()
	{
		return normales;
	}		
	
	objeto3D.obtenerBinormales = function()
	{
		return binormales;
	}	
	
	objeto3D.aplicarTransformacionAdicional = function(matriz)
	{
		var transformacion = mat3.create();
		mat3.normalFromMat4(transformacion, matriz); 
		
		for(var i = 0; i < tangentes.length; i++)
		{
			vec3.transformMat3(tangentes[i], tangentes[i], transformacion);
			vec3.transformMat3(normales[i], normales[i], transformacion);
			vec3.transformMat3(binormales[i], binormales[i], transformacion);
		}
	}
	
	objeto3D.construir();
	objeto3D.cambiarModoDibujo(webGL.LINE_STRIP);
	return objeto3D;
}





