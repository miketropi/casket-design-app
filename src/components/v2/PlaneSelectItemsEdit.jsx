import { useAppContext } from "../../context/AppContext"; 
import { useAppContextV2 } from "../../context/AppContextV2";

export default function PlaneSelectItemsEdit () {
  const { setCameraCurrentView } = useAppContext();
  const { casketPlanes, setPlaneCurrentEditIndex } = useAppContextV2();

  const __BoxItemsTemplate = (
    casketPlanes.map((item, __index) => {
      const { name, planeIndex } = item
      return <div 
        key={ planeIndex } 
        className="plane-select-item-edit" 
        onClick={ e => { 
          e.preventDefault();
          setPlaneCurrentEditIndex(planeIndex);
        } }
        onMouseEnter={ e => {
          e.preventDefault();
          setCameraCurrentView(item?.cameraView);
        } }>
        { name }
      </div>
    })
  )

  return <div className="plane-select-items">
    {
      casketPlanes.length > 0 && __BoxItemsTemplate
    }
  </div>
}