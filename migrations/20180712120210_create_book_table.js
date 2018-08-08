
exports.up = function(knex, Promise) {
  return knex.schema.createTable('books', function (t) {
    t.string('uuid').primary();
    t.string('volume_uuid').notNullable();
    t.string('owner_uuid').notNullable();
    t.string('current_user_uuid').notNullable();
    t.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('books')
};
