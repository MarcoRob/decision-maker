const React = require('react');
const ReactDOM = require('react-dom');
const axios = require('axios');

import Upload from './Components/Upload';
import Selector from './Components/Selector';

class InfluyentNode extends React.Component {

    constructor(props, context) {
		super(props, context);
		this.state = {
			"influyent": {}
		};
	}

    componentDidMount() {
        axios.get('/api/selectedOptions')
			.then((array) => {
                console.log(array.data);
                console.log('array Size '+array.data.length);
                if(array.data.length > 1) {
                    var size = Math.floor((Math.random() * array.data.length) + 1);
                    console.log('size '+size);
                    this.setState({"influyent": array.data[size]});
                } else {
                    this.setState({"influyent": array.data[0]});
                }
                
			})
			.catch((err) => console.log(err))

        
    }
    renderInfluyentNode() {
        let label = this.state.influyent['label VARCHAR'] + "";
        console.log('label wout replace '+ label);
        label = label.replace("'", " ");
        label = label.replace("'", " ");
        console.log(label);
        return (
            <div className='center'>
              <h3 className='center'>{label}</h3><br/>
              <h4 className='center'><a href={this.state.influyent['link']}>Facebook Page</a></h4><br/>  
            </div>
        );
    }

    render() {
        return (
        <div className='center' {...this.props}>
            {this.renderInfluyentNode()}
        </div>
        );
    }  
}


class App extends React.Component {

    constructor(props, context) {
		super(props, context);
		this.state = {
			"influyent": {},
            "getInfluyent": false
		};
	}

    handleClick() {
        this.setState({
            "getInfluyent": true
        });
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
                            {this.state.getInfluyent ? <InfluyentNode /> : null}
                            <button className='btn btn-primary center' onClick={this.handleClick.bind(this)}>Get</button>
                            <br/>
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
