import React from "react";
import { Link } from 'react-router-dom';
import listStyles from './stylesheets/listStyle.css'
import libStyles from './stylesheets/userLibrary.css'

class BookRequests extends React.Component {

  state = {requests: []};

  acceptRequest (requesterUuid, bookUuid, requestUuid) {
    let self = this;
    fetch('/books/lend',
      {credentials: 'same-origin',
        method: 'post',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ user_uuid: requesterUuid, book_uuid: bookUuid })
      })
      .then(response => response.json())
      .then(response => { if (response.success) { self.props.actionHandler(requestUuid); } })
  }

  rejectRequest (requestUuid) {
    let self = this;
    fetch('/bookRequests/reject',
      {credentials: 'same-origin',
        method: 'post',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ request_uuid: requestUuid })
      })
      .then(response => response.json())
      .then(response => { if (response.success) { self.props.actionHandler(requestUuid); } })
  }

  render() {
    return <div className={libStyles.requestList}>
      <h2>Requests</h2>
      <ul className={`${listStyles.defaultList}`}>
        {this.props.requests.map(request => <li className={`${listStyles.defaultListItem} ${listStyles.bookRequestItem}`} key={request.uuid}><ul>
          <li className={libStyles.requestHeader}>
            <Link to={'/users/' + request.requester_uuid + '/bookshelf'}>{request.username}</Link> wants to borrow:
          </li>
          <li>{request.title}</li>
          <li>{request.subtitle}</li>
          <li>{request.author}</li>
          <li>{request.publisher}</li>
          <li className={`${listStyles.nestedList}`}>
            <ul>
              <li><button onClick={ () => this.acceptRequest(request.requester_uuid, request.book_uuid, request.uuid) }>Accept</button></li>
              <li><button onClick={ () => this.rejectRequest(request.uuid) }>Reject</button></li>
            </ul>
          </li>
        </ul></li>)}
      </ul>
    </div>
  }
}

export default BookRequests;