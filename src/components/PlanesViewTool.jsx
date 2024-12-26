import { useAppContext } from "../context/AppContext";

export default function PlanesViewTool() {
  const { casketModel, updateModel, planes, setCameraCurrentView, setPlaneIDCurrentEdit } = useAppContext();
  return <div className="planes-view-tools">
    {
      planes.length > 0 && planes.map(p => {
        const { id, name, view } = p;
        return <div 
          className="plane-view-item" 
          key={ id } 
          onClick={ e => {
            e.preventDefault();
            setPlaneIDCurrentEdit(id);
          } }
          onMouseEnter={ e => {
            e.preventDefault();
            setCameraCurrentView(view);
          } }>
          <span>{ name }</span>
        </div>
      })
    }
  </div>
}