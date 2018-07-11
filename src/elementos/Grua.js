var Grua = function(webGL, contenedores, camara, luz, velocidadDesplazamientoLateral, velocidadDesplazamientoCabina, velocidadDesplazamientoGarra, distanciaDesplazamientoCentro)
{
	var anchoBiga;
	var distanciaLados;
	var distanciaHorizontalRuedas;
	var distanciaVerticalRuedas;
	var radioRuedas;
	var ruedas;
	var tensores;
	var cabina;
	var garra;
	var verticeReferencia;
	var verticeReferenciaCabina;
	var verticeReferenciaGarra;
	var verticeReferenciaEnganche;
	
	var movimientoCentro;
	var movimientoCabina;
	var movimientoGarra;
	var distanciaCabinaPiso;
	var escalaTensores;
	var pasoEscalaTensores;
	
	var contenedorEnganchado;
	var indiceContenedorEnganchado;
	
	var funcionDibujarOriginal;
	var funcionActualizarOriginal;
	
	var configuradorShaderRuedas;
	var configuradorShaderTensores;
	
	var grua = new Objeto3D(webGL, 1, 1);
	grua.construir();	
	
	function crearEstructura()
	{		
		verticeReferencia = new Referencia(vec3.fromValues(1, 0, 0), true);
		grua.adjuntarElemento(verticeReferencia);		
		grua.adjuntarElemento(verticeReferenciaEnganche);

		var biga = new Biga(webGL, anchoBiga, anchoBiga, distanciaLados + anchoBiga, null, null, imagenes['normalesBiga.png']);
		biga.trasladar([0, 250, -anchoBiga / 2]);
		grua.agregarHijo(biga);
		
		biga = new Biga(webGL, anchoBiga, anchoBiga, distanciaLados - anchoBiga, null, null, imagenes['normalesBiga.png']);
		biga.trasladar([0, 100, anchoBiga / 2]);
		grua.agregarHijo(biga);		
		
		biga = new Biga(webGL, anchoBiga, anchoBiga, 250 - anchoBiga / 2, null, null, imagenes['normalesBiga.png']);
		biga.rotar([1, 0, 0], 90);
		biga.trasladar([0, 250 - anchoBiga / 2, 0]);
		grua.agregarHijo(biga);		
		
		biga = new Biga(webGL, anchoBiga, anchoBiga,  250 - anchoBiga / 2, null, null, imagenes['normalesBiga.png']);
		biga.rotar([1, 0, 0], 90);
		biga.trasladar([0, 250 - anchoBiga / 2, distanciaLados]);
		grua.agregarHijo(biga);		
		
		biga = new Biga(webGL, anchoBiga - 1, anchoBiga - 1, 210, null, null, imagenes['normalesBiga.png']);
		biga.rotar([1, 0, 0], 135);
		biga.trasladar([0, 249, distanciaLados]);
		grua.agregarHijo(biga);			
		
		biga = new Biga(webGL, anchoBiga, anchoBiga, distanciaLados + anchoBiga, null, null, imagenes['normalesBiga.png']);
		biga.trasladar([-distanciaLados, 250, -anchoBiga / 2]);
		grua.agregarHijo(biga);
		
		biga = new Biga(webGL, anchoBiga, anchoBiga, distanciaLados - anchoBiga, null, null, imagenes['normalesBiga.png']);
		biga.trasladar([-distanciaLados, 100, anchoBiga / 2]);
		grua.agregarHijo(biga);		
		
		biga = new Biga(webGL, anchoBiga, anchoBiga, 250 - anchoBiga / 2, null, null, imagenes['normalesBiga.png']);
		biga.rotar([1, 0, 0], 90);
		biga.trasladar([-distanciaLados, 250 - anchoBiga / 2, 0]);
		grua.agregarHijo(biga);		
		
		biga = new Biga(webGL, anchoBiga, anchoBiga,  250 - anchoBiga / 2, null, null, imagenes['normalesBiga.png']);
		biga.rotar([1, 0, 0], 90);
		biga.trasladar([-distanciaLados, 250 - anchoBiga / 2, distanciaLados]);
		grua.agregarHijo(biga);		
		
		biga = new Biga(webGL, anchoBiga - 1, anchoBiga - 1, 210, null, null, imagenes['normalesBiga.png']);
		biga.rotar([1, 0, 0], 45);
		biga.trasladar([-distanciaLados, 249, 0]);
		grua.agregarHijo(biga);		
		
		biga = new Biga(webGL, anchoBiga, anchoBiga, distanciaLados - anchoBiga, null, null, imagenes['normalesBiga.png']);
		biga.rotar([0, 1, 0], 90);
		biga.trasladar([-distanciaLados + anchoBiga / 2, 250, 0]);
		grua.agregarHijo(biga);		
		
		biga = new Biga(webGL, anchoBiga, anchoBiga, distanciaLados - anchoBiga, null, null, imagenes['normalesBiga.png']);
		biga.rotar([0, 1, 0], 90);
		biga.trasladar([-distanciaLados + anchoBiga / 2, 250, distanciaLados]);
		grua.agregarHijo(biga);	

		var textura = imagenes['metalrojo.png'];
		
		biga = new Biga(webGL, anchoBiga, anchoBiga * 3, 600, textura, null, imagenes['normalesMetalRojo.png'], metalRojo);
		biga.trasladar([-distanciaLados / 4  , 250, -100]);
		grua.agregarHijo(biga);
		
		biga = new Biga(webGL, anchoBiga, anchoBiga * 3, 600, textura, null, imagenes['normalesMetalRojo.png'], metalRojo);
		biga.trasladar([-distanciaLados * 0.75, 250, -100]);
		grua.agregarHijo(biga);		
		
		biga = new Biga(webGL, distanciaLados, distanciaLados * 0.6, distanciaLados * 0.6, imagenes['metalnegro.png']);
		biga.trasladar([-distanciaLados * 0.5, 250, -150]);
		grua.agregarHijo(biga);
		
		biga = new Biga(webGL, anchoBiga, anchoBiga * 3, distanciaLados / 2 + anchoBiga, textura, null, imagenes['normalesMetalRojo.png'], metalRojo);
		biga.rotar([0, 1, 0], 90);
		biga.trasladar([-distanciaLados * 0.75 - anchoBiga / 2, 250, 550 + anchoBiga / 2 - 50]);
		biga.adjuntarElemento(luz);
		
		grua.agregarHijo(biga);		
	}
	
	
	function configuracionesAdicionalesProgramaShaderRuedas(programaShaderActual, luzAmbiente, lucesPuntuales, luzDireccional, camara)
	{
		if(!configuradorShaderRuedas[this])
		{
			var posicionesLucesPuntuales = new Array();
			var intensidadesLucesPuntuales = new Array();
			
			for(var i = 0; i < lucesPuntuales.length; i++)
			{
				posicionesLucesPuntuales.push(lucesPuntuales[i].obtenerPosicion());
				intensidadesLucesPuntuales.push(lucesPuntuales[i].obtenerIntensidad());
			}
			
			configuradorShaderRuedas[this] = crearConfiguradorShaderDifuso(	webGL,
																		this.obtenerNormales(),																		
																		luzAmbiente.obtenerIntensidad(),
																		luzDireccional.obtenerIntensidad(),
																		luzDireccional.obtenerDireccion(),
																		intensidadesLucesPuntuales,
																		posicionesLucesPuntuales,
																		caucho.coeficienteEspecular,
																		caucho.coeficienteAmbiente,
																		caucho.factorGlossy,
																		camara.obtenerPosicion());
		}

		configuradorShaderRuedas[this](programaShaderActual, camara.obtenerPosicion(), luzDireccional.obtenerDireccion());
	}
	
	
	function crearParRuedas(offsetX, offsetZ)
	{
		var rueda;
		var datosTexturaRueda = configuracionTextura(imagenes['rueda.png'],
														1024,
														512,
														235,
														[255, 260],
														[[512, 0],[1024, 0]],
														[[512, 512], [1024, 512]],
														true,
														0.5);		
														
		var datosTexturaEjeRueda = configuracionTextura(imagenes['metalnegro.png'],
														1024,
														512,
														256,
														[512, 256],
														[[0, 0],[1024, 0]],
														[[0, 512], [1024, 512]],
														true,
														0.5);
		
		rueda = new Cilindro(webGL, 20, 10, 5, datosTexturaRueda, programasShader['difuso']);
		rueda.agregarHijo(new Cilindro(webGL, 20, radioRuedas, 10, datosTexturaEjeRueda));
		rueda.trasladar([distanciaHorizontalRuedas + offsetX, -distanciaVerticalRuedas, offsetZ]);
		ruedas.push(rueda);
		grua.agregarHijo(rueda);	
		rueda.configuracionesAdicionalesProgramaShader = configuracionesAdicionalesProgramaShaderRuedas.bind(rueda);
		
		rueda = new Cilindro(webGL, 20, 10, 5, datosTexturaRueda, programasShader['difuso']);
		rueda.agregarHijo(new Cilindro(webGL, 20, radioRuedas, 10, datosTexturaEjeRueda));
		rueda.trasladar([-distanciaHorizontalRuedas + offsetX, -distanciaVerticalRuedas, offsetZ]);
		ruedas.push(rueda);
		grua.agregarHijo(rueda);
		rueda.configuracionesAdicionalesProgramaShader = configuracionesAdicionalesProgramaShaderRuedas.bind(rueda);
		
		biga = new Biga(webGL, anchoBiga, anchoBiga, 2 * distanciaHorizontalRuedas + anchoBiga, imagenes['metalrojo.png'], 5, imagenes['normalesMetalRojo.png'], metalRojo);
		biga.rotar([0, 1, 0], 90);
		biga.trasladar([-distanciaHorizontalRuedas - anchoBiga / 2 + offsetX, -anchoBiga / 2, offsetZ]);
		grua.agregarHijo(biga);		
		
		biga = new Biga(webGL, anchoBiga, anchoBiga, distanciaVerticalRuedas - anchoBiga, imagenes['metalrojo.png'], 1, imagenes['normalesMetalRojo.png'], metalRojo);
		biga.rotar([0, 1, 0], 90);
		biga.rotar([0, 0, 1], 90);
		biga.trasladar([- (distanciaHorizontalRuedas + radioRuedas) + anchoBiga / 4 + offsetX, - distanciaVerticalRuedas, offsetZ]);
		grua.agregarHijo(biga);		
		
		biga = new Biga(webGL, anchoBiga, anchoBiga, distanciaVerticalRuedas - anchoBiga, imagenes['metalrojo.png'], 1, imagenes['normalesMetalRojo.png'], metalRojo);
		biga.rotar([0, 1, 0], 90);
		biga.rotar([0, 0, 1], 90);
		biga.trasladar([ (distanciaHorizontalRuedas + radioRuedas) - anchoBiga / 4 + offsetX, - distanciaVerticalRuedas, offsetZ]);
		grua.agregarHijo(biga);		
	}
	
	function crearRuedas()
	{
		radioRuedas = 2;
		distanciaHorizontalRuedas = 20;
		distanciaVerticalRuedas = radioRuedas * 10;
		
		ruedas = new Array();
		
		crearParRuedas(0, 0);
		crearParRuedas(0, distanciaLados);
		crearParRuedas(-distanciaLados, distanciaLados);
		crearParRuedas(-distanciaLados,0);
	}
	
	function moverRuedas(angulo)
	{
		for(var i = 0; i < ruedas.length; i++)
			ruedas[i].rotarAntes([0, 0, 1] , angulo);
	}
	
	function manejarEntrada(entrada)
	{
		cabina.manejarEntrada(entrada);
		
		var direccionDerechaEscalada = vec3.create();
		
		vec3.scale(direccionDerechaEscalada, verticeReferencia.obtenerReferencia(), velocidadDesplazamientoLateral);
		
		var anguloBarrido =  vec3.length(direccionDerechaEscalada) / radioRuedas;
		
		switch(entrada.keyCode)
		{
			case 37:
				if(movimientoCentro <= -distanciaDesplazamientoCentro)
					return;
	
				moverRuedas(-anguloBarrido);
				grua.trasladar(direccionDerechaEscalada);
				movimientoCentro -= velocidadDesplazamientoLateral;
				return;
			case 39:
				if(movimientoCentro >= distanciaDesplazamientoCentro)
					return;
				moverRuedas(anguloBarrido);
				vec3.scale(direccionDerechaEscalada, direccionDerechaEscalada, -1);
				grua.trasladar(direccionDerechaEscalada);
				movimientoCentro += velocidadDesplazamientoLateral;
				return;
		}			
	}
	
	function manejarEntradaCabina(entrada)
	{		
		var direccionFrontalEscalada = vec3.create();
		vec3.scale(direccionFrontalEscalada, verticeReferenciaCabina.obtenerReferencia(), velocidadDesplazamientoCabina);
		
		garra.manejarEntrada(entrada);
		
		switch(entrada.keyCode)
		{
			case 38:
				if(movimientoCabina >= 250)
					return;
	
				cabina.trasladarAntes(direccionFrontalEscalada);
				movimientoCabina += velocidadDesplazamientoCabina;
				return;
			case 40:
				if(movimientoCabina <= -250)
					return;

				vec3.scale(direccionFrontalEscalada, direccionFrontalEscalada, -1);
				cabina.trasladarAntes(direccionFrontalEscalada);
				movimientoCabina -= velocidadDesplazamientoCabina;
				return;
		}
	}
	
	function escalarTensores()
	{
		for(var i = 0; i < tensores.length; i++)
		{
			tensores[i].reiniciarPosicion();
			tensores[i].trasladar([0, 0, distanciaGarraPiso/2]);
			tensores[i].escalar([1, 1, escalaTensores]);			
			tensores[i].rotar([1, 0, 0], 90);
			tensores[i].trasladar([0, distanciaGarraPiso*escalaTensores - anchoBiga/3, distanciaLados * 0.17 * (1 + i*2)]);	
		}
	}
	
	function chequearContenedoresCercanos()
	{
		var masCercano = false;
		var distanciaCercano = 1000;		
		
		var distanciaContenedorGarra;
		var posicionGarra = verticeReferenciaEnganche.obtenerReferencia();
		var aux = vec3.create();
		
		for(var i = 0; i < contenedores.length; i++)
		{
			vec3.sub(aux, posicionGarra, contenedores[i].obtenerPosicion());
			distanciaContenedorGarra = vec3.length(aux);
			
			if(distanciaContenedorGarra <= 20 && distanciaContenedorGarra < distanciaCercano)
			{
				distanciaCercano = distanciaContenedorGarra;
				masCercano = i;
			}
		}
		return masCercano;
	}
	
	function manejarEntradaGarra(entrada)
	{		
		var direccionGarra = vec3.create();
		vec3.scale(direccionGarra, verticeReferenciaGarra.obtenerReferencia(), velocidadDesplazamientoGarra);
		
		switch(entrada.keyCode)
		{
			case 79:
				if(movimientoGarra <= 0)
					return;
	
				garra.trasladar(direccionGarra);
				movimientoGarra -= velocidadDesplazamientoGarra;
				escalaTensores -=  pasoEscalaTensores*velocidadDesplazamientoGarra;
				escalarTensores();
				return;
			case 76:
				if(movimientoGarra >= distanciaGarraPiso)
					return;

				vec3.scale(direccionGarra, direccionGarra, -1);
				garra.trasladar(direccionGarra);
				movimientoGarra += velocidadDesplazamientoGarra;
				escalaTensores +=  pasoEscalaTensores*velocidadDesplazamientoGarra;
				escalarTensores();
				return;
			case 13:
				if(indiceContenedorEnganchado == -1)
				{
					var contenedorCercano = chequearContenedoresCercanos();
					if(contenedorCercano !== false)
					{
						contenedorEnganchado = contenedores.splice(contenedorCercano, 1)[0];
						contenedorEnganchado.reiniciarPosicion();
						contenedorEnganchado.trasladar([0, -anchoBiga * 3.5, 0]);
						indiceContenedorEnganchado = garra.agregarHijo(contenedorEnganchado);
					}
				}	
				else
				{
					var referencia = verticeReferenciaEnganche.obtenerReferencia();
					
					garra.borrarHijo(indiceContenedorEnganchado);
					contenedores.push(contenedorEnganchado);
					contenedorEnganchado.trasladar([referencia[0], referencia[1], referencia[2] - distanciaLados * 0.35]);
					contenedorEnganchado.asignarReferencia(verticeReferenciaEnganche.copiar());
					indiceContenedorEnganchado = -1;
				}
				return;
		}
	}
	
	function crearCabina()
	{
		var textura = imagenes['chapa.png'];
		
		cabina = new Objeto3D(webGL, 1, 1);
		cabina.construir();
		cabina.adjuntarElemento(camara);
		cabina.adjuntarElemento(luz);
		camara.configurarPosicion(vec3.fromValues(0, 30, 50));
		cabina.adjuntarElemento(verticeReferenciaEnganche);
		
		verticeReferenciaCabina = new Referencia(vec3.fromValues(0, 0, 1), true);
		cabina.adjuntarElemento(verticeReferenciaCabina);
		
		biga = new BigaReflejante(webGL, distanciaLados * 0.6, distanciaLados * 0.6, anchoBiga / 3, textura, null, imagenes['normalesBigaReflejante.png'], metalReflejante);
		cabina.agregarHijo(biga);				
		
		/*Techo*/
		biga = new BigaReflejante(webGL, distanciaLados * 0.6, distanciaLados * 0.5, anchoBiga / 3, textura, null, imagenes['normalesBigaReflejante.png'], metalReflejante);
		biga.trasladar([0 , distanciaLados * 0.2 + anchoBiga*1.27 , - distanciaLados * 0.3]);
		biga.rotar([1, 0, 0], 90);
		cabina.agregarHijo(biga);			
		
		/*Abajo derecha*/
		biga = new BigaReflejante(webGL, anchoBiga, distanciaLados * 0.3, anchoBiga, textura, null, imagenes['normalesBigaReflejante.png'], metalReflejante);
		biga.trasladar([distanciaLados * 0.3 - anchoBiga / 2, distanciaLados * 0.35, distanciaLados * 0.3]);
		biga.rotar([1, 0, 0], 90);
		cabina.agregarHijo(biga);		
		
		/*Abajo izquierda*/
		biga = new BigaReflejante(webGL, anchoBiga, distanciaLados * 0.3, anchoBiga, textura, null, imagenes['normalesBigaReflejante.png'], metalReflejante);
		biga.trasladar([-  distanciaLados * 0.3 + anchoBiga / 2, distanciaLados * 0.35, distanciaLados * 0.3]);
		biga.rotar([1, 0, 0], 90);
		cabina.agregarHijo(biga);		
		
		/*Panel de arriba enfrente*/
		biga = new BigaReflejante(webGL, distanciaLados * 0.6, distanciaLados * 0.2, anchoBiga / 3, textura, null, imagenes['normalesBigaReflejante.png'], metalReflejante);
		biga.trasladar([0, distanciaLados * 0.2 - anchoBiga * (0.33) , distanciaLados * 0.3 + distanciaLados * 0.2]);
		cabina.agregarHijo(biga);			
		
		/*Piso*/
		biga = new BigaReflejante(webGL, distanciaLados * 0.6, distanciaLados * 0.2, anchoBiga, textura, null, imagenes['normalesBigaReflejante.png'], metalReflejante);
		biga.trasladar([0, distanciaLados * 0.2 - distanciaLados * 0.1, distanciaLados * 0.3]);
		biga.rotar([1, 0, 0], 90);
		cabina.agregarHijo(biga);	

		biga = new BigaReflejante(webGL, distanciaLados * 0.6 - anchoBiga/3, distanciaLados * 0.2 - anchoBiga/3, anchoBiga/3, textura, null, imagenes['normalesBigaReflejante.png'], metalReflejante);
		biga.rotar([0, 0, 1], 90);
		biga.rotar([0, 1, 0], 90);
		biga.trasladar([distanciaLados * 0.3 - anchoBiga/3, - anchoBiga*0.166, distanciaLados * 0.1 + anchoBiga / 6]);
		cabina.agregarHijo(biga);		
		
		biga = new BigaReflejante(webGL, distanciaLados * 0.6 - anchoBiga/3, distanciaLados * 0.2 - anchoBiga/3, anchoBiga/3, textura, null, imagenes['normalesBigaReflejante.png'], metalReflejante);
		biga.rotar([0, 0, 1], 90);
		biga.rotar([0, 1, 0], 90);
		biga.trasladar([- distanciaLados * 0.3, - anchoBiga*0.166, distanciaLados * 0.1 + anchoBiga / 6]);
		cabina.agregarHijo(biga);		

		/*Travesaño derecho*/
		biga = new BigaReflejante(webGL, anchoBiga, distanciaLados * 0.4 + anchoBiga*0.66, anchoBiga / 3, textura, null, imagenes['normalesBigaReflejante.png'], metalReflejante);
		biga.trasladar([distanciaLados * 0.3 - anchoBiga/2, - distanciaLados * 0.1 - anchoBiga*0.66,  distanciaLados * 0.3 + distanciaLados * 0.2]);
		cabina.agregarHijo(biga);			
		
		/*Travesaño izquierdo*/
		biga = new BigaReflejante(webGL, anchoBiga, distanciaLados * 0.4 + anchoBiga*0.66, anchoBiga / 3, textura, null, imagenes['normalesBigaReflejante.png'], metalReflejante);
		biga.trasladar([- distanciaLados * 0.3 + anchoBiga/2, - distanciaLados * 0.1 - anchoBiga*0.66,  distanciaLados * 0.3 + distanciaLados * 0.2]);
		cabina.agregarHijo(biga);		

		/*Travesaño inferior*/
		biga = new BigaReflejante(webGL, distanciaLados * 0.6 - anchoBiga*2, anchoBiga, anchoBiga / 3, textura, null, imagenes['normalesBigaReflejante.png'], metalReflejante);
		biga.trasladar([0, - distanciaLados * 0.3 - anchoBiga / 2, distanciaLados * 0.3 + distanciaLados * 0.2]);
		cabina.agregarHijo(biga);
		
		grua.agregarHijo(cabina);
		cabina.trasladar([-distanciaLados / 2, distanciaLados + anchoBiga * 6, 200]);
	}
	
	function configuracionesAdicionalesProgramaShaderTensores(programaShaderActual, luzAmbiente, lucesPuntuales, luzDireccional, camara)
	{
		if(!configuradorShaderTensores[this])
		{
			var posicionesLucesPuntuales = new Array();
			var intensidadesLucesPuntuales = new Array();
			
			for(var i = 0; i < lucesPuntuales.length; i++)
			{
				posicionesLucesPuntuales.push(lucesPuntuales[i].obtenerPosicion());
				intensidadesLucesPuntuales.push(lucesPuntuales[i].obtenerIntensidad());
			}
			
			configuradorShaderTensores[this] = crearConfiguradorShaderDifuso(	webGL,
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
		configuradorShaderTensores[this](programaShaderActual, camara.obtenerPosicion(), luzDireccional.obtenerDireccion());
		
	}
	
	function crearGarra()
	{
		tensores = new Array();
		garra = new Objeto3D(webGL, 1, 1);
		garra.construir();
		
		var textura = imagenes['metalrojo.png'];
		var texturaMetalNegro = imagenes['metalnegro.png'] ;
			
		verticeReferenciaGarra = new Referencia(vec3.fromValues(0, 1, 0), true);
		garra.adjuntarElemento(verticeReferenciaGarra);	
		
		biga = new Biga(webGL, anchoBiga * 4, anchoBiga, distanciaLados * 0.7, textura, null, imagenes['normalesMetalRojo.png'], metalRojo);
		garra.agregarHijo(biga);	
		
		biga = new Biga(webGL, anchoBiga / 3, anchoBiga / 3, anchoBiga, textura, null, imagenes['normalesMetalRojo.png'], metalRojo);
		biga.rotar([1, 0, 0], 90);
		biga.trasladar([ anchoBiga * 1.83 - 0.25, - anchoBiga / 2, distanciaLados * 0.7 - anchoBiga / 6 - 0.25]);
		garra.agregarHijo(biga);			
		
		biga = new Biga(webGL, anchoBiga / 3, anchoBiga / 3, anchoBiga, textura, null, imagenes['normalesMetalRojo.png'], metalRojo);
		biga.rotar([1, 0, 0], 90);
		biga.trasladar([ anchoBiga *1.83 - 0.25, - anchoBiga / 2, anchoBiga / 6 + 0.25]);
		garra.agregarHijo(biga);	
		
		biga = new Biga(webGL, anchoBiga / 3, anchoBiga / 3, anchoBiga, textura, null, imagenes['normalesMetalRojo.png'], metalRojo);
		biga.rotar([1, 0, 0], 90);
		biga.trasladar([ -anchoBiga * 1.83 + 0.25, - anchoBiga / 2, distanciaLados * 0.7 - anchoBiga / 6 - 0.25]);
		garra.agregarHijo(biga);			
		
		biga = new Biga(webGL, anchoBiga / 3, anchoBiga / 3, anchoBiga, textura, null, imagenes['normalesMetalRojo.png'], metalRojo);
		biga.rotar([1, 0, 0], 90);
		biga.trasladar([ -anchoBiga * 1.83 + 0.25, - anchoBiga / 2, anchoBiga / 6 + 0.25]);
		garra.agregarHijo(biga);
		
		biga = new Biga(webGL, anchoBiga * 4, anchoBiga / 3, anchoBiga / 3, texturaMetalNegro, null, imagenes['normalesMetalRojo.png'], metalRojo);
		biga.trasladar([0, anchoBiga * 0.66, distanciaLados * 0.16]);
		garra.agregarHijo(biga);			
		
		biga = new Biga(webGL, anchoBiga * 4, anchoBiga / 3, anchoBiga / 3, texturaMetalNegro, null, imagenes['normalesMetalRojo.png'], metalRojo);
		biga.trasladar([0, anchoBiga * 0.66, distanciaLados * 0.5]);
		garra.agregarHijo(biga);
		
		var datosTexturaTensor = configuracionTextura(	imagenes['tensor.png'],
														1024,
														256,
														235,
														[255, 260],
														[[0, 0],[1024, 0]],
														[[0, 256], [1024, 256]],
														true,
														0.1);		
		
		biga = new Cilindro(webGL, 10, 1, distanciaGarraPiso, datosTexturaTensor, programasShader['difuso']);
		garra.agregarHijo(biga);
		tensores.push(biga);	
		biga.configuracionesAdicionalesProgramaShader = configuracionesAdicionalesProgramaShaderTensores.bind(biga);
		
		biga = new Cilindro(webGL, 10, 1, distanciaGarraPiso, datosTexturaTensor, programasShader['difuso']);	
		garra.agregarHijo(biga);
		tensores.push(biga);
		biga.configuracionesAdicionalesProgramaShader = configuracionesAdicionalesProgramaShaderTensores.bind(biga)
				
		escalarTensores();		
		
		garra.rotar([0, 1, 0], 90);
		garra.adjuntarElemento(verticeReferenciaEnganche);
		garra.trasladar([-distanciaLados * 0.35, -distanciaLados * 0.4, distanciaLados * 0.15]);

		cabina.agregarHijo(garra);			
	}
	
	function inicializar()
	{
		configuradorShaderRuedas = new Array();
		configuradorShaderTensores = new Array();
		
		anchoBiga = 8;
		distanciaLados = 150;
		
		contenedorEnganchado = -1;
		indiceContenedorEnganchado = -1;
		
		verticeReferenciaEnganche = new Referencia(vec3.fromValues(distanciaLados * 0.35, 0, 0));		
		
		escalaTensores = 0.1;
		distanciaGarraPiso = 150;		
		movimientoCentro = 0;
		movimientoCabina = 0;
		movimientoGarra = 0;
		pasoEscalaTensores = 1 / distanciaGarraPiso;
		
		if(!distanciaDesplazamientoCentro)
			distanciaDesplazamientoCentro = 100;
		else
			distanciaDesplazamientoCentro = Math.abs(distanciaDesplazamientoCentro);
			
		if(!velocidadDesplazamientoLateral)
			velocidadDesplazamientoLateral = 10;	
			
		if(!velocidadDesplazamientoCabina)
			velocidadDesplazamientoLateral = 10;
			
		if(!velocidadDesplazamientoGarra)
			velocidadDesplazamientoGarra = 10;
			
		crearEstructura();
		crearRuedas();
		crearCabina();
		crearGarra();
		
		funcionDibujarOriginal = grua.dibujar.bind(grua);
		funcionActualizarOriginal = grua.actualizar.bind(grua);
		
		grua.manejarEntrada = manejarEntrada;
		cabina.manejarEntrada = manejarEntradaCabina;
		garra.manejarEntrada = manejarEntradaGarra;
		
		grua.adjuntarElemento(camara);
		grua.adjuntarElemento(luz);
	}
	inicializar();

	return grua;
}