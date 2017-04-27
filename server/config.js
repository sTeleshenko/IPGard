const config = {
  environment: process.env.NODE_ENV || 'dev',
  server: {
    port: process.env.PORT || 8080
  },
  mongo: {
    url: process.env.NODE_ENV === 'prod' ? 'mongodb://localhost/ipgard' : 'mongodb://localhost/ipgard'
  },
  secrets: {
    session: 'ipgard-secret'
  },
  userRoles: ['admin', 'productionAdmin', 'productionUser', 'salesAdmin', 'salesUser', 'support']
};
module.exports = config;
