import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer';
import { useGLTF } from '@react-three/drei';

const defaultProps = {
  casketModel: '/CasketDesign18-12-24.glb', 
  planes: [],
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
  })));
}