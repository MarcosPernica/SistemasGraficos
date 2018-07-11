var Biga = function(webGL, ancho, alto, largo, textura, repeticionTextura, mapaNormales, material)
{
	var prisma;
	var configuradorShader;
	
	function inicializar()
	{
		if(!material)
			material = metal;
			
		prisma = new PrismaRectangular(webGL, ancho, alto, largo, null, null, (mapaNormales) ? programasShader['difusoMapaNormales'] : programasShader['difuso']);
		
		if(mapaNormales)
		{
			prisma.configuracionesAdicionalesProgramaShader = function(programaShaderActual, luzAmbiente, lucesPuntuales, luzDireccional, camara)
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
																					prisma.obtenerNormales(),
																					prisma.obtenerTangentes(),
																					mapaNormales,
																					true,																			
																					luzAmbiente.obtenerIntensidad(),
																					luzDireccional.obtenerIntensidad(),
																					luzDireccional.obtenerDireccion(),
																					intensidadesLucesPuntuales,
																					posicionesLucesPuntuales,
																					material.coeficienteEspecular,
																					material.coeficienteAmbiente,
																					material.factorGlossy,
																					camara.obtenerPosicion());
				}

				configuradorShader(programaShaderActual, camara.obtenerPosicion(), luzDireccional.obtenerDireccion());
			}
		}
	}
	inicializar();
	
	prisma.crearTextura = function crearTextura()
	{		
		var posicionTexturas = new Array();
		
		if(!repeticionTextura)
			repeticionTextura = 0.02 * largo;
		
		posicionTexturas.push(1024);
		posicionTexturas.push(0);
		
		posicionTexturas.push(1024);
		posicionTexturas.push(512);
		
		posicionTexturas.push(0);
		posicionTexturas.push(512);
		
		posicionTexturas.push(0);
		posicionTexturas.push(0);
				
					
		posicionTexturas.push(1024 * repeticionTextura);
		posicionTexturas.push(0);
		
		posicionTexturas.push(1024 * repeticionTextura);
		posicionTexturas.push(512);
		
		posicionTexturas.push(0);
		posicionTexturas.push(512);
		
		posicionTexturas.push(0);
		posicionTexturas.push(0);
		
		
		
		posicionTexturas.push(1024 * repeticionTextura);
		posicionTexturas.push(512);
		
		posicionTexturas.push(1024 * repeticionTextura);
		posicionTexturas.push(0);
		
		posicionTexturas.push(0);
		posicionTexturas.push(512);
		
		posicionTexturas.push(0);
		posicionTexturas.push(0);
		
		
		
		
		
		posicionTexturas.push(0);
		posicionTexturas.push(0);
		
		posicionTexturas.push(0);
		posicionTexturas.push(512);		
		
		posicionTexturas.push(1024 * repeticionTextura);
		posicionTexturas.push(0);
		
		posicionTexturas.push(1024 * repeticionTextura);
		posicionTexturas.push(512);
		

		
		
		
		posicionTexturas.push(0);
		posicionTexturas.push(0);
		
		posicionTexturas.push(0);
		posicionTexturas.push(512);		
		
		posicionTexturas.push(1024 * repeticionTextura);
		posicionTexturas.push(512);
		
		posicionTexturas.push(1024 * repeticionTextura);
		posicionTexturas.push(0);

		
		
		
		posicionTexturas.push(1024);
		posicionTexturas.push(0);
		
		posicionTexturas.push(1024);
		posicionTexturas.push(512);
		
		posicionTexturas.push(0);
		posicionTexturas.push(512);
		
		posicionTexturas.push(0);
		posicionTexturas.push(0);
		
		ajustarCoordenadasTextura(posicionTexturas, 1024, 512);
	
		return posicionTexturas;
	}	
	
	if(!textura)
		prisma.texturizar(imagenes['biga.png']);
	else
		prisma.texturizar(textura);
		
	return prisma;
}