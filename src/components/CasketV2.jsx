import { useState, useEffect, useMemo, Suspense } from 'react';
import { useAppContextV2 } from '../context/AppContextV2';
import PlaneDecalV2 from './v2/PlaneDecalV2';
import PivotControlsDecal from './v2/PivotControlsDecal';
import { 
  useGLTF,
  Decal,
  useTexture,
  useMatcapTexture } from '@react-three/drei'; 

const MeshItem = ({ node, children, itemIndex, ...props }) => {
  const [hovered, hover] = useState(false)
  const [matcap] = useMatcapTexture('E8E5DE_B5AFA6_CCC5BC_C4C4BB');
  return <>
    <mesh 
      { ...props }
      castShadow 
      receiveShadow 
      geometry={node.geometry} 
      material={ node.material }
      onPointerOver={(event) => (event.stopPropagation(), hover(true))}
      onPointerOut={(event) => hover(false)}
      >
      <meshMatcapMaterial color={hovered ? 'hotpink' : '#eee'} matcap={ matcap } />
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
      <ambientLight intensity={1} />
    </group>
  </>
}

export default function CasketV2 () {
  return <>
    <CasketModelV2 />
  </>
}

