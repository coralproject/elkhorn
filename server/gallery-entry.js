import preact from 'preact'
const {h} = preact
import GalleryComposer from '../src/components/GalleryComposer'

import '../src/style/gallery.css'

const target = document.querySelector(renderTarget)

while (target.lastChild) {
  target.removeChild(target.lastChild)
}

preact.render((
  <div>
    <GalleryComposer {...props} />
  </div>
), target || document.querySelector('#ask-gallery'))
