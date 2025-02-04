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

  return <>
    <KonvaImage
      { ...objProps }
      ref={ objRef }
      draggable
      onClick={ onSelect }
      onDragEnd={(e) => {
        onChange({
          ...objProps,
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
      onTransformEnd={(e) => {
        // transformer is changing scale of the node
        // and NOT its width or height
        // but in the store we have only width and height
        // to match the data better we will reset scale on transform end
        const node = objRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        // we will reset it back
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          ...objProps,
          x: node.x(),
          y: node.y(),
          // set minimal value
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(node.height() * scaleY),
        });
      }}
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