import preact from 'preact';
const {h} = preact;
import AskComposer from '../src/components/AskComposer';

import '../src/style/index.css';

preact.render((
  <div>
    <AskComposer {...props} />
  </div>
), document.body);
