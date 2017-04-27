import React, { PropTypes } from 'react';
import Select from 'react-list-select';

const axios = require('axios');

class Categories extends React.Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			"categories": [],
			"selectedCatg" : []
		};
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
			axios.get('/api/categories')
			.then((resp) => {
					return resp.data;
					console.log(resp.data);
			})
			.catch((err) => console.error(err))
		);
	}

	renderCategories() {
		return this.state.categories.map((ctg) => {
			return <div className='context'>{ctg}</div>;
		})
	}

	saveCategories = (catg) => {
		var array = this.state.selectedCatg;
		if(array.length < 1) {
			if(array.indexOf(this.state.categories[catg]) == -1) {
				array.push(this.state.categories[catg]);
			} else {
				alert('You can not add twice');
			}
			console.log(array);
		} else {
			alert('You can only add 1 category');
		}
		this.setState({'selectedCatg': array});
		this.props.fetchSelected(array);
	};

	handleSubmit = (value) => {
		axios.post("api/selected", {
			'selectedCat': this.state.selectedCatg
		});
	};

	renderSelectedCategories() {
		return this.state.selectedCatg.map((selected, key) => {
			return <li key={key} className="list-group-item">{selected}</li>;
		})
	}

	removeCatg = () => {
		this.setState({'selectedCatg':[]});
	}

	addRemoveBtn () {
		if(this.state.selectedCatg.length > 0) {
			return (<button type="submit" className="center btn btn-warning" onClick={this.removeCatg}>
				X&nbsp;Remove </button>);
		} else {
			return (<div>&nbsp;</div>);
		}
	}

render () {
	// <form method='post' action='api/selectingCtg' encType='multipart/form-data'>
	/*<button type="submit" className="center btn btn-primary" onClick={this.handleSubmit}>
					<i className="mdi mdi-send" aria-hidden="true"></i>&nbsp;Submit
					</button><br/>*/
		return (
			<div className='container-fluid'><br/>
				<h4 className='center'> Select Categories </h4>
				<div className='row'>
					<div className='col-md-7'>
						<div className='context center'>
							<Select items={this.renderCategories()}
							onChange={this.saveCategories}
							name='categories' />
						</div>
					</div>
					<div className='col-md-5'>
						<ul className='context list-group'>
							{this.renderSelectedCategories()}
						</ul>
						{this.addRemoveBtn()}
					</div>
				</div>
				
			</div>
		);
		
	}
}

Categories.propTypes = {
	fetchSelected : React.PropTypes.func,
};

export default Categories;