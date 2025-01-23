import React, { useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import { Button, Input, Select, MenuItem } from '@mui/material';
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

  // Available fonts
  const fonts = [
    { name: 'Lato', value: 'Lato' },
    { name: 'Roboto', value: 'Roboto' },
    { name: 'Open Sans', value: 'Open Sans' },
    { name: 'Montserrat', value: 'Montserrat' },
    { name: 'Quicksand', value: 'Quicksand' },
    { name: 'Playwrite IN', value: 'Playwrite IN' },
  ];

  // Load Google Fonts
  // useEffect(() => {
  //   const link = document.createElement('link');
  //   link.href = 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Roboto:wght@400;700&family=Open+Sans:wght@400;700&family=Montserrat:wght@400;700&display=swap';
  //   link.rel = 'stylesheet';
  //   document.head.appendChild(link);
  // }, []);

  useEffect(() => {
    if (canvasRef.current) {
      canvasInstance.current = new fabric.Canvas(canvasRef.current, {
        width: 600,
        height: 600
      });

      const onSelectObject = (e) => {
        const selected = e.selected[0];
        selected.index = canvasInstance.current.getObjects().indexOf(selected)
        setSelectedElement(selected);
      }

      // Add event listeners
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

      // Add existing elements to canvas
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

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvasWidth = 600;
          const canvasHeight = 600;
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
  };

  const handleRemoveElement = () => {
    if (selectedElement) {
      // Remove from canvas
      canvasInstance.current.remove(selectedElement);
      removeElement(selectedElement.index);
      setSelectedElement(null);
      canvasInstance.current.discardActiveObject().renderAll();
    }
  };

  const handleFontChange = (event) => {
    if (selectedElement && selectedElement.get('type') === 'text') {
      // Update canvas element
      WebFont.load({
        google: {
          families: [event.target.value]
        },
        fontactive: (familyName, fvd) => {
          console.log(familyName)
          selectedElement.set('fontFamily', familyName);
          canvasInstance.current.renderAll();

          // Update state
          updateElement(selectedElement.index, {
            fontFamily: familyName
          });
        }
      });
    }
  };

  return (
    <div className="image-design-container">
      {/* Left Panel - Controls */}
      <div style={{ borderRight: '1px solid #ccc' }}>
        <h3>Design Controls</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <Input
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            placeholder="Enter text"
            fullWidth
          />
          <Button 
            variant="contained" 
            onClick={handleAddText}
            style={{ marginTop: '10px' }}
            fullWidth
          >
            Add Text
          </Button>
        </div>

        {selectedElement?.type === 'text' && (
          <div style={{ marginBottom: '20px' }}>
            <Select
              value={selectedElement.fontFamily || 'Lato'}
              onChange={handleFontChange}
              fullWidth
            >
              {fonts.map((font) => (
                <MenuItem key={font.value} value={font.value}>
                  {font.name}
                </MenuItem>
              ))}
            </Select>
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleAddImage}
            style={{ display: 'none' }}
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <Button 
              variant="contained" 
              component="span"
              fullWidth
            >
              Add Image
            </Button>
          </label>
        </div>

        <div>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleRemoveElement}
            disabled={!selectedElement}
            fullWidth
          >
            Remove Selected
          </Button>
        </div>
      </div>

      {/* Right Panel - Canvas */}
      <div>
        <canvas ref={canvasRef} width={600} height={600} />
      </div>
    </div>
  );
};

export default ImageDesign;