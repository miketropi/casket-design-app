import { useState, useEffect } from "react";

export default function Tab({ tabItems, active }) {
  const [__active, set__Active] = useState(active);

  useEffect(() => {
    set__Active(active)
  }, [active])


  return <div className="tab-component-container">
    <div className="tab-head">
      <ul>
        {
          tabItems.map((i, __index) => {
            const { label } = i;
            return <li 
              key={ __index } 
              className={ ['tab-head-item', (__active == __index ? '__active' : '')].join(' ') }
              onClick={ e => { e.preventDefault(); set__Active(__index) } }> 
              <span>{ label }</span> 
            </li>
          })
        }
      </ul>
    </div>
    <div className="tab-body">
      {
        tabItems.map((i, __index) => {
          const { content } = i;
          return <div className={ ['tab-body-item', (__active == __index ? '__active' : '')].join(' ') }>
            { content }
          </div>
        })
      }
    </div>
  </div>
}