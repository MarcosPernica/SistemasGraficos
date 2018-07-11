var CamaraPrimeraPersona = function(posicionInicial, objetivoVision, velocidadMovimiento, velocidadZoom, dimensionViewport)
{
	var camara;
	
	function inicializar()
	{
		camara = new CamaraLibre(posicionInicial, objetivoVision);
		camara.activarPrimeraPersona();
	}
	inicializar();
	
	return camara;
}