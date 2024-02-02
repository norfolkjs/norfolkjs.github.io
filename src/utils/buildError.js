/**
 * BuildError
 * @param {boolean} showError
 * @param {string} errorMessage
 * @returns {void}
 *
 */
export default function buildError(errorMessage) {
    console.error(`
            
        \x1b[41m\x1b[90m Build Error: \x1b[0m
            \x1b[31m${errorMessage}
            
            \x1b[0m`);

    throw new Error(errorMessage);
}
