import { useState, useEffect } from 'react';
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
      { children }
      <meshMatcapMaterial color={hovered ? 'hotpink' : '#eee'} matcap={ matcap } />
    </mesh>
  </>
}

const DecalItem = () => {
  const [matcap] = useMatcapTexture('BAADA8_ECE6E7_9A8378_E3DCD3');
  const texture = useTexture('/original-ed1d0627b66acbe20a5b0551d54e910a.jpg');
  return <Decal
    debug // Makes "bounding box" of the decal visible
    position={[0, 0, 0]} // Position of the decal
    rotation={[-1.57, 0, 0]} // Rotation of the decal (can be a vector or a degree in radians)
    scale={[0.5, 0.5, .1]} // Scale of the decal
  >
    <meshBasicMaterial
      map={texture}
      polygonOffset
      polygonOffsetFactor={-1} // The material should take precedence over the original
    />
    {/* <meshMatcapMaterial map={ texture } matcap={ matcap } /> */}
  </Decal>
}

export default function TestModel() {
  const texture = useGLTF('/Casket2025—5.glb');
  
  console.log(texture);
  return <>
    <group>
      {
        Object.values(texture.nodes).map((i, __index) => {
          return <MeshItem 
            key={ __index } 
            node={ i } 
            itemIndex={ __index } 
            onClick={ e => { console.log(i) } } >
            {
              (__index == 5 ? <DecalItem /> : '')
            }
          </MeshItem>
        })
      }
    </group>
  </>
}