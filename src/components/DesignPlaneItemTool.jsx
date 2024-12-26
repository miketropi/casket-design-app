import { useMemo } from "react";
import { useAppContext } from "../context/AppContext";

export default function DesignPlaneItemTool() {
  const { planes, setPlaneIDCurrentEdit, planeIDCurrentEdit } = useAppContext();
  const editPlane = useMemo(() => (planes.find(p => p.id == planeIDCurrentEdit )), [planeIDCurrentEdit]);

  return <>
    <a href="#" onClick={ e => {
      e.preventDefault();
      setPlaneIDCurrentEdit('')
    } }>Back</a>

    <div>
      {
        editPlane?.decal_image
      }
    </div>
  </>
}