import { h, render } from 'preact';
import './style/index.css';

var SampleFormProps = require('./components/sample-form.json');

let root;
function init() {
	let AskComposer = require('./components/AskComposer').default;
	root = render(<AskComposer {...SampleFormProps} />, document.body, root);
}

init();

if (module.hot) {

	console.log("Module . hot");

	module.hot.accept('webpack/hot/dev-server', () => requestAnimationFrame( () => {
		flushLogs();
		init();
	}) );

	// optional: mute HMR/WDS logs
	let log = console.log,
		logs = [];
	console.log = (t, ...args) => {
		if (typeof t==='string' && t.match(/^\[(HMR|WDS)\]/)) {
			if (t.match(/(up to date|err)/i)) logs.push(t.replace(/^.*?\]\s*/m,''), ...args);
		}
		else {
			log.call(console, t, ...args);
		}
	};
	let flushLogs = () => console.log(`%c🚀 ${logs.splice(0,logs.length).join(' ')}`, 'color:#888;');
}
