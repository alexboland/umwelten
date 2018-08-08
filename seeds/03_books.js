
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('books').del()
    .then(function () {
      // Inserts seed entries
      return knex('books').insert([
        {'uuid': 'some-book-uuid-0', 'owner_uuid': 'some-user-uuid-0', 'current_user_uuid': 'some-user-uuid-0', 'volume_uuid': 'some-volume-uuid-0'},
        {'uuid': 'some-book-uuid-1', 'owner_uuid': 'some-user-uuid-1', 'current_user_uuid': 'some-user-uuid-1', 'volume_uuid': 'some-volume-uuid-0'},
        {'uuid': 'some-book-uuid-2', 'owner_uuid': 'some-user-uuid-2', 'current_user_uuid': 'some-user-uuid-2', 'volume_uuid': 'some-volume-uuid-0'},
        {'uuid': 'some-book-uuid-3', 'owner_uuid': 'some-user-uuid-0', 'current_user_uuid': 'some-user-uuid-0', 'volume_uuid': 'some-volume-uuid-1'},
        {'uuid': 'some-book-uuid-4', 'owner_uuid': 'some-user-uuid-2', 'current_user_uuid': 'some-user-uuid-2', 'volume_uuid': 'some-volume-uuid-1'},
        {'uuid': 'some-book-uuid-5', 'owner_uuid': 'some-user-uuid-3', 'current_user_uuid': 'some-user-uuid-3', 'volume_uuid': 'some-volume-uuid-2'}
      ]);
    });
};
