import React from "react";
import Modal from 'react-modal'
import listStyles from './stylesheets/listStyle.css'
import modalStyles from './stylesheets/modalStyle.css'
import { FaSearch } from 'react-icons/fa';
import searchStyles from './stylesheets/searchVolumes.css'
import bookshelfStyles from './stylesheets/bookshelfStyle.css'

Modal.setAppElement('#root')

class SearchVolumes extends React.Component {

  state = {searchResults: [], modalOpen: false, query: ''};

  constructor(props){
    super();
    this.setQuery = this.setQuery.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.performSearch = this.performSearch.bind(this);
  }

  setQuery(event) {
    this.setState({query: event.target.value});
  }

  handleKeyPress (event) {
    if (event.key == 'Enter') {
      this.performSearch();
    }
  }

  performSearch () {
    let self = this;
    fetch('/volumes/search/' + this.state.query)
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

  addToBookshelf(volume) {
    fetch('/books/add', {credentials: 'same-origin', method: 'post', headers: {"Content-Type": "application/json"},
      body: JSON.stringify({volumeId: volume.id,
        title: volume.title,
        subtitle: volume.subtitle,
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
      <h1>Add Books</h1>
      <div className={searchStyles.searchBox}>
        <span><FaSearch className={searchStyles.icon} onClick={this.performSearch}></FaSearch></span>
        <input type='text' onChange={this.setQuery} onKeyPress={this.handleKeyPress} placeholder='Search here...' />
      </div>
      <ul className={`${listStyles.defaultList}`}>
        { this.state.searchResults.map(volumeItem => <li className={`${listStyles.defaultListItem}`} key={volumeItem.id}>
          <ul>
            <li className={bookshelfStyles.title}>{volumeItem.title}</li>
            <li className={bookshelfStyles.subtitle}>{volumeItem.subtitle}</li>
            <li className={bookshelfStyles.author}>{volumeItem.authors.join(', ')}</li>
            <li className={bookshelfStyles.publisher}>{volumeItem.publisher}</li>
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
