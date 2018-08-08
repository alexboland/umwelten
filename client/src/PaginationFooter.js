import React from "react";
import paginationStyles from './stylesheets/pagination.css'

class PaginationFooter extends React.Component {

  render () { return <div>
      {'Page ' + (parseInt(this.props.page) + 1) + ' of ' + Math.ceil(this.props.total/this.props.perPage)}
      <div className={paginationStyles.pagination}>
        { this.props.total > this.props.perPage &&
        [...Array(Math.ceil(this.props.total/this.props.perPage)).keys()]
          .map(page => { return <a onClick={() => { this.props.clickPage(page) }}>{page + 1}</a> }) }
      </div>
    </div>
  }
}

export default PaginationFooter;