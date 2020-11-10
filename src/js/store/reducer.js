import { combineReducers } from 'redux';
import { HEIGHTMAP, SOURCEFILE } from './actions';

function heightmap(heightmap = '', action) {
  if (action.type === HEIGHTMAP) {
    return action.heightmap;
  } else {
    return heightmap;
  }
}

function sourcefile(sourcefile = '', action) {
  console.log('sourcefile', action);
  if (action.type === SOURCEFILE) {
    return action.sourcefile;
  } else {
    return sourcefile;
  }
}

export default combineReducers({
  heightmap,
  sourcefile,
});
