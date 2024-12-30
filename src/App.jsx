import { Suspense, useState, useEffect } from 'react';
import CasketCanvas from './components/CasketCanvas'
import DesignTool from './components/DesignTool';
import ModalSelectImage from './components/ModalSelectImage';
import { useAppContext } from './context/AppContext';
import './App.scss'

function App() {
  return (
    <Suspense fallback={ <div>Loading...</div> }>
      <div className="app-container">
        <div className="casket-design-app">
          <CasketCanvas />
          <DesignTool />
        </div> 

        <ModalSelectImage />
      </div>
    </Suspense>
  )
}

export default App
