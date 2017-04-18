import React, { PropTypes } from 'react';
import Select from 'react-list-select';
const axios = require('axios');

class Categories extends React.Component {

	/*handleSubmit = (event) => {
		event.preventDefault();
		//console.log(this.refs.newNameInput.value);
		/*axios.post('/api/file', event,target.files[0])
								.then(resp => resp.data)
	};*/
constructor(props, context) {
	super(props, context);
	this.state = {"categories": []};
}
componentDidMount() {
	this.getCategories()
		.then((array) => {
			this.setState({"categories": array});
		})
		.catch((err) => console.log(err));
	
}

getCategories () {
		//var ct = '';
		return (
			axios.get('/api/categories')
			.then((resp) => {
					return resp.data;
					console.log(resp.data);
			})
			.catch((err) => console.error(err))
		);
}

logChange(val) {
  console.log("Selected: " + val);
}

renderCategories() {
	return this.state.categories.map((ctg) => {
		return <div className='context'>{ctg}</div>;
	})
}

selectedValues (selected) {
	console.log(selected);
	console.log(this.state.categories[selected]);
}

render () {
		return (
			<div className='container-fluid'><br/>
				<form>
				<h4 className='center'> Select Categories </h4>
				<div className='context center'>
					<Select items={this.renderCategories()}
					  multiple={true}
					  onChange={function vals(e) {console.log(e)}} />;
				</div>
				<button type="submit" className="center btn btn-primary">
                            <i className="mdi mdi-submit" aria-hidden="true"></i>Submit</button><br/>&nbsp;
				</form>	
			</div>
		);
	}
}

export default Categories;