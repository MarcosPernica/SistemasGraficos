var Agua = function(webGL, cantidadFilas, cantidadColumnas, funcionColor)
{	
	var objeto3D;
	var configuradorShader;
	
	function inicializar()
	{
		configuradorShader = null;
		objeto3D = new Plano(webGL, cantidadFilas, cantidadColumnas, programasShader['agua']);
		objeto3D.construir();
		objeto3D.texturizar(imagenes['agua.jpg'], 0.1, 0.1);
	}
	inicializar();
	
	objeto3D.configuracionesAdicionalesProgramaShader = function(programaShaderActual, luzAmbiente, lucesPuntuales, luzDireccional, camara, tiempo)
	{
		if(!configuradorShader)
		{
			var posicionesLucesPuntuales = new Array();
			var intensidadesLucesPuntuales = new Array();
			
			for(var i = 0; i < lucesPuntuales.length; i++)
			{
				posicionesLucesPuntuales.push(lucesPuntuales[i].obtenerPosicion());
				intensidadesLucesPuntuales.push(lucesPuntuales[i].obtenerIntensidad());
			}
			
			configuradorShader = crearConfiguradorShaderAgua(	webGL,
																0,				
																objeto3D.obtenerNormales(),
																objeto3D.obtenerTangentes(),
																imagenes['normalesBigaReflejante.png'],
																imagenes['agua2.jpg'],
																imagenes['posx.png'],
																imagenes['negx.png'],
																imagenes['posy.png'],
																imagenes['negy.png'],
																imagenes['posz.png'],
																imagenes['negz.png'],
																0.3,
																true,																	
																luzAmbiente.obtenerIntensidad(),
																luzDireccional.obtenerIntensidad(),
																luzDireccional.obtenerDireccion(),
																intensidadesLucesPuntuales,
																posicionesLucesPuntuales,
																agua.coeficienteEspecular,
																agua.coeficienteAmbiente,
																agua.factorGlossy,
																camara.obtenerPosicion());
		}
		configuradorShader(programaShaderActual, camara.obtenerPosicion(), luzDireccional.obtenerDireccion(), tiempo);
	}
	
	return objeto3D;
}