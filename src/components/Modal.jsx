import { Text } from '@shopify/polaris';

export default function Modal({ heading, active, onClose, children }) {
  return <div className={ ['modal-wrap', (active ? '__is-active' : '')].join(' ') }>
    <div className="modal-background-overlay"></div>
    <div className="modal-container">
      <div className="modal--inner">
        <div className="modal--heading">
          <Text variant="headingMd" as="h4">{ heading }</Text>
          <a className="__close" href="#" onClick={ e => {
            e.preventDefault();
            onClose();
          } }>Close</a>
        </div>
        <div className="modal--body">
          { children }
        </div>
      </div>
    </div>
  </div>
}