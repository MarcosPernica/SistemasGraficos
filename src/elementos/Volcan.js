var Volcan = function(webGL, puntosNivel, cantidadNiveles)
{
	var puntosControlBase;	
	var factorOscilacion;
	var factorOscilacionMedio;	
	var elipse;

	var volcan;
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
			
		datosTexturaLava = configuracionTextura(	imagenes['lava.png'],
													512,
													512,
													235,
													[255, 260],
													[[512, 0],[1024, 0]],
													[[512, 512], [1024, 512]],
													true,
													1);
													
		var centro;
				
		puntosControlBase = new Array([0, 0], [16.30, 18.17], [24.59, 32.61], [29.93, 40.36], [39.56, 33.14], [43.30, 31], [46.77, 29.40], [53.19, 25.93], [56.66, 22.72], [62.74, 19.78], [77.24, 11.49], [95.68, -0.27], [107.44, -6.68], [119.74, -13.10], [133.10, -21.92], [147, -29.93], [161.16, -36.81], [178.80, -45.44], [207.67, -57.46], [500.54, -5]);
		
		elipse = new Elipse(webGL, 1, 1, cantidadNiveles);
		
		lava = new SuperficieCurva(webGL, new Elipse(webGL, 50, 50, cantidadNiveles), null, datosTexturaLava);
		lava.trasladar([0, 0, 10]);
	}
	inicializar();
	
	volcan =  new SuperficieBarrido(webGL, crearCurvas(), elipse, false, color, programasShader['difuso']);
	
	volcan.configuracionesAdicionalesProgramaShader = function(programaShaderActual, luzAmbiente, lucesPuntuales, luzDireccional, camara)
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
																volcan.obtenerNormales(),
																luzAmbiente.obtenerIntensidad(),
																luzDireccional.obtenerIntensidad(),
																luzDireccional.obtenerDireccion(),
																intensidadesLucesPuntuales,
																posicionesLucesPuntuales,
																roca.coeficienteEspecular,
																roca.coeficienteAmbiente,
																roca.factorGlossy,
																camara.obtenerPosicion());
			configuradorShader(programaShaderActual, camara.obtenerPosicion());
		}

		configuradorShader(programaShaderActual, camara.obtenerPosicion(), luzDireccional.obtenerDireccion());
	}
	
	volcan.texturizar(imagenes['volcan.png'], 0.25, 0.25);
	volcan.agregarHijo(lava);
	
	return volcan;
}