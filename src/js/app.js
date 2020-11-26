'use strict';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MainCard from './components/MainCard';
import RenderCard from './components/RenderCard';
import HeightmapCard from './components/HeightmapCard';
import reducer from './store/reducer.js';

const store = createStore(reducer);

const useStyles = makeStyles((theme) => ({
  main: {
    padding: 12,
  },
}));

export default function App() {
  const classes = useStyles();

  return (
    <Provider store={store}>
      <div className={classes.main}>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <MainCard />
        </Grid>
        <Grid item xs={6}>
          <RenderCard />
        </Grid>
        <Grid item xs={3}>
          <HeightmapCard />
        </Grid>
      </Grid>
      </div>
    </Provider>
  );
};