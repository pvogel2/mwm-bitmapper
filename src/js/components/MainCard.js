import { 
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import UndoIcon from '@material-ui/icons/Undo';
import { connect } from 'react-redux';
import { useState, useEffect } from 'react';

import { setSourcefile, setHeightmap } from '../store/actions.js';

import Upload from './Upload';
import MapPreview from './MapPreview';
import FileInfo from './FileInfo';

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
  root: {
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));
  
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

  const classes = useStyles();

  const filepath = sourcefile ? `${sourePath}/${sourcefile}` : '';

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar 
            aria-label="main"
            className={classes.avatar}>
            M
          </Avatar>
        }
        action={
          <IconButton title="Reset" aria-label="Reset" onClick={onResetClick}>
            <UndoIcon />
          </IconButton>
        }
        title="Main"
        subheader="Upload and process heightmap."
      />
      <CardContent className={classes.root}>
          <MapPreview src={filepath} />
          <FileInfo fileInfo={fileInfo} />
      </CardContent>
      <CardActions>
        <Upload onUpload={ onUpload } />
      </CardActions>
    </Card>
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
