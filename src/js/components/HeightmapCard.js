import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import { setHeightmap } from '../store/actions.js';
import { connect } from 'react-redux';
import { useState, useEffect } from 'react';
import FileInfo from './FileInfo';
import MapPreview from './MapPreview';

const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: 275,
    position: 'absolute',
    top: '30px',
    right: '30px',
    zIndex: 1,
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
  hightmapImage: {
    backgroundColor: '#ccc',
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));
  
function HeightmapCard(props) {
  const { heightmap, sourcefile, setHeightmap } = props;

  const classes = useStyles();

  const [fileInfo, setFileInfo] = useState(null);

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

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar 
            aria-label='height map'
            className={classes.avatar}>
            H
          </Avatar>
        }
        title='Height map'
        subheader={ heightmap }
      />
      <CardContent className={classes.root}>
        { heightmap && <MapPreview src={`/converted/${heightmap}`} /> }
        { fileInfo && <FileInfo fileInfo={fileInfo} /> }
      </CardContent>
    </Card>
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
