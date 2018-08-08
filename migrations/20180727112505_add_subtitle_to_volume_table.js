
exports.up = function(knex, Promise) {
  return knex.schema.table('volumes', function (t) {
    t.string('subtitle');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('volumes', function (t) {
    t.dropColumn('subtitle');
  })
};
