
exports.up = function(knex, Promise) {
  return knex.schema.table('books', function (t) {
    t.unique(['volume_uuid', 'owner_uuid']);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('books', function (t) {
    t.dropUnique(['volume_uuid', 'owner_uuid']);
  })
};
