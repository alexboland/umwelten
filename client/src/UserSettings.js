import React from "react";
import settingsStyles from './stylesheets/userSettings.css'

class UserSettings extends React.Component {

  state = {error: '', success: '', activationCodes: []};

  constructor(props){
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit (event) {
    let self = this;
    event.preventDefault();
    let params = {};
    let target = event.currentTarget;
    params.oldPass = event.currentTarget[0].value;
    params.newPass = event.currentTarget[1].value;
    params.repeatPassword = event.currentTarget[2].value;
    fetch('/users/changePassword', { method: 'post', headers: {"Content-Type": "application/json"}, credentials: 'same-origin',
      body: JSON.stringify(params)})
      .then(response => response.json())
      .then(function(response) {
        if (response.error) {
          self.setState({error: response.error, success: ''});
        } else {
          self.setState({error: '', success: 'Password successfully changed'});
        }
        target[0].value = '';
        target[1].value = '';
        target[2].value = '';
      });
  }

  componentDidMount () {
    fetch('/users/activationCodes', {credentials: 'same-origin'})
      .then(results => results.json())
      .then(results => {
        this.setState({activationCodes: results.codes})
      })
  }

  render() {
    return <div>
      <h1>Settings</h1>
      <div className={settingsStyles.settingsSection}>
        <h2>Activation Codes (For Inviting Your Friends!)</h2>
        <ul>
          {this.state.activationCodes.map(code =>
            <li>{code.oid}</li>
          )}
        </ul>
        {this.state.activationCodes.length < 1 && "Looks like you don't have any activation codes left."}

      </div>
      <div className={settingsStyles.settingsSection}>
        <h2>Change Password</h2>
        <form onSubmit={this.handleSubmit}>
          <ul>
            <li>
              <label>Old password</label>
              <input type="text" name="oldPass" />
            </li>
            <li>
              <label>New password</label>
              <input type="password" name="newPass" />
            </li>
            <li>
              <label>Repeat new password</label>
              <input type="password" name="repeatPassword" />
            </li>
            <li>
              <input type="submit" value="Submit" className={settingsStyles.submitBtn} />
            </li>
          </ul>
        </form>
        <div className={settingsStyles.message}>
          {<span className={settingsStyles.errorSpan}>{this.state.error}</span>}
          {<span className={settingsStyles.successSpan}>{this.state.success}</span>}
        </div>
      </div>
     </div>
  }
}

export default UserSettings;