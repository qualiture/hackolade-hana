/**
 * SAP HANA Cloud Data Types
 * @enum {string}
 */
const DATA_TYPE = {
	// Numeric types
	tinyint: 'TINYINT',
	smallint: 'SMALLINT',
	integer: 'INTEGER',
	bigint: 'BIGINT',
	decimal: 'DECIMAL',
	smalldecimal: 'SMALLDECIMAL',
	real: 'REAL',
	double: 'DOUBLE',

	// Character string types
	varchar: 'VARCHAR',
	nvarchar: 'NVARCHAR',
	alphanum: 'ALPHANUM',
	shorttext: 'SHORTTEXT',

	// Binary types
	varbinary: 'VARBINARY',

	// LOB types
	blob: 'BLOB',
	clob: 'CLOB',
	nclob: 'NCLOB',
	text: 'TEXT',
	bintext: 'BINTEXT',

	// Date/Time types
	date: 'DATE',
	time: 'TIME',
	seconddate: 'SECONDDATE',
	timestamp: 'TIMESTAMP',

	// Boolean type
	boolean: 'BOOLEAN',

	// Spatial types
	st_geometry: 'ST_GEOMETRY',
	st_point: 'ST_POINT',
	st_circularstring: 'ST_CIRCULARSTRING',
	st_linestring: 'ST_LINESTRING',
	st_polygon: 'ST_POLYGON',
	st_multipoint: 'ST_MULTIPOINT',
	st_multilinestring: 'ST_MULTILINESTRING',
	st_multipolygon: 'ST_MULTIPOLYGON',
	st_geometrycollection: 'ST_GEOMETRYCOLLECTION',

	// Vector type (for AI/ML)
	real_vector: 'REAL_VECTOR',
};

// Types that can have length specification
const DATA_TYPES_WITH_LENGTH = [
	DATA_TYPE.varchar,
	DATA_TYPE.nvarchar,
	DATA_TYPE.alphanum,
	DATA_TYPE.shorttext,
	DATA_TYPE.varbinary,
	DATA_TYPE.real_vector,
];

// Types that can have precision and scale
const DATA_TYPES_WITH_PRECISION = [DATA_TYPE.decimal, DATA_TYPE.smalldecimal];

// Types that can have identity/auto-increment
const DATA_TYPES_WITH_IDENTITY = [
	DATA_TYPE.tinyint,
	DATA_TYPE.smallint,
	DATA_TYPE.integer,
	DATA_TYPE.bigint,
];

// String-like data types
const STRING_DATA_TYPES = [
	DATA_TYPE.varchar,
	DATA_TYPE.nvarchar,
	DATA_TYPE.alphanum,
	DATA_TYPE.shorttext,
	DATA_TYPE.clob,
	DATA_TYPE.nclob,
	DATA_TYPE.text,
];

// LOB data types
const LOB_DATA_TYPES = [
	DATA_TYPE.blob,
	DATA_TYPE.clob,
	DATA_TYPE.nclob,
	DATA_TYPE.text,
	DATA_TYPE.bintext,
];

// Spatial data types
const SPATIAL_DATA_TYPES = [
	DATA_TYPE.st_geometry,
	DATA_TYPE.st_point,
	DATA_TYPE.st_circularstring,
	DATA_TYPE.st_linestring,
	DATA_TYPE.st_polygon,
	DATA_TYPE.st_multipoint,
	DATA_TYPE.st_multilinestring,
	DATA_TYPE.st_multipolygon,
	DATA_TYPE.st_geometrycollection,
];

// Numeric data types
const NUMERIC_DATA_TYPES = [
	DATA_TYPE.tinyint,
	DATA_TYPE.smallint,
	DATA_TYPE.integer,
	DATA_TYPE.bigint,
	DATA_TYPE.decimal,
	DATA_TYPE.smalldecimal,
	DATA_TYPE.real,
	DATA_TYPE.double,
];

// Date/Time data types
const DATETIME_DATA_TYPES = [
	DATA_TYPE.date,
	DATA_TYPE.time,
	DATA_TYPE.seconddate,
	DATA_TYPE.timestamp,
];

// For backward compatibility (not used in HANA but kept for interface consistency)
const DATA_TYPES_WITH_BYTE = [];

module.exports = {
	DATA_TYPE,
	DATA_TYPES_WITH_BYTE,
	DATA_TYPES_WITH_LENGTH,
	DATA_TYPES_WITH_PRECISION,
	DATA_TYPES_WITH_IDENTITY,
	STRING_DATA_TYPES,
	LOB_DATA_TYPES,
	SPATIAL_DATA_TYPES,
	NUMERIC_DATA_TYPES,
	DATETIME_DATA_TYPES,
};
