import { useContext, createContext, useRef, useEffect } from "react";
import { createCasketStoreV2 } from "../storage/CasketStoreV2";
import { useStore } from 'zustand';

const AppContextV2 = createContext(null);

const AppContextV2Provider = ({ children }) => {
  const store = useRef(createCasketStoreV2()).current;
  
  return <AppContextV2.Provider value={ store }>
    { children }
  </AppContextV2.Provider>
}

const useAppContextV2 = (selector) => {
  const store = useContext(AppContextV2);
  if (!store) throw new Error('Missing AppContextV2.Provider in the tree');
  return useStore(store, selector)
}

export { AppContextV2Provider, useAppContextV2 }