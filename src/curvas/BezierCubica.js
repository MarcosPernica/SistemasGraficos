BezierCubica = function(webGL, puntosControl, cantidadPuntos, programaShader, procesamientoNormal)
{
	var objeto3D = new Objeto3D(webGL, 0, 0, programaShader);
	var puntos;
	
	var puntosControlDerivada1;
	var puntosControlDerivada2;
	
	var tangentes = null;
	var normales = null;
	var binormales = null;
	
	function calcularPunto(t)
	{
		var polinomio = (1 - t);
		var coeficientes = new Array(1, 3, 3, 1);
		var resultadoTotal = vec3.create();
		var resultadoMultiplicacion = vec3.create();
		
		for(var i = 0; i < 4; i++)
		{
			vec3.scale(resultadoMultiplicacion, puntosControl[i], (Math.pow(polinomio, 3 - i) * Math.pow(t, i)) * coeficientes[i]);
			vec3.add(resultadoTotal, resultadoTotal, resultadoMultiplicacion);
		}
		return resultadoTotal;
	}
	
	function calcularDerivada1(t)
	{
		var polinomio = (1 - t);
		var resultadoTotal = vec3.create();
		var resultadoMultiplicacion = vec3.create();
		
		for(var i = 0; i < 3; i++)
		{
			vec3.scale(resultadoMultiplicacion, puntosControlDerivada1[i], (Math.pow(polinomio, 2 - i) * Math.pow(t, i)));
			vec3.add(resultadoTotal, resultadoTotal, resultadoMultiplicacion);
		}

		return resultadoTotal;
	}
	
	function calcularDerivada2(t)
	{
		var polinomio = (1 - t);
		var resultadoTotal = vec3.create();
		var resultadoMultiplicacion = vec3.create();
		
		for(var i = 0; i < 2; i++)
		{
			vec3.scale(resultadoMultiplicacion, puntosControlDerivada2[i], (Math.pow(polinomio, 1 - i) * Math.pow(t, i)));
			vec3.add(resultadoTotal, resultadoTotal, resultadoMultiplicacion);
		}
		
		return resultadoTotal;
	}
	
	function calcularPuntosCurva()
	{		
		for(i = 0; i < cantidadPuntos; i++)
			puntos.push(calcularPunto(i / (cantidadPuntos - 1)));
	}
	
	function calcularCoeficientes()
	{
		puntosControlDerivada1 = new Array();
		
		var P0Derivada1 = vec3.create();
		vec3.sub(P0Derivada1, puntosControl[1], puntosControl[0]);
		vec3.scale(P0Derivada1, P0Derivada1, 3);		
		puntosControlDerivada1.push(P0Derivada1);
		
		var P1Derivada1 = vec3.create();
		vec3.sub(P1Derivada1, puntosControl[2], puntosControl[1]);
		vec3.scale(P1Derivada1, P1Derivada1, 6);	
		puntosControlDerivada1.push(P1Derivada1);
		
		var P2Derivada1 = vec3.create();
		vec3.sub(P2Derivada1, puntosControl[3], puntosControl[2]);
		vec3.scale(P2Derivada1, P2Derivada1, 3);
		puntosControlDerivada1.push(P2Derivada1);
		
		
		puntosControlDerivada2 = new Array();
		
		var P0Derivada2 = vec3.create();
		vec3.scale(P0Derivada2, P0Derivada1, -2);
		vec3.add(P0Derivada2, P0Derivada2, P1Derivada1);		
		puntosControlDerivada2.push(P0Derivada2);
		
		var P1Derivada2 = vec3.create();
		vec3.scale(P1Derivada2, P2Derivada1, 2);
		vec3.sub(P1Derivada2, P1Derivada2, P1Derivada1);
		puntosControlDerivada2.push(P1Derivada2);
		
	}
	
	function calcularMarco(vertices, tangentes, binormales, normales, nivel)
	{			
		var aux;
		var reflexion1 = vec3.create();
		vec3.sub(reflexion1, vertices[nivel], vertices[nivel - 1]);
		var c1 = vec3.dot(reflexion1, reflexion1);
		
		var rL = vec3.create();
		aux = vec3.dot(normales[nivel - 1], reflexion1);
		vec3.scale(rL, reflexion1, -1 * ( 2/c1) * aux);
		vec3.add(rL, rL, normales[nivel - 1]);
		
		var tL = vec3.create();
		aux = vec3.dot(tangentes[nivel - 1], reflexion1);
		vec3.scale(tL, reflexion1, -1 * ( 2/c1) * aux);
		vec3.add(tL, tL, tangentes[nivel - 1]);
		
		var reflexion2 = vec3.create();
		vec3.sub(reflexion2, tangentes[nivel], tL);
		var c2 = vec3.dot(reflexion2, reflexion2);
		
		var normalNivel = vec3.create();
		aux = vec3.dot(rL, reflexion2);
		vec3.scale(normalNivel, reflexion2, -1 * ( 2/c2) * aux);
		vec3.add(normalNivel, normalNivel, rL);
		procesamientoNormal(vertices[nivel], normalNivel);
		normales[nivel] = normalNivel; 
		
		var binormalNivel = vec3.create();
		vec3.cross(binormalNivel, tangentes[nivel], normalNivel);
		binormales[nivel] = binormalNivel; 
	}	
	
	function calcularMarcosReferencia()
	{
		tangentes = new Array();			
		normales = new Array();			
		binormales = new Array();			
		
		var binormal = calcularDerivada2(0);
		var tangente = calcularDerivada1(0);
		vec3.normalize(tangente, tangente);
		
		vec3.cross(binormal, tangente, binormal);
		vec3.normalize(binormal, binormal);		
		
		var normal = vec3.create();
		vec3.cross(normal, binormal, tangente);
		vec3.normalize(normal, normal);
		procesamientoNormal(puntos[0], normal);
		
		tangentes.push(tangente);
		normales.push(normal);
		binormales.push(binormal);
		

		for(i = 1; i < cantidadPuntos; i++)
		{
			tangente = calcularDerivada1(i / (cantidadPuntos - 1));
			vec3.normalize(tangente, tangente);
			tangentes.push(tangente);
			
			calcularMarco(puntos, tangentes, binormales, normales, i);
		}
	}
	
	function inicializar()
	{
		calcularCoeficientes();		
		
		puntos = new Array();
		calcularPuntosCurva();
		calcularMarcosReferencia();
	}
	inicializar();
	
	objeto3D.crearBufferVertices = function() 
	{	
		var vertexBuffer = new Array();
		
		vertexBuffer[VERTEXBUFFERPOSICION] = new Array();
		vertexBuffer[VERTEXBUFFERCOLOR] = new Array();	   
								
		for (var i = 0; i < cantidadPuntos; i++)
		{
			vertexBuffer[VERTEXBUFFERPOSICION].push(puntos[i][0]);
			vertexBuffer[VERTEXBUFFERPOSICION].push(puntos[i][1]);
			vertexBuffer[VERTEXBUFFERPOSICION].push(puntos[i][2]);			
			
			vertexBuffer[VERTEXBUFFERCOLOR].push(1);
			vertexBuffer[VERTEXBUFFERCOLOR].push(1);
			vertexBuffer[VERTEXBUFFERCOLOR].push(1);
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





