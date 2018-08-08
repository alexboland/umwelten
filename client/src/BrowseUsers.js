import React from "react";
import { Link } from 'react-router-dom';
import PaginationFooter from './PaginationFooter.js'
import listStyles from './stylesheets/listStyle.css'

class BrowseUsers extends React.Component {

  state = { users: [], total: 0, perPage: 20, page: 0 };

  fetchUsers(page) {
    return fetch('/users/list?page=' + page + '&perPage=' + this.state.perPage, {credentials: 'same-origin'})
      .then(results => results.json())
      .then(results => {
        return {users: results.users, total: results.total, page: results.page}
      })
  }

  componentDidMount () {
    this.fetchUsers(this.state.page).then(results => this.setState(results));
  }

  clickPage (page) {
    this.fetchUsers(page).then(results => this.setState(results));
  }

  render() { return <div>
      <h3>Users</h3>

      <ul className={`${listStyles.defaultList}`}>
        {this.state.users.map(user => <li className={`${listStyles.defaultListItem}`}>
            <ul>
              <li><Link to={'/users/' + user.user_uuid + '/bookshelf'}>{user.username}</Link></li>
              <li>{user.full_name}</li>
              <li>{user.numBooks + ' books'}</li>
            </ul>
          </li>
        )}
      </ul>
      <PaginationFooter clickPage={this.clickPage.bind(this)} total={this.state.total} page={this.state.page} perPage={this.state.perPage} />
    </div>
  }
}

export default BrowseUsers;
