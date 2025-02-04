import React, { useRef, useEffect, useCallback } from 'react';
import { Stage, Layer, Image as KonvaImage, Text as KonvaText } from 'react-konva';
import { AppProvider, Button, TextField, Select, LegacyStack, DropZone } from '@shopify/polaris';
import WebFont from 'webfontloader';
import useImageDesignStore from '../../storage/ImageDesignStore';
import KonvaImageEdit from './KonvaComp/KonvaImageEdit';
import KonvaTextEdit from './KonvaComp/KonvaTextEdit';
import TabVertical from './TabVertical';
import {
  TextTitleIcon, ImageIcon
} from '@shopify/polaris-icons';

const ImageDesign = () => {
  const {
    elements,
    textValue,
    selectedElement,
    addElement,
    setTextValue,
    setSelectedElement,
    updateElement,
    removeElement
  } = useImageDesignStore();
  
  const stageRef = useRef(null);
  const canvasSize = { width: 742, height: 600 };
  const randKey_fn = () => {
    return ((+new Date).toString(36).slice(-5));
  }

  const fonts = [
    { label: 'Lato', value: 'Lato' },
    { label: 'Roboto', value: 'Roboto' },
    { label: 'Open Sans', value: 'Open Sans' },
    { label: 'Montserrat', value: 'Montserrat' },
    { label: 'Quicksand', value: 'Quicksand' },
    { label: 'Playwrite IN', value: 'Playwrite IN' },
  ];

  const loadFontInit = () => {
    WebFont.load({
      google: {
        families: fonts.map(f => f.value)
      },
      fontactive: (familyName, fvd) => {
        console.log(familyName)
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

  const renderElements = () => {
    return elements.map((element, index) => { console.log(element)
      if (element.type === 'text') {

        return <KonvaTextEdit 
          key={ index }
          objProps={ element } 
          isSelected={ (selectedElement == element.__key ? true : false) }
          onSelect={ onSelectLayer }
          onChange={ newAttrs => {
            updateElement(index, newAttrs)
          } }
          />
      } else if (element.type === 'image') { 

        return <KonvaImageEdit 
          key={ index }
          objProps={ element } 
          isSelected={ (selectedElement == element.__key ? true : false) }
          onSelect={ onSelectLayer }
          onChange={ newAttrs => {
            updateElement(index, newAttrs)
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
        fontFamily: "'Playwrite IN'",
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

  return (
    <AppProvider i18n={{}}>
      <div className="image-design-container">
        <div className="left-side-arena">
          
          <LegacyStack vertical spacing="loose">

            <TabVertical tabItems={
              [
                {
                  key: '__text__',
                  heading: 'Text',
                  icon: <TextTitleIcon />,
                  content: <>
                    <LegacyStack vertical spacing="tight">
                      <TextField
                        value={textValue}
                        onChange={(value) => setTextValue(value)}
                        placeholder="Enter text"
                        multiline={4}
                      />
                      <Button 
                        primary
                        onClick={handleAddText}
                      >
                        Add Text
                      </Button>
                    </LegacyStack>

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
            } active={ '__text__' } />

            <LegacyStack vertical spacing="tight">
              <Button 
                destructive
                onClick={handleRemoveElement}
                disabled={!selectedElement}
              >
                Remove Selected
              </Button>
            </LegacyStack>
          </LegacyStack>
        </div>

        <div className="right-side-arena">
          <Stage 
            width={canvasSize.width} 
            height={canvasSize.height} 
            ref={stageRef} 
            onClick={ onSelectLayer }>
            <Layer>
              {renderElements()}
            </Layer>
          </Stage>
        </div>
      </div>
    </AppProvider>
  );
};

export default ImageDesign;