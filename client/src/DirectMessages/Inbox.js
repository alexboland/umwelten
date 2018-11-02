import React from "react";
import appStyles from '../stylesheets/appStyle.css'
import notesStyles from '../stylesheets/notesPage.css'
import { Link } from 'react-router-dom';
import { FaCircle } from 'react-icons/fa';


class Inbox extends React.Component {

  state = { conversations: [], total: 0, perPage: 20, page: 0, search: {title: '', author: ''} };

  /*handleFilterChange(criterion, query) {
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
        if (queryNo != self.currentQuery) { throw('canceling') }
        return this.fetchBooks(0, {[criterion]: query});
      })
      .then(results => {
        this.setState(results);
      })
      .catch(err => {
      });
  }*/

  fetchConversations (page, options = {}) {

    return fetch('/messages/conversations/all', {credentials: 'same-origin'})
      .then(results => results.json())
      .then(results => {
        let conversations = results.map(conversation =>
          Object.assign({recipients: conversation.usernames.split(',')}, conversation));
        this.setState({conversations: conversations})
      });
  }

  componentDidMount () {
    //this.fetchBooks(this.state.page).then(results => this.setState(results));
    this.fetchConversations(0);
  }

  /*clickPage(page) {
    this.fetchBooks(page, this.state.search).then(results => this.setState(results));
  }*/

  render() {
    return <div>
      <h1>Inbox</h1>
      <ul className={notesStyles.notesList}>
      { this.state.conversations.map(conversation =>
        <li className={notesStyles.noteItem}>
          <div>
            { !!conversation.unread_messages && <FaCircle/> }
          </div>
          <div className={notesStyles.header}>
            { conversation.recipients.reduce((acc, val) => acc + ', ' + val) }
          </div>
          <div>
            <Link to={'/messages/conversations/view/' + conversation.uuid}>{conversation.subject}</Link>
          </div>
          <div className={notesStyles.footer}>
            {'Last updated: ' + new Date(conversation.updated_at).toDateString() + ' at ' + new Date(conversation.updated_at).toTimeString()}
          </div>
        </li>
      )}
      </ul>
    </div>
  }
}

export default Inbox;
