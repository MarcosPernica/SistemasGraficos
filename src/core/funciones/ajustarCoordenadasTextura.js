function ajustarCoordenadasTextura(coordenadas, anchoTextura, altoTextura)
{
	for(var i = 0; i < coordenadas.length; i += 2)
	{
		coordenadas[i] /= anchoTextura;
		coordenadas[i + 1] /= altoTextura;
	}
}