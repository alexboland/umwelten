import React from "react";
import { Redirect } from 'react-router-dom'

class Login extends React.Component {

  state = {error: false, success: false};

  constructor(props){
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (event) {
    let self = this;
    event.preventDefault();
    fetch('/session/login', { method: 'post', headers: {"Content-Type": "application/json"}, credentials: 'same-origin', body: JSON.stringify({ username: event.currentTarget[0].value, password: event.currentTarget[1].value }) })
      .then(response => response.json())
      .then(function(response) {
        if (response.success) {
          self.setState({success: true, user: response.user});
          self.props.handler(response.user);
        } else {
          self.setState({error: true})
        }
      });
  }

  render() {
    return <div>
      <form onSubmit={this.handleSubmit}>
        <label>
          Username
          <input type="text" name="username" />
        </label>
        <br />
        <label>
          Password
          <input type="password" name="password" />
        </label>
        <input type="submit" value="Submit" />
      </form>
      { this.state.error && <span>Invalid username/password combination</span> }
      { this.state.success && <Redirect to='/' /> }
    </div>
  }
}

export default Login;