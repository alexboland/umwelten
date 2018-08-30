var express = require('express');
var router = express.Router();
var request = require('request')
const knex = require('knex')(require('../../knexfile'));
const uuidv4 = require('uuid/v4');

router.post('/add', function(req, res) {
  knex('volumes').where('google_volume', req.body.volumeId)
    .then(([volume]) => {
      if (volume) {
        return new Promise((resolve, reject) => {
          knex('books').where({owner_uuid: req.session.user.uuid, volume_uuid: volume.uuid}).then(([book]) => {
            if (book) {
              resolve({alreadyAdded: true, uuid: volume.uuid});
            } else {
              resolve({alreadyAdded: false, uuid: volume.uuid});
            }
          })
        })
      } else {
        let uuid = uuidv4();
        return new Promise((resolve, reject) => {
          knex('volumes')
            .insert({uuid: uuid, google_volume: req.body.volumeId, title: req.body.title, subtitle: req.body.subtitle, author: req.body.author, publisher: req.body.publisher, ISBN: req.body.ISBN})
            .then(result => {
              resolve({uuid: uuid})
            })
        })
      }
    })
    .then(result => {
      if (result.alreadyAdded) {
        return new Promise((resolve, reject) => { resolve({notice: 'already added'}) })
      } else {
        return knex('books').insert({uuid: uuidv4(), volume_uuid: result.uuid, owner_uuid: req.session.user.uuid, current_user_uuid: req.session.user.uuid})
      }
    })
    .then(function(results){
      res.send({success: true, notice: results.notice})
    })
    .catch(err => {
      res.send({error: err, success: false})
    });
});

router.post('/remove', function(req, res) {
  knex('books').where('uuid', '=', req.body.book).del()
    .then(result => {
      res.send({success: true});
    })
    .catch(err => {
      res.send({success: false, error: err});
    })
});

router.get('/list', function(req, res) {
  let limit = req.query.perPage;
  let page = req.query.page || 0;
  let orderBy = 'title';
  let direction = 'ASC';
  let getBooks = knex.select('volumes.uuid as volume_uuid', 'title', 'subtitle', 'author', 'publisher',
    knex.raw("GROUP_CONCAT(CONCAT_WS(',', username, owner_uuid) SEPARATOR '|') AS book_links"))
    .from('volumes')

  let getTotal = knex('volumes');

  if (req.query.title) {
    let titleSearch = "volumes.title LIKE '%" + req.query.title +
      "%' OR volumes.subtitle LIKE '%" + req.query.title + "%'";
    getBooks = getBooks.whereRaw(titleSearch);
    getTotal = getTotal.whereRaw(titleSearch);
  } else if (req.query.author) {
    let authorSearch = "volumes.author LIKE '%" + req.query.author + "%'";
    getBooks = getBooks.whereRaw(authorSearch);
    getTotal = getTotal.whereRaw(authorSearch);
  }

  getBooks = getBooks
    .limit(limit)
    .offset(page*limit)
    .leftOuterJoin('books', 'volumes.uuid', '=', 'books.volume_uuid')
    .joinRaw("LEFT OUTER JOIN users ON users.uuid = books.owner_uuid OR (users.uuid IS NULL AND books.owner_uuid IS NULL)")
    .orderBy(orderBy, direction)
    .groupBy('volumes.uuid');

  getTotal = getTotal.count('*');



  Promise.all([getBooks, getTotal]).then(([books, total]) => {
    res.send({books: books, total: total[0]['count(*)'], page: page});
  })
});

router.post('/borrow', function(req, res){
  knex('books').where('uuid', req.body.book)
    .then(([book]) => {
      if(book.owner_uuid !== book.current_user_uuid) { return Promise.reject('Book is currently unavailable'); }
    })
    .then(() => {
      return knex('book_requests').insert({uuid: uuidv4(), requester_uuid: req.session.user.uuid, book_uuid: req.body.book})
    })
    .then((results) => {
      res.send({success: true})
    })
    .catch(err => {
      console.log('error: ' + err);
      res.send({success: false})
    })
});

router.post('/lend', function(req, res){
  knex('books').select().where('uuid', '=', req.body.book_uuid).limit(1)
    .then( ([book]) => {
      if (book.current_user_uuid !== book.owner_uuid) {
        return Promise.reject('Book has already been lent');
      } else {
        return knex('books').where('uuid', '=', req.body.book_uuid).update('current_user_uuid', req.body.user_uuid);
      }
    })
    .then(results => {
      return knex('book_requests').select('book_requests').where('book_uuid', '=', req.body.book_uuid).del();
    })
    .then(results => {
      res.send({success: true});
    })
    .catch(err => {
      console.log(err);
      res.send({success: false})
    });
});

router.get('/borrowed', function(req, res){
  knex.select('books.uuid as book_uuid', 'books.owner_uuid', 'volumes.title', 'volumes.subtitle', 'volumes.author',
    'volumes.publisher', 'users.username', 'users.uuid as user_uuid')
    .from('books').where('current_user_uuid', '=', req.session.user.uuid)
    .innerJoin('volumes', 'volumes.uuid', '=', 'books.volume_uuid')
    .innerJoin('users', 'users.uuid', '=', 'owner_uuid')
    .where('owner_uuid', '!=', req.session.user.uuid)
    .then(results => {
      res.send({books: results})
    })
    .catch(err => {
      res.send({books: [], error: err})
    });
});

router.post('/return', function(req, res){
  knex.raw('update books set current_user_uuid = owner_uuid where uuid ="' + req.body.book_uuid + '"')
    .then(response => {
      res.send({success: true});
    })
    .catch(err => {
      res.send({success: false, error: err})
    })
})

module.exports = router;
