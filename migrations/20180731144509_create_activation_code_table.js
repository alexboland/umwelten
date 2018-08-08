
exports.up = function(knex, Promise) {
  return knex.schema.createTable('activation_codes', function (t) {
    t.string('oid').primary();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('activation_codes')
};
