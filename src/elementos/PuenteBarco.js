var PuenteBarco = function(webGL)
{
	var puente;
	var configuradorShader;
		
	function inicializar()
	{		
		datosTexturaPuenteBarco = configuracionTextura(	imagenes['puentebarco.png'],
														1024,
														1024,
														1,
														[171, 171],
														[[431, 0],[1024, 0]],
														[[431, 1024], [1024, 1024]],
														false,
														0.03);
													
		puente = new Cilindro(webGL, 100, 100, 100, datosTexturaPuenteBarco, programasShader['difusoMapaNormalesReflejo']);
		puente.rotar([1, 0, 0], 90);
		puente.rotar([0, 1, 0], 240);
		puente.escalar([-0.5, 1, 1]);
		puente.trasladar([0, 38, 0]);
	}
	inicializar();
	
	puente.configuracionesAdicionalesProgramaShader = function(programaShaderActual, luzAmbiente, lucesPuntuales, luzDireccional, camara)
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
			
			configuradorShader = crearConfiguradorShaderDifusoMapaNormalesReflejo(	webGL,
																						puente.obtenerNormales(),
																						puente.obtenerTangentes(),
																						imagenes['normalesBigaReflejante.png'],
																						imagenes['posx.png'],
																						imagenes['negx.png'],
																						imagenes['posy.png'],
																						imagenes['negy.png'],
																						imagenes['posz.png'],
																						imagenes['negz.png'],
																						0.04,
																						true,																	
																						luzAmbiente.obtenerIntensidad(),
																						luzDireccional.obtenerIntensidad(),
																						luzDireccional.obtenerDireccion(),
																						intensidadesLucesPuntuales,
																						posicionesLucesPuntuales,
																						madera.coeficienteEspecular,
																						madera.coeficienteAmbiente,
																						madera.factorGlossy,
																						camara.obtenerPosicion());
		}
		configuradorShader(programaShaderActual, camara.obtenerPosicion(), luzDireccional.obtenerDireccion());
	}
	
	return puente;	
}