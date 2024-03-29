import React from "react";
import {
  HashRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom';
import UserContext from './UserContext.js'

import Bookshelf from './Bookshelf.js';
import Profile from './Profile.js';
import BorrowedBooks from "./BorrowedBooks";
import BookRequests from "./BookRequests";
import libraryStyles from './stylesheets/userLibrary.css'
import appStyle from './stylesheets/appStyle.css'
import { FaCaretRight} from 'react-icons/fa';
import { FaCaretDown } from 'react-icons/fa';

class LibMenu extends React.Component {
  render() {
    return <nav className={`${libraryStyles.libraryMenu} ${this.props.hideNav && appStyle.hideNav}`}>
      <UserContext>{currentUser => <ul>
          <li><Link to={'/users/' + this.props.user + '/bookshelf'}>Bookshelf</Link></li>
          <li><Link to={'/users/' + this.props.user + '/profile'}>Profile</Link></li>
          {this.props.user == currentUser && <li><Link to={'/users/' + this.props.user + '/borrowedBooks'}>Books I'm Borrowing</Link></li>}
          {this.props.user == currentUser && <li><Link to={'/users/' + this.props.user + '/bookRequests'}>{'Pending Requests (' + this.props.numRequests + ')'}</Link></li>}
      </ul> }</UserContext>
    </nav>
  }
}

class UserLibrary extends React.Component {

  state = { pendingRequests: [], username: '', expandNav: false };

  toggleNav () {
    this.setState({expandNav: !this.state.expandNav})
  }

  retrievePendingRequests () {
    return fetch('/bookRequests/list/', {credentials: 'same-origin'})
      .then(results => results.json())
  }

  componentDidMount () {
    let self = this;
    let userReq = fetch('/users/profile/' + this.props.match.params.user, {credentials: 'same-origin'}).then(data => data.json());

    Promise.all([this.retrievePendingRequests(), userReq])
      .then(([reqs, user]) => {
        self.setState({pendingRequests: reqs.requests, username: user.user.username})
      });
  }

  componentWillReceiveProps (nextProps) {
    let self = this;
    if (nextProps.match.params.user !== this.props.match.params.user) {
      fetch('/users/profile/' + nextProps.match.params.user, {credentials: 'same-origin'})
        .then(data => data.json())
        .then(user => {
          self.setState({username: user.user.username});
        });
     }
  }

  handleRequestAction(requestUuid) {
    this.setState({pendingRequests: this.state.pendingRequests.filter(request => request.uuid != requestUuid)})
  }

  render() {
    return <div className={`${libraryStyles.libraryMain}`}>
      <div className={libraryStyles.expandLibMenu} onClick={this.toggleNav.bind(this)}>
        <h1>{ !this.state.expandNav && <FaCaretRight className={libraryStyles.icon} /> }
        { this.state.expandNav && <FaCaretDown className={libraryStyles.icon} />}
        { this.state.username + "'s "} Library</h1>
      </div>
      <LibMenu hideNav={!this.state.expandNav} user={this.props.match.params.user} numRequests={this.state.pendingRequests.length} />
      <div className={`${libraryStyles.libraryContent}`}>
        <UserContext>{currentUser =>
            <Router>
              <Switch>
                <Route path={'/users/' + this.props.match.params.user + '/bookshelf'} render={() => {
                  return <Bookshelf user={this.props.match.params.user}/>
                }}/>
                <Route path={'/users/' + this.props.match.params.user + '/profile'} render={() => {return <Profile user={this.props.match.params.user} />} }/>
                {this.props.match.params.user == currentUser &&
                  <Route
                    path={'/users/' + this.props.match.params.user + '/bookRequests/'}
                    render={ () => {return <BookRequests requests={this.state.pendingRequests} actionHandler={this.handleRequestAction.bind(this)}/>} }
                  />
                }
                {this.props.match.params.user == currentUser && <Route path={'/users/' + this.props.match.params.user + '/borrowedBooks/'} component={BorrowedBooks}/>}
              </Switch>
            </Router>
          }</UserContext>
      </div>
    </div>
  }
}

export default UserLibrary;