function crearConfiguracionAtributoVector(	nombreAtributo, 
											tipoBufferAtributo,
											buffer,
											dimensionAtributo,
											tipoDatoAtributo,
											habilitarNormalizacion,
											tamañoEntrelazado,
											offsetInicioBuffer,
											textura)
{
	return {'nombreAtributo': nombreAtributo,
			'tipoBufferAtributo': tipoBufferAtributo,
			'buffer': buffer,
			'dimensionAtributo': dimensionAtributo,
			'tipoDatoAtributo': tipoDatoAtributo,
			'habilitarNormalizacion': habilitarNormalizacion,
			'tamañoEntrelazado': tamañoEntrelazado,
			'offsetInicioBuffer': offsetInicioBuffer,
			'textura': textura};
}

function crearConfiguracionUniformeMatriz(	nombreAtributo, 
											matriz,
											ordenMatriz)
{
	return {	'nombreAtributo': nombreAtributo,	
				'matriz': matriz,
				'ordenMatriz': ordenMatriz};
}

function crearConfiguracionUniformeTextura(	nombreAtributo, 
											textura,
											indice,
											indiceTextura)
{
	return {	'nombreAtributo': nombreAtributo,	
				'textura': textura,
				'indice': indice,
				'indiceTextura': indiceTextura};
}