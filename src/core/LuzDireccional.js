var LuzDireccional = function(direccion, intensidad)
{	
	this.cambiarDireccion = function(direccionNueva)
	{
		direccion = direccionNueva;
	}
	
	this.obtenerDireccion = function()
	{
		return direccion;
	}
	
	this.cambiarIntensidad = function(intensidadNueva)
	{
		intensidad = intensidadNueva;
	}
	
	this.obtenerIntensidad = function()
	{
		return intensidad;
	}
}