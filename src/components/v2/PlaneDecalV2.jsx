import { useMemo, useState, useEffect } from "react"; 
import { useTexture, Decal, useMatcapTexture } from "@react-three/drei";
import { useAppContextV2 } from "../../context/AppContextV2";

export default function PlaneDecalV2 ({ planeItem }) {
  const { modeEdit, planeCurrentEditIndex } = useAppContextV2();
  const [_debug, set_Debug] = useState(false);

  useEffect(() => {
    let interVal = null;
    if(planeCurrentEditIndex == planeItem.planeIndex) {
      interVal = setInterval(() => {
        set_Debug(!_debug)
      }) 
    } else {
      set_Debug(false)
    }
    
    return () => {
      if(interVal) clearInterval(interVal)
    }
  }, [_debug, planeCurrentEditIndex]);

  let texture = useTexture(planeItem.decal.url);
  const [matcap] = useMatcapTexture('7A7A7A_D0D0D0_BCBCBC_B4B4B4');
  return <>
    <Decal
      debug={ (modeEdit == true ? _debug : false) } // Makes "bounding box" of the decal visible
      position={ planeItem.decal.pos } // Position of the decal
      rotation={ planeItem.decal.rot } // Rotation of the decal (can be a vector or a degree in radians)
      scale={ planeItem.decal.scl } // Scale of the decal
    >
      <meshBasicMaterial
        map={ texture }
        polygonOffset
        polygonOffsetFactor={-1} // The material should take precedence over the original
      />
      {/* <meshMatcapMaterial color={ '#FFF' } map={ texture } matcap={ matcap } /> */}
    </Decal>
  </>
}