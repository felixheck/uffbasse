const bounce = require('bounce')

/**
 * @function
 * @public
 *
 * Handles promises in a save way and returns `[err, result]`.
 * In case of success:
 *  `err = null` and `result = result`.
 * In case of an error matching `is`:
 *  `err = err` and `result = undefined`.
 * In case of an error not matching `is`:
 *  `err = null` and `result = defaults`.
 *  Error gets logged with `log`.
 *
 * @param {Promise} promise The promise to be handled
 * @param {*} [defaults=undefined] The default result for non-matching errors
 * @param {Function} [log=console.error] The log function for non-matching errors
 * @param {Function} [is=bounce.isSystem] The error check function
 *
 * @returns {Array} The result array with `length = 2`
 */
module.exports = (promise, { defaults = undefined, log = console.error, is = bounce.isSystem } = {}) => (
  promise
    .then(data => [null, data])
    .catch(err => is(err) ? [err, undefined] : (log(err), [null, defaults]))
)
