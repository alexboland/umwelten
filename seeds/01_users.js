var bcrypt = require('bcrypt');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  var password = bcrypt.hashSync('password', 1)
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {'uuid': 'some-user-uuid-0', 'username': 'user', 'password': password},
        {'uuid': 'some-user-uuid-1', 'username': 'user1', 'password': password},
        {'uuid': 'some-user-uuid-2', 'username': 'user2', 'password': password},
        {'uuid': 'some-user-uuid-3', 'username': 'user3', 'password': password}
      ]);
    });
};

