import { useEffect, useMemo, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Canvas, useThree } from '@react-three/fiber';
import CasketModel from './CasketModel';
import randomColor from 'randomcolor';
import * as THREE from "three";
import { 
  useGLTF,
  Environment, 
  OrbitControls, 
  Center,
  Backdrop,
  Stage } from '@react-three/drei';  

const __PLANES_DEFINE = [{
  id: '__backend__',
  name: 'backend',
  color: 'black',
  view: [-2.819269401730402, 1.9769021997458804], // Azi, Pol
  minHeight: 10.2,
  decalConfig: {
    pos: [0,0,0],
    rot: [0,0,0],
    scl: [10, 10, .5],
  }
}, {
  id: '__lid__',
  name: 'lid',
  color: '#ddd',
  view: [-0.22491812835276132, 2.0371329258880064], // Azi, Pol
  // decal_image: 'https://images.unsplash.com/photo-1731607051748-620edac3fb60?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  minHeight: 10.2,
  decalConfig: {
    pos: [0,4.98,1.40],
    // pos: [0,0,0],
    rot: [0,0,0],
    scl: [10, 10, .5],
  }
}, {
  id: '__front_side__',
  name: 'front side',
  color: '#ddd',
  view: [-1.9351159501540591, 1.7466209919838398], // Azi, Pol
  // decal_image: 'https://cdn.dribbble.com/userupload/16380985/file/original-b1ee5ac0fe09b589c2d6141ee4bf4d15.png?resize=752x752&vertical=center',
  minHeight: 10.2,
  decalConfig: {
    pos: [-1.15,4.99,1.09], 
    rot: [3.14,-1.57,3.14],
    scl: [10.1, 10.1, 3],
  } 
}, {
  id: '__back_side__',
  name: 'back side',
  color: '#ddd',
  view: [1.2080215566474104, 1.8710592552563858], // Azi, Pol
  // decal_image: 'https://cdn.dribbble.com/userupload/17224934/file/original-7d0a34621afe6b94acb1c8848c91884a.jpeg?resize=1024x771&vertical=center',
  minHeight: 10.2,
  decalConfig: {
    pos: [1.54,4.89,0.79],
    rot: [0,1.57,0],
    scl: [10.1, 10.1, 1.59],
  }
}, {
  id: '__bottom_end__',
  name: 'bottom end',
  color: '#ddd',
  view: [0.004097758122175433, 2.977440076749534], // Azi, Pol
  // decal_image: 'https://plus.unsplash.com/premium_photo-1732783307875-7fea5e3eee27?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  minHeight: 4.2,
  decalConfig: {
    pos: [0.12,0.09,0.88],
    rot: [1.57,0,0],
    scl: [4, 4, .5],
  }
}, {
  id: '__top_end__',
  name: 'top end',
  color: '#ddd',
  view: [-0.005325403188909339, 0.2321295791637319], // Azi, Pol
  minHeight: 4.2,
  decalConfig: {
    pos: [0.017,10.08,0.80],
    rot: [-1.57,0,0],
    scl: [0, 0, .5],
  }
}];

export default function CasketCanvas() {
  const { casketModel, setPlanes, cameraCurrentView } = useAppContext();
  const OrbitControls_Ref = useRef(null);

  const onChangeOrb = (e) => {
    return;

    console.log([
      OrbitControls_Ref.current.getAzimuthalAngle(), 
      OrbitControls_Ref.current.getPolarAngle()]);
  } 

  useEffect(() => {
    // console.log(OrbitControls_Ref.current)
    if(!OrbitControls_Ref.current) return;

    const [azi, pol] = cameraCurrentView;
    OrbitControls_Ref.current.setAzimuthalAngle(azi);
    OrbitControls_Ref.current.setPolarAngle(pol);
  }, [cameraCurrentView])

  const planes = useMemo(() => {
    const { nodes } = useGLTF(casketModel);
    let __nodes = Object.values(nodes)
    __nodes.splice(0, 1);

    // backend | left | lid | bottom | right | top (model)
    // backend | lid | left | right | bottom | top (init)
    let __map = [0, 2, 1, 4, 3, 5];

    return [...__PLANES_DEFINE].map((item, __index) => {
      let __n = __nodes[__map[__index]];
      
      return {
        __key: __index,
        node: __n,
        ...item
      }
    })

    // console.log(__r)

    // return Object.keys(nodes).map((__node_key, __n_index) => {
    //   return {
    //     __key: __n_index,
    //     node_key: __node_key,
    //     node: nodes[__node_key],
    //     ...__PLANES_DEFINE[__n_index],
    //   }
    // }).filter(n => n.__key >= 1);
  }, [casketModel]);

  useEffect(() => { 
    setPlanes(planes);
  }, [planes])

  return <div className="casket-canvas-comp">
    <Canvas shadows camera={{ position: [2, 2, 10], fov: 25 }}>
      <ambientLight intensity={1} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <hemisphereLight color="white" groundColor="blue" intensity={0.75} />
      <color attach="background" args={['#eee']} />

      { /** display vector xyz */ }
      <primitive object={new THREE.AxesHelper(10)} /> 
      
      <CasketModel />
      <Environment preset="city" />

      { /** mouse control camera */ }
      <OrbitControls 
        makeDefault 
        // enableZoom={false} 
        // enablePan={false}
        ref={ OrbitControls_Ref } 
        onChange={ onChangeOrb } /> 
    </Canvas>
  </div>
}