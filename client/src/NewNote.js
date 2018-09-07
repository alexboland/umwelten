import React from "react";
import UserContext from './UserContext.js'
import {
  Redirect
} from 'react-router-dom';
import Modal from 'react-modal'
import AsyncSelect from "react-select/lib/Async";
import discussionStyles from './stylesheets/discussionStyle.css'
import acStyles from './stylesheets/autoComplete.css'
import modalStyles from './stylesheets/modalStyle.css'

Modal.setAppElement('#root');

class NewNote extends React.Component {

  state = { volume: null, title: '', commentText: '', redirectTo: '', modalOpen: false}

  getAutoComplete (inputValue, callback) {
    fetch('/volumes/autoComplete?prefix=' + inputValue, {credentials: 'same-origin'})
      .then(results => results.json())
      .then(results => {
        callback(results.map(result => { return { label: result.title, value: result.uuid, className: acStyles.acOption } } ));
      });
  }

  setTitle (evt) { this.setState({title: evt.target.value}) }

  setCommentText (evt) { this.setState({commentText: evt.target.value}) }

  createNote (evt) {
    if (this.state.volume) {
      fetch('/discussions/new', {credentials: 'same-origin', method: 'post', headers: {"Content-Type": "application/json"},
        body: JSON.stringify({volumeUuid: this.state.volume, title: this.state.title, commentText: this.state.commentText }) })
        .then(results => results.json())
        .then(results => {
          this.setState({redirectTo: results.discussion_uuid });
        });
    } else {
      this.setState({modalOpen: true})
    }
  }

  render () {
    return <div>
      <div>
        <h1>New Note</h1>
        <AsyncSelect
          cacheOptions
          loadOptions={this.getAutoComplete.bind(this)}
          defaultOptions
          onChange={newValue => { this.setState({volume: newValue.value}) }}
          className={acStyles.acInput}
          placeholder={'What book is this note about?'}
        />
      </div>
      <div className={discussionStyles.addComment}>
        <div className={discussionStyles.title}>
          <input type='text' value={this.state.discussionTitle} onChange={this.setTitle.bind(this)} placeholder={'Title'} />
        </div>
        <div>
        </div>
        <div><textarea value={this.state.commentText} onChange={this.setCommentText.bind(this)} maxLength={65000} /></div>
        <div className={discussionStyles.createButtons}>
          <div><button onClick={this.createNote.bind(this)}>Save</button></div>
        </div>
        {this.state.redirectTo && <Redirect to={'/discussions/view/' + this.state.redirectTo} />}
      </div>
      <Modal className={modalStyles.modalDefault} isOpen={this.state.modalOpen}>
        <ul>
          <li>You need to specify the book you're taking a note about.</li>
          <li><button onClick={() => { this.setState({modalOpen: false}) }}>OK</button></li>
        </ul>
      </Modal>
    </div>
  }

}

export default NewNote;
