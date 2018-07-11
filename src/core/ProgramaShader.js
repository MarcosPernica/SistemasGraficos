var ProgramaShader = function(webGL, objetoShaderVertices, objetoShaderFragmentos)
{            
		var handler = null;
		
		this.configurarAtributoVector = function(configuracionPrograma)
		{
			var atributo = webGL.getAttribLocation(handler, configuracionPrograma.nombreAtributo);
			
			if(atributo == -1)
				return false;

			webGL.enableVertexAttribArray(atributo);			
			webGL.bindBuffer(configuracionPrograma.tipoBufferAtributo, configuracionPrograma.buffer);
			
			webGL.vertexAttribPointer(	atributo, 
										configuracionPrograma.dimensionAtributo,
										configuracionPrograma.tipoDatoAtributo,
										configuracionPrograma.habilitarNormalizacion,
										configuracionPrograma.tamañoEntrelazado,
										configuracionPrograma.offsetInicioBuffer);
			
			return true;
		}
		
		this.configurarUniformeVector = function(configuracionPrograma)
		{
			var uniforme = webGL.getUniformLocation(handler, configuracionPrograma.nombreAtributo);
			
			if(uniforme == -1)
				return false;

			webGL.uniform3fv(uniforme, configuracionPrograma.buffer);
			
			return true;
		}
		
		this.configurarUniformeFloat = function(configuracionPrograma)
		{
			var uniforme = webGL.getUniformLocation(handler, configuracionPrograma.nombreAtributo);
			
			if(uniforme == -1)
				return false;
			
			webGL.uniform1f(uniforme, configuracionPrograma.buffer);
			
			return true;
		}
		
		this.configurarUniformeTextura = function(configuracionTextura)
		{
			var uniforme = webGL.getUniformLocation(handler, configuracionTextura.nombreAtributo);
			
			if(uniforme == -1)
				return false;

			webGL.uniform1i(uniforme, configuracionTextura.indice);
			webGL.activeTexture(configuracionTextura.indiceTextura);
			webGL.bindTexture(webGL.TEXTURE_2D, configuracionTextura.textura);
			
			return true;
		}
		
		
		this.configurarTextura = function(configuracionTextura)
		{
			var atributo = webGL.getAttribLocation(handler, configuracionTextura.nombreAtributo);
			
			if(atributo == -1)
				return false;

			webGL.enableVertexAttribArray(atributo);			
			webGL.bindBuffer(configuracionTextura.tipoBufferAtributo, configuracionTextura.buffer);
			
			webGL.vertexAttribPointer(	atributo, 
										configuracionTextura.dimensionAtributo,
										configuracionTextura.tipoDatoAtributo,
										configuracionTextura.habilitarNormalizacion,
										configuracionTextura.tamañoEntrelazado,
										configuracionTextura.offsetInicioBuffer);
										
			var uniforme = webGL.getUniformLocation(handler, 'textura');
			
			if(uniforme == -1)
				return false;

			webGL.uniform1i(uniforme, 0);
			webGL.activeTexture(webGL.TEXTURE0);
			webGL.bindTexture(webGL.TEXTURE_2D, configuracionTextura.textura);
			
			return true;
		}
		
		this.configurarUniformeTexturaCubo = function(configuracionTextura)
		{
			var uniforme = webGL.getUniformLocation(handler, configuracionTextura.nombreAtributo);
			
			if(uniforme == -1)
				return false;

			webGL.uniform1i(uniforme, configuracionTextura.indice);
			webGL.activeTexture(configuracionTextura.indiceTextura);
			webGL.bindTexture(webGL.TEXTURE_CUBE_MAP, configuracionTextura.textura);
			
			return true;
		}
		
		
		this.configurarUniformeMatriz = function(configuracionPrograma)
		{
			var uniforme = webGL.getUniformLocation(handler, configuracionPrograma.nombreAtributo);
			
			if(uniforme == -1)
				return false;
			
			var buffer = crearArrayMatriz(configuracionPrograma.matriz, configuracionPrograma.ordenMatriz);
			
			if(configuracionPrograma.ordenMatriz == 4)
				webGL.uniformMatrix4fv(uniforme, false, buffer);
			else
				webGL.uniformMatrix3fv(uniforme, false, buffer);
			
			return true;
		}		
		
		this.activar = function()
		{
			webGL.useProgram(handler);
		}
		
		function crearArrayMatriz(matriz, ordenMatriz)
		{
			var array = new Array();
			
			for(var i = 0; i < ordenMatriz; i++)
				for(var a = 0; a < ordenMatriz; a++)
					array.push(matriz[i*ordenMatriz + a]);
				
			return new Float32Array(array);
		}
		
		function ProgramaShader()
		{
			if(!objetoShaderVertices)
				objetoShaderVertices = new ShaderVertices(webGL);
				
			if(!objetoShaderFragmentos)
				objetoShaderFragmentos = new ShaderFragmentos(webGL);
		
			var shaderVertices = objetoShaderVertices.obtenerShaderVerticesCompilado();
			var shaderFragmentos = objetoShaderFragmentos.obtenerShaderFragmentosCompilado();
			
			handler = webGL.createProgram();
			webGL.attachShader(handler, shaderVertices);
			webGL.attachShader(handler, shaderFragmentos);
			webGL.linkProgram(handler);
			
			if(!webGL.getProgramParameter(handler, webGL.LINK_STATUS))
			{
				alert('No se pudo compilar el programa de shaders: ' + webGL.getProgramInfoLog(handler));
				webGL.deleteProgram(handler);
				handler = null;
				return false;
			}
			
			webGL.useProgram(handler);
		}
		ProgramaShader.bind(this)();
}