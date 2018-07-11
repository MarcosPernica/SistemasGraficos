InterpolacionLineal = function(webGL, puntosPaso, funcionColor, programaShader)
{
	var objeto3D = new Objeto3D(webGL, 0, 0, null, programaShader);
	var puntosPaso3D;
	
	var tangentes = null;
	var normales = null;
	var binormales = null;
	
	function acondicionarPuntosPaso()
	{
		if(puntosPaso[0].length == 2)
		{
			puntosPaso3D = new Array();
			
			for(var i = 0; i < puntosPaso.length; i++)
				puntosPaso3D.push(vec3.fromValues(puntosPaso[i][0], puntosPaso[i][1], 0));
		}
		else
			puntosPaso3D = puntosPaso;
	}
	acondicionarPuntosPaso();
	
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
		
		var binormal = vec3.create();
		var tangente = vec3.create();
	
		vec3.sub(tangente, puntosPaso3D[1], puntosPaso3D[0]);
		vec3.normalize(tangente, tangente);
		
		vec3.cross(binormal, vec3.fromValues(0, 0, 1), tangente);
		vec3.normalize(binormal, binormal);	
		
		var normal = vec3.create();
		vec3.cross(normal, binormal, tangente);
		vec3.normalize(normal, normal);
		
		tangentes.push(tangente);
		normales.push(normal);
		binormales.push(binormal);
					
		for (var i = 1; i < puntosPaso3D.length - 1; i++)
		{
			vec3.sub(tangente, puntosPaso3D[i + 1], puntosPaso3D[i]);
			vec3.normalize(tangente, tangente);
			tangentes.push(tangente);
			
			calcularMarco(puntosPaso3D, tangentes, binormales, normales, i);
		}
		
		tangentes.push(tangente);
		normales.push(normales[normales.length - 1]);
		binormales.push(binormales[binormales.length - 1]);
	}
	calcularMarcosReferencia();
	
	objeto3D.crearBufferVertices = function() 
	{	
		var vertexBuffer = new Array();
		
		vertexBuffer[VERTEXBUFFERPOSICION] = new Array();
		vertexBuffer[VERTEXBUFFERCOLOR] = new Array();	   
								
		for (var i = 0; i < puntosPaso3D.length; i++)
		{
			vertexBuffer[VERTEXBUFFERPOSICION].push(puntosPaso3D[i][0]);
			vertexBuffer[VERTEXBUFFERPOSICION].push(puntosPaso3D[i][1]);
			vertexBuffer[VERTEXBUFFERPOSICION].push(puntosPaso3D[i][2]);			
			
			if(funcionColor)
			{
				var color = funcionColor();
				vertexBuffer[VERTEXBUFFERCOLOR].push(color[0]);
				vertexBuffer[VERTEXBUFFERCOLOR].push(color[1]);
				vertexBuffer[VERTEXBUFFERCOLOR].push(color[2]);
			}
			else
			{
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
								
		for (var i = 0; i < puntosPaso3D.length; i++)
			indexBuffer.push(i);
		return indexBuffer;
	}
	
	objeto3D.construir();
	objeto3D.cambiarModoDibujo(webGL.LINE_STRIP);
	
	objeto3D.obtenerPuntosCurva = function()
	{
		return puntosPaso3D;
	}
	
	objeto3D.obtenerTangentes = function()
	{
		return tangentes;
	}	
	
	objeto3D.obtenerBinormales = function()
	{
		return binormales;
	}
		
	objeto3D.obtenerNormales = function()
	{
		return normales;
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
	
	return objeto3D;
}





