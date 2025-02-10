import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Text as KonvaText, Rect as KonvaRect } from 'react-konva';
import { AppProvider, Button, TextField, Select, LegacyStack, DropZone } from '@shopify/polaris';
import WebFont from 'webfontloader';
import useImageDesignStore from '../../storage/ImageDesignStore';
import KonvaImageEdit from './KonvaComp/KonvaImageEdit';
import KonvaTextEdit, { KonvaTextDesign, KonvaTextAddInit } from './KonvaComp/KonvaTextEdit';
import TabVertical from './TabVertical';
import Space from './Space';
import useImage from "use-image";
import KonvaItemNavTool from './KonvaComp/KonvaItemNavTool';
import {
  TextTitleIcon, ImageIcon, PlusIcon
} from '@shopify/polaris-icons';

const ImageDesign = () => {
  const {
    fonts,
    elements,
    textValue,
    selectedElement,
    addElement,
    setTextValue,
    setSelectedElement,
    updateElement,
    removeElement
  } = useImageDesignStore();
  const [bgLid] = useImage( "/casket-lid.png");
  const [tabActive, setTabActive] = useState('__text__')
  const stageRef = useRef(null);
  const canvasSize = { width: 755, height: 600 };
  const layerDesignRef = useRef();
  const layerDesignEditRef = useRef();
  const [imageDesignOverlap, setImageDesignOverlap] = useState('');

  useEffect(() => {
    const stage = layerDesignEditRef.current;
    if (stage) {
      stage.on('draw', () => {
        // console.log('Canvas re-drawn');
        const dataURL = layerDesignRef.current.toDataURL();
        setImageDesignOverlap(dataURL);
      });
    }

    return () => {
      stage?.off('draw');
    };
  }, [])

  const randKey_fn = () => {
    return ((+new Date).toString(36).slice(-5));
  }

  const loadFontInit = () => {
    WebFont.load({
      google: {
        families: fonts.map(f => f.value)
      },
      fontactive: (familyName, fvd) => {
        // console.log(familyName)
      }
    });
  }

  useEffect(() => {
    loadFontInit();
  }, [])

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new window.Image();
          img.src = event.target.result;
          img.onload = () => {
            const canvasWidth = canvasSize.width;
            const canvasHeight = canvasSize.height;
            const scale = Math.min(
              canvasWidth / img.width,
              canvasHeight / img.height
            );
            
            const newImage = {
              __key: randKey_fn(),
              type: 'image',
              image: img,
              x: (canvasWidth - img.width * scale) / 2,
              y: (canvasHeight - img.height * scale) / 2,
              scaleX: scale,
              scaleY: scale,
              angle: 0
            };
            
            addElement(newImage);
          };
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const onSelectLayer = (elem) => {
    // console.log(elem.target)
    let __k = elem.target.attrs?.__key;
    if(__k) {
      setSelectedElement(__k)
    } else {
      setSelectedElement(null)
    }
  }

  const onElementUpdate = (index, newAttrs) => {
    updateElement(index, newAttrs)
    // const dataURL = layerDesignRef.current.toDataURL();
    // setImageDesignOverlap(dataURL);
  }

  const renderElements = (control = true) => {

    if(control == false) {
      return elements.map((element, index) => { 
        // console.log(element)
        if (element.type === 'text') {
  
          return <KonvaText 
            key={ index }
            { ...element }
            opacity={ 1 }
            />
        } else if (element.type === 'image') { 
  
          return <KonvaImage
            key={ index }
            { ...element } 
            opacity={ 1 }
            />
        }
        return null;
      });
    }

    return elements.map((element, index) => { 
      // console.log(element)
      if (element.type === 'text') {

        return <KonvaTextEdit 
          key={ index }
          objProps={ element } 
          isSelected={ (selectedElement == element.__key ? true : false) }
          onSelect={ onSelectLayer }
          onChange={ newAttrs => {
            onElementUpdate(index, newAttrs)
            // updateElement(index, newAttrs)
          } }
          />
      } else if (element.type === 'image') { 

        return <KonvaImageEdit 
          key={ index }
          objProps={ element }
          isSelected={ (selectedElement == element.__key ? true : false) }
          onSelect={ onSelectLayer }
          onChange={ newAttrs => {
            onElementUpdate(index, newAttrs)
            // updateElement(index, newAttrs);
          } }
          />
      }
      return null;
    });
  };

  const handleAddText = () => {
    if (textValue.trim()) {
      const newText = {
        __key: randKey_fn(),
        type: 'text',
        text: textValue,
        x: 100,
        y: 100,
        fontSize: 20,
        fill: '#000000',
        align: 'center',
        fontFamily: "Playwrite IN",
        lineHeight: 1.5,
        scaleX: 1,
        scaleY: 1,
        angle: 0
      };
      
      addElement(newText);
    }
  };

  const handleRemoveElement = () => {
    if (selectedElement) {
      canvasInstance.current.remove(selectedElement);
      removeElement(selectedElement.index);
      setSelectedElement(null);
      canvasInstance.current.discardActiveObject().renderAll();
    }
  };

  const handleFontChange = (value) => {
    if (selectedElement && selectedElement.get('type') === 'text') {
      WebFont.load({
        google: {
          families: [value]
        },
        fontactive: (familyName, fvd) => {
          selectedElement.set('fontFamily', familyName);
          canvasInstance.current.renderAll();

          updateElement(selectedElement.index, {
            fontFamily: familyName
          });
        }
      });
    }
  };

  const onAddTextInit = (font) => {
    const newText = {
      __key: randKey_fn(),
      type: 'text',
      text: `Click here to edit 
your custom text`,
      x: canvasSize.width / 2,
      y: canvasSize.height / 2,
      fontSize: 18,
      fill: '#000000',
      align: 'center',
      fontFamily: font?.value,
      lineHeight: 1.5,
      scaleX: 1,
      scaleY: 1,
      angle: 0
    };
    
    addElement(newText);
  }

  return (
    <AppProvider i18n={{}}>
      <div className="image-design-container">
        <div className="left-side-arena">
          
          <LegacyStack vertical spacing="loose">

            <TabVertical 
              active={ tabActive }
              onChange={ e => {
                setTabActive(e.key)
              } }
              tabItems={
                [
                  {
                    key: '__text__',
                    heading: 'Text',
                    icon: <TextTitleIcon />,
                    content: <>

                      {
                        // selectedElement == null &&
                        // <KonvaTextAddInit fonts={ fonts } onClick={ font => { onAddTextInit(font) } } />
                      }

                      {
                        (() => {
                          if(selectedElement == null) {
                            return <KonvaTextAddInit fonts={ fonts } onClick={ font => { onAddTextInit(font) } } />
                          } else {
                            let __index = elements.findIndex(__e => __e.__key == selectedElement)
                            let editElem = elements[__index]
                            if(editElem?.type != 'text') return <KonvaTextAddInit fonts={ fonts } onClick={ font => { onAddTextInit(font) } } />;
                          }
                        })()
                      }

                      {
                        (() => {
                          if(!selectedElement) return;
                          let __index = elements.findIndex(__e => __e.__key == selectedElement)
                          let editElem = elements[__index]
                          if(editElem?.type != 'text') return;

                          return <KonvaTextDesign 
                            fonts={ fonts }
                            editElem={ editElem } 
                            onChange={ (field) => {
                              updateElement(__index, field)
                            } } 
                            onDelete={ e => {
                              removeElement(__index)
                            } }  
                          />
                        })()
                      }

                      {selectedElement?.type === 'text' && (
                        <LegacyStack vertical spacing="tight">
                          <Select
                            label="Font"
                            options={fonts}
                            value={selectedElement.fontFamily || 'Lato'}
                            onChange={handleFontChange}
                          />
                        </LegacyStack>
                      )}
                    </>
                  },
                  {
                    key: '__image__',
                    heading: 'Image',
                    icon: <ImageIcon />,
                    content: <>
                      <LegacyStack vertical spacing="tight">
                        <DropZone
                          label="Upload Image"
                          accept="image/*"
                          onDrop={handleDropZoneDrop}
                          allowMultiple={false}
                        >
                          <DropZone.FileUpload actionTitle="Select Image" actionHint="Accepts .jpg, .webp, and .png" />
                        </DropZone>
                      </LegacyStack>
                    </>
                  },
                ]
              } />
          </LegacyStack>
        </div>

        <div className="right-side-arena">
          {
            (() => {
              if(selectedElement == null) return;
              return <KonvaItemNavTool 
                editElement={ elements.find(__e => __e.__key == selectedElement) }
                onDelete={ e => {
                  removeElement(elements.findIndex(__e => __e.__key == selectedElement))
                } } />
            })()
          }
          
          <Stage 
            width={canvasSize.width} 
            height={canvasSize.height} 
            style={{ backgroundColor: '#f4f4f4', borderRadius: '4px', border: `solid 1px #e6e6e6` }}
            ref={stageRef} 
            onClick={ onSelectLayer }>
            
            <Layer ref={ layerDesignRef } opacity={ 1 } >
              { renderElements(false) }  
            </Layer>

            <Layer>
              <KonvaRect
                x={0}  
                y={0}  
                width={canvasSize.width}  
                height={canvasSize.height} 
                fill="#f4f4f4"  
                />
            </Layer>

            <Layer>
              <ImageMerge 
                backgroundImage={ bgLid } 
                overlapImage={ imageDesignOverlap } />
            </Layer>
            
            <Layer ref={ layerDesignEditRef } opacity={ 1 }>
              { renderElements() } 
            </Layer>

            
          </Stage>
        </div>
      </div>
    </AppProvider>
  );
};

const ImageMerge = ({ backgroundImage, overlapImage }) => {
  const overlayRef = useRef()
  const maskCanvas = useRef(document.createElement("canvas"))
  
  useEffect(() => {
    // console.log(backgroundImage)
    if (backgroundImage) {
      const canvas = maskCanvas.current;
      const ctx = canvas.getContext("2d");
      const { width, height } = backgroundImage;
      canvas.width = width;
      canvas.height = height;

      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(backgroundImage, 0, 0, width, height);

      if(overlapImage) {
        const img = new Image();
        img.onload = function() {
          ctx.globalCompositeOperation = "source-in";
          ctx.drawImage(img, 0, 0, width, height);  

          const overlayNode = overlayRef.current;
          overlayNode.getLayer().batchDraw();
        }; 
        img.src = overlapImage; 
      } else {
        const overlayNode = overlayRef.current;
        overlayNode.getLayer().batchDraw();
      }
    }
  }, [backgroundImage, overlapImage]);

  return <>
    <KonvaImage image={backgroundImage} />
    <KonvaImage ref={overlayRef} image={maskCanvas.current} /> 
  </>
}

export default ImageDesign;