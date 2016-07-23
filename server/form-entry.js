import preact from 'preact'
const {h} = preact
import AskComposer from '../src/components/AskComposer'

import '../src/style/index.css'

const target = document.querySelector(renderTarget)

preact.render((
  <div>
    <AskComposer {...props} />
  </div>
), target || document.querySelector('#ask-form'))
