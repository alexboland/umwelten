import React from "react";
import {
  Redirect
} from 'react-router-dom';
import Modal from 'react-modal'
import AsyncSelect from "react-select/lib/Async";
import acStyles from '../stylesheets/autoComplete.css'
import discussionStyles from '../stylesheets/discussionStyle.css'
import modalStyles from '../stylesheets/modalStyle.css'

Modal.setAppElement('#root');

class NewConversation extends React.Component {

  state = { recipients: [], title: '', messageText: '', redirectTo: '', modalOpen: false}

  getAutoComplete (inputValue, callback) {
    if (inputValue.length > 0) {

      let self = this;
      let timeout = () => new Promise(resolve => {
        let queryNo = Math.random().toString(36).substring(2, 15);
        self.currentQuery = queryNo;
        setTimeout(() => {
          resolve(queryNo);
        }, 150)
      });

      timeout()
        .then(queryNo => {
          if (queryNo != self.currentQuery) { throw('canceling'); }
          return fetch('/users/autoComplete?prefix=' + inputValue, {credentials: 'same-origin'})
        })
        .then(results => results.json())
        .then(results => {
          callback(results.map(result => {
            return {label: result.username, value: result.uuid, className: acStyles.acOption}
          }));
        });
    } else {
      callback([]);
    }
  }

  setTitle (evt) { this.setState({title: evt.target.value}) }

  setMessageText (evt) { this.setState({messageText: evt.target.value}) }

  createConversation (evt) {
    if (this.state.recipients.length && this.state.title && this.state.messageText) {
      fetch('/messages/conversations/new', {credentials: 'same-origin', method: 'post', headers: {"Content-Type": "application/json"},
        body: JSON.stringify({recipients: this.state.recipients, title: this.state.title, messageText: this.state.messageText }) })
        .then(results => results.json())
        .then(results => {
          this.setState({redirectTo: results.conversation_uuid });
        });
    } else {
      this.setState({modalOpen: true});
    }
  }

  render () {
    return <div>
      <div>
        <h1>New Conversation</h1>
        <AsyncSelect
          cacheOptions
          loadOptions={this.getAutoComplete.bind(this)}
          defaultOptions
          onChange={newValue => { this.setState({recipients: newValue.map(recipient => recipient.value)}) }}
          className={acStyles.acInput}
          placeholder={'Specify at least one recipient'}
          isMulti={true}
          value={ this.props.defaultUser && {value: this.props.defaultUser.uuid, label: this.props.defaultUser.username} }
        />
      </div>
      <div className={discussionStyles.addComment}>
        <div className={discussionStyles.title}>
          <input type='text' value={this.state.title} onChange={this.setTitle.bind(this)} placeholder={'Title'} />
        </div>
        <div><textarea value={this.state.messageText} onChange={this.setMessageText.bind(this)} maxLength={65000} /></div>
        <div className={discussionStyles.createButtons}>
          <div><button onClick={this.createConversation.bind(this)}>Save</button></div>
        </div>
        {this.state.redirectTo && <Redirect to={'/messages/conversations/view/' + this.state.redirectTo} />}
      </div>
      <Modal className={modalStyles.modalDefault} isOpen={this.state.modalOpen}>
        <div>
          <ul>
            {!this.state.recipients.length && <li>Please add at least one recipient.</li>}
            {!this.state.title && <li>You need to give the message a subject.</li>}
            {!this.state.messageText && <li>Cannot send an empty message.</li>}
          </ul>
        </div>
        <div><button onClick={() => { this.setState({modalOpen: false}) }}>OK</button></div>
      </Modal>
    </div>
  }

}

export default NewConversation;
