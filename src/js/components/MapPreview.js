import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  image: {
    backgroundColor: '#ddd',
  },
}));

function MapPreview(props) {
  const classes = useStyles();
  return <img alt='no preview available' width='300px' className={classes.image} src={props.src} />
};

export default MapPreview;