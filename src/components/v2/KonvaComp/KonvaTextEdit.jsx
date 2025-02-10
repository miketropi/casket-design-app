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

  const onUpdateElem = () => {
    const node = objRef.current;
    onChange({
      ...objProps,
      ...node.attrs,
    })
  }

  return <>
    <KonvaText
      { ...objProps }
      ref={ objRef }
      onClick={ onSelect }
      draggable
      opacity={ isSelected ? .3 : .1 }
      onDragMove={ onUpdateElem }
      onTransform={ onUpdateElem }
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

export const KonvaTextAddInit = ({ fonts, onClick }) => {

  return <>
    <div className="custom-font-item-init-add-container">
    {
      fonts.length > 0 && fonts.map((font, __f_index) => {
        return <div className="custom-font-item-init-add" key={ __f_index } onClick={ e => onClick(font) }>
          <span className="custom-font-item-init-add__text" style={{ fontFamily: `'${ font?.value }'` }}>{ `Font: ${ font?.label }` }</span>
        </div>
      })
    }
    </div>
  </>
}

export const KonvaTextDesign = ({ fonts, onChange, editElem, onDelete }) => {

  const __onUpdateField = (value, name) => {
    onChange({
      [name]: value
    })
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