import { useFrame, useThree } from '@react-three/fiber';
import { useDrag } from "@use-gesture/react"
import { useSpring, a } from "@react-spring/three"

import { useState, useEffect, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { Edges, Outlines, Center } from "@react-three/drei"

export default function CasketModel() {
  const { planes } = useAppContext();
  const [hovered, hover] = useState(false);
  // const [boxPosition, setBoxPosition] = useState(startPosition)   
  const ref = useRef()

  // const bind = useGesture({
  //   onDrag: ({movement: [x, y]}) => {
  //       setControlsDisabled(true);
  //       setBoxPosition( (prev) => {
  //           const newObj = {...prev};
  //           newObj.x = newObj.x0 + (x/100);
  //           newObj.z = newObj.z0 + (y/100);
  //           return newObj;
  //       } )
  //   },
  //   onDragEnd: () => {
  //       setControlsDisabled(false);
  //       setBoxPosition( (prev) => {
  //           const newObj = {...prev};
  //           newObj.x0 = newObj.x;
  //           newObj.z0 = newObj.z;
  //           return newObj;
  //       } )
  //   }
  // })
  
  // useFrame((state, delta) => (ref.current.rotation.x = ref.current.rotation.y += delta))

  return <Center ref={ref}>
      <group position={[0, 0, 0]} scale={0.3}>
      {
        planes.map(p => {
          let { __key, node, color } = p;
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
            {/* <Edges linewidth={2} threshold={15} color={ "white" } />
            <Outlines thickness={0.01} color={ "white" } /> */}
          </mesh>
        })
      }
    </group>
  </Center>
}