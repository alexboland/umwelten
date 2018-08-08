
exports.up = function(knex, Promise) {
  return knex.schema.createTable('discussions', function (t) {
    t.string('uuid').primary();
    t.string('volume_uuid').notNullable();
    t.string('title').notNullable();
    t.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('discussions')
};
