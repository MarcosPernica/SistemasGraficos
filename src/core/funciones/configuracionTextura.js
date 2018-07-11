function configuracionTextura(	textura,
								ancho,
								alto,
								radioTapa,
								centroTapa,
								bordeSuperiorRectangulo,
								bordeInferiorRectangulo,
								repetir,
								factorEscalaHorizontal,
								factorEscalaVertical)
{
	return {'textura': textura,
			'ancho': ancho,
			'alto': alto,
			'radioTapa': radioTapa,
			'centroTapa': centroTapa,
			'bordeSuperiorRectangulo': bordeSuperiorRectangulo,
			'bordeInferiorRectangulo': bordeInferiorRectangulo,
			'repetir': repetir,
			'factorEscalaHorizontal': factorEscalaHorizontal,
			'factorEscalaVertical': factorEscalaVertical || factorEscalaHorizontal};
}