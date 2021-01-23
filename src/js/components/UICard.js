import { connect } from 'react-redux';
import { setAccExpanded } from '../store/actions.js';

import { 
  CardHeader,
  Avatar,
  Divider,
  Accordion,
  AccordionDetails,
  AccordionActions,
  AccordionSummary,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
  details: {
    flexDirection: 'column',
  },
}));
  
function UICard(props) {
  const {
    avatar = 'A',
    title = 'title',
    subtitle = 'sub',
    details,
    actions,
    accExpanded,
    setAccExpanded,
  } = props;

  const classes = useStyles();
  const hasActions = React.isValidElement(actions);

  const name = `panel${avatar}`;
  const handleChange = () => (event, isExpanded) => {
    setAccExpanded(isExpanded ? name : '');
  };

  return (
    <Accordion expanded={ accExpanded === name } onChange={ handleChange() } >
      <AccordionSummary>
      <CardHeader
        avatar={
          <Avatar 
            aria-label="main"
            className={classes.avatar}>
            { avatar }
          </Avatar>
        }
        title={ title }
        subheader={ subtitle }
      />
    </AccordionSummary>
    <Divider />
    { hasActions &&
      <>
        <AccordionActions>
          { actions }
        </AccordionActions>
        <Divider />
      </>
    }
    <AccordionDetails className={classes.details}>
      { details }
   </AccordionDetails>
  </Accordion>
  );
};

function mapStateToProps(state) {
  return {
    accExpanded: state.accExpanded,
  }
};

function mapDispatchToProps(dispatch) {
  return {
    setAccExpanded: accExpanded => dispatch(setAccExpanded(accExpanded)),
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UICard);
