import React from "react";
import { Link, Redirect } from 'react-router-dom';
import discussionStyles from './stylesheets/discussionStyle.css'

class NewVolumeDiscussionPage extends React.Component {

  state = {volumeTitle: '', commentText: '', discussionTitle: '', redirectTo: null};

  retrieveVolumeInfo () {
    fetch('/volumes/basicInfo/' + this.props.match.params.volume, {credentials: 'same-origin'})
      .then(results => results.json())
      .then(results => {
        this.setState({volumeTitle: results.volume.title})
      });
  }

  createDiscussion (evt) {
    fetch('/discussions/new', {credentials: 'same-origin', method: 'post', headers: {"Content-Type": "application/json"},
      body: JSON.stringify({volumeUuid: this.props.match.params.volume, title: this.state.discussionTitle, commentText: this.state.commentText }) })
      .then(results => results.json())
      .then(results => {
        this.setState({redirectTo: results.discussion_uuid });
      })
  }

  componentDidMount () {
    this.retrieveVolumeInfo();
  }

  setTitle (evt) { this.setState({discussionTitle: evt.target.value}) }

  setCommentText (evt) { this.setState({commentText: evt.target.value}) }

  render () { return <div>
      <div>
        <h1>New Discussion ({this.state.volumeTitle})</h1>
      </div>
      <div className={discussionStyles.addComment}>
        <div className={discussionStyles.title}>
          <input type='text' value={this.state.discussionTitle} onChange={this.setTitle.bind(this)} />
        </div>
        <div>
        </div>
        <div><textarea value={this.state.commentText} onChange={this.setCommentText.bind(this)} maxLength={65000} /></div>
        <div className={discussionStyles.createButtons}>
          <div><button onClick={this.createDiscussion.bind(this)}>Save</button></div>
          <div><button>Cancel</button></div>
        </div>
        {this.state.redirectTo && <Redirect to={'/discussions/view/' + this.state.redirectTo} />}
      </div>
    </div>
  }

}

export default NewVolumeDiscussionPage;