import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer';

const defaultProps = {
  modelConfig: {
    scale: .25,
    center: [-2.5 * .25, -5 * .25, -.75 * .25]
  },
  debugMode: true,
  casketModel: '/CasketDesign18-12-24.glb', 
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
  })));
}