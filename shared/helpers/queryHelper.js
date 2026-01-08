const { TABLE_TYPE } = require('../../constants/constants');

/**
 * @param {{ query: string }}
 * @returns {string}
 */
const cleanUpQuery = ({ query = '' }) => query.replaceAll(/\s+/g, ' ').trim();

/**
 * SAP HANA system schemas to exclude from results
 */
const SYSTEM_SCHEMAS = [
	'SYS',
	'SYSTEM',
	'_SYS_AFL',
	'_SYS_BI',
	'_SYS_BIC',
	'_SYS_EPM',
	'_SYS_PLAN_STABILITY',
	'_SYS_REPO',
	'_SYS_RT',
	'_SYS_SECURITY',
	'_SYS_SQL_ANALYZER',
	'_SYS_STATISTICS',
	'_SYS_TASK',
	'_SYS_TELEMETRY',
	'_SYS_XS',
	'_SYS_DI',
	'_SYS_DI_CLOUD',
	'_SYS_AUDIT',
	'SAP_XS_LM',
	'SAP_HANA_ADMIN',
	'UIS',
	'SAP_PA_APL',
	'DWC_GLOBAL',
];

/**
 * @param {{ schemaNameKeyword: string }}
 * @returns {string}
 */
const getNonSystemSchemaCondition = ({ schemaNameKeyword }) => {
	const conditions = SYSTEM_SCHEMAS.map(schema => `${schemaNameKeyword} != '${schema}'`);
	conditions.push(`${schemaNameKeyword} NOT LIKE '_SYS%'`);
	conditions.push(`${schemaNameKeyword} NOT LIKE 'SAP_%'`);
	return conditions.join(' AND ');
};

/**
 * @returns {string}
 */
const getDbVersionQuery = () => {
	return "SELECT VERSION FROM SYS.M_DATABASE";
};

/**
 * @param {{ includeSystemCollection: boolean }}
 * @returns {string}
 */
const getSchemasQuery = ({ includeSystemCollection = false } = {}) => {
	let query = `
		SELECT SCHEMA_NAME 
		FROM SYS.SCHEMAS 
		WHERE HAS_PRIVILEGES = 'TRUE'
	`;

	if (!includeSystemCollection) {
		query += ` AND ${getNonSystemSchemaCondition({ schemaNameKeyword: 'SCHEMA_NAME' })}`;
	}

	query += ' ORDER BY SCHEMA_NAME';

	return cleanUpQuery({ query });
};

/**
 * @param {{ schemaName: string }}
 * @returns {string}
 */
const getSchemaQuery = ({ schemaName }) => {
	return `SELECT * FROM SYS.SCHEMAS WHERE SCHEMA_NAME = '${schemaName}'`;
};

/**
 * @param {{ tableType: string, includeSystemCollection: boolean }}
 * @returns {string}
 */
const getTableNamesQuery = ({ tableType, includeSystemCollection }) => {
	const tableTypeCondition = tableType === TABLE_TYPE.view ? "TABLE_TYPE = 'VIEW'" : "TABLE_TYPE = 'TABLE'";

	let query = `
		SELECT SCHEMA_NAME, TABLE_NAME 
		FROM SYS.TABLES 
		WHERE ${tableTypeCondition}
	`;

	if (!includeSystemCollection) {
		query += ` AND ${getNonSystemSchemaCondition({ schemaNameKeyword: 'SCHEMA_NAME' })}`;
	}

	query += ' ORDER BY SCHEMA_NAME, TABLE_NAME';

	return cleanUpQuery({ query });
};

/**
 * @param {{ schemaName: string, tableName: string }}
 * @returns {string}
 */
const getTableColumnsQuery = ({ schemaName, tableName }) => {
	return cleanUpQuery({
		query: `
		SELECT 
			COLUMN_NAME,
			POSITION,
			DATA_TYPE_NAME,
			LENGTH,
			SCALE,
			IS_NULLABLE,
			DEFAULT_VALUE,
			COMMENTS,
			GENERATION_TYPE,
			CS_DATA_TYPE_NAME
		FROM SYS.TABLE_COLUMNS
		WHERE SCHEMA_NAME = '${schemaName}' 
		AND TABLE_NAME = '${tableName}'
		ORDER BY POSITION
	`,
	});
};

/**
 * @param {{ schemaName: string, tableName: string }}
 * @returns {string}
 */
const getTablePrimaryKeyQuery = ({ schemaName, tableName }) => {
	return cleanUpQuery({
		query: `
		SELECT 
			c.CONSTRAINT_NAME,
			c.COLUMN_NAME,
			c.POSITION
		FROM SYS.CONSTRAINTS c
		WHERE c.SCHEMA_NAME = '${schemaName}' 
		AND c.TABLE_NAME = '${tableName}'
		AND c.IS_PRIMARY_KEY = 'TRUE'
		ORDER BY c.POSITION
	`,
	});
};

/**
 * @param {{ schemaName: string, tableName: string }}
 * @returns {string}
 */
const getTableUniqueConstraintsQuery = ({ schemaName, tableName }) => {
	return cleanUpQuery({
		query: `
		SELECT 
			c.CONSTRAINT_NAME,
			c.COLUMN_NAME,
			c.POSITION
		FROM SYS.CONSTRAINTS c
		WHERE c.SCHEMA_NAME = '${schemaName}' 
		AND c.TABLE_NAME = '${tableName}'
		AND c.IS_UNIQUE_KEY = 'TRUE'
		AND c.IS_PRIMARY_KEY = 'FALSE'
		ORDER BY c.CONSTRAINT_NAME, c.POSITION
	`,
	});
};

/**
 * @param {{ schemaName: string, tableName: string }}
 * @returns {string}
 */
const getTableForeignKeysQuery = ({ schemaName, tableName }) => {
	return cleanUpQuery({
		query: `
		SELECT 
			fk.CONSTRAINT_NAME,
			fk.COLUMN_NAME,
			fk.POSITION,
			fk.REFERENCED_SCHEMA_NAME,
			fk.REFERENCED_TABLE_NAME,
			fk.REFERENCED_COLUMN_NAME,
			fk.UPDATE_RULE,
			fk.DELETE_RULE
		FROM SYS.REFERENTIAL_CONSTRAINTS fk
		WHERE fk.SCHEMA_NAME = '${schemaName}' 
		AND fk.TABLE_NAME = '${tableName}'
		ORDER BY fk.CONSTRAINT_NAME, fk.POSITION
	`,
	});
};

/**
 * @param {{ schemaName: string, tableName: string }}
 * @returns {string}
 */
const getTableCheckConstraintsQuery = ({ schemaName, tableName }) => {
	return cleanUpQuery({
		query: `
		SELECT 
			CONSTRAINT_NAME,
			CHECK_CONDITION
		FROM SYS.CHECK_CONSTRAINTS
		WHERE SCHEMA_NAME = '${schemaName}' 
		AND TABLE_NAME = '${tableName}'
	`,
	});
};

/**
 * @param {{ schemaName: string, tableName: string }}
 * @returns {string}
 */
const getTableIndexesQuery = ({ schemaName, tableName }) => {
	return cleanUpQuery({
		query: `
		SELECT 
			i.INDEX_NAME,
			i.INDEX_TYPE,
			ic.COLUMN_NAME,
			ic.POSITION,
			ic.ASCENDING_ORDER
		FROM SYS.INDEXES i
		INNER JOIN SYS.INDEX_COLUMNS ic 
			ON i.SCHEMA_NAME = ic.SCHEMA_NAME 
			AND i.TABLE_NAME = ic.TABLE_NAME 
			AND i.INDEX_NAME = ic.INDEX_NAME
		WHERE i.SCHEMA_NAME = '${schemaName}' 
		AND i.TABLE_NAME = '${tableName}'
		AND i.CONSTRAINT IS NULL
		ORDER BY i.INDEX_NAME, ic.POSITION
	`,
	});
};

/**
 * @param {{ schemaName: string, tableName: string }}
 * @returns {string}
 */
const getTablePropertiesQuery = ({ schemaName, tableName }) => {
	return cleanUpQuery({
		query: `
		SELECT 
			TABLE_TYPE,
			IS_COLUMN_TABLE,
			IS_TEMPORARY,
			COMMENTS,
			IS_USER_DEFINED_TYPE,
			HAS_PRIMARY_KEY,
			IS_PARTITIONED,
			PARTITION_SPEC
		FROM SYS.TABLES
		WHERE SCHEMA_NAME = '${schemaName}' 
		AND TABLE_NAME = '${tableName}'
	`,
	});
};

/**
 * @param {{ schemaName: string, viewName: string }}
 * @returns {string}
 */
const getViewDefinitionQuery = ({ schemaName, viewName }) => {
	return cleanUpQuery({
		query: `
		SELECT 
			VIEW_NAME,
			DEFINITION,
			COMMENTS
		FROM SYS.VIEWS
		WHERE SCHEMA_NAME = '${schemaName}' 
		AND VIEW_NAME = '${viewName}'
	`,
	});
};

/**
 * @param {{ schemaName: string, viewName: string }}
 * @returns {string}
 */
const getViewColumnsQuery = ({ schemaName, viewName }) => {
	return cleanUpQuery({
		query: `
		SELECT 
			COLUMN_NAME,
			POSITION,
			DATA_TYPE_NAME,
			LENGTH,
			SCALE,
			IS_NULLABLE,
			DEFAULT_VALUE,
			COMMENTS
		FROM SYS.VIEW_COLUMNS
		WHERE SCHEMA_NAME = '${schemaName}' 
		AND VIEW_NAME = '${viewName}'
		ORDER BY POSITION
	`,
	});
};

/**
 * Generate DDL for a table using HANA's built-in function
 * @param {{ schemaName: string, tableName: string }}
 * @returns {string}
 */
const getTableDdlQuery = ({ schemaName, tableName }) => {
	// HANA doesn't have a direct DDL generation like Db2's SYSPROC.DB2LK_GENERATE_DDL
	// We need to construct it from metadata or use EXPORT statement
	// For now, we'll construct it manually from system tables
	return cleanUpQuery({
		query: `
		SELECT 
			t.SCHEMA_NAME,
			t.TABLE_NAME,
			t.TABLE_TYPE,
			t.IS_COLUMN_TABLE,
			t.IS_TEMPORARY,
			t.COMMENTS,
			t.PARTITION_SPEC
		FROM SYS.TABLES t
		WHERE t.SCHEMA_NAME = '${schemaName}' 
		AND t.TABLE_NAME = '${tableName}'
	`,
	});
};

const queryHelper = {
	cleanUpQuery,
	getDbVersionQuery,
	getSchemaQuery,
	getSchemasQuery,
	getTableNamesQuery,
	getTableColumnsQuery,
	getTablePrimaryKeyQuery,
	getTableUniqueConstraintsQuery,
	getTableForeignKeysQuery,
	getTableCheckConstraintsQuery,
	getTableIndexesQuery,
	getTablePropertiesQuery,
	getViewDefinitionQuery,
	getViewColumnsQuery,
	getTableDdlQuery,
	getNonSystemSchemaCondition,
	SYSTEM_SCHEMAS,
};

module.exports = {
	queryHelper,
};
