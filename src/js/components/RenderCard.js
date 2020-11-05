import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
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
    width: '520px',
    height: '300px'
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));
  
function RenderCard(props) {
  const { heightmap } = props;

  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar 
            aria-label='map'
            className={classes.avatar}>
            R
          </Avatar>
        }
        title='Active map'
        subheader={`${heightmap}`}
      />
      <CardContent className={classes.root}>
        <div id="threejscontainer" className={classes.render}></div>
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
