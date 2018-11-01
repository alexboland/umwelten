
exports.up = function(knex, Promise) {
  return knex.schema.createTable('conversations', function (t) {
    t.string('uuid').primary();
    t.string('subject');
    t.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('conversations');
};
