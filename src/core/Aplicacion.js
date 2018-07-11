imagenes = new Array();
programasShader = new Array();

Aplicacion = function(idLienzo)
{
	var lienzo = null;
	var webGL = null;
	var elementos = null;
	var tiempoAnterior = null;
	var tiempoInicial;
	
	var camaras = null;
	var camaraActual = null;
	var matrizMovimiento = null;
	
	var lucesPuntuales;
	var luzDireccional;
	var luzAmbiente;
	
	var contenedores;
	var cantidadImagenesCargadas;
	var cantidadImagenesACargar;
	
	function configurarPerspectiva()
	{
		var viewport = webGL.getParameter(webGL.VIEWPORT);
	}
	
	function actualizarEscena(deltaT)
	{
		camaraActual.actualizar(deltaT);
		
		for(var i = 0; i < elementos.length; i++)
			elementos[i].actualizar(webGL, deltaT);
	}
	
	
	function dibujarEscena(tiempo)
	{				
		var matrizVista = camaraActual.obtenerMatrizVista();
		var matrizPerspectiva = camaraActual.obtenerMatrizPerspectiva();
		var matrizVistaPerspectiva = mat4.create();
		mat4.multiply(matrizVistaPerspectiva, matrizPerspectiva, matrizVista);
			
		webGL.clear(webGL.COLOR_BUFFER_BIT | webGL.DEPTH_BUFFER_BIT);
	
		for(var i = 0; i < elementos.length; i++)
			elementos[i].dibujar(webGL, matrizMovimiento, matrizVista, matrizVistaPerspectiva, luzAmbiente, lucesPuntuales, luzDireccional, camaraActual, tiempo);
	}
	
	
	function manejadorEntrada(entrada)
	{
		var posicionSol;
		var posicion;
		
		switch(entrada.keyCode)
		{
			case 49:
				camaraActual = camaras[0];
				return;
			case 50:
				camaraActual = camaras[1];
				return;
			case 51:
				camaraActual = camaras[2];
				return;			
		}
		
		camaraActual.manejarEntrada(entrada);
		
		for(var i = 0 ; i < elementos.length; i++)
			elementos[i].manejarEntrada(entrada);
	}
	
	function callbackCuadro()
	{			
		var tiempoActual = ((new Date()).getTime() - tiempoInicial) / 1000;
			
		actualizarEscena(tiempoActual);
		dibujarEscena(tiempoActual);
		window.requestAnimationFrame(callbackCuadro);
	}
	
	function correr()
	{
		window.requestAnimationFrame(callbackCuadro);
		window.onkeydown = manejadorEntrada;
		window.onmousemove = manejadorEntrada;
		window.onmousedown = manejadorEntrada;
		window.onmouseup = manejadorEntrada;
	}
	
	this.obtenerHandlerWebGL = function()
	{
		return webGL;
	}
	
	function crearElementos()
	{
		contenedores = new Array();
		
		contenedores.push(new Contenedor(webGL, 32, 48, 105));
		contenedores.push(new Contenedor(webGL, 32, 48, 105));
		contenedores.push(new Contenedor(webGL, 32, 48, 105));
		contenedores.push(new Contenedor(webGL, 32, 48, 105));
		contenedores.push(new Contenedor(webGL, 32, 48, 105));
		contenedores.push(new Contenedor(webGL, 32, 48, 105));
		contenedores.push(new Contenedor(webGL, 32, 48, 105));
		contenedores.push(new Contenedor(webGL, 32, 48, 105));
		contenedores.push(new Contenedor(webGL, 32, 48, 105));		
		contenedores.push(new Contenedor(webGL, 32, 48, 105));
		contenedores.push(new Contenedor(webGL, 32, 48, 105));
		contenedores.push(new Contenedor(webGL, 32, 48, 105));
		
		contenedores[0].trasladar([180, 34, 450]);
		contenedores[1].trasladar([180, 34, 575]);
		contenedores[2].trasladar([180, 34, 700]);
		contenedores[3].trasladar([180, 34, 825]);
		
		contenedores[4].trasladar([240, 34, 680]);
		contenedores[5].trasladar([240, 34, 790]);		
		
		contenedores[6].trasladar([240, 82, 680]);
		contenedores[7].trasladar([240, 82, 790]);
		
		contenedores[8].trasladar([580, 64, 350]);	
		contenedores[9].trasladar([580, 112, 350]);
		contenedores[10].trasladar([528, 64, 350]);
		
		contenedores[11].trasladar([180, 82, 575]);		
		
		var grua = new Grua(webGL, contenedores, camaras[1], lucesPuntuales[0], 5, 5, 5, 250);
		var barco = new BarcoCarguero(webGL, 20, 200);
		var isla = new Isla(webGL, 50, 50);
		var muelleCarga = new MuelleCarga(webGL, 400, 1000);
		var agua = new Agua(webGL, 100, 100);
		var cielo = new Cielo(webGL, 100, 100);
		
		var poste1 = new PosteLuz(webGL, 20, 20);
		poste1.rotar([1, 0, 0], -90);
		poste1.trasladar([320, 45, 300]);		
		
		var poste2 = new PosteLuz(webGL, 20, 20);
		poste2.rotar([1, 0, 0], -90);
		poste2.trasladar([320, 45, 900]);

		
		
		cielo.rotar([0, 1, 0], 45);
		
		isla.trasladar([0, 1080, -1350]);

		agua.rotar([1, 0, 0], 90);
		agua.escalar([200, 1, 210]);
		agua.trasladar([-10000, -30, -10000]);		
				
		barco.rotar([0, 0, 1], -90);
		barco.rotar([0, 1, 0], 90);
		barco.trasladar([500, 50, 200]);
		
		grua.rotar([0, 1, 0], 90);
		grua.trasladar([150, 40, 550]);
		
		elementos.push(grua);
		elementos.push(barco);
		elementos.push(isla);
		elementos.push(muelleCarga);
		elementos.push(agua);
		elementos.push(cielo);
		elementos.push(poste1);
		elementos.push(poste2);
		
		elementos.push(contenedores[0]);
		elementos.push(contenedores[1]);
		elementos.push(contenedores[2]);
		elementos.push(contenedores[3]);
		elementos.push(contenedores[4]);
		elementos.push(contenedores[5]);
		elementos.push(contenedores[6]);
		elementos.push(contenedores[7]);
		elementos.push(contenedores[8]);
		elementos.push(contenedores[9]);
		elementos.push(contenedores[10]);
		elementos.push(contenedores[11]);
	}
	
	function ajustarLienzo(lienzo) 
	{  
		var ancho  = lienzo.clientWidth;
		var alto = lienzo.clientHeight;


		if (lienzo.width  != ancho || lienzo.height != alto) 
		{
			lienzo.width  = ancho;
			lienzo.height = alto;
		}
	}
	
	function cargarProgramasShader()
	{
		programasShader['difuso'] =  new ProgramaShader(webGL, new ShaderVertices(webGL, 'shaderVerticesDifusos'), new ShaderFragmentos(webGL, 'shaderFragmentosDifusos'));
		programasShader['difusoMapaNormales'] =  new ProgramaShader(webGL, new ShaderVertices(webGL, 'shaderVerticesDifusosMapaNormales'), new ShaderFragmentos(webGL, 'shaderFragmentosDifusosMapaNormales'));
		programasShader['difusoMapaNormalesReflejo'] =  new ProgramaShader(webGL, new ShaderVertices(webGL, 'shaderVerticesDifusosMapaNormalesReflejo'), new ShaderFragmentos(webGL, 'shaderFragmentosDifusosMapaNormalesReflejo'));
		programasShader['difusoReflejo'] =  new ProgramaShader(webGL, new ShaderVertices(webGL, 'shaderVerticesDifusosReflejo'), new ShaderFragmentos(webGL, 'shaderFragmentosDifusosReflejo'));
		programasShader['agua'] =  new ProgramaShader(webGL, new ShaderVertices(webGL, 'shaderVerticesAgua'), new ShaderFragmentos(webGL, 'shaderFragmentosAgua'));
	}
	
	function inicializar()
	{		
		tiempoInicial = (new Date()).getTime();
		lucesPuntuales = new Array();
		lucesPuntuales.push(new LuzPuntual(vec3.fromValues(0, -75, 70), vec3.fromValues(0.15, 0, 0)));
		lucesPuntuales.push(new LuzPuntual(vec3.fromValues(320, 100, 900), vec3.fromValues(0.25, 0.25, 0.25)));
		lucesPuntuales.push(new LuzPuntual(vec3.fromValues(320, 100, 300), vec3.fromValues(0.25, 0.25, 0.25)));
		lucesPuntuales.push(new LuzPuntual(vec3.fromValues(-453, 1000, -1100), vec3.fromValues(1, 0.15, 0)));
		
		luzDireccional = new LuzDireccional(vec3.fromValues(-0.667, -0.667, -0.333), vec3.fromValues(1, 0.6, 0.08));
		
		luzAmbiente = new LuzAmbiente(vec3.fromValues(0.1, 0.1, 0.1));
		
		matrizMovimiento = mat4.create();	
		mat4.translate(matrizMovimiento, matrizMovimiento, [0,0,0]);
		
		camaras = new Array();
		camaraActual = new CamaraOrbital([759, 1000, 1263], [-0.5716, -0.144, -0.8078], 100);
		camaras.push(camaraActual);
		camaras.push(new CamaraCabina([0, 0, 0], [0, 0, 0]));
		camaras.push(new CamaraPrimeraPersona([331, 34, 172], [331, 34, 173]));
		
		lienzo = document.getElementById(idLienzo);  
		elementos = new Array();
		
		if(!lienzo)
			return false;
			
		try
		{
			webGL = lienzo.getContext("webgl");
		}
		catch(e)
		{
		}
						
		if(!webGL)
			return false;
			
		cargarProgramasShader();
				
		ajustarLienzo(lienzo);
			
		webGL.clearColor(0.1, 0.1, 0.2, 1.0);     
		webGL.enable(webGL.DEPTH_TEST);                              
		webGL.depthFunc(webGL.LEQUAL); 
		webGL.clear(webGL.COLOR_BUFFER_BIT | webGL.DEPTH_BUFFER_BIT);
		
		webGL.viewport(0, 0, lienzo.width, lienzo.height);
		
		tiempoAnterior = (new Date()).getTime();
		configurarPerspectiva();
		crearElementos();
	}
	
	function cargarImagenes()
	{
		cantidadImagenesCargadas = 0;
		cantidadImagenesACargar = 0
		
		function aumentarImagenesCargadas()
		{
			cantidadImagenesCargadas++;
			if(cantidadImagenesCargadas == cantidadImagenesACargar)
			{
				inicializar();
				correr();
			}
		}
		
		cantidadImagenesACargar++;
		var imagen = new Image();
		imagen.src = 'texturas/normalesConcreto.png';
		imagenes['normalesConcreto.png'] = imagen;
		imagen.onload = aumentarImagenesCargadas;	
		
		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/pilar.png';
		imagenes['pilar.png'] = imagen;
		imagen.onload = aumentarImagenesCargadas;	

		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/concreto.png';
		imagenes['concreto.png'] = imagen;
		imagen.onload = aumentarImagenesCargadas;		
		
		
		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/lava.png';
		imagenes['lava.png'] = imagen;
		imagen.onload = aumentarImagenesCargadas;		
		
		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/volcan.png';
		imagenes['volcan.png'] = imagen;
		imagen.onload = aumentarImagenesCargadas;		
		
		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/cielo2.png';
		imagenes['cielo2.png'] = imagen;
		imagen.onload = aumentarImagenesCargadas;		
		
		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/arena.png';
		imagenes['arena.png'] = imagen;
		imagen.onload = aumentarImagenesCargadas;		
		
		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/agua.jpg';
		imagenes['agua.jpg'] = imagen;
		imagen.onload = aumentarImagenesCargadas;		
		
		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/pisobarco.png';
		imagenes['pisobarco.png'] = imagen;
		imagen.onload = aumentarImagenesCargadas;		
		
		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/oxido.png';
		imagenes['oxido.png'] = imagen;
		imagen.onload = aumentarImagenesCargadas;	

		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/biga.png';
		imagenes['biga.png'] = imagen;
		imagen.onload = aumentarImagenesCargadas;		
		
		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/metalrojo.png';
		imagenes['metalrojo.png'] = imagen;
		imagen.onload = aumentarImagenesCargadas;		
		
		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/metalnegro.png';
		imagenes['metalnegro.png'] = imagen;
		imagen.onload = aumentarImagenesCargadas;		
		
		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/rueda.png';
		imagenes['rueda.png'] = imagen;
		imagen.onload = aumentarImagenesCargadas;		
		
		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/chapa.png';
		imagenes['chapa.png'] = imagen;
		imagen.onload = aumentarImagenesCargadas;		
		
		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/tensor.png';
		imagenes['tensor.png'] = imagen;
		imagen.onload = aumentarImagenesCargadas;			
		
		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/posteLuz.png';
		imagenes['posteLuz.png'] = imagen;
		imagen.onload = aumentarImagenesCargadas;		
		
		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/contenedor0.jpg';
		imagenes['contenedor0.jpg'] = imagen;
		imagen.onload = aumentarImagenesCargadas;		
		
		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/contenedor1.jpg';
		imagenes['contenedor1.jpg'] = imagen;
		imagen.onload = aumentarImagenesCargadas;		
		
		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/contenedor2.jpg';
		imagenes['contenedor2.jpg'] = imagen;
		imagen.onload = aumentarImagenesCargadas;

		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/puentebarco.png';
		imagenes['puentebarco.png'] = imagen;
		imagen.onload = aumentarImagenesCargadas;			
		
		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/normalesArena.png';
		imagenes['normalesArena.png'] = imagen;
		imagen.onload = aumentarImagenesCargadas;		

		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/normalesBiga.png';
		imagenes['normalesBiga.png'] = imagen;
		imagen.onload = aumentarImagenesCargadas;			
		
		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/normalesMetalRojo.png';
		imagenes['normalesMetalRojo.png'] = imagen;
		imagen.onload = aumentarImagenesCargadas;			
		
		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/normalesBigaReflejante.png';
		imagenes['normalesBigaReflejante.png'] = imagen;
		imagen.onload = aumentarImagenesCargadas;	
		
		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/posx.png';
		imagenes['posx.png'] = imagen;
		imagen.onload = aumentarImagenesCargadas;	
		
		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/negx.png';
		imagenes['negx.png'] = imagen;
		imagen.onload = aumentarImagenesCargadas;			
		
		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/posy.png';
		imagenes['posy.png'] = imagen;
		imagen.onload = aumentarImagenesCargadas;	
		
		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/negy.png';
		imagenes['negy.png'] = imagen;
		imagen.onload = aumentarImagenesCargadas;			
		
		
		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/posz.png';
		imagenes['posz.png'] = imagen;
		imagen.onload = aumentarImagenesCargadas;	
		
		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/negz.png';
		imagenes['negz.png'] = imagen;
		imagen.onload = aumentarImagenesCargadas;		
		
		cantidadImagenesACargar++;
		imagen = new Image();
		imagen.src = 'texturas/agua2.jpg';
		imagenes['agua2.jpg'] = imagen;
		imagen.onload = aumentarImagenesCargadas;


	}
	cargarImagenes();
}