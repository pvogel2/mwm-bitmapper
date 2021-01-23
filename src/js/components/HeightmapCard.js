import { setHeightmap } from '../store/actions.js';
import { connect } from 'react-redux';
import { useState, useEffect } from 'react';
import FileInfo from './FileInfo';
import MapPreview from './MapPreview';
import UICard from './UICard';

function HeightmapCard(props) {
  const { heightmap, sourcefile, setHeightmap } = props;

  const [fileInfo, setFileInfo] = useState();

  useEffect(async () => {
    if (sourcefile && !heightmap) {      
      const data = {
        sourcefile,
      };
    
      try {
        const rawinfo = await fetch('/convert', { // Your POST endpoint
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data), //
        });
        if (!rawinfo.ok) {
          throw new Error('fetch failed');
        };
        const fileinfo = await  rawinfo.json();

        setFileInfo(fileinfo);
        setHeightmap(fileinfo.filename);
      } catch (err) {
        console.log(err); // Handle the error response object
      };
    }
  }, [sourcefile, heightmap]);

  const heightmapFile = heightmap ? `/converted/${heightmap}` : null;

  return (
    <UICard
      avatar='H'
      title='Height map'
      subtitle={ heightmap }
      details={
        <>
          <MapPreview src={heightmapFile} />
          <FileInfo fileInfo={fileInfo} />
        </>
      }
    >
    </UICard>
  );
};

function mapStateToProps(state) {
  return {
    heightmap: state.heightmap,
    sourcefile: state.sourcefile
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
)(HeightmapCard);
