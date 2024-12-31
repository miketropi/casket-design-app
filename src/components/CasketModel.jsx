import { useFrame, useThree } from '@react-three/fiber';
import { useDrag } from "@use-gesture/react"
import { useSpring, a } from "@react-spring/three"
import * as THREE from "three";

import { useState, useEffect, useRef, useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import { Edges, Outlines, Center, Html, PivotControls } from "@react-three/drei"
import PlaneDecal from './PlaneDecal';

const PivotControlsDecal = ({ plane, __id }) => {
  const { 
    planeIDCurrentEdit, 
    setPlaneItemPos,
    setPlaneItemRot,
    setPlaneItemScl } = useAppContext();

  const pivotInitConfig = useMemo(() => {
    // console.log(planeIDCurrentEdit, pivotInitConfig);
    if(!planeIDCurrentEdit) return [0,0,0];
    return {
      __pos: plane.decalConfig.pos,
      __rot: plane.decalConfig.rot,
      __scl: plane.decalConfig.scl,
    }
  }, [planeIDCurrentEdit, plane.decal_image])

  return <group position={[0, 0.75, 0.5]}>
    <PivotControls
      // enabled={ (__id == planeIDCurrentEdit ? true : false) }
      scale={ 0.55 }
      offset={ pivotInitConfig.__pos }
      rotation={ pivotInitConfig.__rot }
      // disableRotations={ true }
      // disableScaling={ true }
      activeAxes={[true, true, true]}
      visible={ (__id == planeIDCurrentEdit ? true : false) }
      onDrag={(local) => {
        const position = new THREE.Vector3()
        const scale = new THREE.Vector3()
        const quaternion = new THREE.Quaternion()
        local.decompose(position, quaternion, scale)
        const rotation = new THREE.Euler().setFromQuaternion(quaternion)
        
        setPlaneItemPos(__id, [
          position.x + pivotInitConfig.__pos[0], 
          position.y + pivotInitConfig.__pos[1], 
          position.z + pivotInitConfig.__pos[2]])
        setPlaneItemRot(__id, [
          rotation.x + pivotInitConfig.__rot[0], 
          rotation.y + pivotInitConfig.__rot[1], 
          rotation.z + pivotInitConfig.__rot[2]])
        setPlaneItemScl(__id, [
          pivotInitConfig.__scl[0] * scale.x, 
          pivotInitConfig.__scl[1] * scale.y, 
          pivotInitConfig.__scl[2] * scale.z])
      }}
    />
  </group>
}

export default function CasketModel(props) {
  const { planes, modelConfig } = useAppContext();
  const [hovered, hover] = useState(false); 
  const ref = useRef();
  const viewport = useThree((state) => state.viewport);

  useEffect(() => {
    console.log(ref);
  }, [])

  return <>
    <group ref={ ref } position={ modelConfig.center } scale={ modelConfig.scale }>
      { 
        planes.map(p => {
          let { id, __key, node, color, decal_image, decalConfig } = p;
          let { pos, rot, scl } = decalConfig;
          // console.log('decalConfig', pos)

          let geometry = node?.geometry;
          return <mesh 
            key={ __key } 
            castShadow 
            receiveShadow 
            geometry={ geometry } 
            dispose={null}>
            <meshStandardMaterial color={ color } roughness={1} />

            { 
              decal_image && 
              <>
                <PlaneDecal 
                  __id={ id }
                  url={ decal_image } 
                  position={ pos } 
                  rotation={ rot } 
                  scale={ scl } 
                  /> 
                <PivotControlsDecal __id={ id } plane={ p } />
              </>
            }
          </mesh>
        })
      }
    </group>
  </>
}