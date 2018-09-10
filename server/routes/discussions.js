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
});

router.get('/list/:user', function(req, res) {

  let discussionsQuery = knex
    .select('discussions.uuid', 'discussions.title', 'discussions.volume_uuid', 'volumes.title as volumeTitle',
      'all_comments.length as length', 'all_comments.last_updated as last_updated', 'all_comments.started_at as started_at',
      'first_comment.text as initial_text')
    .from('discussions')
    .joinRaw('JOIN (SELECT discussion_uuid, count(uuid) length, max(updated_at) last_updated, min(updated_at) started_at ' +
      'FROM comments GROUP BY discussion_uuid) ' +
      'AS all_comments ON all_comments.discussion_uuid = discussions.uuid')
    .joinRaw('JOIN comments AS first_comment ' +
      'ON first_comment.updated_at = all_comments.started_at AND first_comment.discussion_uuid = all_comments.discussion_uuid')
    .joinRaw('JOIN (SELECT uuid, author_uuid, discussion_uuid FROM comments as user_comments) AS user_comments ON user_comments.discussion_uuid = discussions.uuid AND user_comments.author_uuid = "' + req.params.user + '"')
    .innerJoin('volumes', 'volumes.uuid', '=', 'discussions.volume_uuid')
    .orderBy('last_updated', 'DESC');

  discussionsQuery.then(results => {
    res.send(results);
  });

});

router.get('/browse', function(req, res) {

  let discussionsQuery = knex
    .select('discussions.uuid', 'discussions.title', 'discussions.volume_uuid', 'volumes.title as volumeTitle',
      'all_comments.length as length', 'all_comments.last_updated as last_updated', 'all_comments.started_at as started_at',
      'first_comment.text as initial_text')
    .from('discussions')
    .joinRaw('JOIN (SELECT discussion_uuid, count(uuid) length, max(updated_at) last_updated, min(updated_at) started_at ' +
      'FROM comments GROUP BY discussion_uuid) ' +
      'AS all_comments ON all_comments.discussion_uuid = discussions.uuid')
    .joinRaw('JOIN comments AS first_comment ' +
      'ON first_comment.updated_at = all_comments.started_at AND first_comment.discussion_uuid = all_comments.discussion_uuid')
    .innerJoin('volumes', 'volumes.uuid', '=', 'discussions.volume_uuid')
    .orderBy('last_updated', 'DESC');

  discussionsQuery.then(results => {
    res.send(results);
  })

});

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