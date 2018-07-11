var Cielo = function(webGL, cantidadFilas, cantidadColumnas)
{
	var configuracionTexturaCielo = configuracionTextura(	imagenes['cielo2.png'],
															2048,
															1024,
															256,
															[512, 256],
															[[0, 0],[1024, 0]],
															[[0, 512], [1024, 512]],
															true,
															2,
															1.6);	
														
	return cielo = new Esfera(webGL, cantidadFilas, cantidadColumnas, 10000, configuracionTexturaCielo);
}