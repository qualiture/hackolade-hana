const { isNumber, toUpper } = require('lodash');
const { DATA_TYPES_WITH_LENGTH, DATA_TYPES_WITH_PRECISION, DATA_TYPE } = require('../../../../constants/types');

/**
 * @param {{ type: string, length: number }}
 * @returns {string}
 */
const addLength = ({ type, length }) => {
	return ` ${type}(${length})`;
};

/**
 * @param {{ type: string, precision: number, scale: number }}
 * @returns {string}
 */
const addScalePrecision = ({ type, precision, scale }) => {
	if (isNumber(scale)) {
		return ` ${type}(${precision ? precision : '*'},${scale})`;
	}

	if (isNumber(precision)) {
		return ` ${type}(${precision})`;
	}

	return ` ${type}`;
};

/**
 * @param {{ type: string, precision: number }}
 * @returns {string}
 */
const addPrecision = ({ type, precision }) => {
	if (isNumber(precision)) {
		return ` ${type}(${precision})`;
	}
	return ` ${type}`;
};

/**
 * @param {{ dimension: number }}
 * @returns {string}
 */
const getRealVectorType = ({ dimension }) => {
	if (isNumber(dimension) && dimension > 0) {
		return ` REAL_VECTOR(${dimension})`;
	}
	return ' REAL_VECTOR';
};

/**
 * @param {{ srid: number }}
 * @returns {string}
 */
const getSpatialType = ({ type, srid }) => {
	if (isNumber(srid) && srid > 0) {
		return ` ${type}(${srid})`;
	}
	return ` ${type}`;
};

const canHaveLength = ({ type }) => DATA_TYPES_WITH_LENGTH.includes(type);

const canHavePrecision = ({ type }) => DATA_TYPES_WITH_PRECISION.includes(type);

const canHaveScale = ({ type }) => type === DATA_TYPE.decimal || type === DATA_TYPE.smalldecimal;

const isRealVector = ({ type }) => type === DATA_TYPE.real_vector;

const isSpatialType = ({ type }) =>
	[
		DATA_TYPE.st_geometry,
		DATA_TYPE.st_point,
		DATA_TYPE.st_circularstring,
		DATA_TYPE.st_linestring,
		DATA_TYPE.st_polygon,
		DATA_TYPE.st_multipoint,
		DATA_TYPE.st_multilinestring,
		DATA_TYPE.st_multipolygon,
		DATA_TYPE.st_geometrycollection,
	].includes(type);

const getColumnType = ({
	type,
	length,
	precision,
	scale,
	dimension,
	srid,
	isUDTRef,
	schemaName,
}) => {
	const hasLength = isNumber(length);

	switch (true) {
		case hasLength && canHaveLength({ type }):
			return addLength({ type, length });
		case canHavePrecision({ type }) && canHaveScale({ type }):
			return addScalePrecision({ type, precision, scale });
		case canHavePrecision({ type }) && isNumber(precision):
			return addPrecision({ type, precision });
		case isRealVector({ type }):
			return getRealVectorType({ dimension });
		case isSpatialType({ type }):
			return getSpatialType({ type, srid });
		case !!(isUDTRef && schemaName):
			return ` "${schemaName}"."${type}"`;
		default:
			return ` ${type}`;
	}
};

module.exports = {
	getColumnType,
};
