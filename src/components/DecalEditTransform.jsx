import { useAppContext } from "../context/AppContext"

export default function DecalEditTransform({ edit }) {

  return <>
    <fieldset>
        <legend>Position(xyz)</legend>
        <input type="number" value={ edit?.decalConfig?.pos[0] } onChange={ e => {} } />
        <input type="number" value={ edit?.decalConfig?.pos[1] } onChange={ e => {} } />
        <input type="number" value={ edit?.decalConfig?.pos[2] } onChange={ e => {} } />
      </fieldset>

      <fieldset>
        <legend>Rotate(xyz)</legend>
        <input type="number" value={ edit?.decalConfig?.rot[0] } onChange={ e => {} } />
        <input type="number" value={ edit?.decalConfig?.rot[1] } onChange={ e => {} } />
        <input type="number" value={ edit?.decalConfig?.rot[2] } onChange={ e => {} } />
      </fieldset>

      <fieldset>
        <legend>Scale(xyz)</legend>
        <input type="number" value={ edit?.decalConfig?.scl[0] } onChange={ e => {} } />
        <input type="number" value={ edit?.decalConfig?.scl[1] } onChange={ e => {} } />
        <input type="number" value={ edit?.decalConfig?.scl[2] } onChange={ e => {} } />
      </fieldset>
  </>
}