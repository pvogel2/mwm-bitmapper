import { useState } from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Slider from '@material-ui/core/Slider';
import Avatar from '@material-ui/core/Avatar';

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
  
function RendererControls(props) {
  const {
    onChange = () => {},
  } = props;

  const [scale, setScale] = useState(1.0);

  const classes = useStyles();

  function handleScaleChange(event, scale) {
    onChange({
      scale,
    });
    setScale(scale);
  }

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar 
            aria-label='Render Controls'
            className={classes.avatar}>
            R
          </Avatar>
        }
        title='Render Controls'
      />
      <CardContent className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Vertical scale</FormLabel>
          <Slider
            min={0.0}
            max={5.0}
            value={scale}
            onChange={handleScaleChange}
            valueLabelDisplay="auto"
          />
        </FormControl>
      </CardContent>
    </Card>
  );
};

export default RendererControls ;
