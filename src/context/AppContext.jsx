import { createContext, useContext, useRef, useEffect } from "react";
import { createCasketStore } from '../storage/CasketStore';
import { useStore } from 'zustand';

const AppContext = createContext(null);

const AppContextProvider = ({ children }) => {
  const store = useRef(createCasketStore()).current;

  useEffect(() => {
    // store.getState().updatePlanes([1,2,3,4])
  }, [])

  return <AppContext.Provider value={ store }>
    { children }
  </AppContext.Provider> 
}

const useAppContext = (selector) => {
  const store = useContext(AppContext);
  if (!store) throw new Error('Missing AppContext.Provider in the tree');
  return useStore(store, selector)
};

export { AppContextProvider, useAppContext }