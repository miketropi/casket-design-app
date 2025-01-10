import { useState, useEffect, useMemo, Suspense, useRef } from 'react';
import { useAppContextV2 } from '../context/AppContextV2';
import PlaneDecalV2 from './v2/PlaneDecalV2';
import PivotControlsDecal from './v2/PivotControlsDecal';
import * as THREE from "three";
import { 
  useGLTF,
  Decal,
  useTexture,
  useMatcapTexture } from '@react-three/drei'; 

const MeshItem = ({ node, children, itemIndex, ...props }) => {
  const { onUpdateMeshSize } = useAppContextV2();  
  const [hovered, hover] = useState(false);
  const [matcap] = useMatcapTexture('796D6B_DED3CB_C6BAB1_ADA09B');
  const meshRef = useRef(null);

  useEffect(() => {
    if(!meshRef.current) return;
    // console.log(meshRef.current)
    // onAddMeshRef(itemIndex, meshRef.current)

    const boundingBox = new THREE.Box3().setFromObject(meshRef.current);
    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    
    // Lấy vị trí
    const position = meshRef.current.position;

    // console.log(itemIndex)
    // console.log("Size:", size); // Kích thước của mô hình
    // console.log("Position:", position); // Vị trí của mô hình

    onUpdateMeshSize(itemIndex, size)
  }, [])

  return <>
    <mesh 
      { ...props }
      ref={ meshRef }
      // castShadow 
      // receiveShadow 
      geometry={node.geometry} 
      material={ node.material }
      onPointerOver={(event) => (event.stopPropagation(), hover(true))}
      onPointerOut={(event) => hover(false)}
      >
      <meshMatcapMaterial color={hovered ? 'hotpink' : '#FFF'} matcap={ matcap } />
      { children }
    </mesh>
  </>
}

const CasketModelV2 =  function() {
  const { modeEdit, onAddPlane, OrbitControls_Ref, casketPlanes, setModelNodes } = useAppContextV2();
  const texture = useGLTF('/Casket2025—5.glb');
  
  useEffect(() => {
    if(!texture.nodes) return;
    setModelNodes(Object.values(texture.nodes))
  }, [texture]);

  return <>
    <color attach="background" args={['#252530']} />    
    {/* <ambientLight intensity={0.25 * Math.PI} />
    <spotLight decay={0} position={[10, 10, 10]} angle={0.15} penumbra={1} />
    <pointLight decay={0} position={[-10, 0, -5]} angle={0.5} intensity={6} /> */}
    <group>
      {
        Object.values(texture.nodes).map((i, __index) => {
          return <MeshItem 
            key={ __index } 
            node={ i } 
            itemIndex={ __index } 
            onDoubleClick={ e => { 
              e.stopPropagation();
              if(modeEdit == false) return;
              let name = prompt("Please enter plane name!", "");
              let cameraPos = [OrbitControls_Ref.current.getAzimuthalAngle(), OrbitControls_Ref.current.getPolarAngle()];
              let initData = { name, planeIndex: __index, cameraPos: cameraPos }
              onAddPlane(initData);
            } } 
            >  
            {
              (() => {
                let plane = casketPlanes.find( p => p.planeIndex == __index );
                return (plane?.decal?.url 
                  ? <Suspense>
                      <PlaneDecalV2 planeItem={ plane } node={ i } />
                      <PivotControlsDecal planeItem={ plane } node={ i } />
                    </Suspense> 
                  : '')
              })()
            }
          </MeshItem>
        })
      }
    </group>
  </>
}

export default function CasketV2 () {
  return <>
    <CasketModelV2 />
  </>
}

