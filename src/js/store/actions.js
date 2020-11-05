export const HEIGHTMAP ='HEIGHTMAP';

export function setHeightmap(heightmap) {
  return {
    type: HEIGHTMAP,
    heightmap
  }
};