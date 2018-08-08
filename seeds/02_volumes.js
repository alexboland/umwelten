
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('volumes').del()
    .then(function () {
      // Inserts seed entries
      return knex('volumes').insert([
        {'uuid': 'some-volume-uuid-0', 'google_volume': '1jFFAQAAIAAJ', 'title': 'The Bork report'},
        {'uuid': 'some-volume-uuid-1', 'google_volume': 'Oi-muAAACAAJ', 'title': 'Bloop, Bloop! Goes the Poop'}
      ]);
    });
};
