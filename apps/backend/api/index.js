// Vercel serverless function entry point
process.env.NODE_ENV = 'production';
process.env.VERCEL = '1';

const app = require('../dist/index.js').default;

module.exports = app;
