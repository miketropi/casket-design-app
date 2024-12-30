import { useAppContext } from "../context/AppContext";
import { useCallback, useState, useEffect, useRef } from "react";
import Modal from "./Modal";

const __LIST_IMAGES = [
  {
    __id: 1,
    url: '/photo-1732792707435-0931e10251ca.jpeg',
  },
  {
    __id: 2,
    url: 'https://plus.unsplash.com/premium_photo-1733514692327-967cdc0dc987?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    __id: 3,
    url: 'https://images.unsplash.com/photo-1732951340728-d8b726561d50?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    __id: 4,
    url: 'https://images.unsplash.com/photo-1731778567863-dc155187d04d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    __id: 5,
    url: '/photo-1734532873375-574fd74045c5.avif',
  },
  {
    __id: 6,
    url: 'https://images.unsplash.com/photo-1496989981497-27d69cdad83e?q=80&w=2131&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
]

export default function ModalSelectImage() {
  const { setModalSelectImage__ref } = useAppContext();
  const [ active, setActive ] = useState(false);
  const selectImageRef = useRef(null);
  const onSelectedCallback__ref = useRef(null);

  useEffect(() => { 
    selectImageRef.current = {
      open: (cb) => { 
        setActive(true);
        onSelectedCallback__ref.current = cb
        // setOnSelectedCallback(cb);
        // if(selectImageRef.current.onSelected__callback) {
        //   selectImageRef.current.onSelected__callback.push(cb);
        // } else {
        //   selectImageRef.current.onSelected__callback = [cb];
        // }
        
      },
      close: () => { setActive(false) }, 
    }

    setModalSelectImage__ref(selectImageRef.current);
  }, [])

  return <Modal heading={ `Select Image` } active={ active } onClose={ () => {
    setActive(false);
  } }>
    <div className="image-container">
      {
        __LIST_IMAGES.map(({ __id, url }) => {
          return <div key={ __id } className="image-item">
            <div onClick={ e => {
              e.preventDefault();
              if(onSelectedCallback__ref?.current) {
                onSelectedCallback__ref.current(url);
              }
            } } className="__thumb" style={ { background: `url(${ url }) no-repeat center center / cover, #333` } }></div>
          </div>
        })
      }
    </div>
  </Modal>
}