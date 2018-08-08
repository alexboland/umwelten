import React from "react";
import { Link } from 'react-router-dom';
import discussionStyles from './stylesheets/discussionStyle.css'

class VolumeDiscussionPage extends React.Component {

  state = {volumeTitle: '', discussionTitle: '', comments: [], newComment: ''};

  retrieveComments () {
    fetch('/discussions/view/' + this.props.match.params.discussion, {credentials: 'same-origin'})
      .then(results => results.json())
      .then(results => {
        console.log(results);
        this.setState({comments: results.comments, discussionTitle: results.discussion.discussion_title, volumeUuid: results.discussion.volume_uuid, volumeTitle: results.discussion.volume_title, volumeUuid: results.discussion.volume_uuid})
      });
  }

  componentDidMount () {
    this.retrieveComments();
  }

  editNewComment (evt) {
    this.setState({ newComment: evt.target.value })
  }

  addNewComment () {
    let self= this;
    fetch('/discussions/addComment', {credentials: 'same-origin', method: 'post', headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ discussionUuid: this.props.match.params.discussion, commentText: this.state.newComment })})
      .then(results => results.json())
      .then(results => {
        this.setState({newComment: ''});
        self.retrieveComments();
      })
  }

  render () { return <div>
      <div>
        <h3><Link to={'/volumes/' + this.state.volumeUuid}>{this.state.volumeTitle}</Link></h3>
        <h3>{this.state.discussionTitle}</h3>
      </div>
      <div>
        {this.state.comments.map(comment => <div className={discussionStyles.comment}>
          <div className={discussionStyles.commentHeading}>{comment.username + ':'}</div>
          <div className={discussionStyles.commentBody}>{comment.comment_text}</div>
          <div className={discussionStyles.commentFooter}>{new Date(comment.comment_time).toDateString()}</div>
          <div className={discussionStyles.commentFooter}>{new Date(comment.comment_time).toTimeString()}</div>
        </div>)}
        <div className={discussionStyles.addComment}>
          <div>Add comment:</div>
          <div><textarea onChange={this.editNewComment.bind(this) } value={this.state.newComment} maxLength={65000} /></div>
          <div><button onClick={this.addNewComment.bind(this)}>Add Comment</button></div>
        </div>
      </div>
    </div>
  }
}

export default VolumeDiscussionPage;