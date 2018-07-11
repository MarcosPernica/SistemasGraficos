var CamaraOrbital = function(posicionInicial, objetivoVision, velocidadMovimiento, velocidadZoom, dimensionViewport)
{
	var puntoVision;
	var posicion;
	
	var posicionMouse;
	var estaAgarrando;
	
	var direccionVision;
	var arriba;
	var radio;
	
	var anguloPhi = 0;
	var anguloTeta = 0;
	
	var constanteRadianes;
	var matrizPerspectiva;
	var anguloZoom;
	var constanteRadianes;

	function crearPerspectiva()
	{
		mat4.perspective(	matrizPerspectiva, 
							anguloVision * constanteRadianes,
							dimensionViewport[0] / dimensionViewport[1],
							0.1,
							50000);
	}
	
	function inicializar()
	{
		if(!velocidadMovimiento)
			velocidadMovimiento = 10;		
			
		if(!velocidadZoom)
			velocidadZoom = 20;
			
		if(!dimensionViewport)
			dimensionViewport = new Array(800, 600);
			
		constanteRadianes = 2 * Math.PI / 360;
		anguloVision = 45;
		matrizPerspectiva = mat4.create();
		crearPerspectiva();
		
		constanteRadianes = 2 * Math.PI / 360;
		arriba = vec3.fromValues(0, 1, 0);			
		direccionVision = vec3.fromValues(0, 0, 1);
		origen = vec3.create();			
		
		puntoVision = vec3.create();
		posicion = vec3.fromValues(posicionInicial[0], posicionInicial[1], posicionInicial[2]);
		
		posicionMouse = new Array(0, 0);
		estaAgarrando = false;
		
		radio = vec3.distance(objetivoVision, posicion);
		
		if(objetivoVision)
		{
			puntoVision[0] = objetivoVision[0];
			puntoVision[1] = objetivoVision[1];
			puntoVision[2] = objetivoVision[2];
			
			vec3.sub(direccionVision, objetivoVision, posicion);
			vec3.normalize(direccionVision, direccionVision);
			
			anguloPhi = Math.acos(posicionInicial[1] / radio);
			anguloTeta = Math.acos(posicionInicial[0] / (radio * Math.sin(anguloPhi))) * (1 / constanteRadianes);
			anguloPhi *= 1 / constanteRadianes; 
			
			if(posicionInicial[2] < 0)
				anguloTeta = 360 - anguloTeta;
		}
	}
	inicializar();
	
	this.obtenerMatrizVista = function()
	{
		var matrizVista = mat4.create();
		mat4.lookAt(matrizVista, posicion, puntoVision, arriba);
		
		return matrizVista;
	}
	
	this.obtenerMatrizPerspectiva = function()
	{
		return matrizPerspectiva;
	}
	
	this.obtenerPosicion = function()
	{
		return posicion;
	}
	
	this.actualizar = function(deltaT)
	{
		var anguloPhiRadianes = anguloPhi * constanteRadianes;
		var anguloTetaRadianes = anguloTeta * constanteRadianes;
		
		posicion[0] = radio * Math.sin(anguloPhiRadianes) * Math.cos(anguloTetaRadianes);
		posicion[1] = radio * Math.cos(anguloPhiRadianes);
		posicion[2] = radio * Math.sin(anguloPhiRadianes) * Math.sin(anguloTetaRadianes);
	}
	
	function manejarTeclas(entrada)
	{				
		switch(entrada.keyCode)
		{
			case 107:
				radio -= velocidadZoom;
				return true;
			case 109:
				radio += velocidadZoom;
				return true;	
		}
		
		return false;
	}
	
	function ajustarIntervalosAngulos()
	{
		anguloTeta = anguloTeta % 360;
		
		anguloPhi = anguloPhi;
		
		if(anguloPhi <= 0)
			anguloPhi = 0.1;
		else if(anguloPhi >= 180)
			anguloPhi = 179;		
	}
	
	function manejarMouse(entrada)
	{
		if(	entrada.clientX === undefined || 
			entrada.clientY === undefined || 
			entrada.target === undefined || 
			entrada.target.clientWidth === undefined ||
			entrada.target.clientHeight === undefined)
			return;
			
		if(entrada.type == 'mousemove' && !estaAgarrando)
			return;
		else if(entrada.type == 'mousedown')
		{
			document.body.setAttribute("class", "agarrando");
			document.body.offsetHeight;
			
			estaAgarrando = true;
			posicionMouse[0] = entrada.clientX;
			posicionMouse[1] = entrada.clientY;
			
			return;
		}
		else if(entrada.type == 'mouseup')
		{
			document.body.setAttribute("class", "soltando");
			document.body.offsetHeight;
			
			estaAgarrando = false;
		}
		
		var mediaDistanciaX = entrada.target.clientWidth / 2;
		var mediaDistanciaY = entrada.target.clientHeight / 2;
		
		var velocidadPorPixel = 200 / Math.max(mediaDistanciaX, mediaDistanciaY);
		
		anguloTeta += (entrada.clientX - posicionMouse[0]) * velocidadPorPixel;
		anguloPhi -= (entrada.clientY - posicionMouse[1]) * velocidadPorPixel;

		posicionMouse[0] = entrada.clientX;
		posicionMouse[1] = entrada.clientY;
		
		ajustarIntervalosAngulos();
	}
	
	this.manejarEntrada = function(entrada)
	{	
		if(manejarTeclas(entrada))
			return;
		
		manejarMouse(entrada);
	}
}