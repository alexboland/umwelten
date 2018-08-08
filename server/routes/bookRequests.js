var express = require('express');
var router = express.Router();
const knex = require('knex')(require('../../knexfile'));

router.get('/list', function(req, res) {
  knex.select('requester_uuid', 'book_uuid', 'username', 'title', 'subtitle', 'author', 'publisher', 'book_requests.uuid as uuid')
    .from('book_requests')
    .innerJoin('users', 'users.uuid', '=', 'book_requests.requester_uuid')
    .innerJoin('books', 'books.uuid', '=', 'book_requests.book_uuid')
    .innerJoin('volumes', 'books.volume_uuid', '=', 'volumes.uuid')
    .where('books.owner_uuid', '=', req.session.user.uuid)
    .then(results => {
      res.send({requests: results});
    })
    .catch(err => {
      res.send({error: err, results: []});
    })
});

router.post('/reject', function(req, res){
  knex('book_requests').where('uuid', '=', req.body.request_uuid).del()
    .then(result => {
      res.send({success: true})
    })
    .catch(err => {
      res.send({success: false, error: err})
    });

});

module.exports = router;
