Elipse = function(webGL, radioX, radioY, cantidadPuntos, programaShader)
{
	var objeto3D = new Objeto3D(webGL, 0, 0, null, programaShader);
	var puntos;
	var transformacionRadianes;
	var pasoAngulo;
	
	var puntosControlDerivada1;
	var puntosControlDerivada2;

	var tangentes = null;
	var normales = null;
	var binormales = null;
	
	function calcularPunto(angulo)
	{
		var punto = vec3.create();

		punto[0] = radioX * Math.cos(transformacionRadianes * angulo);
		punto[1] = radioY * Math.sin(transformacionRadianes * angulo);
		
		return punto;
	}
	
	function calcularDerivada1(angulo)
	{
		var derivada1 = vec3.create();

		derivada1[0] = -radioX * Math.sin(transformacionRadianes * angulo);
		derivada1[1] = radioY * Math.cos(transformacionRadianes * angulo);
		
		return derivada1;
	}
	
	function calcularDerivada2(angulo)
	{
		var derivada2 = vec3.create();

		derivada2[0] = -radioX * Math.cos(transformacionRadianes * angulo);
		derivada2[1] = -radioY * Math.sin(transformacionRadianes * angulo);
		
		return derivada2;
	}
	
	function calcularPuntosCurva()
	{		
		for(i = 0; i < cantidadPuntos; i++)
			puntos.push(calcularPunto(i * pasoAngulo));
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
		
		var binormal = calcularDerivada2(0);
		var tangente = calcularDerivada1(0);
		vec3.normalize(tangente, tangente);
		
		vec3.cross(binormal, tangente, binormal);
		vec3.normalize(binormal, binormal);		
		
		var normal = vec3.create();
		vec3.cross(normal, binormal, tangente);
		vec3.normalize(normal, normal);
		
		tangentes.push(tangente);
		normales.push(normal);
		binormales.push(binormal);		

		for(i = 1; i < cantidadPuntos; i++)
		{
			tangente = calcularDerivada1(i * pasoAngulo);
			vec3.normalize(tangente, tangente);
			tangentes.push(tangente);
			
			calcularMarco(puntos, tangentes, binormales, normales, i);
		}
		
		tangentes.push(tangente);
		normales.push(normales[normales.length - 1]);
		binormales.push(binormales[binormales.length - 1]);
	}
	
	function inicializar()
	{
		transformacionRadianes = 2 * Math.PI / 360; 
		pasoAngulo = 360 / (cantidadPuntos - 1);
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
			vertexBuffer[VERTEXBUFFERPOSICION].push(0);			
			
			vertexBuffer[VERTEXBUFFERCOLOR].push(1);
			vertexBuffer[VERTEXBUFFERCOLOR].push(1);
			vertexBuffer[VERTEXBUFFERCOLOR].push(1);
		}
		
		vertexBuffer[VERTEXBUFFERPOSICION].push(puntos[0][0]);
		vertexBuffer[VERTEXBUFFERPOSICION].push(puntos[0][1]);
		vertexBuffer[VERTEXBUFFERPOSICION].push(0);			
		
		vertexBuffer[VERTEXBUFFERCOLOR].push(1);
		vertexBuffer[VERTEXBUFFERCOLOR].push(1);
		vertexBuffer[VERTEXBUFFERCOLOR].push(1);
		
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





