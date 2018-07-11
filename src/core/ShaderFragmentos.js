var ShaderFragmentos = function(webGL, idScriptShader)
{            
		var handler = null;
		
		function ShaderFragmentos()
		{
			var idScript = idScriptShader;
			if(!idScript)
				idScript = 'shaderFragmentosDefecto';
				
			handler = crearShader(webGL, idScript, webGL.FRAGMENT_SHADER);
		}
		ShaderFragmentos();
		
		this.obtenerShaderFragmentosCompilado = function()
		{
			return handler;
		}		
}