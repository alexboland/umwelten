import React from "react";
import { Redirect } from 'react-router-dom'
import formStyles from './stylesheets/formStyle.css'

class SignUp extends React.Component {

  state = {error: false, success: false, username: '', password: '', repeatPassword: '', emailAddress: '', activationCode: ''};

  constructor(props){
    super();
    this.keyPressed = this.keyPressed.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setInfo (event, input) {
    this.setState({[input]: event.target.value})
  }

  keyPressed (event) {
    console.log(event);
    if (event.key == 'Enter') {
      this.handleSubmit(event);
    }
  }

  handleSubmit (event) {
    let self = this;
    event.preventDefault();

    if (this.state.password !== this.state.repeatPassword) {
      this.setState({error: "password entries didn't match"})
    } else {
      let params = {};
      params.username = this.state.username;
      params.password = this.state.password;
      params.repeatPassword = this.state.repeatPassword;
      params.emailAddress = this.state.emailAddress;
      params.activationCode = this.state.activationCode;
      fetch('/users/new', {
        method: 'post', headers: {"Content-Type": "application/json"}, credentials: 'same-origin',
        body: JSON.stringify(params)
      })
        .then(response => response.json())
        .then(function (response) {
          if (response.success) {
            self.setState({success: true})
            self.props.handler(response.user);
          } else {
            self.setState({error: response.error})
          }
        });
    }
  }

  render() {
    return <div className={`${formStyles.userForm} ${formStyles.signup}`}>
      <ul>
        <li>
          <span className={formStyles.label}>Username</span>
          <span><input type='text' onChange={(evt) => {this.setInfo(evt, 'username')}} onKeyPress={this.keyPressed} /></span>
        </li>
        <li>
          <span className={formStyles.label}>Password</span>
          <span><input type='password' onChange={(evt) => {this.setInfo(evt, 'password')}} onKeyPress={this.keyPressed} /></span>
        </li>
        <li>
          <span className={formStyles.label}>Repeat Password</span>
          <span><input type='password' onChange={(evt) => {this.setInfo(evt, 'repeatPassword')}} onKeyPress={this.keyPressed} /></span>
        </li>
        <li>
          <span className={formStyles.label}>Email Address</span>
          <span><input type='text' onChange={(evt) => {this.setInfo(evt, 'emailAddress')}} onKeyPress={this.keyPressed} /></span>
        </li>
        <li>
          <span className={formStyles.label}>Activation Code</span>
          <span><input type='text' onChange={(evt) => {this.setInfo(evt, 'activationCode')}} onKeyPress={this.keyPressed} /></span>
        </li>
        <li>
          <button className={formStyles.submitBtn} onClick={this.handleSubmit}>Submit</button></li>
      </ul>
      { this.state.error == 'invalid activation code' && <span>Invalid activation code</span> }
      { this.state.error == "password entries didn't match" && <span>Password entries didn't match</span> }
      { this.state.success && <Redirect to='/' /> }
    </div>
  }
}

export default SignUp;