/**
 * @typedef {import('../types').Connection} Connection
 * @typedef {import('../types').ConnectionInfo} ConnectionInfo
 * @typedef {import('../types').Logger} Logger
 */

const hana = require('@sap/hana-client');

/**
 * @type {any}
 */
let connection = null;

/**
 * @param {ConnectionInfo} connectionInfo
 * @returns {object}
 */
const buildConnectionParams = connectionInfo => {
	const params = {
		serverNode: `${connectionInfo.host}:${connectionInfo.port || 443}`,
		uid: connectionInfo.userName,
		pwd: connectionInfo.userPassword,
		encrypt: connectionInfo.ssl !== false ? 'true' : 'false',
		sslValidateCertificate: connectionInfo.sslValidateCertificate !== false ? 'true' : 'false',
	};

	if (connectionInfo.database) {
		params.databaseName = connectionInfo.database;
	}

	if (connectionInfo.schema) {
		params.currentSchema = connectionInfo.schema;
	}

	// Additional connection options for HANA Cloud
	if (connectionInfo.sslCryptoProvider) {
		params.sslCryptoProvider = connectionInfo.sslCryptoProvider;
	}

	if (connectionInfo.sslTrustStore) {
		params.sslTrustStore = connectionInfo.sslTrustStore;
	}

	return params;
};

/**
 * @param {{ connectionInfo: ConnectionInfo, logger: Logger }}
 * @returns {Promise<Connection>}
 */
const createConnection = async ({ connectionInfo, logger }) => {
	const params = buildConnectionParams(connectionInfo);

	logger.info('Connecting to SAP HANA Cloud...');
	logger.info(`Host: ${params.serverNode}`);

	return new Promise((resolve, reject) => {
		const conn = hana.createConnection();

		conn.connect(params, err => {
			if (err) {
				logger.error('Connection failed:', err);
				reject(new Error(`Failed to connect to SAP HANA: ${err.message}`));
				return;
			}

			logger.info('Successfully connected to SAP HANA Cloud');

			resolve({
				/**
				 * Execute a query and return results
				 * @param {{ query: string, params?: any[] }}
				 * @returns {Promise<any[]>}
				 */
				execute: ({ query, params = [] }) => {
					return new Promise((resolve, reject) => {
						conn.exec(query, params, (err, result) => {
							if (err) {
								reject(err);
								return;
							}
							resolve(result || []);
						});
					});
				},

				/**
				 * Execute a query and return a single value
				 * @param {{ query: string, params?: any[] }}
				 * @returns {Promise<any>}
				 */
				executeScalar: ({ query, params = [] }) => {
					return new Promise((resolve, reject) => {
						conn.exec(query, params, (err, result) => {
							if (err) {
								reject(err);
								return;
							}
							const firstRow = result?.[0];
							const firstValue = firstRow ? Object.values(firstRow)[0] : null;
							resolve(firstValue);
						});
					});
				},

				/**
				 * Close the connection
				 * @returns {Promise<void>}
				 */
				close: () => {
					return new Promise(resolve => {
						conn.disconnect(err => {
							if (err) {
								logger.error('Error disconnecting:', err);
							}
							resolve();
						});
					});
				},

				/**
				 * Get the raw connection object
				 * @returns {any}
				 */
				getRawConnection: () => conn,
			});
		});
	});
};

/**
 * @param {{ connectionInfo: ConnectionInfo, logger: Logger }}
 * @returns {Promise<Connection>}
 */
const connect = async ({ connectionInfo, logger }) => {
	if (connection) {
		return connection;
	}
	connection = await createConnection({ connectionInfo, logger });
	return connection;
};

/**
 * @returns {Promise<void>}
 */
const disconnect = async () => {
	if (connection) {
		await connection.close();
		connection = null;
	}
};

const connectionHelper = {
	connect,
	disconnect,
};

module.exports = {
	connectionHelper,
};
