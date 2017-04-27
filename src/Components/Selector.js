import React, { PropTypes } from 'react';
import Categories from './Categories';
import Pages from './Pages';
import axios from 'axios';


class Selector extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      "selectedCatg": [],
      "selectedPages" : []
    };
  }

  savePages = (array) => {
    console.log(array);
    this.setState({'selectedPages': array});
  };

  saveCategories = (array) => {
    console.log(array);
    this.setState({'selectedCatg': array});
  };

  handleSubmit = () => {
    let categories = this.state.selectedCatg || [];
    let pages = this.state.selectedPages || [];
    axios.post("api/selected", {
      'selectedCat': categories,
      'selectedPages' : pages
    });
  };

  render () {
    return (
      <div>
         <div className='row'>
           <div className='col-md-6'>
                <Categories fetchSelected={this.saveCategories}/>
           </div>
           <div className='col-md-6'>
                <Pages fetchSelected={this.savePages} />
           </div>
           </div>
           <div className='row'>
            <div className='col-md-12 center'>
                  <button className='btn-lg btn-success center' onClick={this.handleSubmit}>Give me a Decision</button> <br/>
            </div>
         </div>
      </div>
    );
  }
}

export default Selector;