import { setTilesmap } from '../store/actions.js';
import { useState } from 'react';
import { connect } from 'react-redux';
import FileInfo from './FileInfo';
import MapPreview from './MapPreview';
import UICard from './UICard';

function TilesCard(props) {
  const { tilesmap } = props;
  const tilesmapFile = tilesmap ? `/tiles/${tilesmap}` : null;

  const [fileInfo, setFileInfo] = useState();

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
