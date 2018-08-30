import React from "react";
import { Link } from 'react-router-dom';
import PaginationFooter from './PaginationFooter.js'
import listStyles from './stylesheets/listStyle.css'
import browseBooksStyles from './stylesheets/browseBooks.css'
import bookshelfStyles from './stylesheets/bookshelfStyle.css'
import FilterForm from './FilterForm.js'

class BrowseBooks extends React.Component {

  state = { books: [], total: 0, perPage: 20, page: 0 };

  handleFilterChange(criterion, query) {
    let self = this;
    let timeout = () => new Promise(resolve => {
      let queryNo = Math.random().toString(36).substring(2, 15);
      self.currentQuery = queryNo;
      setTimeout(() => {
        resolve(queryNo);
      }, 150)
    });

    timeout()
      .then(queryNo => {
        if (queryNo != self.currentQuery) { throw('canceling') }
        return this.fetchBooks(0, {[criterion]: query});
      })
      .then(results => {
        this.setState(results);
      })
      .catch(err => {
      });
  }

  fetchBooks (page, options = {}) {
    let query = '/books/list?page=' + page +
      '&perPage=' + this.state.perPage;

    Object.keys(options).forEach(key => {
      query += '&' + key + '=' + options[key];
    });

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
    <FilterForm criteria={{title: 'Title/Subtitle', author: 'Author'}} changeHandler={this.handleFilterChange.bind(this)} />
    <div className={browseBooksStyles.searchResults}>
      <ul className={`${listStyles.defaultList}`}>
        {this.state.books.map(book => <li className={`${listStyles.defaultListItem}`}>
          <ul>
            <li className={bookshelfStyles.title}>{book.title}</li>
            <li className={bookshelfStyles.subtitle}>{book.subtitle}</li>
            <li className={bookshelfStyles.author}>{book.author && book.author.replace(/\|/g, ', ')}</li>
            <li className={bookshelfStyles.publisher}>{book.publisher}</li>
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