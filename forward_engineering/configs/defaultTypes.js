/**
 * SAP HANA Cloud Default Type Mappings
 * Maps JSON Schema / Hackolade types to HANA SQL types
 */
module.exports = {
	// Numeric types
	number: 'INTEGER',
	integer: 'INTEGER',
	tinyint: 'TINYINT',
	smallint: 'SMALLINT',
	bigint: 'BIGINT',
	decimal: 'DECIMAL',
	smalldecimal: 'SMALLDECIMAL',
	real: 'REAL',
	float: 'REAL',
	double: 'DOUBLE',

	// String types
	string: 'NVARCHAR',
	char: 'NVARCHAR',
	varchar: 'VARCHAR',
	nvarchar: 'NVARCHAR',
	alphanum: 'ALPHANUM',
	shorttext: 'SHORTTEXT',

	// Date/Time types
	date: 'DATE',
	time: 'TIME',
	timestamp: 'TIMESTAMP',
	seconddate: 'SECONDDATE',

	// Binary types
	binary: 'VARBINARY',
	varbinary: 'VARBINARY',

	// LOB types
	blob: 'BLOB',
	clob: 'CLOB',
	nclob: 'NCLOB',
	text: 'TEXT',
	bintext: 'BINTEXT',

	// Boolean type
	boolean: 'BOOLEAN',

	// Document/JSON types (HANA supports JSON in NCLOB columns)
	document: 'NCLOB',
	json: 'NCLOB',

	// Array types (HANA uses ARRAY types)
	array: 'NCLOB',

	// Geospatial types
	geometry: 'ST_GEOMETRY',
	point: 'ST_POINT',
	geospatial: 'ST_GEOMETRY',

	// Vector type (for AI/ML)
	real_vector: 'REAL_VECTOR',
	vector: 'REAL_VECTOR',

	// Default fallback
	default: 'NVARCHAR',
};
