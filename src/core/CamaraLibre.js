var CamaraLibre = function(posicionInicial, objetivoVision, velocidadMovimiento, velocidadZoom, dimensionViewport, fov)
{
	var puntoVision;
	var posicion;
	
	var posicionMouse;
	var estaAgarrando;
	
	var direccionVision;
	var direccionLateral;
	var arriba;
	
	var movimientoHabilitado;
	
	var anguloPhi = 0;
	var anguloTeta = 0;
	
	var constanteRadianes;
	var matrizPerspectiva;
	var anguloZoom;
	var constanteRadianes;
	var matrizPosicion;
	
	var primeraPersonaActiva;

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
			velocidadZoom = 5;
			
		if(!dimensionViewport)
			dimensionViewport = new Array(800, 600);
			
		primeraPersonaActiva = false;			
		matrizPosicion = mat4.create();
		movimientoHabilitado = true;			
		constanteRadianes = 2 * Math.PI / 360;
		
		if(fov)
			anguloVision = fov;
		else
			anguloVision = 45;
		matrizPerspectiva = mat4.create();
		crearPerspectiva();
			
		constanteRadianes = 2 * Math.PI / 360;
		arriba = vec3.fromValues(0, 1, 0);	
		direccionLateral = vec3.fromValues(1, 0, 0);
		
		direccionVision = vec3.fromValues(0, 0, 1);
		origen = vec3.create();			
		
		puntoVision = vec3.create();
		posicion = vec3.fromValues(posicionInicial[0], posicionInicial[1], posicionInicial[2]);
		
		posicionMouse = new Array(0, 0);
		estaAgarrando = false;
		
		if(objetivoVision)
		{
			vec3.sub(direccionVision, objetivoVision, posicion);
			vec3.normalize(direccionVision, direccionVision);
			
			anguloPhi = Math.acos(direccionVision[1]);
			anguloTeta = Math.acos(direccionVision[0] / Math.sin(anguloPhi)) * (1 / constanteRadianes);
			anguloPhi *= 1 / constanteRadianes; 
			
			if(direccionVision[2] < 0)
				anguloTeta = 360 - anguloTeta;
			
			vec3.cross(direccionLateral, direccionVision, arriba);
		}
	}
	inicializar();
	
	this.aplicarMatriz = function(matriz)
	{
		mat4.multiply(matrizPosicion, matriz, matrizPosicion);
	}	
	
	this.aplicarMatrizAntes = function(matriz)
	{
		mat4.multiply(matrizPosicion, matrizPosicion, matriz);
	}
	
	this.obtenerMatrizVista = function()
	{
		var matrizVista = mat4.create();
		var posicionActual = vec3.create();
		vec3.transformMat4(posicionActual, posicion, matrizPosicion);
		
		vec3.add(puntoVision, posicionActual, direccionVision);
		mat4.lookAt(matrizVista, posicionActual, puntoVision, arriba);
		
		return matrizVista;
	}
	
	this.obtenerMatrizPerspectiva = function()
	{
		return matrizPerspectiva;
	}
	
	this.actualizar = function(deltaT)
	{
		var anguloPhiRadianes = anguloPhi * constanteRadianes;
		var anguloTetaRadianes = anguloTeta * constanteRadianes;
		
		direccionVision[0] = Math.sin(anguloPhiRadianes) * Math.cos(anguloTetaRadianes);
		direccionVision[1] = Math.cos(anguloPhiRadianes);
		direccionVision[2] = Math.sin(anguloPhiRadianes) * Math.sin(anguloTetaRadianes);
		
		vec3.cross(direccionLateral, direccionVision, arriba);
		vec3.normalize(direccionLateral, direccionLateral);
	}
	
	this.obtenerPosicion = function()
	{
		var posicionActual = vec3.create();
		vec3.transformMat4(posicionActual, posicion, matrizPosicion);
		
		return posicionActual;
	}
	
	this.configurarPosicion = function(vectorPosicion)
	{
		posicion = vectorPosicion;
	}
	
	this.deshabilitarMovimiento = function()
	{
		movimientoHabilitado = false;
	}
	
	this.activarPrimeraPersona = function()
	{
		primeraPersonaActiva = true;
	}
	
	function manejarTeclas(entrada)
	{			
		var direccionVisionEscalada = vec3.create();		
		var direccionLateralEscalada = vec3.create();
		
		if(movimientoHabilitado)
		{
			vec3.scale(direccionVisionEscalada, direccionVision, velocidadMovimiento);	
			vec3.scale(direccionLateralEscalada, direccionLateral, velocidadMovimiento);
		}		
	
		if(primeraPersonaActiva)
		{
			direccionVisionEscalada[1] = 0;
			direccionLateralEscalada[1] = 0;
			
			if(entrada.keyCode == 69)
				vec3.add(posicion, posicion, arriba);				
			else if(entrada.keyCode == 67)
				vec3.sub(posicion, posicion, arriba);				
		}
	
		switch(entrada.keyCode)
		{
			case 87:
				vec3.add(posicion, posicion, direccionVisionEscalada);				
				return true;
			case 83:
				vec3.sub(posicion, posicion, direccionVisionEscalada);
				return true;	
			case 65:
				vec3.sub(posicion, posicion, direccionLateralEscalada);
				return true;
			case 68:
				vec3.add(posicion, posicion, direccionLateralEscalada);				
				return true;
			
		}
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
		anguloPhi += (entrada.clientY - posicionMouse[1]) * velocidadPorPixel;

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