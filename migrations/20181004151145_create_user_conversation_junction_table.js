
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user_conversation_junctions', function (t) {
    t.string('user_uuid');
    t.string('conversation_uuid');
    t.boolean('unread_messages');
    t.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('user_conversation_junctions');
};
