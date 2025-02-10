import { useState, useEffect, useRef } from "react"
import { useAppContextV2 } from "../../context/AppContextV2"; 
import Modal from "../Modal";
import ImageDesign from "./ImageDesign";

export default function ModalImageDesign() {
  const [ active, setActive ] = useState(false);
  const { setModalImageEdit__ref } = useAppContextV2();
  const modalRef = useRef(null);

  useEffect(() => {
    modalRef.current = {
      open: () => setActive(true),
      close: () => setActive(true),
    }

    setModalImageEdit__ref(modalRef.current)
  }, [])

  const buttonApplyImage = <button className="button" onClick={ e => {
    console.log('apply image')
    setActive(false);
  } }>Apply</button>

  return <>
    <Modal  
      heading={ `Image Design` } 
      active={ active } 
      actions={ [ buttonApplyImage ] } 
      onClose={ () => { setActive(false); } }>
      <ImageDesign />
    </Modal>
  </>
}