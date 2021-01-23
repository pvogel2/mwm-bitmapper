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
  } = props;

  const classes = useStyles();
  const hasActions = React.isValidElement(actions);

  return (
    <Accordion>
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

export default UICard;
