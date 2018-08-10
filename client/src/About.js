import React from "react";
import appStyles from './stylesheets/appStyle.css'


class About extends React.Component {

  render() {
    return <div className={appStyles.about}>
      <p>Umwelten is a place to share physical books with one another.  Your bookshelf is not books you've read but
      books that you're happy to lend to other people.</p>
      <p>To get started, click "Add Books" and use the provided search box to find the books you'd like to add to your shelf.
      You can remove these later in the "My Library" section if you change your mind.</p>
      <p>Any book that's been in someone's library can be found in the "Browse Books" section, where you can see who has that book
      and even go to the book's volume page, where you're free to start and participate in discussions about the book.</p>
      <p>For any further questions, contact me at alexanderboland at gmail.</p>
    </div>
  }
}

export default About;
