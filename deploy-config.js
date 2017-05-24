/* eslint-disable arrow-body-style */

// Configuration for Lucify's GitHub and Flowdock deployment notifications

const lucifyDeployConfig = require('lucify-deploy-config').default; // eslint-disable-line

const opts = {
  baseUrl: (_env) => {
    // TODO
    return 'https://protected.lucify.com';
  },
  publicPath: (_env) => {
    return '/';
  },
};

const env = process.env.CIRCLE_BRANCH === 'master' ? process.env.LUCIFY_ENV || 'staging'
  : process.env.LUCIFY_ENV || process.env.NODE_ENV || 'development';

module.exports = lucifyDeployConfig(env, opts);
