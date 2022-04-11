// Update with your config settings.

module.exports = {
  development: {
    client: 'mysql2',
    debug: true,
    connection: {
      host : 'mysql',
      port : 3306,
      user : 'root',
      password : 'secret',
      insecureAuth: true,
      database : 'smu'
    }
  }
};
