import { Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { useState } from 'react';
import { setSourcefile, setHeightmap } from '../store/actions.js';
import Upload from './Upload';
import MapPreview from './MapPreview';
import FileInfo from './FileInfo';
import UICard from './UICard';

function MainCard(props) {
  const { sourcefile, setSourcefile, setHeightmap } = props;

  const [fileInfo, setFileInfo] = useState();

  const sourePath = '/uploaded';

  function onResetClick() {
    setSourcefile('');
    setHeightmap('');
  }

  const onUpload = (result) => {
    setFileInfo(result);
  };

  const filepath = sourcefile ? `${sourePath}/${sourcefile}` : '';

  return (
    <UICard
      avatar='M'
      title='Main'
      subtitle='Upload and process heightmap'
      details={
        <>
          <MapPreview src={filepath} />
          <FileInfo fileInfo={fileInfo} />
        </>
      }
      actions={
        <>
          <Upload onUpload={ onUpload } />
          <Button title="Reset" aria-label="Reset" onClick={onResetClick}>Reset</Button>
        </>
      }
    >
    </UICard>
   );
};

function mapStateToProps(state) {
  return {
    sourcefile: state.sourcefile,
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
)(MainCard);
