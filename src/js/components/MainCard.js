import { useState, useEffect } from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';

import Upload from './Upload';

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
  const { sourcefile } = props;

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

  useEffect(() => {    
    document.addEventListener('keydown', handleKeyDown, false);
    return () => document.removeEventListener('keydown', handleKeyDown, false);
  }, []);

  const onUpload = (result) => {};
  const classes = useStyles();

  if (!dialogOpen) return null;

  const getPreview = () => {
    if (!sourcefile || !sourcefile.endsWith('.png')) {
      return 'No preview available';
    }
    return ( <img width='300px' src={`${sourePath}/${sourcefile}`} /> );
  };

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
          { getPreview() }
        </div>
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
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainCard);
