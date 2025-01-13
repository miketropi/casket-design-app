export default function Light() {
  return <>
    <ambientLight intensity={10} />
    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
    <hemisphereLight color="white" groundColor="blue" intensity={0.75} />
  </>
}