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

  return <>
    <Modal heading={ `Image Design` } active={ active } onClose={ () => {
      setActive(false);
    } }>
      <ImageDesign />
    </Modal>
  </>
}