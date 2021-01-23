
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { setSourcefile, setHeightmap, setTilesmap } from '../store/actions.js';

function Upload(props) {
  const { setHeightmap, setSourcefile, onUpload = () => {} } = props;

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
      fileinfo => {
        setSourcefile(fileinfo.filename);
        setHeightmap('');
        setTilesmap('');
        onUpload(fileinfo);
        return fileinfo;
      }
    ).catch(
      error => console.log(error) // Handle the error response object
    );
  };

  return <Button
    variant="contained"
    component="label"
  >
    Upload File
    <input
      type="file"
      hidden
      onChange={onChange}
      name='file'
    />
  </Button>
};

function mapStateToProps(state) {
    return {
    }
  }
  
  function mapDispatchToProps(dispatch) {
    return {
      setHeightmap: heightmap => dispatch(setHeightmap(heightmap)),
      setSourcefile: sourcefile => dispatch(setSourcefile(sourcefile)),
    }
  }
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Upload);
  