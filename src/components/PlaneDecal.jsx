import { useTexture, Decal } from '@react-three/drei';

export default function PlaneDecal ({ url, ...props }) {
  const texture = useTexture(url)
  return <Decal 
    {...props} >
    <meshPhysicalMaterial 
    polygonOffset
    polygonOffsetFactor={-0.2} 
    map={ texture } 
    toneMapped={ false } />
  </Decal>
}