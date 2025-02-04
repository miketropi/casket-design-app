export default function TabVertical({ tabItems, active }) {
  return <>
    <div className="tab-vertical__container">
      <ul className="tab-vertical__heading">
        {
          tabItems.map(t => {
            const { heading, icon, key } = t;
            return <li className={ ['tab-vertical__heading-item', (active == key ? '__active' : '')].join(' ') } key={ `heading-${ key }` }>
              <span>
                { icon ? icon : '' }
                { heading ? heading : '' }
              </span>
            </li>
          })
        }
      </ul>
      <div className="tab-vertical__body">
        {
          tabItems.map(t => {
            const { heading, icon, key, content } = t;
            return <div className={ ['tab-vertical__body-item', (active == key ? '__active' : '')].join(' ') } key={ `content-${ key }` }>
              { content }
            </div>
          })
        }
      </div>
    </div>
  </>
}