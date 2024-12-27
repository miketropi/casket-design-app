import { useMemo } from "react";
import { useAppContext } from "../context/AppContext";

export default function PlanesViewTool() {
  const { casketModel, updateModel, planes, setCameraCurrentView, setPlaneIDCurrentEdit } = useAppContext();
  const __planes = useMemo(() => {
    //__backend__
    return planes.filter(p => p.id != '__backend__')
  }, [planes]);

  return <div className="planes-view-tools">
    {
      __planes.length > 0 && __planes.map(p => {
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