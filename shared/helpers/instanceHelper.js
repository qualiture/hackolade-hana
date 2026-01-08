/**
 * @typedef {import("../types").Connection} Connection
 * @typedef {import("../types").NameMap} NameMap
 * @typedef {import("../types").Logger} Logger
 */

const { TABLE_TYPE } = require('../../constants/constants');
const { queryHelper } = require('./queryHelper');

/**
 * @param {{ connection: Connection }}
 * @returns {Promise<string>}
 */
const getDbVersion = async ({ connection }) => {
	const query = queryHelper.getDbVersionQuery();
	const result = await connection.execute({ query });
	const version = result?.[0]?.VERSION || '';
	return version;
};

/**
 * @param {{ connection: Connection, includeSystemCollection?: boolean }}
 * @returns {Promise<string[]>}
 */
const getSchemaNames = async ({ connection, includeSystemCollection = false }) => {
	const query = queryHelper.getSchemasQuery({ includeSystemCollection });
	const result = await connection.execute({ query });
	return result.map(row => row.SCHEMA_NAME);
};

/**
 * @param {{ connection: Connection, tableType: string, includeSystemCollection: boolean, tableNameModifier: (name: string) => string }}
 * @returns {Promise<NameMap>}
 */
const getDatabasesWithTableNames = async ({ connection, tableType, includeSystemCollection, tableNameModifier }) => {
	const query = queryHelper.getTableNamesQuery({ tableType, includeSystemCollection });
	const result = await connection.execute({ query });

	return result.reduce((result, { SCHEMA_NAME, TABLE_NAME }) => {
		return {
			...result,
			[SCHEMA_NAME]: [...(result[SCHEMA_NAME] || []), tableNameModifier(TABLE_NAME)],
		};
	}, {});
};

/**
 * @param {{ connection: Connection, schemaName: string, logger: Logger }}
 * @returns {Promise<{ [key: string]: string }>}
 */
const getSchemaProperties = async ({ connection, schemaName, logger }) => {
	try {
		const query = queryHelper.getSchemaQuery({ schemaName });
		const result = await connection.execute({ query });

		return (result || []).reduce((acc, row) => {
			return {
				...acc,
				schemaOwner: row.SCHEMA_OWNER,
				hasPrivileges: row.HAS_PRIVILEGES,
			};
		}, {});
	} catch (error) {
		logger.error(error);
		return {};
	}
};

/**
 * Get table columns with their properties
 * @param {{ connection: Connection, schemaName: string, tableName: string, logger: Logger }}
 * @returns {Promise<any[]>}
 */
const getTableColumns = async ({ connection, schemaName, tableName, logger }) => {
	try {
		const query = queryHelper.getTableColumnsQuery({ schemaName, tableName });
		const result = await connection.execute({ query });
		return result || [];
	} catch (error) {
		logger.error(error);
		return [];
	}
};

/**
 * Get table primary key
 * @param {{ connection: Connection, schemaName: string, tableName: string, logger: Logger }}
 * @returns {Promise<any[]>}
 */
const getTablePrimaryKey = async ({ connection, schemaName, tableName, logger }) => {
	try {
		const query = queryHelper.getTablePrimaryKeyQuery({ schemaName, tableName });
		const result = await connection.execute({ query });
		return result || [];
	} catch (error) {
		logger.error(error);
		return [];
	}
};

/**
 * Get table unique constraints
 * @param {{ connection: Connection, schemaName: string, tableName: string, logger: Logger }}
 * @returns {Promise<any[]>}
 */
const getTableUniqueConstraints = async ({ connection, schemaName, tableName, logger }) => {
	try {
		const query = queryHelper.getTableUniqueConstraintsQuery({ schemaName, tableName });
		const result = await connection.execute({ query });
		return result || [];
	} catch (error) {
		logger.error(error);
		return [];
	}
};

/**
 * Get table foreign keys
 * @param {{ connection: Connection, schemaName: string, tableName: string, logger: Logger }}
 * @returns {Promise<any[]>}
 */
const getTableForeignKeys = async ({ connection, schemaName, tableName, logger }) => {
	try {
		const query = queryHelper.getTableForeignKeysQuery({ schemaName, tableName });
		const result = await connection.execute({ query });
		return result || [];
	} catch (error) {
		logger.error(error);
		return [];
	}
};

/**
 * Get table check constraints
 * @param {{ connection: Connection, schemaName: string, tableName: string, logger: Logger }}
 * @returns {Promise<any[]>}
 */
const getTableCheckConstraints = async ({ connection, schemaName, tableName, logger }) => {
	try {
		const query = queryHelper.getTableCheckConstraintsQuery({ schemaName, tableName });
		const result = await connection.execute({ query });
		return result || [];
	} catch (error) {
		logger.error(error);
		return [];
	}
};

/**
 * Get table indexes
 * @param {{ connection: Connection, schemaName: string, tableName: string, logger: Logger }}
 * @returns {Promise<any[]>}
 */
const getTableIndexes = async ({ connection, schemaName, tableName, logger }) => {
	try {
		const query = queryHelper.getTableIndexesQuery({ schemaName, tableName });
		const result = await connection.execute({ query });
		return result || [];
	} catch (error) {
		logger.error(error);
		return [];
	}
};

/**
 * Get table properties
 * @param {{ connection: Connection, schemaName: string, tableName: string, logger: Logger }}
 * @returns {Promise<any>}
 */
const getTableProperties = async ({ connection, schemaName, tableName, logger }) => {
	try {
		const query = queryHelper.getTablePropertiesQuery({ schemaName, tableName });
		const result = await connection.execute({ query });
		return result?.[0] || {};
	} catch (error) {
		logger.error(error);
		return {};
	}
};

/**
 * Get view definition
 * @param {{ connection: Connection, schemaName: string, viewName: string, logger: Logger }}
 * @returns {Promise<any>}
 */
const getViewDefinition = async ({ connection, schemaName, viewName, logger }) => {
	try {
		const query = queryHelper.getViewDefinitionQuery({ schemaName, viewName });
		const result = await connection.execute({ query });
		return result?.[0] || {};
	} catch (error) {
		logger.error(error);
		return {};
	}
};

/**
 * Get view columns
 * @param {{ connection: Connection, schemaName: string, viewName: string, logger: Logger }}
 * @returns {Promise<any[]>}
 */
const getViewColumns = async ({ connection, schemaName, viewName, logger }) => {
	try {
		const query = queryHelper.getViewColumnsQuery({ schemaName, viewName });
		const result = await connection.execute({ query });
		return result || [];
	} catch (error) {
		logger.error(error);
		return [];
	}
};

/**
 * Build DDL statement for a table from its metadata
 * @param {{ connection: Connection, schemaName: string, tableName: string, tableType: string, logger: Logger}}
 * @returns {Promise<string>}
 */
const getTableDdl = async ({ connection, schemaName, tableName, tableType, logger }) => {
	try {
		if (tableType === TABLE_TYPE.view) {
			return await buildViewDdl({ connection, schemaName, viewName: tableName, logger });
		}
		return await buildTableDdl({ connection, schemaName, tableName, logger });
	} catch (error) {
		logger.error(error);
		return '';
	}
};

/**
 * Build DDL for a table from metadata
 * @param {{ connection: Connection, schemaName: string, tableName: string, logger: Logger }}
 * @returns {Promise<string>}
 */
const buildTableDdl = async ({ connection, schemaName, tableName, logger }) => {
	const tableProps = await getTableProperties({ connection, schemaName, tableName, logger });
	const columns = await getTableColumns({ connection, schemaName, tableName, logger });
	const primaryKey = await getTablePrimaryKey({ connection, schemaName, tableName, logger });
	const uniqueConstraints = await getTableUniqueConstraints({ connection, schemaName, tableName, logger });
	const foreignKeys = await getTableForeignKeys({ connection, schemaName, tableName, logger });
	const checkConstraints = await getTableCheckConstraints({ connection, schemaName, tableName, logger });

	const isColumnStore = tableProps.IS_COLUMN_TABLE === 'TRUE';
	const isTemporary = tableProps.IS_TEMPORARY === 'TRUE';

	let ddl = '';

	// CREATE TABLE statement
	if (isTemporary) {
		ddl += `CREATE ${isColumnStore ? 'COLUMN' : 'ROW'} TEMPORARY TABLE `;
	} else {
		ddl += `CREATE ${isColumnStore ? 'COLUMN' : 'ROW'} TABLE `;
	}

	ddl += `"${schemaName}"."${tableName}" (\n`;

	// Columns
	const columnDefs = columns.map(col => {
		let colDef = `\t"${col.COLUMN_NAME}" ${col.DATA_TYPE_NAME}`;

		// Add length/precision/scale for applicable types
		if (col.LENGTH && needsLength(col.DATA_TYPE_NAME)) {
			if (col.SCALE && col.SCALE > 0) {
				colDef += `(${col.LENGTH}, ${col.SCALE})`;
			} else {
				colDef += `(${col.LENGTH})`;
			}
		}

		// Default value
		if (col.DEFAULT_VALUE) {
			colDef += ` DEFAULT ${col.DEFAULT_VALUE}`;
		}

		// Generated column
		if (col.GENERATION_TYPE) {
			colDef += ` GENERATED ${col.GENERATION_TYPE}`;
		}

		// Nullable
		if (col.IS_NULLABLE === 'FALSE') {
			colDef += ' NOT NULL';
		}

		return colDef;
	});

	ddl += columnDefs.join(',\n');

	// Primary key constraint
	if (primaryKey.length > 0) {
		const pkName = primaryKey[0].CONSTRAINT_NAME;
		const pkColumns = primaryKey.map(pk => `"${pk.COLUMN_NAME}"`).join(', ');
		ddl += `,\n\tCONSTRAINT "${pkName}" PRIMARY KEY (${pkColumns})`;
	}

	// Unique constraints
	const uniqueByName = groupBy(uniqueConstraints, 'CONSTRAINT_NAME');
	for (const [constraintName, cols] of Object.entries(uniqueByName)) {
		const uniqueColumns = cols.map(c => `"${c.COLUMN_NAME}"`).join(', ');
		ddl += `,\n\tCONSTRAINT "${constraintName}" UNIQUE (${uniqueColumns})`;
	}

	// Check constraints
	for (const check of checkConstraints) {
		ddl += `,\n\tCONSTRAINT "${check.CONSTRAINT_NAME}" CHECK (${check.CHECK_CONDITION})`;
	}

	ddl += '\n)';

	// Partition spec if exists
	if (tableProps.PARTITION_SPEC) {
		ddl += `\n${tableProps.PARTITION_SPEC}`;
	}

	ddl += ';';

	// Add foreign key constraints as ALTER TABLE statements
	const fkByName = groupBy(foreignKeys, 'CONSTRAINT_NAME');
	for (const [constraintName, fkCols] of Object.entries(fkByName)) {
		const fkColumns = fkCols.map(fk => `"${fk.COLUMN_NAME}"`).join(', ');
		const refColumns = fkCols.map(fk => `"${fk.REFERENCED_COLUMN_NAME}"`).join(', ');
		const refTable = `"${fkCols[0].REFERENCED_SCHEMA_NAME}"."${fkCols[0].REFERENCED_TABLE_NAME}"`;

		ddl += `\n\nALTER TABLE "${schemaName}"."${tableName}" ADD CONSTRAINT "${constraintName}" `;
		ddl += `FOREIGN KEY (${fkColumns}) REFERENCES ${refTable} (${refColumns})`;

		if (fkCols[0].DELETE_RULE && fkCols[0].DELETE_RULE !== 'RESTRICT') {
			ddl += ` ON DELETE ${fkCols[0].DELETE_RULE}`;
		}
		if (fkCols[0].UPDATE_RULE && fkCols[0].UPDATE_RULE !== 'RESTRICT') {
			ddl += ` ON UPDATE ${fkCols[0].UPDATE_RULE}`;
		}
		ddl += ';';
	}

	// Add table comment if exists
	if (tableProps.COMMENTS) {
		ddl += `\n\nCOMMENT ON TABLE "${schemaName}"."${tableName}" IS '${escapeString(tableProps.COMMENTS)}';`;
	}

	// Add column comments
	for (const col of columns) {
		if (col.COMMENTS) {
			ddl += `\nCOMMENT ON COLUMN "${schemaName}"."${tableName}"."${col.COLUMN_NAME}" IS '${escapeString(col.COMMENTS)}';`;
		}
	}

	return ddl;
};

/**
 * Build DDL for a view from metadata
 * @param {{ connection: Connection, schemaName: string, viewName: string, logger: Logger }}
 * @returns {Promise<string>}
 */
const buildViewDdl = async ({ connection, schemaName, viewName, logger }) => {
	const viewDef = await getViewDefinition({ connection, schemaName, viewName, logger });

	if (!viewDef.DEFINITION) {
		return `-- Could not retrieve definition for view "${schemaName}"."${viewName}"`;
	}

	let ddl = `CREATE VIEW "${schemaName}"."${viewName}" AS\n${viewDef.DEFINITION};`;

	if (viewDef.COMMENTS) {
		ddl += `\n\nCOMMENT ON VIEW "${schemaName}"."${viewName}" IS '${escapeString(viewDef.COMMENTS)}';`;
	}

	return ddl;
};

/**
 * Check if data type needs length specification
 * @param {string} dataType
 * @returns {boolean}
 */
const needsLength = dataType => {
	const typesWithLength = [
		'VARCHAR',
		'NVARCHAR',
		'CHAR',
		'NCHAR',
		'BINARY',
		'VARBINARY',
		'DECIMAL',
		'FLOAT',
		'REAL_VECTOR',
	];
	return typesWithLength.includes(dataType.toUpperCase());
};

/**
 * Escape single quotes in strings
 * @param {string} str
 * @returns {string}
 */
const escapeString = str => {
	return str ? str.replace(/'/g, "''") : str;
};

/**
 * Group array of objects by a key
 * @param {any[]} array
 * @param {string} key
 * @returns {Object}
 */
const groupBy = (array, key) => {
	return array.reduce((result, item) => {
		const groupKey = item[key];
		if (!result[groupKey]) {
			result[groupKey] = [];
		}
		result[groupKey].push(item);
		return result;
	}, {});
};

const instanceHelper = {
	getDbVersion,
	getSchemaNames,
	getSchemaProperties,
	getDatabasesWithTableNames,
	getTableDdl,
	getTableColumns,
	getTablePrimaryKey,
	getTableUniqueConstraints,
	getTableForeignKeys,
	getTableCheckConstraints,
	getTableIndexes,
	getTableProperties,
	getViewDefinition,
	getViewColumns,
	buildTableDdl,
	buildViewDdl,
};

module.exports = {
	instanceHelper,
};
