var express = require('express');
const knex = require('knex')(require('../knexfile'));

module.exports.getBooksForUser = function (user, requestingUser) {
  return knex
    .select('owner.uuid as user_uuid', 'owner.username', 'books.uuid as book_uuid', 'volumes.uuid as volume_uuid',
      'volumes.title', 'volumes.subtitle', 'volumes.author', 'volumes.publisher', 'current_user_uuid',
      'borrowers.username as borrower', 'book_requests.uuid as request_uuid')
    .from('users as owner')
    .innerJoin('books', 'owner.uuid', '=', 'books.owner_uuid')
    .innerJoin('users as borrowers', 'books.current_user_uuid', '=', 'borrowers.uuid')
    .innerJoin('volumes', 'books.volume_uuid', '=', 'volumes.uuid')
    .joinRaw('LEFT OUTER JOIN book_requests ON book_requests.book_uuid = books.uuid AND book_requests.requester_uuid = "' + requestingUser + '"')
    .where('books.owner_uuid', '=', user)
}