Ejes = function(webGL, origen, direcciones, programaShader)
{
	var objeto3D = new Objeto3D(webGL, 0, 0, null, programaShader);
	var colores;
	
	var direccionesAbsolutas;
	
	function inicializar()
	{
		var direccionAbsoluta;
		
		direccionesAbsolutas = new Array();
		colores = new Array(COLORROJO, COLORVERDE, COLORAZUL);
		
		if(direcciones)
			for(var i = 0; i < direcciones.length; i++)
			{
				direccionAbsoluta = vec3.create();
				vec3.add(direccionAbsoluta, origen, direcciones[i]);
				direccionesAbsolutas.push(direccionAbsoluta);
			}
		else
		{
			origen = vec3.create();
			direccionesAbsolutas.push(vec3.fromValues(1, 0, 0));
			direccionesAbsolutas.push(vec3.fromValues(0, 1, 0));
			direccionesAbsolutas.push(vec3.fromValues(0, 0, 1));
		}
		
	}
	inicializar();
	
	objeto3D.crearBufferVertices = function() 
	{	
		var vertexBuffer = new Array();
		
		vertexBuffer[VERTEXBUFFERPOSICION] = new Array();
		vertexBuffer[VERTEXBUFFERCOLOR] = new Array();	   
																
		for (var i = 0; i < direccionesAbsolutas.length; i++)
		{
			vertexBuffer[VERTEXBUFFERPOSICION].push(origen[0]);
			vertexBuffer[VERTEXBUFFERPOSICION].push(origen[1]);
			vertexBuffer[VERTEXBUFFERPOSICION].push(origen[2]);
		
			vertexBuffer[VERTEXBUFFERPOSICION].push(direccionesAbsolutas[i][0]);
			vertexBuffer[VERTEXBUFFERPOSICION].push(direccionesAbsolutas[i][1]);
			vertexBuffer[VERTEXBUFFERPOSICION].push(direccionesAbsolutas[i][2]);		

			vertexBuffer[VERTEXBUFFERPOSICION].push(origen[0]);
			vertexBuffer[VERTEXBUFFERPOSICION].push(origen[1]);
			vertexBuffer[VERTEXBUFFERPOSICION].push(origen[2]);
			
			if(colores.length)
			{
				var color = colores.shift();
				vertexBuffer[VERTEXBUFFERCOLOR].push(color[0]);
				vertexBuffer[VERTEXBUFFERCOLOR].push(color[1]);
				vertexBuffer[VERTEXBUFFERCOLOR].push(color[2]);				
				
				vertexBuffer[VERTEXBUFFERCOLOR].push(color[0]);
				vertexBuffer[VERTEXBUFFERCOLOR].push(color[1]);
				vertexBuffer[VERTEXBUFFERCOLOR].push(color[2]);				
				
				vertexBuffer[VERTEXBUFFERCOLOR].push(color[0]);
				vertexBuffer[VERTEXBUFFERCOLOR].push(color[1]);
				vertexBuffer[VERTEXBUFFERCOLOR].push(color[2]);
			}
			else
			{
				var rojo = Math.random();
				var verde = Math.random();
				var azul = Math.random();
				
				vertexBuffer[VERTEXBUFFERCOLOR].push(rojo);
				vertexBuffer[VERTEXBUFFERCOLOR].push(verde);
				vertexBuffer[VERTEXBUFFERCOLOR].push(azul);					
				
				vertexBuffer[VERTEXBUFFERCOLOR].push(rojo);
				vertexBuffer[VERTEXBUFFERCOLOR].push(verde);
				vertexBuffer[VERTEXBUFFERCOLOR].push(azul);					
				
				vertexBuffer[VERTEXBUFFERCOLOR].push(rojo);
				vertexBuffer[VERTEXBUFFERCOLOR].push(verde);
				vertexBuffer[VERTEXBUFFERCOLOR].push(azul);				
			}
		}
		return vertexBuffer;
	}
	
	objeto3D.crearBufferIndice = function() 
	{	
		var indexBuffer = new Array();
								
		for (var i = 0; i < 3 * direccionesAbsolutas.length; i++)
			indexBuffer.push(i);
			
		return indexBuffer;
	}
	
	objeto3D.aceptarModoDebug = function()
	{
		return false;
	}
	
	objeto3D.construir();
	objeto3D.cambiarModoDibujo(webGL.LINE_STRIP);
	
	return objeto3D;
}





