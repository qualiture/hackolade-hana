// This file re-exports actual DDL Provider.
// Core application needs this file to generate FE scripts

const ddlProviderModule = require('./ddlProvider/ddlProvider');

/**
 * Get DDL provider instance
 * @param {any} baseProvider
 * @param {any} options
 * @param {any} app
 * @returns {object}
 */
const getDdlProvider = (baseProvider, options, app) => {
    return ddlProviderModule(baseProvider, options, app);
};

module.exports = ddlProviderModule;
module.exports.getDdlProvider = getDdlProvider;
