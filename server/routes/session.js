var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const knex = require('knex')(require('../../knexfile'));

router.post('/login', function(req, res) {
  knex('users').where('username', req.body.username)
    .then(([user]) => {
      if (!user) {
        throw 'invalid'
      } else {
        return Promise.all([bcrypt.compare(req.body.password, user.password), user]);
      }
    })
    .then(([results, user]) => {
      if (results) {
        req.session.user = user;
        res.send({success: true, user: user})
      } else {
        throw 'invalid'
      }
    })
    .catch(err => {
      console.log(err);
      res.send({success: false})
    })
});

router.get('/currentUser', function(req, res) {
  res.send({user: req.session.user});
});

router.get('/logout', function(req, res) {
  req.session.user = null;
  res.send({success: true})
});

module.exports = router;
