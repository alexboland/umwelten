var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const knex = require('knex')(require('../../knexfile'));
const uuidv4 = require('uuid/v4');
const bookLib = require('../../lib/books');

router.get('/profile/:user', function(req, res) {
  knex('users').where('uuid', '=', req.params.user)
    .then(([user]) => {
      res.send({user: user})
    })
    .catch(err => {
      res.send({error: err})
    })
});

router.post('/profile/update', function(req, res) {
  knex('users')
    .where('uuid', '=', req.body.uuid)
    .update({full_name: req.body.fullName, bio: req.body.bio, location: req.body.location})
    .then(results => {
      res.send({success: true})
    })
    .catch(err => {
      res.send({success: false, error: err})
    })
});

router.post('/new', function(req, res, next) {

  var SALT_WORK_FACTOR = 10;

  knex('activation_codes').where({oid: req.body.activationCode})
    .then(([activation_code]) => {
      if (activation_code) {
        return knex('activation_codes').where('oid', '=', req.body.activationCode).del();
      } else {
        throw('invalid activation code')
      }
    })
    .then(result => {
      return knex('users').where('username', req.body.username)
    })
    .then( ([user]) => {
      if (user) {
        throw('username taken');
      } else if (req.body.password != req.body.repeatPassword) {
        throw("password entries didn't match")
      } else {
        return bcrypt.genSalt(SALT_WORK_FACTOR)
      }
    })
    .then(salt => {
      return Promise.all([bcrypt.hash(req.body.password, salt), salt])
    })
    .then( ([hash, salt]) => {
      return knex('users').insert({uuid: uuidv4(), username: req.body.username, password: hash, salt: salt, email_address: req.body.emailAddress});
    })
    .then(result => {
      return knex('users').where({username: req.body.username})
    })
    .then(([user]) => {
      req.session.user = user;
      res.send({success: true, user: user})
    })
    .catch(err => {
      res.send({success: false, error: err})
    })
});

router.get('/books/:user', function(req, res) {

  let page = req.query.page || 0;
  let limit = req.query.perPage || 20;
  let orderBy = req.query.orderBy || 'volumes.title';
  let direction = req.query.direction || 'ASC';

  let getBooks = bookLib.getBooksForUser(req.params.user, req.session.user.uuid)
    .limit(limit)
    .offset(page*limit)
    .orderBy(orderBy, direction);

  let getTotal = knex('books').where({owner_uuid: req.session.user.uuid}).count('*');

  Promise.all([getBooks, getTotal])
    .then(([books, total]) => {
      res.send({books: books, page: page, total: total[0]['count(*)']})
    })
    .catch(err => {
      res.send({error: err})
    })
});

router.get('/list', function(req, res) {
  let limit = req.query.perPage || 20;
  let page = req.query.page || 0;
  let orderBy = 'username';
  let direction = 'ASC';

  let getUsers = knex.select('users.uuid as user_uuid', 'username', 'full_name')
    .count({numBooks: 'books.uuid'})
    .from('users')
    .modify(function(queryBuilder){
      if (req.body.searchTerm) { queryBuilder.whereRaw("username LIKE '%" + searchTerm + "%' OR full_name LIKE '%" + searchTerm + "%'") }
    })
    .limit(limit)
    .offset(page*limit)
    .leftOuterJoin('books', 'books.owner_uuid', '=', 'users.uuid')
    .orderBy(orderBy, direction)
    .groupBy('users.uuid')

  let getTotal = knex('users').count('*');

  Promise.all([getUsers, getTotal])
    .then(([users, total]) => {
      res.send({users: users, total: total[0]['count(*)'], page: page})
    })
    .catch(err => {
      console.log(err);
      res.send({error: err})
    });
})

module.exports = router;
