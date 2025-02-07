import { Button, Popover, ColorPicker, LegacyCard } from '@shopify/polaris';
import { EyeDropperIcon } from '@shopify/polaris-icons';
import {useState, useCallback} from 'react';

export default function ColorField({ colorOpts }) {
  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  const activator = (
    <div>
      <span className="Polaris-Labelled__LabelWrapper">Color</span> 
      <Button onClick={togglePopoverActive} disclosure size="large" icon={ EyeDropperIcon }></Button>
    </div>
  );

  return <div className="color-field-container">
    <Popover
      active={popoverActive}
      activator={activator}
      autofocusTarget="first-node"
      onClose={togglePopoverActive}
    >
      <LegacyCard title="Select Color" sectioned>
        <ColorPicker { ...colorOpts } />
      </LegacyCard>
    </Popover>
  </div>
}