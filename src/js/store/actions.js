export const HEIGHTMAP ='HEIGHTMAP';
export const SOURCEFILE ='SOURCEFILE';


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