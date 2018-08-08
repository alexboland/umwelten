
exports.up = function(knex, Promise) {
  return knex.schema.createTable('comments', function (t) {
    t.string('uuid').primary();
    t.string('discussion_uuid').notNullable();
    t.string('author_uuid').notNullable();
    t.text('text').notNullable();
    t.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('comments')
};
