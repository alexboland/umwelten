var express = require('express');
var router = express.Router();
const knex = require('knex')(require('../../knexfile'));
var bcrypt = require('bcrypt');

router.post('/createActivationCodes', function(req, res) {
  if (req.body.password == process.env.ADMIN_PASSWORD) {
    let arr = [];
    for (let i = 0; i < 20; i++) {
      let str = Math.random().toString(36).substring(2, 5).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
      arr.push({oid: str});
    }
    knex('activation_codes').insert(arr)
      .then(results => {
        res.send({success: true})
      })
      .catch(err => {
        res.send({success: false, error: err})
      })
  }
});

router.post('/resetPassword', function(req, res) {
  if (req.body.adminPass == process.env.ADMIN_PASSWORD) {
    bcrypt.genSalt(10)
      .then(salt => {
        return Promise.all([bcrypt.hash(req.body.password, salt), salt])
      })
      .then(([hash, salt]) => {
        return knex('users').where('uuid', '=', req.body.user_uuid).update({password: hash, salt: salt});
      })
      .then(result => {
        res.send({success: true})
      })
      .catch(err => {
        res.send({success: false, error: err})
      })
  }
});

module.exports = router;
