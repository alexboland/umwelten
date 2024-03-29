import React from "react";
import { Link } from 'react-router-dom';
import UserContext from './UserContext.js'
import listStyles from './stylesheets/listStyle.css'
import PaginationFooter from './PaginationFooter.js'
import bookshelfStyles from './stylesheets/bookshelfStyle.css'
import FilterForm from './FilterForm.js'

class BookItem extends React.Component {

  constructor(props){
    super();
    this.handleClick = this.handleClick.bind(this);
    this.state = { requested: props.requested }
  }

  handleClick() {
    let self = this;
    fetch('/books/borrow',
      {credentials: 'same-origin',
        method: 'post',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({user: this.props.currentUser, book: this.props.book_uuid })
      })
      .then(response => response.json())
      .then(response => { if (response.success) { self.setState({requested: true}) } })
  }

  render() {
    return <ul>
      <li className={bookshelfStyles.title}>{this.props.title}</li>
      <li className={bookshelfStyles.subtitle}>{this.props.subtitle}</li>
      <li className={bookshelfStyles.author}>{this.props.author}</li>
      <li className={bookshelfStyles.publisher}>{this.props.publisher}</li>
      <li><Link to={'/volumes/' + this.props.volume_uuid}>Go to volume page</Link></li>
      <li className={bookshelfStyles.lendStatus}>
        { this.props.user == this.props.currentAppUser && this.props.currentBookUser == this.props.user &&
          <button onClick={this.props.removeFromShelf}>Remove from bookshelf</button> }
        { this.props.user && this.props.user !== this.props.currentAppUser && !this.state.requested &&
          this.props.currentBookUser == this.props.user && <button onClick={this.handleClick}>Request to borrow</button> }
        { this.state.requested && <span>Requested</span> }
        { this.props.currentBookUser != this.props.user && <span>Currently lent to <Link to={'/users/' + this.props.currentBookUser+ '/bookshelf'}>{this.props.currentBookUserName}</Link></span> }
      </li>
    </ul>
  }
}

class Bookshelf extends React.Component {

  state = {books: [], username: '', page: 0, perPage: 20, total: 0, hasBooks: null};

  currentQuery = null;

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
        return this.booksRequest(0, {[criterion]: query});
      })
      .then(results => {
        this.setState({books: results.books, page: results.page, total: results.total})
      })
      .catch(err => {
      });
  }

  booksRequest(page, options = {}) {
    let query = '/users/books/' + this.props.user + '?page=' + page +
      '&perPage=' + this.state.perPage;
    Object.keys(options).forEach(key => {
      query += '&' + key + '=' + options[key];
    });
    return fetch(query, {credentials: 'same-origin'})
      .then(data => data.json());
  }

  componentDidMount () {

    let userReq = fetch('/users/profile/' + this.props.user, {credentials: 'same-origin'})
      .then(data => data.json());

    let allBooksReq = fetch('/users/totalBooks/' + this.props.user, {credentials: 'same-origin'})
      .then(data => data.json());

    Promise.all([this.booksRequest(0), userReq, allBooksReq])
      .then(([books, user, allBooks]) => {
        this.setState({books: books.books, username: user.user.username, page: books.page,
          total: books.total, hasBooks: allBooks.total > 0});
      });
  }

  clickPage(page) {
    this.booksRequest(page)
      .then(data => {
        this.setState({books: data.books, page: data.page, total: data.total})
    })
  }

  removeFromShelf(book_uuid) {
    let self = this;
    fetch('/books/remove',
      {credentials: 'same-origin',
        method: 'post',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({book: book_uuid })
      })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          let page = this.state.page;
          if (this.state.page > 0 && this.state.books.length < 2) {
            page = page-1;
          }
          this.booksRequest(page).then(data => {
            this.setState({books: data.books, page: data.page, total: data.total});
          });
        }
      })
  }

  render() {
    return <div>
      <h1>{ this.state.username }'s Books:</h1>
      {this.state.hasBooks && <FilterForm criteria={{title: 'Title/Subtitle', author: 'Author'}} changeHandler={this.handleFilterChange.bind(this)} />}
      <ul className={`${listStyles.defaultList}`}>
        <UserContext.Consumer>
          { currentUser => [this.state.books
            .map(book =>
              <li className={`${listStyles.defaultListItem}`} key={book.book_uuid}>
                <BookItem title={book.title} subtitle={book.subtitle} author={book.author && book.author.replace(/\|/g, ', ')}
                  publisher={book.publisher} book_uuid={book.book_uuid} user={this.props.user} volume_uuid={book.volume_uuid}
                  currentBookUser={book.current_user_uuid} currentBookUserName={book.borrower} requested={book.request_uuid}
                  currentAppUser={currentUser} removeFromShelf={() => { this.removeFromShelf(book.book_uuid) } }  />
              </li>),
            this.state.hasBooks == false && currentUser == this.props.user &&
              <li className={listStyles.noResults}>You haven't yet added any books to your library.  Feel free to <Link to={'/searchVolumes'}>add some</Link></li>,
            this.state.hasBooks == false && currentUser != this.props.user &&
              <li className={listStyles.noResults}>This user hasn't listed any books yet.</li>,
            this.state.hasBooks && this.state.total == 0 && <li className={listStyles.noResults}>No results found.</li>]
          }
        </UserContext.Consumer>
      </ul>
      <PaginationFooter clickPage={this.clickPage.bind(this)} total={this.state.total} page={this.state.page} perPage={this.state.perPage} />
    </div>
  }
}

export default Bookshelf;