import { useEffect, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Canvas } from '@react-three/fiber';
import CasketModel from './CasketModel';
import randomColor from 'randomcolor';
import { 
  useGLTF,
  Environment, 
  OrbitControls, 
  Center, 
  Decal} from '@react-three/drei';  

export default function CasketCanvas() {
  const { casketModel, setPlanes } = useAppContext();
  const planes = useMemo(() => {
    const { nodes } = useGLTF(casketModel);
    return Object.keys(nodes).map((__node_key, __n_index) => {
      return {
        __key: __n_index,
        node_key: __node_key,
        node: nodes[__node_key],
        decal_image: '',
        color: randomColor({
          luminosity: 'dark',
          // hue: 'random'
        }),
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
      {/* <color attach="background" args={['aquamarine']} />
      <ambientLight />
      <directionalLight position={[10, 10, -15]} castShadow shadow-bias={-0.0001} shadow-mapSize={1024} /> */}
      
      {/* <Center>
        
      </Center> */}
      <CasketModel /> 
      
      <Environment preset="city" />
      {/* <OrbitControls makeDefault />  */}
    </Canvas>
  </div>
}