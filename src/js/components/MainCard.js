import { useState, useEffect } from 'react';

import { 
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import { setSourcefile, setHeightmap } from '../store/actions.js';

import Upload from './Upload';
import MapPreview from './MapPreview';

const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: 275,
    position: 'absolute',
    top: '30px',
    left: '30px',
    zIndex: 1,
  },
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

  const sourePath = '/uploaded';
  let toggleDialog = false;

  const [dialogOpen, setDialogOpen] = useState(true);

  function handleKeyDown(e) {
    if (e.key !== 'm') return;

    toggleDialog = !toggleDialog;
    setDialogOpen(toggleDialog);
  }

  function onClose() {
    toggleDialog = false;
    setDialogOpen(false);
  }

  function onResetClick() {
    setSourcefile('');
    setHeightmap('');
  }

  useEffect(() => {    
    document.addEventListener('keydown', handleKeyDown, false);
    return () => document.removeEventListener('keydown', handleKeyDown, false);
  }, []);

  const onUpload = (result) => {};
  const classes = useStyles();

  if (!dialogOpen) return null;

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar 
            aria-label="main"
            className={classes.avatar}>
            M
          </Avatar>
        }
        action={
          <IconButton aria-label="Close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        }
        title="Main"
        subheader="Upload and process heightmap."
      />
      <CardContent className={classes.root}>
        <div>
          <Upload onUpload={ onUpload } />
        </div>
        <br />
        <div>
          <MapPreview src={`${sourePath}/${sourcefile}`} />
        </div>
        <Button variant="contained" onClick={ onResetClick } >reset</Button>
      </CardContent>
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
