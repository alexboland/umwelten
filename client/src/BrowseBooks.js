import React from "react";
import { Link } from 'react-router-dom';
import PaginationFooter from './PaginationFooter.js'
import listStyles from './stylesheets/listStyle.css'
import appStyles from './stylesheets/appStyle.css'
import browseBooksStyles from './stylesheets/browseBooks.css'


class BrowseBooks extends React.Component {

  state = { books: [], total: 0, perPage: 20, page: 0, searchTitle: '', searchAuthor: '' };

  fetchBooks (page) {
    let query = '/books/list?page=' + page +
      '&perPage=' + this.state.perPage;

    if (this.state.searchTitle) {
      query += '&bookTitle=' + this.state.searchTitle;
    }
    if (this.state.searchAuthor) {
      query += '&author=' + this.state.searchAuthor;
    }

    return fetch(query, {credentials: 'same-origin'})
      .then(results => results.json())
      .then(results => {
        let books = results.books.map(book => {
          let bookLinks = book.book_links.split('|').map(link => { return {username: link.split(',')[0], user_uuid: link.split(',')[1] } })
          return { volume_uuid: book.volume_uuid, title: book.title, subtitle: book.subtitle, author: book.author, publisher: book.publisher, bookLinks: bookLinks}
        })
        return {books: books, total: results.total, page: results.page}
      });
  }

  setSearch(evt, criteria) {
    this.setState({[criteria]: evt.target.value });
  }

  componentDidMount () {
    this.fetchBooks(this.state.page).then(results => this.setState(results));
  }

  clickPage(page) {
    this.fetchBooks(page).then(results => this.setState(results));
  }

  keyPressed(evt) {
    if (evt.key == 'Enter') {
      this.fetchBooks(this.state.page).then(results => this.setState(results))
    }
  }

  render () { return <div>
    <h1>Books</h1>
    <div className={browseBooksStyles.searchForm}>
      <div>Title <input type='text' onKeyPress={this.keyPressed.bind(this)} onChange={(evt) => this.setSearch(evt, 'searchTitle')} /></div>
      <div>Author <input type='text' onKeyPress={this.keyPressed.bind(this)} onChange={(evt) => this.setSearch(evt, 'searchAuthor')} /></div>
      <div><button onClick={() => this.fetchBooks(this.state.page).then(results => this.setState(results))}>Search</button></div>
    </div>
    <div className={browseBooksStyles.searchResults}>
      <ul className={`${listStyles.defaultList}`}>
        {this.state.books.map(book => <li className={`${listStyles.defaultListItem}`}>
          <ul>
            <li>{book.title}</li>
            <li>{book.subtitle}</li>
            <li>{book.author && book.author.replace(/\|/g, ', ')}</li>
            <li>{book.publisher}</li>
            <li className={`${listStyles.bookLinks} ${listStyles.nestedList}`}>
              <ul><li>Owned by:</li>
                {book.bookLinks.map(link => {
                if (link.username !== '') { return <li><Link to={'/users/' + link.user_uuid + '/bookshelf'}>{link.username}</Link></li>; }
                else { return <li>Orphaned</li> }
              })}</ul>
            </li>
            <li><Link to={'/volumes/' + book.volume_uuid}>Go to volume page</Link></li>
          </ul>
        </li>)}
      </ul>
    </div>
    <PaginationFooter clickPage={this.clickPage.bind(this)} total={this.state.total} page={this.state.page} perPage={this.state.perPage} />
  </div>
  }
}

export default BrowseBooks;