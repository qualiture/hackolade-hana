/**
 * SAP HANA Cloud Data Type Descriptors
 * Reference: https://help.sap.com/docs/hana-cloud-database/sap-hana-cloud-sap-hana-database-sql-reference-guide/data-types
 */
module.exports = {
	// Numeric Types
	TINYINT: {
		capacity: 1,
		mode: 'tinyint',
	},
	SMALLINT: {
		capacity: 2,
		mode: 'smallint',
	},
	INT: {
		capacity: 4,
		mode: 'integer',
	},
	INTEGER: {
		capacity: 4,
		mode: 'integer',
	},
	BIGINT: {
		capacity: 8,
		mode: 'bigint',
	},
	DECIMAL: {
		mode: 'decimal',
	},
	SMALLDECIMAL: {
		mode: 'smalldecimal',
	},
	REAL: {
		capacity: 4,
		mode: 'real',
	},
	FLOAT: {
		capacity: 4,
		mode: 'real',
	},
	DOUBLE: {
		capacity: 8,
		mode: 'double',
	},

	// Character String Types
	VARCHAR: {
		mode: 'varchar',
	},
	NVARCHAR: {
		mode: 'nvarchar',
	},
	ALPHANUM: {
		mode: 'alphanum',
	},
	SHORTTEXT: {
		mode: 'shorttext',
	},

	// Binary Types
	VARBINARY: {
		mode: 'varbinary',
	},

	// Large Object Types (LOBs)
	BLOB: {
		mode: 'blob',
	},
	CLOB: {
		mode: 'clob',
	},
	NCLOB: {
		mode: 'nclob',
	},
	TEXT: {
		mode: 'text',
	},
	BINTEXT: {
		mode: 'bintext',
	},

	// Date/Time Types
	DATE: {
		mode: 'date',
		format: 'YYYY-MM-DD',
	},
	TIME: {
		mode: 'time',
		format: 'HH:MM:SS',
	},
	SECONDDATE: {
		mode: 'seconddate',
		format: 'YYYY-MM-DD HH:MM:SS',
	},
	TIMESTAMP: {
		mode: 'timestamp',
		format: 'YYYY-MM-DD HH:MM:SS.FFFFFFF',
	},

	// Boolean Type
	BOOLEAN: {
		mode: 'boolean',
	},

	// Spatial Types
	ST_GEOMETRY: {
		mode: 'st_geometry',
	},
	ST_POINT: {
		mode: 'st_point',
	},
	ST_CIRCULARSTRING: {
		mode: 'st_circularstring',
	},
	ST_LINESTRING: {
		mode: 'st_linestring',
	},
	ST_POLYGON: {
		mode: 'st_polygon',
	},
	ST_MULTIPOINT: {
		mode: 'st_multipoint',
	},
	ST_MULTILINESTRING: {
		mode: 'st_multilinestring',
	},
	ST_MULTIPOLYGON: {
		mode: 'st_multipolygon',
	},
	ST_GEOMETRYCOLLECTION: {
		mode: 'st_geometrycollection',
	},

	// Vector Type (for AI/ML)
	REAL_VECTOR: {
		mode: 'real_vector',
	},
};
