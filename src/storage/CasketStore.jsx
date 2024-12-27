import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer';

const defaultProps = {
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

      // set({ planes: [
      //   planeIndex
      // ] })
    },
    setPlaneItemRot: (planeID, rotXYZ) => {
      let __plane = [...get().planes];
      let planeIndex = get().planes.findIndex(p => p.id == planeID);
      __plane[planeIndex].decalConfig.rot = rotXYZ;
      set({ planes: __plane })
    },
    setPlaneItemScl: (planeID, sclXYZ) => {
      let __plane = [...get().planes];
      let planeIndex = get().planes.findIndex(p => p.id == planeID);
      __plane[planeIndex].decalConfig.scl = sclXYZ;
      set({ planes: __plane })
    }
  })));
}