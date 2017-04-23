import React, { PropTypes } from 'react';
import DecisionMaker from './DecisionMaker';
import Categories from './Categories';


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
           <div className='col-md-6'>
             <Categories />
           </div>
           <div className='col-md-6'>
             <Categories />
           </div>
         </div>
         <div className='row'>
           <div className='col-md-12'>
             <DecisionMaker />
           </div>
          </div>
         

      </div>
    );
  }
}

export default Selector;