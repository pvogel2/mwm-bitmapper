'use strict';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import MainCard from './components/MainCard';
import RenderCard from './components/RenderCard';
import ActiveMap from './components/ActiveMap';
import reducer from './store/reducer.js';

const store = createStore(reducer);

export default function App() {
  return (
    <Provider store={store}>
      <MainCard />
      <RenderCard />
      <ActiveMap
        name='bmout_unrealisland01.png'
      />
    </Provider>
  );
};