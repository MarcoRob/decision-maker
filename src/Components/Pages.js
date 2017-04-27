import React, { PropTypes } from 'react';
import Select from 'react-list-select';
//import PropTypes from 'prop-types';

const axios = require('axios');

class Pages extends React.Component {

constructor(props, context) {
	super(props, context);
	this.state = {
		"pages": [],
		"selectedPages" : []
	};
}

componentDidMount() {
	this.getPages()
		.then((array) => {
			this.setState({"pages": array});
		})
		.catch((err) => console.log(err));
	
}

getPages () {
		//var ct = '';
		return (
			axios.get('/api/pagenames')
			.then((resp) => {
					return resp.data;
					console.log(resp.data);
			})
			.catch((err) => console.error(err))
		);
}

renderPages() {
	return this.state.pages.map((ctg) => {
		return <div className='context'>{ctg}</div>;
	})
}

savePages = (catg) => {
	var array = this.state.selectedPages;
	if(array.indexOf(this.state.pages[catg]) == -1) {
		array.push(this.state.pages[catg]);
	} else {
		alert('You can not add twice');
	}
	/*if(array.length < 5) {
		if(array.indexOf(this.state.categories[catg]) == -1) {
			array.push(this.state.categories[catg]);
		} else {
			alert('You can not add twice');
		}
		console.log(array);
	} */
	this.setState({'selectedPages': array});
	this.props.fetchSelected(array);
};

 /*handleSubmit = (value) => {
	axios.post("api/selected", {
		'selectedCat': this.state.selectedCatg
	});
 };*/

 renderSelectedPages() {
	return this.state.selectedPages.map((selected, key) => {
		return <li key={key} className="list-group-item">{selected}</li>;
	})
}

removeCatg = () => {
	this.setState({'selectedPages':[]});
}

addRemoveBtn () {
	if(this.state.selectedPages.length > 0) {
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
				<h4 className='center'> Select FB Pages </h4>
				<div className='row'>
					<div className='col-md-7'>
						<div className='context center'>
							<Select items={this.renderPages()}
							onChange={this.savePages}
							name='pages' />
						</div>
					</div>
					<div className='col-md-5'>
						<ul className='context list-group'>
							{this.renderSelectedPages()}
						</ul>
						{this.addRemoveBtn()}
					</div>
				</div>
				
			</div>
		);
		
	}
}

Pages.propTypes = {
	fetchSelected : React.PropTypes.func,
};

export default Pages;