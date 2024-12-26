import { useEffect, useMemo, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Canvas } from '@react-three/fiber';
import CasketModel from './CasketModel';
import randomColor from 'randomcolor';
import * as THREE from "three";
import { 
  useGLTF,
  Environment, 
  OrbitControls, 
  Center, 
  Decal} from '@react-three/drei';  

const __PLANES_DEFINE = ['', {
  id: '__backend__',
  name: 'backend',
  color: 'black',
  view: [-2.819269401730402, 1.9769021997458804], // Azi, Pol
  decalConfig: {
    pos: [0,0,0],
    rot: [0,0,0],
    scl: [12, 12, 2],
  }
}, {
  id: '__lid__',
  name: 'lid',
  color: '#ddd',
  view: [-0.22491812835276132, 2.0371329258880064], // Azi, Pol
}, {
  id: '__front_side__',
  name: 'front side',
  color: '#ddd',
  view: [-1.9351159501540591, 1.7466209919838398], // Azi, Pol
}, {
  id: '__back_side__',
  name: 'back side',
  color: '#ddd',
  view: [1.2080215566474104, 1.8710592552563858], // Azi, Pol
}, {
  id: '__bottom_end__',
  name: 'bottom end',
  color: '#ddd',
  view: [0.004097758122175433, 2.977440076749534], // Azi, Pol
}, {
  id: '__top_end__',
  name: 'top end',
  color: '#ddd',
  view: [-0.005325403188909339, 0.2321295791637319], // Azi, Pol
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
    return Object.keys(nodes).map((__node_key, __n_index) => {
      return {
        __key: __n_index,
        node_key: __node_key,
        node: nodes[__node_key],
        decal_image: 'https://cdn.dribbble.com/userupload/15185304/file/original-20a4596c0b2cb7fbb3381e3a51e27ba0.jpg?resize=752x940&vertical=center',
        ...__PLANES_DEFINE[__n_index],
      }
    }).filter(n => n.__key >= 1);
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
      <OrbitControls ref={ OrbitControls_Ref } onChange={ onChangeOrb } /> 
    </Canvas>
  </div>
}