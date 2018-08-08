
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (t) {
    t.string('uuid').primary();
    t.string('username').notNullable();
    t.unique('username');
    t.string('password');
    t.string('salt');
    t.string('full_name')
    t.string('email_address');
    t.unique('email_address');
    t.string('bio');
    t.string('location');
    t.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users')
};
