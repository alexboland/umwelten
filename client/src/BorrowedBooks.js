import React from "react";
import { Link } from 'react-router-dom';
import UserContext from './UserContext.js'
import listStyles from './stylesheets/listStyle.css'


const listStyle = {
  display: 'block',
  padding: '0.3em',
  backgroundColor: '#efefef'
}

const itemStyle = {
  listStyleType: 'none'
}

class BorrowedBooks extends React.Component {

  state = {books: []}

  returnBook (bookUuid) {
    let self = this;
    fetch('/books/return',
      {credentials: 'same-origin',
        method: 'post',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ book_uuid: bookUuid })
      })
      .then(response => response.json())
      .then(response => { if (response.success) { self.setState({books: this.state.books.filter(book => book.book_uuid != bookUuid)}) } })
  }

  componentDidMount () {
    let self = this;
    fetch('/books/borrowed', {credentials: 'same-origin'})
      .then(data => data.json())
      .then(data => {
        self.setState({books: data.books})
      });
  }

  render() {
    return <div>
      <h1>Books I'm Borrowing</h1>
      <ul className={`${listStyles.defaultList}`}>
        <UserContext.Consumer>
          { currentUser => this.state.books
            .map(book =>
              <li className={`${listStyles.defaultListItem}`}>
                <ul>
                  <li>{book.title}</li>
                  <li>{book.subtitle}</li>
                  <li>{book.author && book.author.replace(/\|/g, ', ')}</li>
                  <li>{book.publisher}</li>
                  <li>Borrowed from <Link to={'/users/' + book.owner_uuid + '/bookshelf'}>{book.username}</Link></li>
                  <li><button onClick={() => {this.returnBook(book.book_uuid)}}>Return</button></li>
                </ul>
              </li>
            )
          }
        </UserContext.Consumer>
      </ul>
    </div>
  }
}

export default BorrowedBooks;