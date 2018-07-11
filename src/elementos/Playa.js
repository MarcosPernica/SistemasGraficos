var Playa = function(webGL, puntosNivel, cantidadNiveles)
{
	var puntosControlBase;	
	var factorOscilacion;
	var factorOscilacionMedio;	
	var elipse;

	var playa;
	var lava;
	
	var datosTexturaLava;

	var configuradorShader;
	
	function color()
	{
		return new Array(Math.random(), 0.176, 0.051);
	}
	
	function crearPuntosCurva()
	{
		var puntosControlCurva = new Array();
		
		for(var i = 0; i < puntosControlBase.length; i++)
			puntosControlCurva.push(vec3.fromValues(puntosControlBase[i][0] + Math.random() * factorOscilacion - factorOscilacionMedio, puntosControlBase[i][1] + Math.random() * factorOscilacion - factorOscilacionMedio, 0)); 
			

		return puntosControlCurva;
	}
	
	function crearCurvas()
	{
		factorOscilacion = 5;
		factorOscilacionMedio = factorOscilacion / 2;
		
		var curvas = new Array();
		var bspline;

		for(var i = 0; i < cantidadNiveles - 1; i++)
		{
			bspline = new BSplineCubica(webGL, crearPuntosCurva(), puntosNivel, null, vec3.fromValues(0, 1, 0));
			centro = bspline.obtenerPrimerVertice();
			bspline.rotar([0, 0, 1], 90);
			bspline.escalar([-1, -1, 1]);
			bspline.trasladar([-centro[0], -centro[1], 0]);
			bspline.aplicarTransformacion();
			
			curvas.push(bspline);
		}
		
		curvas.push(curvas[0]);
		
		return curvas;
	}

	function inicializar()
	{
		configuradorShader = null;
		
		var centro;
				
		puntosControlBase = new Array([0, 0], [22.85, 0], [42.83, 0], [72.03, 0], [90.04, 0], [115.59, -6], [123.21, -10.82], [139.78, -20.98], [159.29, -33.41]);
		
		elipse = new Elipse(webGL, 0.01, 0.01, cantidadNiveles);
		
	}
	inicializar();
	
	playa =  new SuperficieBarrido(webGL, crearCurvas(), elipse, false, color, programasShader['difusoMapaNormales']);
	playa.texturizar(imagenes['arena.png'], 1, 0.1);
	
	playa.configuracionesAdicionalesProgramaShader = function(programaShaderActual, luzAmbiente, lucesPuntuales, luzDireccional, camara)
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
																			playa.obtenerNormales(),
																			playa.obtenerTangentes(),
																			imagenes['normalesArena.png'],
																			true,																			
																			luzAmbiente.obtenerIntensidad(),
																			luzDireccional.obtenerIntensidad(),
																			luzDireccional.obtenerDireccion(),
																			intensidadesLucesPuntuales,
																			posicionesLucesPuntuales,
																			arena.coeficienteEspecular,
																			arena.coeficienteAmbiente,
																			arena.factorGlossy,
																			camara.obtenerPosicion());
		}

		configuradorShader(programaShaderActual, camara.obtenerPosicion(), luzDireccional.obtenerDireccion());
	}
	
	return playa;
}