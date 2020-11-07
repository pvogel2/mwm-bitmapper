'use strict';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import MainCard from './components/MainCard';
import RenderCard from './components/RenderCard';
import ActiveCard from './components/ActiveCard';
import ResultMapCard from './components/ResultMapCard';
import reducer from './store/reducer.js';

const store = createStore(reducer);

export default function App() {
  return (
    <Provider store={store}>
      <MainCard />
      <ActiveCard />
      <RenderCard />
      <ResultMapCard />
    </Provider>
  );
};