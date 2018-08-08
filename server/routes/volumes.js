var express = require('express');
var router = express.Router();
var request = require('request');
const knex = require('knex')(require('../../knexfile'));
var path = require('path');

router.get('/search/:term', function(req, res) {
  request('https://www.googleapis.com/books/v1/volumes?q=' + req.params.term + '&maxResults=20' + '&key=' + process.env.GOOGLE_API_KEY,
    function(err, result, body){
      if (err) { console.log(err); } else {
        var volumes = JSON.parse(body)['items'].map(volume => { return volume; });
        res.send(volumes);
      }

    });
});

router.get('/view/:volume', function(req, res) {
  let volumeQuery = knex
    .select('*')
    .from('volumes')
    .where('volumes.uuid', '=', req.params.volume);

  let usersQuery = knex
    .select('users.uuid as user_uuid', 'username')
    .from('users')
    .innerJoin('books', 'books.owner_uuid', '=', 'users.uuid')
    .where('books.volume_uuid', '=', req.params.volume);

  let discussionsQuery = knex
    .select('discussions.uuid as discussion_uuid', 'discussions.title as discussion_title')
    .count({length: 'comments.uuid'})
    .from('discussions')
    .innerJoin('comments', 'comments.discussion_uuid', '=', 'discussions.uuid')
    .where('discussions.volume_uuid', '=', req.params.volume)
    .groupBy('discussions.uuid');

  Promise.all([volumeQuery, usersQuery, discussionsQuery]).then(([[volume], users, discussions]) => {
    res.send({volume: volume, users: users, discussions: discussions})
  });
});

router.get('/basicInfo/:volume', function(req, res){
  knex('volumes').where('uuid', '=', req.params.volume).then(([volume]) => {
    res.send({volume: volume})
  })
})

module.exports = router;
