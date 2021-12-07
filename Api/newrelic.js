'use strict';
const config = require('./config');
const NODE_ENV = config.env;
const NEW_RELIC_APP_NAME = config.newrelic.app_name;
const NEW_RELIC_LIC_KEY = config.newrelic.license_key;

exports.config = {
  app_name: [`${NEW_RELIC_APP_NAME}`],
  license_key: `${NEW_RELIC_LIC_KEY}`,
  logging: {
    level: 'info',
    enabled: NODE_ENV === 'production' || NODE_ENV === 'test'
  }
};
