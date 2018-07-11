BSplineCubica = function(webGL, puntosControl, cantidadPuntos, programaShader, direccionNormal)
{
	var objeto3D = new Objeto3D(webGL, 0, 0, null, programaShader);
	var puntos;
	var pasoT;
	var puntosControl3D;
	
	var puntosControlDerivada1;
	var puntosControlDerivada2;
	
	var tangentes = null;
	var normales = null;
	var binormales = null;
	
	function calcularPeso(t)
	{
		if(t >= 0 && t <= 1)
			return 1/6*t*t*t;
		else if(t > 1 && t <= 2)
			return 1/6*(-3 * Math.pow(t - 1, 3) + 3 * Math.pow(t - 1, 2) + 3 * (t - 1) + 1);
		else if(t > 2 && t <= 3)
			return 1/6*(3 * Math.pow(t - 2, 3) - 6 * Math.pow(t - 2, 2) + 4);
		else if(t > 3 && t <= 4)
			return 1/6*(-Math.pow(t - 3, 3) + 3 * Math.pow(t - 3, 2) - 3 * (t - 3) + 1);
		else
			return 0;
	}
	
	function calcularPesoDerivada1(t)
	{
		if(t >= 0 && t <= 1)
			return 1/2*t*t;
		else if(t > 1 && t <= 2)
			return 1/6*(-9 * Math.pow(t - 1, 2) + 6 * (t - 1) + 3);
		else if(t > 2 && t <= 3)
			return 1/6*(9 * Math.pow(t - 2, 2) - 12 * (t - 2));
		else if(t > 3 && t <= 4)
			return 1/6*(-3 * Math.pow(t - 3, 2) + 6 * (t - 3) - 3);
		else
			return 0;
	}
	
	function calcularPesoDerivada2(t)
	{
		if(t >= 0 && t <= 1)
			return t;
		else if(t > 1 && t <= 2)
			return 1/6*(-18 * (t - 1) + 6);
		else if(t > 2 && t <= 3)
			return 1/6*(18 * (t - 2) - 12);
		else if(t > 3 && t <= 4)
			return 1/6*(-6 * (t - 3) + 6);
		else
			return 0;
	}
	
	function calcularPunto(t)
	{
		var resultadoTotal = vec3.create();
		var resultadoMultiplicacion = vec3.create();
		
		for(var i = 0; i < puntosControl.length; i++)
		{
			vec3.scale(resultadoMultiplicacion, puntosControl3D[i], calcularPeso(t - i));

			vec3.add(resultadoTotal, resultadoTotal, resultadoMultiplicacion);
		}

		return resultadoTotal;
	}
	
	function calcularDerivada1(t)
	{
		var resultadoTotal = vec3.create();
		var resultadoMultiplicacion = vec3.create();
		
		for(var i = 0; i < puntosControl3D.length; i++)
		{
			vec3.scale(resultadoMultiplicacion, puntosControl3D[i], calcularPesoDerivada1(t - i));
			vec3.add(resultadoTotal, resultadoTotal, resultadoMultiplicacion);
		}

		return resultadoTotal;
	}
	
	function calcularDerivada2(t)
	{
		var resultadoTotal = vec3.create();
		var resultadoMultiplicacion = vec3.create();
		
		for(var i = 0; i < puntosControl3D.length; i++)
		{
			vec3.scale(resultadoMultiplicacion, puntosControl3D[i], calcularPesoDerivada2(t - i));
			vec3.add(resultadoTotal, resultadoTotal, resultadoMultiplicacion);
		}
		return resultadoTotal;
	}
	
	function calcularPuntosCurva()
	{		
		for(i = 0; i < cantidadPuntos; i++)
			puntos.push(calcularPunto(i * pasoT + 3));
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
		
		var binormal = calcularDerivada2(3);
		var tangente = calcularDerivada1(3);
		vec3.normalize(tangente, tangente);
		
		vec3.cross(binormal, tangente, binormal);
		vec3.normalize(binormal, binormal);		
		
		var normal = vec3.create();
		vec3.cross(normal, binormal, tangente);
		vec3.normalize(normal, normal);
		
		if(direccionNormal && vec3.dot(normal, direccionNormal) <= 0)
		{
			vec3.scale(normal, normal, -1);
			vec3.scale(binormal, binormal, -1);
		}
		
		tangentes.push(tangente);
		normales.push(normal);
		binormales.push(binormal);
		

		for(i = 1; i < cantidadPuntos; i++)
		{
			tangente = calcularDerivada1(i * pasoT + 3);
			vec3.normalize(tangente, tangente);
			tangentes.push(tangente);
			
			calcularMarco(puntos, tangentes, binormales, normales, i);
		}
	}
		
	function inicializar()
	{
		if(puntosControl[0].length == 2)
		{
			puntosControl3D = new Array();
			
			for(var i = 0; i < puntosControl.length; i++)
				puntosControl3D.push(vec3.fromValues(puntosControl[i][0], puntosControl[i][1], 0));
		}
		else
			puntosControl3D = puntosControl;
			
		pasoT = (puntosControl.length - 3)  / cantidadPuntos;

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
		
		for(var i = 0; i < puntos.length; i++)
		{
			vec3.transformMat4(puntos[i], puntos[i], matriz);
			vec3.transformMat3(tangentes[i], tangentes[i], transformacion);
			vec3.transformMat3(normales[i], normales[i], transformacion);
			vec3.transformMat3(binormales[i], binormales[i], transformacion);
		}
	}
	
	objeto3D.construir();
	objeto3D.cambiarModoDibujo(webGL.LINE_STRIP);	
	
	return objeto3D;
}





