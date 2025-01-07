import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer';
import * as Helpers from '../helpers/helpers';

const defaultProps = {
  modelConfig: {
    scale: .35,
    center: [0, -4.945 * .35, -.795 * .35]
  },
  debugMode: true,
  casketModel: '/Casket2025-mini.glb', 
  planes: [],
  cameraCurrentView: [0, 0],
  planeIDCurrentEdit: '',
}

export const createCasketStore = (initProps) => {
  return create(immer((set, get) => ({
    ...initProps,
    ...defaultProps,
    setModel: (casketModel) => {
      set({ casketModel })
    },
    setPlanes: async (planes) => {
      set({ planes });
    },
    setCameraCurrentView: (cameraCurrentView) => {
      set({ cameraCurrentView })
    },
    setPlaneIDCurrentEdit: (planeIDCurrentEdit) => {
      set({ planeIDCurrentEdit })
    },
    setPlaneItemPos: (planeID, posXYZ) => {
      let planeIndex = get().planes.findIndex(p => p.id == planeID);

      set((state) => {
        state.planes[planeIndex].decalConfig.pos = posXYZ;
      })
    },
    setPlaneItemRot: (planeID, rotXYZ) => {
      let planeIndex = get().planes.findIndex(p => p.id == planeID);
      set((state) => {
        state.planes[planeIndex].decalConfig.rot = rotXYZ;
      })
    },
    setPlaneItemScl: (planeID, sclXYZ) => {
      let planeIndex = get().planes.findIndex(p => p.id == planeID);
      set((state) => {
        state.planes[planeIndex].decalConfig.scl = sclXYZ;
      })
    },
    setPlaneItemDecalImage: (planeID, imageUrl) => {
      let planeIndex = get().planes.findIndex(p => p.id == planeID);
      set((state) => {
        state.planes[planeIndex].decal_image = imageUrl;
      })
    },
    modalSelectImage__ref: null,
    setModalSelectImage__ref: (ref) => {
      set({ modalSelectImage__ref: ref });
    },

    onFittedCenterDecal: (planeItem) => { 
      const { decal_image, node } = planeItem;
      const { geometry } = node;
      console.log(planeItem);
      Helpers.imageOnLoad(decal_image, (img) => {
        const { width, height } = img;
        const { x, y, z } = geometry?.boundingBox?.max;
        
        switch(planeItem.id) { 
          case '__lid__':
            {
              let newSize = Helpers.resizeImage({width, height}, {width: x, height: y});
              get().setPlaneItemScl(planeItem.id, [newSize.width, newSize.height, z]);
              get().setPlaneItemPos(planeItem.id, [0, y / 2, planeItem?.decalConfig?.pos[2]])
            }
            break;
          
          case '__front_side__':
            {
              let newSize = Helpers.resizeImage({width, height}, {width: x, height: y});
              get().setPlaneItemScl(planeItem.id, [newSize.width, newSize.height, z]);
              get().setPlaneItemPos(planeItem.id, [planeItem?.decalConfig?.pos[0], y / 2, z / 2])
            }
            break;

          case '__back_side__':
            { 
              // console.log('__back_side__', planeItem?.decalConfig)
              let newSize = Helpers.resizeImage({width, height}, {width: x, height: y});
              get().setPlaneItemScl(planeItem.id, [newSize.width, newSize.height, z]);
              get().setPlaneItemPos(planeItem.id, [planeItem?.decalConfig?.pos[0], y / 2, z / 2])
            }
            break;
          case '__bottom_end__':
            {
              let newSize = Helpers.resizeImage({width, height}, {width: x, height: z});
              get().setPlaneItemScl(planeItem.id, [newSize.width, newSize.height, z]);
              get().setPlaneItemPos(planeItem.id, [0, y, z/2])
            }
            break;
        }
        
      })
    }
  })));
}