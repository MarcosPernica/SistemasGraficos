var MuelleCarga = function(webGL, ancho, largo)
{
	var configuradorShaderPilares = new Array();;
	
	var datosTexturaPilar = configuracionTextura(	imagenes['pilar.png'],
													1024,
													512,
													256,
													[512, 256],
													[[0, 0],[1024, 0]],
													[[0, 512], [1024, 512]],
													true,
													0.5);	
													
	var datosTexturaSuelo = configuracionTextura(	imagenes['concreto.png'],
													1024,
													1024,
													256,
													[512, 256],
													[[0, 0],[1024, 0]],
													[[0, 512], [1024, 512]],
													true,
													20,
													10);
													
	function configuracionesAdicionalesProgramaShaderPilar(programaShaderActual, luzAmbiente, lucesPuntuales, luzDireccional, camara)
	{
		if(!configuradorShaderPilares[this])
		{
			var posicionesLucesPuntuales = new Array();
			var intensidadesLucesPuntuales = new Array();
			
			for(var i = 0; i < lucesPuntuales.length; i++)
			{
				posicionesLucesPuntuales.push(lucesPuntuales[i].obtenerPosicion());
				intensidadesLucesPuntuales.push(lucesPuntuales[i].obtenerIntensidad());
			}
			
			configuradorShaderPilares[this] = crearConfiguradorShaderDifuso(	webGL,
																				this.obtenerNormales(),						
																				luzAmbiente.obtenerIntensidad(),
																				luzDireccional.obtenerIntensidad(),
																				luzDireccional.obtenerDireccion(),
																				intensidadesLucesPuntuales,
																				posicionesLucesPuntuales,
																				granito.coeficienteEspecular,
																				granito.coeficienteAmbiente,
																				granito.factorGlossy,
																				camara.obtenerPosicion());
		}
		configuradorShaderPilares[this](programaShaderActual, camara.obtenerPosicion(), luzDireccional.obtenerDireccion());
		
	}
							
	function creadorCilindro(webGL, posicion)
	{
		var alto = 200;
		var cilindro = new Cilindro(webGL, 10, 10, alto, datosTexturaPilar, programasShader['difuso']);
		cilindro.configuracionesAdicionalesProgramaShader = configuracionesAdicionalesProgramaShaderPilar.bind(cilindro);
		
		cilindro.trasladar([0, 0, alto/2]);	
		cilindro.rotar([1, 0, 0], 90);
		cilindro.trasladar(posicion);

		return cilindro;
	}
	
	var configuradorShader;

	var plataforma = new PrismaRectangular(webGL, ancho, 20, largo, datosTexturaSuelo, null, programasShader['difusoMapaNormales']);
	var sosten = new GrillaElementos(webGL, ancho, largo, 5, 15, creadorCilindro);	
	
	plataforma.configuracionesAdicionalesProgramaShader = function(programaShaderActual, luzAmbiente, lucesPuntuales, luzDireccional, camara)
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
			
			configuradorShader = crearConfiguradorShaderDifusoMapaNormales(	webGL,
																			plataforma.obtenerNormales(),
																			plataforma.obtenerTangentes(),
																			imagenes['normalesConcreto.png'],
																			true,																			
																			luzAmbiente.obtenerIntensidad(),
																			luzDireccional.obtenerIntensidad(),
																			luzDireccional.obtenerDireccion(),
																			intensidadesLucesPuntuales,
																			posicionesLucesPuntuales,
																			granito.coeficienteEspecular,
																			granito.coeficienteAmbiente,
																			granito.factorGlossy,
																			camara.obtenerPosicion());
		}

		configuradorShader(programaShaderActual, camara.obtenerPosicion(), luzDireccional.obtenerDireccion());
	}
	
	plataforma.trasladar([150, 0, -34]);
	plataforma.aplicarTransformacion();
	
	plataforma.agregarHijo(sosten);
	
	return plataforma;	
}