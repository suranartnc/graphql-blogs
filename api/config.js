module.exports = {
  development: {
    isProduction: false,
    host: 'localhost',
    port: 3002,
    mongoConnectionString: 'mongodb://localhost:27017/blog',
  },
  production: {
    isProduction: true,
    host: 'localhost',
    port: process.env.PORT || 3002,
    mongoConnectionString: 'mongodb://localhost:27017/blog',
  },
}[process.env.NODE_ENV || 'development']
