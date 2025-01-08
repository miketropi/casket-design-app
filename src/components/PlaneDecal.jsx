import { useAppContext } from "../context/AppContext";
import { useState, useEffect } from 'react';
import { useTexture, Decal, useMatcapTexture } from '@react-three/drei';

export default function PlaneDecal ({ url, ...props }) {
  const { planeIDCurrentEdit } = useAppContext();
  const texture = useTexture(url);
  const [_debug, set_Debug] = useState(false);

  // useEffect(() => {
  //   const { naturalHeight, naturalWidth } = texture.image;
  //   let ratio = naturalWidth/naturalHeight;

  // }, [url])

  useEffect(() => {
    let interVal = null;
    if(planeIDCurrentEdit == props.__id) {
      interVal = setInterval(() => {
        set_Debug(!_debug)
      }) 
    } else {
      set_Debug(false)
    }
    
    return () => {
      if(interVal) clearInterval(interVal)
    }
  }, [_debug, planeIDCurrentEdit]);
  
  const [matcap] = useMatcapTexture('BAADA8_ECE6E7_9A8378_E3DCD3');

  return <Decal 
    {...props} 
    debug={ _debug } 
    >
    {/* <meshPhysicalMaterial 
    polygonOffset
    polygonOffsetFactor={-0.2}   
    map={ texture } 
    toneMapped={ false } />  */}
    <meshMatcapMaterial matcap={ matcap } map={ texture }   />
  </Decal>
}