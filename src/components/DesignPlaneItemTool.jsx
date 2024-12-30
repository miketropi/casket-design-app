import { useMemo, useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

export default function DesignPlaneItemTool() {
  const { planes, setPlaneIDCurrentEdit, planeIDCurrentEdit, modalSelectImage__ref, setPlaneItemDecalImage } = useAppContext();

  const editPlane = useMemo(() => (
    planes.find(p => p.id == planeIDCurrentEdit )
  ), [planeIDCurrentEdit, planes]);

  const onUpdatePlaneDecolImage = (url) => {
    setPlaneItemDecalImage(planeIDCurrentEdit, url);
  }

  return <>
    <a href="#" onClick={ e => {
      e.preventDefault();
      setPlaneIDCurrentEdit('')
    } }>Back</a>

    <hr />

    {/* <label>
      <span className="__label">Image URL</span>
      <input type="text" name="text-field" value={ editPlane?.decal_image } onChange={ e => {  } } />
    </label> */}

    <button onClick={ e => {
      e.preventDefault();
      if(!modalSelectImage__ref) return;

      modalSelectImage__ref.open((imageUrl) => {
        onUpdatePlaneDecolImage(imageUrl)
        modalSelectImage__ref.close()
      });

    } }>Select Image</button>

    <div>
      {
        editPlane?.decal_image
      }
      <hr />
      {
        JSON.stringify(editPlane.decalConfig) 
      }
    </div>
  </>
}