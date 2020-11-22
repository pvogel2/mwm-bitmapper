import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  image: {
    width: '100%',
  },
  container: {
    width: 300,
    height: 300,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#ddd',
  },
  placeholder: {
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