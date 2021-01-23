export const HEIGHTMAP ='HEIGHTMAP';
export const SOURCEFILE ='SOURCEFILE';
export const TILESMAP ='TILESMAP';


export function setHeightmap(heightmap) {
  return {
    type: HEIGHTMAP,
    heightmap
  }
};

export function setSourcefile(sourcefile) {
  console.log('Set sourcefile', sourcefile);
  return {
    type: SOURCEFILE,
    sourcefile
  }
};

export function setTilesmap(tilesmap) {
  return {
    type: TILESMAP,
    tilesmap
  }
};
