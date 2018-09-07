import React from "react";
import UserContext from './UserContext.js'
import {
  HashRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom';
import NewNote from './NewNote.js'
import appStyles from './stylesheets/appStyle.css'
import libraryStyles from './stylesheets/userLibrary.css'
import listStyles from './stylesheets/listStyle.css'
import VolumeDiscussionPage from './VolumeDiscussionPage.js'
import { FaCaretRight} from 'react-icons/fa';
import { FaCaretDown } from 'react-icons/fa';

class NotesList extends React.Component {

  render () {
    return <ul className={listStyles.defaultList}>
      { this.props.notes.map(note =>
        <li className={listStyles.defaultListItem}>
          <ul>
            <li>
              <Link to={'/notes/view/' + note.uuid}>{note.title}</Link>
              {' ('}
              <Link to={'/volumes/' + note.volume_uuid}>{note.volumeTitle}</Link>
              {')'}
            </li>
            <li>{note.length + ' comments'}</li>
            <li>{'Last updated: ' + note.last_updated}</li>
          </ul>
        </li>
      )}
    </ul>
  }
}

class MyNotes extends React.Component {

  state = {notes: []};

  componentDidMount () {
    if (this.props.user) {
      fetch('/discussions/list/' + this.props.user, {credentials: 'same-origin'})
        .then(results => results.json())
        .then(results => {
          this.setState({notes: results});
        });
    }
  }

  componentWillReceiveProps (nextProps) {
    fetch('/discussions/list/' + nextProps.user, {credentials: 'same-origin'})
      .then(results => results.json())
      .then(results => {
        this.setState({notes: results});
      });
  }

  render () {
    return <div>
      <h1>My Notes</h1>
      <NotesList notes={this.state.notes} />
    </div>
  }
}

class BrowseNotes extends React.Component {

  state = { notes: [] }

  componentDidMount () {
    fetch('/discussions/browse', {credentials: 'same-origin'})
      .then(results => results.json())
      .then(results => {
        this.setState({notes: results});
      });
  }

  render () {
    return <div>
      <h1>Browse Notes</h1>
      <NotesList notes={this.state.notes} />
    </div>
  }

}

class Notes extends React.Component {

  state = { expandNav: false }

  toggleNav () {
    this.setState({expandNav: !this.state.expandNav})
  }

  render() {
    return <div>
      <div className={libraryStyles.expandLibMenu} onClick={this.toggleNav.bind(this)}>
        <h1>{ !this.state.expandNav && <FaCaretRight className={libraryStyles.icon} /> }
          { this.state.expandNav && <FaCaretDown className={libraryStyles.icon} />}
          Notes</h1>
      </div>
      <nav className={`${libraryStyles.libraryMenu} ${!this.state.expandNav && appStyles.hideNav}`}>
        <ul>
          <li><Link to={'/notes/myNotes'}>My Notes</Link></li>
          <li><Link to={'/notes/browseNotes'}>Browse Notes</Link></li>
          <li><Link to={'/notes/new'}>New Note</Link></li>
        </ul>
      </nav>
      <div className={libraryStyles.libraryMain}>
        <UserContext>{ currentUser => <Router>
            <Switch>
              <Route path={'/notes/myNotes/'} render={() => <MyNotes user={currentUser} />} />
              <Route path={'/notes/browseNotes'} component={BrowseNotes} />
              <Route path={'/notes/new'} component={NewNote} />
              <Route path={'/notes/view/:discussion'} component={VolumeDiscussionPage} />
            </Switch>
          </Router>
        }
        </UserContext>
      </div>
    </div>
  }
}

export default Notes;
