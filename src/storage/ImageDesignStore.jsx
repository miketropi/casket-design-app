import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useImageDesignStore = create(
  immer((set) => ({
    elements: [],
    textValue: '',
    selectedElement: null,
    
    // Actions
    addElement: (element) => set((state) => {
      state.elements.push(element);
    }),
    
    setTextValue: (value) => set((state) => {
      state.textValue = value;
    }),
    
    setSelectedElement: (element) => set((state) => {
      state.selectedElement = element;
    }),
    
    updateElement: (index, updates) => set((state) => {
      
      Object.keys(updates).forEach(__k => {
        console.log(updates[__k]);
        state.elements[index][__k] = updates[__k];
      })
      // state.elements[index] = {
      //   ...state.elements[index],
      //   ...updates
      // };
    }),
    
    removeElement: (index) => set((state) => {
      state.elements.splice(index, 1);
    }),
    
    updateSelectedElement: (updates) => set((state) => {
      if (state.selectedElement) {
        const index = state.elements.findIndex(
          (_, i) => i === state.selectedElement.index
        );
        if (index !== -1) {
          state.elements[index] = {
            ...state.elements[index],
            ...updates
          };
        }
      }
    })
  }))
);

export default useImageDesignStore;