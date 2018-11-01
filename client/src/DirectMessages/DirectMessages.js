import React from "react";
import Inbox from './Inbox.js'
import NewConversation from './NewConversation.js'
import ViewConversation from './ViewConversation.js'
import appStyles from '../stylesheets/appStyle.css'
import libraryStyles from '../stylesheets/userLibrary.css'
import { FaCaretRight} from 'react-icons/fa';
import { FaCaretDown } from 'react-icons/fa';
import {
  HashRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom';

class DirectMessages extends React.Component {

  state = { expandNav: false }

  toggleNav () {
    this.setState({expandNav: !this.state.expandNav})
  }

  render() {
    return <div>
      <div className={libraryStyles.expandLibMenu} onClick={this.toggleNav.bind(this)}>
        <h1>{ !this.state.expandNav && <FaCaretRight className={libraryStyles.icon} /> }
          { this.state.expandNav && <FaCaretDown className={libraryStyles.icon} />}
          Messages</h1>
      </div>
      <nav className={`${libraryStyles.libraryMenu} ${!this.state.expandNav && appStyles.hideNav}`}>
        <ul>
          <li><Link to={'/messages/inbox'}>Inbox</Link></li>
          <li><Link to={'/messages/conversations/new'}>New Conversation</Link></li>
        </ul>
      </nav>
      <div className={libraryStyles.libraryMain}><Router>
          <Switch>
            <Route path={'/messages/inbox'} component={Inbox} />
            <Route path={'/messages/conversations/new'} component={NewConversation} />
            <Route path={'/messages/conversations/view/:conversation'} component={ViewConversation} />
          </Switch>
        </Router>
      </div>
    </div>
  }
}

export default DirectMessages;
