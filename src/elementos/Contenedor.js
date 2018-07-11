var Contenedor = function(webGL, ancho, alto, largo)
{
	var prisma;
	var verticeReferencia;
	var programaShaderDifuso;
	var configuradorShader;
	
	function inicializar()
	{
		programaShaderDifuso = new ProgramaShader(webGL, new ShaderVertices(webGL, 'shaderVerticesDifusos'), new ShaderFragmentos(webGL, 'shaderFragmentosDifusos'));
		verticeReferencia = new Referencia([0, alto / 2, largo / 2]);
		prisma = new PrismaRectangular(webGL, ancho, alto, largo, null, null, programaShaderDifuso);
		prisma.adjuntarElemento(verticeReferencia);	
		configuradorShader = null;
	}
	inicializar();
	
	prisma.obtenerPosicion = function()
	{
		return verticeReferencia.obtenerReferencia();
	}
	
	prisma.asignarReferencia = function(referencia)
	{
		verticeReferencia = referencia;
	}
	
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
			
			configuradorShader = crearConfiguradorShaderDifuso(	webGL,
																prisma.obtenerNormales(),
																luzAmbiente.obtenerIntensidad(),
																luzDireccional.obtenerIntensidad(),
																luzDireccional.obtenerDireccion(),
																intensidadesLucesPuntuales,
																posicionesLucesPuntuales,
																metal.coeficienteEspecular,
																metal.coeficienteAmbiente,
																metal.factorGlossy,
																camara.obtenerPosicion());
			configuradorShader(programaShaderActual, camara.obtenerPosicion());
		}

		configuradorShader(programaShaderActual, camara.obtenerPosicion());
	}
	
	prisma.crearTextura = function crearTextura()
	{		
		var posicionTexturas = new Array();
		
		posicionTexturas.push(280);
		posicionTexturas.push(0);
		
		posicionTexturas.push(280);
		posicionTexturas.push(280);
		
		posicionTexturas.push(0);
		posicionTexturas.push(280);
		
		posicionTexturas.push(0);
		posicionTexturas.push(0);
				
					
		posicionTexturas.push(0);
		posicionTexturas.push(478);
		
		posicionTexturas.push(0);
		posicionTexturas.push(280);
		
		posicionTexturas.push(593);
		posicionTexturas.push(278);
		
		posicionTexturas.push(593);
		posicionTexturas.push(478);
		
		
		
		posicionTexturas.push(715);
		posicionTexturas.push(498);
		
		posicionTexturas.push(715);
		posicionTexturas.push(715);
		
		posicionTexturas.push(9);
		posicionTexturas.push(495);
		
		posicionTexturas.push(9);
		posicionTexturas.push(715);
		
		
		posicionTexturas.push(0);
		posicionTexturas.push(478);
		
		posicionTexturas.push(0);
		posicionTexturas.push(280);
		
		posicionTexturas.push(593);
		posicionTexturas.push(478);
		
		posicionTexturas.push(593);
		posicionTexturas.push(278);		
		
		
				
		posicionTexturas.push(9);
		posicionTexturas.push(715);
		
		posicionTexturas.push(9);
		posicionTexturas.push(495);

		posicionTexturas.push(715);
		posicionTexturas.push(498);
		
		posicionTexturas.push(715);
		posicionTexturas.push(715);		
		
		
		posicionTexturas.push(280);
		posicionTexturas.push(280);
		
		posicionTexturas.push(280);
		posicionTexturas.push(0);
		
		posicionTexturas.push(0);
		posicionTexturas.push(0);
		
		posicionTexturas.push(0);
		posicionTexturas.push(280);
		
		ajustarCoordenadasTextura(posicionTexturas, 730, 728);
	
		return posicionTexturas;
	}	
	
	var textura = Math.floor(Math.random() * 3);
	
	prisma.texturizar(imagenes['contenedor' + textura +'.jpg'], 1, 1, false);
		
	return prisma;
}