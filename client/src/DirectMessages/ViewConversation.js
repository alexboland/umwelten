import React from "react";
import { Link } from 'react-router-dom';
import discussionStyles from '../stylesheets/discussionStyle.css'

class ViewConversation extends React.Component {

  state = {recipients: [], subject: '', messages: [], newMessage: ''};

  retrieveMessages () {
    fetch('/messages/conversations/view/' + this.props.match.params.conversation, {credentials: 'same-origin'})
      .then(results => results.json())
      .then(results => {
        this.setState({messages: results.messages, subject: results.subject, recipients: results.recipients})
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
    </div>
    <div>
      {this.state.messages.map(message => <div className={discussionStyles.comment}>
        <div className={discussionStyles.commentHeading}>{message.username + ':'}</div>
        <div className={discussionStyles.commentBody}>{message.content}</div>
        <div className={discussionStyles.commentFooter}>{new Date(message.updated_at).toDateString()}</div>
        <div className={discussionStyles.commentFooter}>{new Date(message.updated_at).toTimeString()}</div>
      </div>)}
      <div className={discussionStyles.addComment}>
        <div>Reply:</div>
        <div><textarea onChange={this.editNewMessage.bind(this) } value={this.state.newMessage} maxLength={65000} /></div>
        <div><button onClick={this.addNewMessage.bind(this)}>Send</button></div>
      </div>
    </div>
  </div>
  }
}

export default ViewConversation;