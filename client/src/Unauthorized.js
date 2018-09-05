import React from "react";
import appStyles from './stylesheets/appStyle.css'


class Unauthorized extends React.Component {

  render() {
    return <div className={appStyles.about}>
      <p>Only registered users are able to see user profiles.</p>
    </div>
  }
}

export default Unauthorized;
