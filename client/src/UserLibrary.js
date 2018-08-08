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
import appStyles from './stylesheets/appStyle.css'

const menuStyle = {
  float: 'left',
  marginRight: '4em',
  paddingLeft: '0.6em',
  marginTop:'0.4em'
}

const menuItemStyle = {
  borderBottom: '1px solid #dedede',
  display: 'block',
  fontSize: '1.2em',
  paddingRight: '4em'
}

const mainStyle = {
  marginLeft: '10em',
  marginTop: '2.2em',
  width: '60%'
}

class LibMenu extends React.Component {
  render() {
    return <div className={`${libraryStyles.libraryMenu}`}>
      <UserContext>{currentUser => <ul>
          <li><Link to={'/users/' + this.props.user + '/bookshelf'}>Bookshelf</Link></li>
          <li><Link to={'/users/' + this.props.user + '/profile'}>Profile</Link></li>
          {this.props.user == currentUser && <li><Link to={'/users/' + this.props.user + '/borrowedBooks'}>Books I'm Borrowing</Link></li>}
          {this.props.user == currentUser && <li><Link to={'/users/' + this.props.user + '/bookRequests'}>Pending Requests</Link></li>}
      </ul> }</UserContext>
    </div>
  }
}

class UserLibrary extends React.Component {

  render() {
    return <div className={`${libraryStyles.libraryMain}`}>
      <LibMenu user={this.props.match.params.user} />
      <div className={`${libraryStyles.libraryContent}`}>
        <UserContext>{currentUser =>
            <Router>
              <Switch>
                <Route path={'/users/' + this.props.match.params.user + '/bookshelf'} render={() => {
                  return <Bookshelf user={this.props.match.params.user}/>
                }}/>
                <Route path={'/users/' + this.props.match.params.user + '/profile'} render={() => {return <Profile user={this.props.match.params.user} />} }/>
                {this.props.match.params.user == currentUser && <Route path={'/users/' + this.props.match.params.user + '/bookRequests/'} component={BookRequests}/>}
                {this.props.match.params.user == currentUser && <Route path={'/users/' + this.props.match.params.user + '/borrowedBooks/'} component={BorrowedBooks}/>}
              </Switch>
            </Router>
          }</UserContext>
      </div>
    </div>
  }
}

export default UserLibrary;