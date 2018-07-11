function crearConfiguradorShaderAgua(	webGL,
										tiempo,
										normales,
										tangentes,
										mapaNormales,
										textura2,
										cara1,
										cara2,
										cara3,
										cara4,
										cara5,
										cara6,
										factorReflejo,
										repetirTextura,
										intensidadLuzAmbiente,
										intensidadLuzSolar,
										direccionLuzSolar,
										intensidadesLucesPuntuales,
										posicionesLucesPuntuales,
										coeficienteEspecular,
										coeficienteAmbiente,
										factorGlossy,
										posicionCamara)
{
	var handlerBufferNormales = webGL.createBuffer();
	webGL.bindBuffer(webGL.ARRAY_BUFFER, handlerBufferNormales);
    webGL.bufferData(webGL.ARRAY_BUFFER, new Float32Array(crearArregloPlano(normales)), webGL.STATIC_DRAW);
			
	var configuracionNormales = crearConfiguracionAtributoVector(	'vNormalVertice', 
																	webGL.ARRAY_BUFFER,
																	handlerBufferNormales,
																	3, 
																	webGL.FLOAT, 
																	false, 
																	0, 
																	0);	
																	
																	
																	
	var handlerBufferTangentes = webGL.createBuffer();
	webGL.bindBuffer(webGL.ARRAY_BUFFER, handlerBufferTangentes);
    webGL.bufferData(webGL.ARRAY_BUFFER, new Float32Array(crearArregloPlano(tangentes)), webGL.STATIC_DRAW);
			
	var configuracionTangentes = crearConfiguracionAtributoVector(	'vTangenteVertice', 
																	webGL.ARRAY_BUFFER,
																	handlerBufferTangentes,
																	3, 
																	webGL.FLOAT, 
																	false, 
																	0, 
																	0);	
													
			
	var configuracionIntensidadLuzAmbiente = crearConfiguracionAtributoVector(	'intensidadLuzAmbiente', 
																				webGL.ARRAY_BUFFER,
																				new Float32Array(intensidadLuzAmbiente),
																				3, 
																				webGL.FLOAT, 
																				false, 
																				0, 
																				0);	
			
	var configuracionIntensidadLuzSolar = crearConfiguracionAtributoVector(	'intensidadLuzSolar', 
																			webGL.ARRAY_BUFFER,
																			new Float32Array(intensidadLuzSolar),
																			3, 
																			webGL.FLOAT, 
																			false, 
																			0, 
																			0);	
	
	var direccionInversaLuzSolar = vec3.create();
	vec3.scale(direccionInversaLuzSolar, direccionLuzSolar, -1);		

	var configuracionDireccionInversaLuzSolar = crearConfiguracionAtributoVector(	'direccionInversaLuzSolar', 
																					webGL.ARRAY_BUFFER,
																					new Float32Array(direccionInversaLuzSolar),
																					3, 
																					webGL.FLOAT, 
																					false, 
																					0, 
																					0);
																					
			
	var configuracionIntensidadLucesPuntuales = crearConfiguracionAtributoVector(	'intensidadesLucesPuntuales', 
																					webGL.ARRAY_BUFFER,
																					new Float32Array(crearArregloPlano(intensidadesLucesPuntuales)),
																					3 * intensidadesLucesPuntuales.length, 
																					webGL.FLOAT, 
																					false, 
																					0, 
																					0);	
			
	var configuracionPosicionesLucesPuntuales = crearConfiguracionAtributoVector(	'posicionesLucesPuntuales', 
																					webGL.ARRAY_BUFFER,
																					new Float32Array(crearArregloPlano(posicionesLucesPuntuales)),
																					3 * posicionesLucesPuntuales.length, 
																					webGL.FLOAT, 
																					false, 
																					0, 
																					0);	

	var configuracionCoeficienteEspecular = crearConfiguracionAtributoVector(	'coeficienteEspecular', 
																				webGL.ARRAY_BUFFER,
																				new Float32Array(coeficienteEspecular),
																				3, 
																				webGL.FLOAT, 
																				false, 
																				0, 
																				0);			
			
	var configuracionCoeficienteAmbiente = crearConfiguracionAtributoVector(	'coeficienteAmbiente', 
																				webGL.ARRAY_BUFFER,
																				new Float32Array(coeficienteAmbiente),
																				3, 
																				webGL.FLOAT, 
																				false, 
																				0, 
																				0);		

	var configuracionFactorGlossy = crearConfiguracionAtributoVector(	'factorGlossy', 
																		webGL.ARRAY_BUFFER,
																		factorGlossy,
																		1, 
																		webGL.FLOAT, 
																		false, 
																		0, 
																		0);		
																		
	var configuracionTiempo = crearConfiguracionAtributoVector(	'tiempo', 
																webGL.ARRAY_BUFFER,
																tiempo,
																1, 
																webGL.FLOAT, 
																false, 
																0, 
																0);	

	var configuracionPosicionCamara = crearConfiguracionAtributoVector(	'posicionCamara', 
																		webGL.ARRAY_BUFFER,
																		new Float32Array(posicionCamara),
																		3, 
																		webGL.FLOAT, 
																		false, 
																		0, 
																		0);	
																		
	var configuracionFactorReflejo = crearConfiguracionAtributoVector(	'factorReflejo', 
																		webGL.ARRAY_BUFFER,
																		factorReflejo,
																		1, 
																		webGL.FLOAT, 
																		false, 
																		0, 
																		0);																		
																		
	var configuracionMapaReflejo = crearConfiguracionUniformeTextura(	'mapaReflejo',
																		precargarTexturaCubo(webGL, cara1, cara2, cara3, cara4, cara5, cara6, repetirTextura),
																		2,
																		webGL.TEXTURE2);
																		
																		
	var configuracionMapaNormales = crearConfiguracionUniformeTextura(	'mapaNormales',
																		precargarTextura(webGL, mapaNormales, repetirTextura),
																		1,
																		webGL.TEXTURE1);
																		
	var configuracionTextura2 = crearConfiguracionUniformeTextura(	'textura2',
																	precargarTextura(webGL, textura2, repetirTextura),
																	3,
																	webGL.TEXTURE3);

	function configurarShaderAgua(programaShader, posicionCamara, direccionLuzSolar, tiempo)
	{	
		programaShader.configurarAtributoVector(configuracionNormales);
		programaShader.configurarAtributoVector(configuracionTangentes);
		programaShader.configurarUniformeVector(configuracionIntensidadLuzAmbiente);
		programaShader.configurarUniformeVector(configuracionIntensidadLuzSolar);	
		programaShader.configurarUniformeVector(configuracionIntensidadLucesPuntuales);	
		
		configuracionPosicionesLucesPuntuales.buffer = new Float32Array(crearArregloPlano(posicionesLucesPuntuales));
		programaShader.configurarUniformeVector(configuracionPosicionesLucesPuntuales);	
		
		programaShader.configurarUniformeVector(configuracionCoeficienteEspecular);	
		programaShader.configurarUniformeVector(configuracionCoeficienteAmbiente);	
		programaShader.configurarUniformeFloat(configuracionFactorGlossy);
		programaShader.configurarUniformeFloat(configuracionFactorReflejo);
		
		programaShader.configurarUniformeTextura(configuracionMapaNormales);
		programaShader.configurarUniformeTextura(configuracionTextura2);
		programaShader.configurarUniformeTexturaCubo(configuracionMapaReflejo);
		
		configuracionTiempo.buffer = tiempo;
		programaShader.configurarUniformeFloat(configuracionTiempo);
				
		if(posicionCamara)
			configuracionPosicionCamara.buffer = new Float32Array(posicionCamara);
		programaShader.configurarUniformeVector(configuracionPosicionCamara);
		
		if(direccionLuzSolar)
		{
			var direccionInversaLuzSolar = vec3.create();
			vec3.scale(direccionInversaLuzSolar, direccionLuzSolar, -1);
			configuracionDireccionInversaLuzSolar.buffer = new Float32Array(direccionInversaLuzSolar);
		}
		programaShader.configurarUniformeVector(configuracionDireccionInversaLuzSolar);				
	}

	return configurarShaderAgua;
}