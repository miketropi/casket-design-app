import { useAppContext } from "../context/AppContext";
import PlanesViewTool from "./PlanesViewTool";
import DesignPlaneItemTool from './DesignPlaneItemTool';

export default function DesignTool() {
  const { casketModel, updateModel, planes, planeIDCurrentEdit } = useAppContext();
  return <div className="design-tool-comp">
    <div className="tool-header">
      <h4 className="heading-text">Design your own casket</h4> 
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy</p>
    </div>
    { (planeIDCurrentEdit ? <DesignPlaneItemTool /> : <PlanesViewTool />) }
  </div>
} 