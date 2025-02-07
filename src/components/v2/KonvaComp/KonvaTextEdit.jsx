import { useRef, useEffect } from "react"
import { Transformer, Text as KonvaText } from 'react-konva';
import { useAppContextV2 } from "../../../context/AppContextV2";
import { Select, Grid, LegacyCard, ColorPicker, hsbToHex, hexToRgb, rgbToHsb, TextField, ButtonGroup, Button, Divider } from '@shopify/polaris';
import ColorField from "../../ColorField";
import Space from "../Space";
import {
  TextAlignLeftIcon, TextAlignCenterIcon, TextAlignRightIcon,
  TextBoldIcon, TextItalicIcon, TextUnderlineIcon,
  DeleteIcon
} from '@shopify/polaris-icons';

export default function KonvaTextEdit({ objProps, isSelected, onSelect, onChange }) {
  const objRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([objRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  function roundDown(num, decimalPlaces) {
    const factor = Math.pow(10, decimalPlaces);
    return Math.floor(num * factor) / factor;
  }

  return <>
    <KonvaText
      { ...objProps }
      fontFamily={ `'${ objProps?.fontFamily }'` }
      ref={ objRef }
      onClick={ onSelect }
      draggable
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
        const absScale = node.getAbsoluteScale(); 

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
          fontSize: roundDown(node.fontSize() * scaleX, 1),
        });
      }}
    />
    {isSelected && (
      <Transformer
        ref={ trRef }
        flipEnabled={false}
        // resizeEnabled={false}
        enabledAnchors={
          [
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right',
          ]
        }
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

export const KonvaTextDesign = ({ fonts, onChange, editElem, onDelete }) => {

  const __onUpdateField = (value, name) => {
    onChange({
      [name]: value
    })
    // onChange({
    //   ...editElem,
    //   [name]: value
    // })
  }

  return <>
    {/* { JSON.stringify(editElem) } */}
    <LegacyCard sectioned>
      <Grid>
        <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 6, lg: 12, xl: 12}}>
          <TextField
            label="Your Text"
            value={ editElem?.text }
            onChange={ value => {
              __onUpdateField(value, 'text')
            }}
            multiline={4}
            autoComplete="off"
          />
        </Grid.Cell>
        <Grid.Cell columnSpan={{xs: 4, sm: 4, md: 4, lg: 7, xl: 7}}>
          <Select
            label={ `Font Family` }
            options={fonts}
            onChange={ value => {
              __onUpdateField(value, 'fontFamily')
            } }
            value={ editElem?.fontFamily }
          />
        </Grid.Cell>
        <Grid.Cell columnSpan={{xs: 2, sm: 2, md: 2, lg: 5, xl: 5}}>
          {/* <ColorPicker onChange={ e => {} } color={ `#000` } /> */}
          <ColorField colorOpts={{
            onChange: value => {
              console.log(value)
              __onUpdateField(hsbToHex(value), 'fill')
            }, 
            color: rgbToHsb(hexToRgb(editElem?.fill))
          }}/>
        </Grid.Cell>
        
        <Grid.Cell columnSpan={{xs: 3, sm: 3, md: 3, lg: 6, xl: 6}}>
          <span className="Polaris-Labelled__LabelWrapper">Text Align</span> 
          <ButtonGroup variant="segmented">
            <Button icon={ TextAlignLeftIcon }></Button>
            <Button icon={ TextAlignCenterIcon }></Button>
            <Button icon={ TextAlignRightIcon }></Button>
          </ButtonGroup>
        </Grid.Cell>

        <Grid.Cell columnSpan={{xs: 3, sm: 3, md: 3, lg: 6, xl: 6}}>
          <span className="Polaris-Labelled__LabelWrapper">Font Style</span> 
          <ButtonGroup variant="segmented">
            <Button icon={ TextBoldIcon }></Button>
            <Button icon={ TextItalicIcon }></Button>
            <Button icon={ TextUnderlineIcon }></Button>
          </ButtonGroup>
        </Grid.Cell>
      </Grid>
      <Space space={20} />
      <Divider />
      <Space space={20} />
      <Button icon={ DeleteIcon } variant="primary" tone="critical" fullWidth onClick={ onDelete }>Delete</Button>
    </LegacyCard>
  </>
}