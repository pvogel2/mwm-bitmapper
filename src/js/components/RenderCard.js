import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Renderer from './Renderer';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
  root: {
  },
  renderContainer: {
    position: 'relative',
    width: '100%',
    paddingBottom: '100%',
  },
  render: {
    width: '100%',
    height: '100%',
    position: 'absolute',
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
    <Card>
      <CardContent className={classes.root}>
        <div className={classes.renderContainer}>
         <Renderer  className={classes.render} />
        </div>
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
