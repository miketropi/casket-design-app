import { useAppContext } from "../context/AppContext";

export default function DesignTool() {
  const { casketModel, updateModel, planes } = useAppContext();
  return <div className="design-tool-comp">
    Hello...! 
  </div>
} 