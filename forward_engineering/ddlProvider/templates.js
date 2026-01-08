/**
 * SAP HANA Cloud DDL Templates
 */
module.exports = {
	createSchema: 'CREATE SCHEMA ${schemaName};',

	createTable: 'CREATE${tableType} TABLE${ifNotExists} ${name}${tableProps}${tableOptions};',

	createColumnTable: 'CREATE COLUMN TABLE${ifNotExists} ${name}${tableProps}${tableOptions};',

	createRowTable: 'CREATE ROW TABLE${ifNotExists} ${name}${tableProps}${tableOptions};',

	comment: '\nCOMMENT ON ${objectType} ${objectName} IS ${comment};\n',

	createTableProps: '${columns}${keyConstraints}${checkConstraints}${foreignKeyConstraints}',

	columnDefinition: '${name}${type}${default}${constraints}',

	createForeignKey:
		'ALTER TABLE ${foreignTable} ADD CONSTRAINT ${name} FOREIGN KEY (${foreignKey}) REFERENCES ${primaryTable} (${primaryKey})${onDelete};',

	createForeignKeyConstraint:
		'${name} FOREIGN KEY (${foreignKey}) REFERENCES ${primaryTable} (${primaryKey})${onDelete}',

	checkConstraint: '${name}CHECK (${expression})',

	createKeyConstraint: '${constraintName}${keyType}${columns}${options}',

	createView: 'CREATE${orReplace} VIEW ${name}${viewProperties}\n\tAS ${selectStatement};',

	viewSelectStatement: 'SELECT ${keys}\n\tFROM ${tableName}',

	createIndex: 'CREATE${indexType} INDEX${indexName} ON ${indexTableName}${indexOptions};\n',

	dropTable: 'DROP TABLE ${name};',

	dropView: 'DROP VIEW ${name};',

	dropSchema: 'DROP SCHEMA ${schemaName} CASCADE;',

	dropIndex: 'DROP INDEX ${indexName};',
};
