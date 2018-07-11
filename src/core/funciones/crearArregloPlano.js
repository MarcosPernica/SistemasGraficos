function crearArregloPlano(arreglo)
{
	var arregloPlano = new Array();
	
	for(var i = 0; i < arreglo.length; i++)
	{
		arregloPlano.push(arreglo[i][0]);
		arregloPlano.push(arreglo[i][1]);
		arregloPlano.push(arreglo[i][2]);
	}
	
	return arregloPlano;
}