module.exports = {
  client: 'mysql',
  connection: {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.CLEARDB_DATABASE_URL
  }
}