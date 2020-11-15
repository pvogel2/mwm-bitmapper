import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Renderer from './Renderer';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: 275,
    position: 'absolute',
    top: '30px',
    left: '500px',
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
  root: {
    display: 'flex',
  },
  render: {
    width: '1024px',
    height: '1024px'
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));
  
function RenderCard(props) {
  const { heightmap } = props;

  const classes = useStyles();

  if (!heightmap) {
    return null;
  };

  return (
    <Card className={classes.card}>
      <CardContent className={classes.root}>
        <Renderer  className={classes.render} />
      </CardContent>
    </Card>
  );
};

function mapStateToProps(state) {
  return {
    heightmap: state.heightmap,
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RenderCard);
