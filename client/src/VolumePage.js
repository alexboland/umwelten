import React from "react";
import { Link } from 'react-router-dom';
import vpStyle from './stylesheets/volumePage.css'

class VolumePage extends React.Component {

  state = { title: '', subtitle: '', author: '', publisher: '', owners: [], discussions: [] };

  componentDidMount() {
    fetch('/volumes/view/' + this.props.match.params.volume, {credentials: 'same-origin'})
      .then(results => results.json())
      .then(results => {
        let volume = results.volume;
        this.setState({
          title: volume.title,
          subtitle: volume.subtitle,
          author: volume.author,
          publisher: volume.publisher,
          owners: results.users,
          discussions: results.discussions,
          google_volume: volume.google_volume})
      });
  }

  render () { return <div className={vpStyle.volumePage}>
    <div>
      <ul>
        <li><h1>{this.state.title}</h1></li>
        <li>{this.state.subtitle}</li>
        <li>{this.state.author}</li>
        <li>{this.state.publisher}</li>
        <li><a href={'https://books.google.com/books?id=' + this.state.google_volume} target="_blank">Go to Google Books page</a></li>
      </ul>
    </div>
    <div>
      <h1>Owned by:</h1>
      <ul>
        {this.state.owners.map(owner => <li>
          <Link to={'/users/' + owner.user_uuid + '/bookshelf'}>{owner.username}</Link>
        </li> )}
      </ul>
      <h1>Discussions:</h1>
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