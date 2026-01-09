/**
 * SSO Helper for SAP HANA Cloud Identity Provider authentication
 * 
 * SAP HANA Cloud supports SAML-based SSO through external browser authentication.
 * This module provides utilities to initiate the SSO authentication flow.
 */

const axios = require('axios');

const ssoAuthenticatorError = { message: "Can't get SSO URL. Please check your HANA Cloud SAML configuration" };

/**
 * Gets the SSO URL data for external browser authentication
 * 
 * SAP HANA Cloud uses SAML 2.0 for browser-based SSO. The authentication flow:
 * 1. Client requests the IdP login URL from HANA Cloud
 * 2. User authenticates via browser with the IdP
 * 3. IdP returns SAML assertion to HANA Cloud
 * 4. HANA Cloud validates and establishes session
 * 
 * @param {object} logger - Logger instance
 * @param {object} options - Connection options
 * @param {string} options.host - HANA Cloud host
 * @param {number} options.port - HANA Cloud port (default 443)
 * @param {number} options.redirectPort - Local redirect port for SSO callback (default 8080)
 * @returns {Promise<{url: string, proofKey: string}>}
 */
const getSsoUrlData = async (logger, { host, port = 443, redirectPort = 8080 }) => {
    const baseUrl = `https://${host}:${port}`;

    logger.info('Starting SSO connection...');
    logger.info(`Base URL: ${baseUrl}`);

    try {
        // SAP HANA Cloud SSO endpoint - request SAML authentication URL
        // The exact endpoint may vary based on HANA Cloud configuration
        const ssoResponse = await axios.post(
            `${baseUrl}/sap/hana/xs/formLogin/token.xsjs`,
            {
                action: 'getSamlUrl',
                redirectPort: redirectPort,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                httpsAgent: new (require('https').Agent)({
                    rejectUnauthorized: true,
                }),
            }
        );

        const ssoUrl = ssoResponse.data?.samlUrl || ssoResponse.data?.url || '';
        const proofKey = ssoResponse.data?.proofKey || ssoResponse.data?.token || '';

        logger.info(`SSO URL: ${ssoUrl}`);

        if (!ssoUrl) {
            // Fallback: Construct the SSO URL directly for HANA Cloud
            // HANA Cloud typically uses the web IDE login endpoint for SAML
            const fallbackUrl = `${baseUrl}/sap/hana/ide/core/plugins/auth/samlLogin.html?redirect_uri=http://localhost:${redirectPort}/callback`;

            logger.info(`Using fallback SSO URL: ${fallbackUrl}`);

            return {
                url: fallbackUrl,
                proofKey: generateProofKey(),
            };
        }

        return { url: ssoUrl, proofKey };
    } catch (error) {
        logger.error(`Failed to get SSO URL: ${error.message}`);

        // For HANA Cloud, we can construct a direct SAML login URL
        // This URL pattern is used by SAP HANA Cloud Central for SSO
        const fallbackUrl = `${baseUrl}/sap/hana/xs/saml/login.xscfunc?redirect=http://localhost:${redirectPort}/callback`;

        logger.info(`Using fallback SSO URL after error: ${fallbackUrl}`);

        return {
            url: fallbackUrl,
            proofKey: generateProofKey(),
        };
    }
};

/**
 * Generate a proof key for SSO validation
 * @returns {string}
 */
const generateProofKey = () => {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('base64url');
};

/**
 * Get the HANA Cloud base URL from host
 * @param {string} host - HANA Cloud host
 * @param {number} port - Port number
 * @returns {string}
 */
const getBaseUrl = (host, port = 443) => {
    return `https://${host}:${port}`;
};

module.exports = {
    getSsoUrlData,
    getBaseUrl,
    ssoAuthenticatorError,
};
