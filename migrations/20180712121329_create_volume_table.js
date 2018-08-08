
exports.up = function(knex, Promise) {
  return knex.schema.createTable('volumes', function (t) {
    t.string('uuid').primary();
    t.string('google_volume');
    t.unique('google_volume');
    t.string('title');
    t.string('author');
    t.string('publisher');
    t.string('ISBN');
    t.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('volumes')
};
