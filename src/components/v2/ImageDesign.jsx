import React, { useRef, useEffect, useCallback } from 'react';
import { fabric } from 'fabric';
import { AppProvider, Button, TextField, Select, LegacyStack, DropZone } from '@shopify/polaris';
import WebFont from 'webfontloader';
import useImageDesignStore from '../../storage/ImageDesignStore';

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
  
  const canvasRef = useRef(null);
  const canvasInstance = useRef(null);
  const canvasSize = { width: 788, height: 600 };

  const fonts = [
    { label: 'Lato', value: 'Lato' },
    { label: 'Roboto', value: 'Roboto' },
    { label: 'Open Sans', value: 'Open Sans' },
    { label: 'Montserrat', value: 'Montserrat' },
    { label: 'Quicksand', value: 'Quicksand' },
    { label: 'Playwrite IN', value: 'Playwrite IN' },
  ];

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
              type: 'image',
              image: img,
              x: (canvasWidth - img.width * scale) / 2,
              y: (canvasHeight - img.height * scale) / 2,
              scaleX: scale,
              scaleY: scale,
              angle: 0
            };
            
            addElement(newImage);
            
            const fabricImg = new fabric.Image(newImage.image, {
              left: newImage.x,
              top: newImage.y,
              scaleX: newImage.scaleX,
              scaleY: newImage.scaleY,
              angle: newImage.angle
            });
            canvasInstance.current.add(fabricImg);
            canvasInstance.current.renderAll();
          };
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  useEffect(() => {
    if (canvasRef.current) {
      canvasInstance.current = new fabric.Canvas(canvasRef.current, {
        width: canvasSize.width,
        height: canvasSize.height,
        backgroundColor: '#fafafa'
      });

      const onSelectObject = (e) => {
        const selected = e.selected[0];
        selected.index = canvasInstance.current.getObjects().indexOf(selected)
        setSelectedElement(selected);
      }

      canvasInstance.current.on({
        'selection:created': onSelectObject,
        'selection:updated': onSelectObject,
      });

      canvasInstance.current.on('selection:cleared', () => {
        setSelectedElement(null);
      });

      canvasInstance.current.on('object:modified', (e) => {
        const modifiedObject = e.target;
        const index = canvasInstance.current.getObjects().indexOf(modifiedObject);
        
        updateElement(index, {
          x: modifiedObject.left,
          y: modifiedObject.top,
          scaleX: modifiedObject.scaleX,
          scaleY: modifiedObject.scaleY,
          angle: modifiedObject.angle,
          ...(modifiedObject.type === 'text' && {
            width: modifiedObject.width * modifiedObject.scaleX,
            height: modifiedObject.height * modifiedObject.scaleY
          })
        });
      });

      elements.forEach((element, index) => {
        if (element.type === 'text') {
          const text = new fabric.Text(element.text, {
            left: element.x,
            top: element.y,
            fontSize: element.fontSize,
            fill: element.fill,
            fontFamily: element.fontFamily || 'Lato',
            scaleX: element.scaleX || 1,
            scaleY: element.scaleY || 1,
            angle: element.angle || 0
          });
          canvasInstance.current.add(text);
        } else if (element.type === 'image') {
          const img = new fabric.Image(element.image, {
            left: element.x,
            top: element.y,
            scaleX: element.scaleX || 1,
            scaleY: element.scaleY || 1,
            angle: element.angle || 0
          });
          canvasInstance.current.add(img);
        }
      });

      return () => {
        canvasInstance.current.dispose();
      };
    }
  }, [elements]);

  const handleAddText = () => {
    if (textValue.trim()) {
      const newText = {
        type: 'text',
        text: textValue,
        x: 100,
        y: 100,
        fontSize: 20,
        fill: '#000000',
        fontFamily: 'Lato',
        scaleX: 1,
        scaleY: 1,
        angle: 0
      };
      
      addElement(newText);
      
      const text = new fabric.Text(newText.text, newText);
      canvasInstance.current.add(text);
      
      setTextValue('');
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
            <h3>Design Controls</h3>
            
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
          <canvas ref={canvasRef} width={ canvasSize.width } height={ canvasSize.height } />
        </div>
      </div>
    </AppProvider>
  );
};

export default ImageDesign;