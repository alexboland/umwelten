import React from "react";
import { Redirect } from 'react-router-dom'
import formStyles from './stylesheets/formStyle.css'

class Login extends React.Component {

  state = {error: false, success: false, username: '', password: ''};

  constructor(props){
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setInfo = this.setInfo.bind(this);
  }

  setInfo (event, input) {
    this.setState({[input]: event.target.value})
  }

  handleSubmit (event) {
    let self = this;
    event.preventDefault();
    fetch('/session/login', { method: 'post', headers: {"Content-Type": "application/json"}, credentials: 'same-origin',
      body: JSON.stringify({ username: this.state.username, password: this.state.password }) })
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
      <h1>Login</h1>
      <div className={formStyles.loginForm}>
        <ul>
          <li>Username: <input type="text" onChange={(evt) => {this.setInfo(evt, 'username')} }/></li>
          <li>Password: <input type="password" onChange={(evt) => {this.setInfo(evt, 'password')}} /></li>
          <li><button onClick={this.handleSubmit}>Submit</button></li>
        </ul>

        { this.state.error && <span>Invalid username/password combination</span> }
        { this.state.success && <Redirect to='/' /> }
      </div>
    </div>
  }
}

export default Login;