import React from "react";
import { Link } from 'react-router-dom';
import UserContext from './UserContext.js'
import listStyles from './stylesheets/listStyle.css'
import PaginationFooter from './PaginationFooter.js'
import bookshelfStyles from './stylesheets/bookshelfStyle.css'

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
      <li className={bookshelfStyles.lendStatus}>
        { this.props.user == this.props.currentAppUser && this.props.currentBookUser == this.props.user &&
          <button onClick={this.props.removeFromShelf}>Remove from bookshelf</button> }
        { this.props.user && this.props.user !== this.props.currentAppUser && !this.state.requested &&
          this.props.currentBookUser == this.props.user && <button onClick={this.handleClick}>Request to borrow</button> }
        { this.state.requested && <span>Requested</span> }
        { this.props.currentBookUser != this.props.user && <span>Currently lent to <Link to={'/users/' + this.props.currentBookUser+ '/bookshelf'}>{this.props.currentBookUserName}</Link></span> }
      </li>
      <li><Link to={'/volumes/' + this.props.volume_uuid}>Go to volume page</Link></li>
    </ul>
  }
}

class Bookshelf extends React.Component {

  state = {books: [], username: '', page: 0, perPage: 20, total: 0}

  booksRequest(page) {
    let query = '/users/books/' + this.props.user + '?page=' + page +
      '&perPage=' + this.state.perPage;
    return fetch(query, {credentials: 'same-origin'})
      .then(data => data.json());
  }

  componentDidMount () {

    let userReq = fetch('/users/profile/' + this.props.user, {credentials: 'same-origin'})
      .then(data => data.json());

    Promise.all([this.booksRequest(0), userReq])
      .then(([books, user]) => {
        this.setState({books: books.books, username: user.user.username, page: books.page, total: books.total});
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
      <ul className={`${listStyles.defaultList}`}>
        <UserContext.Consumer>
          { currentUser => this.state.books
            .map(book =>
              <li className={`${listStyles.defaultListItem}`}>
                <BookItem title={book.title} subtitle={book.subtitle} author={book.author && book.author.replace(/\|/g, ', ')}
                  publisher={book.publisher} book_uuid={book.book_uuid} user={this.props.user} volume_uuid={book.volume_uuid}
                  currentBookUser={book.current_user_uuid} currentBookUserName={book.borrower} requested={book.request_uuid}
                  currentAppUser={currentUser} removeFromShelf={() => { this.removeFromShelf(book.book_uuid) } }  />
              </li>) }
        </UserContext.Consumer>
      </ul>
      <PaginationFooter clickPage={this.clickPage.bind(this)} total={this.state.total} page={this.state.page} perPage={this.state.perPage} />
    </div>
  }
}

export default Bookshelf;