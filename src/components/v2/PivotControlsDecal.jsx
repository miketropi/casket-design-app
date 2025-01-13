import * as THREE from "three";
import { PivotControls } from "@react-three/drei";
import { useAppContextV2 } from "../../context/AppContextV2";

export default function PivotControlsDecal({ planeItem, node }) {
  const { modeEdit, planeCurrentEditIndex, onUpdateDecalPos } = useAppContextV2();
  // console.log(planeItem, node);
  return <group>
    <PivotControls
      scale={ 0.1 }
      offset={ node.geometry.boundingSphere.center }
      rotation={ planeItem.decal.rot }
      activeAxes={[true, true, true]}
      visible={ ((planeCurrentEditIndex && planeCurrentEditIndex == planeItem.planeIndex && modeEdit) == true ? true : false) }
      onDrag={(local) => {
        const position = new THREE.Vector3()
        const scale = new THREE.Vector3()
        const quaternion = new THREE.Quaternion()
        local.decompose(position, quaternion, scale)
        const rotation = new THREE.Euler().setFromQuaternion(quaternion)
        
        onUpdateDecalPos(planeItem.planeIndex, [position.x, position.y, position.z])
        // setPlaneItemPos(__id, [
        //   position.x + pivotInitConfig.__pos[0], 
        //   position.y + pivotInitConfig.__pos[1], 
        //   position.z + pivotInitConfig.__pos[2]])
        // setPlaneItemRot(__id, [
        //   rotation.x + pivotInitConfig.__rot[0], 
        //   rotation.y + pivotInitConfig.__rot[1], 
        //   rotation.z + pivotInitConfig.__rot[2]])
        // setPlaneItemScl(__id, [
        //   pivotInitConfig.__scl[0] * scale.x, 
        //   pivotInitConfig.__scl[1] * scale.y, 
        //   pivotInitConfig.__scl[2] * scale.z])
      }}
    />
  </group>
}