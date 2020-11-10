import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import { setHeightmap } from '../store/actions.js';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: 275,
    position: 'absolute',
    top: '30px',
    right: '30px',
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));
  
function HeightmapCard(props) {
  const { heightmap, sourcefile, setHeightmap } = props;
  console.log('heightmap card:', props);
  const classes = useStyles();

  if (sourcefile && !heightmap) {
    const data = {
      sourcefile,
    };

    fetch('/convert', { // Your POST endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), //
    }).then(
      response => response.json() // if the response is a JSON object
    ).then(
      success => {
        console.log('success',success); // Handle the success response object
        setHeightmap(success.filename);
        return success;
      }
    ).catch(
      error => console.log(error) // Handle the error response object
    );
  }

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
        subheader={`from ${sourcefile}`}
      />
      <CardContent className={classes.root}>
      { heightmap && <img width='300px' src={`/converted/${heightmap}`} /> }
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
