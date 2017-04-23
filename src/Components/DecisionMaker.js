import React, { PropTypes } from 'react';


class DecisionMaker extends React.Component {

  constructor(props, context) {
	super(props, context);
	this.state = {
		"categories": []
	};
  }

  renderCategories() {
      return this.state.categories.map((categorie, key) => {
            return <li key={key}>{categorie}</li>;
      });
  }

  componentDidMount() {
      this.getCategories()
		.then((array) => {
			this.setState({"categories": array});
		})
		.catch((err) => console.log(err));
  }

  getCategories () {
		return (
			axios.get('/api/getSelectedCategories')
			.then((resp) => {
					return resp.data;
					console.log(resp.data);
			})
			.catch((err) => console.error(err))
		);
}

  render () {
    return (
      <div className='container-fluid'>
         <div className="dropdown">
                <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                    Dropdown
                    <span className="caret"></span>
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                    {this.renderCategories()}
                </ul>
          </div>
      </div>
    );
  }
}

export default DecisionMaker;