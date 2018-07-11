var PosteLuz = function(webGL, anchoGrilla, altoGrilla)
{
	var posteLuz;
	var lampara;
	var poste;
	var configuradorShader;
	
	var configuracionTexturaPoste = configuracionTextura(	imagenes['posteLuz.png'],
															1024,
															512,
															256,
															[512, 256],
															[[0, 0],[1024, 0]],
															[[0, 512], [1024, 512]],
															true,
															0.1,
															1);
															
	function color()
	{
		return vec3.fromValues(1, 1, 1);
	}
	
	function inicializar()
	{					
		lampara = new Esfera(webGL, anchoGrilla, altoGrilla, 5, null, null, color);
		lampara.trasladar([0, 0, 35]);
		
		poste = new Cilindro(webGL, anchoGrilla, 1, 70, configuracionTexturaPoste, programasShader['difusoMapaNormalesReflejo']);
		
		poste.configuracionesAdicionalesProgramaShader = function(programaShaderActual, luzAmbiente, lucesPuntuales, luzDireccional, camara)
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
																						poste.obtenerNormales(),
																						poste.obtenerTangentes(),
																						imagenes['normalesBigaReflejante.png'],
																						imagenes['posx.png'],
																						imagenes['negx.png'],
																						imagenes['posy.png'],
																						imagenes['negy.png'],
																						imagenes['posz.png'],
																						imagenes['negz.png'],
																						0.1,
																						true,																			
																						luzAmbiente.obtenerIntensidad(),
																						luzDireccional.obtenerIntensidad(),
																						luzDireccional.obtenerDireccion(),
																						intensidadesLucesPuntuales,
																						posicionesLucesPuntuales,
																						metalPintado.coeficienteEspecular,
																						metalPintado.coeficienteAmbiente,
																						metalPintado.factorGlossy,
																						camara.obtenerPosicion());
			}

			configuradorShader(programaShaderActual, camara.obtenerPosicion(), luzDireccional.obtenerDireccion());
		}
		
		posteLuz = new Objeto3D(webGL, 1, 1);
		posteLuz.construir();
		
		posteLuz.agregarHijo(lampara);
		posteLuz.agregarHijo(poste);
	}
	inicializar();
		
	return posteLuz
}