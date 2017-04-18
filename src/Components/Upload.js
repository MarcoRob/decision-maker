import React, { PropTypes } from 'react';
const axios = require('axios');


class Upload extends React.Component {

  /*handleSubmit = (event) => {
    event.preventDefault();
    //console.log(this.refs.newNameInput.value);
    /*axios.post('/api/file', event,target.files[0])
                .then(resp => resp.data)
  };*/

  render () {
    return (
      <div>
          <div className='wrapper container-fluid'>
              <h3 className='text-center'> Upload File (Graph) </h3>
              <form method="post" action="api/file" encType="multipart/form-data">
                <div className='row center-block'>
                        <div className="fileupload fileupload-new" data-provides="fileupload">
                            <span className="btn btn-primary btn-file"><i className="mdi mdi-file" aria-hidden="true"></i>&nbsp;
                                <span className="fileupload-new">Select file</span>
                            <span className="fileupload-exists">Change</span>
                            <input type="file" name='txt'/></span>
                            &nbsp;<span className="fileupload-preview"></span>
                            &nbsp;<a href="#" className="close fileupload-exists" data-dismiss="fileupload">×</a>
                        </div>
                        <div className="input-group input-group-sm">
                            <span className="input-group-addon" id="sizing-addon3">
                                <i className="mdi mdi-facebook-box" aria-hidden="true"></i></span>
                            <input name='pagename' type="text" className="form-control" placeholder="FB Page Name" aria-describedby="sizing-addon3"/>
                        </div><br/>
                        <button type="submit" className="center btn btn-primary">
                            <i className="mdi mdi-upload" aria-hidden="true"></i>&nbsp;Upload </button><br/>&nbsp;
                </div>
              </form>
              
          </div>
      </div>
    );
  }
}

export default Upload;