import React from "react";
import Modal from 'react-modal'
import listStyles from './stylesheets/listStyle.css'
import modalStyles from './stylesheets/modalStyle.css'

Modal.setAppElement('#root')

const boxStyle = {
  width: '40%',
  height: '2em',
  weight: 'bold',
  border: '1px solid'
}

class SearchVolumes extends React.Component {

  state = {searchResults: [], modalOpen: false}

  constructor(props){
    super();
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress (event) {
    let self = this;
    if (event.key == 'Enter') {
      fetch('/volumes/search/' + event.target.value)
        .then(data => data.json())
        .then(data => {
          let searchResults = data.map(volume => {
            let attrs = volume.volumeInfo;
            return {title: attrs.title,
              subtitle: attrs.subtitle,
              authors: attrs.authors || [],
              publisher: attrs.publisher,
              ISBN: (attrs.industryIdentifiers && attrs.industryIdentifiers.length > 0 && attrs.industryIdentifiers[0].identifier) || null,
              id: volume.id} });
          self.setState({searchResults: searchResults});
        })
    }
  }

  addToBookshelf(volume) {
    fetch('/books/add', {credentials: 'same-origin', method: 'post', headers: {"Content-Type": "application/json"},
      body: JSON.stringify({volumeId: volume.id,
        title: volume.title,
        author: (volume.authors || []).join('|'),
        publisher: volume.publisher,
        ISBN: volume.volumeItem }) })
      .then(data => data.json())
      .then(data => {
        if (data.notice == 'already added') {
          this.setState({modalOpen: true})
        }
      });
  }

  render() {
    return <div>
      <h3>Search Volumes</h3>
      <input type='text' onKeyPress={this.handleKeyPress} style={boxStyle} />
      <ul className={`${listStyles.defaultList}`}>
        { this.state.searchResults.map(volumeItem => <li className={`${listStyles.defaultListItem}`} key={volumeItem.id}>
          <ul>
            <li>{volumeItem.title}</li>
            <li>{volumeItem.subtitle}</li>
            <li>{volumeItem.authors.join(', ')}</li>
            <li>{volumeItem.publisher}</li>
            <li><button onClick={() => this.addToBookshelf(volumeItem)}>Add To Bookshelf</button></li>
          </ul>
        </li>) }
      </ul>
      <Modal className={modalStyles.modalDefault} isOpen={this.state.modalOpen}>
        <ul>
          <li>This book has already been added to your bookshelf.  Owning multiple copies of books is not yet supported.</li>
          <li><button onClick={() => { this.setState({modalOpen: false}) }}>OK</button></li>
        </ul>
      </Modal>
    </div>
  }
}

export default SearchVolumes;
