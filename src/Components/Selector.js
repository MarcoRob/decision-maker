import React, { PropTypes } from 'react';

import Categories from './Categories';

const axios = require('axios');


var getCategories = function () {
                        var categories = [];
                        axios.get('/api/categories')
                        .then((resp) => {
                            console.log(resp);
                            for(var ctg in resp) {
                                categories.push(ctg);
                            }
                        })
                        .catch((err) => {
                            console.error(err);
                        })
                        return categories;  
                    };

class Selector extends React.Component {

  /*handleSubmit = (event) => {
    event.preventDefault();
    //console.log(this.refs.newNameInput.value);
    /*axios.post('/api/file', event,target.files[0])
                .then(resp => resp.data)
  };*/

  render () {
    return (
      <div>
         <div className='row'>
           <div className='col-md-4'>
             <Categories />
           </div>
            
         </div>
         

      </div>
    );
  }
}

export default Selector;