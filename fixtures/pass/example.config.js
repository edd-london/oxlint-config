// CommonJS config file, allowed by the base override on *.config.js and *.cjs.
const shared = require('./shared-settings.cjs');

module.exports = {
  ...shared,
  verbose: true,
};
