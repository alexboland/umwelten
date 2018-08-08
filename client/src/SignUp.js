import React from "react";
import { Redirect } from 'react-router-dom'

class SignUp extends React.Component {

  state = {error: false, success: false};

  constructor(props){
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (event) {
    let self = this;
    event.preventDefault();
    let params = {};
    params.username = event.currentTarget[0].value;
    params.password = event.currentTarget[1].value;
    params.repeatPassword = event.currentTarget[2].value;
    params.emailAddress = event.currentTarget[3].value;
    params.activationCode = event.currentTarget[4].value;
    fetch('/users/new', { method: 'post', headers: {"Content-Type": "application/json"}, credentials: 'same-origin',
      body: JSON.stringify(params)})
      .then(response => response.json())
      .then(function(response) {
        if (response.success) {
          self.setState({success: true})
          self.props.handler(response.user);
        } else {
          self.setState({error: response.error})
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
        <label>
          Repeat Password
          <input type="password" name="repeatPassword" />
        </label>
        <label>
          Email Address
          <input type="text" name="emailAddress" />
        </label>
        <label>
          Activation Code
          <input type="text" name="activationCode" />
        </label>
        <input type="submit" value="Submit" />
      </form>
      { this.state.error == 'invalid activation code' && <span>Invalid activation code</span> }
      { this.state.error == "password entries didn't match" && <span>Password entries didn't match</span> }
      { this.state.success && <Redirect to='/' /> }
    </div>
  }
}

export default SignUp;