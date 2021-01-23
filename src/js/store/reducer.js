import { combineReducers } from 'redux';
import { HEIGHTMAP, SOURCEFILE, TILESMAP } from './actions';

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

function tilesmap(tilesmap = '', action) {
  console.log('tilesmap', action);
  if (action.type === TILESMAP) {
    return action.tilesmap;
  } else {
    return tilesmap;
  }
}

export default combineReducers({
  heightmap,
  sourcefile,
  tilesmap,
});
