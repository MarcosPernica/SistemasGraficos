var LuzPuntual = function(posicion, intensidad)
{	
	var matrizPosicion = mat4.create();
	var posicionFinal = vec3.create();
	
	this.aplicarMatriz = function(matriz)
	{
		mat4.multiply(matrizPosicion, matriz, matrizPosicion);
		
		posicionFinal[0] = posicion[0];
		posicionFinal[1] = posicion[1];
		posicionFinal[2] = posicion[2];
		
		vec3.transformMat4(posicionFinal, posicionFinal, matrizPosicion);
	}	
	
	this.aplicarMatrizAntes = function(matriz)
	{
		mat4.multiply(matrizPosicion, matrizPosicion, matriz);
		
		posicionFinal[0] = posicion[0];
		posicionFinal[1] = posicion[1];
		posicionFinal[2] = posicion[2];
		
		vec3.transformMat4(posicionFinal, posicionFinal, matrizPosicion);
	}
	
	this.cambiarPosicion = function(posicionNueva)
	{
		posicion = posicionNueva;
	}
	
	this.obtenerPosicion = function()
	{	
		posicionFinal[0] = posicion[0];
		posicionFinal[1] = posicion[1];
		posicionFinal[2] = posicion[2];
		
		vec3.transformMat4(posicionFinal, posicionFinal, matrizPosicion);
		return posicionFinal;
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