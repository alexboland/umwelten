
exports.up = function(knex, Promise) {
  return knex.schema.createTable('book_requests', function (t) {
    t.string('uuid').primary();
    t.string('book_uuid').notNullable();
    t.string('requester_uuid').notNullable();
    t.string('status').notNullable().defaultTo('pending');
    t.unique(['requester_uuid', 'book_uuid']);
    t.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('book_requests')
};