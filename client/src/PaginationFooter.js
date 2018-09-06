import React from "react";
import paginationStyles from './stylesheets/pagination.css'
import { FaForward, FaBackward, FaFastForward, FaFastBackward  } from 'react-icons/fa'

class PaginationFooter extends React.Component {

  render () { return <nav className={`${this.props.total == 0 && paginationStyles.hidden} ${paginationStyles.pagination}`}>
      <ul>
        { this.props.total > this.props.perPage &&
          [ <li><a onClick={() => { this.props.clickPage(0); window.scroll(0, 0); }}>
              <FaFastBackward className={paginationStyles.icon} /></a>
            </li>,
            <li><a onClick={() => { this.props.clickPage(Math.max(this.props.page-1, 0)); window.scroll(0, 0); }}>
              <FaBackward className={paginationStyles.icon}  /></a>
            </li>,
            [...Array(Math.min(Math.ceil(this.props.total/this.props.perPage), 5)).keys()]
              .map(index => {
                let start = Math.min(Math.max(0, this.props.page - 2), Math.max(0, Math.floor(this.props.total/this.props.perPage) - 4));
                let page = start + index;
                return <li className={this.props.page == page && paginationStyles.activeLink}>
                  <a onClick={() => { this.props.clickPage(page); window.scroll(0, 0); }}>{page + 1}</a>
                </li>
              }),
            <li><a onClick={() => { this.props.clickPage(Math.min(this.props.page*1+1, Math.floor(this.props.total/this.props.perPage))); window.scroll(0, 0); }}><FaForward className={paginationStyles.icon} /></a></li>,
            <li><a onClick={() => { this.props.clickPage(Math.floor(this.props.total/this.props.perPage)); window.scroll(0, 0); }}><FaFastForward className={paginationStyles.icon} /></a></li>
          ]
        }
      </ul>
    </nav>
  }
}

export default PaginationFooter;