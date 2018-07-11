var CamaraCabina = function(posicionInicial, objetivoVision, velocidadZoom, dimensionViewport)
{
	var camara;
	
	function inicializar()
	{
		camara = new CamaraLibre(posicionInicial, objetivoVision, null, null, null, 80);
		camara.deshabilitarMovimiento();
	}
	inicializar();
	
	return camara;
}