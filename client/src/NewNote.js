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
          return fetch('/volumes/autoComplete?prefix=' + inputValue, {credentials: 'same-origin'})
        })
        .then(results => results.json())
        .then(results => {
          callback(results.map(result => {
            return {label: result.title, value: result.uuid, className: acStyles.acOption}
          }));
        });
    } else {
      callback([]);
    }
  }

  setTitle (evt) { this.setState({title: evt.target.value}) }

  setCommentText (evt) { this.setState({commentText: evt.target.value}) }

  createNote (evt) {
    if (this.state.volume && this.state.title && this.state.commentText) {
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
          placeholder={'Specify a book'}
          searchPromptText={'aaa'}
        />
      </div>
      <div className={discussionStyles.addComment}>
        <div className={discussionStyles.title}>
          <input type='text' value={this.state.discussionTitle} onChange={this.setTitle.bind(this)} placeholder={'Title'} />
        </div>
        <div><textarea value={this.state.commentText} onChange={this.setCommentText.bind(this)} maxLength={65000} /></div>
        <div className={discussionStyles.createButtons}>
          <div><button onClick={this.createNote.bind(this)}>Save</button></div>
        </div>
        {this.state.redirectTo && <Redirect to={'/discussions/view/' + this.state.redirectTo} />}
      </div>
      <Modal className={modalStyles.modalDefault} isOpen={this.state.modalOpen}>
        <div>
          <ul>
            {!this.state.volume && <li>You need to specify the book you're taking a note about.</li>}
            {!this.state.title && <li>You need to give the note a title.</li>}
            {!this.state.commentText && <li>Cannot create an empty note.</li>}
          </ul>
        </div>
        <div><button onClick={() => { this.setState({modalOpen: false}) }}>OK</button></div>

       </Modal>
    </div>
  }

}

export default NewNote;
