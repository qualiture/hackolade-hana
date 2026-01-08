/**
 * Get SAP HANA table type modifier
 * @param {{ columnStore?: boolean, rowStore?: boolean, temporary?: boolean, globalTemporary?: boolean }}
 * @returns {string}
 */
const getTableType = ({ columnStore, rowStore, temporary, globalTemporary }) => {
	const parts = [];

	// Column store vs row store (default is column store in HANA Cloud)
	if (rowStore) {
		parts.push('ROW');
	} else if (columnStore !== false) {
		parts.push('COLUMN');
	}

	// Temporary table types
	if (globalTemporary) {
		parts.push('GLOBAL TEMPORARY');
	} else if (temporary) {
		parts.push('LOCAL TEMPORARY');
	}

	return parts.length > 0 ? ' ' + parts.join(' ') : '';
};

module.exports = {
	getTableType,
};
