import { useAppContext } from "../context/AppContext";
import { useAppContextV2 } from "../context/AppContextV2";
import PlanesViewTool from "./PlanesViewTool";
import DesignPlaneItemTool from './DesignPlaneItemTool';
import PlaneSelectItemsEdit from "./v2/PlaneSelectItemsEdit";
import PlaneDesignItemV2 from "./v2/DesignPlaneItemV2"

export default function DesignTool() {
  const { casketModel, updateModel, planes, planeIDCurrentEdit } = useAppContext();
  const { casketPlanes, planeCurrentEditIndex, options } = useAppContextV2();
  return <div className="design-tool-comp">
    <div className="design-tool-comp__inner">
      <div className="tool-header">
        <h4 className="heading-text">Design your own casket</h4> 
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy</p>
        {/* { JSON.stringify(options) } */}
      </div>
      <div>
        {/* { JSON.stringify(casketPlanes) } */}
        <button className="button" onClick={ e => {
          e.preventDefault();
          console.log(casketPlanes)
          navigator.clipboard.writeText(JSON.stringify(casketPlanes))
        } }>Copy casketPlanes data</button>
        <hr />
        {
          planeCurrentEditIndex ? <PlaneDesignItemV2 /> : <PlaneSelectItemsEdit />
        }
      </div>
      {/* { (planeIDCurrentEdit ? <DesignPlaneItemTool /> : <PlanesViewTool />) } */}
    </div>
  </div>
} 