const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');

import Upload from './Components/Upload';
import Selector from './Components/Selector';


class App extends React.Component {

    handleFormSubmit (formSubmitEvent) {
        formSubmitEvent.preventDefault();
        console.log('You have selected:', this.state.selectedOption);
    }

    handleOptionChange (changeEvent) {
        this.setState({
            selectedOption: changeEvent.target.value
        });
    }

    handleClick(e) {
        e.preventDefault();
        console.log('The link was clicked.');
    }
    render() {
        //return React.createElement('h2', null, 'Hi');
        return (
            <div>
                <div className='row'>
                    <div className='col-md-6'>
                        <Upload />
                    </div>
                    <div className='col-md-6'>
                        <div className='wrapper'>
                        <h2 className='text-center'>Most Influyent Node </h2>
                        </div>
                    </div>
                </div><br/>
                <div className='row'>
                    <div className='col-md-12'>
                        <div className='wrapper'>
                            <h3 className='text-center'>Selector</h3>
                            <Selector />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

ReactDOM.render(
		<App />,
		document.getElementById('app')
);
