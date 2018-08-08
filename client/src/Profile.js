import React from "react";
import {
  HashRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom';
import UserContext from './UserContext.js'


class ViewProfile extends React.Component {

  render() {
    return <div>
      <h3>{this.props.userInfo.username}</h3>
      <h4>{this.props.userInfo.full_name}</h4>
      <h4>{this.props.userInfo.email_address}</h4>
      <p>{this.props.userInfo.bio}</p>
      <p>{this.props.userInfo.location}</p>
      <UserContext>{currentUser => {return this.props.user == currentUser && <Link to={'/users/' + this.props.user + '/profile/editProfile'}>Edit Profile</Link>}}
      </UserContext>
    </div>
  }
}

class EditProfile extends React.Component {

  state = {redirect: false, fullName: this.props.userInfo.full_name, bio: this.props.userInfo.bio, location: this.props.userInfo.location}

  saveAndRedirect() {
    fetch('/users/profile/update', {credentials: 'same-origin', method: 'post', headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ uuid: this.props.user, fullName: this.state.fullName, bio: this.state.bio, location: this.state.location })
    })
      .then(data => data.json())
      .then(data => {
        this.props.onChange();
        this.setState({ redirect: true })
      });
  }

  handleChange(key, evt) {
    this.setState({[key]: evt.target.value })
  }

  render() {
    return <div>
      <div>
        <ul>
          <li>Name <input type="text" value={this.state.fullName} onChange={this.handleChange.bind(this, 'fullName')} /></li>
          <li>Biography <input type="text" value={this.state.bio} onChange={this.handleChange.bind(this, 'bio')} /></li>
          <li>Location <input type="text" value={this.state.location} onChange={this.handleChange.bind(this, 'location')} /></li>
        </ul>
      </div>
      { this.state.redirect && <Redirect to={'/users/' + this.props.user + '/profile'} /> }
      <a onClick={this.saveAndRedirect.bind(this)}>Submit</a>
      <Link to={'/users/' + this.props.user + '/profile'}>Cancel</Link>
    </div>
  }
}

class Profile extends React.Component {

  state = { userInfo: {} }

  updateUserInfo () {
    fetch('/users/profile/' + this.props.user, {credentials: 'same-origin'})
      .then(results => results.json())
      .then(results => {
        this.setState({userInfo: results.user})
      })
  }

  componentDidMount () {
    this.updateUserInfo();
  }

  render() { return <div>
    <Router>
      <Switch>
        <Route exact path={'/users/' + this.props.user + '/profile'} render={() => { return <ViewProfile user={this.props.user} userInfo={this.state.userInfo}/>}} />
        <UserContext>{currentUser => { return currentUser == this.props.user &&
          <Route path={'/users/' + this.props.user + '/profile/editProfile'} render={() => { return <EditProfile user={this.props.user} userInfo={this.state.userInfo} onChange={this.updateUserInfo.bind(this)} />}} />}}</UserContext>
      </Switch>
    </Router>
  </div>

  }

}

export default Profile;