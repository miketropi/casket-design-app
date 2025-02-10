import {Button} from '@shopify/polaris';
import { DeleteIcon } from '@shopify/polaris-icons';

export default function KonvaItemNavTool({ editElement, onDelete }) {
  return (
  <div className="konva-item-nav-tool"> 
    <div className="elem-infomation">
      x: { editElement?.x?.toFixed(0) } |
      y: { editElement?.y?.toFixed(0) } |
      rotate: { editElement?.rotation?.toFixed(0) }
    </div>
    <Button icon={ DeleteIcon } onClick={ onDelete } variant="primary" tone="critical" size="small"></Button>
  </div>
  )
}