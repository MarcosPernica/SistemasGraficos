var Isla = function(webGL, puntosNivel, cantidadNiveles)
{
	var volcan = new Volcan(webGL, puntosNivel, cantidadNiveles);
	var playa = new Playa(webGL, puntosNivel, cantidadNiveles);
	
	var contenedor = new Objeto3D(webGL, 1, 1);
	contenedor.construir();
	
	playa.escalar([15, 8, 3]);
	playa.trasladar([0, 0, -1000]);
	playa.rotar([1, 0, 0], -90);	
	playa.trasladar([0, 0, 400]);
		
	volcan.escalar([5, 5, 15]);
	volcan.rotar([1, 0, 0], -90);	
	volcan.trasladar([-400, -200, 300]);
		
	contenedor.agregarHijo(volcan);
	contenedor.agregarHijo(playa);
	
	return contenedor;
}