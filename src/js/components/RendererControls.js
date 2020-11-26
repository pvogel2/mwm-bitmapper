import { useState } from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import CardHeader from '@material-ui/core/CardHeader';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Slider from '@material-ui/core/Slider';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: 275,
    position: 'absolute',
    top: '0',
    left: '0',
    zIndex: 1,
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
  root: {
  },
  formControl: {
    padding: theme.spacing(3),
    boxSizing: 'border-box',
    width: '100%',
  },
}));
  
function RendererControls(props) {
  const {
    onChange = () => {},
  } = props;

  const [scale, setScale] = useState(1.0);
  const [texture, setTexture] = useState(false);
  const [wireframe, setWireframe] = useState(true);

  const classes = useStyles();

  function handleTextureChange(event, _texture) {
    onChange({
      scale,
      texture: _texture,
      wireframe,
    });
    setTexture(_texture);
  }

  function handleScaleChange(event, _scale) {
    onChange({
      scale: _scale,
      texture,
      wireframe,
    });
    setScale(_scale);
  }

  function handleWireframeChange(event, _wireframe) {
    onChange({
      scale: scale,
      texture,
      wireframe: _wireframe,
    });
    setWireframe(_wireframe);
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
            step={0.01}
            value={scale}
            onChange={handleScaleChange}
            valueLabelDisplay="auto"
          />
        </FormControl>
        <FormControlLabel
          key={'textureCB'}
          control={<Checkbox checked={texture} onChange={handleTextureChange} name='texture' />}
          label={'use texture'}
        />
        <FormControlLabel
          key={'wireframeCB'}
          control={<Checkbox checked={wireframe} onChange={handleWireframeChange} name='wireframe' />}
          label={'use wireframe'}
        />
      </CardContent>
    </Card>
  );
};

export default RendererControls ;
