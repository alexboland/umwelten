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
import notesStyles from './stylesheets/notesPage.css'
import ViewNote from './ViewNote.js'
import { FaCaretRight} from 'react-icons/fa';
import { FaCaretDown } from 'react-icons/fa';

class NotesList extends React.Component {

  render () {
    return <ul className={notesStyles.notesList}>
      { this.props.notes.map(note =>
        <li className={notesStyles.noteItem}>
          <div className={notesStyles.header}><Link to={'/notes/view/' + note.uuid}>{note.title}</Link>
            {' ('}
            <Link to={'/volumes/' + note.volume_uuid}>{note.volumeTitle}</Link>
            {')'}
          </div>
          <div className={notesStyles.text}>{note.initial_text}</div>
          <div className={notesStyles.footer}>{note.length + ' comments'}</div>
          <div className={notesStyles.footer}>
            {'Last updated: ' + new Date(note.last_updated).toDateString() + ' at ' + new Date(note.last_updated).toTimeString()}
          </div>
        </li>
      )}
    </ul>
  }
}

class MyNotes extends React.Component {

  state = {notes: []};

  constructor(props){
    super();
    this.fetchNotes = this.fetchNotes.bind(this);
  }

  fetchNotes (user) {
    fetch('/discussions/list/' + user, {credentials: 'same-origin'})
      .then(results => results.json())
      .then(results => {
        let notes = results.map(note => {
          let preview = note.initial_text.substring(0, 1000);
          if (note.initial_text.indexOf('\n') > 0) { preview = preview.substring(0, note.initial_text.indexOf('\n')) };
          if (preview.length < note.initial_text.length) { preview += '...'; }
          return {title: note.title, author: note.author, volume_uuid: note.volume_uuid, volumeTitle: note.volumeTitle,
            initial_text: preview, length: note.length, last_updated: note.last_updated, uuid: note.uuid}
        });
        this.setState({notes: notes});
      });
  }

  componentDidMount () {
    if (this.props.user) { this.fetchNotes(this.props.user); }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.user) { this.fetchNotes(nextProps.user); }
  }

  render () {
    return <div>
      <h1>My Notes</h1>
      <h2>(Notes You've Written or Commented On)</h2>
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
        let notes = results.map(note => {
          let preview = note.initial_text.substring(0, 1000);
          if (note.initial_text.indexOf('\n') > 0) { preview = preview.substring(0, note.initial_text.indexOf('\n')) };
          if (preview.length < note.initial_text.length) { preview += '...'; }
          return {title: note.title, author: note.author, volume_uuid: note.volume_uuid, volumeTitle: note.volumeTitle,
            initial_text: preview, length: note.length, last_updated: note.last_updated, uuid: note.uuid}
        });
        this.setState({notes: notes});
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
              <Route path={'/notes/new'} render={() => <NewNote defaultBook={this.props.location.state && this.props.location.state.defaultBook} /> } />
              <Route path={'/notes/view/:discussion'} component={ViewNote} />
            </Switch>
          </Router>
        }
        </UserContext>
      </div>
    </div>
  }
}

export default Notes;
