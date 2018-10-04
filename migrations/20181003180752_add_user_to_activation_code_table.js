
exports.up = function(knex, Promise) {
  return knex.schema.table('activation_codes', function (t) {
    t.string('user_uuid');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('activation_codes', function (t) {
    t.dropColumn('user_uuid');
  })
};
