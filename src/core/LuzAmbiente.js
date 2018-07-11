var LuzAmbiente = function(intensidad)
{		
	this.cambiarIntensidad = function(intensidadNueva)
	{
		intensidad = intensidadNueva;
	}
	
	this.obtenerIntensidad = function()
	{
		return intensidad;
	}
}