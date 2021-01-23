import { setTilesmap } from '../store/actions.js';
import { useState } from 'react';
import { connect } from 'react-redux';
import FileInfo from './FileInfo';
import MapPreview from './MapPreview';
import Button from '@material-ui/core/Button';
import UICard from './UICard';

function TilesCard(props) {
  const { tilesmap, sourcefile, setTilesmap } = props;
  const tilesmapFile = tilesmap ? `/converted/${tilesmap}` : null;

  const [fileInfo, setFileInfo] = useState();

  function onClick(event) {
    if (!sourcefile) {
      return;
    };
    fetch(`/tiles?filename=${sourcefile}&tilesize=256`).then(
      response => response.json() // if the response is a JSON object
    ).then(json => {
      setFileInfo(json);
      setTilesmap(json.filename);
    }).catch(
      error => console.log(error) // Handle the error response object
    );
  };

  return (
    <UICard
      avatar='T'
      title='Tiles'
      subtitle='Amount of tiles'
      details={
        <>
          <MapPreview src={tilesmapFile} />
          <FileInfo fileInfo={fileInfo} />
        </>
      }
      actions={
        <Button
          variant="contained"
          component="label"
          disabled= { !sourcefile }
          onClick={ onClick }
        >
        Create Tiles
        </Button>
      }
    >
    </UICard>
  );
};

function mapStateToProps(state) {
  return {
    tilesmap: state.tilesmap,
    sourcefile: state.sourcefile,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setTilesmap: tilesmap => dispatch(setTilesmap(tilesmap)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TilesCard);
