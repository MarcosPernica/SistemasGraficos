var Referencia = function(posicion, soloRotar)
{
	var matrizPosicion;
	
	this.aplicarMatriz = function(matriz)
	{
		if(soloRotar && (matriz[12] || matriz[13] || matriz[14]))
			return;
			
		mat4.multiply(matrizPosicion, matriz, matrizPosicion);
	}	
	
	this.aplicarMatrizAntes = function(matriz)
	{
		if(soloRotar && (matriz[12] || matriz[13] || matriz[14]))
			return;
			
		mat4.multiply(matrizPosicion, matrizPosicion, matriz);
	}
	
	this.obtenerReferencia = function()
	{
		var posicionActual = vec3.create();
		vec3.transformMat4(posicionActual, posicion, matrizPosicion);
		return posicionActual;
	}
	
	this.copiar = function()
	{
		return new Referencia(this.obtenerReferencia(), soloRotar);
	}
	
	function inicializar()
	{
		matrizPosicion = mat4.create();
	}
	inicializar();
}