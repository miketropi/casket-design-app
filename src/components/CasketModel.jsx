import { useFrame, useThree } from '@react-three/fiber';
import { useDrag } from "@use-gesture/react"
import { useSpring, a } from "@react-spring/three"
import * as THREE from "three";

import { useState, useEffect, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { Edges, Outlines, Center, Html, PivotControls } from "@react-three/drei"
import PlaneDecal from './PlaneDecal';

export default function CasketModel(props) {
  const { planes, planeIDCurrentEdit } = useAppContext();
  const [hovered, hover] = useState(false); 
  const ref = useRef()

  return <Center ref={ ref } { ...props }>
      <group position={[0, 0, 0]} scale={0.3}>
      {
        planes.map(p => {
          let { id, __key, node, color, decal_image } = p;
          let geometry = node?.geometry;
          return <mesh 
            key={ __key } 
            castShadow 
            receiveShadow 
            geometry={ geometry } 
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            dispose={null}>
            <meshStandardMaterial color={ color } roughness={1} />
            { decal_image && <PlaneDecal url={ decal_image } /> }
            {
              id == planeIDCurrentEdit && <group position={[0, 0.75, 0.5]}>
                <PivotControls
                  scale={0.55}
                  activeAxes={[true, true, true]}
                  onDrag={(local) => {
                    const position = new THREE.Vector3()
                    const scale = new THREE.Vector3()
                    const quaternion = new THREE.Quaternion()
                    local.decompose(position, quaternion, scale)
                    const rotation = new THREE.Euler().setFromQuaternion(quaternion)
                    // console.log([position.x, position.y, position.z])
                    setPosition([position.x + 2.4, position.y + 5.0, position.z + -0.8])
                    setRotate([rotation.x, rotation.y, rotation.z])
                    setScale([12 * scale.x, 12 * scale.y, 2 * scale.z])
                  }}
                />
              </group>
            }
            
            
            {/* <Edges linewidth={2} threshold={15} color={ "white" } />
            <Outlines thickness={0.01} color={ "white" } /> */}
            {/* <Center>
              <Html distanceFactor={10}>
                <div className="content">
                  __Key: { __key }
                </div>
              </Html>
            </Center> */}
          </mesh>
        })
      }
    </group>
  </Center>
}