import { useAppContext } from "../context/AppContext";
import { useAppContextV2 } from "../context/AppContextV2";
import { useCallback, useState, useEffect, useRef } from "react";
import loadingImage from '../assets/tube-spinner.svg';
import Modal from "./Modal";
import Tab from "./v2/Tab";
import ImageDesign from "./v2/ImageDesign";
import { label } from "three/tsl";

const __LIST_IMAGES = [
  {
    __id: 1,
    url: '/photo-1732792707435-0931e10251ca.jpeg',
  },
]

export default function ModalSelectImage() {
  const [uploadPhotos, setUploadPhotos] = useState([]);
  const { setModalSelectImage__ref } = useAppContext();
  const { options } = useAppContextV2();
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

  const onFileChange = (e) => {
    console.log(e.target.files);

    const files = e.target.files;
    [...files].map(f => {
      const reader = new FileReader();
      reader.onload = function(){
        let dataURL = reader.result;
        let __id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);

        let data = new FormData();
        data.append('file', f);
        
        fetch(`${ import.meta.env.VITE_API_ENDPOINT }/wp-json/custom/v1/casket-upload-image`, {
          method: 'POST',
          body: data
        }).then(async res => {
          let jsonData = await res.json();
          // console.log(jsonData);
          setUploadPhotos(__ => {
            let __uploadPhotos = [...__];
            let __i = __uploadPhotos.findIndex(p => p.__id == __id);
            __uploadPhotos[__i].url = jsonData.url;
            __uploadPhotos[__i].loading = false;

            return __uploadPhotos;
          })
        })

        // console.log(dataURL);
        // window.open(dataURL);
        setUploadPhotos(preState => {
          return [...preState, {
            __id,
            url: dataURL,
            loading: true,
          }]
        })
        // setUploadPhotos([...uploadPhotos, {
        //   __id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10),
        //   url: dataURL,
        //   loading: true,
        // }])
      };
      reader.readAsDataURL(f);
    })
  }

  const tabItems = [
    {
      label: 'Photos',
      content: <>
        <div className="image-container">
          {
            options?.media_picker_default && 
            options.media_picker_default.map(item => {
              let { ID, url } = item;
              return <div key={ ID } className={ ['image-item'].join(' ') }>
                <div onClick={ e => {
                  e.preventDefault();
                  if(onSelectedCallback__ref?.current) {
                    let __url = `${ import.meta.env.VITE_API_ENDPOINT }/?image_source=${ url }`
                    onSelectedCallback__ref.current(`${ __url }`);
                  }
                } } className="__thumb" style={ { background: `url(${ url }) no-repeat center center / cover, #333` } }></div>
              </div>
            })
          }
          {/* {
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
          } */}
        </div>
      </>
    },
    {
      label: 'Upload Your Photos',
      content: <>
        <div className="image-container">
          <div key={ `__upload-your-image` } className="image-item __upload-your-image">
            <div className="__thumb">
              <span className="upload-text">Click to upload your photos</span>
              <input type="file" className="field-upload" multiple onChange={ onFileChange } />
            </div>
          </div>
          {
            uploadPhotos.map(({ __id, url, loading }) => {
              return <div key={ __id } className={ ['image-item', (loading ? '__loading' : '')].join(' ') }>
                <div onClick={ e => {
                  e.preventDefault();
                  if(onSelectedCallback__ref?.current) {
                    let __url = `${ import.meta.env.VITE_API_ENDPOINT }/?image_source=${ url }`
                    onSelectedCallback__ref.current(__url);
                  }
                } } className="__thumb" style={ { background: `url(${ url }) no-repeat center center / cover, #333` } }></div>
                {
                  loading && <img src={ loadingImage } alt="loading" className="img-loading" />
                }
              </div>
            })
          }
        </div>
      </>
    },
    {
      label: 'Design Image',
      content: <>
        <ImageDesign />
      </>
    }
  ]

  return <Modal heading={ `Select Image` } active={ active } onClose={ () => {
    setActive(false);
  } }>
    <Tab tabItems={ tabItems } active={ 0 } />
  </Modal>
}