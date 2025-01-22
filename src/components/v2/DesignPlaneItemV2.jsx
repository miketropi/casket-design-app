import { useMemo } from "react";
import { useAppContext } from "../../context/AppContext";
import { useAppContextV2 } from "../../context/AppContextV2"

export default function PlaneDesignItemV2() {
  const { modalSelectImage__ref } = useAppContext();
  const { modelNodes, casketPlanes, planeCurrentEditIndex, setPlaneCurrentEditIndex, onUpdatePlaneDecalImage, onDecalResizeCenter } = useAppContextV2();
  const planeEdit = useMemo(() => {
    return casketPlanes.find( p => p.planeIndex == planeCurrentEditIndex );
  })
  
  return <div className="design-plane-item-v2">
    <a href="#" onClick={ e => {
      e.preventDefault();
      setPlaneCurrentEditIndex('');
    } }>Back</a>
    <hr />
    <button className="button __full-width" onClick={ e => {
      e.preventDefault();
      if(!modalSelectImage__ref) return;

      modalSelectImage__ref.open((imageUrl) => {
        // console.log(imageUrl);
        onUpdatePlaneDecalImage(imageUrl, planeCurrentEditIndex);
        modalSelectImage__ref.close()
        onDecalResizeCenter(planeCurrentEditIndex);
      });

    } }>Select Image</button>
    {/* {
      planeEdit && <>
        { JSON.stringify(planeEdit) }
      </>
    } */}
    <hr />
    {/* <button className="button" onClick={ e => {
      e.preventDefault();
      onDecalResizeCenter(planeCurrentEditIndex);
    } }>Image Center Ratio</button>
    {
      console.log(planeCurrentEditIndex, modelNodes[planeCurrentEditIndex])
    } */}
  </div>
}