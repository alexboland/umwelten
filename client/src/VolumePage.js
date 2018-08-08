import React from "react";
import { Link } from 'react-router-dom';

class VolumePage extends React.Component {

  state = { title: '', subtitle: '', author: '', publisher: '', owners: [], discussions: []}

  componentDidMount() {
    fetch('/volumes/view/' + this.props.match.params.volume, {credentials: 'same-origin'})
      .then(results => results.json())
      .then(results => {
        let volume = results.volume;
        this.setState({title: volume.title, subtitle: volume.subtitle, author: volume.author, publisher: volume.publisher, owners: results.users, discussions: results.discussions})
      });
  }

  render () { return <div>
    <div>
      {this.state.title}<br />
      {this.state.subtitle}<br />
      {this.state.author}<br />
      {this.state.publisher}<br />
    </div>
    <div>
      <h3>Owned by:</h3>
      {this.state.owners.map(owner => <Link to={'/users/' + owner.user_uuid + '/bookshelf'}>{owner.username}</Link> )}
      <h3>Discussions:</h3>
      <ul>
        {this.state.discussions.map(discussion => { return <li>
          <Link to={'/discussions/view/' + discussion.discussion_uuid}>
            {discussion.discussion_title + '(' + discussion.length + ' comments)'}
          </Link>
        </li>
        })}
        <li><Link to={'/discussions/' + this.props.match.params.volume + '/new'}>Start a new discussion</Link></li>
      </ul>
    </div>
  </div>

  }
}

export default VolumePage;