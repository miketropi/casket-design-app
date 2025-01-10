import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer';
import * as Helpers from '../helpers/helpers';
import { PlanesDataConfigInit } from './datav2'

const defaultProps = {
  modeEdit: true,
  casketPlanes: PlanesDataConfigInit,
  modelNodes: [],
  planeCurrentEditIndex: '',
  OrbitControls_Ref: null,
}

export const createCasketStoreV2 = (initProps) => {
  return create(immer((set, get) => ({
    ...initProps,
    ...defaultProps,
    setOrbitControls_Ref: (OrbitControls_Ref) => {
      set({ OrbitControls_Ref })
    },
    setPlaneCurrentEditIndex: (planeCurrentEditIndex) => {
      set({ planeCurrentEditIndex })
    },
    setModelNodes: (modelNodes) => {
      set({ modelNodes })
    },
    onAddPlane: ({ name, planeIndex, cameraPos }) => {
      let casketPlanes = get().casketPlanes;
      let found = casketPlanes.findIndex(p => p.planeIndex == planeIndex);

      if(found === -1) {
        // add 
        casketPlanes.push({
          name: (name ? name : planeIndex),
          planeIndex: planeIndex,
          cameraView: cameraPos,
          decal: { url: '', pos: [0,0,0], scl: [0.3,0.3,0.3], rot: [0,0,0] }
        })
      } else {
        // update
        casketPlanes[found] = { ...casketPlanes[found], name, cameraView: cameraPos }
        if(!casketPlanes?.decal) {
          casketPlanes[found].decal = { url: '', pos: [0,0,0], scl: [0.3,0.3,0.3], rot: [0,0,0] }
        }
      }
      set({ casketPlanes })
    },
    onUpdatePlaneDecalImage: (imageUrl, planeEditIndex) => {
      let planes = get().casketPlanes;
      let __index = planes.findIndex( p => p.planeIndex == planeEditIndex );
      set(state => {
        state.casketPlanes[__index].decal.url = imageUrl;
      })
    },
    onUpdateDecalPos: (planeEditIndex, pos) => {
      let planes = get().casketPlanes;
      let __index = planes.findIndex( p => p.planeIndex == planeEditIndex );
      set(state => {
        state.casketPlanes[__index].decal.pos = pos;
      })
    },
    onUpdateDecalRot: (planeEditIndex, rot) => {
      let planes = get().casketPlanes;
      let __index = planes.findIndex( p => p.planeIndex == planeEditIndex );
      set(state => {
        state.casketPlanes[__index].decal.rot = rot;
      })
    },
    onUpdateDecalScl: (planeEditIndex, scl) => {
      let planes = get().casketPlanes;
      let __index = planes.findIndex( p => p.planeIndex == planeEditIndex );
      set(state => {
        state.casketPlanes[__index].decal.scl = scl;
      })
    },
    onUpdateMeshSize: (planeEditIndex, size) => {
      let planes = get().casketPlanes;
      let __index = planes.findIndex( p => p.planeIndex == planeEditIndex );
      if(!planes[__index]) return;

      set(state => {
        state.casketPlanes[__index].size = size; 
      })
    },
    onDecalResizeCenter: (planeEditIndex) => {
      let planes = get().casketPlanes;
      let nodes = get().modelNodes;

      let __index = planes.findIndex( p => p.planeIndex == planeEditIndex );
      let item = planes[__index];
      let node = nodes[planeEditIndex];

      if(!item.decal.url) return;
      Helpers.imageOnLoad(item.decal.url, (img) => {
        const { width, height } = img;
        let newSize = Helpers.resizeImage(
          {width, height}, 
          { width: item.size[item.mapSize.width], height: item.size[item.mapSize.height] });
        
          // console.log('newSize', newSize)
        get().onUpdateDecalScl(planeEditIndex, [newSize.width * 1.01, newSize.height * 1.01, 0.3])
      })
    },
    
  })))
}