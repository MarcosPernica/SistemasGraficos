function crearPuntos3D()
{
	var puntos = new Array();
	
	for(var i = 0; i < arguments.length; i++)
	{
		var punto = arguments[i];
		var puntoVec3 = vec3.create();
		
		for(var j = 0; j < punto.length; j++)
			puntoVec3[j] = punto[j];
		
		puntos.push(puntoVec3);
	}
	
	return puntos;
}