
exports.up = function(knex, Promise) {
  return knex.schema.createTable('direct_messages', function (t) {
    t.string('uuid').primary();
    t.string('sender_uuid').notNullable();
    t.string('conversation_uuid');
    t.binary('content').notNullable();
    t.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('direct_messages');
};
