var GrillaElementos = function(webGL, anchoGrilla, altoGrilla, cantidadPuntosAncho, cantidadPuntosAlto, funcionReplicadora, funcionColor, programaShader)
{
	var objeto3D;
	var espaciadoAncho;
	var espaciadoAlto;
	
	function inicializar()
	{
		var elemento;
		var desplazamiento = vec3.create();
		
		objeto3D = new Objeto3D(webGL, 0, 0, funcionColor, programaShader);
		objeto3D.construir();
		
		espaciadoAncho = anchoGrilla / cantidadPuntosAncho;
		espaciadoAlto = altoGrilla / cantidadPuntosAlto;
		
		for(var i = 0; i < cantidadPuntosAncho; i++)
			for(var j = 0; j < cantidadPuntosAlto; j++)
			{
				desplazamiento[0] = espaciadoAncho * i;
				desplazamiento[1] = 0;
				desplazamiento[2] = espaciadoAlto * j;
				
				elemento = funcionReplicadora(webGL, desplazamiento);
				
				objeto3D.agregarHijo(elemento);
			}
		
	}
	inicializar();
	
	return objeto3D;
	
}