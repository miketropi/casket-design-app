import { useMemo, useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import DecalEditTransform from './DecalEditTransform'

export default function DesignPlaneItemTool() {
  const { planes, setPlaneIDCurrentEdit, planeIDCurrentEdit, modalSelectImage__ref, setPlaneItemDecalImage, setPlaneItemScl, onFittedCenterDecal } = useAppContext();

  const editPlane = useMemo(() => (
    planes.find(p => p.id == planeIDCurrentEdit )
  ), [planeIDCurrentEdit, planes]);

  const getMetaImage = function(url, cb) {
    const img = new Image;
    img.src = url;
    img.onload = function(){ 
      cb( {width: this.width, height: this.height} )
    };
  }

  const onUpdatePlaneDecolImage = (url) => {
    getMetaImage(url, ({ width, height }) => {
      let ratio =  width / height;
      let minHeigh = editPlane.minHeight;
      let [x, y, z] = editPlane.decalConfig.scl;
      let scaleX = minHeigh * ratio;
      let scaleY = minHeigh;

      setPlaneItemScl(planeIDCurrentEdit, [scaleX, scaleY, z])
      setPlaneItemDecalImage(planeIDCurrentEdit, url); 
    })
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
      {/* {
        editPlane?.decal_image
      }
      <hr />
      {
        JSON.stringify(editPlane.decalConfig) 
      } */}

      <DecalEditTransform edit={ editPlane } />
      <button onClick={ e => onFittedCenterDecal(editPlane) }>Fitted Decal Center</button>
    </div>
  </>
}