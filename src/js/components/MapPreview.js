import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  image: {
    width: '100%',
    position: 'absolute',
  },
  container: {
    backgroundColor: '#ddd',
    position: 'relative',
    width: '100%',
    paddingBottom: '100%',
  },
  placeholder: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    marginTop: '48%',
    textAlign: 'center'
  },
}));

function MapPreview(props) {
  const classes = useStyles();

  const imgsrc = props.src && props.src.endsWith('.png');
  return <div className={classes.container}>
    {imgsrc
      ? <img alt='' className={classes.image} src={props.src} />
    : <div className={classes.placeholder} >no preview available</div>
    }
  </div>
};

export default MapPreview;