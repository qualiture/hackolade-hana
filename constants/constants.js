const ERROR_MESSAGE = {
	connectionFailed: 'Failed to connect to SAP HANA Cloud. Please verify your connection settings.',
	queryFailed: 'Failed to execute query against SAP HANA Cloud.',
};

/**
 * @enum {string}
 */
const TABLE_TYPE = {
	table: 'TABLE',
	view: 'VIEW',
};

const INLINE_COMMENT = '--';

/**
 * SAP HANA data type categories
 */
const DATA_TYPE_CATEGORY = {
	NUMERIC: 'numeric',
	CHARACTER: 'character',
	DATETIME: 'datetime',
	BINARY: 'binary',
	LOB: 'lob',
	SPATIAL: 'spatial',
	VECTOR: 'vector',
};

module.exports = {
	ERROR_MESSAGE,
	TABLE_TYPE,
	INLINE_COMMENT,
	DATA_TYPE_CATEGORY,
};
