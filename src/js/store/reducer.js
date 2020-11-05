import { combineReducers } from 'redux';
import { HEIGHTMAP } from './actions';

function heightmap(heightmap = '/res/img/bmout_clr_bmout_unrealExport02.r16.png', action) {
  if (action.type === HEIGHTMAP) {
    return action.heightmap;
  } else {
    return heightmap;
  }
}
  
export default combineReducers({
  heightmap,
});
