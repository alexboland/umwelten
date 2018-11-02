var express = require('express');
var router = express.Router();
const knex = require('knex')(require('../../knexfile'));
const uuidv4 = require('uuid/v4');
const crypto = require('@trust/webcrypto')


router.get('/conversations/all/', function(req, res) {

  let conversationsQuery = knex
    .select('conversations.uuid', knex.raw("AES_DECRYPT(subject,unhex(SHA2('" + process.env.DM_ENCRYPTION_SECRET + "', 512))) as subject"),
      'last_message.updated_at as updated_at', 'recipients.usernames', 'user_conversation_junctions.unread_messages')
    .from('conversations')
    .joinRaw('JOIN user_conversation_junctions ON user_conversation_junctions.user_uuid = "' + req.session.user.uuid +
      '" AND user_conversation_junctions.conversation_uuid = conversations.uuid')
    .joinRaw('JOIN (SELECT conversation_uuid, max(updated_at) updated_at FROM direct_messages GROUP BY conversation_uuid) ' +
      'AS last_message ON last_message.conversation_uuid = conversations.uuid')
    .joinRaw('JOIN (SELECT conversation_uuid, GROUP_CONCAT(username) as usernames FROM (user_conversation_junctions JOIN users ON user_uuid = users.uuid) ' +
      'GROUP BY conversation_uuid) ' +
      'AS recipients ON recipients.conversation_uuid = conversations.uuid')


    /*.joinRaw('JOIN (SELECT conversation_uuid, GROUP_CONCAT(user_uuid) as user_uuids FROM user_conversation_junctions GROUP BY conversation_uuid) ' +
      'AS recipients ON recipients.conversation_uuid = conversations.uuid')*/
    .orderBy('updated_at', 'DESC')

  conversationsQuery
    .then(conversations => {
      res.send(conversations.map(conversation =>
        ({...conversation, ...{subject: String.fromCharCode.apply(null, conversation.subject) } })
      ));
    });

});

router.get('/conversations/view/:conversation', function(req, res) {

  knex('user_conversation_junctions')
    .where({conversation_uuid: req.params.conversation, user_uuid: req.session.user.uuid}).limit(1)
    .then(([junction]) => {
      if (junction) {
        return Promise.all([
          knex
            .select('direct_messages.uuid', knex.raw("AES_DECRYPT(direct_messages.content,unhex(SHA2('" + process.env.DM_ENCRYPTION_SECRET + "', 512))) as content"),
              'direct_messages.sender_uuid', 'users.username', 'direct_messages.updated_at')
            .from('direct_messages')
            .innerJoin('users', 'sender_uuid', '=', 'users.uuid')
            .where('conversation_uuid', '=', req.params.conversation)
            .orderBy('updated_at', 'ASC'),
          knex.select(knex.raw("AES_DECRYPT(subject,unhex(SHA2('" + process.env.DM_ENCRYPTION_SECRET + "', 512))) as subject"))
            .from('conversations')
            .where('uuid', '=', req.params.conversation)
            .limit(1),
          knex('user_conversation_junctions')
            .innerJoin('users', 'users.uuid', '=', 'user_uuid')
            .where({conversation_uuid: junction.conversation_uuid}),
          knex('user_conversation_junctions')
            .where({conversation_uuid: junction.conversation_uuid, user_uuid: junction.user_uuid})
            .update({ unread_messages: 0 })
        ]);
      } else {
        throw('Cannot find conversation'); //Pretend it doesn't exist if the user isn't authorized
      }
    })
    .then(([messages, [conversation], junctions]) => {
      res.send({
        messages: messages.map(message => ({...message, ...{content: String.fromCharCode.apply(null, message.content)}})),
        subject: String.fromCharCode.apply(null, conversation.subject),
        participants: junctions.map(junction => ({username: junction.username, user_uuid: junction.user_uuid}) )
      });
    })
    .catch(err => {
      res.send({success: false})
    });
});

router.post('/conversations/new', function(req, res) {
  let uuid = uuidv4();
  knex('conversations').insert({
    uuid: uuid,
    subject: knex.raw("AES_ENCRYPT('" + req.body.title + "',UNHEX(SHA2('" + process.env.DM_ENCRYPTION_SECRET + "',512)))")})
    .then(results =>
      Promise.all(
        [knex('direct_messages').insert({
          uuid: uuidv4(),
          conversation_uuid: uuid,
          sender_uuid: req.session.user.uuid,
          content: knex.raw("AES_ENCRYPT('" + req.body.messageText + "',UNHEX(SHA2('" + process.env.DM_ENCRYPTION_SECRET + "',512)))")
        })]
          .concat(req.body.recipients.concat([req.session.user.uuid]).map(recipient =>
            knex('user_conversation_junctions')
              .insert({conversation_uuid: uuid, user_uuid: recipient, unread_messages: recipient != req.session.user.uuid})))
      )
    )
    .then(results => {
      res.send({success: true, conversation_uuid: uuid})
    })
    .catch(err => {
      res.send({success: false, error: err})
    })
});

router.post('/conversations/messages/new', function(req, res){
  let uuid = uuidv4();

  //TODO: wrap this in a transaction
  Promise.all([
    knex('direct_messages')
      .insert({
        uuid: uuid,
        content: knex.raw("AES_ENCRYPT('" + req.body.messageText + "',UNHEX(SHA2('" + process.env.DM_ENCRYPTION_SECRET + "',512)))"),
        conversation_uuid: req.body.conversationUuid,
        sender_uuid: req.session.user.uuid
      }),
    knex('user_conversation_junctions')
      .where({conversation_uuid: req.body.conversationUuid})
      .whereNot({user_uuid: req.session.user.uuid})
      .update({unread_messages: 1})
  ])
    .then(results => {
      res.send({success: true})
    })
    .catch(err => {
      res.send({success: false});
    })
});

module.exports = router;