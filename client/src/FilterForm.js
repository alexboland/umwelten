import React from "react";
import filterStyles from './stylesheets/filterStyle.css'


class FilterForm extends React.Component {

  state = {query: '', criterion: Object.keys(this.props.criteria)[0]};

  handleQueryChange (event) {
    this.setState({query: event.target.value});
    this.props.changeHandler(this.state.criterion, event.target.value);
  }

  handleCriterionChange (event) {
    this.setState({criterion: event.target.value});
    if (this.state.query.length > 0) {
      this.props.changeHandler(event.target.value, this.state.query)
    }
  }

  render() {
    return <div className={filterStyles.filterBox}>
      <div className={filterStyles.criteria}>
        <ul>
          { Object.keys(this.props.criteria).map(criterion => <li key={criterion}>
              <span>
                <input type='radio' value={criterion} checked={this.state.criterion == criterion}
                  onClick={this.handleCriterionChange.bind(this)} /> {this.props.criteria[criterion]}
              </span>
            </li>
          )}
        </ul>
      </div>
      <div className={filterStyles.query}>
        <input type='text' placeholder='Narrow down your results...' onChange={this.handleQueryChange.bind(this)} />
      </div>
    </div>
  }
}

export default FilterForm;
