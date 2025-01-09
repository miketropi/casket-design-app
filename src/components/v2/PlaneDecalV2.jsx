import { useMemo } from "react"; 
import { useTexture, Decal, useMatcapTexture } from "@react-three/drei";

export default function PlaneDecalV2 ({ planeItem }) {
  let texture = useTexture(planeItem.decal.url);
  return <>
    <Decal
      debug // Makes "bounding box" of the decal visible
      position={ planeItem.decal.pos } // Position of the decal
      rotation={ planeItem.decal.rot } // Rotation of the decal (can be a vector or a degree in radians)
      scale={ planeItem.decal.scl } // Scale of the decal
    >
      <meshBasicMaterial
        map={ texture }
        polygonOffset
        polygonOffsetFactor={-1} // The material should take precedence over the original
      />
      {/* <meshMatcapMaterial map={ texture } matcap={ matcap } /> */}
    </Decal>
  </>
}