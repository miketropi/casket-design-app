import { useEffect, useRef } from 'react';
import { Transformer, Image as KonvaImage } from 'react-konva';

export default function KonvaImageEdit({ objProps, isSelected, onSelect, onChange }) {
  const objRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([objRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const onUpdateElem = () => {
    const node = objRef.current;
    onChange({
      ...objProps,
      ...node.attrs,
    })
  }

  return <>
    <KonvaImage
      { ...objProps }
      opacity={ isSelected ? .3 : .1 }
      ref={ objRef }
      draggable
      onClick={ onSelect }
      onDragMove={ onUpdateElem }
      onTransform={ onUpdateElem }
    />
    {isSelected && (
      <Transformer
        ref={ trRef }
        flipEnabled={false}
        boundBoxFunc={(oldBox, newBox) => {
          // limit resize
          if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
            return oldBox;
          }
          return newBox;
        }}
      />
    )}
  </>
}