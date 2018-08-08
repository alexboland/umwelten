var express = require('express');
var router = express.Router();
const knex = require('knex')(require('../../knexfile'));
const uuidv4 = require('uuid/v4');

router.get('/view/:discussion', function(req, res) {
  let discussion = knex
    .select('volumes.title as volume_title', 'discussions.title as discussion_title', 'volumes.uuid as volume_uuid')
    .from('discussions')
    .innerJoin('volumes', 'volumes.uuid', '=', 'discussions.volume_uuid')
    .where('discussions.uuid', '=', req.params.discussion);

  let comments = knex
    .select('comments.uuid as comment_uuid', 'comments.created_at as comment_time', 'comments.text as comment_text', 'author_uuid', 'username')
    .from('comments')
    .innerJoin('users', 'users.uuid', '=', 'comments.author_uuid')
    .where('comments.discussion_uuid', '=', req.params.discussion)
    .orderBy('comment_time', 'ASC');

    Promise.all([discussion, comments]).then( ([[discussion], comments]) => {
      res.send({discussion: discussion, comments: comments});
    })
})

router.post('/new', function(req, res) {
  let uuid = uuidv4();
  knex('discussions').insert({uuid: uuid, volume_uuid: req.body.volumeUuid, title: req.body.title})
    .then(results => {
      return knex('comments').insert({uuid: uuidv4(), discussion_uuid: uuid, author_uuid: req.session.user.uuid, text: req.body.commentText})
    })
    .then(results => {
      res.send({success: true, discussion_uuid: uuid})
    })
    .catch(err => {
      console.log(err);
      res.send({success: false, error: err})
    })
});

router.post('/addComment', function(req, res){
  knex('comments').insert({uuid: uuidv4(), discussion_uuid: req.body.discussionUuid, author_uuid: req.session.user.uuid, text: req.body.commentText})
    .then(results => {
      res.send({success: true})
    })
    .catch(err => {
      console.log(err);
      res.send({success: false, error: err})
    })
});

module.exports = router;