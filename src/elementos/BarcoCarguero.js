var BarcoCarguero = function(webGL, nivelesProfundidad, cantidadPuntosCurva)
{
	var pasoProfundidad;
	var puntosCurvaBarco;
	var puntosCurvaBarrido;
	
	var curvasBarco;
	var lineaBarrido;
	
	var barco;
	var techoBarco;	
	var nivelTechoBarco;
	
	var puenteBarco;
	var datosTexturaPisoBarco
	
	var configuradorShaderTecho;
	var configuradorShaderBarco;
	
	function crearCurvaBarrido()
	{	
		for(var i = 0; i < nivelesProfundidad; i++)
			puntosCurvaBarrido.push(vec3.fromValues(i, 0, 0));
	}
	
	function funcionEscala(paso)
	{
		return ((0.8 - 1)/nivelesProfundidad) * paso + 1
	}
	
	function procesamientoNormal(punto, normal)
	{
		var referencia = vec3.create();
		vec3.sub(referencia, vec3.create(), punto);
		
		if(vec3.dot(normal, referencia) >= 0)
			vec3.scale(normal, normal, -1);
	}
	
	function crearCurvasBarco()
	{
		var curva;
		var pasoFondo = 130 / cantidadPuntosCurva;
		var i;
		
		for(i = 0; i < nivelesProfundidad - 1; i++)
		{
			curva = new BezierCompuesta(webGL, puntosCurvaBarco, cantidadPuntosCurva, true, procesamientoNormal);
			curva.trasladar([-130, 0, 0]);
			curva.escalar([funcionEscala(i), funcionEscala(i), 1]);
			curva.aplicarTransformacion();
			curvasBarco.push(curva);
		}
		
		var fondo = new Array();
		
		for(var j = 0; j < cantidadPuntosCurva; j++)
			fondo.push(vec3.fromValues(-130/4, 0, 0));
			
		curva = new InterpolacionLineal(webGL, fondo);
		curvasBarco.push(curva);
	}
	
	function inicializar()
	{
		datosTexturaPisoBarco = configuracionTextura(	imagenes['pisobarco.png'],
														512,
														512,
														235,
														[255, 260],
														[[512, 0],[1024, 0]],
														[[512, 512], [1024, 512]],
														true,
														10);

		
		if(!cantidadPuntosCurva)
			cantidadPuntosCurva = 50;
			
		nivelTechoBarco = 1;
			
		curvasBarco = new Array();
		puntosCurvaBarrido = new Array();
		crearCurvaBarrido();
		lineaBarrido = new InterpolacionLineal(webGL, puntosCurvaBarrido);
		
		puntosCurvaBarco = crearPuntos3D([0, 0, 0], [0, 1, 0], [-1.4, 6.15, 0], [18.71, 9.92, 0], [19.51, 10.16, 0], [27.59, 11.15, 0], [40.54, 11.53, 0], [50.60, 12.47, 0],  [116.27, 11.48, 0], [128.23, 10.54, 0], [130.69, 0, 0],  [130.69, 0, 0], [130.69, 0, 0], [128.32, -10.52, 0], [128.32, -10.52, 0], [128.32, -10.52, 0], [116.40, -11.46, 0], [50.75, -12.39, 0], [40.73, -11.53, 0], [27.60, -11.16, 0], [19.54, -10, 0], [18.91, -9.92, 0], [-1.17, -6.15, 0], [0.20, -0.37, 0], [0, 0, 0]);
		crearCurvasBarco();
	}
	inicializar();
	
	techoBarco = new SuperficieCurva(webGL, curvasBarco[nivelTechoBarco], null, datosTexturaPisoBarco, programasShader['difusoMapaNormalesReflejo'], true);
	techoBarco.escalar([0.991, 0.991, 0.991]);
	techoBarco.rotar([1, 0, 0], 90);
	techoBarco.rotar([0, 0, 1], 90);
	techoBarco.trasladar([nivelTechoBarco, 0, 0]);
	
	techoBarco.configuracionesAdicionalesProgramaShader = function(programaShaderActual, luzAmbiente, lucesPuntuales, luzDireccional, camara)
	{
		if(!configuradorShaderTecho)
		{
			var posicionesLucesPuntuales = new Array();
			var intensidadesLucesPuntuales = new Array();
			
			for(var i = 0; i < lucesPuntuales.length; i++)
			{
				posicionesLucesPuntuales.push(lucesPuntuales[i].obtenerPosicion());
				intensidadesLucesPuntuales.push(lucesPuntuales[i].obtenerIntensidad());
			}
			
			configuradorShaderTecho = crearConfiguradorShaderDifusoMapaNormalesReflejo(	webGL,
																						techoBarco.obtenerNormales(),
																						techoBarco.obtenerTangentes(),
																						imagenes['normalesBigaReflejante.png'],
																						imagenes['posx.png'],
																						imagenes['negx.png'],
																						imagenes['posy.png'],
																						imagenes['negy.png'],
																						imagenes['posz.png'],
																						imagenes['negz.png'],
																						0.5,
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
		configuradorShaderTecho(programaShaderActual, camara.obtenerPosicion(), luzDireccional.obtenerDireccion());
	}
	
	
	puenteBarco = new PuenteBarco(webGL);
	puenteBarco.rotar([0, 0, 1], 90);
	puenteBarco.rotar([1, 0, 0], 180);
	puenteBarco.escalar([0.1, 0.1, 0.1]);
	puenteBarco.trasladar([0, -10, 0]);
	
	barco = new SuperficieBarrido(webGL, curvasBarco, lineaBarrido, false, null, programasShader['difusoReflejo']);	
	barco.agregarHijo(techoBarco);
	barco.agregarHijo(puenteBarco);
	
	barco.configuracionesAdicionalesProgramaShader = function(programaShaderActual, luzAmbiente, lucesPuntuales, luzDireccional, camara)
	{
		if(!configuradorShaderBarco)
		{
			var posicionesLucesPuntuales = new Array();
			var intensidadesLucesPuntuales = new Array();
			
			for(var i = 0; i < lucesPuntuales.length; i++)
			{
				posicionesLucesPuntuales.push(lucesPuntuales[i].obtenerPosicion());
				intensidadesLucesPuntuales.push(lucesPuntuales[i].obtenerIntensidad());
			}
			
			configuradorShaderBarco = crearConfiguradorShaderDifusoReflejo(	webGL,
																			barco.obtenerNormales(),
																			imagenes['posx.png'],
																			imagenes['negx.png'],
																			imagenes['posy.png'],
																			imagenes['negy.png'],
																			imagenes['posz.png'],
																			imagenes['negz.png'],
																			0.2,
																			true,																	
																			luzAmbiente.obtenerIntensidad(),
																			luzDireccional.obtenerIntensidad(),
																			luzDireccional.obtenerDireccion(),
																			intensidadesLucesPuntuales,
																			posicionesLucesPuntuales,
																			metalReflejante.coeficienteEspecular,
																			metalReflejante.coeficienteAmbiente,
																			metalReflejante.factorGlossy,
																			camara.obtenerPosicion());
		}
		configuradorShaderBarco(programaShaderActual, camara.obtenerPosicion(), luzDireccional.obtenerDireccion());
	}

	barco.escalar([10, 7, 10]);
	
	barco.texturizar(imagenes['oxido.png'], 0.1, 0.1);
	
	return barco;	
}