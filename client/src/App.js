import React from "react";
import ReactDOM from "react-dom";
import {
  HashRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom'
import SearchVolumes from './SearchVolumes.js'
import UserLibrary from './UserLibrary.js'
import Login from './Login.js'
import UserContext from './UserContext.js'
import BrowseBooks from './BrowseBooks.js'
import VolumePage from './VolumePage.js'
import VolumeDiscussionPage from './VolumeDiscussionPage.js'
import NewVolumeDiscussionPage from './NewVolumeDiscussionPage.js'
import SignUp from './SignUp.js'
import BrowseUsers from './BrowseUsers.js'
import appStyle from './stylesheets/appStyle.css'
import About from './About.js'
import UserSettings from './UserSettings.js'
import { FaBars } from 'react-icons/fa';


class App extends React.Component {
  constructor(props){
    super();
    this.logout = this.logout.bind(this);
    this.loginHandler = this.loginHandler.bind(this);
    this.closeNav = this.closeNav.bind(this);
    this.toggleNav = this.toggleNav.bind(this);
  }

  state = {user: null, expandNav: false};

  closeNav() {
    this.setState({ expandNav: false })
  }

  toggleNav() {
    this.setState({ expandNav: !this.state.expandNav })
  }

  loginHandler(user) {
    this.setState({user: user});
  }

  logout() {
    let self = this;
    fetch('/session/logout', {credentials: 'same-origin'})
      .then((response) => { self.setState({user: null}); })
  }

  componentDidMount() {
    fetch('/session/currentUser', {credentials: 'same-origin'})
      .then(data => data.json())
      .then(data => {
        if (data.user !== undefined) { this.setState({user: data.user}); }
      });
  }

  render() {
    return <div className={`${appStyle.appText}`}>
      <div className={`${appStyle.header}`}>
        <div className={appStyle.expandMainMenu}>
          <FaBars className={appStyle.icon} onClick={this.toggleNav} />
        </div>
        <div className={`${appStyle.logo}`}><Link to='/'>Umwelten</Link></div>
        <div className={`${appStyle.mainMenu} ${!this.state.expandNav && appStyle.hideNav}`}>
          <ul>
            { !this.state.user && <li><Link to='/login' onClick={this.closeNav}>Login</Link></li> }
            { this.state.user && <li><Link to={'/users/' + this.state.user.uuid + '/bookshelf'} onClick={this.closeNav}>My Library</Link></li> }
            <li><Link to='/browseBooks' onClick={this.closeNav}>Browse Books</Link></li>
            { this.state.user && <li><Link to='/searchVolumes' onClick={this.closeNav}>Add Books</Link></li> }
            { this.state.user && <li><Link to='/searchUsers' onClick={this.closeNav}>Search Users</Link></li> }
            { this.state.user && <li><Link to='/settings' onClick={this.closeNav}>Settings</Link></li> }
            { this.state.user && <li><Link to='/logout' onClick={() => {this.closeNav(); this.logout();} }>Logout</Link></li> }
          </ul>
        </div>
      </div>
      <UserContext.Provider value={this.state.user && this.state.user.uuid}>
         <div className={`${appStyle.content}`} onClick={this.closeNav}>
          <Switch>
            <Route exact path='/' component={About} />
            <Route path='/signUp/' render={() => {return <SignUp handler={this.loginHandler} />; } } />
            <Route path='/login/' render={() => {return <Login handler={this.loginHandler} />; } } />
            { this.state.user && <Route path={'/users/:user'} component={UserLibrary} />}
            <Route path='/searchVolumes' component={SearchVolumes} />
            <Route path='/browseBooks' component={BrowseBooks} />
            <Route path={'/volumes/:volume'} component={VolumePage} />
            <Route path={'/discussions/view/:discussion'} component={VolumeDiscussionPage} />
            <Route path={'/discussions/:volume/new'} component={NewVolumeDiscussionPage} />
            <Route path={'/searchUsers'} component={BrowseUsers} />
            <Route path={'/settings'} component={UserSettings} />
          </Switch>
         </div>
      </UserContext.Provider>
    </div>
  }
}


var mountNode = document.getElementById("app");

ReactDOM.render((
  <Router>
    <App />
  </Router>
), document.getElementById('root'))