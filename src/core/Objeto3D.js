cacheTexturas = new Array();
programaShaderColores = null;
programaShaderTextura = null;
		
var Objeto3D = function(webGL, cantidadFilas, cantidadColumnas, funcionColor, programaShader)
{	
	var hijos;
	var indexBuffer = null;
	var vertexBuffer = null;
	var modoDibujo = webGL.TRIANGLE_STRIP;
	
	var handlerIndexBuffer = null;
	var handlerVertexBufferPosicion = null;
	var handlerVertexBufferColor = null;
	var handlerVertexBufferTextura = null;
	
	var configuracionVertices = null;
	var configuracionTransformacion = null;
	var configuracionFragmentos = null;
	var configuracionColores = null;
	var configuracionTextura = null;
	var configuracionMatrizPerspectiva = null;
	var configuracionTransformacionNormales = null;
	
	var matrizPosicion = null;
	var elementosAdjuntos;
	
	var usarTextura;
	
	var necesitaActualizarBuffers = false;
	var programaShaderActual;
	
	this.adjuntarElemento = function(elemento)
	{
		elementosAdjuntos.push(elemento);
	}
	
	this.borrarAdjuntos = function()
	{
		elementosAdjuntos = new Array();
	}
	
	this.agregarHijo = function(objeto3D)
	{
		hijos.push(objeto3D);
		return hijos.length - 1;
	}
	
	this.borrarHijo = function(handler)
	{
		hijos.splice(handler, 1);
	}
	
	this.rotar = function(eje, anguloGrados)
	{
		var matrizRotacion = mat4.create();
		mat4.rotate(matrizRotacion, matrizRotacion, 2 * Math.PI * anguloGrados / 360, eje);
		mat4.multiply(matrizPosicion, matrizRotacion, matrizPosicion);
		
		for(var i = 0; i < elementosAdjuntos.length; i++)
			elementosAdjuntos[i].aplicarMatriz(matrizRotacion);
	}	
	
	this.rotarAntes = function(eje, anguloGrados)
	{
		var matrizRotacion = mat4.create();
		mat4.rotate(matrizRotacion, matrizRotacion, 2 * Math.PI * anguloGrados / 360, eje);
		mat4.multiply(matrizPosicion, matrizPosicion, matrizRotacion);
	}
	
	this.escalar = function(escala)
	{
		var matrizEscala = mat4.create();
		matrizEscala[0] = escala[0];
		matrizEscala[5] = escala[1];
		matrizEscala[10] = escala[2];

		mat4.multiply(matrizPosicion, matrizEscala, matrizPosicion);
		
		for(var i = 0; i < elementosAdjuntos.length; i++)
			elementosAdjuntos[i].aplicarMatriz(matrizEscala);
	}
	
	this.trasladar = function(posicionRelativa)
	{
		var matrizDesplazamiento = mat4.create();
		mat4.translate(matrizDesplazamiento, matrizDesplazamiento, posicionRelativa);
		mat4.multiply(matrizPosicion, matrizDesplazamiento, matrizPosicion);
		
		for(var i = 0; i < elementosAdjuntos.length; i++)
			elementosAdjuntos[i].aplicarMatriz(matrizDesplazamiento);
	}	
	
	this.trasladarAntes = function(posicionRelativa)
	{
		var matrizDesplazamiento = mat4.create();
		mat4.translate(matrizDesplazamiento, matrizDesplazamiento, posicionRelativa);
		mat4.multiply(matrizPosicion, matrizPosicion, matrizDesplazamiento);
		
		for(var i = 0; i < elementosAdjuntos.length; i++)
			elementosAdjuntos[i].aplicarMatrizAntes(matrizDesplazamiento);
	}
	
	this.aplicarTransformacionAdicional = function(matrizTransformacion)
	{
	}
	
	this.aplicarTransformacion = function(matrizTransformacion)
	{
		var matriz = matrizPosicion;
		
		if(matrizTransformacion)
			mat4.multiply(matriz, matrizTransformacion, matriz);
			
		this.aplicarTransformacionAdicional(matriz);
		
		var vectorTransformado;
		var buffer = vertexBuffer[VERTEXBUFFERPOSICION];
		
		for(var i = 0; i < buffer.length; i += 3)
		{
				vectorTransformado = vec3.fromValues(buffer[i], buffer[i + 1], buffer[i + 2]);
				vec3.transformMat4(vectorTransformado, vectorTransformado, matriz);
				buffer[i] = vectorTransformado[0];
				buffer[i + 1] = vectorTransformado[1];
				buffer[i + 2] = vectorTransformado[2];
		}		
		actualizarBuffersWebGL();

		for(var i = (debug) ? 1 : 0 ; i < hijos.length; i++)
			hijos[i].aplicarTransformacion(matriz);
			
		mat4.identity(matrizPosicion);
	}
	
	this.obtenerPrimerVertice = function()
	{
		var buffer = vertexBuffer[VERTEXBUFFERPOSICION];
		
		return vec3.fromValues(buffer[0], buffer[1], buffer[2]);
	}	
	
	this.obtenerVertices = function()
	{
		var vertices = new Array();
		var buffer = vertexBuffer[VERTEXBUFFERPOSICION];
		
		for(var i = 0; i < buffer.length; i += 3)
			vertices.push(vec3.fromValues(	buffer[i], 
											buffer[i + 1], 
											buffer[i + 2]));
											
		return vertices;
	}
	
	this.reiniciarPosicion = function()
	{
		mat4.identity(matrizPosicion);
	}
	
	/* Metodo virtual, por defecto crea una grilla de triangulos.*/
	this.crearBufferIndice = function() 
	{
		var columnaActual;
		var columnaSiguiente;
		var indexBuffer = new Array();
		
		for(var i = 0; i < cantidadColumnas - 1; i++)
		{
			columnaActual = i*cantidadFilas;
			columnaSiguiente = (i + 1)*cantidadFilas;
			
			for(var a = 0; a < cantidadFilas; a++)
			{
					indexBuffer.push(a + columnaActual);
					indexBuffer.push(a + columnaSiguiente);
					
					if(a == (cantidadFilas - 1))
					{
						indexBuffer.push(columnaSiguiente + a);
						indexBuffer.push(columnaSiguiente);
					}
			}
		}
		return indexBuffer;
	}
	
	this.funcionColorDefault = function()
	{
		return new Array(Math.random(), Math.random(), Math.random());
	}
	
	/* Metodo virtual, por defecto crea un plano.*/
	this.crearBufferVertices = function() 
	{
		var vertexBuffer = new Array();
		var color;
		
		vertexBuffer[VERTEXBUFFERPOSICION] = new Array();
		vertexBuffer[VERTEXBUFFERCOLOR] = new Array();

		for (var i = 0; i < cantidadColumnas; i++)  
		   for (var j = 0; j < cantidadFilas; j++) 
		   {
			   vertexBuffer[VERTEXBUFFERPOSICION].push(i);
			   vertexBuffer[VERTEXBUFFERPOSICION].push(j);
			   vertexBuffer[VERTEXBUFFERPOSICION].push(0);
			   
			   color = funcionColor(i, j, 0);
			   vertexBuffer[VERTEXBUFFERCOLOR].push(color[0]);
			   vertexBuffer[VERTEXBUFFERCOLOR].push(color[1]);
			   vertexBuffer[VERTEXBUFFERCOLOR].push(color[2]);						  
		   }
		   
		   return vertexBuffer;
	}
	
	/*Metodo virtual, cambiar para distribuir los triangulos de otra forma.*/
	this.crearTextura = function(escaladoTexturaHorizontal, escaladoTexturaVertical)
	{
		var posicionTexturas = new Array();
		
		for (var i = 0; i < cantidadColumnas; i++)  
		   for (var j = 0; j < cantidadFilas; j++) 
		   {
				posicionTexturas.push(i * escaladoTexturaHorizontal);
				posicionTexturas.push(j * escaladoTexturaVertical);
		   }
		   return posicionTexturas;
	}
	
	this.texturizar = function(textura, escaladoTexturaHorizontal, escaladoTexturaVertical, repetir)
	{
		if(!escaladoTexturaHorizontal)
		{
			escaladoTexturaHorizontal = 1;
			escaladoTexturaVertical = 1;
		}
			
		vertexBuffer[VERTEXBUFFERTEXTURA] = this.crearTextura(escaladoTexturaHorizontal, escaladoTexturaVertical);
		
		programaShaderActual = programaShaderColores;
		
		necesitaActualizarBuffers = true;
		usarTextura = true;
		
		if(!programaShader)
			programaShaderActual = programaShaderTextura;
		else	
			programaShaderActual = programaShader;

		configuracionTextura.textura = precargarTextura(webGL, textura, repetir);
	}
	
	this.actualizarBufferVertices = function()
	{
		vertexBuffer = this.crearBufferVertices();
		necesitaActualizarBuffers = true;
	}	
	
	this.actualizarBufferIndice = function()
	{
		indexBuffer = this.crearBufferIndice();
		necesitaActualizarBuffers = true;
	}
	
	function actualizarBuffersWebGL()
	{
		if(indexBuffer)
		{
			webGL.deleteBuffer(handlerIndexBuffer);
			handlerIndexBuffer = webGL.createBuffer();
			webGL.bindBuffer(webGL.ELEMENT_ARRAY_BUFFER, handlerIndexBuffer);
            webGL.bufferData(webGL.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), webGL.STATIC_DRAW);
		}
		
		if(vertexBuffer[VERTEXBUFFERPOSICION])
		{
			webGL.deleteBuffer(handlerVertexBufferPosicion);
			handlerVertexBufferPosicion = webGL.createBuffer();
			webGL.bindBuffer(webGL.ARRAY_BUFFER, handlerVertexBufferPosicion);
            webGL.bufferData(webGL.ARRAY_BUFFER, new Float32Array(vertexBuffer[VERTEXBUFFERPOSICION]), webGL.STATIC_DRAW);
			configuracionVertices.buffer = handlerVertexBufferPosicion;
		}
		
		if(vertexBuffer[VERTEXBUFFERTEXTURA])
		{
			webGL.deleteBuffer(handlerVertexBufferTextura);
			handlerVertexBufferTextura = webGL.createBuffer();
			webGL.bindBuffer(webGL.ARRAY_BUFFER, handlerVertexBufferTextura);
            webGL.bufferData(webGL.ARRAY_BUFFER, new Float32Array(vertexBuffer[VERTEXBUFFERTEXTURA]), webGL.STATIC_DRAW);

			configuracionTextura.buffer = handlerVertexBufferTextura;
		}
		else if(vertexBuffer[VERTEXBUFFERCOLOR])
		{
			webGL.deleteBuffer(handlerVertexBufferColor);
			handlerVertexBufferColor = webGL.createBuffer();
			webGL.bindBuffer(webGL.ARRAY_BUFFER, handlerVertexBufferColor);
            webGL.bufferData(webGL.ARRAY_BUFFER, new Float32Array(vertexBuffer[VERTEXBUFFERCOLOR]), webGL.STATIC_DRAW);
			configuracionColores.buffer = handlerVertexBufferColor;
		}		
		
		necesitaActualizarBuffers = false;
	}
	
	/*Metodo virtual.*/
	this.aceptarModoDebug = function()
	{
		return true;
	}
	
	this.construir = function()
	{
		if(!funcionColor)
			funcionColor = this.funcionColorDefault;
		
		hijos = new Array();
		elementosAdjuntos = new Array();
		
		if(debug && this.aceptarModoDebug())
			hijos.push(new Ejes(webGL));
		
		indexBuffer = this.crearBufferIndice();
		vertexBuffer = this.crearBufferVertices();
		
		matrizPosicion = mat4.create();
		
		configuracionVertices = crearConfiguracionAtributoVector(	'posicionVertice', 
																	webGL.ARRAY_BUFFER,
																	null,
																	3, 
																	webGL.FLOAT, 
																	false, 
																	0, 
																	0);	

		configuracionColores = crearConfiguracionAtributoVector(	'colorVertice', 
																	webGL.ARRAY_BUFFER,
																	null,
																	3, 
																	webGL.FLOAT, 
																	false, 
																	0, 
																	0);			
																	
		configuracionTextura = crearConfiguracionAtributoVector(	'posicionTextura', 
																	webGL.ARRAY_BUFFER,
																	null,
																	2, 
																	webGL.FLOAT, 
																	false, 
																	0, 
																	0);	
															
		configuracionTransformacion = crearConfiguracionUniformeMatriz(	'transformacionObjeto',
																		matrizPosicion,
																		4);
																		
		configuracionTransformacionNormales = crearConfiguracionUniformeMatriz(	'matrizNormales',
																				null,
																				3);
																		
		configuracionMatrizPerspectiva = crearConfiguracionUniformeMatriz(	'matrizPerspectiva',
																			null,
																			4);
		usarTextura = false;
		actualizarBuffersWebGL();
		
		if(!programaShaderColores)
		{
			programaShaderColores = new ProgramaShader(webGL);
			programaShaderTextura = new ProgramaShader(webGL, new ShaderVertices(webGL, 'shaderVerticesTextura'), new ShaderFragmentos(webGL, 'shaderFragmentosTextura'));
		}
		
		if(!programaShader)
			programaShaderActual = programaShaderColores;
		else
			programaShaderActual = programaShader;
	}
	
	this.configuracionesAdicionalesProgramaShader = function(programaShaderActual, direccionLuzAmbiente, posicionesLucesPuntuales, posicionCamara)
	{
	}
	
	this.configurarProgramaShader = function(programaShaderActual, matrizPosicion, matrizVista, matrizVistaPerspectiva, luzAmbiente, lucesPuntuales, luzDireccional, camara, tiempo)
	{		
		var matrizNormales4x4 = mat4.create();
		var matrizNormales = mat3.create();
		
		mat3.normalFromMat4(matrizNormales, matrizPosicion);
		configuracionTransformacionNormales['matriz'] = matrizNormales;
		
		
		programaShaderActual.configurarUniformeMatriz(configuracionTransformacionNormales);
		
		programaShaderActual.configurarAtributoVector(configuracionVertices);
	
		if(!usarTextura)
			programaShaderActual.configurarAtributoVector(configuracionColores);
		else
			programaShaderActual.configurarTextura(configuracionTextura);
		
		configuracionTransformacion['matriz'] = matrizPosicion; 	
		
		programaShaderActual.configurarUniformeMatriz(configuracionTransformacion);
		
		
		configuracionMatrizPerspectiva.matriz = matrizVistaPerspectiva;
		programaShaderActual.configurarUniformeMatriz(configuracionMatrizPerspectiva);
	
		
		this.configuracionesAdicionalesProgramaShader(programaShaderActual, luzAmbiente, lucesPuntuales, luzDireccional, camara, tiempo);
	}
	
	this.cambiarModoDibujo = function(modo)
	{
		modoDibujo = modo;
	}
	
	this.dibujarAdicional = function(webGL, matrizPosicionPadre, matrizVista, matrizVistaPerspectiva, luzAmbiente, lucesPuntuales, luzDireccional, camara)
	{
	}
	
	this.dibujar = function(webGL, matrizPosicionPadre, matrizVista, matrizVistaPerspectiva, luzAmbiente, lucesPuntuales, luzDireccional, camara, tiempo)
	{	
		this.dibujarAdicional(webGL, matrizPosicionPadre, matrizVista, matrizVistaPerspectiva, luzAmbiente, lucesPuntuales, luzDireccional, camara)
		
		var matrizPosicionFinal = mat4.create();
		mat4.multiply(matrizPosicionFinal, matrizPosicionPadre, matrizPosicion);
		
		for(var i = 0; i < hijos.length; i++)
			hijos[i].dibujar(webGL, matrizPosicionFinal, matrizVista, matrizVistaPerspectiva, luzAmbiente, lucesPuntuales, luzDireccional, camara);

		programaShaderActual.activar();
		this.configurarProgramaShader(programaShaderActual, matrizPosicionFinal, matrizVista, matrizVistaPerspectiva, luzAmbiente, lucesPuntuales, luzDireccional, camara, tiempo);

		webGL.bindBuffer(webGL.ELEMENT_ARRAY_BUFFER, handlerIndexBuffer);
		webGL.drawElements(modoDibujo, indexBuffer.length, webGL.UNSIGNED_SHORT, 0);
	}
	
	/*Metodo virtual, actualiza lo que sea necesario del objeto.*/
	this.actualizarObjeto = function(webGL, deltaT, matrizPosicion)
	{
	}
	
	this.actualizar = function(webGL, deltaT)
	{
		for(var i = 0; i < hijos.length; i++)
			hijos[i].actualizar(webGL, deltaT);
			
		this.actualizarObjeto(webGL, deltaT);
		if(necesitaActualizarBuffers)
			actualizarBuffersWebGL(webGL);
	}
	
	this.manejarEntrada = function(evento)
	{
	}	
}