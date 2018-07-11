var ShaderVertices = function(webGL, idScriptShader)
{            
		var handler = null;
		
		function ShaderVertices()
		{
			var idScript = idScriptShader;
			if(!idScript)
				idScript = 'shaderVerticesDefecto';
			
			handler = crearShader(webGL, idScript, webGL.VERTEX_SHADER);
		}
		ShaderVertices();
		
		this.obtenerShaderVerticesCompilado = function()
		{
			return handler;
		}		
}