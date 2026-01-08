/**
 * SAP HANA Cloud Forward Engineering API
 * @typedef {import('../shared/types').App} App
 * @typedef {import('../shared/types').AppLogger} AppLogger
 * @typedef {import('../shared/types').Callback} Callback
 */

const { getDdlProvider } = require('./ddlProvider');
const { logHelper } = require('../shared/helpers/logHelper');

/**
 * Get DDL provider instance
 * @param {App} app
 * @returns {object}
 */
const getProvider = app => {
	return getDdlProvider(null, null, app);
};

/**
 * Generate DDL script for entities (tables)
 * @param {object} data - Model data from Hackolade
 * @param {AppLogger} logger
 * @param {Callback} callback
 * @param {App} app
 */
const generateScript = (data, logger, callback, app) => {
	try {
		const provider = getProvider(app);
		const script = generateDdlScript({ data, provider, logger });
		callback(null, script);
	} catch (error) {
		logger.log('error', { message: error.message, stack: error.stack }, 'Forward Engineering Error');
		callback(error);
	}
};

/**
 * Generate DDL script for a view
 * @param {object} data
 * @param {AppLogger} logger
 * @param {Callback} callback
 * @param {App} app
 */
const generateViewScript = (data, logger, callback, app) => {
	try {
		const provider = getProvider(app);
		const script = generateViewDdl({ data, provider, logger });
		callback(null, script);
	} catch (error) {
		logger.log('error', { message: error.message, stack: error.stack }, 'Forward Engineering Error');
		callback(error);
	}
};

/**
 * Generate DDL script for a container (schema)
 * @param {object} data
 * @param {AppLogger} logger
 * @param {Callback} callback
 * @param {App} app
 */
const generateContainerScript = (data, logger, callback, app) => {
	try {
		const provider = getProvider(app);
		const schemaData = provider.hydrateSchema(data.containerData?.[0] || {}, data);
		const script = provider.createSchema(schemaData);
		callback(null, script);
	} catch (error) {
		logger.log('error', { message: error.message, stack: error.stack }, 'Forward Engineering Error');
		callback(error);
	}
};

/**
 * Get list of databases (schemas) - used for applying DDL to instance
 * @param {object} connectionInfo
 * @param {AppLogger} logger
 * @param {Callback} callback
 * @param {App} app
 */
const getDatabases = async (connectionInfo, logger, callback, app) => {
	try {
		const { connectionHelper } = require('../shared/helpers/connectionHelper');
		const { instanceHelper } = require('../shared/helpers/instanceHelper');
		const log = logHelper.createLogger({
			title: 'Get databases',
			hiddenKeys: connectionInfo.hiddenKeys,
			logger,
		});

		const connection = await connectionHelper.connect({ connectionInfo, logger: log });
		const schemas = await instanceHelper.getSchemaNames({ connection });
		await connectionHelper.disconnect();

		callback(null, schemas);
	} catch (error) {
		logger.log('error', { message: error.message, stack: error.stack }, 'Get Databases Error');
		callback(error);
	}
};

/**
 * Apply DDL script to a SAP HANA instance
 * @param {object} connectionInfo
 * @param {AppLogger} logger
 * @param {Callback} callback
 * @param {App} app
 */
const applyToInstance = async (connectionInfo, logger, callback, app) => {
	try {
		const { connectionHelper } = require('../shared/helpers/connectionHelper');
		const log = logHelper.createLogger({
			title: 'Apply to instance',
			hiddenKeys: connectionInfo.hiddenKeys,
			logger,
		});

		const script = connectionInfo.script;
		if (!script) {
			callback(new Error('No script provided to apply'));
			return;
		}

		const connection = await connectionHelper.connect({ connectionInfo, logger: log });

		// Split script into individual statements and execute
		const statements = splitStatements(script);
		for (const statement of statements) {
			if (statement.trim()) {
				log.info(`Executing: ${statement.substring(0, 100)}...`);
				await connection.execute({ query: statement });
			}
		}

		await connectionHelper.disconnect();
		callback(null);
	} catch (error) {
		logger.log('error', { message: error.message, stack: error.stack }, 'Apply to Instance Error');
		callback(error);
	}
};

/**
 * Test connection to SAP HANA instance
 * @param {object} connectionInfo
 * @param {AppLogger} logger
 * @param {Callback} callback
 * @param {App} app
 */
const testConnection = async (connectionInfo, logger, callback, app) => {
	try {
		const { connectionHelper } = require('../shared/helpers/connectionHelper');
		const { instanceHelper } = require('../shared/helpers/instanceHelper');
		const log = logHelper.createLogger({
			title: 'Test connection',
			hiddenKeys: connectionInfo.hiddenKeys,
			logger,
		});

		const connection = await connectionHelper.connect({ connectionInfo, logger: log });
		const version = await instanceHelper.getDbVersion({ connection });
		await connectionHelper.disconnect();

		log.info(`Successfully connected to SAP HANA. Version: ${version}`);
		callback(null);
	} catch (error) {
		logger.log('error', { message: error.message, stack: error.stack }, 'Test Connection Error');
		callback(error);
	}
};

/**
 * Check if DROP statements should be included
 * @param {object} data
 * @param {AppLogger} logger
 * @param {Callback} callback
 * @param {App} app
 */
const isDropInStatements = (data, logger, callback, app) => {
	callback(null, data.options?.additionalOptions?.some(opt => opt.id === 'dropStatements' && opt.value));
};

// ============ Helper Functions ============

/**
 * Generate DDL script from model data
 * @param {{ data: object, provider: object, logger: object }}
 * @returns {string}
 */
const generateDdlScript = ({ data, provider, logger }) => {
	const scripts = [];

	// Generate schema if container data exists
	if (data.containerData?.[0]?.name) {
		const schemaData = provider.hydrateSchema(data.containerData[0], data);
		scripts.push(provider.createSchema(schemaData));
	}

	const schemaData = {
		schemaName: data.containerData?.[0]?.name || '',
	};

	// Generate tables
	if (data.entities) {
		for (const entity of data.entities) {
			const tableScript = generateTableDdl({ entity, schemaData, provider, data });
			if (tableScript) {
				scripts.push(tableScript);
			}
		}
	}

	// Generate views
	if (data.views) {
		for (const view of data.views) {
			const viewScript = generateViewDdl({ data: { ...view, schemaData }, provider, logger });
			if (viewScript) {
				scripts.push(viewScript);
			}
		}
	}

	// Generate relationships (foreign keys)
	if (data.relationships) {
		for (const relationship of data.relationships) {
			const fkScript = generateForeignKeyDdl({ relationship, schemaData, provider, data });
			if (fkScript) {
				scripts.push(fkScript);
			}
		}
	}

	return scripts.filter(Boolean).join('\n\n');
};

/**
 * Generate DDL for a single table
 * @param {{ entity: object, schemaData: object, provider: object, data: object }}
 * @returns {string}
 */
const generateTableDdl = ({ entity, schemaData, provider, data }) => {
	if (!entity.properties) {
		return '';
	}

	const columns = [];
	const columnDefinitions = [];

	for (const [columnName, columnDef] of Object.entries(entity.properties)) {
		const hydratedColumn = provider.hydrateColumn({
			columnDefinition: {
				name: columnName,
				nullable: columnDef.required !== true,
				default: columnDef.default,
				isActivated: columnDef.isActivated !== false,
				scale: columnDef.scale,
				precision: columnDef.precision,
				length: columnDef.length,
			},
			jsonSchema: columnDef,
			schemaData,
		});

		const columnStatement = provider.convertColumnDefinition(hydratedColumn);
		columns.push({ statement: columnStatement, isActivated: hydratedColumn.isActivated });
		columnDefinitions.push(hydratedColumn);
	}

	const tableData = provider.hydrateTable({
		tableData: {
			name: entity.collectionName || entity.name,
			columns,
			columnDefinitions,
		},
		entityData: [entity.entityLevel || {}],
		jsonSchema: entity,
	});

	return provider.createTable(
		{
			...tableData,
			schemaData,
			keyConstraints: tableData.keyConstraints || [],
			checkConstraints: [],
			foreignKeyConstraints: [],
		},
		entity.isActivated !== false,
	);
};

/**
 * Generate DDL for a view
 * @param {{ data: object, provider: object, logger: object }}
 * @returns {string}
 */
const generateViewDdl = ({ data, provider, logger }) => {
	if (!data.name) {
		return '';
	}

	const viewData = provider.hydrateView({
		viewData: {
			name: data.name,
			keys: data.keys || [],
			tableName: data.tableName,
			schemaData: data.schemaData || { schemaName: '' },
		},
		entityData: [data.entityLevel || {}],
	});

	return provider.createView(viewData, {}, data.isActivated !== false);
};

/**
 * Generate DDL for foreign key relationship
 * @param {{ relationship: object, schemaData: object, provider: object, data: object }}
 * @returns {string}
 */
const generateForeignKeyDdl = ({ relationship, schemaData, provider, data }) => {
	const { statement } = provider.createForeignKey(
		{
			name: relationship.name,
			foreignTable: relationship.childCollection,
			foreignKey: relationship.childField,
			primaryTable: relationship.parentCollection,
			primaryKey: relationship.parentField,
			foreignSchemaName: schemaData.schemaName,
			primarySchemaName: schemaData.schemaName,
			primaryTableActivated: true,
			foreignTableActivated: true,
		},
		{},
		schemaData,
	);

	return statement;
};

/**
 * Split DDL script into individual statements
 * @param {string} script
 * @returns {string[]}
 */
const splitStatements = script => {
	// Split by semicolon, but be careful with strings
	const statements = [];
	let current = '';
	let inString = false;
	let stringChar = '';

	for (let i = 0; i < script.length; i++) {
		const char = script[i];

		if (!inString && (char === "'" || char === '"')) {
			inString = true;
			stringChar = char;
		} else if (inString && char === stringChar) {
			// Check for escaped quote
			if (i + 1 < script.length && script[i + 1] === stringChar) {
				current += char;
				i++;
			} else {
				inString = false;
			}
		}

		if (char === ';' && !inString) {
			statements.push(current.trim());
			current = '';
		} else {
			current += char;
		}
	}

	if (current.trim()) {
		statements.push(current.trim());
	}

	return statements.filter(s => s.length > 0);
};

module.exports = {
	generateScript,
	generateViewScript,
	generateContainerScript,
	getDatabases,
	applyToInstance,
	testConnection,
	isDropInStatements,
};
