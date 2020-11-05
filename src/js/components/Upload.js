
import { connect } from 'react-redux';
import { setHeightmap } from '../store/actions.js';

function Upload(props) {
  const { setHeightmap } = props;

  function onChange(event) {
    const formData = new FormData();
    const file = event.target.files[0];
    formData.append('file', file);

    fetch('/upload', { // Your POST endpoint
      method: 'POST',
      body: formData // This is your file object
    }).then(
      response => response.json() // if the response is a JSON object
    ).then(
      success => {
        console.log(success); // Handle the success response object
        setHeightmap('');
        return success;
      }
    ).catch(
      error => console.log(error) // Handle the error response object
    );
  };

  return <input type='file' name='file' onChange={onChange}/>;
};

function mapStateToProps(state) {
    return {
    }
  }
  
  function mapDispatchToProps(dispatch) {
    return {
      setHeightmap: heightmap => dispatch(setHeightmap(heightmap)),
    }
  }
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Upload);
  