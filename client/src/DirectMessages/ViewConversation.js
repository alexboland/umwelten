import React from "react";
import { Link } from 'react-router-dom';
import discussionStyles from '../stylesheets/discussionStyle.css'
import chatStyles from '../stylesheets/chatStyle.css'

class ViewConversation extends React.Component {

  state = {participants: [], subject: '', messages: [], newMessage: ''};

  retrieveMessages () {
    fetch('/messages/conversations/view/' + this.props.match.params.conversation, {credentials: 'same-origin'})
      .then(results => results.json())
      .then(results => {
        this.setState({messages: results.messages, subject: results.subject, participants: results.participants})
      });
  }

  componentDidMount () {
    this.retrieveMessages();
  }

  editNewMessage (evt) {
    this.setState({ newMessage: evt.target.value })
  }

  addNewMessage () {
    let self= this;
    fetch('/messages/conversations/messages/new', {credentials: 'same-origin', method: 'post', headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ conversationUuid: this.props.match.params.conversation, messageText: this.state.newMessage })})
      .then(results => results.json())
      .then(results => {
        this.setState({newMessage: ''});
        self.retrieveMessages();
      })
  }

  render () { return <div>
    <div>
      <h1>{this.state.subject}</h1>
      <ul className={chatStyles.participants}>
        {this.state.participants.map(recipient => <li><Link to={'/users/' + recipient.user_uuid + '/bookshelf/'}>{recipient.username}</Link></li> )}
        </ul>
    </div>
    <div>
      {this.state.messages.map(message => <div className={chatStyles.message}>
        <div className={chatStyles.messageHeading}>{message.username + ':'}</div>
        <div className={chatStyles.messageBody}>{message.content}</div>
        <div className={chatStyles.messageFooter}>{new Date(message.updated_at).toDateString()}</div>
        <div className={chatStyles.messageFooter}>{new Date(message.updated_at).toTimeString()}</div>
      </div>)}
      <div className={discussionStyles.addComment}>
        <div>Reply:</div>
        <div><textarea onChange={this.editNewMessage.bind(this) } value={this.state.newMessage} maxLength={65000} /></div>
        <div><button onClick={this.addNewMessage.bind(this)} disabled={this.state.newMessage.length < 1}>Send</button></div>
      </div>
    </div>
  </div>
  }
}

export default ViewConversation;