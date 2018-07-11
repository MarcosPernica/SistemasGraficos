var SuperficieBarrido = function(webGL, curvasForma, curvaRecorrido, activarAzarFormas, funcionColor, programaShader)
{
	var puntosRecorrido;
	var arregloCurvasForma;
	var verticesSuperficie;
	
	var objeto3D;	
	
	var tangentes;
	var normales;
	var binormales;	
	
	function copiarArray(array)
	{
		var arrayNuevo = new Array();
		
		for(var i = 0; i < array.length; i++)
			arrayNuevo.push(vec3.clone(array[i]));
			
		return arrayNuevo;
	}
	
	function obtenerCurvaForma(nivel)
	{
		if(activarAzarFormas || activarAzarFormas == undefined)
			return arregloCurvasForma[Math.floor(Math.random() * arregloCurvasForma.length)];
		else
			return arregloCurvasForma[nivel % arregloCurvasForma.length];
	}
	
	function calcularMatrizNivel(puntos, tangentes, binormales, normales, nivel)
	{		
		var matrizNivel = mat4.fromValues(	binormales[nivel][0], binormales[nivel][1], binormales[nivel][2], 0,
											normales[nivel][0], normales[nivel][1], normales[nivel][2], 0,
											tangentes[nivel][0], tangentes[nivel][1], tangentes[nivel][2], 0,										
											puntos[nivel][0], puntos[nivel][1], puntos[nivel][2], 1);
											
		return matrizNivel;
	}
	
	function calcularNivel(verticesNivel, puntos, tangentes, binormales, normales, nivel, tangentesNivel, normalesNivel, binormalesNivel)
	{								
		var matrizNivel = calcularMatrizNivel(puntos, tangentes, binormales, normales, nivel);
		var matrizNormales = mat3.create();
		
		mat3.normalFromMat4(matrizNormales, matrizNivel);
		
		for(var i = 0; i < verticesNivel.length; i++)
		{
			vec3.transformMat4(verticesNivel[i], verticesNivel[i], matrizNivel);
			
			vec3.transformMat3(tangentesNivel[i], tangentesNivel[i], matrizNormales);
			vec3.transformMat3(normalesNivel[i], normalesNivel[i], matrizNormales);
			vec3.transformMat3(binormalesNivel[i], binormalesNivel[i], matrizNormales);
		}
	}
	
	function funcionColorDefault()
	{
		return new Array(Math.random(), Math.random(), Math.random());
	}
	
	function crearBufferVertices()
	{
		var verticesNivel;
		var color;
		
		var tangentesRecorrido = curvaRecorrido.obtenerTangentes();
		var binormalesRecorrido = curvaRecorrido.obtenerBinormales();
		var normalesRecorrido = curvaRecorrido.obtenerNormales();
		
		var vertexBuffer = new Array();
		vertexBuffer[VERTEXBUFFERPOSICION] = new Array();
		vertexBuffer[VERTEXBUFFERCOLOR] = new Array();	  

		var tangentesNivel;
		var normalesNivel;
		var binormalesNivel;

		for(var i = 0; i < puntosRecorrido.length; i++)
		{
			var curvaNivel = obtenerCurvaForma(i);
						
			verticesNivel = copiarArray(curvaNivel.obtenerVertices());
			tangentesNivel = copiarArray(curvaNivel.obtenerTangentes());
			normalesNivel =  copiarArray(curvaNivel.obtenerNormales());
			binormalesNivel =  copiarArray(curvaNivel.obtenerBinormales());
			
			calcularNivel(verticesNivel, puntosRecorrido, tangentesRecorrido, binormalesRecorrido, normalesRecorrido, i, tangentesNivel, normalesNivel, binormalesNivel);
			
			verticesSuperficie = verticesSuperficie.concat(verticesNivel);
			
			tangentes = tangentes.concat(tangentesNivel);
			normales = normales.concat(normalesNivel);
			binormales = binormales.concat(binormalesNivel);
			
			for (var j = 0; j < verticesNivel.length; j++)
			{
				vertexBuffer[VERTEXBUFFERPOSICION].push(verticesNivel[j][0]);
				vertexBuffer[VERTEXBUFFERPOSICION].push(verticesNivel[j][1]);
				vertexBuffer[VERTEXBUFFERPOSICION].push(verticesNivel[j][2]);
				
				color = funcionColor(verticesNivel[j][0], verticesNivel[j][1], verticesNivel[2]);
				
				vertexBuffer[VERTEXBUFFERCOLOR].push(color[0]);
				vertexBuffer[VERTEXBUFFERCOLOR].push(color[1]);
				vertexBuffer[VERTEXBUFFERCOLOR].push(color[2]);
			}
		}
		return vertexBuffer;
	}
	
	function inicializar()
	{
		tangentes = new Array();
		normales = new Array();
		binormales = new Array();
		
		verticesSuperficie = new Array();
		
		if(!funcionColor)
			funcionColor = funcionColorDefault;
		
		if(curvasForma.length && curvasForma.length > 1)
			arregloCurvasForma = curvasForma;
		else if(curvasForma.length == 1)
		{
			arregloCurvasForma = new Array();
			arregloCurvasForma.push(curvasForma[0]);
		}
		else
		{
			arregloCurvasForma = new Array();
			arregloCurvasForma.push(curvasForma);
		}

		puntosForma = obtenerCurvaForma(0).obtenerVertices();

		puntosRecorrido = curvaRecorrido.obtenerVertices();

		objeto3D = new Objeto3D(webGL, puntosForma.length, puntosRecorrido.length, null, programaShader);
		objeto3D.crearBufferVertices = crearBufferVertices;
		objeto3D.construir();
		
		if(debug)
			for(var i = 0; i < normales.length; i++)
				objeto3D.agregarHijo(new Ejes(webGL, verticesSuperficie[i], new Array(normales[i], tangentes[i], binormales[i])));
	}
	inicializar();	
	
	objeto3D.obtenerNormales = function()
	{
		return normales;
	}
	
	objeto3D.obtenerTangentes = function()
	{
		return tangentes;
	}
	
	objeto3D.obtenerBinormales = function()
	{
		return binormales;
	}
	
	return objeto3D;	
}